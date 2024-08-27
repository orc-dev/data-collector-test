import { CONJECTURE_LIST } from "../../constants/experimentMeta";

function LargeConjectureBox({cid}) {
    //const message = `${(cid + 1)}. ${CONJECTURE_LIST[cid].text}`;
    const message = `${CONJECTURE_LIST[cid].text}`;
    return (
        <div className='mid-box'>
            <div className='mid-conj-box'>
                <p>{message}</p>
            </div>
        </div>
    );
}
export default LargeConjectureBox;
