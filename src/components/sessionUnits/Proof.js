import { useSessionContext } from '../../contexts/SessionContext';
import { BiSolidMessageRoundedDots } from "react-icons/bi";
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

function Proof({handleTransition, roundId}) {
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    const prompt = (<span>
            {span('Explain')} why the statement is always True or is False.
        </span>);
    return (
        <div className='session-main-box'>
            <TopPrompt Icon={BiSolidMessageRoundedDots} prompt={prompt} />
            <LargeConjectureBox cid={cid} />
        </div>
    );
}
export default Proof;