/**
 * @file experimentConstants.js
 * @brief This file contains experiment-related constants.
 * 
 * @created Jul.07 2024
 * @update
 *      07.11.2024 Add Group type
 */

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


export const GROUP_TYPE = Object.freeze({
    DA_SE:   Symbol('Directed.Action + Self.Explanation'),
    DA_CTRL: Symbol('Directed.Action + Control'),
    AP_SE:   Symbol('Action.Prediction + Self.Explanation'),
    AP_CTRL: Symbol('Action.Prediction + Control'),
});