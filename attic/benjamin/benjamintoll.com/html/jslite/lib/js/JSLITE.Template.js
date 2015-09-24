/*
 * jsLite
 *
 * Copyright (c) 2009 - 2011 Benjamin Toll (benjamintoll.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */

/**
* @function Template
* @param {String} sHtml A tokenized string of HTML that will define the template
* @return {None}
* @describe <p>Constructor.</p>
<p><a href="http://jslite.benjamintoll.com/examples/template.php" rel="external">See an example</a></p>
*/
//<source>
JSLITE.Template = function (sHtml) {

  var a = arguments,
    buf,
    i,
    len;

  if (JSLITE.isArray(sHtml)) {
    sHtml = sHtml.join("");
  } else if (a.length > 1) {
    buf = [];
    for (i = 0, len = a.length; i < len; i++) {
      if (typeof a[i] === "object") {
        JSLITE.apply(this, a[i]);
      } else {
        buf[buf.length] = a[i];
      }
    }
    sHtml = buf.join("");
  }

  this.html = sHtml;

};
//</source>

JSLITE.Template.prototype = {

  /**
  * @property JSLITE.Template.re
  * @type RegExp
  * @describe <p>Constant. The regular expression against which the Template is applied.</p>
  */
  //<source>
  re: /\{(\w+)\}/g,
  //</source>

  /**
  * @function JSLITE.Template.append
  * @param {HTMLElement/JSLITE.Element} oElem
  * @param {Object/Array} vValues An object literal or an array, will contain a map for the tokens
  * @return {None}
  * @describe <p>Appends the Template to the element referenced by <code>oElem</code>. <code>oValues</code> will contain a map for the tokens.</p>
  */
  //<source>
  append: function (oElem, vValues) {

    JSLITE.dom.insertHtml("beforeEnd", JSLITE.dom.getDom(oElem), this.apply(vValues));

  },
  //</source>

  /**
  * @function JSLITE.Template.apply
  * @param {Object/Array} vValues An object literal token map or an array
  * @return {String}
  * @describe <p>Returns the Template (a <code>String</code>) with the values specified by <code>oValues</code> for the tokens.</p>
  */
  //<source>
  apply: function (vValues) {

    return this.html.replace(this.re, function (a, b) {
      return vValues[b];
    });

  }
  //</source>

};
