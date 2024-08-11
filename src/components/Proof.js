import { useSessionContext } from "../contexts/SessionContext";


function Proof({handleTransition}) {
    const { meta, runtime} = useSessionContext();

    return (
        <div>
            <h2>Proof</h2>
            <button onClick={handleTransition}>Go next</button>
        </div>
    );
}
export default Proof;