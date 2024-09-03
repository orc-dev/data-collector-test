import { Button } from 'antd';

function SessionStart({onNext}) {
    const message = 'Experiment is Ready to Run.';
    return (
        <div className='start-box' >
            <h2 id='start-info-text'>{message}</h2>
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