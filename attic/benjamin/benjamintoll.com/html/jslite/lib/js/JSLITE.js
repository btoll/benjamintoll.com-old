/*
 * jsLite
 *
 * Copyright (c) 2009 - 2011 Benjamin Toll (benjamintoll.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */

var JSLITE;
if (!JSLITE) {
  JSLITE = {};
}

/**
* @function JSLITE.apply
* @param {Object} oChild
* @param {Object} oParent
* @return {Object}
* @describe <p>Copies all properties of <code>oParent</code> to <code>oChild</code>. Doesn't check for pre-existing properties.</p>
*/
//<source>
JSLITE.apply = function (oChild, oParent) {

  for (var i in oParent) {
    if (oParent.hasOwnProperty(i)) {
      oChild[i] = oParent[i];
    }
  }
  return oChild;

};
//</source>

JSLITE.apply(JSLITE, {

  /**
  * @function JSLITE.applyIf
  * @param {Object} oChild
  * @param {Object} oParent
  * @return {Object}
  * @describe <p>Copies all properties of <code>oParent</code> to <code>oChild</code> that don't exist in <code>oChild</code>.</p>
  */
  //<source>
  applyIf: function (oChild, oParent) {
 
    for (var i in oParent) {
      if (oParent.hasOwnProperty(i)) {
        if (!oChild[i]) {
          oChild[i] = oParent[i];
        }
      }
    }
    return oChild;

  },
  //</source>

  /**
  * @function JSLITE.copy
  * @param {Object} varargs
  * @return {Object}
  * @describe <p>Copies all properties of all passed objects to a new object and returns it. It doesn't modify any object passed to it in the method signature.</p><p>Note this method performs a shallow copy.</p>
  */
  //<source>
  copy: function () {

    var o = {};
    this.makeArray(arguments).forEach(function (obj) {
      for (var n in obj) {
        if (obj.hasOwnProperty(n)) {
          o[n] = obj[n];
        }
      }
    });
    return o;

  },
  //</source>

  /**
  * @function JSLITE.counter
  * @param {None}
  * @return {Number}
  * @describe <p>The closure provides for a secure and reliable counter.</p>
  * @example
  return JSLITE.globalSymbol + JSLITE.counter();
  */
  //<source>
  counter: (function () {

    var n = 0;
    return function () {
      return n++;
    };

  }()),
  //</source>

  /**
  * @function JSLITE.deepCopy
  * @param {oOrig}
  * @return {Object}
  * @describe <p>Makes a deep copy of the object that's passed as its sole argument and returns the copied object. Every copied object and array property of the original object will be separate and distinct from the original object. In other words, after the deep copy occurs, any new expando property added to either object won't be replicated to the other.</p>
  */
  //<source>
  deepCopy: function (vOrig) {
 
    var o,
      i,
      len;
 
    if (vOrig instanceof Array) { //arrays are handled differently than objects;
      o = [];
      for (i = 0, len = vOrig.length; i < len; i++) {
        v = vOrig[i];
        if (v instanceof Object) { //could be an array or an object;
          o.push(arguments.callee(v));
        } else {
          o.push(v);
        }
      }
 
    } else {
      o = {};
      for (var prop in vOrig) {
        if (vOrig.hasOwnProperty(prop)) {
          v = vOrig[prop];
          if (v instanceof Object) { //could be an array or an object;
            o[prop] = arguments.callee(v);
          } else {
            o[prop] = v;
          }
        }
      }
    }

    return o;

  },
  //</source>

  /**
  * @function JSLITE.extend
  * @param {Function} subClass
  * @param {Mixed} superClass Pass either a constructor or an object
  * @param {Object} overrides optional Any object properties will be added to the subclass' prototype
  * @return {Function} subClass
  * @describe <p>Extends one class with another class. Returns the <code>subClass</code> constructor.</p><p>This method causes one reference type to inherit from another using the prototype chaining inheritance pattern. Note that this does not inherit the <code>superClass</code>' instance properties, it only inherits properties residing on the <code>superClass</code>' prototype object. Use combination inheritance (i.e., prototype chaining + constructor stealing) to inherit all of the properties from <code>superClass</code> (constructor stealing, aka object masquerading or classical inheritance, will inherit the instance properties).</p>
<p>It's also possible to create a constructor by passing the reference type to extend as the first argument and the methods to override as the second argument.</p>
<p>For prototypal inheritance please see <code><a href="#jsdoc">JSLITE.proto</a></code>.</p>
  * @example
function Person() {
  Person.superclass.constructor.call(); //constructor stealing;
}

JSLITE.extend(Person, JSLITE.Observer); //prototype chaining;

-- or --

Car = JSLITE.extend(JSLITE.Observer, {
  init: function () {
    //code here...;
  }
});
  */
  //<source>
  extend: function (subClass, superClass, overrides) {

    if (superClass.constructor === Object) {
      overrides = superClass;
      superClass = subClass;
      subClass = overrides.constructor !== Object ? overrides.constructor : function () { superClass.apply(this, arguments); };
    }

    var F = function () {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.superclass = superClass.prototype;
    subClass.prototype.constructor = subClass;

    JSLITE.apply(subClass.prototype, overrides);
    subClass.override = function (o) { //class method;
      JSLITE.apply(subClass, o);
    };
    return subClass;

  },
  //</source>

  /*****************************************************************************************************************/
  /*****************************************************************************************************************/
  /**
  * @function JSLITE.flush
  * @param {Array/String} vAction Function argument(s) can be an <code>Array</code> or one or more <code>Strings</code>
  * @return {None}
  * @describe <p>Values are:</p>
<ul>
  <li><code>cache</code> - clear the cache of any <code><a href="#jsdoc">JSLITE.Elements</a></code></li>
  <li><code>disabled</code> - re-enable any disabled elements</li>
  <li><code>flyweight</code> - clear the flyweight object</li>
  <li><code>garbage</code> - clear the garbage cache of any <code>HTMLElements</code> that were removed from the DOM</li>
</ul>
  */
  //<source>
  flush: function (vAction) {

    if (!vAction) {
      return;
    }

    var args = vAction.constructor === Array ?
      vAction :
        JSLITE.makeArray(arguments),
        i, len;

    for (i = 0, len = args.length; i < len; i++) {

      switch (args[i]) {
        case "cache":
          JSLITE.cache = {};
          break;

        case "disabled":
          if (!JSLITE.isEmpty(JSLITE.disabled)) {
            JSLITE.disabled = {};
          }
          break;

        case "flyweight":
          flyweight = {};
          break;

        case "garbage":
          JSLITE.garbage = {};

      }

    }

  },
  //</source>

  /**
  * @function JSLITE.isArray
  * @param {Mixed} v
  * @return {Boolean}
  * @describe <p>Tests if the passed data is an array.</p>
  */
  //<source>
  isArray: function (v) {

    return Object.prototype.toString.apply(v) === "[object Array]"; 

  },
  //</source>

  /**
  * @function JSLITE.isEmpty
  * @param {Mixed} v
  * @return {Boolean}
  * @describe <p>Tests if the variable is empty.</p><p><code>null</code>, <code>undefined</code> and <code>NaN</code> are considered to be empty values.</p>
  */
  //<source>
  isEmpty: function (v) {

    var bEmpty = true,
      prop;

    if (typeof v === "string" && v.length > 0 || typeof v === "number" && !isNaN(v) || v instanceof Array && v.length > 0 || v instanceof Date) {
      bEmpty = false;
    } else if (v instanceof Object) {
      for (prop in v) {
        if (v.hasOwnProperty(prop)) {
          bEmpty = false;
          break;
        }
      }
    }
/*
//jsLint suggested changing SWITCH to an IF;
    switch (true) { //undefined, null and NaN values aren't represented;
      case typeof v === "string" && v.length > 0:
      case typeof v === "number" && !isNaN(v): //remember typeof NaN === "number";
      case v instanceof Array && v.length > 0:
      case v instanceof Date:
        bEmpty = false;
        break;

      case v instanceof Object:
        for (var prop in v) {
          if (v.hasOwnProperty(prop)) {
            bEmpty = false;
            break;
        }
      }
    }
*/
    return bEmpty;

  },
  //</source>

  /**
  * @function JSLITE.makeArray
  * @param {Object} o
  * @return {Array}
  * @describe <p>Converts a collection of nodes or the <code>arguments</code> object into a true array.</p>
<p>A tip of the hat to the Prototype library.</p>
<p>Note: Nicholas Zakas <a href="http://www.nczonline.net/blog/2007/12/13/ie-com-reers-its-ugly-head/" rel="external">has a good blog post</a> about why IE doesn't respect <code>Array.prototype.slice</code>.</p>
<p>This is to transfrom a collection into an array. If you want to cast an object to an array, please see <code><a href="#jsdoc">JSLITE.toArray</a></code>.</p>
  */
  //<source>
  makeArray: function (o) {

    if (!JSLITE.isIE) {
      return Array.prototype.slice.apply(o);
    }

    var iLen = o.length || 0, arr = new Array(iLen);
    if (o && o.length) {
      while (iLen--) {
        arr[iLen] = o[iLen];
      }
    }
    return arr;

  },
  //</source>

  /**
  * @function JSLITE.proto
  * @param {Object} oProto
  * @return {Object}
  * @describe <p>Performs prototypal inheritance. Takes an object to use as another's prototype and returns the new object.</p>
  */
  //<source>
  proto: function (oProto) {

    var F = function () {};
    F.prototype = oProto;
    return new F();

  }.assert(Object),
  //</source>

  /*****************************************************************************************************************/
  /*****************************************************************************************************************/
  /**
  * @function JSLITE.ready
  * @param {Function} fn
  * @return {None}
  * @describe <p>Should be the first statement called in any jsLite application. All code to be invoked at page load should be within the function that is the sole argument.</p>
  */
  //<source>
  ready: function (fn) {

    if (!JSLITE.isIE) {
      document.addEventListener("DOMContentLoaded", fn, false);
    } else {
      window.attachEvent("onload", fn);
    }

  },
  //</source>

  /**
  * @function JSLITE.toArray
  * @param {Object} o
  * @return {Array}
  * @describe <p>Transforms the passed object into an array. Employs <code>Object.hasOwnProperty</code> so as to not push inherited properties onto the array.</p>
<p>This is to cast an object to an array. If you want to transform a collection into an array, please see <code><a href="#jsdoc">JSLITE.makeArray</a></code>.</p>
  */
  //<source>
  toArray: function (o) {

    var arr = [],
      prop;

    for (prop in o) {
      if (o.hasOwnProperty(prop)) {
        arr.push(o[prop]);
      }
    }
    return arr;

  }.assert(Object),
  //</source>

  /**
  * @function JSLITE.trim
  * @param {String} str
  * @return {String}
  * @describe <p>Trims whitespace from the beginning and end of a <code>String</code>.</p>
  */
  //<source>
  trim: function (str) {

    var re = /^\s+|\s+$/g;
    return str.replace(re, "");

  }.assert(String)
  //</source>

});

/**
* @property JSLITE.globalSymbol
* @type String
* @describe <p>Constant. The global symbol that is used in everything from the creation of unique <code><a href="#jsdoc">JSLITE.Element</a></code> ids to class names.</p>
*/
//<source>
JSLITE.globalSymbol = "JSLITE";
//</source>

/**
* @property JSLITE.tabClasses
* @type Object
* @describe <p>Constant. The class names that all Tab objects use.</p>
*/
//<source>
JSLITE.tabClasses = {
  tabs: JSLITE.globalSymbol + "_Tabs", //the class name on the containing div;
  tab: JSLITE.globalSymbol + "_Tab" //the class name for each tab;
};
//</source>

/**
* @property JSLITE.tags
* @type RegExp
* @describe <p>This contains all possible HTML tags. Is used by <code><a href="#jsdoc">JSLITE.domQuery</a></code> and <code><a href="#jsdoc">JSLITE.get.dom</a></code>. Is used internally but can be overwritten for any custom needs.</p> 
*/
//<source>
JSLITE.tags = /^(?:\*|a|abbr|acronym|address|applet|area|b|base|basefont|bdo|big|blockquote|body|br|button|caption|center|cite|code|col|colgroup|dd|del|dfn|dir|div|dl|dt|em|fieldset|font|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|hr|html|i|iframe|img|input|ins|isindex|kbd|label|legend|li|link|map|menu|meta|noframes|noscript|object|ol|optgroup|option|p|param|pre|q|s|samp|script|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|title|tr|tt|u|ul|var)$/i;
//</source>

/**
* @property JSLITE.tooltipClass
* @type String
* @describe <p>Constant. The class name that all Tooltip objects use.</p>
*/
//<source>
JSLITE.tooltipClass = JSLITE.globalSymbol + "_Tooltip";
//</source>

(function () {

  var ua = navigator.userAgent.toLocaleLowerCase(),
    isStrict = document.compatMode === "CSS1Compat",
    isOpera = ua.indexOf("opera") > -1,
    isSafari = (/webkit|khtml/).test(ua),
    isSafari3 = isSafari && ua.indexOf('webkit/5') !== -1,
    isiPhone = ua.indexOf("iphone") > -1,
    //isIE = /*@cc_on!@*/false, //IE conditional compilation;
    isIE = !isOpera && ua.indexOf("msie") > -1,
    isIE6 = !isOpera && ua.indexOf("msie 6") > -1,
    isIE7 = !isOpera && ua.indexOf("msie 7") > -1,
    isIE8 = !isOpera && ua.indexOf("msie 8") > -1;

  JSLITE.apply(JSLITE, {

    /**
    * @property JSLITE.isStrict
    * @type Boolean
    */
    //<source>
    isStrict: isStrict,
    //</source>

    /**
    * @property JSLITE.isOpera
    * @type Boolean
    */
    //<source>
    isOpera: isOpera,
    //</source>

    /**
    * @property JSLITE.isSafari
    * @type Boolean
    */
    //<source>
    isSafari: isSafari,
    //</source>

    /**
    * @property JSLITE.isSafari3
    * @type Boolean
    */
    //<source>
    isSafari3: isSafari3,
    //</source>

    /**
    * @property JSLITE.isiPhone
    * @type Boolean
    */
    //<source>
    isiPhone: isiPhone,
    //</source>

    /**
    * @property JSLITE.isIE
    * @type Boolean
    */
    //<source>
    isIE: isIE,
    //</source>

    /**
    * @property JSLITE.isIE6
    * @type Boolean
    */
    //<source>
    isIE6: isIE6,
    //</source>

    /**
    * @property JSLITE.isIE7
    * @type Boolean
    */
    //<source>
    isIE7: isIE7,
    //</source>

    /**
    * @property JSLITE.isIE8
    * @type Boolean
    */
    //<source>
    isIE8: isIE8
    //</source>

  });

}());

/*for internal use only;
- can be modified via JSLITE.dom.flush
- TODO: make these private, only accessible via a closure?;
*/

(function () {
  JSLITE.apply(JSLITE, {
    cache: {},
    disabled: {},
    events: {},
    garbage: {}
  });
}());
