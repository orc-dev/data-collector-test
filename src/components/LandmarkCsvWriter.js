import { useEffect } from 'react';
import { useSessionContext } from '../contexts/SessionContext';
import { CONJECTURE_LIST } from '../constants/experimentMeta';
import { CSV_COL_NAMES } from '../constants/landmarkMeta';
const { ipcRenderer } = window.require('electron');


function csvSavePath(session, roundId) {
    const dirPath = session.current.savePath;
    const uid = session.current.uid;
    if (roundId === -1) {
        return `${dirPath}/${uid}_Intro.csv`;
    }
    const cid = session.current.shuffledIndex[roundId] + 1;
    return `${dirPath}/${uid}_C${cid}.csv`;
}


function LandmarkCsvWriter({ csvBuf, roundId }) {
    // Context, refs and constants
    const session = useSessionContext();
    const totalConj = Object.keys(CONJECTURE_LIST).length;
    const key = (roundId - 1).toString();
    const opts = { fields: CSV_COL_NAMES };
    
    // Write landmarks to csv file
    useEffect(() => {
        // Skip '_INIT_' and Intro 
        if (roundId < 0 || roundId > totalConj) {
            return;
        }
        // write csvBuf to disk
        const filePath = csvSavePath(session, roundId - 1);
        const csvContent = csvBuf.current[key];
        
        if (csvContent) {
            // Send the file path and CSV content to the main process
            ipcRenderer.send('write-csv', filePath, csvContent, opts);

            ipcRenderer.once('write-csv-success', (event, message) => {
                console.log(message);
                csvBuf.current[key] = [];  // clear this buf slot
            });

            ipcRenderer.once('write-csv-failure', (event, message) => {
                console.error(message);
            });
        }
    }, [roundId]);

    return null;
}

export default LandmarkCsvWriter;