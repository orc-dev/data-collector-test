import { useState } from 'react';
import { SessionContextProvider } from './contexts/SessionContext';
import SessionSetup from './components/SessionSetup.js';
import SessionRunner from './components/SessionRunner.js';
import DirectedAction from './components/DirectedAction.js';
import { MediaToolsContextProvider } from './contexts/MediaToolsContext.js';

function App() {
    const [hasSetup, setHasSetup] = useState(false);
    function onComplete() {
        setHasSetup(true);
    }
    return (
        <SessionContextProvider>
            {/* {!hasSetup && <SessionSetup onComplete={onComplete} />}
            { hasSetup && <SessionRunner />} */}
            <MediaToolsContextProvider children={<DirectedAction />} />
            
        </SessionContextProvider>
    );
}
export default App;