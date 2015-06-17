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

	this.ballInTargetRect = function(ball) {
		var targetRectBounds = this.areas.target.getClientRect();
		var ballBounds = ball.getClientRect();

		return (
				ballBounds.x > targetRectBounds.x
				&&
				ballBounds.x < targetRectBounds.x + targetRectBounds.width - Config.ballsRadius
				&&
				ballBounds.y > targetRectBounds.y
				&&
				ballBounds.y < targetRectBounds.y + targetRectBounds.height - Config.ballsRadius * 2
				);
	};
	this.ballInSourceRect = function(ball) {
		var sourceRectBounds = this.areas.source.getClientRect();
		var ballBounds = ball.getClientRect();

		return (
				ballBounds.x > sourceRectBounds.x
				&&
				ballBounds.x < sourceRectBounds.x + sourceRectBounds.width - Config.ballsRadius
				&&
				ballBounds.y > sourceRectBounds.y
				&&
				ballBounds.y < sourceRectBounds.y + sourceRectBounds.height - Config.ballsRadius * 2
				);
	};

	/**
	 *
	 * @returns {App}
	 */
	this.drawBalls = function() {
		var _this = this;
		for (var i = 0; i < Config.ballsCount; i++) {
			//TODO change to getAbsolutePosition();

			var sourceRectBounds = this.areas.source.getClientRect();

			var coords = {
				x: Helpers.randomBetween(50 + Config.ballsRadius + 2, sourceRectBounds.width - 50 - Config.ballsRadius - 2),
				y: Helpers.randomBetween(50 + Config.ballsRadius + 2, sourceRectBounds.height - 50 - Config.ballsRadius - 2),
			};
			var ball = new Konva.Circle({
				x: coords.x,
				y: coords.y,
				radius: Config.ballsRadius,
				stroke: 'white',
				strokeWidth: 2,
				fill: Helpers.randomHex(),
				draggable: true,
				startScale: 1,
				dragStartCoords: coords,
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
			shape.dragStartCoords =  {
					x: shape.getX(),
					y: shape.getY()
				};
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

			if (_this.ballInTargetRect(shape)) {
				var anim = new Konva.Animation(function(frame) {
						shape.setX(shape.getX() + 1);
						shape.setY(shape.getY() + 1);

					if (!_this.ballInTargetRect(shape)) {
						shape.setX(shape.getX() - 1);
						shape.setY(shape.getY() - 1);
					}
				}, _this.layer);
				anim.start();
			} else {
				if(!_this.ballInSourceRect(shape)) {
					shape.position(shape.dragStartCoords);
				}
			}
		});
	};

	this.init();

	return this;
};

var app = new App();



