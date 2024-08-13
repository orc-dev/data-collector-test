import { createContext, useContext, useRef } from 'react';

/** Context to keep tract of session's metadata. */
const SessionContext = createContext();

export const SessionContextProvider = ({ children }) => {
    // Session metadata
    const metadata = useRef({
        exptCondition: undefined,
        participantId: undefined,
        uid:           undefined,
        savePath:      undefined,
        shuffledIndex: [0,1,2,3,4,5],
        creationTime:  undefined,
    });

    // Session Runtime data
    const runtime = useRef({
        currRound: 0,
    });

    return (
        <SessionContext.Provider value={ {metadata, runtime} }>
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionContext = () => {
    return useContext(SessionContext);
};