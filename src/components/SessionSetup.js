import { useState, useRef, useEffect } from 'react';
import { useSessionContext } from '../contexts/SessionContext';
import { CONJECTURE_LIST, EXPT_COND_TYPE } from '../constants/experimentMeta';
import { Select, Button, Form, Typography, Divider } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import '../App.css';
import 'antd/dist/reset.css';


// Import modules for file system and path operations
const { ipcRenderer } = window.require('electron'); 
const fs = window.require('fs');
const path = window.require('path');
const { Title } = Typography;


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


function Result({}) {
    return (
        <div>
            Result placeholder.
        </div>
    );
}

function SessionSetup({ onClickNext }) {
    // Hooks of contexts, states and refs
    const session = useSessionContext();
    const [exptPath,  setExptPath ] = useState('');
    const [exptCond,  setExptCond ] = useState('');
    const [pidString, setPidString] = useState('');
    const [isConfirm, setIsConfirm] = useState(false);
    const [isScanned, setIsScanned] = useState(false);
    const usedNumbersSetRef = useRef(new Set());

    /**
     * Scans the experiment folder, filters subfolders by the given 
     * experiment condition prefix, and updates the set of used participant 
     * ID numbers.
     */
    const scanSessionFolders = () => {
        // Read the directory contents
        fs.readdir(exptPath, (err, files) => {
            if (err) {
                console.error(`Error reading directory: ${err.message}`);
                return;
            }
            // Filter subfolders with the prefix matching exptCond
            const matchingFolders = files.filter(
                file => fs.statSync(path.join(exptPath, file)).isDirectory()
            ).filter(folder => folder.startsWith(exptCond)); 
    
            // Extract suffix pid-numbers
            const usedNumbers = matchingFolders.map(folder => folder.slice(-2));
            usedNumbersSetRef.current = new Set(usedNumbers);
            // Log the updated set
            console.log('Updated Set:', usedNumbersSetRef.current);
            setIsScanned(true);
        });
    };

    useEffect(() => {
        if (exptPath && exptCond) {
            scanSessionFolders();
        }
    }, [exptPath, exptCond]);


    const handleSelectExptPath = async () => {
        const result = await ipcRenderer.invoke('dialog:openDirectory');
        if (!result.canceled && result.filePaths.length > 0) {
            setExptPath(result.filePaths[0]);
        }
        setIsScanned(false);
        setPidString('');
    };

    const handleSelectExptCond = (value) => {
        setExptCond(value);
        setIsScanned(false);
        setPidString('');
    }

    const handleSelectPid = (value) => {
        console.log(`value: ${value}`);
        setPidString(value);
    }

    const handleClickConfirm = () => {
        // construct session metadata
        session.current.exptCondition = exptCond;
        session.current.participantId = Number(pidString);
        session.current.uid = exptCond + '_' + pidString;
        session.current.savePath = `${exptPath}/${session.current.uid}`;
        session.current.shuffledIndex = getShuffledIndex();
        session.current.creationTime = new Date().toLocaleString();

        // Print session metadata to console
        console.log(`'Confirm' is clicked.`);
        console.log(session.current);

        // Create new session folder at experiment directory
        if (!fs.existsSync(session.current.savePath)) {
            try {
                fs.mkdirSync(session.current.savePath);
                console.log(`Session folder created at ${session.current.savePath}`);
                setIsConfirm(true);
            } catch (error) {
                console.error(`Error creating folder: ${error.message}`);
            }
        } else {
            console.log(`Session folder already exists at ${session.current.savePath}`);
        }

        //onClickNext();
    };

    const _place_holder = () => {
        return <span style={{color: '#ed5311'}}>No folder selected...</span>
    }

    const _expt_path_text = (pathArgs) => {
        return <span style={{color: '#5d4deb'}}>{pathArgs}</span>
    }

    const _select_expt_path = () => (
        <Form.Item>
            <Button
                icon={<FolderOpenOutlined />}
                onClick={handleSelectExptPath}
                disabled={isConfirm}
                block
            >
                Select the experiment folder
            </Button>
            <Typography.Paragraph>
                {exptPath ? _expt_path_text(exptPath) : _place_holder()}
            </Typography.Paragraph>
        </Form.Item>
    );

    const _select_expt_cond = () => (
        <Form.Item
            label={<span style={{ fontWeight: '600', fontSize: '16px' }}>Experiment Condition</span>}
        >
            <Select
                placeholder='Select a condition'
                options={Object.keys(EXPT_COND_TYPE).map(key => ({
                    value: key,
                    label: key,
                }))}
                onChange={handleSelectExptCond}
                disabled={isConfirm || !exptPath}
            />
        </Form.Item>
    );
    
    const SelectPid = () => {
        console.log(`running from the SelectPid`);
        return (
        <Form.Item
            label={<span style={{ fontWeight: '600', fontSize: '16px' }}>Participant ID</span>}
        >
            <Select
                placeholder='Select a number'
                options={Array.from({ length: 60 }, (_, i) => ({
                    value: getFormattedPid(i + 1),
                    label: getFormattedPid(i + 1),
                    disabled: usedNumbersSetRef.current.has(getFormattedPid(i + 1)),
                }))}
                defaultValue={pidString === '' ? undefined : pidString}
                onChange={handleSelectPid}
                disabled={isConfirm || !exptCond}
            />
        </Form.Item>);
    };

    const _button_confirm = () => (
        <Form.Item>
            <Button
                type='primary'
                onClick={handleClickConfirm}
                disabled={!exptCond || !pidString || !exptPath || isConfirm}
                block
            >
                Confirm
            </Button>
        </Form.Item>
    );


    return (
        <div className='session-setup-box'>
            <div className='session-setup-container'>
                <Title level={2} style={{ textAlign: 'center' }}>Session Setup</Title>
                <Form layout='vertical'>
                    {_select_expt_path()}
                    {_select_expt_cond()}
                    <SelectPid />
                    {_button_confirm()}
                </Form>
            </div>
            <div style={{width: '90%'}}><Divider /></div>
            <Result />
        </div>
    );
}

export default SessionSetup;

