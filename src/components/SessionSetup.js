import { useState } from 'react';
import { useApplicationContext } from '../contexts/ApplicationContext';
import { GROUP_TYPE } from '../constants/experimentMeta';
import '../App.css';

// Import Electron's ipcRenderer
const { ipcRenderer } = window.require('electron'); 
const fs = window.require('fs');
const path = window.require('path');

const SessionSetup = ({ onClickNext }) => {
    const { session } = useApplicationContext();
    const [groupType, setGroupType] = useState('');
    const [serialNum, setSerialNum] = useState(-1);
    const [savePath, setSavePath] = useState('');

    const handleDropDownOnChange = (e) => {
        setGroupType(e.target.value);
    };

    const handleNumberInputOnChange = (e) => {
        setSerialNum(Number(e.target.value));
    };

    const handleSelectFolder = async () => {
        const result = await ipcRenderer.invoke('dialog:openDirectory');
        if (!result.canceled && result.filePaths.length > 0) {
            setSavePath(result.filePaths[0]);
        }
    };

    const handleClickConfirm = () => {
        // Build session's metadata
        session.current.groupType = groupType;
        session.current.serialNum = serialNum;
        session.current.uid = groupType + '_' + serialNum.toString().padStart(2, '0');
        session.current.savePath = `${savePath}/${session.current.uid}`;

        // Print session metadata to console
        console.log(`'Confirm' is clicked.`);
        console.log(session.current);

        // Create the folder at session.current.savePath
        if (!fs.existsSync(session.current.savePath)) {
            fs.mkdirSync(session.current.savePath, { recursive: true });
            console.log(`Directory created at ${session.current.savePath}`);
        } else {
            console.log(`Directory already exists at ${session.current.savePath}`);
        }

        //onClickNext();
    };

    const numberOptions = Array.from({ length: 50 }, (_, i) => i + 1);

    return (
        <div className='session-setup-box'>
            <h1>Session Setup</h1>
            {/* Dropdown menu for group type */}
            <div>
                <label htmlFor='dropdown'>Experiment Condition: </label>
                <select 
                    id='dropdown'
                    value={groupType} 
                    onChange={handleDropDownOnChange}
                >
                    <option value=''>Select a Condition</option>
                    {Object.keys(GROUP_TYPE).map(key => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                </select>
            </div>
            {/* Dropdown menu for number input */}
            <div>
                <label htmlFor='numberInput'>Participant ID: </label>
                <select 
                    id="numberInput" 
                    value={serialNum} 
                    onChange={handleNumberInputOnChange}
                >
                    <option value=''>Select a Number</option>
                    {numberOptions.map((number) => (
                        <option key={number} value={number}>{number}</option>
                    ))}
                </select>
            </div>
            {/* Folder selection input */}
            <div>
                <label htmlFor='folderInput'>Session Directory: </label>
                <button onClick={handleSelectFolder}>Select Folder</button>
                {savePath && <p>Selected Path: {savePath}</p>}
            </div>
            <button onClick={handleClickConfirm} 
                disabled={!groupType || !serialNum || !savePath}>Confirm</button>
        </div>
    );
}

export default SessionSetup;

