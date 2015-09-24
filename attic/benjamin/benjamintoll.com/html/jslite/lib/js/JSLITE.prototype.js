/*
 * jsLite
 *
 * Copyright (c) 2009 - 2011 Benjamin Toll (benjamintoll.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */

/**
* @function Array.prototype.contains
* @param {Mixed} v
* @return {Boolean}
* @describe <p>Searches the array for the passed value.</p>
*/
//<source>
if (!Array.prototype.contains) {

  Array.prototype.contains = function (v) {

    if (this.indexOf(v) > -1) {
      return true;
    }
    return false;

  };

}
//</source>

/**
* @function Array.prototype.every
* @param {Mixed} v
* @param {Object} thisp Optional scope
* @return {Boolean}
* @describe <p>Returns true if every element in this array satisfies the provided testing function.</p>
*/
//<source>
if (!Array.prototype.every) {

  Array.prototype.every = function (fun /*, thisp*/) {
    if (typeof fun !== "function") {
      throw new TypeError();
    }

    var len = this.length >>> 0,
      thisp = arguments[1],
      i;

    for (i = 0; i < len; i++) {
      if (i in this && !fun.call(thisp, this[i], i, this)) {
        return false;
      }
    }

    return true;
  };

}
//</source>

/**
* @function Array.prototype.filter
* @param {Mixed} callback
* @param {Object} thisp Optional scope
* @return {Array}
* @describe <p>Calls a provided callback function once for each element in an array and constructs a new array of all the values for which callback returns a true value.</p>
*/
//<source>
if (!Array.prototype.filter) {
  Array.prototype.filter = function(callback /*, thisp */) {
    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError();
    }

    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i]; // in case callback mutates this
        if (callback.call(thisp, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}
//</source>

/**
* @function Array.prototype.forEach
* @param {Function} callback
* @param {Object} oOptional
* @return {None}
*/
//<source>
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function (callback, oOptional) {

    for (var i = 0, iLength = this.length; i < iLength; i++) {
      if (i in this) { //skip over any holes in the array;
        callback.apply(oOptional || this, [this[i], i, this]);
      }
    }

  };

}
//</source>

/**
* @function Array.prototype.indexOf
* @param {Mixed} vItem
* @param {Number} iFromIndex Optional
* @return {Number}
* @describe <p>Returns the position of <code>vItem</code> in the array if one of the elements === the passed argument, otherwise return -1 (not found).</p><p>If the optional second argument is given, begin searching the array at that index. This is useful since arrays often will contain more than one instance of a given item.</p><p>Please see <a href="https://developer.mozilla.org/en/new_in_javascript_1.6" rel="external">this article</a> for more information.</p>
*/
//<source>
if (!Array.prototype.indexOf) {

  Array.prototype.indexOf = function (vItem, iFromIndex) {

    var i = 0,
      len;
  
    if (arguments[1]) {
      /*exit early if the start position (index) is greater
        than or equal to the length of the array*/
      if (arguments[1] >= this.length) {
        return -1;

      /*the index is negative so it will be taken as the
        offset from the end of the array*/
      } else if (arguments[1] < 0) {
        i = this.length + arguments[1];

      /*else set it to the value of the second argument*/
      } else {
        i = arguments[1];
      }
    }
  
    for (len = this.length; i < len; i++) {
      if (this[i] === vItem) {
        return i;
      }
    }
    return -1; //no match, return -1 (not found);

  };

}
//</source>

/**
* @function Array.prototype.lastIndexOf
* @param {Mixed} vItem
* @param {Number} iFromIndex Optional
* @return {Number}
* @describe <p>Returns the last position of <code>vItem</code> in the array if one of the elements === the passed argument, otherwise return -1 (not found).</p><p>If the optional second argument is given, begin searching the array at that index. This is useful since arrays often will contain more than one instance of a given item.</p><p>Please see <a href="https://developer.mozilla.org/en/new_in_javascript_1.6" rel="external">this article</a> for more information.</p>
*/
//<source>
if (!Array.prototype.lastIndexOf) {

  Array.prototype.lastIndexOf = function (vItem, iFromIndex) {

    var i = this.length,
      j;

    if (arguments[1]) {
      /*the index is negative so it will be taken as
        the offset from the end of the array
        -NOTE that even when negative the array is searched back to front*/
      if (arguments[1] < 0) {
        i = this.length + arguments[1];

      /*if equal to or greater than the array, reset to the length of the array*/
      } else if (arguments[1] >= i) {
        i = this.length;

      /*else set it to the value of the second argument*/
      } else {
        i = arguments[1];
      }
    }
  
    for (j = i - 1; 0 <= j; j--) {
      if (this[j] === vItem) {
        return j;
      }
    }
    return -1; //no match, return -1 (not found);

  };

}
//</source>

/**
* @function Array.prototype.map
* @param {Function} fun
* @param {Object} thisp Optional scope
* @return {Array}
* @describe <p>Calls a provided callback function once for each element in an array, in order, and constructs a new array from the results. The callback is invoked only for indices of the array which have assigned values; it is not invoked for indices which have been deleted or which have never been assigned values.</p>
*/
//<source>
if (!Array.prototype.map) {
  Array.prototype.map = function (fun /*, thisp */) {

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") {
      throw new TypeError();
    }

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in t) {
        res[i] = fun.call(thisp, t[i], i, t);
      }
    }

    return res;
  };
}
//</source>

/**
* @function Array.prototype.remove
* @param {Mixed} vItem
* @return {Mixed}
* @describe <p>Returns the removed element.</p>
*/
//<source>
if (!Array.prototype.remove) {

  Array.prototype.remove = function (vItem) {

    var iIndex = this.indexOf(vItem);
    if (iIndex > -1) {
      return this.splice(iIndex, 1)[0];
    }

  };

}
//</source>

/**
* @function Array.prototype.unique
* @param {None}
* @return {Array}
* @describe <p>Returns an array of unique elements. Retains the order of the elements, in the sense that if it discovers a duplicate it will keep the first one it encountered.</p>
*/
//<source>
if (!Array.prototype.unique) {

  Array.prototype.unique = function () {

    var aUnique = [];
    this.forEach(function (elem) {
      if (!aUnique.contains(elem)) {
        aUnique.push(elem);    
      }
    });
    return aUnique;

  };

}
//</source>

/**
* @function Date.prototype.getAgeInYears
* @param {Date/String} vLowerLimit
* @return {Number/Null}
* @describe <p>This computes a person's age from Today or from another specified date. This method accepts a <code>Date</code> object or a string as its sole parameter and will return the age as a <code>Number</code>. It can be invoked as a static method, i.e. <code>Date.prototype.getAgeInYears</code>, where a date can be passed as the argument like usual. If age is a negative number, <code>null</code> is returned.</p><p>Note that when comparing dates, the <code>Date</code> passed as the argument to <code>Date.prototype.getAgeInYears</code> must be older or the result will be <code>null</code>.</p>
* @example
//get the age from Today - June 6, 1944;
var iAge = Date.prototype.getAgeInYears("June 6, 1944");

or

var iAge = Date.prototype.getAgeInYears(new Date("6/6/1944"));

or

var oDDay = new Date();
oDDay.setFullYear(1944);
oDDay.setMonth(5);
oDDay.setDate(6);
var x = new Date().getAgeInYears(oDDay);
 
or

var oDDay = new Date("June 6, 1944");
var x = new Date().getAgeInYears(oDDay);

or

//get the age from June 6, 1944 to July 4, 1776;
var oDDay = new Date("June 6, 1944");
var oIndependenceDay = new Date("July 4, 1776");
var x = oDDay.getAgeInYears(oIndependenceDay);
*/
//<source>
Date.prototype.getAgeInYears = function (vLowerLimit) {

  var oUpperLimit,
    iAge,
    iYear,
    iMonth,
    iDay;

  if (this.toString() !== "Invalid Date") { //getAgeInYears is a method of a Date object;
    oUpperLimit = this;
  } else { //if reached, method was called as a static method;
    oUpperLimit = new Date(); //upper limit is always Today;
    vLowerLimit = typeof vLowerLimit === "string" ? new Date(vLowerLimit) : vLowerLimit;
  }

  iYear = parseInt(oUpperLimit.getFullYear(), 10) - parseInt(vLowerLimit.getFullYear(), 10);
  iMonth = parseInt(oUpperLimit.getMonth(), 10) - parseInt(vLowerLimit.getMonth(), 10);
  iDay = parseInt(oUpperLimit.getDate(), 10) - parseInt(vLowerLimit.getDate(), 10);

  iAge = iYear;
  if (iMonth < 0 || (iMonth === 0 && iDay < 0)) {
    iAge = iYear - 1;
  }
  return iAge >= 0 ? iAge : null; //don't return a negative number;

};
//</source>

/**
* @function Function.prototype.assert
* @param {Any} varargs
* @return {Function}
* @describe <p>Will do type-checking and test that the number of function arguments equals the number of arguments expected.</p>
* @example
var foobar = function (a, b) {
  alert(a);
  alert(b);
}.assert(Function, Number);

foobar(function () {}, 26);

----------------
 or as a method
----------------

var blueboy = {

  color: "blue",

  fnTest: function (a, b) {
    alert("My name is " + a + ".");
    alert(b.getFullYear());
  }.assert(String, Date),

  teams: []

};
*/
//<source>
Function.prototype.assert = function () {

  var func = this,
    args = Array.prototype.slice.call(arguments);
	
  return function () {
    if (func.length !== arguments.length) {
      throw new Error("function arguments do not equal number of expected arguments");
    }

    for (var i = 0, iLength = arguments.length; i < iLength; i++) {
      if (arguments[i].constructor !== args[i]) {
        throw new Error("Wrong data type for function argument " + (++i) + ".");
      }
    }

    return func.apply(this, arguments); //finally, invoke the parent function;
  };

};
//</source>

/**
* @function Function.prototype.bind
* @param {Object} context
* @return {Function}
* @describe <p>Calls a function within the scope of another object.</p>
* @example
var obj = {
  world: "saturn",
  hello: function () {
    console.log(this.world);
  }
};
var obj2 = {
  world: "jupiter"
};
var fn = obj.hello.bind(obj2);
fn(); //logs "jupiter";
*/
//<source>
Function.prototype.bind = function (context) {
  var fn = this;
  return function () {
    fn.apply(context, arguments);
  };
};
//</source>

/**
* @function Function.prototype.defaults
* @param {Any} varargs
* @return {Function}
* @describe <p>Since JavaScript is weakly-typed language, it does not do or enforce any type checking or ensuring that a function is only passed the number of arguments it expects. So, augmenting <code>Function.prototype</code> with this method allows the developer to stipulate the maximum number of function arguments expected and a default value for each one.</p><p>See the entry in Code Buddy.</p>
* @example
var foobar = function (a, b) {
  alert(a);
  alert(b);
}.defaults("default_a", "default_b");

foobar("test");

//will alert "test" and "default_b";
*/
//<source>
Function.prototype.defaults = function () {

  var func = this,
    arr;
	
  if (func.length < arguments.length) {
    throw new Error("too many default arguments");
  }

  arr = Array.prototype.slice.apply(arguments).concat(new Array(func.length - arguments.length));

  return function () {
    return func.apply(arguments, Array.prototype.slice.apply(arguments).concat(
      arr.slice(arguments.length, arr.length)));
  };

};
//</source>

/**
* @function Function.prototype.method
* @param {String} sMethod
* @param {Function} fn
* @return {this}
* @describe <p>Dynamically add <code>sMethod</code> to <code>this</code>'s prototype.  Performs strict data type checking.</p>
*/
//<source>
Function.prototype.method = function (sMethod, fn) {

  this.prototype[sMethod] = fn;
  return this;

}.assert(String, Function);
//</source>

/**
* @function Function.prototype.overload
* @param {Object} obj
* @param {String} sName
* @return {Mixed}
* @describe <p>Mimics method overloading.</p>
* @example
function JavaScripters() {
  var programmers = ["Dean Edwards", "John Resig", "Doug Crockford", "Nicholas Zakas"];
  
  (function () {
    return programmers;
  }).overload(this, "find");

  (function (name) {
    var ret = [];
    for (var i = 0, iLength = programmers.length; i < iLength; i++) {
      if (programmers[i].indexOf(name) > -1) {
        ret.push(programmers[i]);
      }
    }
    return ret;
  }).overload(this, "find");

  (function (first, last) {
    var ret = [];
    for (var i = 0, iLength = programmers.length; i < iLength; i++) {
      if (programmers[i] == (first + " " + last)) {
        ret.push(programmers[i]);
      }
    }
    return ret;
  }).overload(this, "find");

}
var programmers = new JavaScripters();
alert(programmers.find("Dean", "Edwards"));
*/
//<source>
Function.prototype.overload = function (obj, sName) {

  /*
  obj == the class within which the method is invoked;
  this == refers to the anonymous function which the overload method is a method of;
  old == refers to the old method (could be null);
  */
  var old = obj[sName],
    that = this;

  /*i first tried this.args as an array with the
    Array.push method but ie7 didn't like it*/
  if (!obj.args) {
    obj.args = {};
  }
  obj.args[this.length] = true; //store each method's function length;
  obj[sName] = function () {
    if (obj.args[arguments.length]) {
      if (that.length === arguments.length) {
        return that.apply(this, arguments);
      } else if (typeof old === "function") {
        return old.apply(this, arguments);
      }
    } else {
      throw new Error("does not match method signature");
    }
  };

};
//</source>

/**
* @function Number.prototype.toHex
* @param {None}
* @return {String}
* @describe <p>Converts the number to its hexidecimal representation.</p>
*/
//<source>
Number.prototype.toHex = function () {

  return "0x" + this.toString(16);

}.assert(Number);
//</source>

/**
* @function String.prototype.invoke
* @param {String} sFunc
* @return {String}
* @describe <p>Invokes the passed argument as a method of the string on which it's bound.</p><p>Methods include <code><a href="#jsdoc">JSLITE.util.camelCase</a></code>, <code><a href="#jsdoc">JSLITE.util.capFirstLetter</a></code>, <code><a href="#jsdoc">JSLITE.util.entify</a></code>, <code><a href="#jsdoc">JSLITE.util.HTMLify</a></code>, <code><a href="#jsdoc">JSLITE.util.stripTags</a></code> and <code><a href="#jsdoc">JSLITE.trim</a></code>.</p><p>For a description of each method see the appropriate documentation in <code>JSLITE.util</code>.</p>
*/
//<source>
String.prototype.invoke = function (sFunc) {

  /*e.g., 'this's value == ['s', 't', 'r']*/
  if (JSLITE.util[sFunc]) {
    return JSLITE.util[sFunc](this + "");
  }

}.assert(String);
//</source>
