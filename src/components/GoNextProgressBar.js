import { useState, useImperativeHandle, forwardRef } from 'react';
import { Progress } from 'antd';

/**
 * @file GoNextProgressBar.js
 * @brief This file implements a progress bar as an indicator for feedback of 
 *        the valid 'Go Next' gesture. 
 * @notes
 *  - The progress bar is activated when a valid 'Go Next' gesture is held 
 *    for 0.5 seconds. 
 *  - If the gesture is maintained for an additional 1.0 seconds (total 1.5 
 *    seconds), the progress reaches 100%, triggering the `onNext` function. 
 *  - After triggering, there is a 5-second cooldown before the next valid 
 *    'Go Next' gesture can be detected. 
 *  - If the progress is interrupted before complete, it resets to 0%.
 * 
 * @created Aug.22, 2024
 */

// Timing parameters
export { PROGRESS_ACTIVATE_MS };
const PROGRESS_ACTIVATE_MS =   500;
const PROGRESS_COMPLETE_MS =  1500;
const RESET_ON_COMPLETE_MS = -4000;
const percentScale = 100 / (PROGRESS_COMPLETE_MS - PROGRESS_ACTIVATE_MS);


function GoNextProgressBar(props, ref) {
    const { timer, onNext } = props;
    const [percent, setPercent] = useState(0);
    
    // DEBUG.log
    //console.log(`timer: ${timer.current}, progress: ${percent.toFixed(1)}%`);
    
    useImperativeHandle(ref, () => ({
        triggerRender() {
            // If progress has complete, reset timer
            if (percent === 100) {
                timer.current = RESET_ON_COMPLETE_MS;
                onNext('gesture');
            }
            // Update progress percent with current timer
            setPercent(Math.min(
                percentScale * (timer.current - PROGRESS_ACTIVATE_MS),
                100
            ));
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