import { useState, useRef } from 'react';
import { SessionContextProvider } from './contexts/SessionContext';
import SessionSetup from './components/SessionSetup.js';
import SessionRunner from './components/SessionRunner.js';
import './App.css';
import DirectedAction from './components/sessionUnits/DirectedAction.js';
import { MediaToolsContextProvider } from './contexts/MediaToolsContext.js';
import AnimationManager from './components/AnimationManager.js';
import RealTimeDataProcessor from './components/RealTimeDataProcessor.js';

import SelfExplanation from './components/sessionUnits/SelfExplanation.js';

function App() {
    const [hasSetup, setHasSetup] = useState(false);

    // const currKey = useRef('DirectedAction');
    // const rid = 2;
    // return (<SessionContextProvider>
    //     <MediaToolsContextProvider>
    //         <DirectedAction roundId={rid} />
    //         <AnimationManager currKey={currKey} roundId={rid} />
    //         <RealTimeDataProcessor 
    //             currKey={currKey} 
    //             roundId={rid} 
    //             onNext={(inputMod) => handleTransition(inputMod)} />
    //     </MediaToolsContextProvider>
    // </SessionContextProvider>);


    return (
        <SessionContextProvider>
            {!hasSetup && <SessionSetup setReady={() => setHasSetup(true)} />}
            { hasSetup && <SessionRunner />}
        </SessionContextProvider>
    );
}
export default App;