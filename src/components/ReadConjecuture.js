import { CONJECTURE_LIST } from "../constants/experimentMeta";
import { useSessionContext } from "../contexts/SessionContext";


function ReadConjecuture({handleTransition}) {
    const { metadata, runtime } = useSessionContext();
    const cid = metadata.current.shuffledIndex[runtime.current.currRound];
    return (
        <div>
            <h2>ReadConjecuture:</h2>
            <p>{CONJECTURE_LIST[cid].text}</p>
            <button onClick={handleTransition}>Go next</button>
        </div>
    );
}
export default ReadConjecuture;