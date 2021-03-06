var proto = require('@dmail/proto');
var polyfill = require('@dmail/polyfill');
require('@dmail/symbol');

var Iterator = require('./Iterator');

// see http://people.mozilla.org/~jorendorff/es6-draft.html#sec-%stringiteratorprototype%.next
var StringIterator = proto.extend.call(Iterator, {
	iteratedString: null,
	nextIndex: null,
	result: null,

	constructor: function(string){
		if( typeof string != 'string' ){
			throw new TypeError('string expected');
		}

		this.iteratedString = string;
		this.nextIndex = 0;
		this.result = {done: false, value: undefined};
	},

	next: function(){
		var string = this.iteratedString;
		var position = this.nextIndex;
		var length = string.length;
		var result = this.result;

		if( position >= length ){
			this.string = null;
			return this.createResult(undefined, true);
		}

		var char = string[position];
		var first = char.charCodeAt(0);

		if( first >= 0xD800 && first <= 0xDBFF && position < length ){
			this.nextIndex+=2;
			char = first + string[position + 1];
		}
		else{
			this.nextIndex++;
		}

		return this.createResult(char, false);
	},

	toString: function(){
		return '[object StringIterator]';
	}
});

StringIterator = StringIterator.constructor;
module.exports = StringIterator;
polyfill(String.prototype, Symbol.iterator, function(){
	return new StringIterator(this);
});