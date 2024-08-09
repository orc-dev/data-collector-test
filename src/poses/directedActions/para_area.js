import * as META from '../general/metaPose';
import { parallelLocator, quat_pi } from '../../utils/graphics';

const commonParts = Object.freeze({
    ...META.DEFAULT_BODY_POSE,
    ...META.PLAM_R,
    ...META.PLAM_L,
});

// Run locators
const r1 = parallelLocator( 0.6,    0, +1);
const l1 = parallelLocator(-0.6, -0.8, -1);

const r2 = parallelLocator(+1.1,    0, +1);
const l2 = parallelLocator(-1.1, -0.8, -1);

// parallelogram
const POSE_1 = Object.freeze({
    ...commonParts,

    SHOULDER_R: r1.shldrQuat,
    ELBOW_R:    r1.elbowQuat,
    WRIST_R:    quat_pi(0, +(0.5), 1),

    SHOULDER_L: l1.shldrQuat,
    ELBOW_L:    l1.elbowQuat,
    WRIST_L:    quat_pi(0, -(0.75), 1),
});

// Rectangle
const POSE_2 = Object.freeze({
    ...commonParts,
    
    SHOULDER_R: r2.shldrQuat,
    ELBOW_R:    r2.elbowQuat,
    WRIST_R:    quat_pi(0, +(0.5), 1),
    
    SHOULDER_L: l2.shldrQuat,
    ELBOW_L:    l2.elbowQuat,
    WRIST_L:    quat_pi(0, -(0.75), 1),
});

// Directed action for 'PARA_AREA'
export const PARA_AREA_DA = Object.freeze({
    PARA_AREA_1: POSE_1,
    PARA_AREA_2: POSE_2,
    PARA_AREA_3: POSE_1,  // POSE_3 is the same as POSE_1
});