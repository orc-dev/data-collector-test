import { useState } from 'react';
import { SessionContextProvider } from './contexts/SessionContext';
import SessionSetup from './components/SessionSetup.js';
import SessionRunner from './components/SessionRunner.js';

function App() {
    const [hasSetup, setHasSetup] = useState(false);
    function onComplete() {
        setHasSetup(true);
    }
    return (
        <SessionContextProvider>
            {!hasSetup && <SessionSetup onComplete={onComplete} />}
            { hasSetup && <SessionRunner />}
        </SessionContextProvider>
    );
}
export default App;