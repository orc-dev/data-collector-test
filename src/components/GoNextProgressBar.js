import { useState, useImperativeHandle, forwardRef, memo } from 'react';
import { Progress } from 'antd';


function GoNextProgressBar(props, ref) {
    const { timer, onNext } = props;
    const [percent, setPercent] = useState(0);
    console.log(`timer: ${timer.current}, progress: ${percent}%`);
    
    const ACTIVATE_MS =  400;
    const COMPLETE_MS = 2000;
    const scale = 100 / (COMPLETE_MS - ACTIVATE_MS);
    
    useImperativeHandle(ref, () => ({
        triggerRender() {
            if (percent === 100) {
                timer.current = (-5000);  // 5.0 sec cooldown
                onNext('gesture');
            }
            setPercent(Math.min(
                scale * (timer.current - ACTIVATE_MS),
                100)
            );
        }
    }));

    const mode = (percent <= 0) ? 'none' : 'flex';
    return (
        <div id='go-next-box' style={{ display: mode}}>
            <p id='go-next-text'>Go Next</p>
            <div id='progress-bar-box'>
                <Progress 
                    steps={20}
                    size={[30, 30]}
                    percent={percent} 
                    status='active'
                    showInfo={false} />
            </div>
        </div>
    );
}

export default memo(forwardRef(GoNextProgressBar));
