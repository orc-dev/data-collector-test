import { useSessionContext } from '../../contexts/SessionContext';
import { HiMiniSpeakerWave } from 'react-icons/hi2';
import TopPrompt from '../elementsUI/TopPrompt';
import LargeConjectureBox from '../elementsUI/MidConjectureBox';


function span(text) {
    const style = {
        fontWeight: 'bolder',
        color: '#f5a742',
        textUnderlineOffset: '5px',
    };
    return <span style={style}><u>{text}</u></span>
}

function ReadConjecture({roundId}) {
    //console.log(`ReadConjecture: rid = ${roundId}`);
    
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    const prompt = (<span>
        Please {span('read')} the following statement aloud.
    </span>);
    
    return (
        <div className='session-main-box'>
            <TopPrompt Icon={HiMiniSpeakerWave} prompt={prompt} />
            <LargeConjectureBox cid={cid} />
        </div>
    );
}
export default ReadConjecture;