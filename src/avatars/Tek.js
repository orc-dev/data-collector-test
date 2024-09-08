import { useCallback, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTekContext } from '../contexts/TekContext';
import { useSessionContext } from '../contexts/SessionContext';
import { useMediaToolsContext } from '../contexts/MediaToolsContext';
import { TEK_SKELETON } from './skeleton';
import { CMD_MANAGER } from '../utils/KeyBindingManager';
import { performPose, autoplayMode, responseMode } from '../utils/animationMaker';


function selectMode(key, refs, cid, exptCond, canvasHUD, poseKey) {
    if (key === 'SelfExplanation' && exptCond === 'DA_SE') {
        return autoplayMode(refs, cid, canvasHUD);
    }
    if (key === 'DirectedAction') {
        return responseMode(refs, cid, canvasHUD, poseKey);
    }
    return null;
}

function Tek({ currKey, roundId }) {
    const session = useSessionContext();
    const { canvasHUD, poseKey, pauseRef } = useMediaToolsContext();
    const { jointRefs } = useTekContext();
    
    // Set animation
    pauseRef.current = false;
    const cid = session.current.shuffledIndex[roundId];
    const animMode = selectMode(
        currKey.current, 
        jointRefs, 
        cid, 
        session.current.exptCondition,
        canvasHUD,
        poseKey,
    );
    
    // Reset camera and pose
    useEffect(() => {
        CMD_MANAGER.click('r');
        performPose(jointRefs, 'IDLE', canvasHUD);
    });  // Runs on EVERY render [!]

    // Run animation
    useFrame((state, delta) => {
        if (animMode) {
            animMode(delta, pauseRef);
        } else {
            performPose(jointRefs, 'IDLE', canvasHUD);
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