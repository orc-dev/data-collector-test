import { useEffect } from 'react';
import { CONJECTURE_LIST } from '../constants/conjectures.js';
import { TekContextProvider } from '../contexts/TekContext.js';
import DefaultScene from '../scenes/DefaultScene.js';
import Tek from '../avatars/Tek.js';
import TaskTester from "./TaskTester";
import '../styles/DAUnit.css';

console.log(`hello from DAunit.js`);
console.log(CONJECTURE_LIST);

function ConjectureBox({ conjId }) {
    return (
        <div className='conj-box'>
            <p className='conj-text'>
                {/* <span style={{color: '#ebb734'}}>Statement: </span> */}
                {CONJECTURE_LIST[conjId].text}
            </p>
        </div>
    );
}

function AnimationBox({ conjId }) {
    return (
        <div className='animation-box'>
            <TekContextProvider>
                <DefaultScene>
                    <Tek conjId={ conjId }/>
                </DefaultScene>
            </TekContextProvider>
        </div>
    );
}

function LiveVideoBox() {
    return (
        <div className='live-video-box'>
            <TaskTester />
        </div>
    );
}

function PromptBox({ conjId }) {
    const msg = `Hello, Prompt box testing message. 
        We are on the ${conjId}-th conjecture: )`;
    return (
        <div className='prompt-box'>
            <div className='prompt-canvas'>
                <p className='prompt-message'>{msg}</p>
            </div>
        </div>
    );
}

function DAUnit({ conjId }) {
    return (
        <div className='da-unit'>
            <div className='conj-loc-box'>
                <ConjectureBox conjId={conjId} />
            </div>
            <div className='horizontal-boxes'>
                <AnimationBox conjId={conjId} />
                <LiveVideoBox />
                {/* <PromptBox conjId={conjId} /> */}
            </div>
        </div>
    );
}
export default DAUnit;
