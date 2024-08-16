import { useSessionContext } from "../contexts/SessionContext";


function SessionFinish({handleTransition}) {
    const session = useSessionContext();

    return (
        <div>
            <h2>SessionFinish</h2>
            <button onClick={handleTransition}>Exit</button>
        </div>
    );
}
export default SessionFinish;