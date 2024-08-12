import { useState, useRef, useEffect } from 'react';
import SESSION_FSM from '../fsm/sessionStateMachine.js';
import { useSessionContext } from '../contexts/SessionContext.js';
import { MediaToolsContextProvider } from '../contexts/MediaToolsContext.js';
import TaskAdvancer from './TaskAdvancer.js';

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


function SessionTask() {
    // Hooks of context, ref and state
    const { metadata, runtime } = useSessionContext();
    const currKey = useRef('_INIT_');
    const [CurrComp, setCurrComp] = useState(SESSION_FSM._INIT_.self);
    
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

    // 
    const handleTransition = () => {
        const nextKey = SESSION_FSM[currKey.current].next(metadata, runtime);
        if (nextKey === null) {
            console.log('Experiment terminates.');
            return;
        }
        setCurrComp(SESSION_FSM[nextKey].self);
        
        if (currKey.current === 'FinalAnswer') {
            runtime.current.currRound += 1;
        }
        currKey.current = nextKey;
    }

    return (
        <div className='session-main-box'>
            <CurrComp handleTransition={handleTransition} />
            <TaskAdvancer currKey={currKey} onNext={handleTransition} />
        </div>
    );
}

function SessionRunner() {
    return (
        <MediaToolsContextProvider>
            <SessionTask />
        </MediaToolsContextProvider>
    );
}
export default SessionRunner;