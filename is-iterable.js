require('@dmail/symbol');

function isIterable(object){
	return Object(object) == object ? typeof object[Symbol.iterator] === 'function' : false;
}

module.exports = isIterable;