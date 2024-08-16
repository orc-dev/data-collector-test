import { useSessionContext } from "../contexts/SessionContext";


function SelfExplanation({handleTransition, roundId}) {
    const session = useSessionContext();

    return (
        <div>
            <h2>SelfExplanation</h2>
        </div>
    );
}
export default SelfExplanation;