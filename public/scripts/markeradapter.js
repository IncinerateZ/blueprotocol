const points = require('./warppoints.json');

var res = {};

const Adapters = {
    WarpPoints: function (point) {
        return {
            _id: point.id,
            map: point.game_content_id,
            id: point.portal,
            name: '',
            x: point.location_x,
            y: point.location_y,
        };
    },
};

for (let point of points) {
    let map = point.game_content_id;
    if (!res[point.game_content_id]) res[map] = [];
    res[map].push(Adapters['WarpPoints'](point));
}

console.log(res);
