import { POXI_MAT } from '../materials';
import { getPhalanxLength, SKELETAL_METRICS } from '../skeleton';
import { Geometry, Base, Addition } from '@react-three/csg';
import { 
    pi, box_mesh, sphere_mesh, cyl_mesh, buffer_mesh, 
    half_hexa_prism, bone_0_mesh, bone_1_mesh, 
    pipe_mesh, ring_mesh, _sub_box,
} from './meshLib';

const PH = Math.PI * 0.5;

// Materials
const m1 = POXI_MAT.WHITE;
const m2 = POXI_MAT.DARK_BLUE;
const m3 = POXI_MAT.LIGHT_BLUE;
const m4 = POXI_MAT.DARK;
const m5 = POXI_MAT.PINK;
const m6 = POXI_MAT.RED;
const m7 = POXI_MAT.YELLOW;
const m8 = POXI_MAT.ORANGE;

const f1 = POXI_MAT.WHITE_F;
const f2 = POXI_MAT.DARK_BLUE_F;
const f3 = POXI_MAT.LIGHT_BLUE_F;
const f4 = POXI_MAT.DARK_F;
const f5 = POXI_MAT.PINK_F;
const f6 = POXI_MAT.RED_F;
const f7 = POXI_MAT.YELLOW_F;
const f8 = POXI_MAT.ORANGE_F;


export const HeadSkin = () => {
    // Geometries
    const seg = {y: 24, x: 12}  // number of edges
    const R = 0.3;  // radius
    const H = 0.4;  // height
    
    // Transformations
    const meshPos = [0, 0.05, 0.03];
    const meshScl = [0.9, 0.9, 0.9];
    const fasePos = [0, -.5 * H, 0];
    const dx      = R * (2/3) + 0.5;  // ear-cutter x pos
    
    const _face = () => <Geometry>
        <Base><cylinderGeometry args={[R, R, H, seg.y, 1]}/></Base>

        {/* Back face: back and bottom */}
        {_sub_box([R*2,R*4,R*2], [0,0,-R])}
        {_sub_box([R*2,R*4,R*2], [0,0,-0.4], [pi(-0.2),0,0])}

        {/* Side face: left, right */}
        {_sub_box([0.2,4,4], [+0.4,0,0], [0.4,-0.55,0])}
        {_sub_box([0.2,4,4], [-0.4,0,0], [0.4,+0.55,0])}

        {/* Chin: left, right and bottem */}
        {_sub_box([0.1,4,4], [+0.48,0.22,0], [pi(-0.25),pi(+0.25),-0.175])}
        {_sub_box([0.1,4,4], [-0.48,0.22,0], [pi(-0.25),pi(-0.25),+0.175])}
        {_sub_box([4,4,0.2], [0,-0.24,0.40], [pi(0.4),0,0])}
    </Geometry>;
    
    return (
        <mesh position={meshPos} scale={meshScl} castShadow receiveShadow>
            {m1}
            <Geometry>
                {/* Head, face */}
                <Base><sphereGeometry args={[R, seg.y, seg.x]}/></Base>
                <Addition position={fasePos} >{ _face() }</Addition>

                {/* cutters: ears */}
                {_sub_box([1,1,1], [-dx,0,0])}
                {_sub_box([1,1,1], [+dx,0,0])}
            </Geometry>
        </mesh>
    );
}

export const NeckSkin = () => {
    const seg = 6;
    const clyGeo = [0.08, 0.10, 0.5, seg, 1];
    const xform = [[0,0.25,0], [0,pi(1/seg),0], [1.1,1,1.15]];
    return (
        <group>
            {sphere_mesh(m4, [0.08,24,24])}
            {cyl_mesh(f7, clyGeo, ...xform)}
        </group>
    );
}

export const ChestSkin = () => {
    // Chest meshes material, geometry and transformations
    const mat = f1;
    const seg = 4;
    const meshRot = [0, pi(1/seg), 0];

    const H = [0.15, 0.2, 0.40, 0.2];
    const R = [0.10, 0.7, 0.75, 0.7, 0.5];
    const geoArgs = (i) => [R[i], R[i + 1], H[i], seg, 1];

    let temp = SKELETAL_METRICS.CHEST_Y;
    const py = H.map((h) => {
        temp -= h;
        return temp + 0.5 * h;
    });
    
    return (
        <group>
            <group position={[0,0.25,0]} scale={[1.4,1,0.5]}>
                {cyl_mesh(mat, geoArgs(0), [0,py[0],0], meshRot)}
                {cyl_mesh(mat, geoArgs(1), [0,py[1],0], meshRot)}
                {cyl_mesh(mat, geoArgs(2), [0,py[2],0], meshRot)}
                {cyl_mesh(mat, geoArgs(3), [0,py[3],0], meshRot)}
            </group>
        </group>
    );
}

export const BackSkin = () => {
    return (
        <group>
            {sphere_mesh(m3, [0.15,24,24])}

            {/* <mesh>
                <torusGeometry args={[0.13,0.07,12,60]}/>
                {m2}
            </mesh> */}
        </group>
    );
};

export const WaistSkin = () => {
    const R = 0.22;
    const r = 0.15;
    const thick = 0.12;
    const dx = SKELETAL_METRICS.WAIST_X;
    const dy = SKELETAL_METRICS.WAIST_Y;
    return (
        <group>
            {ring_mesh(m2, R, r, thick, [+dx,-dy,0], [0,0,pi(+0.75)])}
            {ring_mesh(m2, R, r, thick, [-dx,-dy,0], [0,0,pi(-0.75)])}
            {waist_mesh(f1, [0,-0.4,0])}
        </group>
    );
}

export const HipSkin = () => {
    const H = SKELETAL_METRICS.UPR_LEG;
    const meshPos = [0, -H/2, 0];
    const meshRot = [pi(), 0, 0];
    return (
        <group>
            {sphere_mesh(m3, [0.13,24,24])}
            {bone_1_mesh(m1, 0.09, H, 0.045, 0.19, meshPos, meshRot)}
        </group>
    );
}

export const KneeSkin = () => {
    const calfLen = 1.25;
    const meshPos = [0, -calfLen/2, 0];
    return (
        <group>
            {cyl_mesh(f1, [0.040,0.040,0.20,24,1], [0,0,0], [0,0,PH])}
            {cyl_mesh(f4, [0.022,0.022,0.22, 6,1], [0,0,0], [0,0,PH])}

            {bone_0_mesh(m2, 0.09, calfLen, 0.05, 0.19, meshPos)}
            {box_mesh(f2, [0.03, 0.2, 0.12], [0,-calfLen-0.05,0])}
        </group>
    );
}

export const AnkleSkin = () => {
    const [r, h] = [0.060, 0.24];
    const [R, H] = [0.084, 0.16];
    return (
        <group>
            {cyl_mesh(m1, [r,r,h,36,1], [0,0,0], [0,0,PH])}
            {cyl_mesh(m4, [R,R,H,36,1], [0,0,0], [0,0,PH])}
            {cyl_mesh(m2, [0.1,0.1,0.05,36,1], [0,0,0], [0,0,PH])}
            {foot()}
        </group>
    );
}

export const ShoulderSkin = () => {
    const meshRot = [0, PH, 0];
    const boxArgs = [0.02, 1.2, 0.03];
    return (
        <group>
            {/* Shoulder node */}
            {ring_mesh(m2, 0.15, 0.11, 0.12)}
            {sphere_mesh(m3, [0.1,12,12])}

            {/* Inner linkage rods, main arm */}
            {box_mesh(m4, boxArgs, [0,-0.6,0])}
            {cyl_mesh(m2, [0.07,0.07,0.83,24,1], [0,-0.635,0])}

            {/* Ending rings */}
            {pipe_mesh(m1, 0.07, 0.05, 0.04, 0.06, [0,-0.20,0], meshRot)}
            {pipe_mesh(m1, 0.06, 0.05, 0.04, 0.07, [0,-1.07,0], meshRot)}
        </group>
    );
}

export const ElbowSkin= () => {
    return (
        <group>
            {/* Elbow node */}
            {ring_mesh(m2, 0.08, 0.04, 0.08)}
            {cyl_mesh(m1, [0.04,0.04,0.11,12,1], [0,0,0], [0,0,PH])}
            {cyl_mesh(f4, [0.02,0.02,0.14, 6,1], [0,0,0], [0,0,PH])}

            {/* Inner linage rod */}
            {box_mesh(m4, [0.015,1.2,0.03], [0,-0.6,0])}
            
            {/* Ending rings */}
            {ring_mesh(m6, 0.08, 0.06, 0.06, [0,-0.13,0], [0,0,PH])}
            {ring_mesh(m6, 0.08, 0.06, 0.06, [0,-1.13,0], [0,0,PH])}

            {/* Main forearm */}
            {cyl_mesh(m7, [0.07,0.07,0.96,24,1], [0,-0.63,0])}
        </group>
    );
};

export const WristSkin = ({side}) => {
    const sign = {L:1, R:-1}[side];
    return (
        <group>
            {sphere_mesh(m3, [0.05,12,12])}
            {ring_mesh(m5, 0.09, 0.07, 0.07, [0,0.04,0], [0,0,PH])}
            {palm(sign, f1, [0,0.1,-0.04])}
        </group>
    );
}

export const FingerJointSkin = ({fingerKey}) => {
    const pid = Number(fingerKey.charAt(3));
    const width = [0.050, 0.045, 0.040];
    const [R, h] = [0.020, width[pid] - 0.006];
    const [r, H] = [0.012, width[pid]];
    return (
        <group>
            {/** Knuckle */}
            {cyl_mesh(m4, [R,R,h,24,1], [0,0,0], [0,0,PH])}
            {cyl_mesh(m1, [r,r,H,24,1], [0,0,0], [0,0,PH])}
            {/** Phalanx */}
            {phalanx(fingerKey)}
        </group>
    );
}

///////////////////////////////////////////////////////////////////////////////

function foot() {
    const SCALE = [0.8,1,0.9];  // shape scale on [width, length, height]
    const CORR  = 0.04;         // contorls sole heigth
    const z = 0.28 - CORR;      // z-offset to place all parts "on the ground"
    const size = {
        toes: 0.14,
        fore: 0.50,
        hind: 0.14,
        heel: 0.14,
    }
    const py = {
        toes: +0.5 * (size.hind + size.toes) + size.fore,
        fore: +0.5 * (size.hind + size.fore),
        hind: 0,
        heel: -0.5 * (size.hind + size.heel),
    }
    const xform = {
        toes: [[0, py.toes, z], [0,0,0], SCALE],
        fore: [[0, py.fore, z], [0,0,0], SCALE],
        hind: [[0, py.hind, z], [0,0,0], SCALE],
        heel: [[0, py.heel, z], [0,0,0], SCALE],
    }
    return (
        <group>
            {half_hexa_prism(f3, [0.12,0.18,size.toes], CORR, ...xform.toes)}
            {half_hexa_prism(f1, [0.20,0.22,size.fore], CORR, ...xform.fore)}
            {half_hexa_prism(f2, [0.25,0.25,size.hind], CORR, ...xform.hind)}
            {half_hexa_prism(f6, [0.22,0.15,size.heel], CORR, ...xform.heel)}
         </group>
    );
}

function phalanx(fingerKey) {
    // Meta data
    const size = getPhalanxLength(fingerKey);  // phalanx
    const fid = Number(fingerKey.charAt(1));   // finger id
    const pid = Number(fingerKey.charAt(3));   // phalanx id

    // Materials with pid as key
    const meshMat = {
        0: (fid === 1) ? f1 : f8,
        1: f3,
        2: f7,
    }
    // Geometries
    const seg = 8;  // edges number for the prism
    const R = [0.075, 0.070, 0.065];
    const r = [0.070, 0.065, 0.045];
    const cylGeo = [r[pid], R[pid], (0.98 * size), seg, 1];

    // Transformations
    const f1_z_mul = (fid === 1) ? 1.2 : 1;  // make thumb thicker
    const f1_sign  = (fid === 1) ?  -1 : 1;  // cutter sign (thumb)
    
    const meshPos = [0, (size * 0.5), 0];
    const meshScl = [0.52, 1, 0.45 * f1_z_mul];
    const baseRot = [0, pi(-1/seg), 0];

    const py = 0.55 * size;
    const tip_cutting_angle = (pid == 2) ? 0.08 : 0.25;

    const cutter = {
        tip:  [+f1_sign * tip_cutting_angle, 0, 0],
        root: [-f1_sign * 0.25,              0, 0],
    }
    return (
         <mesh position={meshPos} scale={meshScl} castShadow receiveShadow>
            {meshMat[pid]}
            <Geometry >
                <Base rotation={baseRot}>
                    <cylinderGeometry args={cylGeo}/>
                </Base>
                {/* End cutter */}
                {_sub_box([1,0.05,1], [0,+py,0], cutter.tip)}
                {_sub_box([1,0.05,1], [0,-py,0], cutter.root)}
            </Geometry>
        </mesh>
    );
}

function palm(signX, ...xform) {
    const vertices = [
        // Back of hand --------------------------- *
        [+0.06, -0.02, -0.03],  // 0: wrist-pinky
        [+0.14,  0.08,  0   ],
        [+0.15,  0.22,  0.01],  // 2: pinky
        [+0.07,  0.28, -0.01],
        [-0.07,  0.28, -0.01],
        [-0.16,  0.25,  0.01],  // 5: index
        [-0.14,  0.05,  0   ],
        [-0.06, -0.02, -0.03],  // 7: wrist-thumb
        // Inner hand ----------------------------- *
        [+0.06, -0.02,  0.10],  // 8
        [+0.14,  0.08,  0.09],
        [+0.15,  0.22,  0.07],  // 10
        [+0.07,  0.28,  0.07],
        [-0.07,  0.28,  0.07],
        [-0.16,  0.25,  0.07],  // 13
        [-0.14,  0.05,  0.12],
        [-0.06, -0.02,  0.10],  // 15
        [-0.03,  0.08,  0.08],  // 16: thumb-side
        [+0.05,  0.08,  0.08],  // 17: pinky-side
    ];
    vertices.forEach(vertice => vertice[0] *= signX);
    
    const indices = [
        // faces of the 'back of hand'
        0,1,2,    0,2,3,     0,3,4,     0,4,7,     7,4,5,     7,5,6,
        // faces connecting the two sides
        0,8,1,    1,8,9,     1,9,2,     2,9,10, 
        2,10,3,   3,10,11,   3,11,4,    4,11,12,
        4,12,5,   5,12,13,   5,13,6,    6,13,14,
        6,14,7,   7,14,15,   7,15,0,    0,15,8,
        // faces of the 'inner hand'
        16,8,15,  16,15,14,  16,14,13,  16,13,12,  16,12,11, 
        16,8,17,  16,17,11,  17,11,10,  17,10,9,   17,9,8,
    ];

    return buffer_mesh(vertices.flat(), indices, ...xform);
};

function waist_mesh(...xform) {
    // Base points
    const vertices = [
        [-0.25,  0.10, +0.25 + 0.05],  // p
        [-0.25-0.03, -0.50, +0.20],  // b
        [-0.65, -0.15, +0.15+0.05],  // d
        [-0.60 +0.05,  0.10 + 0.1, +0.15+0.05],  // q
    ];
    // Create mirror points about the z-axis, then x-axis
    vertices.push(...vertices.map(p => [ p[0], p[1], -p[2]]));
    vertices.push(...vertices.map(p => [-p[0], p[1],  p[2]]));

    // Each set of 4 point indices defines a face
    const faces = [
        0,1,2,3,   0,8,9,1,    8,9,10,11,     // front
        4,5,6,7,   4,12,13,5,  12,13,14,15,   // back
        3,2,6,7,               11,10,14,15,   // sides
        0,3,7,4,   0,4,12,8,   8,12,15,11,    // top
        1,2,6,5,   1,5,13,9,   9,13,14,10,    // bottom
    ];
    // Generate indices
    const indices = [];
    for (let i = 0; i < faces.length; i += 4) {
        const [a, b, c, d] = faces.slice(i, i + 4);
        indices.push(a, b, c, a, c, d);
    }
    return buffer_mesh(vertices.flat(), indices, ...xform);
}

function mid_mesh(...xform) {
    const vertices = [
        [0.47, 0, 0.15],
        [0.35, -0.65, 0.15],
    ];
    vertices.push(...vertices.map(p => [ p[0], p[1], -p[2]]));
    vertices.push(...vertices.map(p => [-p[0], p[1],  p[2]]));

    const faces = [
        0,1,3,2,  4,5,7,6,  
        0,4,6,2,  1,5,7,3,
        0,1,5,4,  2,3,7,6,
    ];

    return buffer_mesh(vertices.flat(), toIndices(faces), ...xform);
}

function toIndices(faces) {
    const indices = [];
    for (let i = 0; i < faces.length; i += 4) {
        const [a, b, c, d] = faces.slice(i, i + 4);
        indices.push(a, b, c, a, c, d);
    }
    return indices;
}
