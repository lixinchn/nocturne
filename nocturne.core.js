(function(global){
	function nocturne(){
		return nocturne.init.apply(nocturne, arguments);
	}

	nocturne.VERSION = '0.0.13';
	nocturne.lesson = 'Part 13: Chaining';
	nocturne.alis = '$t';

	nocturne.isArray = Array.isArray || function(object){
		return !!(object && object.concat && object.unshift && !object.callee);
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

	if (global.nocturne){
		throw new Error('nocturne has already been defined');
	}else {
		global.nocturne = nocturne;
	}
})(typeof window === 'undefined' ? this : window);
