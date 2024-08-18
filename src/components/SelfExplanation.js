import { useSessionContext } from '../contexts/SessionContext';
import { CONJECTURE_LIST } from '../constants/experimentMeta';
import FootBox from './elementsUI/FootBox';
import '../styles/directed-action.css';


function ConjectureBox({ cid }) {
    return (
        <div className='conj-box'>
            <p>{CONJECTURE_LIST[cid].text}</p>
        </div>
    );
}

function SelfExplanation({roundId}) {
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    const prompt = '(Explain the relations between the statement and the avatar actions.)';
    
    return (
        <div className='session-main-box'>
            <div className='head-box'>
                <ConjectureBox cid={cid} />
            </div>
            <div className='mid-box'>
                <div className='animation-box' />
                <div className='side-prompt-box' >
                    <p>{prompt}</p>
                </div>
            </div>
            <FootBox />
        </div>
    );
}
export default SelfExplanation;