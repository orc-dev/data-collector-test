import { useSessionContext } from '../../contexts/SessionContext';
import TopConjectureBox from '../elementsUI/TopConjectureBox';
import FootBox from '../elementsUI/FootBox';
import '../../styles/directed-action.css';


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
            <TopConjectureBox cid={cid} />
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