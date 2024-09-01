import { useState, useRef } from 'react';
import { SessionContextProvider } from './contexts/SessionContext';
import SessionSetup from './components/SessionSetup.js';
import SessionRunner from './components/SessionRunner.js';
import './App.css';
import DirectedAction from './components/sessionUnits/DirectedAction.js';
import { MediaToolsContextProvider } from './contexts/MediaToolsContext.js';
import AnimationManager from './components/AnimationManager.js';
import RealTimeDataProcessor from './components/RealTimeDataProcessor.js';


function App() {
    const [hasSetup, setHasSetup] = useState(false);

    const currKey = useRef('DirectedAction');

    return (<SessionContextProvider>
        <MediaToolsContextProvider>
            <DirectedAction roundId={0} />
            <AnimationManager currKey={currKey} roundId={0} />
            <RealTimeDataProcessor 
                currKey={currKey} 
                roundId={0} 
                onNext={(inputMod) => handleTransition(inputMod)} />
        </MediaToolsContextProvider>
    </SessionContextProvider>);


    // return (
    //     <SessionContextProvider>
    //         {!hasSetup && <SessionSetup setReady={() => setHasSetup(true)} />}
    //         { hasSetup && <SessionRunner />}
    //     </SessionContextProvider>
    // );
}
export default App;