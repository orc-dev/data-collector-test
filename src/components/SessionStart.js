import { Button } from 'antd';

function SessionStart({handleTransition}) {
    const textStyle = {
        color: '#ffffff',
        fontSize: '50px',
        marginTop: '10vh',
        marginBottom: '17vh',
    };
    const buttonStyle = {
        width: '250px', 
        height: '250px', 
        fontSize: '50px', 
        fontWeight: 'bolder',
    };
    return (
        <div className='start-box' >
            <h2 style={textStyle} children='Experiment is Ready to Run.' />
            <Button 
                className='custom-shadow'
                onClick={handleTransition} 
                type='primary'
                danger
                shape='circle' 
                style={buttonStyle}
                children='Start'
            />
        </div>
    );
}
export default SessionStart;