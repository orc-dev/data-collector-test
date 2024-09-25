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
import IntroFinish from './components/sessionUnits/IntroFinish.js';
import Intro from './components/sessionUnits/Intro.js';
import Answer from './components/sessionUnits/Answer.js';
import APInstruction from './components/sessionUnits/APInstruction.js';

function App() {
    const [hasSetup, setHasSetup] = useState(false);

    // const currKey = useRef('APInstruction');
    // const rid = -1;
    // return (<SessionContextProvider>
    //     <MediaToolsContextProvider>
    //         <APInstruction roundId={rid} />
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