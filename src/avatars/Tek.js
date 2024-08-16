import { useCallback, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTekContext } from '../contexts/TekContext';
import { useSessionContext } from '../contexts/SessionContext';
import { TEK_SKELETON } from './skeleton';
import { CONJ_LABELS } from '../constants/conjectures';
import { CMD_MANAGER } from '../utils/KeyBindingManager';
import { performPose, autoplayMode, responseMode } from '../utils/animationMaker';


function selectMode(key, refs, label) {
    switch(key) {
        case 'SelfExplanation': return autoplayMode(refs, label);
        case 'DirectedAction':  return responseMode(refs, label);
        default:                return undefined;
    }
}

function Tek({ currKey, roundId }) {
    //console.log(`Tek \{${currKey.current}, ${roundId}\}`);
    const session = useSessionContext();
    const { jointRefs, pauseRef } = useTekContext();

    // Set animation
    pauseRef.current = (currKey.current !== 'SelfExplanation');
    const cid = session.current.shuffledIndex[roundId];
    const animMode = selectMode(currKey.current, jointRefs, CONJ_LABELS[cid]);
    
    // Reset camera and pose
    useEffect(() => {
        CMD_MANAGER.click('r');
        performPose(jointRefs, 'IDLE');
    });  // Runs on EVERY render [!]

    // Run animation
    useFrame((state, delta) => {
        if (animMode) {
            animMode(delta, pauseRef);
        } else {
            performPose(jointRefs, 'IDLE');
        }
    });

    // Recursively constructs skeleton coordinates
    const constructTek = useCallback((key, position) => {
        const curr = TEK_SKELETON[key];
        return (
            <group key={key} ref={jointRefs[key]} position={position}>
                { curr.skin && curr.skin()}
                { curr.next.map((k, i) => constructTek(k, curr.ipos[i]))}
            </group>
        );
    }, []);

    // Return memoized Tek
    return useMemo(() => constructTek('BACK', [0,0,0]), []);
}
export default Tek;