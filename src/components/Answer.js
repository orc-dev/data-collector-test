import { useSessionContext } from '../contexts/SessionContext';
import { BsQuestionCircleFill } from "react-icons/bs";
import TopPrompt from './elementsUI/TopPrompt';
import LargeConjectureBox from './elementsUI/MidConjectureBox';
import FootBox from './elementsUI/FootBox';


function Answer({roundId}) {
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    const prompt = 'Is the statement below always True or is False?';
    return (
        <div className='session-main-box'>
            <TopPrompt Icon={BsQuestionCircleFill} prompt={prompt} />
            <LargeConjectureBox cid={cid} />
            <FootBox />
        </div>
    );
}
export default Answer;