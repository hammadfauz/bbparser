!function(t){var e={};function s(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=t,s.c=e,s.d=function(t,e,n){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)s.d(n,r,function(e){return t[e]}.bind(null,r));return n},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=1)}([function(t,e){const s="\n".charCodeAt(0),n="\t".charCodeAt(0),r="\f".charCodeAt(0),i="\r".charCodeAt(0),o="=".charCodeAt(0),h='"'.charCodeAt(0),a=" ".charCodeAt(0),u="[".charCodeAt(0),T="]".charCodeAt(0),l="/".charCodeAt(0),c="\\".charCodeAt(0),d=String.fromCharCode;t.exports={getChar:d,N:s,F:r,R:i,TAB:n,EQ:o,QUOTEMARK:h,SPACE:a,OPEN_BRAKET:u,CLOSE_BRAKET:T,SLASH:l,PLACEHOLDER_SPACE_TAB:"    ",PLACEHOLDER_SPACE:" ",BACKSLASH:c}},function(t,e,s){t.exports=s(2)},function(t,e,s){const n=s(3),r=s(5);let i,o,h,a,u={},T=null,l=null;const c=()=>h.length?h[h.length-1]:null,d=t=>h.push(r.create(t.getValue())),k=()=>a.length?a[a.length-1]:c().tag,A=()=>{a.length&&a.pop()},E=()=>{h.length&&(h.pop(),A())},p=t=>{(()=>{if(o.length)return o[o.length-1].content;return i})().push(t)},g=t=>{t.isStart()&&(d(t),(t=>T.isTokenNested(t))(t)?o.push(c()):(p(c()),E()))},f=t=>{t.isTag()&&((t=>!u.onlyAllowTags||!u.onlyAllowTags.length||u.onlyAllowTags.indexOf(t)>=0)(t.getName())?(g(t),(t=>{if(t.isEnd()){E();const e=o.pop();if(e)p(e);else if(u.onError){const e=t.getValue(),s=t.getLine(),n=t.getColumn();u.onError({message:`Inconsistent tag '${e}' on line ${s} and column ${n}`,lineNumber:s,columnNumber:n})}}})(t)):p(t.toString()))},m=t=>{const e=c();e?t.isAttrName()?((t=>a.push(t.getValue()))(t),e.attr(k(),null)):t.isAttrValue()?(e.attr(k(),t.getValue()),A()):t.isText()&&e.append(t.getValue()):t.isText()&&p(t.getValue())},_=t=>{f(t),m(t)};t.exports=((t,e={})=>(u=e,T=(e.createTokenizer?e.createTokenizer:(t,e)=>new n(t,{onToken:e}))(t,_),i=[],o=[],h=[],a=[],l=T.tokenize(),i)),t.exports.createTagNode=d},function(t,e,s){const{getChar:n,OPEN_BRAKET:r,CLOSE_BRAKET:i,EQ:o,TAB:h,SPACE:a,N:u,QUOTEMARK:T,PLACEHOLDER_SPACE:l,PLACEHOLDER_SPACE_TAB:c,SLASH:d,BACKSLASH:k}=s(0),A=s(4),E=(t,e,s,n)=>new A(t,e,s,n);t.exports=class{constructor(t,e={}){this.buffer=t,this.colPos=0,this.rowPos=0,this.index=2**32,this.tokenIndex=-1,this.tokens=new Array(Math.floor(this.buffer.length)),this.dummyToken=null,this.wordToken=this.dummyToken,this.tagToken=this.dummyToken,this.attrNameToken=this.dummyToken,this.attrValueToken=this.dummyToken,this.attrTokens=[],this.options=e,this.charMap={[h]:this.charSPACE.bind(this),[a]:this.charSPACE.bind(this),[u]:this.charN.bind(this),[r]:this.charOPENBRAKET.bind(this),[i]:this.charCLOSEBRAKET.bind(this),[o]:this.charEQ.bind(this),[T]:this.charQUOTEMARK.bind(this),[k]:this.charBACKSLASH.bind(this),default:this.charWORD.bind(this)}}emitToken(t){this.options.onToken&&this.options.onToken(t)}appendToken(t){this.tokenIndex+=1,this.tokens[this.tokenIndex]=t,this.emitToken(t)}skipChar(t){this.index+=t,this.colPos+=t}seekChar(t){return this.buffer.charCodeAt(this.index+t)}nextCol(){this.colPos+=1}nextLine(){this.rowPos+=1}flushWord(){this.inWord()&&this.wordToken[A.VALUE_ID]&&(this.appendToken(this.wordToken),this.wordToken=this.createWordToken(""))}createWord(t,e,s){this.inWord()||(this.wordToken=this.createWordToken(t,e,s))}flushTag(){if(this.inTag()){if(""===this.tagToken[A.VALUE_ID]){const t=this.inAttrValue()?n(o):"",e=n(r)+t+n(i);return this.createWord("",0,0),this.wordToken[A.VALUE_ID]+=e,this.tagToken=this.dummyToken,void(this.inAttrValue()&&(this.attrValueToken=this.dummyToken))}this.inAttrName()&&!this.inAttrValue()&&(this.tagToken[A.VALUE_ID]+=l+this.attrNameToken[A.VALUE_ID],this.attrNameToken=this.dummyToken),this.appendToken(this.tagToken),this.tagToken=this.dummyToken}}flushUnclosedTag(){if(this.inTag()){const t=this.tagToken[A.VALUE_ID]+(this.attrValueToken&&this.attrValueToken[A.VALUE_ID]?n(o):"");this.tagToken[A.TYPE_ID]=A.TYPE_WORD,this.tagToken[A.VALUE_ID]=n(r)+t,this.appendToken(this.tagToken),this.tagToken=this.dummyToken,this.inAttrValue()&&(this.attrValueToken=this.dummyToken)}}flushAttrNames(){this.inAttrName()&&(this.attrTokens.push(this.attrNameToken),this.attrNameToken=this.dummyToken),this.inAttrValue()&&(this.attrValueToken.quoted=void 0,this.attrTokens.push(this.attrValueToken),this.attrValueToken=this.dummyToken)}flushAttrs(){this.attrTokens.length&&(this.attrTokens.forEach(this.appendToken.bind(this)),this.attrTokens=[])}charSPACE(t){const e=t===h?c:l;this.flushWord(),this.inTag()?this.inAttrValue()&&this.attrValueToken.quoted?this.attrValueToken[A.VALUE_ID]+=e:(this.flushAttrNames(),this.attrNameToken=this.createAttrNameToken("")):this.appendToken(this.createSpaceToken(e)),this.nextCol()}charN(t){this.flushWord(),this.appendToken(this.createNewLineToken(n(t))),this.nextLine(),this.colPos=0}charOPENBRAKET(t){const e=this.seekChar(1);e===a||e===h?(this.createWord(),this.wordToken[A.VALUE_ID]+=n(t)):(this.flushWord(),this.tagToken=this.createTagToken("")),this.nextCol()}charCLOSEBRAKET(t){const e=this.seekChar(-1);(e===a||e===h)&&(this.wordToken[A.VALUE_ID]+=n(t)),this.nextCol(),this.flushTag(),this.flushAttrNames(),this.flushAttrs()}charEQ(t){const e=this.seekChar(1)===T;this.inTag()?(this.attrValueToken=this.createAttrValueToken(""),e&&(this.attrValueToken.quoted=!0,this.skipChar(1))):this.wordToken[A.VALUE_ID]+=n(t),this.nextCol()}charQUOTEMARK(t){const e=this.seekChar(-1)===k;this.inAttrValue()&&this.attrValueToken[A.VALUE_ID]&&this.attrValueToken.quoted&&!e?this.flushAttrNames():this.inTag()||(this.wordToken?this.wordToken[A.VALUE_ID]+=n(t):this.wordToken=this.createWordToken(n(t))),this.nextCol()}charBACKSLASH(){const t=this.seekChar(1),e=t===T;this.inAttrValue()&&this.attrValueToken[A.VALUE_ID]&&this.attrValueToken.quoted&&e&&(this.attrValueToken[A.VALUE_ID]+=n(t),this.skipChar(1)),this.nextCol()}charWORD(t){this.inTag()?this.inAttrValue()?this.attrValueToken[A.VALUE_ID]+=n(t):this.inAttrName()?this.attrNameToken[A.VALUE_ID]+=n(t):this.tagToken[A.VALUE_ID]+=n(t):(this.createWord(),this.wordToken[A.VALUE_ID]+=n(t)),this.nextCol()}tokenize(){for(this.index=0;this.index<this.buffer.length;){const t=this.buffer.charCodeAt(this.index);(this.charMap[t]||this.charMap.default)(t),++this.index}return this.flushWord(),this.flushUnclosedTag(),this.tokens.length=this.tokenIndex+1,this.tokens}inWord(){return this.wordToken&&this.wordToken[A.TYPE_ID]}inTag(){return this.tagToken&&this.tagToken[A.TYPE_ID]}inAttrValue(){return this.attrValueToken&&this.attrValueToken[A.TYPE_ID]}inAttrName(){return this.attrNameToken&&this.attrNameToken[A.TYPE_ID]}createWordToken(t="",e=this.colPos,s=this.rowPos){return E(A.TYPE_WORD,t,e,s)}createTagToken(t,e=this.colPos,s=this.rowPos){return E(A.TYPE_TAG,t,e,s)}createAttrNameToken(t,e=this.colPos,s=this.rowPos){return E(A.TYPE_ATTR_NAME,t,e,s)}createAttrValueToken(t,e=this.colPos,s=this.rowPos){return E(A.TYPE_ATTR_VALUE,t,e,s)}createSpaceToken(t,e=this.colPos,s=this.rowPos){return E(A.TYPE_SPACE,t,e,s)}createNewLineToken(t,e=this.colPos,s=this.rowPos){return E(A.TYPE_NEW_LINE,t,e,s)}isTokenNested(t){const e=n(r)+n(d)+t.getValue();return this.buffer.indexOf(e)>-1}},t.exports.createTokenOfType=E},function(t,e,s){const{getChar:n,OPEN_BRAKET:r,CLOSE_BRAKET:i,SLASH:o}=s(0),h=t=>t.value,a=t=>t.line,u=t=>t.row,T=t=>"space"===t.type||"new-line"===t.type||"word"===t.type,l=t=>"tag"===t.type,c=t=>h(t).charCodeAt(0)===o,d=t=>!c(t),k=t=>"attr-name"===t.type,A=t=>"attr-value"===t.type,E=t=>{const e=h(t);return c(t)?e.slice(1):e},p=t=>{let e=n(r);return c(t)&&(e+=n(o)),e+=h(t),e+=n(i)};t.exports=class{constructor(t,e,s,n){this.type=String(t),this.value=String(e),this.line=Number(s),this.row=Number(n)}isEmpty(){return!!this.type}isText(){return T(this)}isTag(){return l(this)}isAttrName(){return k(this)}isAttrValue(){return A(this)}isStart(){return d(this)}isEnd(){return c(this)}getName(){return E(this)}getValue(){return h(this)}getLine(){return a(this)}getColumn(){return u(this)}toString(){return p(this)}},t.exports.TYPE_ID="type",t.exports.VALUE_ID="value",t.exports.LINE_ID="line",t.exports.COLUMN_ID="row",t.exports.TYPE_WORD="word",t.exports.TYPE_TAG="tag",t.exports.TYPE_ATTR_NAME="attr-name",t.exports.TYPE_ATTR_VALUE="attr-value",t.exports.TYPE_SPACE="space",t.exports.TYPE_NEW_LINE="new-line"},function(t,e,s){const{getChar:n,OPEN_BRAKET:r,CLOSE_BRAKET:i,SLASH:o}=s(0),{getNodeLength:h,appendToNode:a}=s(1);class u{constructor(t,e,s){this.tag=t,this.attrs=e,this.content=s}attr(t,e){return void 0!==e&&(this.attrs[t]=e),this.attrs[t]}append(t){return a(this,t)}get length(){return h(this)}toString(){const t=n(r),e=n(i),s=n(o);return t+this.tag+e+this.content.reduce((t,e)=>t+e.toString(),"")+t+s+this.tag+e}}t.exports=u,t.exports.create=((t,e={},s=[])=>new u(t,e,s)),t.exports.isOf=((t,e)=>t.tag===e)}]);