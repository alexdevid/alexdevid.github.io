var Helpers = {
	/**
	 *
	 * @param {type} min
	 * @param {type} max
	 * @returns {Number}
	 */
	randomBetween: function(min, max) {
		if (min < 0) {
			return min + Math.random() * (Math.abs(min) + max);
		} else {
			return min + Math.random() * max;
		}
	},
	/**
	 *
	 * @returns {String}
	 */
	randomHex: function() {
		return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
	}
};