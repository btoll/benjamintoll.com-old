/**
 * @fileoverview Sample of widget class derived from Widget. See description of
 * base Widget class at http://trac.zapatec.com:8000/trac/wiki/Widget.
 *
 * <pre>
 * Copyright (c) 2004-2006 by Zapatec, Inc.
 * http://www.zapatec.com
 * 1700 MLK Way, Berkeley, California,
 * 94709, U.S.A.
 * All rights reserved.
 * </pre>
 */

/**
 * @ignore
 * @constructor
 * @param {object} objArgs User configuration
 */
Zapatec.ChildWidget = function(objArgs) {
  // Call constructor of superclass
  Zapatec.ChildWidget.SUPERconstructor.call(this, objArgs);
};

// Inherit Widget
Zapatec.inherit(Zapatec.ChildWidget, Zapatec.Widget);

/**
 * @ignore Initializes object.
 *
 * @param {object} objArgs User configuration
 */
Zapatec.ChildWidget.prototype.init = function(objArgs) {
  // Overwrite default config options if needed
  this.config.theme = '';
  // Define new config options
  this.config.option1 = 'default value';
  this.config.option2 = 'default value';
  // Call init method of superclass
  Zapatec.ChildWidget.SUPERclass.init.call(this, objArgs);
  // Continue initialization
  // ...
  // Call parent method to load data from the specified source
  this.loadData();
  // ...
};

/**
 * @ignore Loads data from the HTML source. Transforms input data from
 * the HTMLElement object. If needed, loadDataHtmlText, loadDataJson and
 * loadDataXml methods can be implemented as well.
 *
 * @param {object} objSource HTMLElement object
 */
Zapatec.ChildWidget.prototype.loadDataHtml = function(objSource) {
  // Parse source
  var objChild = objSource.firstChild;
  while (objChild) {
    // Do something with child element
    // ...
    // Go to next element
    objChild = objChild.nextSibling;
  }
};
