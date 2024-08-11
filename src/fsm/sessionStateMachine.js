import { EXPT_COND_TYPE, CONJECTURE_LIST } from '../constants/experimentMeta';
import SessionStart from '../components/SessionStart';
import Intro from '../components/Intro';
import ReadConjecture from '../components/ReadConjecuture';
import DirectedAction from '../components/DirectedAction';
import ActionPrediction from '../components/ActionPrediction';
import CtrlDescription from '../components/CtrlDescription';
import SelfExplanation from '../components/SelfExplanation';
import InitialAnswer from '../components/InitialAnswer';
import Proof from '../components/Proof';
import FinalAnswer from '../components/FinalAnswer';
import SessionFinish from '../components/SessionFinish';

/**
 * This two-layer fronzen object defines the main FSM of a running session,
 * shown as the following state diagram:
 * 
 *                   SessionStart (starts)
 *                        |
 *                      Intro
 *                        |
 *                 ReadConjecuture <───────────+
 *                /               \              \
 *         DirectedAction   ActionPrediction      \
 *              |         ╳         |              \
 *        CtrlDescription   SelfExplanation         |
 *                \               /                 | (loop)
 *                  InitialAnswer                   |
 *                        |                        /
 *                      Proof                     /
 *                        |                      /
 *                   FinalAnswer >─────────────+
 *                        |
 *                  SessionFinish (exits)
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
        next: (metadata, _) => {
            const exptCond = metadata.current.exptCondition;
            switch(exptCond) {
                case EXPT_COND_TYPE.DA_CTRL:
                case EXPT_COND_TYPE.DA_SE:
                    return 'DirectedAction';

                case EXPT_COND_TYPE.AP_CTRL:
                case EXPT_COND_TYPE.AP_SE:
                    return 'ActionPrediction';

                default:
                    throw new Error(`Invalid exptCond: ${exptCond}`);
            };
        },
    }),

    DirectedAction: Object.freeze({
        self: () => DirectedAction,
        next: (metadata, _) => {
            const exptCond = metadata.current.exptCondition;
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

    ActionPrediction: Object.freeze({
        self: () => ActionPrediction,
        next: (metadata, _) => {
            const exptCond = metadata.current.exptCondition;
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
        next: () => 'InitialAnswer',
    }),

    SelfExplanation: Object.freeze({
        self: () => SelfExplanation,
        next: () => 'InitialAnswer',
    }),

    InitialAnswer: Object.freeze({
        self: () => InitialAnswer,
        next: () => 'Proof',
    }),

    Proof: Object.freeze({
        self: () => Proof,
        next: () => 'FinalAnswer',
    }),

    FinalAnswer: Object.freeze({
        self: () => FinalAnswer,
        next: (_, runtime) => {
            const total = Object.keys(CONJECTURE_LIST).length;
            const hasNext = runtime.current.currRound < (total - 1);
            return hasNext ? 'ReadConjecture' : 'SessionFinish';
        },
    }),

    SessionFinish: Object.freeze({
        self: () => SessionFinish,
        next: () => null,
    }),
});

export default SESSION_FSM;