export default Adapters = {
    WarpPoints: function (point) {
        return {
            _id: point.id,
            map: point.game_content_id,
            id: point.portal,
            name: '',
            lng: point.location_x,
            lat: point.location_y,
        };
    },
};
