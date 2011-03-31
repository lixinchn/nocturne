(function(global){
	var nocturne = {
		VERSION: '0.0.4',
		lesson: 'Part 4 : Function Programming'
	};

	if (global.nocturne){
		throw new Error('nocturne has already been defined');
	}else {
		global.nocturne = nocturne;
	}
})(typeof window === 'undefined' ? this : window);
