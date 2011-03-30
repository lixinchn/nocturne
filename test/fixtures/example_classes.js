var NoInitializer = nocturne.Class({
	doSomething: function(){
		return 'something';
	}
});

var User = nocturne.Class({
	initialize: function(name, age){
		this.name = name;
		this.age = age;
	},

	display: function(){
		return this.name + ": " + this.age;
	},

	login: function(){
		return true;
	}
});

var Admin = nocturne.Class(User, {
	dangerousMethod: function(){
		return 'danger!';
	}
});

var Guest = nocturne.Class(User, {
	initialize: function(state){
		this.name = 'User_' + this.randomId();
		this.age = 0;
		this.state = state;
	},

	randomId: function(){
		return Math.floor(Math.random() * 100);
	}
});

var MixinUser = nocturne.Class({
	include: User,

	initialize: function(log){
		this.log = log;
	}
});

var DoubleMixinUser = nocturne.Class({
	include: [NoInitializer, User],

	initialize: function(log){
		this.log = log;
	}
});
