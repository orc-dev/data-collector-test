import { useSessionContext } from "../../contexts/SessionContext";


function CtrlDescription({roundId}) {
    const session = useSessionContext();

    return (
        <div>
            <h2>CtrlDescription</h2>
        </div>
    );
}
export default CtrlDescription;