import { useSessionContext } from "../../contexts/SessionContext.js";
import { CONJECTURE_LIST } from '../../constants/conjectures.js';
import FootBox from "../elementsUI/FootBox.js";
import '../../styles/directed-action.css';


function ConjectureBox({ cid }) {
    return (
        <div className='conj-box'>
            <p>
                {CONJECTURE_LIST[cid].text}
            </p>
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
                {/* <LiveVideoBox /> */}
                {/* <PromptBox cid={cid} /> */}
            </div>
            <FootBox />
        </div>
    );
}
export default DirectedAction;