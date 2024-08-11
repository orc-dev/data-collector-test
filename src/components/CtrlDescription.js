import { useSessionContext } from "../contexts/SessionContext";


function CtrlDescription({handleTransition}) {
    const { meta, runtime} = useSessionContext();

    return (
        <div>
            <h2>CtrlDescription</h2>
            <button onClick={() => handleTransition(meta, runtime)}>Go next</button>
        </div>
    );
}
export default CtrlDescription;