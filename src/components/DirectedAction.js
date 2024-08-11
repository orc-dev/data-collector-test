import { useSessionContext } from "../contexts/SessionContext";


function DirectedAction({handleTransition}) {
    const { meta, runtime} = useSessionContext();

    return (
        <div>
            <h2>DirectedAction</h2>
            <button onClick={handleTransition}>Go next</button>
        </div>
    );
}
export default DirectedAction;