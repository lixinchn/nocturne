(function() {
  var anim = {},
      easing = {},
	  Chainer,
      opacityType,
	  CSSTransitions = {};

  // These CSS related functions should be moved into nocturne.css
  function camelize(property){
	  return property.replace(/-+(.)?/g, function(match, chr){
		  return chr ? chr.toUpperCase() : '';
	  });
  }

  function getOpacityType(){
	  return (typeof document.body.style.opacity !== 'undefined') ? 'opacity' : 'filter';
  }

  function Color(value) {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.value = this.normalise(value);
    this.parse();
  }

  // Based on: http://www.phpied.com/rgb-color-parser-in-javascript/
  Color.matchers = [
    {
      re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
      example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
      process: function (bits){
        return [
          parseInt(bits[1]),
          parseInt(bits[2]),
          parseInt(bits[3])
        ];
      }
    },
    {
      re: /^(\w{2})(\w{2})(\w{2})$/,
      example: ['#00ff00', '336699'],
      process: function (bits){
        return [
          parseInt(bits[1], 16),
          parseInt(bits[2], 16),
          parseInt(bits[3], 16)
        ];
      }
    },
    {
      re: /^(\w{1})(\w{1})(\w{1})$/,
      example: ['#fb0', 'f0f'],
      process: function (bits) {
        return [
          parseInt(bits[1] + bits[1], 16),
          parseInt(bits[2] + bits[2], 16),
          parseInt(bits[3] + bits[3], 16)
        ];
      }
    }
  ];

  Color.prototype.normalise = function(value) {
    value.replace(/ /g, '');
    if (value.charAt(0) == '#') {
      value = value.substr(1, 6);
    }
    return value;
  }

  Color.prototype.parse = function() {
    var channels = [], i;
    for (i = 0; i < Color.matchers.length; i++) {
      channels = this.value.match(Color.matchers[i].re);
      if (channels) {
        channels = Color.matchers[i].process(channels);
        this.r = channels[0];
        this.g = channels[1];
        this.b = channels[2];
        break;
      }
    }
    this.validate();
  }

  Color.prototype.validate = function() {
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);
  }

  Color.prototype.sum = function() {
    return this.r + this.g + this.b;
  }

  Color.prototype.toString = function() {
    return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
  }

  function isColor(value) {
    return typeof value === 'string' && value.match(/(#[a-f|A-F|0-9]|rgb)/);
  }
  
  function parseColor(value) {
    return { value: new Color(value), units: '', transform: colorTransform };
  }

  function numericalTransform(parsedValue, position, easingFunction) {
    return (easingFunction(position) * parsedValue.value);
  }

  function colorTransform(v, position, easingFunction) {
    var colors = [];
    colors[0] = Math.round(v.base.r + (v.direction[0] * (Math.abs(v.base.r - v.value.r) * easingFunction(position))));
    colors[1] = Math.round(v.base.g + (v.direction[1] * (Math.abs(v.base.g - v.value.g) * easingFunction(position))));
    colors[2] = Math.round(v.base.b + (v.direction[2] * (Math.abs(v.base.b - v.value.b) * easingFunction(position))));
    return 'rgb(' + colors.join(', ') + ')';
  }

  function parseNumericalValue(value) {
    var n = (typeof value === 'string') ? parseFloat(value) : value,
        units = (typeof value === 'string') ? value.replace(n, '') : '';
    return { value: n, units: units, transform: numericalTransform };
  }

  function parseCSSValue(value, element, property) {
    if (isColor(value)) {
      var color = parseColor(value), i;
      color.base = new Color(element.style[property]);
      color.direction = [color.base.r < color.value.r ? 1 : -1,
                          color.base.g < color.value.g ? 1 : -1,
                          color.base.b < color.value.b ? 1 : -1];
      return color;
    } else {
      return parseNumericalValue(value);
    }
  }

  function setCSSProperty(element, property, value) {
    if (property == 'opacity' && opacityType == 'filter') {
      element.style[opacityType] = 'alpha(opacity=' + Math.round(value * 100) + ')';
      return element;
    }
    element.style[property] = value;
    return element;
  }

  easing.linear = function(position) {
    return position;
  };

  easing.sine = function(position) {
    return (-Math.cos(position * Math.PI) / 2) + 0.5;
  };

  easing.reverse = function(position) {
    return 1.0 - position;
  };

  easing.spring = function(position) {
    return 1 - (Math.cos(position * Math.PI * 4) * Math.exp(-position * 6))
  };

  easing.bounce = function(position) {
    if (position < (1 / 2.75)) {
      return 7.6 * position * position;
    } else if (position < (2 /2.75)) {
      return 7.6 * (position -= (1.5 / 2.75)) * position + 0.74;
    } else if (position < (2.5 / 2.75)) {
      return 7.6 * (position -= (2.25 / 2.75)) * position + 0.91;
    } else {
      return 7.6 * (position -= (2.625 / 2.75)) * position + 0.98;
    }
  };

  anim.animate = function(element, duration, properties, options) {
    var duration = duration,
        start = (new Date).valueOf(),
        finish = start + duration,
        easingFunction = easing.linear,
        interval;

	if (!opacityType){
		opacityType = getOpacityType();
	}

    options = options || {};
    if (options.hasOwnProperty('easing')) {
      if (typeof options.easing === 'string') {
        easingFunction = easing[options.easing];
      } else if (options.easing) {
        easingFunction = options.easing;
      }
    }

    for (var property in properties) {
      if (properties.hasOwnProperty(property)) {
        properties[property] = parseCSSValue(properties[property], element, property);
        if (property == 'opacity' && opacityType == 'filter') {
          element.style.zoom = 1;
		}else if (CSSTransitions.vendorPrefix && property == 'left' || property == 'top'){
			CSSTransitions.start(element, duration, property, properties[property].value + properties[property].units, options.easing);
			setTimeout(function(){
				CSSTransitions.end(element, property);
			}, duration);
			return;
		}
      }
    }

    interval = setInterval(function() {
      var time = (new Date).valueOf(), position = time > finish ? 1 : (time - start) / duration;

      for (var property in properties) {
        if (properties.hasOwnProperty(property)) {
          setCSSProperty(
            element,
            property,
            properties[property].transform(properties[property], position, easingFunction) + properties[property].units);
        }
      }

      if (time > finish) {
        clearInterval(interval);
      }
    }, 10);
  };

  CSSTransitions = {
	  //CSS3 vendor detection
	  vendors: {
		  //Opera Presto 2.3
		  'opera': {
			  'prefix': '-o-',
			  'detector': function(){
				  try{
					  document.createEvent('OTransitionEvent');
					  return true;
				  }catch(e){
					  return false;
				  }
			  }
		  },

		  //Chrome, Safari
		  'webkit': {
			  'prefix': '-webkit-',
			  'detector': function(){
				  try{
					  document.createEvent('WebKitTransitionEvent');
					  return true;
				  }catch(e){
					  return false;
				  }
			  }
		  },

		  //Firefox
		  'firefox': {
			  'prefix': '-moz-',
			  'detector': function(){
				  var div = document.createElement('div'),
				  	supported = false;
				  if (typeof div.style.MozTransition !== 'undefined'){
					  supported = true;
				  }
				  div = null;
				  return supported;
			  }
		  }
	  },

	  findCSS3VendorPrefix: function(){
		  for (var detector in CSSTransitions.vendors){
			  detector = this.vendors[detector];
			  if (detector['detector']()){
				  return detector['prefix'];
			  }
		  }
	  },

	  vendorPrefix: null,

	  //CSS3 Transitions
	  start: function(element, duration, property, value, easing){
		  element.style[camelize(this.vendorPrefix + 'transition')] = property + ' ' + duration + 'ms ' + (easing || 'linear');
		  element.style[property] = value;
	  },

	  end: function(element, property){
		  element.style[camelize(this.vendorPrefix + 'transition')] = null;
	  }
  };

  CSSTransitions.vendorPrefix = CSSTransitions.findCSS3VendorPrefix();

  // Helpers
  anim.fade = function(element, duration, options, easing) {
    element.style.opacity = options.from;
    return anim.animate(element, duration, { 'opacity': options.to }, { 'easing': options.easing });
  };

  anim.fadeIn = function(element, duration, options) {
    options = options || {};
    options.from = options.from || 0.0;
    options.to = options.to || 1.0;
    return anim.fade(element, duration, options);
  };

  anim.fadeOut = function(element, duration, options) {
    var from;
    options = options || {};
    options.from = options.from || 1.0;
    options.to = options.to || 0.0;

    // Swap from and to
    from = options.from;
    options.from = options.to;
    options.to = from;

    // This easing function reverses the position value and adds from
    options.easing = function(p) { return (1.0 - p) + options.from; };

    return anim.fade(element, duration, options, { 'easing': options.easing });
  };

  anim.highlight = function(element, duration, options) {
    var style = element.currentStyle ? element.currentStyle : getComputedStyle(element, null);
    options = options || {};
    options.from = options.from || '#ff9';
    options.to = options.to || style.backgroundColor;
    options.easing = options.easing || easing.sine;
    duration = duration || 500;
    element.style.backgroundColor = options.from;
    return setTimeout(function() {
      anim.animate(element, duration, { 'backgroundColor': options.to, 'easing': options.easing })
    }, 200);
  };

  anim.move = function(element, duration, options){
	  return anim.animate(element, duration, {'left': options.x, 'top': options.y}, {'easing': options.easing || easing.sine});
  };

  anim.parseColor = function(colorString){
	  return new Color(colorString);
  };

  anim.pause = function(element, duration, options){};

  anim.easing = easing;


  Chainer = function(element){
	  this.element = element;
	  this.position = 0;
  };

  for (methodName in anim){
	  (function(method){
		  var method = anim[methodName];
		  Chainer.prototype[methodName] = function(){
			  var args = Array.prototype.slice.call(arguments);
			  args.unshift(this.element);

			  //Note: the duration needs to be communicated another way
			  //because of defaults (like highlight())
			  this.position += args[1] || 0;
			  setTimeout(function(){
				  method.apply(null, args);
			  }, this.position);
			  return this;
		  };
	  })(methodName);
  }
  
  anim.chain = function(element){
	  return new Chainer(element);
  };

  nocturne.anim = anim;
})();
