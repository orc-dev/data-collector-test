import { useSessionContext } from '../../contexts/SessionContext';
import { BsQuestionCircleFill } from "react-icons/bs";
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

function Answer({roundId}) {
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    const prompt = (<span>
        Is the statement below always {span('True')} or is {span('False')}?
    </span>);

    return (
        <div className='session-main-box'>
            <TopPrompt Icon={BsQuestionCircleFill} prompt={prompt} />
            <LargeConjectureBox cid={cid} />
        </div>
    );
}
export default Answer;