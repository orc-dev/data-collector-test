import { vec, wristLocator, quat_pi, quat_eu } from '../../utils/graphics';
import { getPhalanxLength } from '../../avatars/skeleton';

// Get the length of the Proximal Phalanx of Thumb
const THUMB_PP = getPhalanxLength('F1_0_R');

export const DEFAULT_BODY_POSE = Object.freeze({
    HEAD:    quat_pi(-0.05, 0, 0),
    NECK:    quat_pi(0.08, 0, 0),
    CHEST:   quat_pi(0, 0, 0),
    BACK:    quat_pi(0, 0, 0),
    WAIST:   quat_pi(0, 0, 0),
    HIP_R:   quat_pi(0, -(0.1), 0),
    KNEE_R:  quat_pi(0, 0, 0),
    ANKLE_R: quat_pi(0.5, 0, 0),
    HIP_L:   quat_pi(0, +(0.1), 0),
    KNEE_L:  quat_pi(0, 0, 0),
    ANKLE_L: quat_pi(0.5, 0, 0),
});

const r = wristLocator(vec(-(0.2),-0.28,-0.18), -(0.9), 1, THUMB_PP);
export const RELAX_HAND_R = Object.freeze({
    F1_0_R: r.shldrQuat,
    F2_0_R: quat_pi(0.10, 0, -(0.06)),  
    F3_0_R: quat_pi(0.12, 0, -(0.02)),
    F4_0_R: quat_pi(0.14, 0, +(0.02)),
    F5_0_R: quat_pi(0.15, 0, +(0.05)),

    F1_1_R: r.elbowQuat,
    F2_1_R: quat_pi(0.10, 0, 0),
    F3_1_R: quat_pi(0.12, 0, 0),
    F4_1_R: quat_pi(0.14, 0, 0),
    F5_1_R: quat_pi(0.15, 0, 0),

    F1_2_R: quat_pi(-0.1, 0, 0),
    F2_2_R: quat_pi(0.10, 0, 0),
    F3_2_R: quat_pi(0.12, 0, 0),
    F4_2_R: quat_pi(0.14, 0, 0),
    F5_2_R: quat_pi(0.15, 0, 0),
});

const l = wristLocator(vec(+(0.2),-0.28,-0.18), +(0.9), 1, THUMB_PP);
export const RELAX_HAND_L = Object.freeze({
    F1_0_L: l.shldrQuat,
    F2_0_L: quat_pi(0.10, 0, +(0.06)),
    F3_0_L: quat_pi(0.12, 0, +(0.02)),
    F4_0_L: quat_pi(0.14, 0, -(0.02)),
    F5_0_L: quat_pi(0.15, 0, -(0.05)),

    F1_1_L: l.elbowQuat,
    F2_1_L: quat_pi(0.10, 0, 0),
    F3_1_L: quat_pi(0.12, 0, 0),
    F4_1_L: quat_pi(0.14, 0, 0),
    F5_1_L: quat_pi(0.15, 0, 0),

    F1_2_L: quat_pi(-0.1, 0, 0),
    F2_2_L: quat_pi(0.10, 0, 0),
    F3_2_L: quat_pi(0.12, 0, 0),
    F4_2_L: quat_pi(0.14, 0, 0),
    F5_2_L: quat_pi(0.15, 0, 0),
});

const fl = wristLocator(vec(+(0.05),-0.22,-0.22), +(0.65), 1, THUMB_PP);
export const FIST_L = Object.freeze({
    F1_0_L: fl.shldrQuat,
    F2_0_L: quat_pi(0.55, 0, -0),
    F3_0_L: quat_pi(0.55, 0, -0),
    F4_0_L: quat_pi(0.55, 0, +0),
    F5_0_L: quat_pi(0.55, 0, +0),

    F1_1_L: fl.elbowQuat,
    F2_1_L: quat_pi(0.5, 0, 0),
    F3_1_L: quat_pi(0.5, 0, 0),
    F4_1_L: quat_pi(0.5, 0, 0),
    F5_1_L: quat_pi(0.5, 0, 0),

    F1_2_L: quat_pi(-0.4, 0, 0),
    F2_2_L: quat_pi(0.4, 0, 0),
    F3_2_L: quat_pi(0.4, 0, 0),
    F4_2_L: quat_pi(0.4, 0, 0),
    F5_2_L: quat_pi(0.4, 0, 0),
});

const fr = wristLocator(vec(-(0.05),-0.22,-0.22), -(0.65), 1, THUMB_PP);
export const FIST_R = Object.freeze({
    F1_0_R: fr.shldrQuat,
    F2_0_R: quat_pi(0.55, 0, +0),
    F3_0_R: quat_pi(0.55, 0, +0),
    F4_0_R: quat_pi(0.55, 0, -0),
    F5_0_R: quat_pi(0.55, 0, -0),

    F1_1_R: fr.elbowQuat,
    F2_1_R: quat_pi(0.5, 0, 0),
    F3_1_R: quat_pi(0.5, 0, 0),
    F4_1_R: quat_pi(0.5, 0, 0),
    F5_1_R: quat_pi(0.5, 0, 0),

    F1_2_R: quat_pi(-0.4, 0, 0),
    F2_2_R: quat_pi(0.4, 0, 0),
    F3_2_R: quat_pi(0.4, 0, 0),
    F4_2_R: quat_pi(0.4, 0, 0),
    F5_2_R: quat_pi(0.4, 0, 0),
});

const pr = wristLocator(vec(-(0.22),-0.31,-0.05), -(0.8), 1, THUMB_PP);
export const PLAM_R = Object.freeze({
    F1_0_R: pr.shldrQuat,
    F2_0_R: quat_pi(0, 0, -0),  
    F3_0_R: quat_pi(0, 0, -0),
    F4_0_R: quat_pi(0, 0, +0),
    F5_0_R: quat_pi(0, 0, +0),

    F1_1_R: pr.elbowQuat,
    F2_1_R: quat_pi(0, 0, 0),
    F3_1_R: quat_pi(0, 0, 0),
    F4_1_R: quat_pi(0, 0, 0),
    F5_1_R: quat_pi(0, 0, 0),

    F1_2_R: quat_pi(-0.05, 0, 0),
    F2_2_R: quat_pi(0, 0, 0),
    F3_2_R: quat_pi(0, 0, 0),
    F4_2_R: quat_pi(0, 0, 0),
    F5_2_R: quat_pi(0, 0, 0),
});

const pl = wristLocator(vec(+(0.22),-0.31,-0.05), +(0.8), 1, THUMB_PP);
export const PLAM_L = Object.freeze({
    F1_0_L: pl.shldrQuat,
    F2_0_L: quat_pi(0, 0, +0),
    F3_0_L: quat_pi(0, 0, +0),
    F4_0_L: quat_pi(0, 0, -0),
    F5_0_L: quat_pi(0, 0, -0),

    F1_1_L: pl.elbowQuat,
    F2_1_L: quat_pi(0, 0, 0),
    F3_1_L: quat_pi(0, 0, 0),
    F4_1_L: quat_pi(0, 0, 0),
    F5_1_L: quat_pi(0, 0, 0),

    F1_2_L: quat_pi(-0.05, 0, 0),
    F2_2_L: quat_pi(0, 0, 0),
    F3_2_L: quat_pi(0, 0, 0),
    F4_2_L: quat_pi(0, 0, 0),
    F5_2_L: quat_pi(0, 0, 0),
});

const lr = wristLocator(vec(-(0.25),-0.24,-0.17), -(0.7), 1, THUMB_PP);
export const L_SHAPE_R = Object.freeze({
    F1_0_R: lr.shldrQuat,
    F2_0_R: quat_pi(  0, 0, -0),  
    F3_0_R: quat_pi(0.4, 0, -0),
    F4_0_R: quat_pi(0.4, 0, +0),
    F5_0_R: quat_pi(0.4, 0, +0),

    F1_1_R: quat_pi(0.17, 0, 0),
    F2_1_R: quat_pi(  0, 0, 0),
    F3_1_R: quat_pi(0.6, 0, 0),
    F4_1_R: quat_pi(0.6, 0, 0),
    F5_1_R: quat_pi(0.6, 0, 0),

    F1_2_R: quat_pi(0.05, 0, 0),
    F2_2_R: quat_pi(  0, 0, 0),
    F3_2_R: quat_pi(0.5, 0, 0),
    F4_2_R: quat_pi(0.5, 0, 0),
    F5_2_R: quat_pi(0.5, 0, 0),
});

const ll = wristLocator(vec(+(0.25),-0.24,-0.17), +(0.7), 1, THUMB_PP);
export const L_SHAPE_L = Object.freeze({
    F1_0_L: ll.shldrQuat,
    F2_0_L: quat_pi(  0, 0, +0),
    F3_0_L: quat_pi(0.4, 0, +0),
    F4_0_L: quat_pi(0.4, 0, -0),
    F5_0_L: quat_pi(0.4, 0, -0),

    F1_1_L: quat_pi(0.17, 0, 0),
    F2_1_L: quat_pi(  0, 0, 0),
    F3_1_L: quat_pi(0.6, 0, 0),
    F4_1_L: quat_pi(0.6, 0, 0),
    F5_1_L: quat_pi(0.6, 0, 0),

    F1_2_L: quat_pi(0.05, 0, 0),
    F2_2_L: quat_pi(  0, 0, 0),
    F3_2_L: quat_pi(0.5, 0, 0),
    F4_2_L: quat_pi(0.5, 0, 0),
    F5_2_L: quat_pi(0.5, 0, 0),
});


const relax_limb_r = wristLocator(vec(-(0.2),-2.38,0), +(0.6));
export const RELAX_LIMB_R = Object.freeze({
    SHOULDER_R: relax_limb_r.shldrQuat,
    ELBOW_R:    relax_limb_r.elbowQuat,
    WRIST_R:    quat_eu(-2.9845, +(1.5708), 0),
});

const relax_limb_l = wristLocator(vec(+(0.2),-2.38,0), -(0.6));
export const RELAX_LIMB_L = Object.freeze({
    SHOULDER_L: relax_limb_l.shldrQuat,
    ELBOW_L:    relax_limb_l.elbowQuat,
    WRIST_L:    quat_eu(-2.9845, -(1.5708), 0),
});

export const IDLE = Object.freeze({
    ...DEFAULT_BODY_POSE,
    ...RELAX_HAND_R,
    ...RELAX_HAND_L,
    ...RELAX_LIMB_R,
    ...RELAX_LIMB_L,
});