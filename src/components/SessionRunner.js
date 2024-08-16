import { useState, useRef, useEffect } from 'react';
import SESSION_FSM from '../fsm/sessionStateMachine.js';
import { useSessionContext } from '../contexts/SessionContext.js';
import { MediaToolsContextProvider } from '../contexts/MediaToolsContext.js';
import { CMD_MANAGER } from '../utils/KeyBindingManager.js';
import AnimationManager from './AnimationManager.js';
import TaskAdvancer from './TaskAdvancer.js';


function TaskDeck() {
    // Hooks of context, ref and state
    const session = useSessionContext();
    const currKey = useRef('_INIT_');
    const [CurrTask, setCurrTask] = useState(SESSION_FSM._INIT_.self);
    const [roundId, setRoundId] = useState(0);
    const ridRef = useRef(0);  // roundId ref, used for handle transition

    //Transition event handler
    function handleTransition(inputModality) {
        // Input modality controls
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
        // Continue new conjecture check
        if (currKey.current === 'Proof') {
            setRoundId(i => i + 1);
            ridRef.current += 1;
        }
        // Update current key and task component
        currKey.current = nextKey;
        setCurrTask(SESSION_FSM[nextKey].self);
    }

    // Load command manager (a global key-event-register/handler)
    useEffect(() => {
        CMD_MANAGER.bindKey('t', () => console.log('CMD testing!'));
        CMD_MANAGER.bindKey('n', () => handleTransition('keyboard'));
        CMD_MANAGER.setupListener();
        return () => CMD_MANAGER.removeListener();
    }, []);

    return (
        <div className='session-main-box'>
            <CurrTask roundId={roundId} onNext={handleTransition} />
            <AnimationManager currKey={currKey} roundId={roundId} />
            {/* <TaskAdvancer currKey={currKey} onNext={handleTransition} /> */}
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