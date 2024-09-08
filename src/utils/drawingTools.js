import { CONN_KEYS, NODE_KEYS } from '../constants/landmarkMeta';
export { drawSkeletons, drawScanningBox };

/** Draws a line segment on a canvas. */
function drawLine(W, H, ctx, px, py, qx, qy) {
    ctx.beginPath();
    ctx.moveTo(px * W, py * H);
    ctx.lineTo(qx * W, qy * H);
    ctx.closePath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ffffff';
    ctx.lineCap = 'round';
    ctx.stroke();
}

/** Draws a node mark on a canvas. */
function drawHandNode(W, H, ctx, cx, cy) {
    // larger circle
    ctx.beginPath();
    ctx.arc(cx * W, cy * H, 1, 0, 2 * Math.PI);
    ctx.fillStyle = '#7cdafc';
    ctx.fill();
    ctx.closePath();
}

/** Draws a node mark on a canvas. */
function drawPoseNode(W, H, ctx, cx, cy) {
    // larger circle
    ctx.beginPath();
    ctx.arc(cx * W, cy * H, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#fc3063';
    ctx.fill();
    ctx.closePath();
    // middle circle
    ctx.beginPath();
    ctx.arc(cx * W, cy * H, 2.3, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.closePath();
}

/**
 * Draws a skeleton for current frame.
 * 
 * @param {number} W - The width of the canvas
 * @param {number} H - The height of the canvas
 * @param {CanvasRenderingContext2D} ctx - The 2D drawing context
 * @param {Object} record - Landmark coordinates of current frame
 */
function drawSkeletons(W, H, ctx, record) {
    // Helper to get coordinates from keys
    const fetch = (keys) => keys.map(k => record[k]);

    // Determine indices (let hand-wrists overwrite pose-wrists)
    const idxL = (record['L0_x'] === -1) ? 1 : 0;
    const idxR = (record['R0_x'] === -1) ? 1 : 0;

    // Draw connections
    const connections = [
        ...CONN_KEYS.pose, 
        ...CONN_KEYS.handL,
        ...CONN_KEYS.handR,
        CONN_KEYS.armL[idxL],
        CONN_KEYS.armR[idxR],
    ];
    for (const keys of connections) {
        drawLine(W, H, ctx, ...fetch(keys));
    }
    
    // Draw landmark nodes
    const poseNodes = [
        ...NODE_KEYS.pose,
        NODE_KEYS.wristL[idxL],
        NODE_KEYS.wristR[idxR],
    ];
    for (const keys of poseNodes) {
        drawPoseNode(W, H, ctx, ...fetch(keys));
    }
}


function drawScanningBox(W, H, ctx, mul) {
    ctx.save();
    ctx.fillStyle = `rgba(0,255,0,0.25)`;
    ctx.fillRect(W - W * mul, 0, W * mul, H);
    ctx.restore();
}