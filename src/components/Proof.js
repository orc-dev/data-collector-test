import { useSessionContext } from '../contexts/SessionContext';
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import TopPrompt from './elementsUI/TopPrompt';
import LargeConjectureBox from './elementsUI/LargeConjectureBox';
import FootBox from './elementsUI/FootBox';


function Proof() {
    const { metadata, runtime } = useSessionContext();
    const cid = metadata.current.shuffledIndex[runtime.current.currRound];
    const prompt = <p>Explain why the statement is always True or is False.</p>;
    return (
        <div className='session-main-box'>
            <TopPrompt Icon={BiSolidMessageRoundedDots} prompt={prompt} />
            <LargeConjectureBox cid={cid} />
            <FootBox />
        </div>
    );
}
export default Proof;