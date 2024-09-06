import { HiThumbUp } from 'react-icons/hi';
import AudioVisualizer from '../sessionUnits/AudioVisualizer';

function FootBox({roundId, canvasRef}) {
    const mode = (roundId >= -1 && roundId <= 5) ? 'flex' : 'none';
    const prompt = 'When you are ready to proceed: ';
    return (
        <div className='foot-box' style={{ display: mode }} >
            <AudioVisualizer canvasRef={canvasRef} />
            <div className='proceed-box'>
                <p style={{ marginRight: '1vw' }}>{prompt}</p>
                <div style={{marginBottom: '8px'}}>
                    <HiThumbUp style={{ fontSize: '4vw' }} />
                </div>
            </div>
        </div>
    );
}
export default FootBox;