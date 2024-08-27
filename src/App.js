import { useState } from 'react';
import { SessionContextProvider } from './contexts/SessionContext';
import SessionSetup from './components/SessionSetup.js';
import SessionRunner from './components/SessionRunner.js';
import './App.css';
import DAInstruction from './components/sessionUnits/DAInstruction.js';

function App() {
    const [hasSetup, setHasSetup] = useState(false);
    return (
        <SessionContextProvider>
            {!hasSetup && <SessionSetup setReady={() => setHasSetup(true)} />}
            { hasSetup && <SessionRunner />}
        </SessionContextProvider>
    );
}
export default App;