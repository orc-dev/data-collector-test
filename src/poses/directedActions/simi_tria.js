import { DEFAULT_BODY_POSE } from '../general/metaPose';
import { vec, wristLocator, quat_pi, quat_eu } from '../../utils/graphics';

// Right hand gesture: 'L' shape
const handPoseR = Object.freeze({
    F1_0_R: quat_pi(1, 0, -(0.65)),
    F2_0_R: quat_pi(0, 0, -(0.03)),  
    F3_0_R: quat_pi(0.4, 0, -(0.01)),
    F4_0_R: quat_pi(0.4, 0, +(0.01)),
    F5_0_R: quat_pi(0.4, 0, +(0.03)),

    F1_1_R: quat_pi(0, 0, 0),
    F2_1_R: quat_pi(0, 0, 0),
    F3_1_R: quat_pi(0.55, 0, 0),
    F4_1_R: quat_pi(0.55, 0, 0),
    F5_1_R: quat_pi(0.55, 0, 0),

    F1_2_R: quat_pi(0, 0, 0),
    F2_2_R: quat_pi(0, 0, 0),
    F3_2_R: quat_pi(0.3, 0, 0),
    F4_2_R: quat_pi(0.3, 0, 0),
    F5_2_R: quat_pi(0.3, 0, 0),
});

// Left hand gesture: 'L' shape
const handPoseL = Object.freeze({
    F1_0_L: quat_pi(1, 0, +(0.65)),
    F2_0_L: quat_pi(0, 0, +(0.03)),
    F3_0_L: quat_pi(0.4, 0, +(0.01)),
    F4_0_L: quat_pi(0.4, 0, -(0.01)),
    F5_0_L: quat_pi(0.4, 0, -(0.03)),

    F1_1_L: quat_pi(0, 0, 0),
    F2_1_L: quat_pi(0, 0, 0),
    F3_1_L: quat_pi(0.55, 0, 0),
    F4_1_L: quat_pi(0.55, 0, 0),
    F5_1_L: quat_pi(0.55, 0, 0),

    F1_2_L: quat_pi(0, 0, 0),
    F2_2_L: quat_pi(0, 0, 0),
    F3_2_L: quat_pi(0.3, 0, 0),
    F4_2_L: quat_pi(0.3, 0, 0),
    F5_2_L: quat_pi(0.3, 0, 0),
});

const commonParts = Object.freeze({
    ...DEFAULT_BODY_POSE,
    ...handPoseR,
    ...handPoseL,
});

// Run locators
const r1 = wristLocator(vec(+0.3,-0.7,1), +(0.15));
const l1 = wristLocator(vec(-0.3,-0.7,1), -(0.15));

const r2 = wristLocator(vec(0,-0.7,1), +(0.20));
const l2 = wristLocator(vec(0,-0.7,1), -(0.20));

const r3 = wristLocator(vec(-0.3,-0.7,1), +(0.25));
const l3 = wristLocator(vec(+0.3,-0.7,1), -(0.25));

const POSE_1 = Object.freeze({
    ...commonParts,

    SHOULDER_R: r1.shldrQuat,
    ELBOW_R:    r1.elbowQuat,
    WRIST_R:    quat_eu(2.1720, -(0.5059), -(0.0577)),

    SHOULDER_L: l1.shldrQuat,
    ELBOW_L:    l1.elbowQuat,
    WRIST_L:    quat_eu(2.1720, +(0.5059), +(0.0577)),
});

const POSE_2 = Object.freeze({
   ...commonParts,
    
    SHOULDER_R: r2.shldrQuat,
    ELBOW_R:    r2.elbowQuat,
    WRIST_R:    quat_eu(2.0927, -(0.3438), +(0.0656)),

    SHOULDER_L: l2.shldrQuat,
    ELBOW_L:    l2.elbowQuat,
    WRIST_L:    quat_eu(2.0927, +(0.3438), -(0.0656)),
});

const POSE_3 = Object.freeze({
    ...commonParts,
    
    SHOULDER_R: r3.shldrQuat,
    ELBOW_R:    r3.elbowQuat,
    WRIST_R:    quat_eu(1.9601, -(0.1749), +(0.1678)),

    SHOULDER_L: l3.shldrQuat,
    ELBOW_L:    l3.elbowQuat,
    WRIST_L:    quat_eu(1.9601, +(0.1749), -(0.1678)),
});

// Directed action for 'SIMI_TRIA'
export const SIMI_TRIA_DA = Object.freeze({
    SIMI_TRIA_1: POSE_1,
    SIMI_TRIA_2: POSE_2,
    SIMI_TRIA_3: POSE_3,
});
