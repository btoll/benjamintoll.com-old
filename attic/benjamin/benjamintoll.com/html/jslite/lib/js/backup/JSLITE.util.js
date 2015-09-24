/*
 * jsLite
 *
 * Copyright (c) 2009 - 2010 Benjamin Toll (benjamintoll.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */

JSLITE.util = {

  /**
  * @function JSLITE.util.addCommas
  * @param {Number/String} vFormat The number to be formatted with commas.
  * @return {String}
  * @describe <p>Accepts a <code>Number</code> or a <code>String</code> and formats it with commas, i.e. <code>3,456,678</code>.</p><p>Note that it's returned as a <code>String</code> because it may contain a comma and <code>parseInt()</code> gives up when it sees a character that doesn't evaluate to a number.</p>
  */
  //<source>
  addCommas: function (vFormat) {

    var str = vFormat + "",
      re = /(\d+)(\d{3})/;

    while (re.test(str)) {
      str = str.replace(re, "$1,$2");
    }
    /*can't return as a number b/c it could contain commas
      and parseInt() gives up when it sees a comma*/
    return str;

  },
  //</source>

  /**
  * @function JSLITE.util.camelCase
  * @param {String} str
  * @return {String}
  * @describe <p>Searches the <code>String</code> for an instance of a period (.), underscore (_), whitespace ( ) or hyphen (-) in a word and removes it, capitalizing the first letter of the joined text.</p>
  * @example
document.write("This old Farm.land Boy-oh_boy".camelCase());

writes:

This old farmLand boyOhBoy
  */
  //<source>
  camelCase: function (str) {

    var re = /([a-zA-Z0-9])([a-zA-Z0-9]*)[_|\-|\.|\s]([a-zA-Z0-9])/g;

    return str.replace(re, function (a, b, c, d) {
      return b.toLocaleLowerCase() + c + d.toLocaleUpperCase();
    });

  }.assert(String),
  //</source>

  /**
  * @function JSLITE.util.capFirstLetter
  * @param {String} str
  * @return {String}
  * @describe <p>Replaces every period (.), underscore (_) and hyphen (-) with a space ( ) and then capitalizes the first letter of each word.</p>
  */
  //<source>
  capFirstLetter: function (str) {

    //replace all . or _ or - with a space and
    //then capitalize the first letter of each word;

    var re = /[\s|_|\-|\.](\w)/g;

    str = str.replace(re, function (a, b) {
      return " " + b.toLocaleUpperCase();
    });
    return str.charAt(0).toLocaleUpperCase() + str.slice(1);

  }.assert(String),
  //</source>

  /**
  * @function JSLITE.util.entify
  * @param {String} str
  * @return {String}
  * @describe <p>Replaces HTML entities with their respective characters.</p><p>Essentially, the opposite of <code><a href="#jsdoc">JSLITE.util.HTMLify</a></code>.</p>
  * @example
  JSLITE.ajax({
    url: sURL,
    data: "xml",
    type: "POST",
    async: false,
    onSuccess: function (xmlResponse) {
      $("myDiv").innerHTML = xmlResponse.entify();
    }
  });
  */
  //<source>
  entify: function () {

    var oChars = {
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#034;': '"',
      '&amp;': '&'
    };
    return this.replace(/(&.+?;)/g, function (a, b) { //non-greedy, matches html entities (both names and numbers);
      return typeof oChars[b] === "string" && oChars[b] ? oChars[b] : a;
    });

    //NOTE that if viewing this via HTML the regular
    //expression will convert it's entities to HTML;
    //please view the source;

  }.assert(String),
  //</source>

  /**
  * @function JSLITE.util.getOffsetX
  * @param {HTMLElement} oElem
  * @return {Number}
  */
  //<source>
  getOffsetX: function (oElem) {

    return oElem.offsetParent ?
      oElem.offsetLeft + arguments.callee(oElem.offsetParent) :
        oElem.offsetLeft;

  },
  //</source>

  /**
  * @function JSLITE.util.getOffsetY
  * @param {HTMLElement} oElem
  * @return {Number}
  */
  //<source>
  getOffsetY: function (oElem) {

    return oElem.offsetParent ?
      oElem.offsetTop + arguments.callee(oElem.offsetParent) :
        oElem.offsetTop;

  },
  //</source>

  /**
  * @function JSLITE.util.getStyle
  * @param {HTMLElement} oElem
  * @param {String} sName The CSS property name.
  * @return {Number}
  * @describe <p>Gets the computed value of the queried style.</p>
  */
  //<source>
  getStyle: function (oElem, sName) {

    //if the property exists in style[] then it's been set recently and is current;
    if (oElem.style[sName]) {
      return oElem.style[sName];
    
    //otherwise try the w3c's method;
    } else if (document.defaultView && document.defaultView.getComputedStyle) {
      //it uses the traditional 'text-align' style of rule writing instead of 'textAlign';
      sName = sName.replace(/(.*)([A-Z].*)/, function (a, b, c) {
        return b + "-" + c.toLocaleLowerCase();
      });

      //get the style object and get the value of the property if it exists;
      var s = document.defaultView.getComputedStyle(oElem, "");
      return s && s.getPropertyValue(sName);

    //otherwise, try to use IE's method;
    } else if (oElem.currentStyle) {
      return oElem.currentStyle[sName];

    //otherwise, we're using some other browser;
    } else {
      return null;
    }

  },
  //</source>

  /**
  * @function JSLITE.util.getX
  * @param {EventObject} e
  * @return {Number}
  * @describe <p>Returns the X coordinate of the queried element in the viewport.</p>
  */
  //<source>
  getX: function (e) {

    //check for the non-IE position, then the IE position;
    return e.pageX || e.clientX + document.body.scrollLeft;

  },
  //</source>

  /**
  * @function JSLITE.util.getY
  * @param {EventObject} e
  * @return {Number}
  * @describe <p>Returns the Y coordinate of the queried element in the viewport.</p>
  */
  //<source>
  getY: function (e) {
	
    //check for the non-IE position, then the IE position;
    return e.pageY || e.clientY + document.body.scrollTop;

  },
  //</source>

  /**
  * @function JSLITE.util.howMany
  * @param {String} sHaystack The string to search
  * @param {String} sNeedle The part to search for
  * @return {Number}  * @describe <p>Returns how many times <code>sNeedle</code> occurs in the given <code>sHaystack</code>.</p>
  */
  //<source>
  howMany: function (sHaystack, sNeedle) {

    var i = 0,
      iPos = sHaystack.indexOf(sNeedle);

    while (iPos > -1) {
      iPos = sHaystack.indexOf(sNeedle, iPos + 1);
      i++;
    }
    return i;

  },
  //</source>

  /**
  * @function JSLITE.util.HTMLify
  * @param {String} str
  * @return {String}
  * @describe <p>Replaces <">& with its respective HTML entity.</p><p>This allows the developer to display HTML in the page rather than having the browser render it.</p><p>Essentially, the opposite of <code><a href="#jsdoc">JSLITE.util.entify</a></code>.</p>
  * @example
  JSLITE.ajax({
    url: sURL,
    data: "html",
    type: "POST",
    async: false,
    onSuccess: function (sResponse) {
      $("myDiv").innerHTML = sResponse.HTMLify();
    }
  });
  */
  //<source>
  HTMLify: function (str) {

    var oChars = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '&': '&amp;'
    };

    return str.replace(/[<">&]/g, function (a) {
      return oChars[a];
    });

  }.assert(String),
  //</source>

  /**
  * @function JSLITE.util.range
  * @param {String} sRange
  * @return {Array}
  * @describe <p>Inspired by Ruby's <code>range</code> method. Since this method is based on Ruby's implementation, the syntax and functionality is very similar.</p>
<p>This method will return both numeric and alphabetical arrays. The beginning range element must always be smaller than the ending range element. Note that even though numeric ranges are passed to the method as a string data type, i.e., "1..100", the array returned will contain numeric elements. Alphabetical ranges will of course return an array of strings.</p><p>Just as in Ruby, the ".." range is inclusive, while the "..." range is exclusive.</p>
<ul>
  <li>JSLITE.range("-52..-5") //returns an array containing elements -52 through -5, <em>including</em> -5;</li>
  <li>JSLITE.range("-52...-5") //returns an array containing elements -52 through -5, <em>excluding</em> -5;</li>
  <li>JSLITE.range("-5..-52") //throws an exception;</li>
  <li>JSLITE.range("a..z") //returns an array containing elements "a" through "z", <em>including</em> "z";</li>
  <li>JSLITE.range("A...Z") //returns an array containing elements "A" through "Z", <em>excluding</em> "Z";</li>
  <li>JSLITE.range("E..A") //throws an exception;</li>
</ul>
  * @example
var iTemp = 72;
switch (true) {
  case JSLITE.range("-30..-1").contains(iTemp):
    console.log("Sub-freezing");
    break;

  case JSLITE.range("0..32").contains(iTemp):
    console.log("Freezing");
    break;

  case JSLITE.range("33..65").contains(iTemp):
    console.log("Cool");
    break;

  case JSLITE.range("66..95").contains(iTemp):
    console.log("Balmy");
    break;

  case JSLITE.range("96..120").contains(iTemp):
    console.log("Hot, hot, hot!");
    break;

  default:
    console.log("You must be very uncomfortable, wherever you are!");
}

//logs "Balmy";

-----------------------------------------------------------------------------

//create and return the alphabet as a string;
JSLITE.range("A..Z").join("");
  */
  //<source>
  range: function (sRange) {

    var re = /(\-?\w+)(\.{2,3})(\-?\w+)/,
      aChunks = re.exec(sRange),
      aRange = [],
      bIsNumeric = aChunks[1] === "0" || !!Number(aChunks[1]),
      iBegin,
      iEnd,
      i;

    if (re.test(sRange)) {
      //NOTE !!(Number("0") evaluates to falsy for numeric ranges so specifically check for this condition;
      sRange = aChunks[2]; //re-assign the value of sRange to the actual range, i.e., ".." or "...";

      //if it's a numeric range cast the string into a number else get the Unicode value of the letter for alpha ranges;
      iBegin = bIsNumeric ? Number(aChunks[1]) : aChunks[1].charCodeAt();
      iEnd = bIsNumeric ? Number(aChunks[3]) : aChunks[3].charCodeAt();

      //establish some exceptions;
      if (iBegin > iEnd) {
        throw new Error("The end range cannot be smaller than the start range.");
      }
      if (bIsNumeric && (iEnd - iBegin) > 1000) {
        throw new Error("The range is too large, please narrow it.");
      }

      for (i = 0; iBegin <= iEnd; i++, iBegin++) {
        //if it's an alphabetical range then turn the Unicode value into a string (number to a string);
        aRange[i] = bIsNumeric ? iBegin : String.fromCharCode(iBegin);
      }
      if (sRange === "...") {
        aRange.splice(-1); //if the range is exclusive, lop off the last index;
      }
      return aRange;
    }

  },
  //</source>

  /**
  * @function JSLITE.util.stripTags
  * @param {String} str
  * @return {String}
  * @describe <p>Removes all <code>HTML</code> tags from a <code>String</code>.</p>
  */
  //<source>
  stripTags: function (str) { //strip out all HTML tags;

    return str.replace(/<(?:.|\n)+?>/g, ""); //non-capturing, non-greedy;

  }.assert(String),
  //</source>

/*
  timestamp: function (oDate) {

    var iHour = oDate.getHours,
      sPeriod = iHour < 12 ? " a.m. EST" : " p.m. EST";

    return "last updated at " + this.getHours(iHour) +
      ":" + this.getMinutes(oDate.getMinutes()) + sPeriod;

  }
*/

};
