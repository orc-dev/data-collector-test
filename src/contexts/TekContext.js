import { createContext, useContext, useRef } from 'react';
import { TEK_SKELETON } from '../avatars/skeleton';

const TekContext = createContext();

export const TekContextProvider = ({ children }) => {
    // Create refs dynamically
    const jointRefs = Object.keys(TEK_SKELETON).reduce((refs, key) => {
        refs[key] = useRef();
        return refs;
    }, {});
    
    return (
        <TekContext.Provider value={{ jointRefs }}>
            {children}
        </TekContext.Provider>
    );
};

export const useTekContext = () => {
    return useContext(TekContext);
};