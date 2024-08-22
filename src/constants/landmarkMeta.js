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
 * 
 *   0: nose
 *  11: L shoulder
 *  13: L elbow
 *  15: L wrist
 *  23: L hip
 *  12: R shoulder
 *  14: R elbow
 *  16: R wrist
 *  24: R hip
 * 
 * Pose landmarker model URL:
 * https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker
 * 
 */
function getPoseSlice(pose) {
    // Nose, and shoulder, elbow, writ, hip
    const indices = [0, 11, 13, 15, 23, 12, 14, 16, 24];
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