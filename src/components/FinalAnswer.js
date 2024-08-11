import { useSessionContext } from "../contexts/SessionContext";


function FinalAnswer({handleTransition}) {
    const { runtime } = useSessionContext();
    const message = `FinalAnswer: ${runtime.current.currRound}`;
    return (
        <div>
            <h2>{message}</h2>
            <button onClick={handleTransition}>Go next</button>
        </div>
    );
}
export default FinalAnswer;