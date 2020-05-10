"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ConwaysGameOfLife = /*#__PURE__*/function () {
  function ConwaysGameOfLife(canvas) {
    var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 800;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 800;
    var resolution = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;

    _classCallCheck(this, ConwaysGameOfLife);

    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.resolution = resolution;
    this.speed = speed * 1000;
    this.cols = this.width / this.resolution;
    this.rows = this.height / this.resolution;
    this.ctx = canvas.getContext('2d');
    this.gens = [];
    this.loop;
    this.lastGen;
    this.currentGen = 0;
    canvas.height = this.height;
    canvas.width = this.width;
    this.init();
  }

  _createClass(ConwaysGameOfLife, [{
    key: "init",
    value: function init() {
      var _this = this;

      var oldGen = this.createInitialGen();
      this.render(oldGen);
      this.loop = window.setInterval(function () {
        oldGen = _this.newGen(oldGen);

        _this.render(oldGen);
      }, this.speed);
    }
  }, {
    key: "pause",
    value: function pause() {
      clearInterval(this.loop);
    }
  }, {
    key: "setSpeed",
    value: function setSpeed(speed) {
      this.speed = speed * 1000;
    }
  }, {
    key: "getGen",
    value: function getGen() {
      return this.currentGen;
    }
  }, {
    key: "gensNumbs",
    value: function gensNumbs() {
      return this.gens.length;
    }
  }, {
    key: "loadGen",
    value: function loadGen(gen) {
      var generation = this.gens[gen];
      this.render(generation);
      this.currentGen = gen;
    }
  }, {
    key: "continue",
    value: function _continue() {
      var _this2 = this;

      var oldGen = this.lastGen;
      this.loop = window.setInterval(function () {
        oldGen = _this2.newGen(oldGen);

        _this2.render(oldGen);
      }, this.speed);
    }
  }, {
    key: "createInitialGen",
    value: function createInitialGen() {
      var _this3 = this;

      return new Array(this.cols).fill(null).map(function () {
        return new Array(_this3.rows).fill(null).map(function () {
          return Math.floor(Math.random() * 2);
        });
      });
    }
  }, {
    key: "newGen",
    value: function newGen(oldGen) {
      var newGen = oldGen.map(function (arr) {
        return _toConsumableArray(arr);
      });
      this.gens.push(newGen);

      for (var col = 0; col < oldGen.length; col++) {
        for (var row = 0; row < oldGen[col].length; row++) {
          var cell = oldGen[col][row];
          var neighbour = 0;

          for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
              if (i === 0 && j === 0) {
                continue;
              }

              var neighbour_x = col + i;
              var neighbour_y = row + j;

              if (neighbour_x >= 0 && neighbour_y >= 0 && neighbour_x < this.cols && neighbour_y < this.rows) {
                var currentNeighbour = oldGen[neighbour_x][neighbour_y];
                neighbour += currentNeighbour;
              }
            }
          }

          if (cell === 1 && neighbour < 2) {
            newGen[col][row] = 0;
          } else if (cell === 1 && neighbour > 3) {
            newGen[col][row] = 0;
          } else if (cell === 0 && neighbour === 3) {
            newGen[col][row] = 1;
          }
        }
      }

      return newGen;
    }
  }, {
    key: "render",
    value: function render(oldGen) {
      this.currentGen = this.gens.length;
      this.lastGen = oldGen.map(function (arr) {
        return _toConsumableArray(arr);
      });
      this.gen = this.gens.length + 1;

      for (var col = 0; col < oldGen.length; col++) {
        for (var row = 0; row < oldGen[col].length; row++) {
          var cell = oldGen[col][row];
          this.ctx.beginPath();
          this.ctx.rect(col * this.resolution, row * this.resolution, this.resolution, this.resolution);
          this.ctx.fillStyle = cell ? 'black' : 'white';
          this.ctx.fill();
          this.ctx.stroke();
        }
      }
    }
  }]);

  return ConwaysGameOfLife;
}();