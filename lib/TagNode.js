'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./char'),
    getChar = _require.getChar,
    OPEN_BRAKET = _require.OPEN_BRAKET,
    CLOSE_BRAKET = _require.CLOSE_BRAKET,
    SLASH = _require.SLASH;

var _require2 = require('./index'),
    getNodeLength = _require2.getNodeLength,
    appendToNode = _require2.appendToNode;

var TagNode = function () {
  function TagNode(tag, attrs, content) {
    _classCallCheck(this, TagNode);

    this.tag = tag;
    this.attrs = attrs;
    this.content = content;
  }

  _createClass(TagNode, [{
    key: 'attr',
    value: function attr(name, value) {
      if (typeof value !== 'undefined') {
        this.attrs[name] = value;
      }

      return this.attrs[name];
    }
  }, {
    key: 'append',
    value: function append(value) {
      return appendToNode(this, value);
    }
  }, {
    key: 'toString',
    value: function toString() {
      var OB = getChar(OPEN_BRAKET);
      var CB = getChar(CLOSE_BRAKET);
      var SL = getChar(SLASH);

      return OB + this.tag + CB + this.content.reduce(function (r, node) {
        return r + node.toString();
      }, '') + OB + SL + this.tag + CB;
    }
  }, {
    key: 'length',
    get: function get() {
      return getNodeLength(this);
    }
  }]);

  return TagNode;
}();

module.exports = TagNode;
module.exports.create = function (tag) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return new TagNode(tag, attrs, content);
};
module.exports.isOf = function (node, type) {
  return node.tag === type;
};
