import { Button } from 'antd';

function SessionStart({onNext}) {
    const style = {
        color: '#eeeeee',
        fontSize: '60px',
        marginTop: '10vh',
        marginBottom: '17vh',
    };
    const message = 'Experiment is Ready to Run.';
    return (
        <div className='start-box' >
            <h2 style={style}>{message}</h2>
            <Button 
                id='start-button'
                onClick={() => onNext('button')} 
                type='primary'
                danger
                shape='circle' 
            >Start</Button>
        </div>
    );
}
export default SessionStart;