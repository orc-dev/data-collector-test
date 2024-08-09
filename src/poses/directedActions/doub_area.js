import * as META from '../general/metaPose';
import { vec, wristLocator, quat_eu } from '../../utils/graphics';

// Run locators
const l_ = wristLocator(vec(0.1,-1,1.05), -0.3);
const r1 = wristLocator(vec(0.80,-0.4,1), 0.42);
const r2 = wristLocator(vec(0.15,-0.4,1), 0.42);
const r3 = wristLocator(vec(0.15,-0.1,1), 0.42);

const commonParts = Object.freeze({
    ...META.DEFAULT_BODY_POSE,
    ...META.L_SHAPE_R,
    ...META.L_SHAPE_L,
    
    SHOULDER_L: l_.shldrQuat,
    ELBOW_L:    l_.elbowQuat,
    WRIST_L:    quat_eu(-1.2363, -0.5217, 2.3147),
});

const POSE_1 = Object.freeze({
    ...commonParts,
    SHOULDER_R: r1.shldrQuat,
    ELBOW_R:    r1.elbowQuat,
    WRIST_R:    quat_eu(-3.1015, -0.3907, -0.0149),
});

const POSE_2 = Object.freeze({
    ...commonParts,
    SHOULDER_R: r2.shldrQuat,
    ELBOW_R:    r2.elbowQuat,
    WRIST_R:    quat_eu(2.7292, -0.4000, -0.2112),
});

const POSE_3 = Object.freeze({
    ...commonParts,
    SHOULDER_R: r3.shldrQuat,
    ELBOW_R:    r3.elbowQuat,
    WRIST_R:    quat_eu(2.8252, -0.1315, -0.2360),
});

// Directed action for 'DOUB_AREA'
export const DOUB_AREA_DA = Object.freeze({
    DOUB_AREA_1: POSE_1,
    DOUB_AREA_2: POSE_2,
    DOUB_AREA_3: POSE_3,
});