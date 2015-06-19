var App = (function() {


	var Config = {};

	/**
	 * @param config
	 * @constructor
	 */
	function App(config) {
		Config = config;

		this.flushCache = false;
		this.balls = [];
		this.areas = {
			source: {},
			target: {}
		};

		if (!this.load()) {
			this.render().drawGui().stage.add(this.layer);
		}
	}

	App.prototype.render = function() {
		this.stage = new Konva.Stage({
			container: 'container',
			width: Config.boxWidth,
			height: Config.boxHeight
		});
		this.layer = new Konva.Layer();

		return this;
	};

	App.prototype.drawGui = function() {
		return this.drawAreas().drawBalls();
	};

	/**
	 * @returns {App}
	 */
	App.prototype.drawAreas = function() {
		var w = (Config.boxWidth - 100) / 2;
		var h = Config.boxHeight - 100;

		this.areas.source = new Models.Area({
			id: 'sourceArea',
			width: w,
			height: h,
			color: '#f2f2f2',
			position: new Vector2(50, 50)
		}, this.stage);

		this.areas.target = new Models.Area({
			id: 'targetArea',
			width: w,
			height: h,
			color: '#f2f2f2',
			position: new Vector2(75 + w, 50)
		}, this.stage);

		this.layer.add(this.areas.source.getShape());
		this.layer.add(this.areas.target.getShape());

		return this;
	};

	/**
	 * @returns {App}
	 */
	App.prototype.drawBalls = function() {
		for (var i = 0; i < Config.ballsCount; i++) {
			var sourceRectBounds = this.areas.source.getShape().getClientRect();
			var coords = {
				x: Helpers.randomBetween(50 + Config.ballsRadius + 2, sourceRectBounds.width - 50 - Config.ballsRadius - 2),
				y: Helpers.randomBetween(50 + Config.ballsRadius + 2, sourceRectBounds.height - 50 - Config.ballsRadius - 2)
			};

			var ball = new Models.Ball({
				id: 'ball-' + i,
				position: coords,
				color: Helpers.randomHex(),
				radius: Config.ballsRadius
			}, this.stage, this.layer);

			ball.bindDragStart().bindDragEnd();

			this.balls.push(ball);
			this.layer.add(ball.getShape());
		}
		return this;
	};


	App.prototype.save = function() {

		var ballKeys = [];
		for (var i = 0; i < this.balls.length; i++) {
			ballKeys.push(this.balls[i].save());
		}

		localStorage.setItem("app.keys.balls", JSON.stringify(ballKeys));
		return false;
	};

	App.prototype.load = function() {
		var savedBalls = JSON.parse(localStorage.getItem('app.keys.balls'));

		if (savedBalls) {
			this.render().drawAreas();
			for (var i = 0; i < savedBalls.length; i++) {
				var ball = Models.Ball.load(savedBalls[i], this.stage, this.layer);

				this.balls.push(ball);
				this.layer.add(ball.getShape());
				if (ball.isInRect(this.areas.target.getShape().getClientRect())) {
					ball.move(new Vector2(ball.vector2.x, ball.vector2.y), this.areas.target.getShape().getClientRect());
				}
			}

			this.stage.add(this.layer);
			return true;
		}
		return false;
	};

	App.prototype.flush = function() {
		this.flushCache = true;
		localStorage.removeItem('app.keys.balls');
		return false;
	};

	return App;
})();


var application = new App(Config);

window.onbeforeunload = function(e) {
	if(!application.flushCache){
		application.save();
	}
	return false;
}