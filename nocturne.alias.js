(function(){
	nocturne.aliasFramework = function(){
		var alias = function(){
			return nocturne(arguments[0]);
		}

		if (nocturne.enumerable){
			nocturne.enumerable.each(nocturne.enumerable, function(fn, method){
				alias[method] = fn;
			});
		}

		if (nocturne.dom){
			alias.dom = nocturne.dom;
		}

		if (nocturne.events){
			alias.events = nocturne.events;
		}

		return alias;
	};

	nocturne.exportAlias(nocturne.alias, nocturne.aliasFramework);
})();
