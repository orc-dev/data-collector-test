import { useSessionContext } from '../../contexts/SessionContext';
import TopConjectureBox from '../elementsUI/TopConjectureBox';
import '../../styles/directed-action.css';


function span(text) {
    const style = {
        fontWeight: 'bolder',
        color: '#f5a742',
    };
    return <span style={style}><u>{text}</u></span>
}


function SelfExplanation({roundId}) {
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    
    const prompt = {
        DA_SE: <span>{span('movements')} you have performed</span>,
        AP_SE: <span>{span('predictions')} about the movements you have made</span>
    };
    
    return (
        <div className='session-main-box'>
            <TopConjectureBox cid={cid} />
            <div className='mid-box'>
                <div className='animation-box' />
                <div className='side-prompt-box' >
                    <p>Please {span('explain')} how the {
                        prompt[session.current.exptCondition]
                    } connect to the statement above.</p>
                </div>
            </div>
        </div>
    );
}
export default SelfExplanation;