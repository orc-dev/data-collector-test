import { Quaternion } from 'three';
import { SKELETAL_METRICS } from '../avatars/skeleton';
import { POSE_LIST } from '../poses/index';
import { DA_ANIMATIONS } from '../constants/conjectures';

const BASE_HEIGHT = SKELETAL_METRICS.BACK_HT;

/**
 * A closure function prepares and returns an animation runner with
 * given conjecture label.
 * 
 * @param {*} jointRefs - Context references to skeleton coordinates
 * @param {*} conjLabel - Key for CONJ_ANIMATION, with a sequence of pose keys
 * @param {*} time - Current accumulated timestamp
 */
export function standardAnimation(jointRefs, conjLabel) {
    // Timeline parameters (in seconds)
    const transSec = 1.2;
    const _holdSec = 1.5;
    const TIME_LINE = [
        {start: 0, end: 0, dur: transSec},
        {start: 0, end: 1, dur: transSec},
        {start: 1, end: 1, dur: _holdSec},
        {start: 1, end: 2, dur: transSec},
        {start: 2, end: 2, dur: _holdSec},
        {start: 2, end: 3, dur: transSec},
        {start: 3, end: 3, dur: _holdSec},
        {start: 3, end: 0, dur: transSec},
    ];
    // Handle special case of 'Rectangle_Diags'
    if (conjLabel === 'Rectangle_Diags') {
        TIME_LINE.splice(5, 1, ...[
            {start: 2, end: 1, dur: transSec * 0.75},
            {start: 1, end: 3, dur: transSec * 0.75},
        ]);
    }
    const poseSeq = DA_ANIMATIONS[conjLabel];
    
    let tid = 0;
    let accTime = 0;
    let interval, duration, headQuat, tailQuat;

    function runAnimation(delta, pauseRef) {
        if (pauseRef.current === true) return;
        
        interval = TIME_LINE[tid];
        duration = interval.dur;

        headQuat = POSE_LIST[poseSeq[interval.start]];
        tailQuat = POSE_LIST[poseSeq[interval.end]];

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

        // Updates/resets timing parameters
        accTime += delta;
        if (accTime > duration) {
            tid = (tid + 1) % TIME_LINE.length;
            accTime = 0;
        }
    }
    return runAnimation;
}

/**
 * A closure function prepares and returns an animation runner with
 * given conjecture label.
 * 
 * @param {*} jointRefs - Context references to skeleton coordinates
 * @param {*} conjLabel - Key for CONJ_ANIMATION, with a sequence of pose keys
 * @param {*} time - Current accumulated timestamp
 */
export function responsiveAnimation(jointRefs, conjLabel) {
    // Timeline parameters (in seconds)
    const transSec = 1.2;
    const TIME_LINE = [
        {start: 0, end: 1, dur: transSec},
        {start: 1, end: 2, dur: transSec},
        {start: 2, end: 3, dur: transSec},
        {start: 3, end: 0, dur: transSec},
    ];
    // Handle special case of 'Rectangle_Diags'
    if (conjLabel === 'Rectangle_Diags') {
        TIME_LINE.splice(2, 1, ...[
            {start: 2, end: 1, dur: transSec * 0.75},
            {start: 1, end: 3, dur: transSec * 0.75},
        ]);
    }
    const poseSeq = DA_ANIMATIONS[conjLabel];
    
    let tid = 0;
    let accTime = 0;
    let interval, duration, headQuat, tailQuat;

    function runAnimation(delta, pauseRef) {
        if (pauseRef.current === true) return;
        
        const specialFlag = (conjLabel === 'Rectangle_Diags');
        interval = TIME_LINE[tid];
        duration = interval.dur;

        headQuat = POSE_LIST[poseSeq[interval.start]];
        tailQuat = POSE_LIST[poseSeq[interval.end]];

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

        // Updates/resets timing parameters
        accTime += delta;
        if (accTime > duration) {
            Object.keys(jointRefs).forEach(refKey => {
                jointRefs[refKey].current?.quaternion.copy(tailQuat[refKey]);
            });

            tid = (tid + 1) % TIME_LINE.length;
            accTime = 0;

            // Pause animation, waiting student to replicate the pose
            pauseRef.current = true;
            if (specialFlag && tid === 3) {
                pauseRef.current = false;
            }
        }
    }
    return runAnimation;
}


export function performPose(jointRefs, poseKey) {
    Object.keys(jointRefs).forEach(refKey => {
        jointRefs[refKey].current?.quaternion.copy(
            POSE_LIST[poseKey][refKey]);
    });
    jointRefs.BACK.current.position.y = BASE_HEIGHT;
}
