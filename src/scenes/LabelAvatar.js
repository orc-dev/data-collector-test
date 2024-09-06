import { useRef } from 'react';
import { useThree, useLoader, useFrame, extend } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { BASIC_MAT } from '../avatars/materials';
extend({ TextGeometry })


function LabelAvatar() {
    const { camera } = useThree();
    const camRef = useRef();
    const meshRef = useRef();
    const meshMat = BASIC_MAT.TAN;
    const text = 'Avatar';
    const textOptions = {
        font: useLoader(FontLoader, './assets/droid_sans_bold.typeface.json'),
        size: 1,
        depth: 0.01,
        bevelEnabled: false,
    };
    // Note: the original of text is its left side (not center)
    const meshPos = [-0.8,-0.6,-1];
    const meshScl = [0.08, 0.08, 0.08];

    useFrame(() => {
        if (camera && camRef.current) {
            camRef.current.position.set(...camera.position);
            camRef.current.quaternion.copy(camera.quaternion);
        }
    });

    return (
        <group ref={camRef}>
            <mesh ref={meshRef} position={meshPos} scale={meshScl} >
                <textGeometry attach='geometry' args={[text, textOptions]} />
                {meshMat}
            </mesh>
        </group>
    );
}

export default LabelAvatar;