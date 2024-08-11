import { useState, useRef, useEffect, useCallback } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import SESSION_FSM from '../fsm/sessionStateMachine.js';
import { useSessionContext } from '../contexts/SessionContext.js';
import { ApplicationContextProvider } from '../contexts/ApplicationContext.js';
import { useApplicationContext } from '../contexts/ApplicationContext.js';


function SessionRunner() {
    return (
        <ApplicationContextProvider>
            <SessionTask />
        </ApplicationContextProvider>
    );
}

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
 * Right-hand-'Thumb_up' timer.
 */
function HiddenTimer({gestResults, onNext}) {
    const [gestures, setGestures] = useState({ Left: '?', Right: '?' });
    const [thumbUpRTimer, setThumbUpRTimer] = useState(0.0);
    const THRESHOLD = 2.0;
    
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
        if (gestures.Right === 'Thumb_Up') {
            setThumbUpRTimer(acc => acc += delta);
            if (thumbUpRTimer > THRESHOLD) {
                console.log(`Trigger OnNext()! from HiddenTimer`);
                onNext();
                setThumbUpRTimer(0.0);
            }
        }
        else {
            setThumbUpRTimer(0.0);
        }
    });
    return <group/>;
}

function GoNextListener({gestResults, setVideoRef, onNext}) {
    if (!gestResults) {
        return (<div></div>);
    }

    return (
        <div>
            <Canvas>
                <HiddenTimer gestResults={gestResults} onNext={onNext}/>
            </Canvas>
            <video ref={setVideoRef} style={{ display: 'none' }} playsInline />
        </div>
    );
}


function SessionTask() {
    // Hooks of context, ref and state
    const { metadata, runtime } = useSessionContext();
    const { 
        gestureRecognizer, 
        isTasksVisionReady,
        videoStream,
    } = useApplicationContext();
    const videoRef = useRef(null);
    const [isVideoReady, setIsVideoReady] = useState(false);

    const currKey = useRef('_INIT_');
    const [CurrComp, setCurrComp] = useState(SESSION_FSM._INIT_.self);
    const [roundIdx, setRoundIdx] = useState(0);
    const [gestResults, setGestResults] = useState([]);
    
    const setVideoRef = useCallback((node) => {
        videoRef.current = node;
        setIsVideoReady(!!node);
    }, []);

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

    const handleTransition = () => {
        const nextKey = SESSION_FSM[currKey.current].next(metadata, runtime);
        if (nextKey === null) {
            console.log('Experiment terminates.');
            return;
        }
        setCurrComp(SESSION_FSM[nextKey].self);
        if (currKey.current === 'FinalAnswer') {
            setRoundIdx(i => i + 1);
            runtime.current.currRound += 1;
        }
        currKey.current = nextKey;
    }

    return (
        <ApplicationContextProvider>
            <CurrComp handleTransition={handleTransition} />
            <GestureIndicator gestResults={gestResults}/>
            <GoNextListener gestResults={gestResults} setVideoRef={setVideoRef} onNext={handleTransition}/>
        </ApplicationContextProvider>
    );
    // return (
    //     <div className='app'>
    //         <SessionSetup />
    //         {/* <DAUnit conjId={shuffled_seq[seqId]} />

    //         <GestureIndicator gestResults={gestResults} />

    //         <GoNextListener gestResults={gestResults}/>
    //         <video ref={setVideoRef} style={{ display: 'none' }} playsInline /> */}
    //     </div>
    // );
}
export default SessionRunner;