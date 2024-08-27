import { useState, useEffect, useCallback, useRef } from 'react';
import { DrawingUtils, PoseLandmarker, GestureRecognizer } from '@mediapipe/tasks-vision';
import { useMediaToolsContext } from '../contexts/MediaToolsContext.js';
import { useSessionContext } from '../contexts/SessionContext.js';
import VideoRecorder from './VideoRecorder.js';
import LandmarkCsvWriter from './LandmarkCsvWriter.js';
import VideoDisplayer from './VideoDisplayer.js';
import { CMD_MANAGER } from '../utils/KeyBindingManager.js';
import { getPoseSlice, getHandSlice } from '../constants/landmarkMeta.js';
import GoNextProgressBar, { PROGRESS_ACTIVATE_MS } from './GoNextProgressBar.js';


function RealTimeDataProcessor({ currKey, roundId, onNext }) {
    console.log(`VideoDataWorkflow {${currKey.current}, ${roundId}}`);

    // Session and meida contexts
    const session = useSessionContext();
    const { 
        poseLandmarker, 
        gestureRecognizer, 
        isTasksVisionReady,
        videoStream,
        audioStream,
        videoRef,
        canvasRef,
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
    
    // Landmark drawing flag
    const showLandmarks = useRef(false);

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
    const roundKey = useRef('-2');

    // Computational frame rate controls
    const COMPUTATION_COOLDOWN = 90.0;  // Make FPS is about 10
    const lastComputeTime = useRef(0);
    const runRealTimeAnalysis = useRef(true);

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
        const elbowY = Number(record.P13_y);
        const wristY = Number(record.P15_y);
        return (wristY === -1) || (wristY > elbowY);
    }, []);

    // Draw current frame and the optional landmarks
    const drawFrameWithLandmarkOpt = useCallback((video, canvas) => {
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
        for (const landmark of poseResults.current?.landmarks) {
            brush.drawConnectors(landmark, conns.pose, style.edge);
            brush.drawLandmarks(landmark, style.pose);
        }
        for (const landmark of handResults.current?.landmarks) {
            brush.drawConnectors(landmark, conns.hand, style.edge);
            brush.drawLandmarks(landmark, style.hand);
        }
        canvasCtx.restore();
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
        
        // [!] Note: this function cannot access the updated `roundId`
        async function realTimeAnalysisLoop(timestamp) {
            // Terminal check
            if (currKey.current === 'SessionFinish') {
                goNextTmr.current = 0;
                goNextRef.current.triggerRender();
                console.log('realTimeAnalysisLoop breaks.');
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
            // T0. Draw current frame (and landmarks if flag is set) ::::::::::
            drawFrameWithLandmarkOpt(videoRef.current, canvasRef.current);

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
            
            // T4. Pose Matching ::::::::::::::::::::::::::::::::::::::::::::::
            if (currKey.current === 'DirectedAction') {

            }

            // T5. AP screenshot?

            
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

    // Bind key commands
    useEffect(() => {
        CMD_MANAGER.bindKey('l', () => {
            showLandmarks.current = !showLandmarks.current;
        });
        CMD_MANAGER.bindKey('d', () => {
            runRealTimeAnalysis.current = !runRealTimeAnalysis.current;
        })
    }, []);

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
        </div>
        <GoNextProgressBar ref={goNextRef} timer={goNextTmr} onNext={onNext} />
    </>);
}

export default RealTimeDataProcessor;