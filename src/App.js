import { useState, useRef, useEffect, useCallback } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import { useApplicationContext } from './contexts/ApplicationContext.js';
import DAUnit from './components/DAUnit.js';
import SessionSetup from './components/SessionSetup.js';
import './App.css';


function handleKeyboardEvent(key) {
    switch(key) {
        case 'a': {
            console.log(`executing command '${key}'`);
            break;
        };
        default:
            return;
    }
}

const GestureIndicator = ({gestResults}) => {
    const [gestures, setGestures] = useState({ Left: '?', Right: '?' });
    
    useEffect(() => {
        setGestures({ Left: '?', Right: '?' });  // Reset
        // Update
        for (const i in gestResults.handednesses) {
            const handness = gestResults.handednesses[i][0].categoryName;
            const gesture  = gestResults.gestures[i][0].categoryName;
            setGestures(prev => ({
                ...prev,
                [handness]: gesture
            }));
        }
    }, [gestResults]);

    return (
        <div className='hand-gesture-box'>
            <h3 className='hand-gesture-text'>
                <span style={{color: '#a2bae0'}}>{`Left: `}</span>
                <span>{`${gestures.Left}`}</span>
                <span style={{color: '#a2bae0'}}>{` -- `}</span>
                <span style={{color: '#a2bae0'}}>{`Right: `}</span>
                <span>{`${gestures.Right}`}</span>
            </h3>
        </div>
    );
}


/**
 * Right-hand-'victory' timer.
 */
function HiddenTimer({gestResults}) {
    const [gestures, setGestures] = useState({ Left: '?', Right: '?' });
    const [rVictoryTimer, setRVictoryTimer] = useState(0.0);
    const R_VIC_THRESHOLD = 2.0;
    
    // Update/reset current hand gestures
    useEffect(() => {
        setGestures({ Left: '?', Right: '?' });  // Reset
        // Update
        for (const i in gestResults.handednesses) {
            const handness = gestResults.handednesses[i][0].categoryName;
            const gesture  = gestResults.gestures[i][0].categoryName;
            setGestures(prev => ({
                ...prev,
                [handness]: gesture
            }));
        }
    }, [gestResults]);

    // Update timer
    useFrame((state, delta) => {
        //console.log(`Hidden Timer says: delta = ${delta}`);
        if (gestures.Right === 'Victory') {
            setRVictoryTimer(acc => acc += delta);
            if (rVictoryTimer > R_VIC_THRESHOLD) {
                console.log(`Go Next! detected!`);
                setRVictoryTimer(0.0);
            }
        }
        else {
            setRVictoryTimer(0.0);
        }
    });
    return <group/>;
}

function GoNextListener({gestResults}) {
    return <Canvas><HiddenTimer gestResults={gestResults}/></Canvas>
}


function App() {
    const { 
        gestureRecognizer, 
        isTasksVisionReady,
        videoStream,
    } = useApplicationContext();

    // Hooks for video, canvas and results
    const videoRef = useRef(null);
    const [isVideoReady, setIsVideoReady] = useState(false);
    
    const setVideoRef = useCallback((node) => {
        videoRef.current = node;
        setIsVideoReady(!!node);
    }, []);

    const [gestResults, setGestResults] = useState([]);

    // Update: video stream -> video source
    useEffect(() => {
        if (videoStream && isVideoReady) {
            videoRef.current.srcObject = videoStream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play();
            }
        }
    }, [videoStream, isVideoReady]);

    // Init: starts data collecting loop
    useEffect(() => {
        if (!isTasksVisionReady || !isVideoReady) {
            return;
        }
        const video = videoRef.current;
        async function collectLandmarks() {
            if (video.readyState < 2) {
                return;
            }
            const gestOutput = await gestureRecognizer.recognizeForVideo(
                video, performance.now()
            );
            // Store the updated results to this component
            setGestResults(gestOutput || []);
            window.requestAnimationFrame(collectLandmarks);
        };
        video.onloadeddata = collectLandmarks;
    // eslint-disable-next-line
    }, [isTasksVisionReady, isVideoReady]);

    
    // Global key event handler
    useEffect(() => {
        const handleKeyDown = (event) => {
            console.log(`'${event.key}' is pressed!`);
            handleKeyboardEvent(event.key);
        };
        window.addEventListener('keydown', handleKeyDown);
        // Cleanup function
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    
    return (
        <div className='app'>
            <SessionSetup />
            {/* <DAUnit conjId={shuffled_seq[seqId]} />

            <GestureIndicator gestResults={gestResults} />

            <GoNextListener gestResults={gestResults}/>
            <video ref={setVideoRef} style={{ display: 'none' }} playsInline /> */}
        </div>
    );
}
export default App;