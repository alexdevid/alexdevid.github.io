Models.Area = (function () {

    /**
     * @param {String} [params.id]
     * @param {Core.Vector2} [params.position]
     * @param {String} [params.color]
     * @param {Float} [params.width]
     * @param {Float} [params.height]
     * @returns {Area}
     */
    function Area(params, stage) {
        this.Stage = stage;
        this.Shape = new Konva.Rect({
            id: params.id,
            x: params.position.x,
            y: params.position.y,
            width: params.width,
            height: params.height,
            fill: params.color,
            stroke: '#999999',
            strokeWidth: 1
        });

        return this;
    }

    Area.prototype.getShape = function () {
        return this.Shape;
    };

    return Area;
})();