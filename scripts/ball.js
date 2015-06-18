var Models = {};
Models.Ball = (function() {

	/**
	 * @type Konva.Shape
	 */
	var _shape = null;

	/**
	 * @param {Object} params { id: string, position: Vector2, color: string, radius: float }
	 * @returns {_L2.Ball}
	 */
	function Ball(params) {
		_shape = new Konva.Circle({
			id: params.id,
			x: params.position.x,
			y: params.position.y,
			radius: params.radius,
			stroke: 'white',
			strokeWidth: 2,
			fill: params.color,
			draggable: true,
			startScale: 1,
			dragStartCoords: params.coords
		});
	}

	Ball.prototype.getShape = function() {
		return _shape;
	};

	return Ball;
})();

var Vector2 = (function() {

	function Vector2(x, y) {
		this.x = x;
		this.y = y;
	}

	Vector2.prototype.multiply = function(num) {
		this.x *= num;
		this.y *= num;

		return this;
	}

	return Vector2;

})();