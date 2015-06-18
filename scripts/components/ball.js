Models.Ball = (function () {

    /**
     * @param {String} [params.id]
     * @param {Vector2} [params.position]
     * @param {String} [params.color]
     * @param {Float} [params.radius]
     * @returns {Ball}
     */
    function Ball(params, stage) {
        this.Stage = stage;
        this.tween = null;
        this.animation = null;
        this.vector2 = {x: 1, y: 1};
        this.dragStartCoords = {x: 0, y: 0};


        this.Shape = new Konva.Circle({
            id: params.id,
            x: params.position.x,
            y: params.position.y,
            radius: params.radius,
            stroke: 'white',
            strokeWidth: 2,
            fill: params.color,
            draggable: true,
            startScale: 1
        });

        this.Shape.setAttr('ball', this);

        return this;
    }

    /**
     * @param rectBounds
     * @returns {boolean}
     */
    Ball.prototype.isInRect = function (rectBounds) {
        var ballBounds = this.getShape().getClientRect();
        return Helpers.boundsInBounds(ballBounds, rectBounds);
    };

    /**
     * @returns {Models.Ball}
     */
    Ball.prototype.bindDragStart = function () {
        this.Shape.on('dragstart', (function(evt){
            var mousePos = this.getStage().getPointerPosition();
            var shape = this.Shape;

            shape.lastMouseX = mousePos.x;
            shape.lastMouseY = mousePos.y;
            
            if (this.tween) {
                this.tween.pause();
            }
            this.dragStartCoords = {
                x: shape.getX(),
                y: shape.getY()
            };
            shape.setAttrs({
                scale: {
                    x: shape.getAttr('startScale') * 1.2,
                    y: shape.getAttr('startScale') * 1.2
                }
            });
        }).bind(this));
        return this;
    };

    /**
     *
     * @param targetArea
     * @param sourceArea
     * @returns {Models.Ball}
     */
    Ball.prototype.bindDragEnd = function () {
        this.Shape.on('dragend', (function(evt){
            var t = new Date(Date.now()).getMilliseconds();
            var shape = this.Shape;
            var mousePos = this.getStage().getPointerPosition();

            window.setTimeout((function(){
                if (mousePos) {
                    var mouseX = mousePos.x;
                    var mouseY = mousePos.y;
                    var vector2 = new Vector2(1, 1).inverse();

                    //вправо вниз
                    if (mouseX > shape.lastMouseX && mouseY > shape.lastMouseY) {
                        vector2.x = 1;
                        vector2.y = 1;
                    }
                    //вправо вверх
                    if (mouseX > shape.lastMouseX && mouseY < shape.lastMouseY) {
                        vector2.x = 1;
                        vector2.y = -1;
                    }
                    //влево вниз
                    if (mouseX < shape.lastMouseX && mouseY > shape.lastMouseY) {
                        vector2.x = -1;
                        vector2.y = 1;
                    }
                    //влево вверх
                    if (mouseX < shape.lastMouseX && mouseY < shape.lastMouseY) {
                        vector2.x = -1;
                        vector2.y = -1;
                    }

                    var now = new Date(Date.now()).getMilliseconds();
                    var interval = now - t;
                    var x_dist = mouseX - shape.lastMouseX;
                    var y_dist = mouseY - shape.lastMouseY;

                    interval = interval > 0 ? interval : 1;
                    var velocity = (Math.sqrt(x_dist * x_dist + y_dist * y_dist) / interval) * 44;

                    shape.lastMouseX = mouseX;
                    shape.lastMouseY = mouseY;
                }

                this.tween = new Konva.Tween({
                    node: shape,
                    duration: 0.5,
                    easing: Konva.Easings.ElasticEaseOut,
                    scaleX: shape.getAttr('startScale'),
                    scaleY: shape.getAttr('startScale')
                });
                this.tween.play();

                if (this.isInRect(this.getStage().get("#targetArea")[0].getClientRect())) {
                    console.log(true);
                    if (this.animation) {
                        this.stopAnimation();
                    }

                    //TODO VELOCITY!
                    this.move(vector2.multiply(3));

                } else {
                    if (!this.isInRect(this.getStage().get("#sourceArea")[0].getClientRect())) {
                        shape.position(this.dragStartCoords);
                    } else {
                        if (this.animation) {
                            this.stopAnimation();
                        }
                    }
                }
            }).bind(this), 0)

        }).bind(this));

        return this;
    };

    /**
     *
     * @param {Vector2} vector2
     * @returns {Models.Ball}
     */
    Ball.prototype.move = function (vector2) {
        this.vector2 = vector2;
        this.animation = new Konva.Animation((function (frame) {
            this.getShape().move(vector2);

            if (!this.isInRect(this.getStage().get("#targetArea")[0].getClientRect())) {
                console.log("BOOM")
                this.stopAnimation();
                console.log(vector2.inverse());
                this.move(vector2.inverse());
            }
        }).bind(this), this.getShape().getLayer());

        this.animation.start();
        return this;
    };

    Ball.prototype.stopAnimation = function() {
        this.animation.stop();
        this.animation = false;
    };

    /**
     * @returns {Konva.Shape}
     */
    Ball.prototype.getShape = function () {
        return this.Shape;
    };

    /**
     * @returns {Konva.Stage}
     */
    Ball.prototype.getStage = function () {
        return this.Stage;
    };

    return Ball;
})();