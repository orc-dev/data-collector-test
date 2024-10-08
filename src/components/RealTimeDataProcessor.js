import { useState, useEffect, useCallback, useRef } from 'react';
import { DrawingUtils, PoseLandmarker, GestureRecognizer } from '@mediapipe/tasks-vision';
import { useMediaToolsContext } from '../contexts/MediaToolsContext.js';
import VideoRecorder from './VideoRecorder.js';
import LandmarkCsvWriter from './LandmarkCsvWriter.js';
import VideoDisplayer from './VideoDisplayer.js';
import TimePointWriter from './TimePointWriter.js';
import FootBox from './elementsUI/FootBox.js';
import { CMD_MANAGER } from '../utils/KeyBindingManager.js';
import { getPoseSlice, getHandSlice } from '../constants/landmarkMeta.js';
import GoNextProgressBar, { PROGRESS_ACTIVATE_MS } from './GoNextProgressBar.js';
import { drawScanningBox, drawSkeletons } from '../utils/drawingTools.js';
import { isMatch } from '../utils/poseMatchingChecker.js';


function RealTimeDataProcessor({ currKey, roundId, onNext }) {
    // Meida contexts
    const { 
        poseLandmarker, 
        gestureRecognizer, 
        isTasksVisionReady,
        videoStream,
        audioStream,
        videoRef,
        canvasRef,
        analyserNodeRef,
        audioVisRef,
        pauseRef,
        poseKey,
    } = useMediaToolsContext();

    
    // Video and canvas ready flags
    const [isVideoReady,  setIsVideoReady ] = useState(false);
    const [isCanvasReady, setIsCanvasReady] = useState(false);

    const setVideoRef = useCallback((node) => {
        videoRef.current = node;
        setIsVideoReady(!!node);
    }, []);

    const setCanvasRef = useCallback((node) => {
        canvasRef.current = node;
        setIsCanvasReady(!!node);
    }, []);

    const setAudioVisRef = useCallback((node) => {
        audioVisRef.current = node;
        setIsCanvasReady(!!node);
    }, []);

    // Landmark drawing flag
    const showLandmarks = useRef(true);
    const drawingBuffer = useRef(undefined);

    // Landmark results (per computation frame)
    const poseResults = useRef([]);
    const handResults = useRef([]);

    // Landmark csv buffer
    const csvBuf = useRef({
        '-1': [], // buffer slot for intro section
         '0': [], 
         '1': [], 
         '2': [], 
         '3': [], 
         '4': [], 
         '5': [],
    });
    const roundKey = useRef('-3');

    // Computational frame rate controls
    const COMPUTATION_COOLDOWN = 90.0;  // Make FPS is about 10
    const lastComputeTime = useRef(0);
    const runRealTimeAnalysis = useRef(true);

    // Mathcing timer
    const poseMatchTmr = useRef(0);

    // Go-next listener
    const goNextRef = useRef();
    const goNextTmr = useRef(0);
    const toleranceCount = useRef(3);
    const goNextChecker = useCallback((record) => {
        // Right-hand gesture must be 'Thumb_up')
        if (record.GR !== 'Thumb_Up') {
            return false;
        }
        // Left wrist should not higher than left elbow
        const wristY = Number(record.L0_y);
        const wristX = Number(record.R0_x);
        const shldrX = Number(record.P12_x);

        return ((wristY === -1) || (wristY > 0.75)) && (wristX > shldrX);
    }, []);

    // Draw current frame and landmarks (optional)
    const drawFrameWithOptLandmarks = useCallback((video, canvas) => {
        const canvasCtx = canvas.getContext('2d');
        const brush = new DrawingUtils(canvasCtx);
        
        // Setup canvas dimensions and flip horizontally
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvasCtx.translate(canvas.width, 0);
        canvasCtx.scale(-1, 1);
        canvasCtx.save();

        // Clear canvas and draw video frame
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (!showLandmarks.current) {
            canvasCtx.restore();
            return;
        }
        const conns = {
            pose: PoseLandmarker.POSE_CONNECTIONS,
            hand: GestureRecognizer.HAND_CONNECTIONS,
        }
        const style = {
            pose: { color: '#FF0000', lineWidth: 1, radius: 3 },
            hand: { color: '#0000FF', lineWidth: 1, radius: 3 },
            edge: { color: '#FFFFFF', lineWidth: 2 },
        };

        for (const landmark of poseResults.current?.landmarks ?? []) {
            brush.drawConnectors(landmark, conns.pose, style.edge);
            brush.drawLandmarks(landmark, style.pose);
        }
        for (const landmark of handResults.current?.landmarks ?? []) {
            brush.drawConnectors(landmark, conns.hand, style.edge);
            brush.drawLandmarks(landmark, style.hand);
        }
        canvasCtx.restore();
    }, []);


    const drawFrameWithSkeletons = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Setup canvas dimensions and flip horizontally
        const [W, H] = [video.videoWidth, video.videoHeight];
        canvas.width = W;
        canvas.height = H;
        ctx.translate(W, 0);
        ctx.scale(-1, 1);
        ctx.save();

        // Clear canvas and draw video frame
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(video, 0, 0, W, H);

        // Draw skeletons
        if (showLandmarks.current && drawingBuffer.current) {
            drawSkeletons(W, H, ctx, drawingBuffer.current);
        }
        // Draw matching scanning
        if (poseMatchTmr.current)
            drawScanningBox(W, H, ctx, poseMatchTmr.current / 1000);
        ctx.restore();
    }, []);


    const drawAudioFrequencyBars = useCallback(() => {
        if (!analyserNodeRef.current) {
            return;
        }
        // Create buffer to store analyzed frequency data
        const bufferLength = analyserNodeRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserNodeRef.current.getByteFrequencyData(dataArray);

        // Setup canvas
        const canvas = audioVisRef.current;
        const ctx = canvas.getContext('2d');

        // Adjust canvas to align with the device pixel ratio
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width  = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        // Drawing cleanup
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        
        // Geometric parameters
        const MIN_HALF_BAR_HEIGHT = 1;
        const scale = (canvas.height / 255) * 0.35;
        const midX = rect.width * 0.5;
        const midY = rect.height * 0.5;
        const barX = Math.ceil((midX / bufferLength) * 0.5) + 1;
        const BASE = (rect.width - barX) / 2;
        
        let barY = MIN_HALF_BAR_HEIGHT;
        let dx = 0;

        // Loop through the dataArray to draw each bar
        for (let i = 0; i < bufferLength; i++) {
            // Compute the bar height and the color
            barY = Math.max(dataArray[i] * scale, MIN_HALF_BAR_HEIGHT);
            ctx.fillStyle = `rgba(100, 173, 181, ${(midX - dx) / midX})`;

            ctx.fillRect(BASE + dx, midY - (barY / 2), barX, barY);
            ctx.fillRect(BASE - dx, midY - (barY / 2), barX, barY);
            dx += barX + 2;
        }
        ctx.restore();
    }, []);

    // Sync video stream with video element and auto-play on ready
    useEffect(() => {
        if (videoStream && isVideoReady) {
            videoRef.current.srcObject = videoStream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play();
            }
        }
    }, [videoStream, isVideoReady]);

    // Launch the real-time analysis loop once the Media settings are ready.
    useEffect(() => {
        if (!isTasksVisionReady || !isVideoReady || !isCanvasReady) {
            return;
        }
        
        // [!] Note: this function cannot access the updated `useState` values
        async function realTimeAnalysisLoop(timestamp) {
            // Terminal check
            if (currKey.current === 'SessionFinish') {
                goNextTmr.current = 0;
                goNextRef.current.triggerRender();
                return;
            }
            // Pre-start check
            if (currKey.current === '_INIT_') {
                window.requestAnimationFrame(realTimeAnalysisLoop);
                return;
            }
            // Video ready check
            if (videoRef.current.readyState < 2) {
                window.requestAnimationFrame(realTimeAnalysisLoop);
                return;
            }
            // T0. Canvas updates :::::::::::::::::::::::::::::::::::::::::::::
            drawFrameWithSkeletons();  // Current camera frame and skeleton
            drawAudioFrequencyBars();  // Sound-wave effect
            
            // DEBUG-control: toggle running/pausing of the computation
            if (!runRealTimeAnalysis.current) {
                window.requestAnimationFrame(realTimeAnalysisLoop);
                return;
            }
            // Compution cooldown check
            const delta = timestamp - lastComputeTime.current;
            if (delta < COMPUTATION_COOLDOWN) {
                window.requestAnimationFrame(realTimeAnalysisLoop);
                return;
            }
            // Update the timestamp of current computation
            lastComputeTime.current = timestamp;

            // T1. Compute landmarks for current frame ::::::::::::::::::::::::
            const poseOutput = await poseLandmarker.detectForVideo(
                videoRef.current, timestamp);

            const handOutput = await gestureRecognizer.recognizeForVideo(
                videoRef.current, timestamp);

            poseResults.current = poseOutput ?? [];
            handResults.current = handOutput ?? [];
            
            // T2. Write data to the csv buffer :::::::::::::::::::::::::::::::
            const currRecord = {
                'time': timestamp,
                ...getPoseSlice(poseResults.current),
                ...getHandSlice(handResults.current),
            }
            drawingBuffer.current = currRecord;

            if (roundKey.current in csvBuf.current) {
                csvBuf.current[roundKey.current].push(currRecord);
            }
            
            // T3. Update the Go-next Timer :::::::::::::::::::::::::::::::::::
            const isValid = goNextChecker(currRecord);
            goNextTmr.current += Math.min(delta, 64);

            // Refill tolerance count
            if (isValid) {
                toleranceCount.current = 3;
            }

            if (goNextTmr.current > PROGRESS_ACTIVATE_MS) {
                // Decrement tolerance count, reset timer
                if (!isValid) {
                    if (toleranceCount.current > 0) {
                        toleranceCount.current--;
                        goNextTmr.current -= 1 + Math.min(delta, 64);
                    } else {
                        goNextTmr.current = 0;
                    }
                }
                // Force to render the progress-bar
                goNextRef.current.triggerRender();
            }
            else if (!isValid) {
                goNextTmr.current = Math.min(goNextTmr.current, 0);
            }
            
            // T4. Update Pose Matching Timer :::::::::::::::::::::::::::::::::
            if (currKey.current === 'DirectedAction' && poseKey.current) {
                if (isMatch(poseKey.current, currRecord)) {
                    poseMatchTmr.current += Math.max(delta, 32);
                        
                    if (poseMatchTmr.current >= 1200) {
                        poseKey.current = null;
                        pauseRef.current = false;
                        poseMatchTmr.current = 0;
                    }
                } else {
                     poseMatchTmr.current = Math.max(0, 
                        poseMatchTmr.current - delta
                    );
                }
            }
            // Schedule it for next frame
            window.requestAnimationFrame(realTimeAnalysisLoop);
        };
        // Starts the real-time analysis loop
        videoRef.current.onloadeddata = function() {
            window.requestAnimationFrame(realTimeAnalysisLoop);
        }
    }, [isTasksVisionReady, isVideoReady, isCanvasReady]);

    // Update the buffer key for each round
    useEffect(() => {
        roundKey.current = roundId.toString();
    }, [roundId])

    // Debug: Bind key commands
    // useEffect(() => {
    //     CMD_MANAGER.bindKey('l', () => {
    //         showLandmarks.current = !showLandmarks.current;
    //     });
    //     CMD_MANAGER.bindKey('d', () => {
    //         runRealTimeAnalysis.current = !runRealTimeAnalysis.current;
    //     });
    // }, []);

    // Styles
    const VIS_KEYS = ['DirectedAction', 'ActionPrediction'];
    const style = {
        display: VIS_KEYS.includes(currKey.current) ? 'block' : 'none',
        zIndex: 9
    }

    return (<>
        <div className='ghost-page-main-box' style={style} >
            <VideoDisplayer videoRef={setVideoRef} canvasRef={setCanvasRef} />
            <VideoRecorder 
                videoStream={videoStream}
                audioStream={audioStream}
                roundId={roundId} />
            <LandmarkCsvWriter csvBuf={csvBuf} roundId={roundId} />
            <TimePointWriter roundId={roundId} />
        </div>
        <FootBox canvasRef={setAudioVisRef} roundId={roundId} />
        <GoNextProgressBar ref={goNextRef} timer={goNextTmr} onNext={onNext} />
    </>);
}

export default RealTimeDataProcessor;