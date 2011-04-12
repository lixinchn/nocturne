nocturne.enumerable = {
	Break: {},

	each: function(enumerable, callback, context){
		try {
			if (Array.prototype.forEach && enumerable.forEach === Array.prototype.forEach){
				enumerable.forEach(callback, context);
			}else if (nocturne.isNumber(enumerable.length)){
				for (var i = 0, l = enumerable.length; i < l; i++){
					callback.call(enumerable, enumerable[i], i, enumerable);
				}
			}else {
				for (var key in enumerable){
					if (hasOwnProperty.call(enumerable, key)){
						callback.call(enumerable, enumerable[key], key, enumerable);
					}
				}
			}
		}catch(e){
			if (e != nocturne.enumerable.Break){
				throw e;
			}
		}

		return enumerable;
	},

	map: function(enumerable, callback, context){
		if (Array.prototype.map && enumerable.map === Array.prototype.map){
			return enumerable.map(callback, context);
		}
		var results = [];
		nocturne.enumerable.each(enumerable, function(value, index, list){
			results.push(callback.call(context, value, index, list));
		});
		return results;
	},

	filter: function(enumerable, callback, context){
		if (Array.prototype.filter && enumerable.filter === Array.prototype.filter){
			return enumerable.filter(callback, context);
		}

		var results = [],
			pushIndex = !nocturne.isArray(enumerable);

		nocturne.enumerable.each(enumerable, function(value, index, list){
			if (callback.call(context, value, index, list)){
				if (pushIndex){
					results.push([index, value]);
				}else {
					results.push(value);
				}
			}
		});

		return results;
	},

	reject: function(enumerable, callback, context){
		return this.filter(enumerable, function(){
			return !callback.apply(context, arguments);
		}, context);
	},

	reduce: function(enumerable, memo, callback, context){
		if (Array.prototype.reduce && enumerable.reduce === Array.prototype.reduce){
			return enumerable.reduce(nocturne.bind(callback, context), memo);
		}
		nocturne.enumerable.each(enumerable, function(value, index, list){
			memo = callback.call(context, memo, value, index, list);
		});
		return memo;
	},

	tail: function(enumerable, start){
		start = typeof start === 'undefined' ? 1: start;
		return Array.prototype.slice.apply(enumerable, [start]);
	},

	invoke: function(enumerable, method){
		var args = nocturne.enumerable.tail(arguments, 2);
		return nocturne.enumerable.map(enumerable, function(value){
			return (method ? value[method] : value).apply(value, args);
		});
	},

	pluck: function(enumerable, key){
		return nocturne.enumerable.map(enumerable, function(value){
			return value[key];
		});
	},

	some: function(enumerable, callback, context){
		callback = callback || nocturne.enumerable.identity;
		if (Array.prototype.some && enumerable.some === Array.prototype.some){
			return enumerable.some(callback, context);
		}
		var result = false;
		nocturne.enumerable.each(enumerable, function(value, index, list){
			if (result = callback.call(context, value, index, list)){
				throw nocturne.enumerable.Break;
			}
		});
		return result;
	},

	detect: function(enumerable, callback, context){
		var result;
		nocturne.enumerable.each(enumerable, function(value, index, list){
			if (callback.call(context, value, index, list)){
				result = value;
				throw nocturne.enumerable.Break;
			}
		});
		return result;
	},

	chain: function(enumerable){
		return new nocturne.enumerable.Chainer(enumerable);
	},

	identity: function(value){
		return value;
	}
};

//Alias
nocturne.enumerable.select = nocturne.enumerable.filter;
nocturne.enumerable.inject = nocturne.enumerable.reduce;
nocturne.enumerable.collect = nocturne.enumerable.map;
nocturne.enumerable.rest = nocturne.enumerable.tail;
nocturne.enumerable.any = nocturne.enumerable.some;
nocturne.chainableMethods = ['map', 'collect', 'detect', 'filter', 'reduce', 'tail', 'rest', 'reject', 'pluck', 'any', 'some'];


//Chainer class
nocturne.enumerable.Chainer = nocturne.Class({
	initialize: function(values){
		this.results = values;
	},

	values: function(){
		return this.results;
	}
});

nocturne.enumerable.each(nocturne.chainableMethods, function(methodName){
	var method = nocturne.enumerable[methodName];
	nocturne.enumerable.Chainer.prototype[methodName] = function(){
		var args = Array.prototype.slice.call(arguments);
		args.unshift(this.results);
		this.results = method.apply(this, args);
		return this;
	}
});
