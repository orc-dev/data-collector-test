/**
 * @file: skeleton.js
 * 
 * @description:
 * This file defines the skeletal structure and metrics for Tek,
 * including dimensions of main body parts and lengths of finger segments.
 * It constructs the skeletal hierarchy, connecting body parts and fingers 
 * with appropriate positions and skins for rendering.
 * 
 * @exports:
 * - TEK_SKELETON: an object implements Tek's skeleton system.
 *               Head
 *                 |
 *   Shoulder_R  Neck   Shoulder_L
 *      |     \    |    /     |
 *   Elbow_R     Chest     Elbow_L
 *      |          *          |
 *   Wrist_R     Back      Wrist_L
 *      |          *          |
 *   Hand_R      waist      Hand_L
 *     /|\     /       \     /|\
 *          Hip_R     Hip_L
 *            |         | 
 *         Knee_R     Knee_L
 *            |         |
 *        Ankle_R     Ankle_L
 * 
 * - SKELETAL_METRICS: dimensions of main parts of the body.
 * - getPhalanxLength: function to get the length of a phalanx segment by key.
 * 
 * Date: Aug.04 2024
 */
import * as Skin from "./skin2/skinSet";
export { TEK_SKELETON, SKELETAL_METRICS, getPhalanxLength };

/** 
 * Skeletal Metrics defines the dimensions of main parts of the body.
 */
const SCALE = 0.75; 
const SKELETAL_METRICS = Object.freeze({
    NECK_HT: SCALE * 0.9,
    SHLDR_X: SCALE * 1.1,
    SHLDR_Y: SCALE * 1.5,

    CHEST_Y: SCALE * 1.375,
    WAIST_Y: SCALE * 1.0,
    WAIST_X: SCALE * 0.7,

    UPR_ARM: SCALE * 1.6,
    LWR_ARM: SCALE * 1.6,
    UPR_LEG: SCALE * 1.9,
    LWR_LEG: SCALE * 1.9,
    BACK_HT: 3.875,
});

/**
 * Fi specifies the position of the proximal phalanx on the i-th finger
 * in the wrist coordinate.
 */
const MUL = 0.9;
const F1 = {x: MUL * +0.02, y: MUL * 0.12};
const F2 = {x: MUL * +0.15, y: MUL * 0.43};
const F3 = {x: MUL * +0.05, y: MUL * 0.45};
const F4 = {x: MUL * -0.05, y: MUL * 0.44};
const F5 = {x: MUL * -0.15, y: MUL * 0.40};

/**
 * This table specifies the length of each segment of phalanx on each finger,
 * scaled by value in the first row.
 */
const PHALANX_LENGTH = [
    [0.65, 0.58, 0.47],  // 0: Scale
    [0.31, 0.23, 0.21],  // 1: Thumb
    [0.22, 0.22, 0.22],  // 2: Index
    [0.23, 0.23, 0.23],  // 3: Middle
    [0.21, 0.21, 0.21],  // 4: Ring
    [0.19, 0.19, 0.19],  // 5: Pinky
];

/** Given the phalanx key, returns its length. */
function getPhalanxLength(key) {
    const fid = Number(key.charAt(1));  // finger
    const pid = Number(key.charAt(3));  // phalanx
    return PHALANX_LENGTH[fid][pid] * PHALANX_LENGTH[0][pid];
}

/**
 * Creates a hand skeleton system by organizing 3 phalanx on 5 fingers.
 * 
 * @param {*} handness 'L' or 'R'
 * @returns an frozen object contains such element, for example:
 *   'F1_0_R': {
 *       next: a list containing keys of child component.
 *       ipos: a list of [x,y,z] for each child component's position.
 *       skin: a callback returning an R3F element.
 *   }
 */
function createHandObject(handness) {
    // Local helper for finding next key
    function getNextPhalanxKey(key) {
        const fid = Number(key.charAt(1));  // finger
        const pid = Number(key.charAt(3));  // phalanx
        const hid = key.charAt(5);          // handness
        return (pid === 2) ? [] : [`F${fid}_${(pid + 1)}_${hid}`];
    }
    // Generate a list of keys representing phalanx (eg. 'F1_0_R')
    const keyList = [];
    for (let fid = 1; fid <= 5; ++fid) {
        for (let pid = 0; pid <= 2; ++pid) {
            keyList.push(`F${fid}_${pid}_${handness}`)
        }
    }
    // Construct the hand system by connecting each phalanx
    const handObj = keyList.reduce((obj, key) => {
        obj[key] = {
            next: getNextPhalanxKey(key),
            ipos: [[0,getPhalanxLength(key),0]],
            skin: () => <Skin.FingerJointSkin fingerKey={key}/>,
        }
        return obj;
    }, {});
    return Object.freeze(handObj);
}

/**
 * Create sub skeleton systems, then merge them together.
 */
const HAND_L = createHandObject('L');
const HAND_R = createHandObject('R');

const LIMBS_L = Object.freeze({
    SHOULDER_L: {
        next: ['ELBOW_L'],
        ipos: [[0, -SKELETAL_METRICS.UPR_ARM, 0]],
        skin: () => <Skin.ShoulderSkin />
    },
    ELBOW_L: {
        next: ['WRIST_L'],
        ipos: [[0, -SKELETAL_METRICS.LWR_ARM, 0]],
        skin: () => <Skin.ElbowSkin />
    },
    WRIST_L: {
        next: ['F1_0_L', 'F2_0_L', 'F3_0_L', 'F4_0_L', 'F5_0_L',],
        ipos: [
            [-F1.x, F1.y, 0],
            [-F2.x, F2.y, 0],
            [-F3.x, F3.y, 0],
            [-F4.x, F4.y, 0],
            [-F5.x, F5.y, 0],
        ],
        skin: () => <Skin.WristSkin side={'L'}/>
    },
    HIP_L: {
        next: ['KNEE_L'],
        ipos: [[0, -SKELETAL_METRICS.UPR_LEG, 0]],
        skin: () => <Skin.HipSkin />
    },
    KNEE_L: {
        next: ['ANKLE_L'],
        ipos: [[0, -SKELETAL_METRICS.LWR_LEG, 0]],
        skin: () => <Skin.KneeSkin />
    },
    ANKLE_L: {
        next: [],
        ipos: [],
        skin: () => <Skin.AnkleSkin />
    },
});

const LIMBS_R = Object.freeze({
    SHOULDER_R: {
        next: ['ELBOW_R'],
        ipos: [[0, -SKELETAL_METRICS.UPR_ARM, 0]],
        skin: () => <Skin.ShoulderSkin />
    },
    ELBOW_R: {
        next: ['WRIST_R'],
        ipos: [[0, -SKELETAL_METRICS.LWR_ARM, 0]],
        skin: () => <Skin.ElbowSkin />
    },
    WRIST_R: {
        next: ['F1_0_R', 'F2_0_R', 'F3_0_R', 'F4_0_R', 'F5_0_R',],
        ipos: [
            [+F1.x, F1.y, 0],
            [+F2.x, F2.y, 0],
            [+F3.x, F3.y, 0],
            [+F4.x, F4.y, 0],
            [+F5.x, F5.y, 0],
        ],
        skin: () => <Skin.WristSkin side={'R'}/>
    },
    HIP_R: {
        next: ['KNEE_R'],
        ipos: [[0, -SKELETAL_METRICS.UPR_LEG, 0]],
        skin: () => <Skin.HipSkin />
    },
    KNEE_R: {
        next: ['ANKLE_R'],
        ipos: [[0, -SKELETAL_METRICS.LWR_LEG, 0]],
        skin: () => <Skin.KneeSkin />
    },
    ANKLE_R: {
        next: [],
        ipos: [],
        skin: () => <Skin.AnkleSkin />
    },
});

const TEK_SKELETON = Object.freeze({
    BACK: {
        next: ['CHEST', 'WAIST'],
        ipos: [[0,0,0], [0,0,0]],
        skin: () => <Skin.BackSkin />,
    },
    CHEST: {
        next: ['NECK', 'SHOULDER_R', 'SHOULDER_L'],
        ipos: [
            [0, SKELETAL_METRICS.CHEST_Y, 0], 
            [-SKELETAL_METRICS.SHLDR_X, SKELETAL_METRICS.SHLDR_Y, 0],
            [+SKELETAL_METRICS.SHLDR_X, SKELETAL_METRICS.SHLDR_Y, 0],
        ],
        skin: () => <Skin.ChestSkin />
    },
    WAIST: {
        next: ['HIP_R', 'HIP_L'],
        ipos: [
            [-SKELETAL_METRICS.WAIST_X, -SKELETAL_METRICS.WAIST_Y, 0],
            [+SKELETAL_METRICS.WAIST_X, -SKELETAL_METRICS.WAIST_Y, 0],
        ],
        skin: () => <Skin.WaistSkin />
    },
    NECK: {
        next: ['HEAD'],
        ipos: [[0, SKELETAL_METRICS.NECK_HT, 0]],
        skin: () => <Skin.NeckSkin />
    },
    HEAD: {
        next: [],
        ipos: [],
        skin: () => <Skin.HeadSkin />
    },
    // Merge limbs and hands skeleton
    ...LIMBS_L,
    ...LIMBS_R,
    ...HAND_L,
    ...HAND_R,
});
