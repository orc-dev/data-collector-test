import React from 'react';
import { DoubleSide } from "three";
export { BASIC_MAT, POXI_MAT, makePalette };


const BASIC_MAT = Object.freeze({
    WHITE: makeMaterial(0xffffff),
    RED:   makeMaterial(0xff0000),
    BLUE:  makeMaterial(0x3333ff),
    GREEN: makeMaterial(0x298e68, 0.3, 0.7),
    BLACK: makeMaterial(0x333333, 0.8, 0.4),
    TAN:   makeMaterial(0xd4b970),
});

// Source of inspiration: "Poxi" from URL below:
// https://outof.games/realms/hearthstone/card-backs/
// Color picker tool: https://coolors.co/image-picker
const POXI_MAT = Object.freeze({
    DARK:       makeMaterial(0x3A253A),
    DARK_BLUE:  makeMaterial(0x324081),
    LIGHT_BLUE: makeMaterial(0x76D4Dc),
    WHITE:      makeMaterial(0xFDFBFE),
    PINK:       makeMaterial(0xD1AEBA),
    RED:        makeMaterial(0xA17470),
    YELLOW:     makeMaterial(0xc9b8a3),
    ORANGE:     makeMaterial(0xf54e38),

    DARK_F:       makeMaterial(0x3A253A, true),
    DARK_BLUE_F:  makeMaterial(0x324081, true),
    LIGHT_BLUE_F: makeMaterial(0x76D4Dc, true),
    WHITE_F:      makeMaterial(0xFDFBFE, true),
    PINK_F:       makeMaterial(0xD1AEBA, true),
    RED_F:        makeMaterial(0xA17470, true),
    YELLOW_F:     makeMaterial(0xc9b8a3, true),
    ORANGE_F:     makeMaterial(0xf54e38, true),
});


function makeMaterial(color, flatflag=false, metalness=0.5, roughness=0.5) {
    return <meshStandardMaterial color={color} 
        metalness={metalness}
        roughness={roughness}
        side={DoubleSide}
        flatShading={flatflag}
    />;
}


function makePalette(matSet, position) {
    const size = 0.5;
    const gap  = 0.2;
    const keyList = Object.keys(matSet);
    const n = keyList.length;
    
    const xStart = (n / 2) * size + Math.floor(n / 2) * gap;
    const getX = (i) => -xStart + i * (size + gap);

    return (
        <group position={position}>
            {keyList.map((key, i) => (
                <mesh key={key} position={[getX(i), 0, 0]}>
                    <boxGeometry args={[size, size, size]} />
                    {matSet[key]}
                </mesh>
            ))}
        </group>
    );
}