import * as META from '../general/metaPose';
import { quat_pi } from '../../utils/graphics';

const commonParts = Object.freeze({
    ...META.DEFAULT_BODY_POSE,
});

const verticalLimbR = Object.freeze({
    SHOULDER_R: quat_pi(-0.40, 0, 0),
    ELBOW_R:    quat_pi(-0.60, 0, 0),
    WRIST_R:    quat_pi(0, +(0.5),1),
});

const verticalLimbL = Object.freeze({
    SHOULDER_L: quat_pi(-0.40, 0, 0),
    ELBOW_L:    quat_pi(-0.60, 0, 0),
    WRIST_L:    quat_pi(0, -(0.5),1),
});

const inclinedLimbR = Object.freeze({
    SHOULDER_R: quat_pi(-0.40, +(0.25), 0),
    ELBOW_R:    quat_pi(-0.57, 0, 0),
    WRIST_R:    quat_pi(0, +(0.5),1),
});

const inclinedLimbL = Object.freeze({
    SHOULDER_L: quat_pi(-0.40, -(0.25), 0),
    ELBOW_L:    quat_pi(-0.57, 0, 0),
    WRIST_L:    quat_pi(0, -(0.5),1),
});

const POSE_1 = Object.freeze({
    ...commonParts,
    ...verticalLimbR,
    ...verticalLimbL,
    ...META.FIST_R,
    ...META.FIST_L,
});

const POSE_2 = Object.freeze({
    ...commonParts,
    ...verticalLimbR,
    ...inclinedLimbL,
    ...META.FIST_R,
    ...META.PLAM_L,
});

const POSE_3 = Object.freeze({
    ...commonParts,
    ...inclinedLimbR,
    ...verticalLimbL,
    ...META.PLAM_R,
    ...META.FIST_L,
});

// Directed action for 'RECT_DIAG'
export const RECT_DIAG_DA = Object.freeze({
    RECT_DIAG_1: POSE_1,
    RECT_DIAG_2: POSE_2,
    RECT_DIAG_3: POSE_3,
});
