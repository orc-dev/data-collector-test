import { Canvas } from '@react-three/fiber';
import { TekContextProvider } from '../contexts/TekContext.js';
import AnimScene from '../scenes/AnimScene.js';
import Tek from '../avatars/Tek.js';
import '../styles/ghost-layer.css';


function AnimationCanvas({ currKey, roundId }) {
    console.log('AnimationCanvas...');

    const cameraProps = { position: [0, 4.35, 4.5], fov: 75 };
    return (
        <Canvas shadows camera={cameraProps} className='animation-canvas'>
            <TekContextProvider>
                <AnimScene currKey={currKey} />
                <Tek currKey={currKey} roundId={roundId} />
            </TekContextProvider>
        </Canvas>
    );
}

function AnimationManager({currKey, roundId}) {
    console.log(`AnimationManager \{${currKey.current}, ${roundId} \}`);
    
    const animSet = new Set([
        'DirectedAction', 'SelfExplanation', 'ActionPrediction'
    ]);
    const mode = animSet.has(currKey.current) ? 'block' : 'none';
    
    return (
        <div className='ghost-page-main-box' style={{ display: mode }}>
            <div className='ghost-head-box' />
            <div className='mid-box'>
                <div className='animation-box' >
                    <AnimationCanvas currKey={currKey} roundId={roundId} />
                </div>
                <div className='live-video-box' />
            </div>
        </div>
    );
}
export default AnimationManager;