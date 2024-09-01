import { Button } from 'antd';


const { ipcRenderer } = window.require('electron');

function SessionFinish() {
    const message = `The Experiment is done. 
        We appreciate your contribution.`;
    
    function handleExit() {
        console.log('Session exits.');
        ipcRenderer.send('app-exit');
    }
    return (
        <div className='start-box' >
            <h2 id='exit-message'>
                <span style={{color: '#9a6bb5'}}>Great job! </span>
                {message}
            </h2>
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