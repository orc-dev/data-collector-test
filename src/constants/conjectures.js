
export const CONJECTURE_LIST = [
    {   // 0
        label: "Similar_Triangle",
        text: "Given that you know the measure of all three angles of a \
            triangle, there is only one unique triangle that can be \
            formed with these three angle measures.",
        answer: false
    },
    {   // 1
        label: "Parallelogram_Area",
        text: "The area of a parallelogram is the same as the area of a \
            rectangle with the same base and height.",
        answer: true
    },
    {   // 2
        label: "Rectangle_Diags",
        text: "The diagonals of a rectangle always have the same length.",
        answer: true
    },
    {   // 3
        label: "Opposite_Angles",
        text: "The opposite angles of two lines that intersect each other \
            are always the same.",
        answer: true
    },
    {   // 4
        label: "Triangle_AngleOppSide",
        text: "In triangle ABC, if Angle A is larger than Angle B, then the \
            side opposite Angle A is longer than the side opposite Angle B.",
        answer: true
    },
    {   // 5
        label: "Doubled_Area",
        text: "If you doubled the length and width of a rectangle, then the \
            area is exactly doubled.",
        answer: false
    }
];

export const CONJ_LABELS = CONJECTURE_LIST.map(conj => conj.label);

export const DA_ANIMATIONS = Object.freeze(
    CONJ_LABELS.reduce((prev, label) => (
        {...prev, ...{[label] : buildPoseSeq(label)}}
    ), {})
);


function buildPoseSeq(conjLabel) {
    const abbr = extractPattern(conjLabel);
    const poseKeySeq = [1, 2, 3].map(x => `${abbr}_${x}`)
    return ['IDLE', ...poseKeySeq];
}

/** Eg. Given 'Similar_Triangle', output 'SIMI_TRIA' */
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
