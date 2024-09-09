import { CONJECTURE_LIST, PRACTICE_CONJ } from '../../constants/experimentMeta';


function TopConjectureBox({ cid }) {
    const conjText = CONJECTURE_LIST[cid]?.text ?? PRACTICE_CONJ.text;
    return (
        <div className='head-box'>
            <div className='conj-box'>
                <p>{conjText}</p>
            </div>
        </div>
    );
}
export default TopConjectureBox;