import { useSessionContext } from "../../contexts/SessionContext.js";
import { CONJECTURE_LIST } from '../../constants/conjectures.js';
import FootBox from "../elementsUI/FootBox.js";
import '../../styles/directed-action.css';

function span(text) {
    return <span style={{color: '#f5a742'}}><u>{text}</u></span>
}

function ConjectureBox({ cid }) {
    return (
        <div className='conj-box'>
            <p>
                {CONJECTURE_LIST[cid].text}
            </p>
        </div>
    );
}

function PromptBox() {
    return (
        <div style={{fontSize: '2.7vw'}}>
            <p>You will {span('predict')} what body movements
                the avatar will make for the statement above.
            </p>
            <p>Please {span('do not')} speak or verbalize your 
                thoughts when predicting the movements.
            </p>
        </div>
    );
}

function APInstruction({roundId}) {
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    return (
        <div className='page-main-box'>
            <div className='head-box'>
                <ConjectureBox cid={cid} />
            </div>
            <div className='mid-box'>
                <div className='animation-box' />
                <div className='side-prompt-box' >
                    <PromptBox />
                </div>
            </div>
            <FootBox />
        </div>
    );
}
export default APInstruction;