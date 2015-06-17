var Config = {
	boxWidth: window.innerWidth,
	boxHeight: window.innerHeight,
	ballsCount: 15,
	ballsRadius: 30
};

var App = function() {

	/**
	 *
	 * @returns {App}
	 */
	this.init = function() {
		this.stage = new Konva.Stage({
			container: 'container',
			width: Config.boxWidth,
			height: Config.boxHeight
		});
		this.layer = new Konva.Layer();
		this.balls = [];
		this.areas = {
			source: null,
			target: null
		};
		this.tween = null;

		this
				.drawAreas()
				.drawBalls()
				.bindEvents()
				.stage.add(this.layer);

		return this;
	};

	/**
	 *
	 * @returns {App}
	 */
	this.drawAreas = function() {
		var w = (Config.boxWidth - 100) / 2;
		var h = Config.boxHeight - 100;

		this.areas.source = new Konva.Rect({
			x: 50,
			y: 50,
			width: w - 25,
			height: h,
			fill: '#f2f2f2',
			stroke: '#999999',
			strokeWidth: 1
		});

		this.areas.target = new Konva.Rect({
			x: 75 + w,
			y: 50,
			width: w - 25,
			height: h,
			fill: '#f2f2f2',
			stroke: '#999999',
			strokeWidth: 1
		});

		this.layer.add(this.areas.source);
		this.layer.add(this.areas.target);

		return this;
	};

	/**
	 *
	 * @returns {App}
	 */
	this.drawBalls = function() {
		for (var i = 0; i < Config.ballsCount; i++) {
			var sourceRectBounds = this.areas.source.getClientRect(true);

			var ball = new Konva.Circle({
				x: Helpers.randomBetween(50 + Config.ballsRadius + 2, sourceRectBounds.width - 50 - Config.ballsRadius - 2),
				y: Helpers.randomBetween(50 + Config.ballsRadius + 2, sourceRectBounds.height - 50 - Config.ballsRadius - 2),
				radius: Config.ballsRadius,
				stroke: 'white',
				strokeWidth: 2,
				fill: Helpers.randomHex(),
				draggable: true,
				startScale: 1,
				dragBoundFunc: function(pos) {
					return {
						x: pos.x,
						y: pos.y
					};
				}
			});
			this.balls.push(ball);
			this.layer.add(ball);
		}
		return this;
	};

	/**
	 *
	 * @returns {App}
	 */
	this.bindEvents = function() {
		this._onBallDragStart();
		this._onBallDragEnd();
		return this;
	};

	/**
	 *
	 * @returns {undefined}
	 */
	this._onBallDragStart = function() {
		var _this = this;
		this.stage.on('dragstart', function(evt) {
			var shape = evt.target;
			if (_this.tween) {
				_this.tween.pause();
			}
			shape.setAttrs({
				scale: {
					x: shape.getAttr('startScale') * 1.2,
					y: shape.getAttr('startScale') * 1.2
				}
			});
		});
	};

	/**
	 *
	 * @returns {undefined}
	 */
	this._onBallDragEnd = function() {
		var _this = this;
		this.stage.on('dragend', function(evt) {
			var shape = evt.target;

			_this.tween = new Konva.Tween({
				node: shape,
				duration: 0.5,
				easing: Konva.Easings.ElasticEaseOut,
				scaleX: shape.getAttr('startScale'),
				scaleY: shape.getAttr('startScale')
			});

			_this.tween.play();
		});
	};

	this.init();

	return this;
};

var app = new App();



