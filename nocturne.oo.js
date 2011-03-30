nocturne.Class = function(){
	return nocturne.oo.create.apply(this, arguments);
}

nocturne.oo = {
	create: function(){
		var methods = null,
			parent = undefined,
			klass = function(){
				this.initialize.apply(this, arguments);
			};

		if (typeof arguments[0] === 'function'){
			parent = arguments[0];
			methods = arguments[1];
		}else {
			methods = arguments[0];
		}

		if (typeof parent !== 'undefined'){
			nocturne.oo.extend(klass.prototype, parent.prototype);
		}

		nocturne.oo.mixin(klass, methods);
		nocturne.oo.extend(klass.prototype, methods);
		klass.prototype.constructor = klass;

		if (!klass.prototype.initialize){
			klass.prototype.initialize = function(){};
		}

		return klass;
	},

	mixin: function(klass, methods){
		if (typeof methods.include !== 'undefined'){
			if (typeof methods.include === 'function'){
				nocturne.oo.extend(klass.prototype, methods.include.prototype);
			}else {
				for (var i = 0; i < methods.include.length; i++){
					nocturne.oo.extend(klass.prototype, methods.include[i].prototype);
				}
			}
		}
	},

	extend: function(destination, source){
		for (var property in source){
			destination[property] = source[property];
		}
		return destination;
	}
};
