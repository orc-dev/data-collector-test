import { useSessionContext } from '../../contexts/SessionContext.js';
import TopConjectureBox from '../elementsUI/TopConjectureBox';
import FootBox from '../elementsUI/FootBox.js';
import '../../styles/directed-action.css';

function span(text) {
    return <span style={{color: '#f5a742'}}><u>{text}</u></span>
}

function SidePromptBox() {
    return (
        <div className='side-prompt-box' >
            <div style={{fontSize: '2.7vw'}}>
                <p>You will {span('predict')} what body movements
                    the avatar will make for the statement above.
                </p>
                <p>Please {span('do not')} speak or verbalize your 
                    thoughts when predicting the movements.
                </p>
            </div>
        </div>
    );
}

function APInstruction({roundId}) {
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    return (
        <div className='page-main-box'>
            <TopConjectureBox cid={cid} />
            <div className='mid-box'>
                <div className='animation-box' />
                <SidePromptBox />
            </div>
            <FootBox />
        </div>
    );
}
export default APInstruction;