import { useSessionContext } from "../contexts/SessionContext";


function ActionPrediction({handleTransition}) {
    const { meta, runtime} = useSessionContext();

    return (
        <div>
            <h2>ActionPrediction</h2>
            <button onClick={() => handleTransition(meta, runtime)}>Go next</button>
        </div>
    );
}
export default ActionPrediction;