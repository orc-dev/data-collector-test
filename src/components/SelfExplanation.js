import { useSessionContext } from "../contexts/SessionContext";


function SelfExplanation({handleTransition}) {
    const { meta, runtime} = useSessionContext();

    return (
        <div>
            <h2>SelfExplanation</h2>
            <button onClick={() => handleTransition(meta, runtime)}>Go next</button>
        </div>
    );
}
export default SelfExplanation;