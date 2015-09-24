/*
 * jsLite
 *
 * Copyright (c) 2009 - 2011 Benjamin Toll (benjamintoll.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */

/**
* @function Composite
* @param {Object} cElems A collection of <code>HTMLElements</code>
* @return {None}
* @describe <p>Constructor. Shouldn't be called directly.</p>
*/
//<source>
JSLITE.Composite = function (cElems) {

  this.elements = cElems;
  this.length = this.elements.length;
  this.el = new JSLITE.Element();

};
//</source>

JSLITE.Composite.prototype = {

  /**
  * @function JSLITE.Composite.getCount
  * @param {None}
  * @return {Number}
  * @describe <p>Returns the number of objects in the Composite.</p>
  */
  //<source>
  getCount: function () {

    return this.elements.length;

  },
  //</source>

  /**
  * @function JSLITE.Composite.invoke
  * @param {String/HTMLElement} vElem
  * @return {JSLITE.Element}
  * @describe <p>Constructor. Shouldn't be called directly.</p>
  */
  //<source>
  invoke: function (fn, args) {

    var el = this.el;
    this.elements.forEach(function (oElem) {
      el.dom = oElem;
      JSLITE.Element.prototype[fn].apply(el, args);
    });
    return this; //return the instanceof JSLITE.Composite so we can chain methods;

  }
  //</source>

};

/*taken from ExtJS
- JSLITE.Composite "inherits" each function from JSLITE.Element's prototype object
- Note that each "inherited" function will return JSLITE.Composite.invoke() which
  will call each function as a method of JSLITE.Element
*/
(function () {
  JSLITE.Composite.createCall = function (proto, fnName) { //bridge method;
    if (!proto[fnName]) {
      proto[fnName] = function () {
        return this.invoke(fnName, arguments);
      };
    }
  };

  for (var fnName in JSLITE.Element.prototype) {
    if (typeof JSLITE.Element.prototype[fnName] === "function") {
      JSLITE.Composite.createCall(JSLITE.Composite.prototype, fnName);
    }
  }
}());
