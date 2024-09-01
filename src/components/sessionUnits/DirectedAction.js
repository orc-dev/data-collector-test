import { useSessionContext } from '../../contexts/SessionContext.js';
import TopConjectureBox from '../elementsUI/TopConjectureBox.js';
import FootBox from '../elementsUI/FootBox.js';
import '../../styles/directed-action.css';


function DirectedAction({roundId}) {
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
export default DirectedAction;