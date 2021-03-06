/*
var it = Iterator('a');
var ita = it['@@iterator']();
var itb = it['@@iterator']();

ita != itb
mais par contre ita et itb itère sur le même objet
autrement dit
ita.next().done; // false
itb.next().done; // true

moi je me vois bien retourner ita === itb juste pour Iterator

see http://people.mozilla.org/~jorendorff/es6-draft.html#sec-array-iterator-objects

object have no iterator, to iterate over an object use Iterator(object, true) or use Map, Set object
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

*/

require('@dmail/symbol');
var polyfill = require('@dmail/polyfill');

var Iterator = {
	constructor: function(object, keyOnly){
		if( arguments.length === 0 ){
			throw new TypeError('missing argument 0 when calling function Iterator');
		}
		if( object == null ){
			throw new TypeError('can\'t convert null to object');
		}
		if( !(this instanceof Iterator) ){
			return new Iterator(object, keyOnly);
		}

		object = Object(object); // will convert "a" into new String("a") for instance

		this.iteratedObject = object;
		this.iterationKind = keyOnly ? 'key' : 'key+value';
		this.result = {done: true, value: undefined};
		this.nextIndex = 0;
		this.iteratedKeys = Object.keys(object);
	},

	createResult: function(value, done){
		this.result = {};
		this.result.value = value;
		this.result.done = done;
		return this.result;
	},

	done: function(){
		return this.createResult(undefined, true);
	},

	next: function(){
		var index = this.nextIndex, keys = this.iteratedKeys, length = keys.length, itemKind, key, object;

		if( index >= length ){
			return this.createResult(undefined, true);
		}

		this.nextIndex++;
		itemKind = this.iterationKind;
		key = this.keys[index];

		if( itemKind == 'key' ){
			return this.createResult(key, false);
		}

		object = this.iteratedObject;

		if( itemKind == 'value' ){
			return this.createResult(object[key], false);
		}

		return this.createResult([key, object[key]], false);
	},

	toString: function(){
		return '[object Object]';
	}
};

Iterator[Symbol.Iterator] = function(){
	return this;
};

Iterator.constructor.prototype = Iterator;
Iterator = Iterator.constructor;
module.exports = Iterator;

polyfill('global', 'Iterator', Iterator);