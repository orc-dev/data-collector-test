import { CONJECTURE_LIST, PRACTICE_CONJ } from '../../constants/experimentMeta';


function LargeConjectureBox({cid}) {
    const conjText = CONJECTURE_LIST[cid]?.text ?? PRACTICE_CONJ.text;
    return (
        <div className='mid-box'>
            <div className='mid-conj-box'>
                <p>{conjText}</p>
            </div>
        </div>
    );
}
export default LargeConjectureBox;
