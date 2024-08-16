import { useSessionContext } from '../contexts/SessionContext';
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import TopPrompt from './elementsUI/TopPrompt';
import LargeConjectureBox from './elementsUI/MidConjectureBox';
import FootBox from './elementsUI/FootBox';


function Proof({handleTransition, roundId}) {
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    const prompt = 'Explain why the statement is always True or is False.';
    return (
        <div className='session-main-box'>
            <TopPrompt Icon={BiSolidMessageRoundedDots} prompt={prompt} />
            <LargeConjectureBox cid={cid} />
            <FootBox />
        </div>
    );
}
export default Proof;