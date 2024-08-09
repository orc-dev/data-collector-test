import { useCallback, useEffect, useRef, useMemo } from 'react';
import { Quaternion, Vector3 } from 'three';
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import { useTekContext } from '../contexts/TekContext';
import { TEK_SKELETON } from './skeleton';
import { POSE_KEYS } from '../poses';
import { CONJ_LABELS } from '../constants/conjectures';
import { performPose, standardAnimation, responsiveAnimation } from '../utils/animationManager';
import { vec, plamOrienter } from '../utils/graphics';
import { BASIC_MAT } from './materials';


/** Returns a dot-like mesh showing the joints of Tek's skeleton */
function _joint() {
    return <mesh><sphereGeometry args={[0.03,8,8]}/>{ BASIC_MAT.BLUE }</mesh>;
}

/** Returns an arrow-like mesh showing the bones of Tek's skeleton */
function _bone(key, cpos, index) {
    // Leaf joint
    if (TEK_SKELETON[key].next.length === 0) {
        return <group key={index}></group>;
    }
    // Check if parent-child nodes are overlap
    const norm = (arr) => Math.sqrt(arr.reduce((sum, v) => sum + (v * v), 0));
    const length = norm(cpos) * 0.9;
    if (length === 0) {
        return <group key={index}></group>;
    }
    // Compute position and quaternion
    const position = cpos.map(x => x / 2);
    const currDir = new Vector3(0, 1, 0);
    const nextDir = new Vector3(...cpos).normalize();
    const quaternion = new Quaternion().setFromUnitVectors(currDir, nextDir);
    return (
        <mesh key={index} position={position} quaternion={quaternion}>
            <cylinderGeometry args={[0.01,0.03,length,6,1]} />
            {BASIC_MAT.WHITE}
        </mesh>
    );
}

/** [!]: only used for edit wrist orientation */
function _editWristHelper(jointRefs, runningFlag=false) {
    if (!runningFlag) return;

    // Adjusting the follow parameters:
    const refKey = ['WRIST_R', 'WRIST_L'][0];
    const lookAtVec = vec(0,0,-1);
    const upParam   = 0.5;

    // Run the orienter
    const tempRef = jointRefs[refKey];
    const result = plamOrienter(tempRef, lookAtVec, upParam);
    tempRef.current.rotation.set(...result.wristEuler);

    // Output computed parameter
    console.log(result.wristEuler);
}

/**
 * This component renders the 3D character 'Tek' along with its
 * animation functionalities. Meanwhile, a leva control is used
 * to select pose or directed action.
 *
 * @returns {JSX.Element} The 3D character Tek with animations.
 */
function Tek({ conjId }) {
    const [jointRefs, pauseRef] = useTekContext();
    const animationRunnerRef = useRef(undefined);
    
    // Leva controls
    const { showSkin, pose, DA_id } = useControls({
        showSkin: true,
        pose: { value: 'IDLE', options: POSE_KEYS },
        DA_id: { value: conjId, options: [-1,0,1,2,3,4,5]},
    });
    
    // Recursively constructs skeleton coordinates
    const constructTek = useCallback((key, position) => {
        const curr = TEK_SKELETON[key];
        return (
            <group key={key} ref={jointRefs[key]} position={position}>
                {/* Display skeleton */}
                { !showSkin && _joint()}
                { !showSkin && curr.ipos.map((cpos, i) => _bone(key, cpos, i))}

                {/* Display skin */}
                { showSkin && curr.skin && curr.skin()}
                { curr.next.map((k, i) => constructTek(k, curr.ipos[i]))}
            </group>
        );
    }, [showSkin]);
    
    // Select directed action or pose
    useEffect(() => {
        animationRunnerRef.current = (DA_id < 0) ? undefined
            //: standardAnimation(jointRefs, CONJ_LABELS[DA_id]);
            : responsiveAnimation(jointRefs, CONJ_LABELS[DA_id]);
    }, [DA_id, showSkin]);

    // Run animation or perform a single pose 
    useFrame((state, delta) => {
        if (animationRunnerRef.current) {
            animationRunnerRef.current(delta, pauseRef);
        } else {
            performPose(jointRefs, pose);
            _editWristHelper(jointRefs, false);
        }
    });
    // Return memoized Tek
    return useMemo(() => constructTek('BACK', [0,0,0]), [showSkin]);
}
export default Tek;