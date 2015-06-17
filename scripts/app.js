var Config = {
	boxWidth: window.innerWidth,
	boxHeight: window.innerHeight,
	ballsCount: 15,
	ballsRadius: 30
};

var App = function() {

	this.balls = [];
	this.areas = {
		source: null,
		target: null
	};

	/**
	 *
	 * @returns {App}
	 */
	this.init = function() {
		var savedStage = false;

		if (savedStage) {
			localStorage.removeItem("balls-stage");
			this.stage = Konva.Node.create(savedStage, 'container');
			this.areas = {
				source: this.stage.get("#sourceArea")[0],
				target: this.stage.get("#targetArea")[0]
			};
			for (var i = 0; i < Config.ballsCount; i++) {
				var ball = this.stage.get("#ball-" + i)[0];
				this.balls.push(ball);
				if (this.ballInTargetRect(ball)) {
					this.moveShape(ball, ball.vector2);
				}
			}
			this.bindEvents();
			return this;
		}

		this.stage = new Konva.Stage({
			container: 'container',
			width: Config.boxWidth,
			height: Config.boxHeight
		});
		this.layer = new Konva.Layer();
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
			id: "sourceArea",
			x: 50,
			y: 50,
			width: w - 25,
			height: h,
			fill: '#f2f2f2',
			stroke: '#999999',
			strokeWidth: 1
		});

		this.areas.target = new Konva.Rect({
			id: "targetArea",
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

	this.boundsInBounds = function(bounds1, bounds2) {
		return (
				bounds1.x > bounds2.x
				&&
				bounds1.x < bounds2.x + bounds2.width - Config.ballsRadius * 2
				&&
				bounds1.y > bounds2.y
				&&
				bounds1.y < bounds2.y + bounds2.height - Config.ballsRadius * 2
				);
	};

	this.ballInTargetRect = function(ball) {
		var targetRectBounds = this.areas.target.getClientRect();
		var ballBounds = ball.getClientRect();

		return this.boundsInBounds(ballBounds, targetRectBounds);
	};
	this.ballInSourceRect = function(ball) {
		var sourceRectBounds = this.areas.source.getClientRect();
		var ballBounds = ball.getClientRect();

		return this.boundsInBounds(ballBounds, sourceRectBounds);
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
				id: 'ball-' + i,
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
			shape.dragStartCoords = {
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
			var mousePos = _this.stage.getPointerPosition();
			if (mousePos) {
				var mouseX = mousePos.x;
				var mouseY = mousePos.y;

				shape.lastMouseX = mouseX;
				shape.lastMouseY = mouseY;
			}

			_this.tween = new Konva.Tween({
				node: shape,
				duration: 0.5,
				easing: Konva.Easings.ElasticEaseOut,
				scaleX: shape.getAttr('startScale'),
				scaleY: shape.getAttr('startScale')
			});
			_this.tween.play();

			if (_this.ballInTargetRect(shape)) {
				//shape.setAttrs({draggable: false});

				if (shape.anim) {
					shape.anim.stop();
					shape.anim = false;
				}
				_this.moveShape(shape, {x: 3, y: 3});

			} else {
				if (!_this.ballInSourceRect(shape)) {
					shape.position(shape.dragStartCoords);
				}
			}
		});

		this.vectorInverse = function(vector2) {

			//вправо вниз
			if (vector2.x > 0 && vector2.y > 0) {
				return {x: vector2.x, y: -vector2.y};
			}

			//вправо вверх
			if (vector2.x > 0 && vector2.y < 0) {
				return {x: -vector2.x, y: vector2.y};
			}

			//влево вверх
			if (vector2.x < 0 && vector2.y < 0) {
				return {x: vector2.x, y: -vector2.y};
			}

			//влево вниз
			if (vector2.x < 0 && vector2.y > 0) {
				return {x: -vector2.x, y: vector2.y};
			}
		};

		this.moveShape = function(shape, vector2) {
			var _this = this;
			shape.vector2 = vector2;
			shape.anim = new Konva.Animation(function(frame) {
				shape.move(vector2);
				if (!_this.ballInTargetRect(shape)) {
					shape.anim.stop();
					shape.anim = false;
					_this.moveShape(shape, _this.vectorInverse(vector2));
				}
			}, _this.layer);

			shape.anim.start();
		};
	};

	this.init();

	return this;
};

var app = new App();