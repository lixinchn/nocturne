(function(global){
	var nocturne = {
		VERSION: '0.0.2',
		lesson: 'Part 1 : Object Oriented Programing'
	};

	if (global.nocturne){
		throw new Error('nocturne has already been defined');
	}else {
		global.nocturne = nocturne;
	}
})(typeof window === 'undefined' ? this : window);
