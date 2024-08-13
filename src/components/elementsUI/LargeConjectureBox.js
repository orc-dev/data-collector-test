import { CONJECTURE_LIST } from "../../constants/experimentMeta";

function LargeConjectureBox({cid}) {
    return (
        <div className='large-conj-box'>
            <p>{CONJECTURE_LIST[cid].text}</p>
        </div>
    );
}
export default LargeConjectureBox;
