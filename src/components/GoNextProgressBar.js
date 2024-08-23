import { useState, useImperativeHandle, forwardRef } from 'react';
import { Progress } from 'antd';

// Timing parameters
export const ACTIVATE_MS = 400;
const COMPLETE_MS = 2000;
const RESET_ON_COMPLETE_MS = -5000;
const percentScale = 100 / (COMPLETE_MS - ACTIVATE_MS);


function GoNextProgressBar(props, ref) {
    const { timer, onNext } = props;
    const [percent, setPercent] = useState(0);
    
    // DEBUG.log
    console.log(`timer: ${timer.current}, progress: ${percent}%`);
    
    useImperativeHandle(ref, () => ({
        triggerRender() {
            // If progress has complete, reset timer
            if (percent === 100) {
                timer.current = RESET_ON_COMPLETE_MS;
                onNext('gesture');
            }
            // Update progress percent with current timer
            setPercent(Math.min(
                percentScale * (timer.current - ACTIVATE_MS),
                100)
            );
        }
    }));

    const mode = (percent <= 0) ? 'none' : 'flex';
    return (
        <div id='go-next-box' style={{ display: mode }}>
            <p id='go-next-text'>Go Next</p>
            <div id='progress-bar-box'>
                <Progress percent={percent} status='active'
                    steps={20} size={[30, 30]} showInfo={false} />
            </div>
        </div>
    );
}

export default forwardRef(GoNextProgressBar);