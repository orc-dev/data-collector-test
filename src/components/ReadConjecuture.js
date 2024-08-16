import { useSessionContext } from '../contexts/SessionContext';
import { HiMiniSpeakerWave } from 'react-icons/hi2';
import TopPrompt from './elementsUI/TopPrompt';
import LargeConjectureBox from './elementsUI/MidConjectureBox';
import FootBox from './elementsUI/FootBox';


function ReadConjecuture({roundId}) {
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    const prompt = 'Please read the following statement aloud.';
    return (
        <div className='session-main-box'>
            <TopPrompt Icon={HiMiniSpeakerWave} prompt={prompt} />
            <LargeConjectureBox cid={cid} />
            <FootBox />
        </div>
    );
}
export default ReadConjecuture;