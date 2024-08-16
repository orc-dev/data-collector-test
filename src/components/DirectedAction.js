import { useSessionContext } from "../contexts/SessionContext";
import { CONJECTURE_LIST } from '../constants/conjectures.js';
import { TekContextProvider } from '../contexts/TekContext.js';
import DefaultScene from '../scenes/DefaultScene.js';
import Tek from '../avatars/Tek.js';
import TaskTester from "./TaskTester";
import FootBox from "./elementsUI/FootBox.js";
import '../styles/directed-action.css';


function ConjectureBox({ cid }) {
    return (
        <div className='conj-box'>
            <p>
                {CONJECTURE_LIST[cid].text}
            </p>
        </div>
    );
}

function AnimationBox({ roundId }) {
    return (
        <div className='animation-box'>
            {/* <TekContextProvider>
                <DefaultScene>
                    <Tek roundId={roundId}/>
                </DefaultScene>
            </TekContextProvider> */}
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
        We are on the ${cid}-th conjecture: )`;
    return (
        <div className='prompt-box'>
            <div className='prompt-canvas'>
                <p className='prompt-message'>{msg}</p>
            </div>
        </div>
    );
}

function DirectedAction({roundId}) {
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    return (
        <div className='page-main-box'>
            <div className='head-box'>
                <ConjectureBox cid={cid} />
            </div>
            <div className='mid-box'>
                <AnimationBox roundId={roundId} />
                {/* <LiveVideoBox /> */}
                {/* <PromptBox cid={cid} /> */}
            </div>
            <FootBox />
        </div>
    );
}
export default DirectedAction;