const fs = require('fs');

// fs.readFile('./warppoints.json', 'utf8', (e, d) => {
//     let t = JSON.parse(d);
//     for (p of t)
//         if (p.portal.includes('cty01'))
//             console.log(
//                 `{lng:${p.location_x / 47}, lat: ${
//                     (p.location_y * -1) / 63
//                 }, title: '',
//                 description: '',
//                 type: ''},`,
//             );

//     // console.log('[');
//     // for (p of t)
//     //     if (p.portal.includes('cty01')) console.log(`${p.location_x},`);
//     // console.log(']');
//     // console.log('[');
//     // for (p of t)
//     //     if (p.portal.includes('cty01')) console.log(`${p.location_y * -1},`);
//     // console.log(']');
// });

let translated = {
    o: {
        lat: 63.06458410492956,
        lng: 47.109375,
        title: '',
        description: '',
        type: '',
    },
    pts: [
        {
            lat: 39.74091453258897,
            lng: 46.93359375000001,
            title: '',
            description: '',
            type: '',
        },
        {
            lat: 42.65162963307663,
            lng: 21.972656250000004,
            title: '',
            description: '',
            type: '',
        },
        {
            lat: 56.736427223217255,
            lng: 21.796875000000004,
            title: '',
            description: '',
            type: '',
        },
        {
            lat: 67.40097345977351,
            lng: -2.2851562500000004,
            title: '',
            description: '',
            type: '',
        },
        {
            lat: 75.54048004146257,
            lng: 0.17578125,
            title: '',
            description: '',
            type: '',
        },
        {
            lat: 62.42020497483149,
            lng: -24.257812500000004,
            title: '',
            description: '',
            type: '',
        },
        {
            lat: 25.593382696635924,
            lng: 2.8125,
            title: '',
            description: '',
            type: '',
        },
        {
            lat: 33.537743619374815,
            lng: -33.22265625000001,
            title: '',
            description: '',
            type: '',
        },
        {
            lat: 61.51098581979503,
            lng: 59.58984375000001,
            title: '',
            description: '',
            type: '',
        },
    ],
};

let real = {
    x: [-20, -9468, -9483, -18197, -17634, -26749, -16392, -30450, 4715],
    y: [-16421, -15353, -6593, 2071, 11642, -2494, -22289, -18945, -2717],
};

for (let i = 0; i < real.x.length; i++) {
    let r = { x: real.x[i], y: real.y[i] };
    let t = {
        x: (translated.o.lng - translated.pts[i].lng).toFixed(2),
        y: (translated.o.lat - translated.pts[i].lat).toFixed(2),
    };
    console.log(`(${r.x},${r.y}) -> (${t.x}, ${t.y})`);
    // console.log(`x: ${r.x} -> ${t.x}, rx=${t.x / r.x}`);
    // console.log(`y: ${r.y} -> ${t.y}, ry=${t.y / r.y}`);
    console.log();
}
