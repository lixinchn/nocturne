nocturne.enumerable = {
	Break: {},

	each: function(enumerable, callback, context){
		try {
			if (Array.prototype.forEach && enumerable.forEach === Array.prototype.forEach){
				enumerable.forEach(callback, context);
			}else if (nocturne.numeric.isNumber(enumerable.length)){
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
	}
};
