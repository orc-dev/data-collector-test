
function Intro({onNext}) {
    return (
        <div style={{color: 'white'}}>
            <h2>Intro</h2>
            <p>This section is under construction...</p>
            <button onClick={() => onNext('button')}>Skip</button>
        </div>
    );
}
export default Intro;