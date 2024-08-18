import React, { memo } from 'react';


function VideoDisplayer({ videoRef, canvasRef }) {
    return (<>
        <div className='ghost-head-box' />
        <div className='mid-box'>
            <div className='animation-box' />
            <div className='live-video-box' >
                <video ref={videoRef} style={{ display: 'none' }} />
                <canvas className='video-canvas' ref={canvasRef} />
            </div>
        </div>
    </>);
}
export default memo(VideoDisplayer);