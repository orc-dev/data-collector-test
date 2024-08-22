import { useState, useImperativeHandle, forwardRef, memo, useMemo } from 'react';
import { Progress } from 'antd';


function GoNextProgressBar(props, ref) {
    const { timer, onNext } = props;
    const [percent, setPercent] = useState(0);
    
    const RESET_ON_COMPLETE_MS = useMemo(() => -5000);
    const PROGRESS_ACTIVATE_MS = useMemo(() =>   500);
    const PROGRESS_COMPLETE_MS = useMemo(() =>  2000);

    console.log(`timer: ${timer.current}, progress: ${percent}%`);

    useImperativeHandle(ref, () => ({
        triggerRender() {
            setPercent(0);
            if (timer.current === undefined) return;

            setPercent(Math.min(
                (timer.current - PROGRESS_ACTIVATE_MS) / 15, 
                100)
            );

            if (timer.current > PROGRESS_COMPLETE_MS) {
                timer.current = RESET_ON_COMPLETE_MS;
                onNext('gesture');
            }
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
