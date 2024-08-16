import { useRef, useEffect, Fragment } from 'react';
import { useThree } from '@react-three/fiber';
import { Environment, OrbitControls, Grid, SoftShadows } from '@react-three/drei';
import { useTekContext } from '../contexts/TekContext';
import { CMD_MANAGER } from '../utils/KeyBindingManager';

function CamControls({ controlsRef, lookAtVec }) {
    const {camera, gl} = useThree();
    useEffect(() => {
        camera.lookAt(...lookAtVec);
        if (controlsRef.current) {
            controlsRef.current.target.set(...lookAtVec);
            controlsRef.current.saveState();
        }
        // Clean up on unmount
        return () => {
            if (controlsRef.current) {
                controlsRef.current.dispose();
            }
        };
    }, []);
    return <OrbitControls ref={controlsRef} args={[camera, gl.domElement]} />;
}

function Env() {
    //  options: [
    //      'sunset', 'dawn', 'night', 'warehouse', 'forest', 
    //      'apartment', 'studio', 'city', 'park', 'lobby'
    //  ],
    return <Environment background preset={'sunset'} backgroundBlurriness={0.4}/>
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


function AnimationScene({ currKey }) {
    //console.log('AnimationScene rendering...');
    const { pauseRef } = useTekContext();
    const controlsRef = useRef();
    const LOOK_AT = [0, 4.50, 0];
   
    function resetCamera(currKey) {
        if (currKey.current !== 'DirectedAction' &&
            currKey.current !== 'SelfExplanation') {
            return;
        }
        if (controlsRef.current) {
            controlsRef.current.reset();
            controlsRef.current.target.set(...LOOK_AT);
            controlsRef.current.update();
        }
    };

    function pauseAnimation(currKey) {
        if (currKey.current !== 'DirectedAction' &&
            currKey.current !== 'SelfExplanation') {
            return;
        }
        if (pauseRef?.current === false) {
            pauseRef.current = true;
        }
    }

    function resumeAnimation(currKey) {
        if (currKey.current !== 'DirectedAction' &&
            currKey.current !== 'SelfExplanation') {
            return;
        }
        if (pauseRef?.current === true) {
            pauseRef.current = false;
        }
    }

    useEffect(() => {
        CMD_MANAGER.bindKey('r', () => resetCamera(currKey));
        CMD_MANAGER.bindKey('p', () => pauseAnimation(currKey));
        CMD_MANAGER.bindKey('c', () => resumeAnimation(currKey));
    }, []);
    
    return (
        <group>
            <CamControls controlsRef={controlsRef} lookAtVec={LOOK_AT}/>
            <Env />
            <LightsAndShadows />
            <GridAndGround />
        </group>
    );
}

export default AnimationScene;