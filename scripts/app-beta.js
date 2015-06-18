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
            var sourceRectBounds = this.areas.source.getClientRect();

            var coords = {
                x: Helpers.randomBetween(50 + Config.ballsRadius + 2, sourceRectBounds.width - 50 - Config.ballsRadius - 2),
                y: Helpers.randomBetween(50 + Config.ballsRadius + 2, sourceRectBounds.height - 50 - Config.ballsRadius - 2),
            };

            var ball = new Models.Ball({
                id: 'ball-' + 1,
                position: coords,
                color: Helpers.randomHex(),
                radius: Config.ballsRadius
            });

            this.balls.push(ball.getShape());
            this.layer.add(ball.getShape());
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
            var mousePos = _this.stage.getPointerPosition();
            var shape = evt.target;

            shape.lastMouseX = mousePos.x;
            shape.lastMouseY = mousePos.y;

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
        var t = Date.now();
        this.stage.on('dragend', function(evt) {

            var shape = evt.target;
            var mousePos = _this.stage.getPointerPosition();
            if (mousePos) {
                var mouseX = mousePos.x;
                var mouseY = mousePos.y;
                var vector2 = {x: 1, y: 1};
                //вправо вниз
                if (mouseX > shape.lastMouseX && mouseY > shape.lastMouseY) {
                    vector2 = {x: 1, y: 1};
                }
                //вправо вверх
                if (mouseX > shape.lastMouseX && mouseY < shape.lastMouseY) {
                    vector2 = {x: 1, y: -1};
                }
                //влево вниз
                if (mouseX < shape.lastMouseX && mouseY > shape.lastMouseY) {
                    vector2 = {x: -1, y: 1};
                }
                //влево вверх
                if (mouseX < shape.lastMouseX && mouseY < shape.lastMouseY) {
                    vector2 = {x: -1, y: -1};
                }
                var now = Date.now();
                var interval = now - t;
                var x_dist = mouseX - shape.lastMouseX;
                var y_dist = mouseY - shape.lastMouseY;

                var velocity = (Math.sqrt(x_dist*x_dist+y_dist*y_dist) / interval) * 55;

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
                console.log(true);

                if (shape.anim) {
                    shape.anim.stop();
                    shape.anim = false;
                }
                _this.moveShape(shape, _this.vectorMultiply(vector2, velocity));

            } else {
                if (!_this.ballInSourceRect(shape)) {
                    shape.position(shape.dragStartCoords);
                } else {
                    if (shape.anim) {
                        shape.anim.stop();
                        shape.anim = false;
                    }
                }
            }
        });

        this.getVelocity = function() {
        }

        this.vectorMultiply = function(vector2, num) {
            return {
                x: vector2.x * num,
                y: vector2.y * num
            };
        }

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