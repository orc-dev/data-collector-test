import { useSessionContext } from "../contexts/SessionContext";


function SessionFinish({handleTransition}) {
    const { meta, runtime} = useSessionContext();

    return (
        <div>
            <h2>SessionFinish</h2>
            <button onClick={handleTransition}>Exit</button>
        </div>
    );
}
export default SessionFinish;