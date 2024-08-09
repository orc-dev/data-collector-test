import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { SoftShadows, Grid, ContactShadows } from '@react-three/drei';
import { PerspectiveCamera, OrbitControls,
 } from '@react-three/drei';

// A component for the rotating cube
function RotatingCube({ paused }) {
    const ref = useRef();
    const rotationSpeed = Math.PI * 0.4;

    // Hook that handles animation
    useFrame((state, delta) => {
        if (!paused) {
            ref.current.rotation.x += rotationSpeed * delta;
            ref.current.rotation.y += rotationSpeed * delta;
            ref.current.position.y = 4.5 + Math.sin(state.clock.elapsedTime) * 2;
        }
    });

    return (
        <mesh ref={ref} position={[1, 2, 1]} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshPhysicalMaterial color={0xffffff} />
        </mesh>
    );
}

function Square() {
    const ref = useRef();
    return (
        <mesh ref={ref} position={[0, -0.6, 0]} receiveShadow >
            <boxGeometry args={[16, 0.06, 16]}/>
            <meshPhysicalMaterial color={0x9999FF} />
            {/* <shadowMaterial transparent opacity={0.4} /> */}
        </mesh>
    );
}


// Default export component
const SimpleAnimation = () => {
    const [paused, setPaused] = useState(false);
    const controlsRef = useRef();

    // Button callback: toggle between pause and play
    const toggleAnimation = () => {
        setPaused(prevPaused => !prevPaused);
    };

    // Button callback: reset camear to default orientation
    const resetCamera = () => {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    };

    return (
        <div className='R3F-Canvas-container'>
            <h1>R3F: The First Scene</h1>
            <Canvas 
                style={{ width: '600px', height: '500px', border: '1px solid black', borderRadius: '10px' }}
                shadows>
                <color attach="background" args={[0.01, 0.01, 0.01]} />
                {/* <SoftShadows {...{size:15, focus:0, samples:30}}/> */}
                <PerspectiveCamera makeDefault position={[2, 7, 9]} fov={85} />
                {/* <ambientLight intensity={0.2} /> */}
                <hemisphereLight intensity={0.2} groundColor='black' />
                <directionalLight
                    castShadow
                    position={[2.5, 8, 5]} 
                    shadow-mapSize={[1024, 1024]}
                    intensity={1}
                >
                    {/* <orthographicCamera attach='shadow-camera' args={[-10, 10, -10, 10, 0.1, 50]} /> */}
                </directionalLight>
                {/* <pointLight position={[-10, 0, -20]} color="white" intensity={1} />
                <pointLight position={[0, -10, 0]} intensity={1} /> */}
                <Square />
                {/* <Ground /> */}
                <RotatingCube paused={paused} />
                <OrbitControls ref={controlsRef} />

            </Canvas>
            <button onClick={toggleAnimation}>
                {paused ? 'Resume' : 'Pause'} Animation
            </button>
            <button onClick={resetCamera}>
                Reset Camera
            </button>
        </div>
    );
};

export default SimpleAnimation;
