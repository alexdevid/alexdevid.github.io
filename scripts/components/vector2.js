Vector2 = (function () {

    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    };

    Vector2.prototype.multiply = function (num) {
        this.x *= num;
        this.y *= num;

        return this;
    };

    Vector2.prototype.inverse = function () {

        var v = {x: this.x, y: this.y};
        //вправо вниз
        if (this.x > 0 && this.y > 0) {
            v = {x: this.x, y: -this.y};
        }

        //вправо вверх
        if (this.x > 0 && this.y < 0) {
            v = {x: -this.x, y: this.y};
        }

        //влево вверх
        if (this.x < 0 && this.y < 0) {
            v = {x: this.x, y: -this.y};
        }

        //влево вниз
        if (this.x < 0 && this.y > 0) {
            v = {x: -this.x, y: this.y};
        }

        return new Vector2(v.x, v.y);
    };

    Vector2.prototype.set = function (v) {
        this.x = v.x;
        this.y = v.y;
    };

    return Vector2;
})();