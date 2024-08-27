/**
 * @file experimentMeta.js
 * @brief This file contains experiment-related constants.
 * 
 * @created Jul.07 2024
 * @update
 *      07.11.2024 Add Group type
 *      08.10.2024 Rename to 'EXPT_COND_TYPE'
 *      08.26.2024 Add new field 'range' for highlighting keyword
 *                 at the control stage.
 */
export {EXPT_COND_TYPE, CONJECTURE_LIST, CONJ_LABELS, DA_ANIMATIONS};

/** Experiment condition type */
const EXPT_COND_TYPE = Object.freeze({
    DA_SE:   'DA_SE',    // Directed Action   * Self Explanation
    DA_CTRL: 'DA_CTRL',  // Directed Action   * (control)
    AP_SE:   'AP_SE',    // Action Prediction * Self Explanation
    AP_CTRL: 'AP_CTRL',  // Action Prediction * (control)
});

function formatText(text) {
    return text.replace(/\s+/g, ' ');
}
/** Experiment conjectures */
const CONJECTURE_LIST = [
    {   // 0
        label: "Similar_Triangle",
        text: formatText("Given that you know the measure of all three \
            angles of a triangle, there is only one unique triangle that \
            can be formed with these three angle measures."),
        answer: false,
        range: [57, 65],
    },
    {   // 1
        label: "Parallelogram_Area",
        text: formatText("The area of a parallelogram is the same as \
            the area of a rectangle with the same base and height."),
        answer: true,
        range: [14, 27],
    },
    {   // 2
        label: "Rectangle_Diags",
        text: formatText("The diagonals of a rectangle always have \
            the same length."),
        answer: true,
        range: [4, 13],
    },
    {   // 3
        label: "Opposite_Angles",
        text: formatText("The opposite angles of two lines that \
            intersect each other are always the same."),
        answer: true,
        range: [4, 19],
    },
    {   // 4
        label: "Triangle_AngleOppSide",
        text: formatText("In triangle ABC, if Angle A is larger than \
            Angle B, then the side opposite Angle A is longer than \
            the side opposite Angle B."),
        answer: true,
        range: [57, 82],
    },
    {   // 5
        label: "Doubled_Area",
        text: formatText("If you doubled the length and width of \
            a rectangle, then the area is exactly doubled."),
        answer: false,
        range: [41, 50],
    }
];

/**
 * [ 'Similar_Triangle', 'Parallelogram_Area', 'Rectangle_Diags',
 *   'Opposite_Angles',  'Triangle_AngleOppSide','Doubled_Area' ]
 */
const CONJ_LABELS = CONJECTURE_LIST.map(conj => conj.label);

/**
 * {
 *     Similar_Triangle:      ['IDLE', 'SIMI_TRIA_1', 'SIMI_TRIA_2', 'SIMI_TRIA_3'],
 *     Parallelogram_Area:    ['IDLE', 'PARA_AREA_1', 'PARA_AREA_2', 'PARA_AREA_3'],
 *     Rectangle_Diags:       ['IDLE', 'RECT_DIAG_1', 'RECT_DIAG_2', 'RECT_DIAG_3'],
 *     Opposite_Angles:       ['IDLE', 'OPPO_ANGL_1', 'OPPO_ANGL_2', 'OPPO_ANGL_3'],
 *     Triangle_AngleOppSide: ['IDLE', 'TRIA_ANGL_1', 'TRIA_ANGL_2', 'TRIA_ANGL_3'],
 *     Doubled_Area:          ['IDLE', 'DOUB_AREA_1', 'DOUB_AREA_2', 'DOUB_AREA_3'],
 * }
 */
const DA_ANIMATIONS = Object.freeze(
    CONJ_LABELS.reduce((prev, label) => (
        {...prev, ...{[label] : buildPoseSeq(label)}}
    ), {})
);

/** (util) Build the value for given key of the `DA_ANIMATIONS` object. */
function buildPoseSeq(conjLabel) {
    const abbr = extractPattern(conjLabel);
    const poseKeySeq = [1, 2, 3].map(x => `${abbr}_${x}`)
    return ['IDLE', ...poseKeySeq];
}

/** (util) Eg. Given 'Similar_Triangle', output 'SIMI_TRIA' */
function extractPattern(conjLabel) {
    const regex = /^([a-zA-Z]{4})[a-zA-Z]*_([a-zA-Z]{4})[a-zA-Z]*$/;
    const match = conjLabel.match(regex);
    
    if (match) {
        const xpart = match[1].toUpperCase();
        const ypart = match[2].toUpperCase();
        return `${xpart}_${ypart}`;
    } else {
        throw new Error('Conjecture label mismatches pattern.');
    }
}
