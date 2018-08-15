'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./char'),
    getChar = _require.getChar,
    OPEN_BRAKET = _require.OPEN_BRAKET,
    CLOSE_BRAKET = _require.CLOSE_BRAKET,
    SLASH = _require.SLASH;

// type, value, line, row,


var TOKEN_TYPE_ID = 'type'; // 0;
var TOKEN_VALUE_ID = 'value'; // 1;
var TOKEN_COLUMN_ID = 'row'; // 2;
var TOKEN_LINE_ID = 'line'; // 3;

var TOKEN_TYPE_WORD = 'word';
var TOKEN_TYPE_TAG = 'tag';
var TOKEN_TYPE_ATTR_NAME = 'attr-name';
var TOKEN_TYPE_ATTR_VALUE = 'attr-value';
var TOKEN_TYPE_SPACE = 'space';
var TOKEN_TYPE_NEW_LINE = 'new-line';

var getTokenValue = function getTokenValue(token) {
  return token[TOKEN_VALUE_ID];
};
var getTokenLine = function getTokenLine(token) {
  return token[TOKEN_LINE_ID];
};
var getTokenColumn = function getTokenColumn(token) {
  return token[TOKEN_COLUMN_ID];
};

var isTextToken = function isTextToken(token) {
  return token[TOKEN_TYPE_ID] === TOKEN_TYPE_SPACE || token[TOKEN_TYPE_ID] === TOKEN_TYPE_NEW_LINE || token[TOKEN_TYPE_ID] === TOKEN_TYPE_WORD;
};

var isTagToken = function isTagToken(token) {
  return token[TOKEN_TYPE_ID] === TOKEN_TYPE_TAG;
};
var isTagEnd = function isTagEnd(token) {
  return getTokenValue(token).charCodeAt(0) === SLASH;
};
var isTagStart = function isTagStart(token) {
  return !isTagEnd(token);
};
var isAttrNameToken = function isAttrNameToken(token) {
  return token[TOKEN_TYPE_ID] === TOKEN_TYPE_ATTR_NAME;
};
var isAttrValueToken = function isAttrValueToken(token) {
  return token[TOKEN_TYPE_ID] === TOKEN_TYPE_ATTR_VALUE;
};

var getTagName = function getTagName(token) {
  var value = getTokenValue(token);

  return isTagEnd(token) ? value.slice(1) : value;
};

var convertTagToText = function convertTagToText(token) {
  var text = getChar(OPEN_BRAKET);

  if (isTagEnd(token)) {
    text += getChar(SLASH);
  }

  text += getTokenValue(token);
  text += getChar(CLOSE_BRAKET);

  return text;
};

var Token = function () {
  function Token(type, value, line, row) {
    _classCallCheck(this, Token);

    this.type = String(type);
    this.value = String(value);
    this.line = Number(line);
    this.row = Number(row);
  }

  _createClass(Token, [{
    key: 'isEmpty',
    value: function isEmpty() {
      return !!this.type;
    }
  }, {
    key: 'isText',
    value: function isText() {
      return isTextToken(this);
    }
  }, {
    key: 'isTag',
    value: function isTag() {
      return isTagToken(this);
    }
  }, {
    key: 'isAttrName',
    value: function isAttrName() {
      return isAttrNameToken(this);
    }
  }, {
    key: 'isAttrValue',
    value: function isAttrValue() {
      return isAttrValueToken(this);
    }
  }, {
    key: 'isStart',
    value: function isStart() {
      return isTagStart(this);
    }
  }, {
    key: 'isEnd',
    value: function isEnd() {
      return isTagEnd(this);
    }
  }, {
    key: 'getName',
    value: function getName() {
      return getTagName(this);
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return getTokenValue(this);
    }
  }, {
    key: 'getLine',
    value: function getLine() {
      return getTokenLine(this);
    }
  }, {
    key: 'getColumn',
    value: function getColumn() {
      return getTokenColumn(this);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return convertTagToText(this);
    }
  }]);

  return Token;
}();

module.exports = Token;

module.exports.TYPE_ID = TOKEN_TYPE_ID;
module.exports.VALUE_ID = TOKEN_VALUE_ID;
module.exports.LINE_ID = TOKEN_LINE_ID;
module.exports.COLUMN_ID = TOKEN_COLUMN_ID;
module.exports.TYPE_WORD = TOKEN_TYPE_WORD;
module.exports.TYPE_TAG = TOKEN_TYPE_TAG;
module.exports.TYPE_ATTR_NAME = TOKEN_TYPE_ATTR_NAME;
module.exports.TYPE_ATTR_VALUE = TOKEN_TYPE_ATTR_VALUE;
module.exports.TYPE_SPACE = TOKEN_TYPE_SPACE;
module.exports.TYPE_NEW_LINE = TOKEN_TYPE_NEW_LINE;
