import { EXPT_COND_TYPE, CONJECTURE_LIST } from '../constants/experimentMeta';
import {
    SessionStart, 
    Intro, 
    ReadConjecture, 
    DAInstruction,
    APInstruction,
    DirectedAction, 
    ActionPrediction,
    CtrlDescription, 
    SelfExplanation, 
    Answer, 
    Proof, 
    SessionFinish
} from '../components/sessionUnits';

/**
 * This two-layer fronzen object defines the main FSM of a running session,
 * shown as the following state diagram:
 * 
 *                   SessionStart (_INIT_)
 *                        |
 *                      Intro
 *                        |
 *                 ReadConjecuture   <─────────+
 *                /               \              \
 *          DAInstruction   APInstruction         \
 *              |                   |              \
 *         DirectedAction   ActionPrediction        |
 *              |         ╳         |               | (loop)
 *        CtrlDescription   SelfExplanation         | 
 *                \               /                / 
 *                      Answer                    /
 *                        |                      /
 *                      Proof   >──────────────+ 
 *                        |
 *                  SessionFinish (_EXIT_)
 * 
 * Note:
 *   - The keys of first layer are the names of the component. The only 
 *     exception is `_INIT_`, a reserved key for accessing the entry 
 *     component of the app.
 *   - The value is an inner object with two keys: `self` and `next`.
 *   - `self` corresponds with a callback returning the current component.
 *   - `next` corresponds with a callback that returns the name of the 
 *     next component.
 */
const SESSION_FSM = Object.freeze({
    _INIT_: Object.freeze({
        self: () => SessionStart,
        next: () => 'Intro',
    }),

    Intro: Object.freeze({
        self: () => Intro,
        next: () => 'ReadConjecture',
    }),

    ReadConjecture: Object.freeze({
        self: () => ReadConjecture,
        next: (session, _) => {
            const exptCond = session.current.exptCondition;
            switch(exptCond) {
                case EXPT_COND_TYPE.DA_CTRL:
                case EXPT_COND_TYPE.DA_SE:
                    return 'DAInstruction';

                case EXPT_COND_TYPE.AP_CTRL:
                case EXPT_COND_TYPE.AP_SE:
                    return 'APInstruction';

                default:
                    throw new Error(`Invalid exptCond: ${exptCond}`);
            };
        },
    }),

    DAInstruction: Object.freeze({
        self: () => DAInstruction,
        next: () => 'DirectedAction',
    }),

    DirectedAction: Object.freeze({
        self: () => DirectedAction,
        next: (session, _) => {
            const exptCond = session.current.exptCondition;
            switch(exptCond) {
                case EXPT_COND_TYPE.DA_CTRL:
                case EXPT_COND_TYPE.AP_CTRL:
                    return 'CtrlDescription';

                case EXPT_COND_TYPE.DA_SE:
                case EXPT_COND_TYPE.AP_SE:
                    return 'SelfExplanation';

                default:
                    throw new Error(`Invalid exptCond: ${exptCond}`);
            };
        },
    }),

    APInstruction: Object.freeze({
        self: () => APInstruction,
        next: () => 'ActionPrediction',
    }),

    ActionPrediction: Object.freeze({
        self: () => ActionPrediction,
        next: (session, _) => {
            const exptCond = session.current.exptCondition;
            switch(exptCond) {
                case EXPT_COND_TYPE.DA_CTRL:
                case EXPT_COND_TYPE.AP_CTRL:
                    return 'CtrlDescription';

                case EXPT_COND_TYPE.DA_SE:
                case EXPT_COND_TYPE.AP_SE:
                    return 'SelfExplanation';

                default:
                    throw new Error(`Invalid exptCond: ${exptCond}`);
            };
        },
    }),

    CtrlDescription: Object.freeze({
        self: () => CtrlDescription,
        next: () => 'Answer',
    }),

    SelfExplanation: Object.freeze({
        self: () => SelfExplanation,
        next: () => 'Answer',
    }),

    Answer: Object.freeze({
        self: () => Answer,
        next: () => 'Proof',
    }),

    Proof: Object.freeze({
        self: () => Proof,
        next: (_, ridRef) => {
            const total = Object.keys(CONJECTURE_LIST).length;
            const hasNext = ridRef.current < (total - 1);
            return hasNext ? 'ReadConjecture' : 'SessionFinish';
        },
    }),

    SessionFinish: Object.freeze({
        self: () => SessionFinish,
        next: () => null,
    }),
});

export default SESSION_FSM;