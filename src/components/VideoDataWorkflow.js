import { useState, useEffect, useCallback, useRef } from 'react';
import { useMediaToolsContext } from '../contexts/MediaToolsContext';
import { useSessionContext } from '../contexts/SessionContext';
import VideoRecorder from './VideoRecorder';
import VideoDisplayer from './VideoDisplayer';
import { CMD_MANAGER } from '../utils/KeyBindingManager';
import { DrawingUtils, PoseLandmarker, GestureRecognizer
} from '@mediapipe/tasks-vision';


function VideoDataWorkflow({ currKey, roundId }) {
    console.log(`VideoDataWorkflow {${currKey.current}, ${roundId}}`);

    // Contexts, states and refs
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

    const [isVideoReady, setIsVideoReady] = useState(false);
    const [isCanvasReady, setIsCanvasReady] = useState(false);
    const poseResults = useRef([]);
    const handResults = useRef([]);
    const showLandmarks = useRef(false);

    // Callbacks
    const setVideoRef = useCallback((node) => {
        videoRef.current = node;
        setIsVideoReady(!!node);
    }, []);

    const setCanvasRef = useCallback((node) => {
        canvasRef.current = node;
        setIsCanvasReady(!!node);
    }, []);

    const drawLandmarks = useCallback((video, canvas) => {
        const canvasCtx = canvas.getContext('2d');
        const drawingUtils = new DrawingUtils(canvasCtx);
        
        // Setup canvas dimensions and flip horizontally
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvasCtx.translate(canvas.width, 0);
        canvasCtx.scale(-1, 1);
        canvasCtx.save();

        // Clear canvas and draw video image on it
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (!showLandmarks.current) {
            canvasCtx.restore();
            return;
        }
        // Parameters for drawing landmarks
        const hand_links = GestureRecognizer.HAND_CONNECTIONS;
        const pose_links = PoseLandmarker.POSE_CONNECTIONS;
        const hand_style = { color: '#0000FF', lineWidth: 1, radius: 3 };
        const pose_style = { color: '#FF0000', lineWidth: 1, radius: 3 };
        const link_style = { color: '#FFFFFF', lineWidth: 2 }

        for (const landmarks of poseResults.current) {
            drawingUtils.drawConnectors(landmarks, pose_links, link_style);
            drawingUtils.drawLandmarks(landmarks, pose_style);
        }

        for (const landmarks of handResults.current.landmarks) {
            drawingUtils.drawConnectors(landmarks, hand_links, link_style);
            drawingUtils.drawLandmarks(landmarks, hand_style);
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

    // Setup to collect/draw landmarks for each frame
    useEffect(() => {
        if (!isTasksVisionReady || !isVideoReady || !isCanvasReady) {
            return;
        }
        async function collectLandmarks() {
            if (videoRef.current.readyState < 2) {
                return;
            }
            // Collecting results from landmarkers
            const poseOutput = await poseLandmarker.detectForVideo(
                videoRef.current, performance.now()
            );
            const handOutput = await gestureRecognizer.recognizeForVideo(
                videoRef.current, performance.now()
            );
            // Collect landmark-data for current frame
            poseResults.current = poseOutput.landmarks || [],
            handResults.current = handOutput || [],
            // Draw landmarks
            drawLandmarks(videoRef.current, canvasRef.current);

            window.requestAnimationFrame(collectLandmarks);
        };
        videoRef.current.onloadeddata = collectLandmarks;

    }, [isTasksVisionReady, isVideoReady, isCanvasReady]);

    // Bind key for toggle showLandmarks
    useEffect(() => {
        CMD_MANAGER.bindKey('l', () => {
            showLandmarks.current = !showLandmarks.current;
        });
    }, []);

    // Styles
    const VIS_KEYS = ['DirectedAction', 'ActionPrediction'];
    const style = {
        display: VIS_KEYS.includes(currKey.current) ? 'block' : 'none',
        zIndex: 9
    }
    return (
        <div className='ghost-page-main-box' style={style} >
            <VideoDisplayer videoRef={setVideoRef} canvasRef={setCanvasRef} />
            <VideoRecorder 
                videoStream={videoStream} 
                audioStream={audioStream} 
                roundId={roundId} />
        </div>
    );
}

export default VideoDataWorkflow;