import { useSessionContext } from '../../contexts/SessionContext';
import { CONJECTURE_LIST } from '../../constants/experimentMeta';
import FootBox from '../elementsUI/FootBox';
import '../../styles/directed-action.css';


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
    const makePrompt = (action) => (
        `Could you explain how ${action} connect to the statement above?`
    );
    const prompt = {
        DA_SE: makePrompt('the movements you have performed'),
        AP_SE: makePrompt('the predictions about movements you have made'),
    };
    
    return (
        <div className='session-main-box'>
            <div className='head-box'>
                <ConjectureBox cid={cid} />
            </div>
            <div className='mid-box'>
                <div className='animation-box' />
                <div className='side-prompt-box' >
                    <p>{prompt[session.current.exptCondition]}</p>
                </div>
            </div>
            <FootBox />
        </div>
    );
}
export default SelfExplanation;