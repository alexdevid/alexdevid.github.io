var App = (function () {


    var Config = {};

    /**
     * @param config
     * @constructor
     */
    function App(config) {
        Config = config;
        this.stage = new Konva.Stage({
            container: 'container',
            width: Config.boxWidth,
            height: Config.boxHeight
        });
        this.layer = new Konva.Layer();

        this.balls = [];
        this.areas = {
            source: {},
            target: {}
        };
    }

    App.prototype.run = function () {
        this.drawGui().stage.add(this.layer);
    };

    App.prototype.drawGui = function () {
        return this.drawAreas().drawBalls();
    };

    /**
     * @returns {App}
     */
    App.prototype.drawAreas = function () {
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
    App.prototype.drawBalls = function () {
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
            }, this.stage);

            ball.bindDragStart().bindDragEnd();

            this.balls.push(ball);
            this.layer.add(ball.getShape());
        }
        return this;
    };


    App.prototype.save = function () {

    };

    App.prototype.load = function () {

    };

    return App;
})();


var application = new App(Config);
application.run();
//
//var savedTest = function () {
//    var savedStage = false;
//
//    if (savedStage) {
//        localStorage.removeItem("balls-stage");
//        this.stage = Konva.Node.create(savedStage, 'container');
//        this.areas = {
//            source: this.stage.get("#sourceArea")[0],
//            target: this.stage.get("#targetArea")[0]
//        };
//        for (var i = 0; i < APP.Config.ballsCount; i++) {
//            var ball = this.stage.get("#ball-" + i)[0];
//            this.balls.push(ball);
//            if (this.ballInTargetRect(ball)) {
//                this.moveShape(ball, ball.vector2);
//            }
//        }
//        this.bindEvents();
//        return this;
//    }
//
//    return this;
//};