
function Intro({onNext}) {
    return (
        <div>
            <h2>Intro</h2>
            <p>This section is under construction...</p>
            <button onClick={() => onNext('button')}>Skip</button>
        </div>
    );
}
export default Intro;