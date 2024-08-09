import { useState, useTransition, useRef, useEffect, Fragment } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { Environment, OrbitControls, Grid, SoftShadows } from '@react-three/drei';
import { useTekContext } from '../contexts/TekContext';
import { Button } from '@mui/material';


function CamControls({ controlsRef, lookAtVec }) {
    const {camera, gl} = useThree();
    useEffect(() => {
        camera.lookAt(...lookAtVec);
        if (controlsRef.current) {
            controlsRef.current.target.set(...lookAtVec);
            controlsRef.current.saveState();
        }
    }, []);
    return <OrbitControls ref={controlsRef} args={[camera, gl.domElement]} />;
}

function Env() {
    const [preset, setPreset] = useState('sunset');
    const [inTransition, startTransition] = useTransition();
    const { blur } = useControls({
        preset: {
            value: preset,
            options: [
                'sunset', 'dawn', 'night', 'warehouse', 'forest', 
                'apartment', 'studio', 'city', 'park', 'lobby'
            ],
            onChange: (value) => startTransition(() => setPreset(value))
        },
        blur: { value: 0.4, min: 0, max: 1 },
    });
    return <Environment background preset={preset} backgroundBlurriness={blur}/>
}

function LightsAndShadows() {
    return (
        <Fragment>
            <directionalLight 
                castShadow 
                position={[2.5, 8, 5]} 
                shadow-mapSize-width={1024} 
                shadow-mapSize-height={1024} 
                intensity={1.75} 
            />
            <SoftShadows size={20} samples={15} />
        </Fragment>
    );
}

function GridAndGround() {
    const gridProps = {
        infiniteGrid: true, 
        cellSize: 1, 
        cellThickness: 0.5, 
        sectionSize: 3, 
        sectionThickness: 1.5, 
        sectionColor: [0.5, 0.5, 10], 
        fadeDistance: 30, 
        receiveShadow: true,
    };
    const meshPos = [0, -0.001, 0];
    const meshRot = [-Math.PI * 0.5, 0, 0];
    return (
        <Fragment>
            <Grid {...gridProps} />
            <mesh position={meshPos} rotation={meshRot} receiveShadow>
                <planeGeometry args={[30, 30]} />
                <meshBasicMaterial transparent />
                <shadowMaterial transparent opacity={0.4} />
            </mesh>
        </Fragment>
    );
}

function PlayButton({ctxPauseRef}) {
    const buttonText = ['Pause_ Animation', 'Resume Animation'];
    const [isPaused, setIsPaused] = useState(false);
    
    const toggleAnimation = () => {
        ctxPauseRef.current = !ctxPauseRef.current;
        setIsPaused(prev => !prev);
    };
    return (
        <Button variant='contained' color='primary' size='small' 
            onClick={toggleAnimation}>
            {buttonText[Number(isPaused)]}
        </Button>
    );
}

function DefaultScene({ children }) {
    const [_, pauseRef] = useTekContext();
    const controlsRef = useRef();
    const LOOK_AT = [0, 4.50, 0];
    const cameraProps = {
        position: [0, 4.35, 4.5],
        fov: 75,
    };
    const resetCamera = () => {
        if (controlsRef.current) {
            controlsRef.current.reset();
            controlsRef.current.target.set(...LOOK_AT);
            controlsRef.current.update();
        }
    };
    const pauseAnimation = () => {
        if (pauseRef?.current === false) {
            pauseRef.current = true;
        }
    }
    const resumeAnimation = () => {
        if (pauseRef?.current === true) {
            pauseRef.current = false;
        }
    }
    
    // Event handler: Pressing 'r' to reset camera.
    const handleKeyDown = (event) => {
        switch(event.key) {
            case 'r': 
                resetCamera(); 
                break;
            case 'p': 
                pauseAnimation(); 
                break;
            case 'c':
                resumeAnimation();
                break;
            default:
                return;
        }
        if (event.key === 'r') {
            resetCamera();
        }
    };
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

   

    return (
        <div className='animation-container'>
            <Canvas shadows camera={cameraProps} className='animation-canvas'>
                <CamControls controlsRef={controlsRef} lookAtVec={LOOK_AT}/>
                <Env />
                <LightsAndShadows />
                { children }
                <GridAndGround />
            </Canvas>
            {/* Buttons: toggle animation, reset camera */}
            {/* <PlayButton ctxPauseRef={pauseRef} />
            <Button variant='contained' color='primary' size='small' onClick={resetCamera}>
                Reset Camera
            </Button> */}
        </div>
    );
}
export default DefaultScene;