import { useRef } from 'react';
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import { whiteMat, redMat, blueMat } from '../../avatars/materials';
import Hand from '../avatars/meshTest';


function FloatingCube({ paused, roughness }) {
    const ref = useRef();
    const rotationSpeed = Math.PI * 0.4;
    // Hook that handles animation
    useFrame((state, delta) => {
        if (!paused) {
            ref.current.rotation.x += rotationSpeed * delta;
            ref.current.rotation.y += rotationSpeed * delta;
            ref.current.position.y = 4 + Math.sin(state.clock.elapsedTime) * 2;
        }
    });
    return (
        <mesh ref={ref} position={[2.5, 2, 1]} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            {redMat}
        </mesh>
    );
}


function LongCube({ paused, roughness }) {
    const ref = useRef();
     
    return (
        <mesh ref={ref} position={[3, 0.5, -1]} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 2]} />
            {blueMat}
        </mesh>
    );
}


function Sphere({roughness}) {
    
    return (
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.75, 64, 64]} />
            {/* <meshPhysicalMaterial metalness={1} roughness={roughness} /> */}
            {whiteMat}
        </mesh>
    );
}

function SimpleObjects(prop) {
    const { roughness } = useControls({ roughness: { value: 1, min: 0, max: 1 } });
    return (
        <group>
            <FloatingCube paused={prop.paused} roughness={roughness}/>
            <LongCube paused={prop.paused} roughness={roughness}/>
            <Sphere roughness={roughness}/>
            <Hand />
        </group>
    );
}
export default SimpleObjects;