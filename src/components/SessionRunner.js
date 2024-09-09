import { useState, useRef, useEffect } from 'react';
import SESSION_FSM from '../fsm/sessionStateMachine.js';
import { useSessionContext } from '../contexts/SessionContext.js';
import { MediaToolsContextProvider } from '../contexts/MediaToolsContext.js';
import { CMD_MANAGER } from '../utils/KeyBindingManager.js';
import AnimationManager from './AnimationManager.js';
import RealTimeDataProcessor from './RealTimeDataProcessor.js';


function TaskDeck() {
    // Contexts, refs, states and constants
    const session = useSessionContext();
    const currKey = useRef('_INIT_');
    const [CurrTask, setCurrTask] = useState(SESSION_FSM._INIT_.self);

    // _INIT_: -3, Intro: -2, Readconj: -1, 0 to 5: conj0 to conj5
    const [roundId, setRoundId] = useState(-3);
    const ridRef = useRef(-3);  // roundId ref, used for handle transition
    const roundAdvanceKeys = ['Intro', 'ReadConjecture', 'SessionFinish'];

    //Transition event handler
    function handleTransition(inputModality) {
        // Input modality check
        if (currKey.current === '_INIT_' && inputModality !== 'button') {
            console.warn('Press the "Start" button to run the session.');
            return;
        }
        if (inputModality === 'gesture') {
            console.log('handleTransition: inputModality = gesture');
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
        CMD_MANAGER.bindKey('t', () => CMD_MANAGER.displayCmd());
        CMD_MANAGER.bindKey('n', () => handleTransition('keyboard'));

        // Setup listener at root level
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
            <RealTimeDataProcessor 
                currKey={currKey} 
                roundId={roundId} 
                onNext={(inputMod) => handleTransition(inputMod)} />
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