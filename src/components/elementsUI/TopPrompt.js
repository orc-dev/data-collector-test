
function TopPrompt({Icon, prompt}) {
    return (
        <div className='head-box'>
            <div className='top-prompt-box'>
                <Icon style={{  fontSize: '4vw', marginRight: '3vw'}} />
                <p>{prompt}</p>
            </div>
        </div>
    );
}
export default TopPrompt;