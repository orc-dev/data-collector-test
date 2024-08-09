import * as META from '../general/metaPose';
import { vec, quat_pi, wristLocator } from '../../utils/graphics';
import { SKELETAL_METRICS } from '../../avatars/skeleton';


const commonParts = Object.freeze({
    ...META.DEFAULT_BODY_POSE,
    ...META.RELAX_LIMB_R,
    ...META.RELAX_HAND_R,
    ...META.FIST_L,
    WRIST_L: quat_pi(0, -0.5, 1),
});

// Run locators
const armLen = SKELETAL_METRICS.UPR_ARM;
const sinVal = armLen * Math.sin(Math.PI * 0.25);
const l1 = wristLocator(vec(armLen - sinVal, sinVal, 0))
const l2 = wristLocator(vec(armLen,          armLen, 0))
const l3 = wristLocator(vec(armLen + sinVal, sinVal, 0))

const POSE_1 = Object.freeze({
    ...commonParts,
    SHOULDER_L: l1.shldrQuat,
    ELBOW_L:    l1.elbowQuat,
});

const POSE_2 = Object.freeze({
    ...commonParts,
    SHOULDER_L: l2.shldrQuat,
    ELBOW_L:    l2.elbowQuat,
});

const POSE_3 = Object.freeze({
    ...commonParts,
    SHOULDER_L: l3.shldrQuat,
    ELBOW_L:    l3.elbowQuat,
});

// Directed action for 'TRIA_ANGL'
export const TRIA_ANGL_DA = Object.freeze({
    TRIA_ANGL_1: POSE_1,
    TRIA_ANGL_2: POSE_2,
    TRIA_ANGL_3: POSE_3,
});