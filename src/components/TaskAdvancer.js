import { useState, useRef, useEffect, useCallback } from 'react';
import { useMediaToolsContext } from '../contexts/MediaToolsContext';

function TaskAdvancer({currKey, onNext}) {
    const { 
        gestureRecognizer, 
        isTasksVisionReady,
        videoStream,
        videoRef,
    } = useMediaToolsContext();

    const [isVideoReady, setIsVideoReady] = useState(false);
    //const videoRef = useRef(null);
    const setVideoRef = useCallback((node) => {
        videoRef.current = node;
        setIsVideoReady(!!node);
    }, []);

    // Keep `Left` and `Right`, do not modify the key names [!]
    const gestureRef = useRef({ Left: '?', Right: '?' });
    const startTimeRef = useRef(undefined);
    const THRESHOLD_MS = 2000.0;
    
    // Set video source to stream and start playback when ready
    useEffect(() => {
        if (videoStream && isVideoReady) {
            videoRef.current.srcObject = videoStream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play();
            }
        }
    }, [videoStream, isVideoReady]);

    // Check gesture results, timing Thumb_Up of right-hand
    async function detectHandGestures(timestamp) {
        if (videoRef.current.readyState < 2) {
            return;
        }
        // Get results from MediaPipe
        let results = await gestureRecognizer.recognizeForVideo(
            videoRef.current, performance.now()
        );
        results = results || [];

        // Reset and update hand gestures
        gestureRef.current = { Left: '?', Right: '?' };
        for (const i in results.handednesses) {
            const handness = results.handednesses[i][0].categoryName;
            const gesture  = results.gestures[i][0].categoryName;
            gestureRef.current[handness] = gesture;
        }
        //console.log(gestureRef.current.Right);
        
        // Update and reset timer
        if (gestureRef.current.Right === 'Thumb_Up' && 
            (gestureRef.current.Left === 'None' || gestureRef.current.Left === '?')) {
            startTimeRef.current = startTimeRef.current ?? timestamp;
            
            if ((timestamp - startTimeRef.current) > THRESHOLD_MS) {
                onNext('gesture');
                startTimeRef.current = timestamp;
            }
        } else {
            startTimeRef.current = timestamp;
        }
        // Schedule next frame
        window.requestAnimationFrame(detectHandGestures);
    };

    useEffect(() => {
        if (isTasksVisionReady && isVideoReady) {
            videoRef.current.onloadeddata = detectHandGestures;
        }
    }, [isTasksVisionReady, isVideoReady]);
    // eslint-disable-next-line

    // Return an empty video element
    return <video ref={setVideoRef} style={{display: 'none'}} playsInline />;
}

export default TaskAdvancer;