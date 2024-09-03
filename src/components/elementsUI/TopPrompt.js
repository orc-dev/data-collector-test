
function TopPrompt({Icon, prompt}) {
    return (
        <div className='head-box'>
            <div className='top-prompt-box'>
                <Icon style={{  
                    fontSize: '4vw', marginRight: '3vw',
                    stroke: '#000', strokeWidth: '0.3px', 
                    }} />
                <p>{prompt}</p>
            </div>
        </div>
    );
}
export default TopPrompt;