(function(){
	var touch = {};

	//Returns [orientation angle, orientation string]
	touch.orientation = function(){
		var orientation = window.orientation,
			orientationString = '';

		switch (orientation){
			case 0:
				orientationString += 'portrait';
			break;

			case -90:
				orientationString += 'landscape rigth';
			break;
			
			case 90:
				orientationString += 'landscape left';
			break;
			
			case 180:
				orientationString += 'portrait upside-down';
			break;
		}
		return [orientation, orientationString];
	};

	nocturne.touch = touch;
})();
