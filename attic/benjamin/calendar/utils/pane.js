/**
* Zapatec Pane object. Creates the element for displaying content
* and gives an interface to work with it.
* @param config [object] - pane config.
*
* Constructor recognizes the following properties of the config object
* \code
*	property name		| description
*-------------------------------------------------------------------------------------------------
*	parent					| [string or object] Reference to DOM element where
*							| newly created Pane will be placed. By default -
*							| document.body
*	containerType			| [string] Required. Possible values: div|iframe|current -
*							| what type of pane to create
*							| * div - create new DIV element and add it into parent
*							| * iframe - create new IFRAME element and add it into parent
*							| * current - use parent as pane container
*	sourceType				| [string] see Zapatec.Widget documentation for this option
*	source					| [string or object] see Zapatec.Widget documentation
*							| for this option
* \endcode
*/
Zapatec.Pane = function(objArgs){
	this.config = {};

	if(arguments.length == 0){
		objArgs = {};
	}
	
	//type of the widget - pane in our case :)
	this.widgetType = "pane";

	Zapatec.Pane.SUPERconstructor.call(this, objArgs);
}

// Inherit SuperClass
Zapatec.inherit(Zapatec.Pane, Zapatec.Widget);

/**
* Init function. Actually this function does the creation of element
* itself, not the constructor.
*/
Zapatec.Pane.prototype.init = function(objArgs){
	//parent element of the Pane
	Zapatec.Utils.createProperty(this.config, "parent", document.body);
	//theme
	this.config.theme = null;
	//initial width
	this.config.width = 100;
	//initial height
	this.config.height = 100;
	//container type "div"/"iframe"/"current"
	this.config.containerType = "div";
	//content source type
	this.config.sourceType = null;
	//source to load content from
	this.config.source = null;
	//is the Pane resized due to its content
	this.config.autoContentWidth = false;
	this.config.autoContentHeight = false;

	// processing Widget functionality
	Zapatec.Pane.SUPERclass.init.call(this, objArgs);

	if(typeof(this.config.parent) == 'string'){
		this.config.parent = document.getElementById(this.config.parent);
	}

	if(this.config.parent == null){
		Zapatec.Log({description: "No reference to parent element."})
		return null;
	}

	if(this.config.containerType == null){
		this.config.containerType = "div";
	}

	// variable to store reference to pane container
	Zapatec.Utils.createProperty(this, "container", null);

	// variable to store the reference to the content element
	Zapatec.Utils.createProperty(this, "contentElement", null);
		
	// internal variable stores reference to IFRAME's document object
	Zapatec.Utils.createProperty(this, "iframeDocument", null);

	// internal variable that indicates if iframe was loaded
	this.ready = false;

	if(this.config.containerType.toLowerCase() == 'iframe'){
		var self = this;

		// create new IFRAME element and replace target element with it
		var iframe = document.createElement("iframe");
		iframe.src = Zapatec.Pane.path + "pane_files/blank.html";
		iframe.style.height = this.config.height + "px";
		iframe.style.width = this.config.width + "px";
		iframe.style.display = 'block';

		this.config.parent.appendChild(iframe);

		this.container = iframe;
		iframe = null;

		// delayed init for iframe
		setTimeout(function(){self.initPane()}, 50);
	} else if(this.config.containerType.toLowerCase() == 'div'){
		this.container = document.createElement("div");
		this.config.parent.appendChild(this.container)
		this.contentElement = this.container;

		this.initPane();
	} else if(this.config.containerType.toLowerCase() == 'current'){
		this.container = this.config.parent;
		this.contentElement = this.container;
		this.initPane();
	} else {
		Zapatec.Log({description: "Unknown container type: " + this.config.containerType + ". Possible values: iframe|div"})
	}
	this.container.className = this.getClassName({prefix: "zpPane"});
}

/*
* \internal For containerType=iframe this function stores reference to internal
* document.body element and loads data from given source.
*/
Zapatec.Pane.prototype.initPane = function(){
	if(this.config.containerType.toLowerCase() == 'iframe'){
		var doc = null;
		//this variable determines if the Pane has the content from the same domain
		var sameDomain = true;
		//iframe's src
		var url = this.getContainer().src;
	
		//is there a protocol definition in the SRC
		//cause if not than this must be the same domain
		//and we don't have to worry about anything
		var protocolSeparatorPos = url.indexOf("://");
	
		//if there is protocol definition than we must check 
		//if domain is the same as ours(I mean the page where we use the Pane)
		if (protocolSeparatorPos != -1) {
			//retreiving the domain
			var domainSeparatorPos = url.indexOf("/", protocolSeparatorPos + 3);
			var domain = url.substring(
				(protocolSeparatorPos > 0 ? protocolSeparatorPos + 3 : 0),
				(domainSeparatorPos > 0 ? domainSeparatorPos : url.length)
			);
			//checking if it is the same
			if (domain != window.location.host) {
				sameDomain = false;
			}
		}
		//if it is the same domain than we can easily work with its content
		//otherwise this.contentElement will be null and all methods
		//that are working with content will block their work
		if (sameDomain) {
			//checking if iframes document is avaliable
			if(this.container.contentDocument != null){
				doc = this.container.contentDocument;
			} else if(this.container.contentWindow && this.container.contentWindow.document != null){
				doc = this.container.contentWindow.document;
			}
	
			var self = this;
			//if iframe's document is unavaliable still 
			//fire this function again with some timeout	
			if(doc == null){
				setTimeout(function(){self.initPane()}, 50);
				return false;
			}
	
			// store reference to iframe's document
			this.iframeDocument = doc;
			this.contentElement = doc.body;
			doc = null;
		}
	}

	//for now Pane has overflow "auto"
	//TODO: change this to be a config option
	this.getContainer().style.overflow = "auto";
	this.ready = true;
	//firing the ready event
	this.fireEvent("onReady", this);
	//clear up events
	//TODO: move this functionality to EventDriven or any other place
	if (this.events["onReady"]) {
		this.events["onReady"].listeners = [];
	}

	this.loadData();
}

/*
* Returns reference to data container - do not use this element to resize it or
* do any other DOM changes!
*/
Zapatec.Pane.prototype.getContainer = function(){
	return this.container;
}

/*
* Returns reference to IFRAME's document object.
*/
Zapatec.Pane.prototype.getIframeDocument = function(){
	return this.iframeDocument;
}

/*
* Returns the element which represents the content
*/
Zapatec.Pane.prototype.getContentElement = function() {
	return this.contentElement;
}

/*
* Returns true if iframe was loaded succesfully
*/
Zapatec.Pane.prototype.isReady = function(){
	return this.ready;
}


/**
* Loads data from the HTML source.
* \param objSource [object] source HTMLElement object.
*/
Zapatec.Pane.prototype.loadDataJson = function(objSource){
	return objSource != null ? this.setContent(objSource.content) : null;
}

/**
* Sets the content of the pane.
* @param content [string or object] - string content or reference to DOM element
* @return [boolean] - true if successfull, otherwise false.
*/
Zapatec.Pane.prototype.setContent = function(content){
	if(!this.isReady()){
		// this can happen when containerType=iframe but it is not created yet.
		var self = this;
		setTimeout(function(){self.setContent(content), 50});
		return null;
	}
	//if there is no contentElement than this is an iframe with src from
	//another domain and we can not work with it
	if (!this.getContentElement()) {
		return false;
	}
	//no content no action :)
	if(content == null){
		return null;
	} else {
		//if this is not iframe and we have auto sizes we need to allow the
		//content to be visible
		if (this.config.containerType.toLowerCase() != "iframe") {
			//saving old overflow
			var oldOverflow = this.getContainer().style.overflow;
			//setting needed sizes to "auto"
			if (this.config.autoContentWidth) {
				//setting overflow visible
				this.getContainer().style.overflow = "visible";
				this.getContainer().style.width = "auto";
			}
			if (this.config.autoContentHeight) {
				//setting overflow visible
				this.getContainer().style.overflow = "visible";
				this.getContainer().style.height = "auto";
			}
		}
		if(typeof(content) == 'string'){
			//setting new content if it is string
			Zapatec.Transport.setInnerHtml({container : this.getContentElement(), html : content});
		} else {
			try{
				//empty the element
				this.getContentElement().innerHTML = "";
				//this is temporary fix for IE as it can not appendChild in iframe 
				//when node was created not in iframe document
				if ((Zapatec.is_ie || Zapatec.is_opera) && this.config.containerType.toLowerCase() == "iframe") {
					Zapatec.Transport.setInnerHtml({container : this.getContentElement(), html : content.outerHTML});
				} else {
					this.getContentElement().appendChild(content);
				}
			} catch(ex){
				return null;
			}
		}
		//if this is not an iframe we get new sizes and set them as the size of Pane
		if (this.config.containerType.toLowerCase() != "iframe") {
			var newWidth = this.getWidth();
			var newHeight = this.getHeight();
		} else {
			//if this is iframe we are using scrollWidth and scrollHeight to resize iframe.
			//FIXME: This is not working correctly so needed to be fixed in new version
			var newWidth = this.getContentElement().scrollWidth + 5;
			var newHeight = this.getContentElement().scrollHeight + 5;
		}
		//restoreing overflow
		if (typeof oldOverflow != "undefined") this.getContainer().style.overflow = oldOverflow;
		//setting new sizes
		if (this.config.autoContentWidth) {
			this.setWidth(newWidth);
		}
		if (this.config.autoContentHeight) {
			this.setHeight(newHeight);
		}
	}
	//calling listeners for contentLoad event
	//use this to resize your widget which uses auto sizes feature of Pane
	this.fireEvent("contentLoaded", this);
	if (this.events["contentLoaded"]) {
		this.events["contentLoaded"].listeners = [];
	}
	return true;
}

/**
* Loads data from the HTML|Xml fragment source.
* \param strSource [string] source HTML fragment.
*/
Zapatec.Pane.prototype.loadDataHtml = Zapatec.Pane.prototype.loadDataXml = Zapatec.Pane.prototype.setContent;

Zapatec.Pane.prototype.loadDataHtmlText = function(content) {
	this.setContent(content);
};

/*
* Set pane width
* \param width [int] - width to set.
*/
Zapatec.Pane.prototype.setWidth = function(width){
	var self = this;
	this.fireWhenReady(function() {
		self.getContainer().style.width = width + "px";
		//we do this to have the size passed be equal to offset size
		if (self.getContainer().offsetWidth != width) {
			var newWidth = width - (self.getContainer().offsetWidth - width);
			if (newWidth < 0) newWidth = 0;
			self.getContainer().style.width = newWidth + "px";
		}
	});
}

/*
* Returns pane width
*/
Zapatec.Pane.prototype.getWidth = function(){
	return this.getContainer().offsetWidth;
}

/*
* Set pane height
* \param height [int] - height to set.
*/
Zapatec.Pane.prototype.setHeight = function(height){
	var self = this;
	this.fireWhenReady(function() {
		self.getContainer().style.height = height + "px";
		//we do this to have the size passed be equal to offset size
		if (self.getContainer().offsetHeight != height) {
			var newHeight = height - (self.getContainer().offsetHeight - height);
			if (newHeight < 0) newHeight = 0;
			self.getContainer().style.height = newHeight + "px";
		}
	});
}

/*
* Returns pane height
*/
Zapatec.Pane.prototype.getHeight = function(){
	return this.getContainer().offsetHeight;
}

/*
 * Removes the border for iframe.
 */
Zapatec.Pane.prototype.removeBorder = function() {
	if (this.config.containerType.toLowerCase() != "iframe") {
		return false;
	}
	var self = this;
	this.fireWhenReady(function() {
		//trying to remove border
		if (!Zapatec.is_ie) {
			self.getContainer().style.border = "none";
		} else {
			if (self.getContentElement()) {
				self.getContentElement().style.border = "none";
			}
		}
	});
};

/* The method to cover setting of content. Simply it sets the content
 * depending on its type.
 * @param content [mixed] - value for the content
 * @param type [string] - type of content: "html", "html/text", "html/url"
 * @return [boolean] - true if successfull, otherwise false.
 */
Zapatec.Pane.prototype.setPaneContent = function(content, type) {
	//if containerType == "iframe" and we are seting its content from URL, 
	//we should use its SRC attribute
	var self = this;
	if (this.config.containerType.toLowerCase() == "iframe" && type == "html/url") {
		this.ready = false;
		this.fireWhenReady(function() {
			//if Pane have auto sizes we need to set them
			if (self.getContentElement()) {
				var newWidth = self.getContentElement().scrollWidth;
				var newHeight = self.getContentElement().scrollHeight;
				if (self.config.autoContentWidth) {
					self.setWidth(newWidth);
				}
				if (self.config.autoContentHeight) {
					self.setHeight(newHeight);
				}
			}		
			self.fireEvent("contentLoaded", self);
			if (self.events["contentLoaded"]) {
				self.events["contentLoaded"].listeners = [];
			}
		});
		this.getContainer().src = content;
		setTimeout(function(){self.initPane()}, 50);
		
		return true;
	}
	
	if (this.config.containerType.toLowerCase() == "iframe" && this.getContainer().src != Zapatec.Pane.path + "blank.html") {
		this.ready = false;
		this.getContainer().src = Zapatec.Pane.path + "blank.html";
		setTimeout(function(){self.initPane()}, 50);
	}
	
	//otherwise we use zpwidget's possibilities
	this.config.source = content;
	this.config.sourceType = type;
	this.loadData();
	
	return true;
};
 
/* 
 * Fires the action when widget is ready.
 * @param func [function] - the function to be fired when the widget is ready
 */
Zapatec.Pane.prototype.fireWhenReady = function(func) {
	if (!this.isReady()) {
		this.addEventListener("onReady", func);
	} else {
		func(this);
	}
}

/**
* Destroys current pane instance removing all related HTML elements.
*/

Zapatec.Pane.prototype.destroy = function(){
	this.config.parent = null;
	this.contentElement = null;
	this.iframeDocument = null;
	if(Zapatec.is_ie && this.config.containerType.toLowerCase() == 'iframe'){
		this.container.src = "javascript:void(0)";
	}

	if (this.container.outerHTML) {
		this.container.outerHTML = "";
	} else {
		Zapatec.Utils.destroy(this.container);
	}
	this.container = null;

}

/**
* Zapatec SplitPane object. Creates the element for displaying vertical
* or horizontal row of Zapatec.Pane objects with possibility of dynamic resizing.
* @param config [object] - SplitPane config.
*
* Constructor recognizes the following properties of the config object
* \code
*	property name		| description
*-------------------------------------------------------------------------------------------------
*	parent					| [string or object] Reference to DOM element where
*							| newly created Pane will be placed. By default -
*							| document.body
*	containerType			| [string] Required. Possible values: div|iframe -
*							| what type of pane to create
*	sourceType				| [string] see Zapatec.Widget documentation for this option
*	source					| [string or object] see Zapatec.Widget documentation
*							| for this option
* \endcode
*/
Zapatec.SplitPane = function(objArgs){
	this.config = {};

	if(arguments.length == 0){
		objArgs = {};
	}

	Zapatec.SplitPane.SUPERconstructor.call(this, objArgs);
}

// Inherit SuperClass
Zapatec.inherit(Zapatec.SplitPane, Zapatec.Widget);

/**
* Init function. Actually this function does the creation of element
* itself, not the constructor.
*/
Zapatec.SplitPane.prototype.init = function(objArgs){
	this.config.parent = document.body;
	this.config.orientation = 'vertical';
	this.config.width = 100;
	this.config.height = 100;
	this.config.firstTheme = null;
	this.config.firstThemePath = null;
	this.config.firstWidth = 100;
	this.config.firstHeight = 100;
	this.config.firstContainerType = null;
	this.config.firstSourceType = null;
	this.config.firstSource = null;
	this.config.secondTheme = null;
	this.config.secondThemePath = null;
	this.config.secondWidth = 100;
	this.config.secondHeight = 100;
	this.config.secondContainerType = null;
	this.config.secondSourceType = null;
	this.config.secondSource = null;

	// processing Widget functionality
	Zapatec.SplitPane.SUPERclass.init.call(this, objArgs);

	if(typeof(this.config.parent) == 'string'){
		this.config.parent = document.getElementById(this.config.parent);
	}

	if(this.config.parent == null){
		Zapatec.Log({description: "No reference to parent element."})
		return null;
	}

	this.container = document.createElement("table");
	this.container.cellSpacing = 0;
	this.container.cellPadding = 0;
	this.container.className = this.getClassName({
		prefix: "zpSplitPane",
		suffix: "Container" + (this.config.orientation.charAt(0).toUpperCase() + this.config.orientation.substring(1))
	});
	var tbody = document.createElement("tbody")
	this.container.appendChild(tbody);
	var tr = document.createElement("tr")
	tbody.appendChild(tr);
	var td = document.createElement("td");
	tr.appendChild(td);

	this.config.parent.appendChild(this.container);

	this.firstPane = new Zapatec.Pane({
		parent: td,
		width: this.config.firstWidth,
		height: this.config.firstHeight,
		containerType: this.config.firstContainerType,
		sourceType: this.config.firstSourceType,
		source: this.config.firstSource,
		theme: this.config.firstTheme,
		themePath: this.config.firstThemePath
	})

	if(this.config.orientation == 'vertical'){
		tr = document.createElement("tr")
		tbody.appendChild(tr);
	}

	this.divider = document.createElement("td");
	this.divider.className = "divider";
	this.divider.appendChild(document.createTextNode(" "))
	tr.appendChild(this.divider);

	if(this.config.orientation == 'vertical'){
		tr = document.createElement("tr")
		tbody.appendChild(tr);
	}

	td = document.createElement("td");
	tr.appendChild(td);

	this.secondPane = new Zapatec.Pane({
		parent: td,
		width: this.config.secondWidth,
		height: this.config.secondHeight,
		containerType: this.config.secondContainerType,
		sourceType: this.config.secondSourceType,
		source: this.config.secondSource,
		theme: this.config.secondTheme,
		themePath: this.config.secondThemePath
	})

	this.initPanes();
}

Zapatec.SplitPane.prototype.initPanes = function(){
	if(!this.firstPane.isReady() || !this.secondPane.isReady()){
		var self = this;
		setTimeout(function(){self.initPanes()}, 50);
	}

	this.firstPane.getContainer().className += " firstPane";
	this.secondPane.getContainer().className += " secondPane";
}

Zapatec.SplitPane.prototype.getFirstPane = function(){
	return this.firstPane;
}

Zapatec.SplitPane.prototype.getSecondPane = function(){
	return this.secondPane;
}

