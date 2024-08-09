import { IDLE } from './general/metaPose';
import { SIMI_TRIA_DA } from './directedActions/simi_tria';
import { PARA_AREA_DA } from './directedActions/para_area';
import { RECT_DIAG_DA } from './directedActions/rect_diag';
import { OPPO_ANGL_DA } from './directedActions/oppo_angl';
import { TRIA_ANGL_DA } from './directedActions/tria_angl';
import { DOUB_AREA_DA } from './directedActions/doub_area';

/**
 * POSE_LIST: 
 * - key: a unique pose identifier, such as 'SIMI_TRIA_1', etc.
 * - val: a pose object
 *      - key: body landmark names
 *      - val: a quaternion representing the orientation
 */
export const POSE_LIST = Object.freeze({
    IDLE,
    ...SIMI_TRIA_DA,
    ...PARA_AREA_DA,
    ...RECT_DIAG_DA,
    ...OPPO_ANGL_DA,
    ...TRIA_ANGL_DA,
    ...DOUB_AREA_DA,
});
export const POSE_KEYS = Object.keys(POSE_LIST);
