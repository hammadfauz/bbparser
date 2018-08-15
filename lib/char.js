'use strict';

var N = '\n'.charCodeAt(0);
var TAB = '\t'.charCodeAt(0);
var F = '\f'.charCodeAt(0);
var R = '\r'.charCodeAt(0);

var EQ = '='.charCodeAt(0);
var QUOTEMARK = '"'.charCodeAt(0);
var SPACE = ' '.charCodeAt(0);

var OPEN_BRAKET = '['.charCodeAt(0);
var CLOSE_BRAKET = ']'.charCodeAt(0);

var SLASH = '/'.charCodeAt(0);
var BACKSLASH = '\\'.charCodeAt(0);

var PLACEHOLDER_SPACE_TAB = '    ';
var PLACEHOLDER_SPACE = ' ';

var getChar = String.fromCharCode;

module.exports = {
  getChar: getChar,
  N: N,
  F: F,
  R: R,
  TAB: TAB,
  EQ: EQ,
  QUOTEMARK: QUOTEMARK,
  SPACE: SPACE,
  OPEN_BRAKET: OPEN_BRAKET,
  CLOSE_BRAKET: CLOSE_BRAKET,
  SLASH: SLASH,
  PLACEHOLDER_SPACE_TAB: PLACEHOLDER_SPACE_TAB,
  PLACEHOLDER_SPACE: PLACEHOLDER_SPACE,
  BACKSLASH: BACKSLASH
};
