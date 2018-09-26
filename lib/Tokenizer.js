'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./char'),
    getChar = _require.getChar,
    OPEN_BRAKET = _require.OPEN_BRAKET,
    CLOSE_BRAKET = _require.CLOSE_BRAKET,
    EQ = _require.EQ,
    TAB = _require.TAB,
    SPACE = _require.SPACE,
    N = _require.N,
    QUOTEMARK = _require.QUOTEMARK,
    PLACEHOLDER_SPACE = _require.PLACEHOLDER_SPACE,
    PLACEHOLDER_SPACE_TAB = _require.PLACEHOLDER_SPACE_TAB,
    SLASH = _require.SLASH,
    BACKSLASH = _require.BACKSLASH;

var Token = require('./Token');

var createTokenOfType = function createTokenOfType(type, value, line, row) {
  return new Token(type, value, line, row);
};

var Tokenizer = function () {
  function Tokenizer(input) {
    var _charMap;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Tokenizer);

    this.buffer = input;
    this.colPos = 0;
    this.rowPos = 0;
    // eslint-disable-next-line no-bitwise
    this.index = Math.pow(2,32);

    this.tokenIndex = -1;
    this.tokens = new Array(Math.floor(this.buffer.length));
    this.dummyToken = null; // createTokenOfType('', '', '', '');

    this.wordToken = this.dummyToken;
    this.tagToken = this.dummyToken;
    this.attrNameToken = this.dummyToken;
    this.attrValueToken = this.dummyToken;
    this.attrTokens = [];

    this.options = options;

    this.charMap = (_charMap = {}, _defineProperty(_charMap, TAB, this.charSPACE.bind(this)), _defineProperty(_charMap, SPACE, this.charSPACE.bind(this)), _defineProperty(_charMap, N, this.charN.bind(this)), _defineProperty(_charMap, OPEN_BRAKET, this.charOPENBRAKET.bind(this)), _defineProperty(_charMap, CLOSE_BRAKET, this.charCLOSEBRAKET.bind(this)), _defineProperty(_charMap, EQ, this.charEQ.bind(this)), _defineProperty(_charMap, QUOTEMARK, this.charQUOTEMARK.bind(this)), _defineProperty(_charMap, BACKSLASH, this.charBACKSLASH.bind(this)), _defineProperty(_charMap, 'default', this.charWORD.bind(this)), _charMap);
  }

  _createClass(Tokenizer, [{
    key: 'emitToken',
    value: function emitToken(token) {
      if (this.options.onToken) {
        this.options.onToken(token);
      }
    }
  }, {
    key: 'appendToken',
    value: function appendToken(token) {
      this.tokenIndex += 1;
      this.tokens[this.tokenIndex] = token;
      this.emitToken(token);
    }
  }, {
    key: 'skipChar',
    value: function skipChar(num) {
      this.index += num;
      this.colPos += num;
    }
  }, {
    key: 'seekChar',
    value: function seekChar(num) {
      return this.buffer.charCodeAt(this.index + num);
    }
  }, {
    key: 'nextCol',
    value: function nextCol() {
      this.colPos += 1;
    }
  }, {
    key: 'nextLine',
    value: function nextLine() {
      this.rowPos += 1;
    }
  }, {
    key: 'flushWord',
    value: function flushWord() {
      if (this.inWord() && this.wordToken[Token.VALUE_ID]) {
        this.appendToken(this.wordToken);
        this.wordToken = this.createWordToken('');
      }
    }
  }, {
    key: 'createWord',
    value: function createWord(value, line, row) {
      if (!this.inWord()) {
        this.wordToken = this.createWordToken(value, line, row);
      }
    }
  }, {
    key: 'flushTag',
    value: function flushTag() {
      if (this.inTag()) {
        // [] and [=] tag case
        if (this.tagToken[Token.VALUE_ID] === '') {
          var value = this.inAttrValue() ? getChar(EQ) : '';
          var word = getChar(OPEN_BRAKET) + value + getChar(CLOSE_BRAKET);

          this.createWord('', 0, 0);
          this.wordToken[Token.VALUE_ID] += word;

          this.tagToken = this.dummyToken;

          if (this.inAttrValue()) {
            this.attrValueToken = this.dummyToken;
          }

          return;
        }

        if (this.inAttrName() && !this.inAttrValue()) {
          this.tagToken[Token.VALUE_ID] += PLACEHOLDER_SPACE + this.attrNameToken[Token.VALUE_ID];
          this.attrNameToken = this.dummyToken;
        }

        this.appendToken(this.tagToken);
        this.tagToken = this.dummyToken;
      }
    }
  }, {
    key: 'flushUnclosedTag',
    value: function flushUnclosedTag() {
      if (this.inTag()) {
        var value = this.tagToken[Token.VALUE_ID] + (this.attrValueToken && this.attrValueToken[Token.VALUE_ID] ? getChar(EQ) : '');

        this.tagToken[Token.TYPE_ID] = Token.TYPE_WORD;
        this.tagToken[Token.VALUE_ID] = getChar(OPEN_BRAKET) + value;

        this.appendToken(this.tagToken);

        this.tagToken = this.dummyToken;

        if (this.inAttrValue()) {
          this.attrValueToken = this.dummyToken;
        }
      }
    }
  }, {
    key: 'flushAttrNames',
    value: function flushAttrNames() {
      if (this.inAttrName()) {
        this.attrTokens.push(this.attrNameToken);
        this.attrNameToken = this.dummyToken;
      }

      if (this.inAttrValue()) {
        this.attrValueToken.quoted = undefined;
        this.attrTokens.push(this.attrValueToken);
        this.attrValueToken = this.dummyToken;
      }
    }
  }, {
    key: 'flushAttrs',
    value: function flushAttrs() {
      if (this.attrTokens.length) {
        this.attrTokens.forEach(this.appendToken.bind(this));
        this.attrTokens = [];
      }
    }
  }, {
    key: 'charSPACE',
    value: function charSPACE(charCode) {
      var spaceCode = charCode === TAB ? PLACEHOLDER_SPACE_TAB : PLACEHOLDER_SPACE;

      this.flushWord();

      if (this.inTag()) {
        if (this.inAttrValue() && this.attrValueToken.quoted) {
          this.attrValueToken[Token.VALUE_ID] += spaceCode;
        } else {
          this.flushAttrNames();
          this.attrNameToken = this.createAttrNameToken('');
        }
      } else {
        this.appendToken(this.createSpaceToken(spaceCode));
      }
      this.nextCol();
    }
  }, {
    key: 'charN',
    value: function charN(charCode) {
      this.flushWord();
      this.appendToken(this.createNewLineToken(getChar(charCode)));

      this.nextLine();
      this.colPos = 0;
    }
  }, {
    key: 'charOPENBRAKET',
    value: function charOPENBRAKET(charCode) {
      var nextCharCode = this.seekChar(1);
      var isNextSpace = nextCharCode === SPACE || nextCharCode === TAB;

      if (isNextSpace) {
        this.createWord();
        this.wordToken[Token.VALUE_ID] += getChar(charCode);
      } else {
        this.flushWord();

        this.tagToken = this.createTagToken('');
      }

      this.nextCol();
    }
  }, {
    key: 'charCLOSEBRAKET',
    value: function charCLOSEBRAKET(charCode) {
      var prevCharCode = this.seekChar(-1);
      var isPrevSpace = prevCharCode === SPACE || prevCharCode === TAB;

      if (isPrevSpace) {
        this.wordToken[Token.VALUE_ID] += getChar(charCode);
      }

      this.nextCol();
      this.flushTag();
      this.flushAttrNames();
      this.flushAttrs();
    }
  }, {
    key: 'charEQ',
    value: function charEQ(charCode) {
      var nextCharCode = this.seekChar(1);
      var isNextQuotemark = nextCharCode === QUOTEMARK;

      if (this.inTag()) {
        this.attrValueToken = this.createAttrValueToken('');

        if (isNextQuotemark) {
          this.attrValueToken.quoted = true;
          this.skipChar(1);
        }
      } else {
        if (this.wordToken) {
          this.wordToken[Token.VALUE_ID] += getChar(charCode);
        }else{
          this.wordToken = this.createWordToken(getChar(charCode),0,0);
        }
      }

      this.nextCol();
    }
  }, {
    key: 'charQUOTEMARK',
    value: function charQUOTEMARK(charCode) {
      var prevCharCode = this.seekChar(-1);
      var isPrevBackslash = prevCharCode === BACKSLASH;

      if (this.inAttrValue() && this.attrValueToken[Token.VALUE_ID] && this.attrValueToken.quoted && !isPrevBackslash) {
        this.flushAttrNames();
      } else if (!this.inTag()) {
        if (!this.wordToken) {
          this.wordToken = this.createWordToken(getChar(charCode));
        } else {
          this.wordToken[Token.VALUE_ID] += getChar(charCode);
        }
      }

      this.nextCol();
    }
  }, {
    key: 'charBACKSLASH',
    value: function charBACKSLASH() {
      var nextCharCode = this.seekChar(1);
      var isNextQuotemark = nextCharCode === QUOTEMARK;

      if (this.inAttrValue() && this.attrValueToken[Token.VALUE_ID] && this.attrValueToken.quoted && isNextQuotemark) {
        this.attrValueToken[Token.VALUE_ID] += getChar(nextCharCode);
        this.skipChar(1);
      }

      this.nextCol();
    }
  }, {
    key: 'charWORD',
    value: function charWORD(charCode) {
      if (this.inTag()) {
        if (this.inAttrValue()) {
          this.attrValueToken[Token.VALUE_ID] += getChar(charCode);
        } else if (this.inAttrName()) {
          this.attrNameToken[Token.VALUE_ID] += getChar(charCode);
        } else {
          this.tagToken[Token.VALUE_ID] += getChar(charCode);
        }
      } else {
        this.createWord();

        this.wordToken[Token.VALUE_ID] += getChar(charCode);
      }

      this.nextCol();
    }
  }, {
    key: 'tokenize',
    value: function tokenize() {
      this.index = 0;
      while (this.index < this.buffer.length) {
        var charCode = this.buffer.charCodeAt(this.index);

        (this.charMap[charCode] || this.charMap.default)(charCode);

        // eslint-disable-next-line no-plusplus
        ++this.index;
      }

      this.flushWord();
      this.flushUnclosedTag();

      this.tokens.length = this.tokenIndex + 1;

      return this.tokens;
    }
  }, {
    key: 'inWord',
    value: function inWord() {
      return this.wordToken && this.wordToken[Token.TYPE_ID];
    }
  }, {
    key: 'inTag',
    value: function inTag() {
      return this.tagToken && this.tagToken[Token.TYPE_ID];
    }
  }, {
    key: 'inAttrValue',
    value: function inAttrValue() {
      return this.attrValueToken && this.attrValueToken[Token.TYPE_ID];
    }
  }, {
    key: 'inAttrName',
    value: function inAttrName() {
      return this.attrNameToken && this.attrNameToken[Token.TYPE_ID];
    }
  }, {
    key: 'createWordToken',
    value: function createWordToken() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var line = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.colPos;
      var row = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.rowPos;

      return createTokenOfType(Token.TYPE_WORD, value, line, row);
    }
  }, {
    key: 'createTagToken',
    value: function createTagToken(value) {
      var line = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.colPos;
      var row = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.rowPos;

      return createTokenOfType(Token.TYPE_TAG, value, line, row);
    }
  }, {
    key: 'createAttrNameToken',
    value: function createAttrNameToken(value) {
      var line = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.colPos;
      var row = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.rowPos;

      return createTokenOfType(Token.TYPE_ATTR_NAME, value, line, row);
    }
  }, {
    key: 'createAttrValueToken',
    value: function createAttrValueToken(value) {
      var line = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.colPos;
      var row = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.rowPos;

      return createTokenOfType(Token.TYPE_ATTR_VALUE, value, line, row);
    }
  }, {
    key: 'createSpaceToken',
    value: function createSpaceToken(value) {
      var line = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.colPos;
      var row = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.rowPos;

      return createTokenOfType(Token.TYPE_SPACE, value, line, row);
    }
  }, {
    key: 'createNewLineToken',
    value: function createNewLineToken(value) {
      var line = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.colPos;
      var row = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.rowPos;

      return createTokenOfType(Token.TYPE_NEW_LINE, value, line, row);
    }
  }, {
    key: 'isTokenNested',
    value: function isTokenNested(token) {
      var value = getChar(OPEN_BRAKET) + getChar(SLASH) + token.getValue();
      return this.buffer.indexOf(value) > -1;
    }
  }]);

  return Tokenizer;
}();

module.exports = Tokenizer;
module.exports.createTokenOfType = createTokenOfType;
