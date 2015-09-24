/*
 * jsLite
 *
 * Copyright (c) 2009 - 2011 Benjamin Toll (benjamintoll.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */

/**
* @function domQuery
* @param {String} sSelector
* @param {JSLITE.Element/HTMLElement/String} oRoot (Optional)
* @return {Array}
* @describe <p>Basic DOM CSS Selector engine. Returns an array of HTMLElements.</p><p>Though it's possible to invoke this as a class method, it's preferable to invoke <code><a href="#jsdoc">JSLITE.dom.gets</a></code> as this will return a composite element.</p> 
<p>
The current version of jsLite supports the following CSS selectors:
<ul>
  <li>Descendant selectors - <code>&quot;div p span&quot;</code></li>
  <li>Child selectors - <code>&quot;div &gt; p &gt; span&quot;</code></li>
  <li>Adjacent sibling selectors - <code>&quot;div + p + span&quot;</code></li>
  <li>Ids - <code>&quot;body#homePage&quot;</code></li>
  <li>Classes (can be chained and in any order) - <code>&quot;p.firstPara.tooltip&quot;</code></li>
  <li>The presence of an HTML attribute - <code>&quot;form#theForm.businessForm input[class]&quot;</code></li>
  <li>Attribute filters:
    <ul>
      <li><code>[class=foo]</code> - "class" exactly equals "foo"</li>
      <li><code>[class&lowast;=foo]</code> - "class" contains "foo"</li>
      <li><code>[class^=foo]</code> - "class" begins with "foo"</li>
      <li><code>[class$=foo]</code> - "class" ends with "foo"</li>
      <li><code>[class!=foo]</code> - "class" does not equal "foo"</li>
    </ul>
  </li>
  <li>Multiple selectors, separated by commas - <code>&quot;form input[name], form textarea[name], form select[name]&quot;</code></li>
</ul>
* @example
//find all links on a page and give them a gray background;
var cLinks = JSLITE.dom.gets("a[href]");
cLinks.addClass("grayBackground");

//find all links that are descendants of divs and disable them;
var cLinks = JSLITE.dom.gets("div a[href]");
cLinks.disable();
 
//find elements with multiple class names (the order of the class names isn't important);
var cElems = JSLITE.dom.gets("div ul.topNav li.home.external");

//fine-tune your searches using a dose of classes and ids and attribute selectors;
var cElems = JSLITE.dom.gets("div#header.page p span#about");

or

//find all anchors that have both an href and a rel attribute within any list item that has a class, etc.;
var cLis = JSLITE.dom.gets("body div[style].zucchero#theDiv.boo ul li[class=foo] a[rel][href]");
etc.

//collect all form elements for a form submission;
var cElems = JSLITE.dom.gets("#theForm asterisk[name]"); //NOTE replace the word "asterisk" with the actual symbol;

//attribute filters;
JSLITE.dom.gets("body div[class=zucchero boo foobar] ul[id^=someId] li[id][class=blue]");

JSLITE.dom.gets("div li[class*=too]");
*/
//<source>
JSLITE.domQuery = (function () {

  //define all of our variables, including functions, in one statement;
  var aChunksCache = [],
    oParts = null,
    bIEFix = JSLITE.isIE && !JSLITE.isIE8,
    sClass = bIEFix ? "className" : "class", //ie6 and ie7 return null for getAttribute("class");
    reChunker = /([>|+]|[a-z0-9_\-.#*]+(?:\([^\)]+\)|\[[^\]]+\])*)/gi, //matches "*[name]", "div", "div > li", "div#theDiv.foobar", "div > li[id=foo][class=bar]", "a[href]", "a:not(span)", etc.;
    reCombinators = /[>+]/,
    sCurrent,
    sBase,

    //begin function definitions;
    fnIsElementMatched = function (el, oAttr) {
      var b = true,
        o = oAttr,
        i,
        oFilter,
        sChar,
        key,
        val,
        x;

      for (i in o) {
        if (o.hasOwnProperty(i)) {
          switch (i) {
            case "has":
              b = oAttr.has.every(function (sAttr) {
                  return el !== document && el.getAttribute(sAttr);
                });
              break;
            case sClass:
              if (typeof oAttr[sClass] === "string") {
                b = el === document ? false : el.getAttribute(i) === o[i];
              } else {
                b = el === document ? false : fnTestClasses(el, oAttr[sClass]);
              }
              break;
            case "filter":
              oFilter = o.filter;
              sChar = oFilter.character;
  
              for (x in oFilter) {
                if (oFilter.hasOwnProperty(x)) {
                  if (x === "character") {
                    continue;
                  }
                  key = x;
                  val = oFilter[x];
                  switch (sChar) {
                    case "*": b = el.getAttribute(key) && el.getAttribute(key).indexOf(val) > -1; break;
                    case "^": b = el.getAttribute(key) && el.getAttribute(key).indexOf(val) === 0; break;
                    case "$": b = el.getAttribute(key) && el.getAttribute(key).split("").reverse().toString().indexOf(val.split("").reverse().toString()) === 0; break; //reverse each string and compare;
                    case "!": b = !el.getAttribute(key) || el.getAttribute(key) !== val; break;
                  }
                  if (!b) {
                    break;
                  }
                }
              }
              break;
            default: //catch all other cases, i.e., id="foobar", checked="checked", etc.;
              b = el !== document && el.getAttribute(i) && el.getAttribute(i) === o[i];
          }
          if (!b) {
            break;
          }
        }
      }
      return b ? el : false; //return either the element (passed) or false (failed);
    },

    fnGetElementsByClassName = function (vClassname, vRootElem, sSearchByTag) {
      var cElems, arr = [], bIsString = true;
      if (vRootElem) {
        cElems = $(vRootElem).getElementsByTagName(sSearchByTag || "*");
      } else {
        cElems = document.getElementsByTagName("*") || document.all;
      }

      if (typeof vClassname !== "string") {
        bIsString = !bIsString;
      }

      JSLITE.makeArray(cElems).forEach(function (el) {
        if (bIsString) { 
          if ((" " + el.className + " ").indexOf(" " + vClassname + " ") > -1) {
            arr.push(el);
          }
        } else {
          if (fnTestClasses(el, vClassname)) {
            arr.push(el);
          }
        }
      });
      return arr;
    },

    fnChunker = function (str) {
      /***************************************
        * here is what oParts could look like:
        oParts = {
          attr: { //elements with .class or #id selectors will be stored in attr;
            class: ["foo", "bar"],
            id: "myID"
          },
          filter: { //elements with attribute filters, i.e., [class*=foo][id^=bar], will be stored in filter;
            character: "*",
            class: "blue",
            id: "theForm"
          }
        };
      ***************************************/

      //the regex matches "body", "div#theDiv", "ul.theList li.foo", "a[href]", "li[class=foo]", etc.;
      var re = /((?:[>|+]|[a-z*]+|\[[^\]]+\]|[.#][a-z0-9_\-]+))/gi,
        m,
        o = {},
        s,
        c,
        vAttr,
        sAttr;

      while ((m = re.exec(str)) !== null) {
        s = m[1];
        c = s.charAt(0);

        if (!o.attr) {
          o.attr = {};
        }
        switch (c) {
          case "#":
            o.attr.id = s.substring(1);
            break;
          case ".":
            if (!o.attr[sClass]) {
              o.attr[sClass] = []; //"class" is a reserved word;
            }
            o.attr[sClass].push(s.substring(1));
            break;
          case "[":
            vAttr = s.replace(/\[([^\]]+)\]/, "$1");
            if (vAttr.indexOf("=") > -1) { //test for the presence of an attribute filter;
              vAttr = vAttr.split("=");
              if (/[*|\^|$|!]/.test(vAttr[0])) {
                vAttr[0] = vAttr[0].replace(/(\w+)([*|\^|$|!]$)/, function (a, b, c) { //if an attribute filter is present...;
                  if (!o.attr.filter) {
                    o.attr.filter = {};
                  }
                  if (!o.attr.filter.character) {
                    o.attr.filter.character = c; //store the filter (i.e., "*", "^", etc.);
                  }
                  o.attr.filter[b] = vAttr[1]; //...store it as filter['id'] = 'foobar'...;
                  return a.slice(0, -1); //...and remove it from the end of the token;
                })
              } else { //only get here if there're no attribute filters, else we'll get duplicate props i.e., {class: "foo", filter: { class: "foo"}};
                if (JSLITE.isArray(vAttr)) {
                  sAttr = vAttr[0];
                  vAttr = vAttr[1];
                } else {
                  sAttr = vAttr; //if vAttr is a string then make the vars equal to each other;
                }
                if (bIEFix) { //IE 6 & 7 need "class" to be "className" for HTMLElement.getAttribute() method;
                  sAttr = sAttr === "class" ? sClass : sAttr; //sClass was already determined above (IE req.); ie returns null for getAttribute("class"); 
                  vAttr = vAttr === "class" ? sClass : vAttr; //sClass was already determined above (IE req.); ie returns null for getAttribute("class"); 
                }
                o.attr[sAttr] = vAttr;
              }
            } else { //check for just the presence of the attribute, i.e., "p[id]";
              if (vAttr === "class") {
                vAttr = sClass;
              }
              if (!o.attr.has) {
                o.attr.has = [];
              }
              o.attr.has.push(vAttr);
            }
            break;
          default:
            o.nodeName = s.toLocaleUpperCase();
        } 
      }
      return JSLITE.isEmpty(o) ? false : o;
    },

    fnChunk = function (str) {
      var oParts = {};
      if (JSLITE.tags.test(str)) {
        oParts.nodeName = str.toLocaleUpperCase();
      } else {
        oParts = fnChunker(str);
      }
      return oParts;
    },

    fnTestClasses = function (oParent, aKlasses) {
      var bPassed = true,
        sParentClass = oParent.getAttribute(sClass);

      aKlasses.forEach(function (sKlass) {
        if ((" " + sParentClass + " ").indexOf(" " + sKlass + " ") === -1) {
          bPassed = !bPassed; //if even one fails then we know the classes don't match;
        }
      });
      return bPassed;
    },

    fnGetPreviousSibling = function (o) {
      o = o.previousSibling;
      while (o && o.nodeType !== 1) {
        o = o.previousSibling;
      }
      return o;
    },

    fnCheckCombinator = function (el, sCombinator) {
      var oParent = oParts.parent;

      if (sCombinator === ">") { //check that the child's parent (el.parentNode) equals the node name of the parent;
        if (el) {
          if (oParent.nodeName) {
            el = el.parentNode && el.parentNode.nodeName === oParent.nodeName ? fnIsElementMatched(el.parentNode, oParent.attr) : false;
          } else {
            el = fnIsElementMatched(el.parentNode, oParent.attr) ? el : false;
          }
        }
      } else if (sCombinator === "+") {
        el = fnGetPreviousSibling(el);
        if (el) {
          if (oParent.nodeName) {
            el = el.nodeName === oParent.nodeName ? el : false;
          } else {
            el = fnIsElementMatched(el, oParent.attr) ? el : false;
          }
        }
      }
      return el;
    },

    fnCheckSelector = function (el, aChunks) {
      var oParent,
        fnGetParts = function (sCurrent) {
          oParts = !oParts ? fnChunk(sBase) : oParts.parent; //if oParts is null it's the first time through, else we already know what it is; remember on every subsequent loop the parent becomes the child, so to speak;
          oParts.parent = fnChunk(sCurrent);
          oParent = oParts.parent;
        },
        sCombinator;

      if (reCombinators.exec(sCurrent)) {
        sCombinator = sCurrent;
        fnGetParts(aChunks.pop());
        return fnCheckCombinator(el, sCombinator);
      } else {
        fnGetParts(sCurrent);
        el = el.parentNode;
        if (oParent.nodeName) {
          while (el && el.nodeName !== oParent.nodeName) {
            el = el.parentNode;
          }
          if (el) {
            el = fnIsElementMatched(el, oParent.attr);
          }
        } else {
          while (el && el.nodeName) {
            if (!fnIsElementMatched(el, oParent.attr)) {
              el = el.parentNode;
            } else {
              return el;
            }
          }
        }
        return el;
      }
    },

    fnNext = function (vResult, aChunks) {
      sBase = sCurrent;
      sCurrent = aChunks.pop();
      while (sCurrent && vResult && (vResult = fnCheckSelector(vResult, aChunks))) { //if sCurrent is undefined then aChunks is empty, if vResult is null then something an ancestor specified by the user in the selector isn't true;
        vResult = fnNext(vResult, aChunks);
      }
      return vResult;
    },

    fnReplenish = function (el, aChunks) {
      //aChunks.length = 0;
      aChunks = aChunksCache.concat();
    },

    fnSearch = function (sSelector, oRoot) {
      var aSelector = sSelector.indexOf(",") > -1 ?
        sSelector.split(",") :
          [sSelector],
        aElems = [],
        aKeep = [],
        aPassed = [], //holds all the dom elements that pass muster;
        aUnique = []; //will hold the unique dom elements that are found (the same ones can be found csv selectors);

      aSelector.forEach(function (sSelector) {
        aPassed.push((function () {

          var aChunks = [], //20100517 changed this to be have function scope. aChunks must now be passed as an argument function since it's no longer a global var in this execution context; the reason is b/c the following wasn't being handled correctly (JSLITE.dom.gets(".notes span, .chords span")); the aChunks stack wasn't being cleared each time a selector was checked (i.e., selectors are split on commas);
            vResult,
            aTemp = [];

          while (reChunker.exec(sSelector)) {
            aChunks.push(JSLITE.trim(RegExp.$1));
          }

          oRoot = oRoot ? JSLITE.dom.getDom(oRoot) : document;
          sBase = aChunks.pop();
          aChunksCache = aChunks.concat(); //since aChunks is acting as a stack, it will eventually be depleted so make a copy to "replenish" it as needed;
 
          if (JSLITE.tags.test(sBase)) {
            aElems = JSLITE.makeArray(oRoot.getElementsByTagName(sBase));
          } else {
            oParts = fnChunk(sBase);
            if (oParts.attr[sClass]) {
              aTemp = fnGetElementsByClassName(oParts.attr[sClass], oRoot, oParts.nodeName);
            } else if (oParts.attr.id) {
              aTemp.push(document.getElementById(oParts.attr.id));
            } else {
              aTemp = JSLITE.makeArray(oRoot.getElementsByTagName(oParts.nodeName));
            }
            aTemp.forEach(function (el) {
              if (oParts.nodeName && el.nodeName !== oParts.nodeName) {
                return; //if the node names don't match we can safely ignore it;
              }
              if (fnIsElementMatched(el, oParts.attr)) {
                aElems.push(el);
              }
            });
            aTemp = null;
            oParts = null; //reset oParts b/c it needs to be need the first time through the loop below;
          }

          if (!aChunks.length) { //if aChunks is empty just return aElems b/c we know that the selector was composed of only one piece;
            return aElems;
          }

          if (aElems.length) {
            aElems.forEach(function (el) {
              if (!aChunks.length) { //the stack is empty...
                aChunks = aChunksCache.concat(); //...so replenish it from the cache;
              }
 
              sCurrent = aChunks.pop();
              vResult = fnCheckSelector(el, aChunks);
              if (!vResult) {
                fnReplenish(el, aChunks);
              } else {
                if (aChunks.length) {
                  if (!fnNext(vResult, aChunks)) {
                    fnReplenish(el, aChunks);
                  } else {
                    aKeep.push(el);
                  }
                } else {
                  aKeep.push(el);
                }
              }
            });
          }

          return aKeep;

        }()));
      });
 
      aPassed.forEach(function (arr) {
        aUnique = aUnique.concat(arr);
      });
      return aUnique.unique();
    };

  return {
    find: function (el, sSelector) {
/*
      if (!arguments.callee.chunked) { //this prevents accessing fnChunk more than once when walking up the dom looking for an ancestor element;
        arguments.callee.attr = fnChunk(sSelector).attr;
        arguments.callee.chunked = true;
      }
*/
      return fnIsElementMatched(el, fnChunk(sSelector).attr);
    },
    search: function (sSelector, oRoot) {
      return fnSearch(sSelector, oRoot);
    }/*,
    testClasses: function (oParent, aKlasses) {
      return fnTestClasses(oParent, aKlasses);
    }
*/
  };

}());
//</source>
