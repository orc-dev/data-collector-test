import { useSessionContext } from "../contexts/SessionContext";
import { CONJECTURE_LIST } from '../constants/conjectures.js';
import { TekContextProvider } from '../contexts/TekContext.js';
import DefaultScene from '../scenes/DefaultScene.js';
import Tek from '../avatars/Tek.js';
import TaskTester from "./TaskTester";
import '../styles/directed-action.css';


function ConjectureBox({ cid }) {
    return (
        <div className='conj-box'>
            <p className='conj-text'>
                {/* <span style={{color: '#ebb734'}}>Statement: </span> */}
                {CONJECTURE_LIST[cid].text}
            </p>
        </div>
    );
}

function AnimationBox({ cid }) {
    return (
        <div className='animation-box'>
            <TekContextProvider>
                <DefaultScene>
                    <Tek conjId={ cid }/>
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

function PromptBox({ cid }) {
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

function DirectedAction() {
    const { metadata, runtime } = useSessionContext();
    const cid = metadata.current.shuffledIndex[runtime.current.currRound];
    return (
        <div className='da-unit'>
            <div className='conj-loc-box'>
                <ConjectureBox cid={cid} />
            </div>
            <div className='horizontal-boxes'>
                <AnimationBox cid={cid} />
                <LiveVideoBox />
                {/* <PromptBox cid={cid} /> */}
            </div>
        </div>
    );
}
export default DirectedAction;