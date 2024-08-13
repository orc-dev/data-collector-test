import { useState, useRef, useEffect } from 'react';
import SESSION_FSM from '../fsm/sessionStateMachine.js';
import { useSessionContext } from '../contexts/SessionContext.js';
import { MediaToolsContextProvider } from '../contexts/MediaToolsContext.js';
import TaskAdvancer from './TaskAdvancer.js';


const KEY_ACTION_LIST = {
    't': () => console.log(`Key action testing.`),
};


function SessionTask() {
    // Hooks of context, ref and state
    const { metadata, runtime } = useSessionContext();
    const currKey = useRef('_INIT_');
    const [CurrComp, setCurrComp] = useState(SESSION_FSM._INIT_.self);
    
    // Global key event handler
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key in KEY_ACTION_LIST) {
                KEY_ACTION_LIST[event.key]();
            } else {
                console.log(`'${event.key}' is not a valid command.`);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        // Cleanup function
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Transition event handler
    const handleTransition = () => {
        const nextKey = SESSION_FSM[currKey.current].next(metadata, runtime);
        // Terminal check
        if (nextKey === null) {
            console.log('Experiment session Finishes.');
            return;
        }
        // Continue new conjecture check
        if (currKey.current === 'Proof') {
            runtime.current.currRound += 1;
        }
        // Update current key and component
        currKey.current = nextKey;
        setCurrComp(SESSION_FSM[nextKey].self);
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