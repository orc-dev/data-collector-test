import { Button } from 'antd';

function SessionStart({onNext}) {
    const style = {
        color: '#eeeeee',
        fontSize: '50px',
        marginTop: '10vh',
        marginBottom: '17vh',
    };
    return (
        <div className='start-box' >
            <h2 style={style} children='Experiment is Ready to Run.' />
            <Button 
                id='start-button'
                onClick={() => onNext('button')} 
                type='primary'
                danger
                shape='circle' 
                children='Start'
            />
        </div>
    );
}
export default SessionStart;