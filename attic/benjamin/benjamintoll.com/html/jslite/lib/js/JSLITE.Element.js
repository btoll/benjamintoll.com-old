/*
 * jsLite
 *
 * Copyright (c) 2009 - 2011 Benjamin Toll (benjamintoll.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */

/**
* @function Element
* @param {String/HTMLElement} vElem
* @return {JSLITE.Element/Null}
* @describe <p>Constructor. Shouldn't be called directly.</p>
*/
//<source>
JSLITE.Element = function (vElem) {

  /*vElem is null when creating the Flyweight
    in the JSLITE.Composite constructor*/
  if (!vElem) {
    this.dom = null;
    return;
  }
  this.dom = typeof vElem === "string" ? $(vElem) : vElem;
  if (!this.dom.id) {
    this.dom.id = JSLITE.dom.id();
  }

};
//</source>

JSLITE.Element.prototype = {

  constructor: JSLITE.Element,

  /**
  * @function JSLITE.Element.addClass
  * @param {String} sClass
  * @return {JSLITE.Element}
  * @describe <p>Adds a class to an element if it's not present.</p>
  */
  //<source>
  addClass: function (sClass) {

    if (!this.hasClass(sClass)) {
      this.dom.className += " " + sClass;
    }
    return this;

  },
  //</source>

 /**
  * @function JSLITE.Element.after
  * @param {JSLITE.Element/HTMLElement/String} vElem
  * @return {JSLITE.Element}
  * @describe <p>Inserts the new element after the parent in the DOM.</p>
  */
  //<source>
  after: function (vElem) {

    var oTargetElement = this.dom,
      oNewElement = JSLITE.dom.getDom(vElem),
      parent = oTargetElement.parentNode;

    if (parent.lastChild === oTargetElement) {
      parent.appendChild(oNewElement);
    } else {
      parent.insertBefore(oNewElement, oTargetElement.nextSibling);
    }
    return this;

  },
  //</source>

 /**
  * @function JSLITE.Element.ajax
  * @param {String} sURL The URL of the document to be fetched
  * @return {String}
  * @describe <p>This is an alias of <code><a href="#jsdoc">JSLITE.ajax.get</a></code>. It returns the <code>responseText</code>. Please keep in mind that it performs a synchronous request and as such is blocking.</p>
  * @example
//create a tooltip whose results are that of a synchronous Ajax request;
var oLink = JSLITE.dom.get("testy");
oLink.tooltip(oLink.ajax("ajax_sync.html"));
  */
  //<source>
  ajax: function (sURL) {

    return JSLITE.ajax.get(sURL);

  },
  //</source>

  /**
  * @function JSLITE.Element.animate
  * @param {Object} o An object of animation config options
  * @return {JSLITE.Element}
  * @describe <p>Animates an object.</p>
  */
  //<source>
  animate: function (o) {

    o.elem = o.elem || this.dom;
    new JSLITE.ux.Animation(o).run(); //account for every possible property, undefined values are ok;
    return this;

  },
  //</source>

  /**
  * @function JSLITE.Element.append
  * @param {JSLITE.Element/HTMLElement/Array} vElem
  * @return {JSLITE.Element}
  * @describe <p>Appends a JSLITE.Element or HTMLElement or a collection of them to a parent. When appending multiple elements, a document fragment is used for optimization.</p>
  */
  //<source>
  append: function (vElem) {

    if (JSLITE.isArray(vElem)) {
      var oFragment = document.createDocumentFragment();
      vElem.forEach(function (v) {
        oFragment.appendChild(JSLITE.dom.getDom(v));
      });
      this.dom.appendChild(oFragment);

    } else {
      this.dom.appendChild(JSLITE.dom.getDom(vElem));
    }
    return this;

  },
  //</source>

  /**
  * @function JSLITE.Element.before
  * @param {JSLITE.Element/HTMLELement/String} vElem
  * @return {JSLITE.Element}
  * @describe <p>Inserts the new element before the parent in the DOM.</p><p>Shortcut for the standard DOM API insertBefore method.</p>
  */
  //<source>
  before: function (vElem) {

    var oTargetElement = this.dom;
    oTargetElement.parentNode.insertBefore(JSLITE.dom.getDom(vElem), oTargetElement);
    return this;

  },
  //</source>

  /**
  * @function JSLITE.Element.closest
  * @param {String} sElem
  * @return {JSLITE.Element/Boolean}
  * @describe <p>Finds the closest parent element that matches <code>sElem</code>. Inspired by the jQuery method of the same name.</p><p>Returns Boolean <code>false</code> if no matching parent element is found.</p>
<p><a href="http://jslite.benjamintoll.com/examples/closest.php" rel="external">See an example</a></p>
  */
  //<source>
  closest: function (sElem, context) {

    var oParent = this.dom.parentNode;
    while (oParent && oParent.nodeName) {
      if (oParent.nodeName.toLocaleLowerCase() === sElem) {
        return JSLITE.dom.get(oParent);
      } else {
        oParent = oParent.parentNode;
        if (oParent === document) {
          return false;
        }
      }
    }

  },
  //</source>

  /**
  * @function JSLITE.Element.disable
  * @param {Boolean} bCache (Optional)
  * @return {JSLITE.Element}
  * @describe
<p>If <code>bCache</code> is true, a reference to each <code>HTMLElement</code> will be stored in <code>JSLITE.disabled</code>. Each element in the cache can then be accessed by its id attribute value. Usually, this isn't necessary and re-enabling the element (<code><a href="#jsdoc">JSLITE.Element.enable</a></code>) will remove the reference from the cache.</p>
<p>Important: If disabling links, a <code>disabled</code> class is expected. The default class resides in <code>jslite.css</code> but can be overridden by a user-defined stylesheet.</p> 
  * @example
var cLis = JSLITE.dom.gets("#theList li");
cLis.disable("disabled");

//a class name is not needed when disabling <input>s;
var cInputs = JSLITE.dom.gets("#theForm input");
cInputs.disable();
  */
  //<source>
  disable: function (bCache) {

    var oDom = this.dom,
      oElem,
      i;

    /*store the onclick handler (if any) and return false*/
    if (oDom.onclick) {
      oDom.originalHandler = oDom.onclick;
    }
    oDom.onclick = function () {
      return false;
    };

    /*if this element has a handler (W3C) in the cache then remove it*/
    if (JSLITE.events[oDom.id]) {
      oElem = JSLITE.events[oDom.id];
      for (i in oElem) {
        if (oElem.hasOwnProperty(i)) {
          JSLITE.dom.event.remove(oDom, i, oElem[i]);
        }
      }
    }

    if (oDom.nodeName.toLocaleLowerCase() === "input") {
      oDom.disabled = true;
    } else {
      this.addClass("disabled");
    }
    
    if (bCache) {
      JSLITE.disabled[oDom.id] = oDom;
    }

    return this;

  },
  //</source>

  /**
  * @function JSLITE.Element.enable
  * @param {None}
  * @return {JSLITE.Element}
  * @describe <p>If the element is in the <code>JSLITE.disabled</code> cache, it's removed.</p>
  * @example
cLis.enable();

//a class name is not needed when re-enabling <input>s;
cInputs.enable();
  */
  //<source>
  enable: function () {

    var oDom = this.dom,
      oElem,
      i;

    if (oDom.originalHandler) {
      oDom.onclick = this.dom.originalHandler;
      oDom.originalHandler = null;
    } else {
      oDom.onclick = null;
    }

    /*if this element has a handler (W3C) in the cache then readd it*/
    if (JSLITE.events[oDom.id]) {
      oElem = JSLITE.events[oDom.id];
      for (i in oElem) {
        if (oElem.hasOwnProperty(i)) {
          JSLITE.dom.event.add(oDom, i, oElem[i]);
        }
      }
    }

    if (oDom.nodeName.toLocaleLowerCase() === "input") {
      oDom.disabled = false;
    } else {
      this.removeClass("disabled");
    }

    if (JSLITE.disabled[oDom.id]) {
      delete JSLITE.disabled[oDom.id];
    }

    return this;

  },
  //</source>

  /**
  * @function JSLITE.Element.getStyle
  * @param {String} sName CSS property name
  * @return {String/Null}
  * @describe <p>Supply a CSS property to lookup.  Returns the result of the lookup or <code>null</code>.</p><p>NOTE: this method doesn't support composite objects (<code><a href="#jsdoc">JSLITE.Composite</a></code>).</p>
  * @example
this.tooltip.width = parseInt(JSLITE.dom.fly(this.tooltip).getStyle("width"), 10);
  */
  //<source>
  getStyle: function (sName) {

    //if the property exists in style[] then it's been set recently and is current;
    if (this.dom.style[sName]) {
      return this.dom.style[sName];

    } else if (document.defaultView && document.defaultView.getComputedStyle) { //w3c;
      /*it uses the traditional 'text-align' style of rule writing instead of 'textAlign'*/
      sName = sName.replace(/([A-Z])/g, "-$1");
      sName = sName.toLocaleLowerCase();

      //get the style object and get the value of the property if it exists;
      var obj = document.defaultView.getComputedStyle(this.dom, "");
      return obj && obj.getPropertyValue(sName);

    } else if (this.dom.currentStyle) { //ie and early versions of opera;
      return this.dom.currentStyle[sName];

    } else { //otherwise, some other browser is being used;
      return null;
    }

  },
  //</source>

  /*wrapping classname in spaces means that a regexp isn't needed*/
  /**
  * @function JSLITE.Element.hasClass
  * @param {String} sClass
  * @return {None}
  * @describe <p>Queries to see if an element has the specified class.</p>
  */
  //<source>
  hasClass: function (sClass) {

    return sClass &&
      (" " + this.dom.className + " ").indexOf(" " + sClass + " ") > -1;

  },
  //</source>

  /**
  * @function JSLITE.Element.hide
  * @param {None}
  * @return {JSLITE.Element}
  * @describe <p>Hides an element by setting its <code>display</code> to <code>none</code>.</p>
  */
  //<source>
  hide: function () {

    this.dom.style.display = "none";
    return this;

  },
  //</source>

  /**
  * @function JSLITE.Element.list
  * @param {Array} aFirst
  * @param {Array} aSecond (Optional)
  * @return {JSLITE.Element}
  * @describe
<p><code>aFirst</code> could be a simple array, i.e:
<pre>
var aData = [
  "Phillies",
  "Braves",
  "Marlins",
  "Mets",
  "Nationals"
];
</pre>

<p>This could be used to create an ordered or unordered list. For example:</p>

<code style="background: #FFA; padding: 5px;">JSLITE.dom.create({tag: "ul", parent: document.body}).list(aData);</code>

<p>creates</p>

<pre style="background: #8FBC8F; border: 1px solid #789; padding: 5px;">
&#60;ul&#62;
  &#60;li&#62;Phillies&#60;/li&#62;
  &#60;li&#62;Braves&#60;/li&#62;
  &#60;li&#62;Marlins&#60;/li&#62;
  &#60;li&#62;Mets&#60;/li&#62;
  &#60;li&#62;Nationals&#60;/li&#62;
&#60;/ul&#62;
</pre>

<p><code>aFirst</code> could also be an array of objects, i.e:
<pre>
var aData = [
  {value: "Philadelphia", text: "Phillies", increment: 1, nickname: "World Champions", defaultSelected: true},
  {value: "Atlanta", text: "Braves", increment: 5, defaultSelected: false},
  {value: "Florida", text: "Marlins", increment: 7, defaultSelected: false},
  {value: "New York", text: "Mets", increment: 3, defaultSelected: false},
  {value: "Washington", text: "Nationals", increment: 9, defaultSelected: false}
];
</pre>

<p>Note that in this example that the property names must be precise in that they will map to actual <code>HTMLOptionElement</code> properties. For instance, when adding children to a <code>select</code> dom element, <code>value</code> will map to the <code>option</code> element's <code>value</code> attribute and <code>text</code> will map to the <code>text</code> property of the element. (Also, note that you can add custom attributes.) For example:</p>

<code style="background: #FFA; padding: 5px;">JSLITE.dom.create({tag: "select", parent: document.body}).list(aData);</code>

<p>creates</p>

<pre style="background: #8FBC8F; border: 1px solid #789; padding: 5px;">
&#60;select&#62;
  &#60;option value=&#34;Philadelphia&#34;&#62;Phillies&#60;/option&#62;
  &#60;option value=&#34;Atlanta&#34;&#62;Braves&#60;/option&#62;
  &#60;option value=&#34;Florida&#34;&#62;Marlins&#60;/option&#62;
  &#60;option value=&#34;New York&#34;&#62;Mets&#60;/option&#62;
  &#60;option value=&#34;Washington&#34;&#62;Nationals&#60;/option&#62
&#60;/select&#62;
</pre>
</p>

<p>If two single-dimensional arrays are passed, then the first array will be each <code>Option</code> object's <code>text</code> property and the second will be the <code>values</code>.</p>

<pre>
var aCities = [
  "Philadelphia",
  "Atlanta",
  "Florida",
  "New York",
  "Washington"
];
</pre>

<pre>
var aTeams = [
  "Phillies",
  "Braves",
  "Marlins",
  "Mets",
  "Nationals"
];
</pre>

<p>The same <code>select</code> list above could be created using the following code:</p>
<p><code style="background: #FFA; padding: 5px;">JSLITE.dom.create({tag: "select", parent: document.body}).list(aTeams, aCities);</code></p>

<hr />

<p>Note: only works on <code>select</code>, <code>ul</code> and <code>ol</code> elements.</p>
<p><a href="http://jslite.benjamintoll.com/examples/list.php" rel="external">See an example</a></p>
 * @example
var oList = JSLITE.dom.get("myList");

var aTest = [1, 2, 3, 4, 5, 6];
var aTest2 = ["one", "two", "three", "four", "five", "six"];

//create a list where both Option.text and Option.value are the same;
oList.list(aTest);

//create a list where both Option.text and Option.value are different;
oList.list(aTest, aTest2);

//when the first function argument is an array of arguments,
only one function argument should be passed;
var aTeams = [
  {value: "Philadelphia", text: "Phillies"},
  {value: "Atlanta", text: "Braves"},
  {value: "Florida", text: "Marlins"},
  {value: "New York", text: "Mets"},
  {value: "Washington", text: "Nationals"}
];
oList.list(aTeams);
  */
  //<source>
  list: function (aFirst, aSecond) {

    if (["SELECT", "UL", "OL"].join().indexOf(this.dom.nodeName) === -1) {
      throw new Error("Method only acts on lists.");
    }

    var that = this.dom,
      oAttr,
      sNodeName,
      attr,
      fn = function (el, index, arr) {
        /*"this" will refer either to the Array on which the method is called
          or to the option Object if it's passed as the second arg;
          - this allows us to pass either one array objects or two;
          - one array: value and text are the same;
          - two arrays: value is contained in the second array;
        */
        if (that.nodeName === "SELECT") {
          that.options[that.options.length] = new Option(arr[index], this[index], false, false);
        } else {
          JSLITE.dom.create({tag: "li",
            attr: { innerHTML: arr[index] },
            parent: that
          });
        }
      };

    if (aFirst[0].constructor === Object) {
      sNodeName = that.nodeName === "SELECT" ? "option" : "li";
      aFirst.forEach(function (oRow) {
        oAttr = {};
        for (attr in oRow) {
          if (oRow.hasOwnProperty(attr)) {
            oAttr[attr] = oRow[attr];
          }
        }
        JSLITE.dom.create({tag: sNodeName,
          attr: oAttr,
          parent: that
        });
      });
    } else {
      /*
        - if aSecond is undefined then only one array was passed to JSLITE.Element.list;
        - if we don't set aFirst as the second parameter then "this" will equal the window object in the callback (the second argument to forEach is the context);
        - this allows us to set the option's value to be the same as the option's text;
      */
      aFirst.forEach(fn, aSecond || aFirst);
    }

    return this;

  },
  //</source>

  /**
  * @function JSLITE.Element.next
  * @param {String} vElem Optional
  * @param {Boolean} bReturnDOM Optional
  * @return {JSLITE.Element/HTMLElement}
  * @describe <p>Returns a JSLITE.Element wrapper. If <code>bReturnDOM</code> is <code>true</code>, returns an HTMLElement.</p>
  */
  //<source>
  next: function (vElem, bReturnDOM) {

    if (vElem && typeof vElem === "boolean") {
      bReturnDOM = vElem;
      vElem = undefined;
    }

    var oNext = JSLITE.dom.getDom(this).nextSibling;
    return oNext.nodeType === 1 ?
      bReturnDOM ?
        oNext :
          JSLITE.dom.fly(oNext)
      : arguments.callee.call(oNext, vElem, bReturnDOM);

  },
  //</source>

  /**
  * @function JSLITE.Element.on
  * @param {String/Array} vType The type of event, i.e. <code>click</code> or <code>change</code> or <code>[&quot;click&quot;, &quot;change&quot;]</code>
  * @param {Function} fn The callback function
  * @return {None}
  * @describe <p>Binds one or more event listeners to the element and adds it/them to the cache. If listening to more than one type of event, pass the events as an array as the first argument.</p>
  * @example
var func = function (e) {
  alert("Hello, World!");
  e.preventDefault();
};

var cLinks = JSLITE.dom.gets("#menubar a");
cLinks.on("click", func);

- or -
cLinks.on(["click", "mouseover"], func); //pass multiple event to listen to as an array;
  */
  //<source>
  on: function (vType, fn) {

    if (typeof vType === "string") {
      vType = [vType];
    }

    vType.forEach(function (sType) {
      JSLITE.dom.event.add(this.dom, sType, fn);
  
      //create the object for each id;
      var o = null, arr = [];
      if (!JSLITE.events[this.dom.id]) {
        JSLITE.events[this.dom.id] = {};
      }
      o = JSLITE.events[this.dom.id];
  
      //within each id object store the handler for each event type;
      if (!o[sType]) {
        o[sType] = fn;
      } else { //if there's more than one handler for a given type then create an array of the handlers and assign it to the type;
        if (!JSLITE.isArray(o[sType])) {
          arr = JSLITE.toArray(o);
          arr.push(fn);
          o[sType] = arr;
        } else { //it's already been cast to an array;
          o[sType].push(fn);
        }
      }
    }.bind(this));
 
  },
  //</source>

  /**
  * @function JSLITE.Element.parent
  * @param {String} vElem Optional
  * @param {Boolean} bReturnDOM Optional
  * @return {JSLITE.Element/HTMLElement}
  * @describe <p>If no argument is given, return the element's parent. Else, return the first parent whose <code>nodeName</code> matches the passed parameter.</p><p>Returns a JSLITE.Element wrapper. If <code>bReturnDOM</code> is <code>true</code>, returns an HTMLElement. Returns <code>false</code> if no parent is found.</p>
  * @example
var oParent = JSLITE.dom.get("#test p span").parent();

var oParent = JSLITE.dom.get("#test p span").parent("div").setStyle({background: "red", fontFamily: "arial"}); //parent() returns a JSLITEElement by default;

var oParent = JSLITE.dom.get("#test p span").parent("div", true).style.background = "red"; //have parent() return the HTMLElement;
  */
  //<source>
  parent: function (vElem, bReturnDOM) {

    var fnReturnElement = function () {
      return bReturnDOM ?
        oParent :
        JSLITE.dom.get(oParent)
    },
    oParent = JSLITE.dom.getDom(this).parentNode;

    if (!oParent) {
      throw new Error("Parent could not be found");
    }

    if (vElem && typeof vElem === "boolean") {
      bReturnDOM = vElem;
      vElem = undefined;
    }

    //return oParent.nodeType === 1 ? oParent : arguments.callee.call(oParent);
    if (oParent.nodeType === 1) {
      if (vElem && typeof vElem !== "boolean") {
        if (oParent.nodeName.toLocaleLowerCase() !== vElem) { //a specific parent nodeName was passed in and the parent hasn't found it yet so keep recursing;
          return arguments.callee.call(oParent, vElem, bReturnDOM); //this has to return the final value since it's recursive and we could be dealing with many execution contexts by nature of it being a recursive function;
        } else {
          return fnReturnElement();
        }
      } else {
        return fnReturnElement();
      }
      
    } else {
      arguments.callee.call(oParent, vElem, bReturnDOM);
    }

  },
  //</source>

  /**
  * @function JSLITE.Element.previous
  * @param {String} vElem Optional
  * @param {Boolean} bReturnDOM Optional
  * @return {HTMLElement}
  * @describe <p>Returns a JSLITE.Element wrapper. If <code>bReturnDOM</code> is <code>true</code>, returns an HTMLElement.</p>
  */
  //<source>
  previous: function (vElem, bReturnDOM) {

    if (vElem && typeof vElem === "boolean") {
      bReturnDOM = vElem;
      vElem = undefined;
    }

    var oPrevious = JSLITE.dom.getDom(this).previousSibling;
    if (!oPrevious) {
      throw new Error("Previous sibling could not be found");
    }
    return oPrevious.nodeType === 1 ?
      bReturnDOM ?
        oPrevious :
          JSLITE.dom.fly(oPrevious)
      : arguments.callee.call(oPrevious, vElem, bReturnDOM);

  },
  //</source>

  /**
  * @function JSLITE.Element.remove
  * @param {None/String/HTMLElement/JSLITE.Element/Boolean} vElem The element(s) to remove
  * @return {JSLITE.Element/JSLITE.Composite}
  * @describe <p>Removes an HTMLElement from the DOM and stores it in the <code>JSLITE.garbage</code> cache.</p>
<p>This method can be used in the following ways:</p>
<ul>
  <li>If no param is passed, the method removes itself.</li>
  <li>If a non-Boolean param is passed, remove that specific HTMLElement from the DOM.</li>
  <li>If the Boolean true is passed as the param, remove all children of the current element.</li>
</ul>
<p>Please note that since this method returns the object it's bound to to allow for method chaining, the removed <code>HTMLElement</code> is not returned. Therefore, all removed elements are accessible via the global <code>JSLITE.garbage</code> cache by their id attribute values.</p>
  * @example
JSLITE.dom.get("five").remove("two"); //removes the element with the id "two";

JSLITE.dom.get("five").remove(true); //removes all children of element "five";

//later on in the code you need a reference to the removed element for whatever reason;
var oRemovedElement = JSLITE.garbage["two"];
  */
  //<source>
  remove: function (vElem) {

    var cChildren,
      i,
      o;

    if (typeof vElem === "boolean" && vElem) {
      cChildren = this.dom.childNodes;
      for (i = 0; cChildren[i];) {
        cChildren[i].parentNode.removeChild(cChildren[i]); //remember a node list is a live list;
      }
    } else {
      o = JSLITE.dom.getDom(vElem || this);
      //JSLITE.garbage[o.id] = o.parentNode.removeChild(o);
      o.parentNode.removeChild(o);
    }
    return this;

  },
  //</source>

  /**
  * @function JSLITE.Element.replaceClass
  * @param {String} sNewClass
  * @param {String} sCurrentClass
  * @return {JSLITE.Element}
  * @describe <p>Swaps out the class or adds it if it doesn't exist.</p>
  */
  //<source>
  replaceClass: function (sNewClass, sCurrentClass) {

    /*swap out the class or just add it if sCurrentClass doesn't exist*/
    if (this.hasClass(sCurrentClass)) {
      this.dom.className = this.dom.className.replace(sCurrentClass, sNewClass);
    } else {
      //this.dom.className += " " + sNewClass;
      this.addClass(sNewClass);
    }
    return this;

  },
  //</source>
	
  /**
  * @function JSLITE.Element.removeClass
  * @param {String/Array} v
  * @return {JSLITE.Element}
  * @describe <p>Pass either one class or multiple classes as an array to be removed.</p>
  */
  //<source>
  removeClass: function (v) {

    var i = 0,
      len;

    v = v instanceof Array ? v : [v];
    for (len = v.length; i < len; i++) {
      if (this.hasClass(v[i])) {
        this.dom.className = this.dom.className.replace(v[i], "");
      }
    }
    return this;

  },
  //</source>

  /**
  * @function JSLITE.Element.serialize
  * @param {None}
  * @return {String}
  * @describe <p>Retrieves a form's <code>input</code>, <code>select</code> and <code>textarea</code> elements and gathers their values, delimiting them by an ampersand into key-value pairs that can be then used in an HTTP POST method.</p>
<p><a href="http://jslite.benjamintoll.com/examples/ajaxFormSubmission.php" rel="external">See an example of serializing form data for an Ajax request</a></p>
  */
  //<source>
  serialize: function () {

    var arr = [];
    JSLITE.dom.formElements(this).forEach(function (o) {
      outerLoop:
      switch (o.nodeName.toLocaleLowerCase()) {
        case "input":
          switch (o.type) {
            case "checkbox": 
            case "radio":
              if (!o.checked) {
                break outerLoop;
              }
          }
          //falls through;

        case "select":
          if (o.type === "select-multiple") {
            for (var i = 0, opts = o.options, len = opts.length; i < len; i++) {
              if (opts[i].selected) {
                arr.push(encodeURIComponent(o.name) + "=" + encodeURIComponent(opts[i].value));
              }
            }
            break;
          }
          //falls through;

        default:
          arr.push(encodeURIComponent(o.name) + "=" + encodeURIComponent(o.value));
      }
    });
    return arr.join("&");

  },
  //</source>

  /**
  * @function JSLITE.Element.setStyle
  * @param {String/Object} vProp
  * @param {String} sValue
  * @return {JSLITE.Element}
  * @describe <p>Pass either a single property and its corresponding value or a single argument that is an object of styles.</p>
  */
  //<source>
  setStyle: function (vProp, sValue) {

    if (typeof vProp === "string") {
      this.dom.style[vProp] = sValue;
    } else if (vProp.constructor === Object) {
      for (var i in vProp) {
        if (vProp.hasOwnProperty(i)) {
          this.dom.style[i] = vProp[i];
        }
      }
    }
    return this;

  },
  //</source>

  /**
  * @function JSLITE.Element.show
  * @param {None}
  * @return {JSLITE.Element}
  * @describe <p>Shows an element by setting its <code>display</code> to <code>block</code>.</p>
  */
  //<source>
  show: function () {

    this.dom.style.display = "block";
    return this;

  },
  //</source>

  /**
  * @function JSLITE.Element.textContent
  * @param {None}
  * @return {String}
  * @describe <p>Uses either the Core DOM <code>textContent</code> property or Internet Explorer's proprietary <code>innerText</code> property to retrieve all of the text nodes within an element node.</p>
  * @example None
  */
  //<source>
  textContent: function () {

    return document.addEventListener ? this.dom.textContent : this.dom.innerText;

  },
  //</source>

  /**
  * @function JSLITE.Element.toggleClass
  * @param {String} sClassname
  * @return {JSLITE.Element}
  * @describe <p>Removes the class if the element already has it or adds it if it doesn't.</p>
  */
  //<source>
  toggleClass: function (sClassname) {

    if (this.hasClass(sClassname)) {
      this.removeClass(sClassname);
    } else {
      this.addClass(sClassname);
    }
    return this;

  },
  //</source>

  /**
  * @function JSLITE.Element.tooltip
  * @param {Mixed} vTip String or Array
  * @param {Boolean} bAnimate True if tooltip should be animated
  * @return {JSLITE.Element}
  * @describe <p>Pass a string or any identifier that has a string value as the sole argument or an array of string values.</p><p>An element can have an animated tooltip by passing a second parameter with a value of <code>true</code>.</p><p>If an array, the method expects tokenized strings which would each map to an <code>HTMLElement</code> attribute. If you want one of the array elements to map to an <code>HTMLElement</code> attribute, tokenize it by enclosing it in curly braces. Otherwise, the array element will be interpreted as a plain string.</p>
<p>Note any formatting should be passed along in the array as its own element. You can also pass along any string or a string of HTML.</p>
<p>Please see <code><a href="#jsdoc">JSLITE.ux.Tooltip</a></code> for more information.</p>
  * @example
JSLITE.dom.get("theLink").tooltip("This is my tooltip.");
//and/or
oForm.tooltip($("thePara").innerHTML);

//a tooltip can be animated by passing a second parameter of true;
JSLITE.dom.get("theLink").tooltip("This is my tooltip.", true);

//you wanted to get the value of the rel and href attributes for every link on the page;
//each tooltip will contain the value of each link's rel attribute;
JSLITE.dom.gets("a[rel]").tooltip(["{rel}"]);

//gets the value of the link's rel and href attributes (not equal to '#') and does some formatting;
JSLITE.dom.gets("a[href!=#][rel]").tooltip(["{rel}", " {", "<a href='{href}'>{href}</a>", "}"]);
  */
  //<source>
  tooltip: function (vTip, bAnimate) {

    var that = this.dom;
    if (JSLITE.isArray(vTip)) {
      if (vTip.length > 1) {
        vTip = vTip.join("").replace(/\{([a-z]+)\}/gi, function (a, b) {
          return that.getAttribute(b);
        });
      } else {
        vTip = that.getAttribute(vTip[0]);
      }
    }
    JSLITE.ux.Tooltip.init.call(this, vTip, bAnimate);
    return this;

  },
  //</source>

  /**
  * @function JSLITE.Element.trim
  * @param {String}
  * @return {String}
  * @describe <p>Checks to see if the element is a text box. If it is, then it passes the value to <code><a href="#jsdoc">JSLITE.trim</a></code> to do a standard trim.</a></code>.</p>
  */
  //<source>
  trim: function () {

    var oDom = JSLITE.dom.getDom(this);
    if (!JSLITE.dom.isTextBox(oDom)) {
      return;
    }
    oDom.value = JSLITE.trim(oDom.value);
    return this;

  },
  //</source>

  /**
  * @function JSLITE.Element.un
  * @param {String/Array} vType The type of event, i.e. <code>click</code> or <code>change</code> or <code>[&quot;click&quot;, &quot;change&quot;]</code>
  * @param {Function} fn The callback function
  * @return {None}
  * @describe <p>Unbinds one or more event listeners from the element and removes it/them from the cache. If removing more than one type of event, pass the events as an array as the first argument.</p>
  * @example
//...previous code...;
cLinks.un("click", func);

- or -

cLinks.un(["click", "mouseover"], func);
  */
  //<source>
  un: function (vType, fn) {

    if (typeof vType === "string") {
      vType = [vType];
    }

    vType.forEach(function (sType) {
      JSLITE.dom.event.remove(this.dom, sType, fn);
      delete JSLITE.events[this.dom.id][sType];
    }.bind(this));
 
  },
  //</source>

  /**
  * @function JSLITE.Element.validate
  * @param {Function} callback Optional
  * @param {Object} config Optional A map of configurable properties that will override the defaults
  * @return {JSLITE.Element/JSLITE.Composite}
  * @describe <p>Searches the form the method was invoked on for any form elements whose classes are matched by regular expressions which determine the elements to be candidates for validation. Note that binding a handler to the form's submit event and defining the callback is still the responsibility of the developer. Please refer to the example.</p><p>The form elements to be validated must have their classes set to predetermined values, otherwise the class that performs the validation won't recognize them as elements to be validated.</p><p>The following are the valid validation classes:</p>
<ul>
  <li>required</li>
  <li>required-email</li>
  <li>required-phone</li>
  <li>required-ssn</li>
  <li>required-zip</li>
</ul>
<p>Note that since forms will have different HTML structures, the <code>options.classMap</code> property can be used to target the element that should have
the <code>textError</code> class attached to it.</p>
<p><a href="http://jslite.benjamintoll.com/examples/validate.php" rel="external">See an example of form validation</a></p>
  * @example
var callback = function (e) {
  var oScrubber = this.dom.scrubber;
  if (oScrubber.getErrors() > 0) {
    console.log(oScrubber.getErrors() + " validation errors");
  } else {
    JSLITE.ajax.load({
      url: "lib/php/controller.php",
      data: "json",
      type: "POST",
      postvars: this.elements,
      onSuccess: function (sResponse) {
        //do something useful...;
      }
    });
  }
  e.preventDefault();
};

//validate an entire form;
var oContactForm = JSLITE.dom.get("contactForm");
oContactForm.validate(callback);

//attach a handler to a single form element;
var oZip = JSLITE.dom.get("zip");
oZip.validate();

---------------------------------------------------------

NOTE that the class that implements the validation behavior uses regular expressions to determine
which form elements to bind change listeners to. This needs to be established in the markup.

An example form:

<form id="contactForm" method="post" action="lib/php/controller.php">

  <fieldset>
  <legend>Contacts</legend>
  <ol>
    <li>
      <label for="firstName">First Name</label>
      <input type="text" id="firstName" class="required" name="firstName" />
    </li>
    <li>
      <label for="lastName">Last Name</label>
      <input type="text" id="lastName" class="required" name="lastName" />
    </li>
    <li>
      <label for="address">Address</label>
      <input type="text" id="address" class="required" name="address" />
    </li>
    <li>
      <label for="city">City</label>
      <input type="text" id="city" class="required" name="city" />
    </li>
    <li>
      <label for="state">State</label>
      <input type="text" id="state" class="required" name="state" />
    </li>
    <li>
      <label for="zip">Zip</label>
      <input type="text" id="zip" class="required-zip" name="zip" />
    </li>
    <li>
      <label for="phone">Phone</label>
      <input type="text" id="phone" class="required-phone" name="phone" />
    </li>
    <li>
      <label for="email">Email</label>
      <input type="text" id="email" class="required-email" name="email" />
    </li>
    <li>
      <input type="submit" name="contact" value="Submit Contact" />
    </li>
  </ol>

  </fieldset>

</form>

Nice, clean markup with no custom attributes. Sweet!
  */
  //<source>
  validate: function (callback/*, config*/) {

    var that = this,
      config = typeof callback === "object" ? callback : arguments[1],
      func = typeof callback === "function" ? callback : null,
      oScrubber;
 
    if (this.dom.nodeName.toLocaleLowerCase() !== "form") {
      throw new Error("This method can only be invoked on a form object.");
    }

    //JSLITE.dom.cleanWhitespace(this.dom);
    this.dom.scrubber = new JSLITE.ux.Scrubber(this, config); //bind the new scrubber instance to the form;

    //if the object is in the events cache and already has a submit event handler bound to it then we can just invoke scrubber;
    if (JSLITE.events[this.dom.id] && JSLITE.events[this.dom.id].submit) {
      oScrubber = this.dom.scrubber; //store a reference to the object or it becomes null after this statement (don't know why yet);
      oScrubber.validate.call(oScrubber);
      return oScrubber.getErrors.call(oScrubber); //return the number of errors (if any) so the handler can use it;

    } else {
      this.on("submit", function (e) {
        this.scrubber.validate();
        if (func) {
          func.call(that, e); //ensures that the form will be the value of "this" w/in the callback;
        } else { //if there's no callback then it's a simple test (if there are errors don't submit, if there aren't send it along);
          if (this.scrubber.getErrors()) {
            e.preventDefault();
          }
        }
      });
    }
    return this;

  },
  //</source>

  /**
  * @function JSLITE.Element.value
  * @param {Mixed}
  * @return {JSLITE.Element/Mixed}
  * @describe <p>When acting as a getter, it will return the text content of the element (just the text, no HTML). If operating on an <code>input</code> element, it will return the element's <code>value</code> property.</p><p>When acting as a setter, it will set the element's <code>innerHTML</code> property. If operating on an <code>input</code> element, it will set the element's <code>value</code> property. <p>Chaining is allowed when used as a setter.</p>
  * @example
JSLITE.dom.gets("input").setStyle({background: "#CCC"}).value("test test i'm a test");
  */
  //<source>
  value: function (v) {

    if (v) { //if setting, return this to allow for chaining;
      !JSLITE.dom.isTextBox(this) ?
        this.dom.innerHTML = v :
          this.dom.value = v;
      return this; //allow for chaining;

    } else { //if getting, return the value;
      return this.textContent() || this.dom.value;
    }

  }
  //</source>

};
