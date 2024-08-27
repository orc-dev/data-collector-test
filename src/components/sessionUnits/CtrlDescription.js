import { useSessionContext } from '../../contexts/SessionContext';
import { CONJECTURE_LIST } from '../../constants/experimentMeta';
import FootBox from '../elementsUI/FootBox';
import '../../styles/directed-action.css';


const style = {
    fontWeight: 'bolder',
    color: '#f5a742'
};

const HightLightedConjBox = ({ cid }) => {
    const conj = CONJECTURE_LIST[cid];
    const range = conj.range;
    
    const highlightedText = conj.text.split('').map((ch, index) => {
      if (index >= range[0] && index < range[1]) {
        return (
          <span key={index} style={style}>
            <u>{ch}</u>
          </span>
        );
      }
      return `${ch}`;
    });
    
    return (
        <div className='conj-box'>
            <p>{highlightedText}</p>
        </div>
    );
  };

function CtrlDescription({roundId}) {
    const session = useSessionContext();
    const cid = session.current.shuffledIndex[roundId];
    
    return (
        <div className='session-main-box'>
            <div className='head-box'>
                <HightLightedConjBox cid={cid} />
            </div>
            <div className='mid-box'>
                <div className='animation-box' />
                <div className='side-prompt-box' >
                    <p>Could you describe the <span style={style}>
                        <u>geometric shape</u></span> in the statement above?
                    </p>
                </div>
            </div>
            <FootBox />
        </div>
    );
}
export default CtrlDescription;