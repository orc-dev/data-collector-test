import { useSessionContext } from '../../contexts/SessionContext';
import TopConjectureBox from '../elementsUI/TopConjectureBox';
import FootBox from '../elementsUI/FootBox';
import '../../styles/directed-action.css';


function ActionPrediction({roundId}) {
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    return (
        <div className='page-main-box'>
            <TopConjectureBox cid={cid} />
            <div className='mid-box' />
            <FootBox />
        </div>
    );
}
export default ActionPrediction;