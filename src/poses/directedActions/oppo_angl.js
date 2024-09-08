import * as META from '../general/metaPose';
import { vec, wristLocator, quat_pi } from '../../utils/graphics';

const commonParts = Object.freeze({
    ...META.DEFAULT_BODY_POSE,
    ...META.PLAM_R,
    ...META.PLAM_L,
});

// Run locators
const MID_X = 0.825;
const MUL = 0.7;
// const p1r = wristLocator(vec(+MID_X, 0.30, 1.10), +0.11, MUL);
// const p1l = wristLocator(vec(-MID_X, 0.30, 0.95), -0.11, MUL);

const p1r = wristLocator(vec(+MID_X, -0.1, 0.90), +0.08, MUL);
const p1l = wristLocator(vec(-MID_X, -0.1, 0.75), -0.08, MUL);

const p2r = wristLocator(vec(+MID_X, -0.115, 1.05), +0.22, MUL);
const p2l = wristLocator(vec(-MID_X, -0.115, 0.90), -0.22, MUL);

const p3r = wristLocator(vec(+MID_X, -0.13, 1.20), +0.37, MUL);
const p3l = wristLocator(vec(-MID_X, -0.13, 1.05), -0.37, MUL);

const POSE_1 = Object.freeze({
    ...commonParts,

    SHOULDER_R:    p1r.shldrQuat,
    ELBOW_R:       p1r.elbowQuat,
    WRIST_R:       quat_pi(1,+(0.3),0),

    SHOULDER_L:    p1l.shldrQuat,
    ELBOW_L:       p1l.elbowQuat,
    WRIST_L:       quat_pi(1,-(0.3),0),
});

const POSE_2 = Object.freeze({
    ...commonParts,

    SHOULDER_R:    p2r.shldrQuat,
    ELBOW_R:       p2r.elbowQuat,
    WRIST_R:       quat_pi(1,+(0.4),0),

    SHOULDER_L:    p2l.shldrQuat,
    ELBOW_L:       p2l.elbowQuat,
    WRIST_L:       quat_pi(1,-(0.4),0),
});

const POSE_3 = Object.freeze({
    ...commonParts,

    SHOULDER_R:    p3r.shldrQuat,
    ELBOW_R:       p3r.elbowQuat,
    WRIST_R:       quat_pi(1,+(0.5),0),

    SHOULDER_L:    p3l.shldrQuat,
    ELBOW_L:       p3l.elbowQuat,
    WRIST_L:       quat_pi(1,-(0.5),0),
});

// Directed action for 'OPPO_ANGL'
export const OPPO_ANGL_DA = Object.freeze({
    OPPO_ANGL_1: POSE_1,
    OPPO_ANGL_2: POSE_2,
    OPPO_ANGL_3: POSE_3,
});
