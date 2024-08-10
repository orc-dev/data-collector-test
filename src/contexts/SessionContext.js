import { createContext, useContext, useRef } from 'react';

/** Context to keep tract of session's metadata. */
const SessionContext = createContext();

export const SessionContextProvider = ({ children }) => {
    // Session metadata
    const session = useRef({
        exptCondition: undefined,
        participantId: undefined,
        uid:           undefined,
        savePath:      undefined,
        shuffledIndex: undefined,
        creationTime:  undefined,
    });

    return (
        <SessionContext.Provider value={ session }>
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionContext = () => {
    return useContext(SessionContext);
};