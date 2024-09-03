import { useSessionContext } from '../../contexts/SessionContext';
import TopConjectureBox from '../elementsUI/TopConjectureBox';
import '../../styles/directed-action.css';


function ActionPrediction({roundId}) {
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    return (
        <div className='page-main-box'>
            <TopConjectureBox cid={cid} />
            <div className='mid-box' />
        </div>
    );
}
export default ActionPrediction;