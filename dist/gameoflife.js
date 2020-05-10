"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ConwaysGameOfLife = /*#__PURE__*/function () {
  function ConwaysGameOfLife(canvas) {
    var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 800;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 800;
    var resolution = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;
    var saveHistory = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

    _classCallCheck(this, ConwaysGameOfLife);

    if (_typeof(canvas) == "object") {
      this.canvas = canvas.canvas;

      if (canvas.speed) {
        this.speed = canvas.speed;
      } else {
        this.speed = speed;
      }

      if (canvas.width) {
        this.width = canvas.width;
      } else {
        this.width = width;
      }

      if (canvas.height) {
        this.height = canvas.height;
      } else {
        this.height = height;
      }

      if (canvas.resolution) {
        this.resolution = canvas.resolution;
      } else {
        this.resolution = resolution;
      }

      if (canvas.saveHistory) {
        this.saveHistory = canvas.saveHistory;
      } else {
        this.saveHistory = saveHistory;
      }
    } else {
      this.canvas = canvas;
      this.width = width;
      this.height = height;
      this.resolution = resolution;
      this.speed = speed * 1000;
      this.saveHistory = saveHistory;
    }

    this.cols = this.width / this.resolution;
    this.rows = this.height / this.resolution;
    this.ctx = this.canvas.getContext('2d');
    this.gens = [];
    this.loop;
    this.lastGen;
    this.currentGen = 0;
    this.initialState;
    this.paused = false;
    this.started = false;
    this.onRender;
    this.onNewGen;
    this.onGenUpdate;
    this.history = [];
    this.canvas.height = this.height;
    this.canvas.width = this.width;
    this.init();
  }

  _createClass(ConwaysGameOfLife, [{
    key: "init",
    value: function init() {
      var oldGen = this.createInitialGen();
      this.initialState = oldGen;
      this.render(oldGen);
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;

      if (!this.started) {
        this.started = true;
        var initialState = this.initialState;
        this.loop = window.setInterval(function () {
          initialState = _this.newGen(initialState);

          _this.render(initialState);
        }, this.speed);
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      if (!this.paused) {
        clearInterval(this.loop);
        this.paused = true;
      }
    }
  }, {
    key: "continue",
    value: function _continue() {
      var _this2 = this;

      if (this.paused) {
        this.paused = false;
        var oldGen = this.lastGen;
        this.loop = window.setInterval(function () {
          oldGen = _this2.newGen(oldGen);

          _this2.render(oldGen);
        }, this.speed);
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this.pause();
      this.history = [];
      this.gens = [];
      this.currentGen = 0;
      this.loop = null;
      this.paused = false;
      this.started = false;
      this.init();
    }
  }, {
    key: "setSpeed",
    value: function setSpeed(speed) {
      this.pause();
      this.speed = speed * 1000;
      this["continue"]();
    }
  }, {
    key: "getGen",
    value: function getGen() {
      return this.currentGen;
    }
  }, {
    key: "getGenFromHistory",
    value: function getGenFromHistory(gen) {
      if (this.saveHistory) {
        return this.history[gen];
      }
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
    key: "addEvent",
    value: function addEvent(eventType, eventAction) {
      if (eventType == "onRender") {
        this.onRender = eventAction;
      }

      if (eventType == "onNewGen") {
        this.onNewGen = eventAction;
      }
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

      if (this.saveHistory) {
        this.history.push(newGen);
      }

      if (typeof this.onNewGen == "function") {
        this.onNewGen(newGen);
      }

      return newGen;
    }
  }, {
    key: "displayGen",
    value: function displayGen(gen) {
      for (var col = 0; col < gen.length; col++) {
        for (var row = 0; row < gen[col].length; row++) {
          var cell = gen[col][row];
          this.ctx.beginPath();
          this.ctx.rect(col * this.resolution, row * this.resolution, this.resolution, this.resolution);
          this.ctx.fillStyle = cell ? 'black' : 'white';
          this.ctx.fill();
          this.ctx.stroke();
        }
      }
    }
  }, {
    key: "render",
    value: function render(oldGen) {
      this.currentGen = this.gens.length;
      this.lastGen = oldGen.map(function (arr) {
        return _toConsumableArray(arr);
      });
      this.gen = this.gens.length + 1;
      this.displayGen(oldGen);

      if (typeof this.onRender == "function") {
        this.onRender(this.currentGen);
      }
    }
  }]);

  return ConwaysGameOfLife;
}();