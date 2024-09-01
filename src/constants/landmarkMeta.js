/**
 * Left-Right flip
 * 
 * The camera feed is horizontally flipped to create a mirror effect,
 * allowing users to easily match their left/right arms with their 
 * on-screen reflections. As a result, the left and right landmarks are 
 * horizontally flipped compared to the official Pose Landmarker model:
 * https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker
 * 
 */
export { CSV_COL_NAMES, getPoseSlice, getHandSlice };

const CSV_COL_NAMES = [
    'time', 
    ...Object.keys(getPoseSlice()),
    ...Object.keys(getHandSlice())
];

/**
 * This function only collects data on the following pose landmarks:
 *              Left-side      Right-side
 *     (odd-numbered-side) vs (even-numbered-side)
 * 
 *                         0
 *                         |
 *             15    11----+----12    16
 *               \  / |         | \  /
 *                13  |         |  14
 *                    |         |
 *                    23 ----- 24
 *                     |       |
 *                    25       26
 *                     |       |
 *                    27       28
 *   0: nose
 *  11: L shoulder
 *  13: L elbow
 *  15: L wrist
 *  23: L hip
 *  25: L knee
 *  27: L ankle
 *  12: R shoulder
 *  14: R elbow
 *  16: R wrist
 *  24: R hip
 *  26: R knee
 *  28: R ankle
 * 
 * Pose landmarker model URL:
 * https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker
 * 
 */
function getPoseSlice(pose) {
    // Nose, and shoulder, elbow, writ, hip
    const indices = [0, 11, 13, 15, 23, 25, 27, 12, 14, 16, 24, 26, 28];
    const entries = {};
    const landmarks = pose?.landmarks?.[0] ?? [];
    for (const i of indices) {
        entries[`P${i}_x`] = landmarks?.[i]?.x ?? -1;
        entries[`P${i}_y`] = landmarks?.[i]?.y ?? -1;
    }
    return entries;
}

/**
 * Hand landmark model bundle URL:
 * https://ai.google.dev/edge/mediapipe/solutions/vision/gesture_recognizer
 * 
 *          8 12 16 
 *          7 11 15 20
 *          6 10 14 19
 *     4    5  9 13 18
 *      3 \|        17
 *       2          /
 *         1       /
 *           - 0 -
 *          (wrist)
 * 
 * Gestures Classifiers URL:
 * https://ai.google.dev/edge/mediapipe/solutions/vision/gesture_recognizer
 * [ 'None', 'Closed_Fist', 'Open_Palm', 'Pointing_Up', 
 *   'Thumb_Down', 'Thumb_Up', 'Victory', 'ILoveYou' ]
 */
function getHandSlice(hand) {
    // Create a default object for hand entries
    const entries = { GL: '-1', GR: '-1' };
    const sides = ['L', 'R'];
    const indices = Array.from({ length: 21 }, (_, i) => i);
    const coordinates = ['x', 'y'];

    for (const side of sides) {
        for (const index of indices) {
            for (const coord of coordinates) {
                entries[`${side}${index}_${coord}`] = -1;
            }
        }
    }
    // Update the default one with args
    const handedness = hand?.handedness ?? [];
    const gestures   = hand?.gestures   ?? [];
    const landmarks  = hand?.landmarks  ?? [];

    for (const i in handedness) {  // i in [0,1]
        // side is either 'L' or 'R'
        const side = handedness[i][0].categoryName.charAt(0);
        entries[`G${side}`] = gestures[i][0].categoryName;
        
        for (const j in landmarks[i]) {  // j in [0..20]
            entries[`${side}${j}_x`] = landmarks[i][j].x;
            entries[`${side}${j}_y`] = landmarks[i][j].y;
        }
    }
    return entries;
}


function buildConnections() {
    const poseRawPairs = [
        [11,12], [23,24],
        [13,11], [11,23], [23,25], [25,27],
        [14,12], [12,24], [24,26], [26,28],
    ];
    const handRawPairs = [
        [ 1, 5], [ 5, 9], [ 9,13], [13,17], [17,0],
        [ 0, 1], [ 1, 2], [ 2, 3], [ 3,4], 
        [ 5, 6], [ 6, 7], [ 7, 8],
        [ 9,10], [10,11], [11,12],
        [13,14], [14,15], [15,16],
        [17,18], [18,19], [19,20],
    ];
    const buildKeyPairs = (raw, prefix) => raw.map(e => [
        `${prefix}${e[0]}_x`, `${prefix}${e[0]}_y`,
        `${prefix}${e[1]}_x`, `${prefix}${e[1]}_y`,
    ]);

    const connectionKeys = {
        armL: [
            ['P13_x', 'P13_y', 'L0_x',  'L0_y' ], 
            ['P13_x', 'P13_y', 'P15_x', 'P15_y'],
        ],
        armR: [
            ['P14_x', 'P14_y', 'R0_x',  'R0_y' ],
            ['P14_x', 'P14_y', 'P16_x', 'P16_y'],
        ],
        pose:  buildKeyPairs(poseRawPairs, 'P'),
        handL: buildKeyPairs(handRawPairs, 'L'),
        handR: buildKeyPairs(handRawPairs, 'R'),
    };
    return connectionKeys;
}

function buildNodelist() {
    const poseRawNodes = [
        11, 13, 23, 25, 27,
        12, 14, 24, 26, 28,
    ];
    const handRawNodes = Array.from({ length: 20 }, (_, i) => i + 1);
    const nodeKeys = {
        wristL: [['L0_x', 'L0_y'], ['P15_x', 'P15_y']],
        wristR: [['R0_x', 'R0_y'], ['P16_x', 'P16_y']],
        pose:  poseRawNodes.map(e => [`P${e}_x`, `P${e}_y`]),
        handL: handRawNodes.map(e => [`L${e}_x`, `L${e}_y`]),
        handR: handRawNodes.map(e => [`R${e}_x`, `R${e}_y`]),
    };
    return nodeKeys;
}

export const CONN_KEYS = buildConnections();
export const NODE_KEYS = buildNodelist();