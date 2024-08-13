
function TopPrompt({Icon, prompt}) {
    return (
        <div className='large-prompt-box'>
            <Icon style={{  fontSize: '4vw', marginRight: '3vw'}} />
            <p>{prompt}</p>
        </div>
    );
}
export default TopPrompt;