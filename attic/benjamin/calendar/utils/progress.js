/**
 * Zapatec modal object
 */
Zapatec.Modal = function (objArgs) {
	if(arguments.length == 0){
		objArgs = {};
	}

	Zapatec.Modal.SUPERconstructor.call(this, objArgs);
}

// Inherit SuperClass
Zapatec.inherit(Zapatec.Modal, Zapatec.Widget);

Zapatec.Modal.prototype.init = function(objArgs){
	this.config.zIndex = 1000;
	this.config.x = null;
	this.config.y = null;
	this.config.width = null;
	this.config.height = null;
	this.config.container = null;
	this.config.scroll = true;

	// processing Widget functionality
	Zapatec.Modal.SUPERclass.init.call(this, objArgs);
};

Zapatec.Modal.prototype.create = function (zIndex) {
	zIndex = zIndex || this.config.zIndex;

	this.WCH = Zapatec.Utils.createWCH();

	this.container = Zapatec.Utils.createElement("div", document.body);
	var br = {};

	if(this.config.x != null && this.config.y != null){
		br.x = this.config.x;
		br.y = this.config.y;
	} else {
		br.y = Zapatec.Utils.getPageScrollY();
		br.x = Zapatec.Utils.getPageScrollX();
	}
	if (Zapatec.Utils.bodyOffset) {
		br.x -= Zapatec.Utils.bodyOffset.left;
		br.y -= Zapatec.Utils.bodyOffset.top;
	}
	var st = this.container.style;
	st.dispaly = "none";
	st.position = "absolute";
	st.top = br.y + "px";
	st.left = br.x + "px";
	var dim = Zapatec.Utils.getWindowSize();

	if(this.config.width != null){
		dim.width = this.config.width;
	}

	if(this.config.height != null){
		dim.height = this.config.height;
	}

	st.width = dim.width + "px";
	st.height = dim.height + "px";

	st.zIndex = zIndex;

	this.container.className = this.getClassName({prefix: "zpModal" + (Zapatec.is_opera ? "Opera" : "")})

	if(this.config.scroll == true){
		Zapatec.ScrollWithWindow.stickiness = 1;
		Zapatec.ScrollWithWindow.register(this.container);
		if (this.WCH){
			this.WCH.style.zIndex = zIndex - 1;
			Zapatec.ScrollWithWindow.register(this.WCH);
		}
	}
};

Zapatec.Modal.prototype.show = function (zIndex) {
	if (!this.container) {
		this.create(zIndex);
	} else {
		zIndex = zIndex || this.config.zIndex;
		this.container.style.zIndex = zIndex;
		if (this.WCH) this.WCH.style.zIndex = zIndex - 1;
	}
	this.container.style.display = "block";
	Zapatec.Utils.setupWCH(this.WCH, parseInt(this.container.style.left, 10), parseInt(this.container.style.top, 10), parseInt(this.container.style.width, 10), parseInt(this.container.style.height, 10));
};

Zapatec.Modal.prototype.hide = function (destroy) {
	if (destroy) {
		Zapatec.Utils.destroy(this.container);
		Zapatec.Utils.destroy(this.WCH);
		this.container = null;
	} else {
		if (this.container) this.container.style.display = "none";
		Zapatec.Utils.hideWCH(this.WCH);
	}
};

/**
 * Zapatec loader object
 */
Zapatec.Progress = function (objArgs) {
	if(arguments.length == 0){
		objArgs = {};
	}

	Zapatec.Progress.SUPERconstructor.call(this, objArgs);
}

// Inherit SuperClass
Zapatec.inherit(Zapatec.Progress, Zapatec.Widget);

Zapatec.Progress.prototype.init = function(objArgs){
	this.config.zIndex = 1000;
	this.config.x = null;
	this.config.y = null;
	this.config.width = null;
	this.config.height = null;
	this.config.container = null;

	// processing Widget functionality
	Zapatec.Progress.SUPERclass.init.call(this, objArgs);

	var modalConfig = {};

	if(typeof(this.config.container) == 'string'){
		this.config.container = document.getElementById(this.config.container);
	}

	if(this.config.container != null){
		var size = Zapatec.Utils.getAbsolutePos(this.config.container);

		this.config.x = size.x;
		this.config.y = size.y;
		this.config.width = this.config.container.offsetWidth;
		this.config.height = this.config.container.offsetHeight;
		modalConfig.scroll = false;
	}

	modalConfig.x = this.config.x;
	modalConfig.y = this.config.y;
	modalConfig.width = this.config.width;
	modalConfig.height = this.config.height;
	modalConfig.zIndex = this.config.zIndex - 1;
	modalConfig.theme = this.config.theme;
	modalConfig.themePath = this.config.themePath;

	this.modal = new Zapatec.Modal(modalConfig);
	this.active = false;
};

Zapatec.Progress.prototype.start = function (message) {
	this.active = true;
	this.modal.show();
	this.message = Zapatec.Utils.createElement("div", document.body);
	this.message.className = this.getClassName({prefix: "zpProgress"});
	var st = this.message.style;
	st.position = "absolute";
	st.zIndex = this.config.zIndex;
	st.backgroundColor = "#aaaaaa";
	this.message.innerHTML = message;

	var size = Zapatec.Utils.getWindowSize();

	if(this.config.x != null && this.config.y != null){
		size.x = this.config.x;
		size.y = this.config.y;
	}

	if(this.config.width != null && this.config.height != null){
		size.width = this.config.width;
		size.height = this.config.height;
	}

	var br = Zapatec.Utils.getAbsolutePos(this.modal.container);
	x = (size.width -  this.message.offsetWidth)/2 + br.x; 
	y = (size.height - this.message.offsetHeight)/2 + br.y;
	st.left = x + "px";
	st.top = y + "px";
};

Zapatec.Progress.prototype.stop = function () {
	this.active = false;
	this.modal.hide(true);
	Zapatec.Utils.destroy(this.message);
	this.message = null;
};

Zapatec.Progress.prototype.isActive = function () {
	return this.active;
}
