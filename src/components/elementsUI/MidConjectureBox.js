import { CONJECTURE_LIST } from "../../constants/experimentMeta";

function LargeConjectureBox({cid}) {
    return (
        <div className='mid-box'>
            <div className='mid-conj-box'>
                <p>{CONJECTURE_LIST[cid].text}</p>
            </div>
        </div>
    );
}
export default LargeConjectureBox;
