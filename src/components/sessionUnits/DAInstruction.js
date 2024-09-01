import { useSessionContext } from '../../contexts/SessionContext.js';
import TopConjectureBox from '../elementsUI/TopConjectureBox.js';
import FootBox from '../elementsUI/FootBox.js';
import '../../styles/directed-action.css';

function span(text) {
    return <span style={{color: '#f5a742'}}><u>{text}</u></span>
}

function SidePromptBox() {
    return (
        <div className='side-prompt-box' >
            <div style={{fontSize: '2.7vw'}}>
                <p>You will watch and perform the movements 
                    of the avatar {span('three times')}.
                </p>
                <p>Please {span('do not')} speak or verbalize your 
                    thoughts when performing the movements.
                </p>
            </div>
        </div>
    );
}

function DAInstruction({roundId}) {
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
export default DAInstruction;