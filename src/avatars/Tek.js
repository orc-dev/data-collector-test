import { useCallback, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTekContext } from '../contexts/TekContext';
import { useSessionContext } from '../contexts/SessionContext';
import { useMediaToolsContext } from '../contexts/MediaToolsContext';
import { TEK_SKELETON } from './skeleton';
import { CONJ_LABELS } from '../constants/conjectures';
import { CMD_MANAGER } from '../utils/KeyBindingManager';
import { performPose, autoplayMode, responseMode } from '../utils/animationMaker';


function selectMode(key, refs, label, exptCond, canvasHUD) {
    if (key === 'SelfExplanation' && exptCond === 'DA_SE') {
        return autoplayMode(refs, label, canvasHUD);
    }
    if (key === 'DirectedAction') {
        return responseMode(refs, label, canvasHUD);
    }
    return null;
}

function Tek({ currKey, roundId }) {
    //console.log(`Tek \{${currKey.current}, ${roundId}\}`);
    const session = useSessionContext();
    const { jointRefs, pauseRef } = useTekContext();
    const { canvasHUD } = useMediaToolsContext();
    
    // Set animation
    pauseRef.current = false;
    const cid = session.current.shuffledIndex[roundId];
    const animMode = selectMode(
        currKey.current, 
        jointRefs, 
        CONJ_LABELS[cid], 
        session.current.exptCondition,
        canvasHUD
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