import { useSessionContext } from '../../contexts/SessionContext';
import { CONJECTURE_LIST } from '../../constants/experimentMeta';
import FootBox from '../elementsUI/FootBox';
import '../../styles/directed-action.css';


function span(text, key=0) {
    const style = {
        fontWeight: 'bolder',
        color: '#f5a742'
    };
    return <span key={key} style={style}><u>{text}</u></span>
}

const HightLightedConjBox = ({ cid }) => {
    const text  = CONJECTURE_LIST[cid].text;
    const range = CONJECTURE_LIST[cid].range;

    const highlightedText = text.split('').map((ch, idx) => {
        return (idx >= range[0] && idx < range[1]) ? span(ch, idx) : `${ch}`;
    });
   
    return (
        <div className='head-box'>
            <div className='conj-box'>
                <p>{highlightedText}</p>
            </div>
        </div>
    );
};

function SidePromptBox() {
    return (
        <div className='side-prompt-box' >
            <p>Could you describe the {span('geometric shape')} in the statement above?</p>
        </div>
    );
}

function CtrlDescription({roundId}) {
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    
    return (
        <div className='session-main-box'>
            <HightLightedConjBox cid={cid} />
            <div className='mid-box'>
                <div className='animation-box' />
                <SidePromptBox />
            </div>
            <FootBox />
        </div>
    );
}
export default CtrlDescription;