import { SKELETAL_METRICS } from "../avatars/skeleton";
import { Vector3, Quaternion, Euler } from 'three';

export const EMPTY_QUAT = new Quaternion();

/** Returns a Vecter3 */
export function vec(x, y, z) {
    return new Vector3(x, y, z);
}

/**
 * Converts Euler angles, provided as fractions of π, to a Quaternion.
 *
 * @param {Number} x - The rotation around the X-axis, as a fraction of π.
 * @param {Number} y - The rotation around the Y-axis, as a fraction of π.
 * @param {Number} z - The rotation around the Z-axis, as a fraction of π.
 * @returns {Quaternion} A Quaternion representing the given Euler angles.
 */
export function quat_pi(x, y, z) {
    return new Quaternion().setFromEuler(
        new Euler(x * Math.PI, y * Math.PI, z * Math.PI)
    );
}

/**
 * Converts Euler angles, provided in radians, to a Quaternion.
 *
 * @param {Number} x - The rotation around the X-axis in radians.
 * @param {Number} y - The rotation around the Y-axis in radians.
 * @param {Number} z - The rotation around the Z-axis in radians.
 * @returns {Quaternion} A Quaternion representing the given Euler angles.
 */
export function quat_eu(x, y, z) {
    return new Quaternion().setFromEuler(new Euler(x, y, z));
}

/**
 * Creates a Quaternion that rotates from one unit vector `u` to `v`.
 *
 * @param {Vector3} u - The starting unit vector.
 * @param {Vector3} v - The target unit vector.
 * @returns {Quaternion} A Quaternion representing the rotation u to v.
 */
export function quat_uv(u, v) {
    return new Quaternion().setFromUnitVectors(
        u.clone().normalize(), v.clone().normalize()
    );
}

/**
 * Creates a Quaternion from an axis and an angle.
 *
 * @param {Vector3} axis - The axis around which the rotation occurs.
 * @param {Number} angle - The angle of rotation in radians.
 * @returns {Quaternion} A Quaternion from axis and angle.
 */
export function quat_aa(axis, angle) {
    return new Quaternion().setFromAxisAngle(
        axis.normalize(), angle
    );
}

/**
 * Calculates the angle opposite to side 'a' in a triangle using 
 * the Law of Cosines.
 *
 * @param {Number} a - The length of a side (the oppo. angle to be calculated)
 * @param {Number} b - The length of a side
 * @param {Number} c - The length of a side
 * @returns {Number} The angle opposite side 'a', in radians.
 */
function findAngle(a, b, c) {
    if (c === 0) return 0;
    const upper = (b * b) + (c * c) - (a * a);
    const lower = (2 * b * c);
    return Math.acos(upper / lower);
}

/**
 * This function computes the quaternions for shoulder and elbow,
 * such that given a parameter `theta` and a target point `T` in 
 * the shoulder coordinate, the wrist joint hits the target point,
 * and if `theta` is 0 (default value), the y-position of wrist is
 * minimized.
 * 
 * @param {Vector3} T target point defined in Shoulder coordinate
 * @param {Number} theta a tuning parameter to control the elbow's position
 * @param {Number} mul a tuning parameter to adjust imaginary 'wrist' point
 * @returns a pair of quaternions for shoulder and elbow
 */
export function wristLocator(T, theta=0, mul=1, bar=SKELETAL_METRICS.UPR_ARM) {
    // The lengths of the sides of the triangle SEW
    const [a, b, c] = [bar, bar * mul, T.length()];
    // Edge case: target point and shoulder coincide
    if (c === 0) {
        return [new Quaternion(), quat_aa(vec(-1,0,0), Math.PI)];
    }
    // Find anlges and compute quaternion for elbow
    const alpha = findAngle(a, b, c);
    const beta  = findAngle(b, a, c);
    const q0 = quat_aa(vec(-1,0,0), alpha + beta);

    // Compute quaternion for shoulder
    // 1. Rotate inner elbow to the target direction
    const phi = Math.atan2(T.x, T.z);
    const q1 = quat_aa(vec(0,1,0), phi);

    // 2. Raise/lower the upper arm to align the wrist with the target
    const psi = Math.acos(-T.y / T.length()) || 0;  // Avoid: NaN
    const q2 = quat_aa(vec(1,0,0), beta - psi);

    // 3. Adjusts the elbow's position in response to the 'theta' parameter
    const axis = vec(0,1,0).applyAxisAngle(vec(1,0,0), -beta);
    const q3 = quat_aa(axis, Math.PI * theta);

    return {
        elbowQuat: q0, 
        shldrQuat: q1.multiply(q2).multiply(q3)
    };
}


/**
 * This function computes the return values such that,
 * given the target point's x and y coordinates, the forearm
 * is aligned parallel with the shoulder axis.
 * 
 * @param {Number} tx target point's x
 * @param {Number} ty target point's y
 * @param {Number} handness right = 1, left = -1
 * @returns elbow quaternion, shoulder quaternion, tz
 */
export function parallelLocator(tx, ty, handness=1) {
    const ARM_LEN = SKELETAL_METRICS.UPR_ARM;
    // Compute tz
    const elbowX = (tx - handness * ARM_LEN);
    const tz = Math.sqrt((ARM_LEN ** 2) - (elbowX) ** 2 - (ty ** 2));
    const T = vec(tx, ty, tz);

    // Compute elbow quaternion
    const dist = T.length();
    const gamma = findAngle(dist, ARM_LEN, ARM_LEN);
    const q0 = quat_aa(vec(-1,0,0), Math.PI - gamma);

    // Compute shoulder quaternion
    const q1 = quat_aa(vec(-1,0,0), Math.atan2(tz, -ty));
    const q2 = quat_aa(vec( 0,1,0), Math.PI * 0.5 * handness);
    const q3 = quat_aa(vec( 1,0,0), Math.PI * 0.5 - gamma);
    
    return {
        elbowQuat: q0, 
        shldrQuat: q1.multiply(q2).multiply(q3),
        tz: tz
    };
}


/**
 * Given a wrist mesh reference, this orienter computes and returns a
 * quaternion and a euler representing the orientation align with the 
 * given lookAt vector and up parameter. This orienter need to run in
 * the useFrame hooks.
 * 
 * @param {React.MutableRefObject<React.JSX.Element>} ref the wrist mesh
 * @param {Vector3} lookAtVec target direction (world coordinates)
 * @param {Number} upParam a parameter tuning the up vector
 * @returns a Quaternion and a Euler, representing the current orientation
 */
export function plamOrienter(ref, lookAtVec, upParam) {
    const worldPosition = vec(0,0,0);
    const up = vec(0,1,0).applyAxisAngle(vec(0,0,1), Math.PI * upParam);

    // Adjusting orientation
    ref.current.getWorldPosition(worldPosition);
    ref.current.lookAt(worldPosition.clone().add(lookAtVec));
    ref.current.up.set(...up);

    // Get a copy of current orientation
    const quat = ref.current.quaternion.clone();
    const euler = new Euler().setFromQuaternion(quat, 'XYZ');

    return { wristQuat: quat, wristEuler: euler };
}
