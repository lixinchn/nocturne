nocturne.aliasFramework = function(){
	var alias = function(){
		if (typeof arguments[0] === 'string' && nocturne.dom){
			return nocturne.dom.get(arguments[0]);
		}else {
			return nocturne;
		}
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

$n = nocturne.aliasFramework();
