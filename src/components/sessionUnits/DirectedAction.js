import { useSessionContext } from "../../contexts/SessionContext.js";
import { CONJECTURE_LIST } from '../../constants/conjectures.js';
import FootBox from "../elementsUI/FootBox.js";
import '../../styles/directed-action.css';


function ConjectureBox({ cid }) {
    return (
        <div className='conj-box'>
            <p>{CONJECTURE_LIST[cid].text}</p>
        </div>
    );
}


function DirectedAction({roundId}) {
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    return (
        <div className='page-main-box'>
            <div className='head-box'>
                <ConjectureBox cid={cid} />
            </div>
            <div className='mid-box' />
            <FootBox />
        </div>
    );
}
export default DirectedAction;