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
	}
};

//Alias
nocturne.enumerable.select = nocturne.enumerable.filter;

//Chainer class
nocturne.enumerable.Chainer = nocturne.Class({
	initialize: function(values){
		this.results = values;
	},

	values: function(){
		return this.results;
	}
});

nocturne.enumerable.each(['map', 'detect', 'filter'], function(methodName){
	var method = nocturne.enumerable[methodName];
	nocturne.enumerable.Chainer.prototype[methodName] = function(){
		var args = Array.prototype.slice.call(arguments);
		args.unshift(this.results);
		this.results = method.apply(this, args);
		return this;
	}
});
