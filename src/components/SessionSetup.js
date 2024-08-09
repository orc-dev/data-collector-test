import { useState } from 'react';
import { useApplicationContext } from '../contexts/ApplicationContext';
import { GROUP_TYPE } from '../constants/experimentMeta';
import '../App.css';

const SessionSetup = ({ onClickNext }) => {
    const { experimentId } = useApplicationContext();
    const [selectedOption, setSelectedOption] = useState('');
    const [numberInput, setNumberInput] = useState('');

    const handleDropDownOnChange = (e) => {
        setSelectedOption(e.target.value);
        experimentId.current.groupTypeKey = e.target.value;
    }

    const handleNumberInputOnChange = (e) => {
        setNumberInput(e.target.value);
        experimentId.current.groupId = e.target.value;
    }

    const handleClickConfirm = () => {
        console.log(`'Confirm' button is clicked.`);
        experimentId.current.value = (experimentId.current.groupTypeKey
            + '_' + experimentId.current.groupId);
        console.log(`Experiment UID: '${experimentId.current.value}'`);
        onClickNext();
    }
    const numberOptions = Array.from({ length: 50 }, (_, i) => i + 1);

    return (
        <div className='session-setup-box'>
            <h1>Session Setup</h1>
            {/* Dropdown menu for group type */}
            <div>
                <label htmlFor="dropdown">Choose a group type:</label>
                <select 
                    id="dropdown" 
                    value={selectedOption} 
                    onChange={handleDropDownOnChange}
                >
                    <option value=''>Select a Group Type</option>
                    {Object.keys(GROUP_TYPE).map(key => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                </select>
            </div>
            {/* Dropdown menu for number input */}
            <div>
                <label htmlFor="numberInput">Enter a number:</label>
                <select 
                    id="numberInput" 
                    value={numberInput} 
                    onChange={handleNumberInputOnChange}
                >
                    <option value=''>Select a Number</option>
                    {numberOptions.map((number) => (
                        <option key={number} value={number}>{number}</option>
                    ))}
                </select>
            </div>
            <button onClick={handleClickConfirm} 
                disabled={!selectedOption || !numberInput}>Confirm</button>
        </div>
    );
}

export default SessionSetup;



