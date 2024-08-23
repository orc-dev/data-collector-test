import { Button } from 'antd';


const { ipcRenderer } = window.require('electron');

function SessionFinish() {
    const style = {
        color: '#eeeeee',
        fontSize: '5vw',
        marginTop: '15vh',
        marginBottom: '20vh',
        paddingLeft: '5vw',
        paddingRight: '5vw',
        textAlign: 'center',
    };
    const message = 'Great job! The Experiment is done. \
        We appreciate your contribution.';
    
    function handleExit() {
        console.log('Session exits.');
        ipcRenderer.send('app-exit');
    }
    return (
        <div className='start-box' >
            <h2 style={style}>{message}</h2>
            <Button 
                id='exit-button'
                onClick={handleExit} 
                type='primary'
                children='Exit'
            />
        </div>
    );
}
export default SessionFinish;