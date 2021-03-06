var proto = require('@dmail/proto');
var polyfill = require('@dmail/polyfill');
require('@dmail/symbol');

var Iterator = require('./iterator');

// see http://people.mozilla.org/~jorendorff/es6-draft.html#sec-array-iterator-objects
var ArrayIterator = proto.extend.call(Iterator, {
	constructor: function(array, kind){
		if( !(array instanceof Array) ){
			throw new TypeError('array expected');
		}

		this.iteratedObject = array;
		this.nextIndex = 0;
		this.iterationKind = kind || 'key+value';
		this.result = {done: false, value: undefined};
	},

	next: function(){
		var index = this.nextIndex, array = this.iteratedObject, length = array.length, itemKind;

		if( index >= length ){
			return this.createResult(undefined, true);
		}

		this.nextIndex++;
		itemKind = this.iterationKind;

		if( itemKind == 'key' ){
			return this.createResult(index, false);
		}

		if( itemKind == 'value' ){
			return this.createResult(array[index], false);
		}

		return this.createResult([index, array[index]], false);
	},

	toString: function(){
		return '[object Array Iterator]';
	}
});

ArrayIterator = ArrayIterator.constructor;

module.exports = ArrayIterator;
polyfill(Array.prototype, Symbol.iterator, function(){
	return new ArrayIterator(this, 'value');
});