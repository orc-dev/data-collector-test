import React, { memo } from 'react';


function AudioVisualizer({ canvasRef }) {
    return (
        <div className='audio-box'>
            <canvas id='audio-canvas' ref={canvasRef} />
        </div>
    );
};
export default memo(AudioVisualizer);