import { useSessionContext } from '../contexts/SessionContext';
import { BsQuestionCircleFill } from "react-icons/bs";
import TopPrompt from './elementsUI/TopPrompt';
import LargeConjectureBox from './elementsUI/LargeConjectureBox';
import FootBox from './elementsUI/FootBox';


function Answer() {
    const { metadata, runtime } = useSessionContext();
    const cid = metadata.current.shuffledIndex[runtime.current.currRound];
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