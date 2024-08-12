import { useState, useRef, useEffect } from 'react';
import { CONJECTURE_LIST, EXPT_COND_TYPE } from '../constants/experimentMeta';
import { useSessionContext } from '../contexts/SessionContext';
import { Select, Button, Form, Typography, Divider } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';


/** Import modules for file system and path operations */
const { ipcRenderer } = window.require('electron'); 
const fs = window.require('fs');
const path = window.require('path');

/** Util: create a shuffled list of index */
function getShuffledIndex() {
    const n = Object.keys(CONJECTURE_LIST).length;
    const seq = Array.from({ length: n }, (_, i) => i);

    for (let i = seq.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [seq[i], seq[j]] = [seq[j], seq[i]];
    }
    return seq;
}

/** Util: convert input number to be a double digit string, eg. '01' */
function getFormattedPid(pid) {
    return pid.toString().padStart(2, '0');
}

/** css-html-util: create a styled span */
function _span(style, message) {
    return <span style={style}>{message}</span>;
}

/**
 * This component manages the configuration and initialization of an 
 * experiment session, including specifying the experiment folder, 
 * choosing the experiment condition, and selecting the participant ID.
 * 
 * Upon clicking the `Launch Session` button, a new session folder will be 
 * created at the specified path, and a JSON file containing the session 
 * metadata will be saved in the session folder.
 * 
 * @param {Function} Props.onComplete - Informs the parent component that
 *                                      the setup has completed.
 * @returns {JSX.Element} The rendered SessionSetup component.
 */
function SessionSetup({ onComplete }) {
    // Hooks of context, state and ref
    const { metadata } = useSessionContext();
    const [exptPath,  setExptPath ] = useState(undefined);
    const [exptCond,  setExptCond ] = useState(undefined);
    const [pidString, setPidString] = useState(undefined);
    const [isConfirm, setIsConfirm] = useState(false);
    const [isScanned, setIsScanned] = useState(false);
    const usedNumsRef = useRef(new Set());

    // Scan all current session folders to update usedNumsRef, which
    // disabled used numbers in options of Participant ID selection.
    function scanSessionFolders() {
        // Read the directory contents
        fs.readdir(exptPath, (err, fsEntries) => {
            if (err) {
                console.error(`Error reading directory: ${err.message}`);
                return;
            }
            // Filter subfolders with the prefix matching exptCond
            const usedNums = fsEntries.filter(
                obj => fs.statSync(path.join(exptPath, obj)).isDirectory()
            ).filter(
                dir => dir.startsWith(exptCond)
            ).map(
                dir => dir.slice(-2)
            );
            // Update used numbers and set scan finished
            usedNumsRef.current = new Set(usedNums);
            console.log(`${exptCond} used:`, usedNumsRef.current);
            setIsScanned(true);
        });
    }

    useEffect(() => {
        if (exptPath && exptCond) {
            scanSessionFolders();
        }
    }, [exptPath, exptCond]);

    async function handleSelectExptPath() {
        // Reset scan and pid
        setIsScanned(false);
        setPidString(undefined);
        // Update exptPath
        const result = await ipcRenderer.invoke('dialog:openDirectory');
        if (!result.canceled && result.filePaths.length > 0) {
            setExptPath(result.filePaths[0]);
        }
    }

    function handleSelectExptCond(value) {
        setIsScanned(false);
        setPidString(undefined);
        setExptCond(value);
    }

    function writeSessionMetaFile() {
        const fileName = 'session-meta.json';
        const filePath = path.join(metadata.current.savePath, fileName);
        const jsonText = JSON.stringify(metadata.current, null, 2);
        try {
            fs.writeFileSync(filePath, jsonText);
            console.log(`Meta file has been saved to ${filePath}`);
            return true;
        } catch (err) {
            console.error(`Error writing Meta file: ${err.message}`);
            return false;
        }
    }

    function handleClickConfirm() {
        // Construct session metadata
        metadata.current.exptCondition = exptCond;
        metadata.current.participantId = Number(pidString);
        metadata.current.uid = exptCond + '_' + pidString;
        metadata.current.savePath = `${exptPath}/${metadata.current.uid}`;
        metadata.current.shuffledIndex = getShuffledIndex();
        metadata.current.creationTime = new Date().toLocaleString();
        // Print to console
        console.log(metadata.current);

        // Check path existance
        if (fs.existsSync(metadata.current.savePath)) {
            console.error('Session folder already exists.');
            return;
        }
        // Create session folder and write metadata
        try {
            fs.mkdirSync(metadata.current.savePath);
            const opResultFlag = writeSessionMetaFile();
            setIsConfirm(opResultFlag);
        } catch (err) {
            console.error(`Error creating folder: ${err.message}`);
        }
        // Perform transition
        onComplete();
    }

    // -- Below are subfunctions for rendering JSX -- :::::::::::::::::::::: //
    function _title(title) {
        const style = {
            textAlign: 'center', 
            marginBottom: '40px',
        };
        return (
            <Typography.Title level={2} style={style} children={title} />
        );
    }

    function _item_button_expt_path() {
        const selectedPath = (exptPath ? 
            _span({color: '#5d4deb'}, exptPath) :
            _span({color: '#ed5311'}, 'No folder selected...')
        );
        return (
            <Form.Item style={{ marginBottom: '12px' }}>
                <Button
                    icon={<FolderOpenOutlined />}
                    onClick={handleSelectExptPath}
                    disabled={isConfirm}
                    block
                    children='Select the experiment folder'
                />
                <Typography.Paragraph children={selectedPath} />
            </Form.Item>
        );
    }

    function _item_select_expt_cond() {
        const style = { fontWeight: '600', fontSize: '16px' };
        return (
            <Form.Item style={{ marginBottom: '24px' }}
                label={_span(style, 'Experiment Condition')}
            >
                <Select
                    placeholder='Select a condition'
                    options={Object.keys(EXPT_COND_TYPE).map(key => ({
                        value: key,
                        label: key,
                    }))}
                    value={exptCond}
                    onChange={handleSelectExptCond}
                    disabled={isConfirm || !exptPath}
                />
            </Form.Item>
        );
    }
    
    function _item_select_pid() {
        const style = { fontWeight: '600', fontSize: '16px' };
        // Dynamically generate options based on subfolder status
        const options = Array.from({ length: 60 }, (_, i) => {
            const tempId = getFormattedPid(i + 1);
            return {
                value: tempId,
                label: tempId,
                disabled: usedNumsRef.current.has(tempId),
            }
        });
        return (
            <Form.Item style={{ marginBottom: '6px' }}
                label={_span(style, 'Participant ID')}
            >
                <Select
                    placeholder='Select a number'
                    options={options}
                    value={pidString}
                    onChange={setPidString}
                    disabled={isConfirm || !exptCond}
                />
            </Form.Item>
        );
    }

    function _item_divider() {
        return (
            <Form.Item style={{ marginBottom: '6px' }}>
                <Divider />
            </Form.Item>
        );
    }

    function _item_button_confirm() {
        return (
            <Form.Item>
                <Button
                    type='primary'
                    onClick={handleClickConfirm}
                    disabled={isConfirm || !pidString}
                    block
                    children='Launch Session'
                />
            </Form.Item>
        );
    }

    return (
        <div className='session-setup-box'>
            <div className='session-setup-container'>
                {_title('Session Setup')}
                <Form layout='vertical'>
                    {_item_button_expt_path()}
                    {_item_select_expt_cond()}
                    {_item_select_pid()}
                    {_item_divider()}
                    {_item_button_confirm()}
                </Form>
            </div>
        </div>
    );
}

export default SessionSetup;