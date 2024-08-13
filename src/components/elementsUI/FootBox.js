import { HiThumbUp } from 'react-icons/hi';

function FootBox() {
    const prompt = 'When you are ready to proceed: ';
    return (
        <div className='foot-box' >
            <p style={{ marginRight: '1vw' }}>{prompt}</p>
            <div style={{marginBottom: '12px'}}>
                <HiThumbUp style={{ fontSize: '4vw', marginRight: '5vw' }} />
            </div>
        </div>
    );
}
export default FootBox;