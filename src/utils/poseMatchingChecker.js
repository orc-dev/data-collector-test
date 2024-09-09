export { isMatch };

function isMatch(poseKey, currRecord) {
    if (!poseKey) {
        return false;
    }
    return MATCHING_FUNC[poseKey.label][poseKey.pid](currRecord);
}

function fetch(table, key) {
    return {
        x: table[`${key}_x`],
        y: table[`${key}_y`],
    };
}

function getAngle(L, R) {
    const dx = L.x - R.x;
    const dy = L.y - R.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
}

function getDist(L, R) {
    const dx = Math.abs(L.x - R.x);
    const dy = Math.abs(L.y - R.y);
    return {
        dx: dx,
        dy: dy,
        dr: Math.sqrt(dx * dx + dy * dy)
    }
}

function isInRange(A, target, epsilon) {
    return (target - epsilon) < A && A < (target + epsilon);
}

const MATCHING_FUNC = Object.freeze({
    Similar_Triangle: {
        1: (table) => _similar_triangle(table, 2.0, 0.2),
        2: (table) => _similar_triangle(table, 4.0, 0.4),
        3: (table) => _similar_triangle(table, 6.0, 0.4),
    },

    Parallelogram_Area: {
        1: (table) => _parallelogram_area(table, 2.1, 4.0),
        2: (table) => _parallelogram_area(table, 1.2, 1.8),
        3: (table) => _parallelogram_area(table, 2.1, 4.0),
    },

    Rectangle_Diags: {
        1: (table) => _rectangle_diags(table, 78, 10, 102, 10),
        2: (table) => _rectangle_diags(table, 78, 10, 125, 10),
        3: (table) => _rectangle_diags(table, 55, 10, 102, 10),
    },

    Opposite_Angles: {
        1: (table) => _opposite_angles(table, 70, 110, 8),
        2: (table) => _opposite_angles(table, 45, 135, 7),
        3: (table) => _opposite_angles(table, 25, 155, 8),
    },

    Triangle_AngleOppSide: {
        1: (table) => _triangle_angleOppSide(table, -10, 15, 120, 10),
        2: (table) => _triangle_angleOppSide(table, -10, 15,  90, 10),
        3: (table) => _triangle_angleOppSide(table, -10, 15,  50, 10),
    },

    Doubled_Area: {
        1: (table) => _doubled_area(table, 1.6, 1.5, 0.4, 0.3),
        2: (table) => _doubled_area(table, 3.0, 1.5, 0.4, 0.3),
        3: (table) => _doubled_area(table, 3.0, 3.0, 0.4, 0.4),
    },

    Line_Rotation: {
        1: (table) => _line_rotation(table,  0, 15),
        2: (table) => _line_rotation(table, 90, 15),
        3: (table) => _line_rotation(table,  0, 15),
    }
});


function _similar_triangle(table, tgtX, errX) {
    // left hand
    const L1 = fetch(table, 'L1');
    const L4 = fetch(table, 'L4');
    const L8 = fetch(table, 'L8');
    // right hand
    const R1 = fetch(table, 'R1');
    const R4 = fetch(table, 'R4');
    const R8 = fetch(table, 'R8');

    // Compute
    const indexL = getAngle(L1, L8);
    const indexR = getAngle(R1, R8);
    const thumbLen = getDist(L1, L4).dr;
    const dist = getDist(L1, R1);
    const data = [indexL, indexR, dist.dx, dist.dy];

    // Checks
    const tgt = [60, 120, thumbLen * tgtX,              0];
    const err = [20,  20, thumbLen * errX, thumbLen * 0.5];
    const checks = data.map((d,i) => isInRange(d, tgt[i], err[i]));
    
    return checks.every(bool => bool);
}

function _parallelogram_area(table, lower, upper) {
    // Fetch
    const wristL = fetch(table, 'L0');
    const elbowL = fetch(table, 'P13');
    const wristR = fetch(table, 'R0');
    const elbowR = fetch(table, 'P14');
    // Compute
    const angleL = getAngle(elbowL, wristL);
    const angleR = getAngle(wristR, elbowR);
    const armLen = getDist(elbowL, wristL).dr;
    const dx     = getDist(elbowL, elbowR).dx;
    // Check
    const checks = [
        isInRange(angleL, 0, 20), // Left arm horizontal 
        isInRange(angleR, 0, 20), // Right arm horizontal
        elbowL.y < elbowR.y,      // left arm is heigher than right arm
        dx > armLen * lower,      // set lower bounds
        dx < armLen * upper,      // set upper bounds
    ];
    return checks.every(bool => bool);
}

function _rectangle_diags(table, tgtL, errL, tgtR, errR) {
    // Fetch
    const wristL = fetch(table, 'L0');
    const elbowL = fetch(table, 'P13');
    const wristR = fetch(table, 'R0');
    const elbowR = fetch(table, 'P14');

    // Compute
    const armL = getAngle(elbowL, wristL);
    const armR = getAngle(elbowR, wristR);
    
    // Check
    const checkL = isInRange(armL, tgtL, errL);
    const checkR = isInRange(armR, tgtR, errR);

    return checkL && checkR;
}

function _opposite_angles(table, targetL, targetR, epsilon) {
    const wristL = fetch(table, 'L0');
    const elbowL = fetch(table, 'P13');
    const wristR = fetch(table, 'R0');
    const elbowR = fetch(table, 'P14');

    const isCross = (wristL.x > 0) && (wristR.x > 0) && (wristL.x < wristR.x);
    const angleL = getAngle(elbowL, wristL);
    const angleR = getAngle(elbowR, wristR);
    const angleChecks = isInRange(angleL, targetL, epsilon) || 
                        isInRange(angleR, targetR, epsilon);
            
    return isCross && angleChecks;
}

function _triangle_angleOppSide(table, tgtSE, errSE, tgtEW, errEW) {
    const wrist = fetch(table, 'R0');
    const elbow = fetch(table, 'P14');
    const shldr = fetch(table, 'P12');

    const angleSE = getAngle(shldr, elbow);
    const angleEW = getAngle(elbow, wrist);

    const upperArmCheck = isInRange(angleSE, tgtSE, errSE);
    const lowerArmCheck = isInRange(angleEW, tgtEW, errEW);

    return upperArmCheck && lowerArmCheck;
}

function _doubled_area(table, tgtX, tgtY, errX, errY) {
    // left hand
    const L1 = fetch(table, 'L1');
    const L4 = fetch(table, 'L4');
    const L8 = fetch(table, 'L8');
    // right hand
    const R1 = fetch(table, 'R1');
    const R4 = fetch(table, 'R4');
    const R8 = fetch(table, 'R8');

    // Compute
    const dx = (getDist(L1, L4).dr + getDist(R1, R4).dr) / 2;
    const dy = 0.7 * dx;
    const data = [
        getAngle(L1, L8),
        getAngle(R8, R1),
        getAngle(L4, L1),
        getAngle(R1, R4),
        getDist(L1, R1).dx,
        getDist(L1, R1).dy,
    ];
    // Check
    const target  = [ 0,  0, 110, 110, dx * tgtX, dy * tgtY];
    const epsilon = [15, 15,  25,  25, dx * errX, dy * errY];
    const checks = data.map((d, i) =>  isInRange(d, target[i], epsilon[i]));
    return checks.every(bool => bool);
}

function _line_rotation(table, tgtA, errA) {
    const wrist = fetch(table, 'R0');
    const elbow = fetch(table, 'P14');
    const shldr = fetch(table, 'P12');

    const angleSE = getAngle(shldr, elbow);
    const angleEW = getAngle(elbow, wrist);
    return isInRange(angleSE, tgtA, errA) && isInRange(angleEW, tgtA, errA);
}