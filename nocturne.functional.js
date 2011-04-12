nocturne.functional = {
	curry: nocturne.bind,

	memorize: function(memo, fn){
		var wrapper = function(n){
			var result = memo[n];
			if (typeof result !== 'number'){
				result = fn(wrapper, n);
				memo[n] = result;
			}
			return result;
		};

		return wrapper;
	}
};
