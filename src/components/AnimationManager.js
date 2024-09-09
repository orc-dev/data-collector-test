import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMediaToolsContext } from '../contexts/MediaToolsContext.js';
import { TekContextProvider } from '../contexts/TekContext.js';
import AnimationScene from '../scenes/AnimationScene.js';
import Tek from '../avatars/Tek.js';
import '../styles/ghost-layer.css';


function AnimationCanvas({ currKey, roundId }) {
    const cameraProps = { position: [0, 4.35, 4.5], fov: 75 };
    return (
        <Canvas dpr={[1, 1.5]} shadows camera={cameraProps} className='animation-canvas'>
            <TekContextProvider>
                <AnimationScene currKey={currKey} />
                <Tek currKey={currKey} roundId={roundId} />
            </TekContextProvider>
        </Canvas>
    );
}

function AnimationManager({currKey, roundId}) {
    const { canvasHUD } = useMediaToolsContext();
    const [_, setIsCanvasReady] = useState(false);
    const setCanvasRef = useCallback((node) => {
        canvasHUD.current = node;
        setIsCanvasReady(!!node);
    }, []);

    const VIS_KEYS = [
        'DirectedAction', 'DAInstruction',
        'ActionPrediction', 'APInstruction',
        'SelfExplanation', 'CtrlDescription'
    ];
    const display = VIS_KEYS.includes(currKey.current) ? 'block' : 'none';

    // A ghose page manages animation displaying
    return (
        <div className='ghost-page-main-box' style={{ display: display }}>
            <div className='ghost-head-box' />
            <div className='mid-box'>
                <div className='animation-box' >
                    <AnimationCanvas currKey={currKey} roundId={roundId} />
                    <canvas className='hud-canvas' ref={setCanvasRef} />
                </div>
                <div className='live-video-box' />
            </div>
        </div>
    );
}
export default AnimationManager;