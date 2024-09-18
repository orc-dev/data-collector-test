import { useSessionContext } from '../../contexts/SessionContext';
import { CONJECTURE_LIST, PRACTICE_CONJ } from '../../constants/experimentMeta';
import '../../styles/directed-action.css';


function span(text) {
    const style = {
        fontWeight: 'bolder',
        color: '#f5a742',
        textUnderlineOffset: '5px',
    };
    return <span style={style}><u>{text}</u></span>
}

const HightLightedConjBox = ({ cid }) => {
    const text  = CONJECTURE_LIST[cid]?.text  ?? PRACTICE_CONJ.text;
    const range = CONJECTURE_LIST[cid]?.range ?? PRACTICE_CONJ.range;

    const [a, b] = range;
    const prefix = text.substring(0, a);
    const hiText = text.substring(a, b);
    const suffix = text.substring(b);

    return (
        <div className='head-box'>
            <div className='conj-box'>
                <p>{prefix}{span(hiText)}{suffix}</p>
            </div>
        </div>
    );
};

function SidePromptBox() {
    return (
        <div className='side-prompt-box' >
            <p>Please describe the {span('geometric shape')} in the statement above.</p>
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
        </div>
    );
}
export default CtrlDescription;