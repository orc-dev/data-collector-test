import { useSessionContext } from "../contexts/SessionContext";


function Intro({handleTransition}) {
    const { meta, runtime} = useSessionContext();

    return (
        <div>
            <h2>Intro</h2>
            <button onClick={handleTransition}>Go next</button>
        </div>
    );
}
export default Intro;