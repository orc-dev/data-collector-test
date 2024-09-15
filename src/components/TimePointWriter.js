import { useEffect } from 'react';
import { useSessionContext } from '../contexts/SessionContext';
import { useMediaToolsContext } from '../contexts/MediaToolsContext';

const { ipcRenderer } = window.require('electron'); 
const path = window.require('path');


function TimePointWriter({ roundId }) {
    const session = useSessionContext();
    const { timeBuf } = useMediaToolsContext();

    const fileName = 'time-points.json';
    const filePath = path.join(session.current.savePath, fileName);

    useEffect(() => {
        if (roundId === 6 && timeBuf.current.length > 0) {
            const jsonData = JSON.stringify(timeBuf.current, null, 2);
            ipcRenderer.send('write-timepoint', filePath, jsonData);
        }
    }, [roundId]);

    return null;
}

export default TimePointWriter;