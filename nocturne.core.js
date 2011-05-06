(function(global){
	function nocturne(){
		return nocturne.init.apply(nocturne, arguments);
	}

	nocturne.VERSION = '0.0.15';
	nocturne.lesson = 'Part 15: More on chained Events';
	nocturne.alis = '$t';

	nocturne.isArray = Array.isArray || function(object){
		return !!(object && object.concat && object.unshift && !object.callee);
	};

	nocturne.toArray = function(collection){
		var results = [];
		for (var i = 0; i < collection.length; i++){
			results.push(collection[i]);
		}
		return results;
	};

	nocturne.isNumber = function(object){
		return (object === +object) || (toString.call(object) === '[object Number]');
	};

	nocturne.bind = function(fn, object){
		var slice = Array.prototype.slice,
			args = slice.apply(arguments, [2]);

		return function(){
			return fn.apply(object || {}, args.concat(slice.apply(arguments)));
		};
	};

	nocturne.exportAlias = function(aliasName, method){
		global[aliasName] = method();
	};

	nocturne.init = function(){};

	var testCache = {},
		detectionTests = {};

	nocturne.addDetectionTest = function(name, fn){
		if (!detectionTests[name]){
			detectionTests[name] = fn;
		}
	};

	nocturne.detect = function(testName){
		if (typeof testCache[testCache] === 'undefined'){
			testCache[testName] = detectionTests[testName]();
		}
		return testCache[testName];
	};

	if (global.nocturne){
		throw new Error('nocturne has already been defined');
	}else {
		global.nocturne = nocturne;
	}
})(typeof window === 'undefined' ? this : window);
