import * as META from '../general/metaPose';
import { quat_pi } from '../../utils/graphics';

const commonParts = Object.freeze({
    ...META.DEFAULT_BODY_POSE,
    ...META.RELAX_LIMB_R,
    ...META.RELAX_HAND_R,
});

const POSE_1 = Object.freeze({
    ...commonParts,

    SHOULDER_L: quat_pi(0,0,0.5),
    ELBOW_L:    quat_pi(0,0,0),
    WRIST_L:    quat_pi(0,0,1),
    ...META.PLAM_L,
});

const POSE_2 = Object.freeze({
    ...commonParts,

    SHOULDER_L: quat_pi(0,0,1),
    ELBOW_L:    quat_pi(0,0,0),
    WRIST_L:    quat_pi(0,0,1),
    ...META.PLAM_L,
});

const POSE_3 = Object.freeze({
    ...commonParts,

    SHOULDER_L: quat_pi(0,0,0.5),
    ELBOW_L:    quat_pi(0,0,0),
    WRIST_L:    quat_pi(0,0,1),
    ...META.PLAM_L,
});

// Directed action for 'LINE_ROTA'
export const LINE_ROTA_DA = Object.freeze({
    LINE_ROTA_1: POSE_1,
    LINE_ROTA_2: POSE_2,
    LINE_ROTA_3: POSE_3,
});