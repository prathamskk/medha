import React, { useEffect } from 'react'
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';
import Webcam from 'react-webcam';
import { useRef } from "react"
import { drawKeypoints, drawSkeleton, drawCanvas } from '../utils/draw_utils';
import { Stack } from '@mui/material';
//@ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var dps = [
    { x: 0, y: 0 }];
var xVal = dps.length + 1;
var yVal = 0;
var updateInterval = 1000;

const AngleDetector = () => {
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef(null);

    const runMovenet = async () => {
        //await backend before using
        await tf.setBackend('webgl');
        await tf.ready();


        const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
        const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
        setInterval(() => {
            detect(detector);
        }, 1000)
    }

    const detect = async (detector: poseDetection.PoseDetector) => {
        if (webcamRef.current !== null && webcamRef.current.video !== null) {
            if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
                //Get Video Properties
                const video = webcamRef.current.video;
                const videoWidth = webcamRef.current.video.videoWidth;
                const videoHeight = webcamRef.current.video.videoHeight;
                //Set Video Width
                webcamRef.current.video.width = videoWidth;
                webcamRef.current.video.height = videoHeight;
                //Make Detections
                const poses = await detector.estimatePoses(video);
                // console.log(poses);
                // check for valid pose for our use case and draw the keypoints and skeleton
                if (
                    !poses ||
                    !poses[0] ||
                    !poses[0].keypoints ||
                    poses[0].keypoints.length < 3
                )
                    return;

                drawCanvas(
                    poses,
                    video,
                    videoWidth,
                    videoHeight,
                    canvasRef,
                );
                updateChart(await handlePose(poses) || 0);

            }
        }
    }

    function calculateAngle(a: [number, number], b: [number, number], c: [number, number]) {
        const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
        let angle = (radians * 180.0) / Math.PI


        return angle;
    }


    const handlePose = async (poses: { keypoints: { x: number, y: number }[] }[]) => {
        try {
            let nosePosition: [number, number] = [poses[0].keypoints[0].x, poses[0].keypoints[0].y]
            let leftHipPosition: [number, number] = [poses[0].keypoints[11].x, poses[0].keypoints[11].y]
            let rightHipPosition: [number, number] = [poses[0].keypoints[12].x, poses[0].keypoints[12].y];
            let bodyCenterPosition: [number, number] = [(leftHipPosition[0] + rightHipPosition[0]) / 2, (leftHipPosition[1] + rightHipPosition[1]) / 2]
            let referencePosition: [number, number] = [150, 0]

            let angle = calculateAngle(nosePosition, bodyCenterPosition, referencePosition)
            // console.log(angle);
            return angle
        } catch (error) {
            console.error(error);
        }
    };
    const chartRef = useRef(null);
    const updateChart = (angle: number) => {
        yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
        dps.push({ x: xVal, y: angle });
        xVal++;
        if (dps.length > 10) {
            dps.shift();
        }
        // chartRef.current.render();
        forceUpdate()
    };

    // useEffect(() => {
    //     const updateChart = () => {
    //         yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
    //         dps.push({ x: xVal, y: yVal });
    //         xVal++;
    //         if (dps.length > 10) {
    //             dps.shift();
    //         }
    //         // chartRef.current.render();
    //         forceUpdate()
    //     };

    //     const interval = setInterval(updateChart, updateInterval);

    //     return () => {
    //         clearInterval(interval);
    //     };
    // }, []);

    const options = {
        title: {
            text: "Romberg Sway"
        },
        data: [
            {
                type: "line",
                dataPoints: dps
            }
        ],
        axisY: {
            interval: 5,
            maximum: 60,
            minimum: -60
        },
        axisX: {
            interval: 1,
        }
    };
    runMovenet();
    const [cameraRear, setCameraRear] = React.useState(false)
    return (
        <>
            <Stack alignItems="center" gap={10} py={5}>
                <select onChange={(e) => setCameraRear(e.target.value === "true")}>
                    <option value={"false"}>Front Camera</option>
                    <option value={"true"}>Rear Camera</option>
                </select>
                <div style={{ position: "relative", width: "100%", height: 300 }}>

                    <Webcam
                        ref={webcamRef}
                        videoConstraints={{
                            width: 300,
                            height: 300,
                            facingMode: cameraRear ? "environment" : "user"
                        }}

                        style={{
                            position: "absolute",
                            marginLeft: "auto",
                            marginRight: "auto",
                            left: 0,
                            right: 0,
                            textAlign: "center",
                            zIndex: 9,
                            // width: "100%",
                        }}
                    />
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: "absolute",
                            marginLeft: "auto",
                            marginRight: "auto",
                            left: 0,
                            right: 0,
                            textAlign: "center",
                            zIndex: 9,
                            width: 300,
                            height: 300
                        }}

                    />
                </div>

                <CanvasJSChart options={options} ref={chartRef} />
            </Stack>

        </>
    )
}
export default AngleDetector