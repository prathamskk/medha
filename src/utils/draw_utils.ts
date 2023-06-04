// https://github.com/tensorflow/tfjs-models/blob/9b5d3b663638752b692080145cfb123fa324ff11/pose-detection/demos/live_video/src/camera.js
import * as poseDetection from '@tensorflow-models/pose-detection';

/**
 * Draws the keypoints and skeleton on the canvas
 *
 * @param {(obj[])} Array of objects
 * @param {(obj)} video object
 * @param {(int)} video width
 * @param {(int)} video height
 * @param {(obj)} canvas object
 * @returns void
 * @memberof Options
 */
export const drawCanvas = (
    poses: { keypoints: any }[],
    video: any,
    videoWidth: any,
    videoHeight: any,
    canvas: any,
) => {
    if (canvas.current == null) return;
    const ctx = canvas.current.getContext('2d');

    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    if (poses[0].keypoints != null) {
        drawKeypoints(poses[0].keypoints, ctx);
        drawAngle(poses[0].keypoints, ctx);
        // drawSkeleton(poses[0].keypoints, poses[0].id, ctx);
    }
};

/**
 * Draw the keypoints on the video.
 * @param keypoints A list of keypoints.
 */
export function drawKeypoints(
    keypoints: any,
    ctx: any,
) {
    const noseYPosition = keypoints[2].y;

    const keypointInd = poseDetection.util.getKeypointIndexBySide(
        poseDetection.SupportedModels.MoveNet
    );
    ctx.fillStyle = 'Red';
    ctx.strokeStyle = 'White';
    ctx.lineWidth = 1;

    ctx.fillStyle = 'rgba(0, 255, 0, 0.9)'; // green if delta is positive

    for (const i of keypointInd.middle) {
        drawKeypoint(keypoints[i], ctx);
    }

    // ctx.fillStyle = "Green";
    for (const i of keypointInd.left) {
        drawKeypoint(keypoints[i], ctx);
    }

    // ctx.fillStyle = "Orange";
    for (const i of keypointInd.right) {
        drawKeypoint(keypoints[i], ctx);
    }
}

function drawKeypoint(keypoint: any, ctx: any) {
    // If score is null, just show the keypoint.
    const score = keypoint.score != null ? keypoint.score : 1;
    const scoreThreshold = 0.3;

    if (score >= scoreThreshold) {
        const circle = new Path2D();
        circle.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);

        ctx.fill(circle);
        // ctx.stroke(circle);
    }
}

/**
 * Draw the skeleton of a body on the video.
 * @param keypoints A list of keypoints.
 */
export function drawSkeleton(keypoints: any, poseId: any, ctx: any) {
    // Each poseId is mapped to a color in the color palette.
    const color = 'White';
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;

    poseDetection.util
        .getAdjacentPairs(poseDetection.SupportedModels.MoveNet)
        .forEach(([i, j]) => {
            const kp1 = keypoints[i];
            const kp2 = keypoints[j];

            // If score is null, just show the keypoint.
            const score1 = kp1.score != null ? kp1.score : 1;
            const score2 = kp2.score != null ? kp2.score : 1;
            const scoreThreshold = 0.3 || 0;

            if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
                ctx.beginPath();
                ctx.moveTo(kp1.x, kp1.y);
                ctx.lineTo(kp2.x, kp2.y);
                ctx.stroke();
            }
        });
}
function calculateAngle(a: [number, number], b: [number, number], c: [number, number]) {
    const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
    let angle = (radians * 180.0) / Math.PI


    return angle;
}

export function drawAngle(
    keypoints: any,
    ctx: any,
) {
    let nosePosition: [number, number] = [keypoints[0].x, keypoints[0].y]
    let leftHipPosition: [number, number] = [keypoints[11].x, keypoints[11].y]
    let rightHipPosition: [number, number] = [keypoints[12].x, keypoints[12].y];
    let bodyCenterPosition: [number, number] = [(leftHipPosition[0] + rightHipPosition[0]) / 2, (leftHipPosition[1] + rightHipPosition[1]) / 2]
    let referencePosition: [number, number] = [150, 0]

    let angle = calculateAngle(nosePosition, bodyCenterPosition, referencePosition)
    // console.log(angle);

    const noseYPosition = keypoints[0].y;
    const noseXPosition = keypoints[0].x;

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(150, 0);
    ctx.lineTo(150, 300);
    ctx.stroke();

    // show current posture height
    // ctx.strokeStyle = "White";
    // ctx.lineWidth = 2;

    ctx.beginPath(); // Start a new path
    ctx.moveTo(noseXPosition, noseYPosition);
    ctx.lineTo(150, 300);
    ctx.stroke(); // Render the path

    //draw angle text on canvas
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Angle: ' + angle.toFixed(2), 120, 50);


}