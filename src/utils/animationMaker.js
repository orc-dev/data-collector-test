import { Quaternion } from 'three';
import { SKELETAL_METRICS } from '../avatars/skeleton';
import { POSE_LIST } from '../poses/index';
import { CONJ_LABELS, DA_ANIMATIONS } from '../constants/experimentMeta';

const BASE_HEIGHT = SKELETAL_METRICS.BACK_HT;

/**
 * A closure function prepares and returns an animation runner with
 * given conjecture label.
 * 
 * @param {*} jointRefs - Context references to skeleton coordinates
 * @param {*} cid - Conjecture id
 * @param {*} canvasHUD - Ref of canvas for sychonization indicator
 * @param {*} time - Current accumulated timestamp
 */
export function autoplayMode(jointRefs, cid, canvasHUD) {
    // 2D canvas settings :::::::::::::::::::::::::::::::::::::::::::::::::::::
    const canvas = canvasHUD.current;
    const ctx = canvas.getContext('2d');

    // Adjust canvas to align with the device pixel ratio
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width  = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Timeline parameters (in seconds) :::::::::::::::::::::::::::::::::::::::
    const conjLabel = CONJ_LABELS[cid];
    const transSec = 1.2;
    const _holdSec = 1.5;
    const TIME_LINE = [
        {start: 0, end: 0, dur: 2.5     , nodeId: 0},
        {start: 0, end: 1, dur: transSec, nodeId: 1},
        {start: 1, end: 1, dur: _holdSec, nodeId: 2},
        {start: 1, end: 2, dur: transSec, nodeId: 3},
        {start: 2, end: 2, dur: _holdSec, nodeId: 4},
        {start: 2, end: 3, dur: transSec, nodeId: 5}, // (replace mark)
        {start: 3, end: 3, dur: _holdSec, nodeId: 6},
        {start: 3, end: 0, dur: transSec, nodeId: 7},
    ];
    // Handle special case of 'Rectangle_Diags'
    if (conjLabel === 'Rectangle_Diags') {
        TIME_LINE.splice(5, 1, ...[
            {start: 2, end: 1, dur: transSec * 0.75, nodeId: 5},
            {start: 1, end: 3, dur: transSec * 0.75, nodeId: 5},
        ]);
    }
    const poseSeq = DA_ANIMATIONS[conjLabel];
    
    let tid = 0;
    let accTime = 0;
    let interval, duration, headQuat, tailQuat, t;

    // Draw Indicator :::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    function drawSyncIndicator(nodeId, t) {
        // Dimensions
        const cx = rect.width / 2;
        const dy = rect.height * 0.08;
        const textDy = dy + 2;
        const step = cx * 0.5;
        const r = Math.floor(cx * 0.06);
        const barX = step * 0.7;
        const barY = step * 0.03;
        // Color
        const unvisited = '#d1cfcb';
        const visited = '#bf9e67';

        // Functions
        const node = (m) => {
            ctx.beginPath();
            ctx.arc(cx + m * step, dy, r, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        };
        const link = (m, t=1) => {
            ctx.fillRect(cx + m * step - (barX/2), dy - (barY/2), barX * t, barY);
        };
        const drawUnit = [
            (p=1) => node(-1.5, p),
            (p=1) => link(-1,   p),
            (p=1) => node(-0.5, p),
            (p=1) => link( 0,   p),
            (p=1) => node( 0.5, p),
            (p=1) => link( 1,   p),
            (p=1) => node( 1.5, p)
        ];

        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.save();

        // Draw unvisited 
        ctx.fillStyle = unvisited;
        drawUnit.forEach(func => func());

        // Draw visited
        if (nodeId < 7) {
            ctx.fillStyle = visited;
            for (let i = 0; i < nodeId; ++i) {
                drawUnit[i]();
            }
            drawUnit[nodeId](t);
        }
        // Fill numbers
        ctx.fillStyle = 'white';
        ctx.font = 'bolder 20px Quantico';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        [0,1,2,3].forEach((k, i) => {
            ctx.fillText(k, cx + (-1.5 + i * 1) * step, textDy);
        });
        ctx.restore();
    }

    // Animation function :::::::::::::::::::::::::::::::::::::::::::::::::::::
    function runAnimation(delta, pauseRef) {
        if (pauseRef.current === true) return;
        
        interval = TIME_LINE[tid];
        duration = interval.dur;

        headQuat = POSE_LIST[poseSeq[interval.start]];
        tailQuat = POSE_LIST[poseSeq[interval.end]];

        const specialFlag = (conjLabel === 'Rectangle_Diags');
        const specialDur = transSec * 1.5;
        t = accTime / duration;
        if (specialFlag) {
            if (tid === 5)
                t = accTime / specialDur;
            if (tid === 6)
                t = (accTime + transSec * 0.75) / specialDur;
        }

        // Updates current frame
        Object.keys(jointRefs).forEach(refKey => {
            const currQuat = new Quaternion().slerpQuaternions(
                headQuat[refKey], 
                tailQuat[refKey], 
                (accTime / duration),
            );
            jointRefs[refKey].current?.quaternion.copy(currQuat);
        });
        jointRefs.BACK.current.position.y = BASE_HEIGHT;

        // Updates indicator
        drawSyncIndicator(TIME_LINE[tid].nodeId, t);

        // Updates/resets timing parameters
        accTime += delta;
        if (accTime > duration) {
            tid = (tid + 1) % TIME_LINE.length;
            accTime = 0;

            t = (specialFlag && tid === 6) ? (TIME_LINE[3].dur / specialDur) : 0;
            drawSyncIndicator(TIME_LINE[tid].nodeId, t);
        }
    }
    return runAnimation;
}


/**
 * A closure function prepares and returns an animation runner with
 * given conjecture label.
 * 
 * @param {*} jointRefs - Context references to skeleton coordinates
 * @param {*} cid - Conjecture id
 * @param {*} canvasHUD - Ref of canvas for sychonization indicator
 * @param {*} poseKey - Ref of current pose key that need to check matching
 * @param {*} time - Current accumulated timestamp
 */
export function responseMode(jointRefs, cid, canvasHUD, poseKey) {
    // 2D canvas settings :::::::::::::::::::::::::::::::::::::::::::::::::::::
    const canvas = canvasHUD.current;
    const ctx = canvas.getContext('2d');

    // Adjust canvas to align with the device pixel ratio
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width  = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Timeline parameters (in seconds) :::::::::::::::::::::::::::::::::::::::
    const PERFORM_TOTAL = 2;  // Perfrom twice for each conjecture
    const conjLabel = CONJ_LABELS[cid];
    const transSec = 1.2;
    const TIME_LINE = [
        {start: 0, end: 0, dur: 2.2     , nodeId: -1},
        {start: 0, end: 1, dur: transSec, nodeId: 0},
        {start: 1, end: 2, dur: transSec, nodeId: 1},
        {start: 2, end: 3, dur: transSec, nodeId: 2},  // (replace-mark)
        {start: 3, end: 0, dur: transSec, nodeId: 3},
    ];
    // Handle special case of 'Rectangle_Diags'
    if (conjLabel === 'Rectangle_Diags') {
        TIME_LINE.splice(3, 1, ...[
            {start: 2, end: 1, dur: transSec * 0.75, nodeId: 2},
            {start: 1, end: 3, dur: transSec * 0.75, nodeId: 2},
        ]);
    }
    const poseSeq = DA_ANIMATIONS[conjLabel];
    // Dynamic variables
    let performCount = 0;
    let tid = 0;
    let accTime = 0;
    let pendingId = 0;
    let interval, duration, headQuat, tailQuat, t;

    // Draw Indicator :::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    function drawSyncIndicator(nodeId, t, pendingId) {
        // Dimensions
        const dx = rect.width / 2;
        const dy = rect.height * 0.08;
        const textDy = dy + 2;
        const step = dx * 0.5;
        const r = Math.floor(dx * 0.06);
        const barX = step * 0.7;
        const barY = step * 0.03;
        // Color
        const unvisited = '#d1cfcb';
        const visited   = '#bf9e67';
    
        // Functions
        const node = (m) => {
            ctx.beginPath();
            ctx.arc(dx + m * step, dy, r, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        };
        const link = (m, t=1) => {
            const x = dx + m * step - (barX / 2);
            const y = dy - (barY / 2);
            ctx.fillRect(x, y, barX * t, barY);
        };
        const drawUnit = [
            (p=1) => node(-1.5, p),
            (p=1) => link(-1,   p),
            (p=1) => node(-0.5, p),
            (p=1) => link( 0,   p),
            (p=1) => node( 0.5, p),
            (p=1) => link( 1,   p),
            (p=1) => node( 1.5, p)
        ];
        
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.save();
        // Draw unvisited 
        ctx.fillStyle = unvisited;
        drawUnit.forEach(func => func());
    
        // Draw visited
       if (nodeId < 3 || t === 0) {
            ctx.fillStyle = visited;
            drawUnit[0]();
            let i = 0;
            for (i = 0; i <= nodeId * 2; ++i) {
                drawUnit[i]();
            }
            if (nodeId >= 0 && i < drawUnit.length)
                drawUnit[i](t);
        }
        // Draw the pending node
        if (pendingId) {
            ctx.save();
            ctx.fillStyle = '#ed0741';
            drawUnit[pendingId]();
            ctx.restore();
        }

        // Fill numbers
        ctx.fillStyle = 'white';
        ctx.font = 'bolder 22px Quantico';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        [0,1,2,3].forEach((k, i) => {
            ctx.fillText(k, dx + (-1.5 + i * 1) * step, textDy);
        });
    
        ctx.restore();
    }

    // Animation function :::::::::::::::::::::::::::::::::::::::::::::::::::::
    function runAnimation(delta, pauseRef) {
        if (pauseRef.current === true) {
            drawSyncIndicator(TIME_LINE[tid].nodeId, t, pendingId);
            return;
        };
        if (performCount === PERFORM_TOTAL) return;
        
        const specialFlag = (conjLabel === 'Rectangle_Diags');
        const specialDur = transSec * 1.5;
        
        interval = TIME_LINE[tid];
        duration = interval.dur;
        t = accTime / duration;
        if (specialFlag) {
            if (tid === 3)
                t = accTime / specialDur;
            if (tid === 4)
                t = (accTime + transSec * 0.75) / specialDur;
        }

        headQuat = POSE_LIST[poseSeq[interval.start]];
        tailQuat = POSE_LIST[poseSeq[interval.end]];
        
        // Updates current frame
        Object.keys(jointRefs).forEach(refKey => {
            const currQuat = new Quaternion().slerpQuaternions(
                headQuat[refKey], tailQuat[refKey], accTime / duration
            );
            jointRefs[refKey].current?.quaternion.copy(currQuat);
        });
        jointRefs.BACK.current.position.y = BASE_HEIGHT;

        // Updates indicator
        drawSyncIndicator(TIME_LINE[tid].nodeId, t);

        // Updates/resets timing parameters
        accTime += delta;
        if (accTime > duration) {
            Object.keys(jointRefs).forEach(refKey => {
                jointRefs[refKey].current?.quaternion.copy(tailQuat[refKey]);
            });

            tid = (tid + 1) % TIME_LINE.length;
            accTime = 0;
            t = (specialFlag && tid === 4) ? (TIME_LINE[3].dur / specialDur) : 0;

            if (tid === 0) {
                performCount++;
            }
            if (performCount === PERFORM_TOTAL && tid === 0) {
                clearSyncIndicator(rect.width, rect.height, ctx, 'Done!');
                return;
            }
            drawSyncIndicator(TIME_LINE[tid].nodeId, t);
            
            // Pause animation, waiting student to replicate the pose
            pauseRef.current = true;
            if (tid === 0 || tid === 1) {
                pauseRef.current = false;
            }
            if (specialFlag && tid === 4) {
                pauseRef.current = false;
            }
            // Update current pose key (for matching)
            if (pauseRef.current) {
                poseKey.current = {
                    cid: cid,
                    label: conjLabel,
                    pid: TIME_LINE[tid].start,
                }
                // Update pending node id
                pendingId += 2;
                if (pendingId === 8) pendingId = 2;
            }
        }
    }
    return runAnimation;
}


function clearSyncIndicator(width, height, ctx, message=null) {
    // Dimensions
    const x = width / 2;
    const y = height * 0.15;
    
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    if (message) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 4vw Quantico';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(message, x, y);
    }
    ctx.restore();
}


export function performPose(jointRefs, poseKey, canvasHUD) {
    Object.keys(jointRefs).forEach(refKey => {
        jointRefs[refKey].current?.quaternion.copy(
            POSE_LIST[poseKey][refKey]);
    });
    jointRefs.BACK.current.position.y = BASE_HEIGHT;

    // Clear up canvas
    const canvas = canvasHUD.current;
    const ctx = canvas.getContext('2d');

    // Adjust canvas to align with the device pixel ratio
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width  = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);
}
