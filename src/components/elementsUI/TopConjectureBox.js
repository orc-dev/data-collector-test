import { CONJECTURE_LIST } from '../../constants/experimentMeta';


function TopConjectureBox({ cid }) {
    return (
        <div className='head-box'>
            <div className='conj-box'>
                <p>{CONJECTURE_LIST[cid].text}</p>
            </div>
        </div>
    );
}
export default TopConjectureBox;