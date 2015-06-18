var Helpers = {

    /**
     *
     * @param min
     * @param max
     * @returns {*}
     */
    randomBetween: function (min, max) {
        if (min < 0) {
            return min + Math.random() * (Math.abs(min) + max);
        } else {
            return min + Math.random() * max;
        }
    },

    /**
     *
     * @returns {string}
     */
    randomHex: function () {
        return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    },

    /**
     *
     * @param bounds1
     * @param bounds2
     * @returns {boolean}
     */
    boundsInBounds: function (bounds1, bounds2) {
        return (
        bounds1.x + 3 > bounds2.x
        &&
        bounds1.x + 3 < bounds2.x + bounds2.width - Config.ballsRadius * 2
        &&
        bounds1.y + 3 > bounds2.y
        &&
        bounds1.y + 3 < bounds2.y + bounds2.height - Config.ballsRadius * 2
        );
    }
};