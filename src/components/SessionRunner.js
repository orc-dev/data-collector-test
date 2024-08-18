import { useState, useRef, useEffect, useMemo } from 'react';
import SESSION_FSM from '../fsm/sessionStateMachine.js';
import { useSessionContext } from '../contexts/SessionContext.js';
import { MediaToolsContextProvider } from '../contexts/MediaToolsContext.js';
import { CMD_MANAGER } from '../utils/KeyBindingManager.js';
import AnimationManager from './AnimationManager.js';
import VideoDataWorkflow from './VideoDataWorkflow.js';


function TaskDeck() {
    // Contexts, refs, states and constants
    const session = useSessionContext();
    const currKey = useRef('_INIT_');
    const [CurrTask, setCurrTask] = useState(SESSION_FSM._INIT_.self);
    const [roundId, setRoundId] = useState(-2);
    const ridRef = useRef(-2);  // roundId ref, used for handle transition
    const roundAdvanceKeys = useMemo(() =>
        ['Intro', 'ReadConjecture', 'SessionFinish'], []);

    //Transition event handler
    function handleTransition(inputModality) {
        // Input modality check
        if (currKey.current === '_INIT_' && inputModality !== 'button') {
            console.log('Press "Start" to run the session.');
            return;
        }
        const nextKey = SESSION_FSM[currKey.current].next(session, ridRef);
        // Terminal check
        if (nextKey === null) {
            console.log('Experiment session Finishes.');
            return;
        }
        // Round-index advance check
        if (roundAdvanceKeys.includes(nextKey)) {
            setRoundId(i => i + 1);
            ridRef.current += 1;
        }
        // Update current key and task component
        currKey.current = nextKey;
        setCurrTask(SESSION_FSM[nextKey].self);
    }

    // Load command manager (global key-event-register/handler)
    useEffect(() => {
        CMD_MANAGER.bindKey('t', () => console.log('CMD testing!'));
        CMD_MANAGER.bindKey('n', () => handleTransition('keyboard'));
        CMD_MANAGER.setupListener();
        return () => {
            console.log('CMD_MANAGER is removed.');
            CMD_MANAGER.removeListener();
        }
    }, []);

    return (
        <div className='session-main-box'>
            <CurrTask roundId={roundId} onNext={handleTransition} />
            <AnimationManager currKey={currKey} roundId={roundId} />
            <VideoDataWorkflow currKey={currKey} roundId={roundId} />
        </div>
    );
}

function SessionRunner() {
    return (
        <MediaToolsContextProvider>
            <TaskDeck />
        </MediaToolsContextProvider>
    );
}
export default SessionRunner;