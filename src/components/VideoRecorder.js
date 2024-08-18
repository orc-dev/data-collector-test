import { useEffect, useRef } from 'react';
import { useSessionContext } from '../contexts/SessionContext';
import { CONJECTURE_LIST } from '../constants/experimentMeta';
const { ipcRenderer } = window.require('electron');


function videoSavePath(session, roundId) {
    const dirPath = session.current.savePath;
    const uid = session.current.uid;
    if (roundId === -1) {
        return `${dirPath}/${uid}_Intro.webm`;
    }
    const cid = session.current.shuffledIndex[roundId] + 1;
    return `${dirPath}/${uid}_C${cid}.webm`;
}

function VideoRecorder({ videoStream, audioStream, roundId }) {
    // Context, refs and constants
    const session = useSessionContext();
    const recorderRef = useRef(null);
    const isRecording = useRef(false);
    const chunks = useRef([]);
    const totalConj = Object.keys(CONJECTURE_LIST).length;

    function startRecording() {
        if (!videoStream || !audioStream) {
            console.error('No video or audio stream available for recording.');
            return;
        }
        console.log('Starting recording...');
        // Combine video and audio streams
        const mediaStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...audioStream.getAudioTracks(),
        ]);
        const options = { mimeType: 'video/webm; codecs=vp9,opus' };

        recorderRef.current = new MediaRecorder(mediaStream, options);

        recorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.current.push(event.data);
            }
        };
        recorderRef.current.onstop = () => {
            console.log('Recording stopped.');
            const blob = new Blob(chunks.current, { type: 'video/webm' });
            saveRecording(blob);
            chunks.current = []; // Clear chunks after saving
        };
        recorderRef.current.start();
        isRecording.current = true;
        console.log('Recording started.');
    };

    function stopRecording() {
        if (recorderRef.current) {
            console.log('Stopping recording...');
            recorderRef.current.stop();
            isRecording.current = false;
        }
    };

    function saveRecording(blob) {
        const reader = new FileReader();
        reader.onload = function () {
            const buffer = Buffer.from(reader.result);
            const savePath = videoSavePath(session, roundId);
            ipcRenderer.send('save-recording', savePath, buffer);
        };
        reader.readAsArrayBuffer(blob);

        ipcRenderer.once('save-recording-success', (event, savedPath) => {
            console.log('Recording saved at:', savedPath);
        });

        ipcRenderer.once('save-recording-error', (event, errorMessage) => {
            console.error('Error saving recording:', errorMessage);
        });
    };

    // Start/stop recording for each conjecture
    useEffect(() => {
        // Do nothing 'at the _INIT_ stage' or 'no stream inputs'
        if (roundId === -2 || !videoStream) {
            return;
        }
        if (isRecording.current) {
            stopRecording();
        }
        if (!isRecording.current && roundId < totalConj) {
            startRecording();
        }
    }, [videoStream, roundId]);

    return null;
}

export default VideoRecorder;