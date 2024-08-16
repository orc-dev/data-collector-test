import { createContext, useContext, useRef } from 'react';
import { TEK_SKELETON } from '../avatars/skeleton';

const TekContext = createContext();

export const TekContextProvider = ({ children }) => {
    // Create refs dynamically
    const jointRefs = Object.keys(TEK_SKELETON).reduce((refs, key) => {
        refs[key] = useRef();
        return refs;
    }, {});
    
    // Animation pause/resume control
    const pauseRef = useRef(true);
    
    return (
        <TekContext.Provider value={{jointRefs, pauseRef}}>
            {children}
        </TekContext.Provider>
    );
};

export const useTekContext = () => {
    return useContext(TekContext);
};