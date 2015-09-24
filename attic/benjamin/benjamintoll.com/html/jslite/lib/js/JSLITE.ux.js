/*
 * jsLite
 *
 * Copyright (c) 2009 - 2011 Benjamin Toll (benjamintoll.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */

/*
modules in this file:
 - Fade
 - Scrubber
 - Tabs
 - Tooltip
 - Grid stuff
 - Drag n Drop
 - Animation
*/

JSLITE.ux = {};

JSLITE.ux.fade = function (elem, red, green, blue) {

  if (elem.fade) {
    clearTimeout(elem.fade);
  }
  elem.style.backgroundColor = "rgb(" + red + ", " + green + ", " + blue + ")";
  if (red == 238 && green == 238 && blue == 221) {
    return;
  }

  var newred = red + Math.ceil((238 - red) / 10),
    newgreen = green + Math.ceil((238 - green) / 10),
    newblue = blue + Math.ceil((221 - blue) / 10),
    repeat = function() {
      JSLITE.ux.fade(elem, newred, newgreen, newblue);
    };

  elem.fade = setTimeout(repeat, 50);

},

/*****************************************************************************************************************/
/*****************************************************************************************************************/
/**
* @function JSLITE.ux.Scrubber
* @param {JSLITE.Element/HTMLElement} oElem The elements to validate.
* @param {Object} oConfig Optional configuration options.
* @return {Scrubber}
* @describe <p>Can be instantiated directly but is meant to be called indirectly when validating form elements.  Please refer to <code><a href="#jsdoc">JSLITE.Element.validate</a></code>.</p><p>Returns an instance of the <code>Scrubber</code> class that is bound to the form object that was passed in the constructor.</p><p>Note that since forms will have different HTML structures, the <code>options.classMap</code> property can be used to target the element that should have the <code>textError</code> class attached to it.</p>
*/
//<source>
JSLITE.ux.Scrubber = function (oElem, oConfig) {

  this.elements = [];
  this.failed = {};
  this.passed = {};

  JSLITE.dom.formElements(oElem).forEach(function (elem, i) {
    var re = /required-?(\S*)/, aMatch = [];
    if (JSLITE.dom.isTextBox(elem)) {
      if ((aMatch = elem.className.match(re))) {
        //capture the element and the type of validation to be performed;
        this.elements.push({elem: elem, rule: aMatch[1]});
        //expando property used to sort the elements before appending them to the errorBox;
        elem.sortOrder = JSLITE.counter();
      }
    }
  }.bind(this));

  this.options = JSLITE.apply({
    backgroundClass: JSLITE.globalSymbol + "_backgroundError",
    classMap: "previous",
    errorBox: JSLITE.dom.create({tag: "div", //default error box;
      attr: {className: JSLITE.globalSymbol + "_errorBox"},
      children: [
        JSLITE.dom.create({tag: "p",
          attr: {innerHTML: "The following form elements failed validation:"}
        }),
        JSLITE.dom.create({tag: "ol",
          attr: {className: JSLITE.globalSymbol + "_errorList"}
        })
      ]
    }),
    rule: { message: "Required fields cannot be blank." },
    template: new JSLITE.Template("<label>{name}</label><span>{rule}</span>"),
    textClass: JSLITE.globalSymbol + "_textError"
  }, oConfig || {});

};
//</source>
JSLITE.ux.Scrubber.prototype = {

  classMap: function (fn) {

    var oCurrent = JSLITE.dom.get(this.currentElement), oOpts = this.options, oMapped;
    oOpts.classMap = typeof oOpts.classMap === "string" ? [oOpts.classMap] : oOpts.classMap; //classMap can be a string if there's only one value, so turn it into an array;
    oOpts.classMap.forEach(function (sFn) { //each element in classMap will be a directional value (i.e., "parent", "previous", "next"), so invoke and 'steer' oMapped to the element to which the class should be attached;
      oMapped = oCurrent[sFn](); //change the context of oMapped;
    });
    JSLITE.dom.fly(oMapped)[fn](oOpts.textClass); //finally, attach or remove the class;

  },

  counter: 0,
 
  fail: function () {

    var oCurrent = JSLITE.dom.get(this.currentElement), oOpts = this.options;
    if (!oCurrent.hasClass(oOpts.backgroundClass)) {
      oCurrent.addClass(oOpts.backgroundClass);
      this.classMap("addClass");
    }
    this.failed[this.currentElement.name] = { elem: this.currentElement, rule: this.currentRule || this.options.rule }; //if this.currentRule is undefined it's b/c required fields don't have a rule in JSLITE.Rules so create a generic message;
    if (this.passed[this.currentElement.name]) {
      delete this.passed[this.currentElement.name];
    }
    this.counter++;

  },

  getErrors: function () {
    return this.counter;
  },

  pass: function () {

    var oCurrent = JSLITE.dom.get(this.currentElement), oOpts = this.options;
    if (oCurrent.hasClass(oOpts.backgroundClass)) {
      oCurrent.removeClass(oOpts.backgroundClass);
      this.classMap("removeClass");
    }
    this.passed[this.currentElement.name] = { elem: this.currentElement, rule: this.currentRule || this.options.rule };
    if (this.failed[this.currentElement.name]) {
      delete this.failed[this.currentElement.name];
    }

  },

  setErrorBox: function () {

    var oErrorBox = this.options.errorBox, oList = oErrorBox.dom.lastChild, oFailed = this.failed, aSort = [];
    if (oErrorBox && $(oErrorBox.dom.id)) { //if this.errorBox exists and is still in the DOM;
      oErrorBox.dom.lastChild.innerHTML = "";
      oErrorBox.dom.parentNode.removeChild(oErrorBox.dom);
    }

    aSort = JSLITE.toArray(oFailed); //cast the object to an array;

    aSort.sort(function (a, b) {
      return a.elem.sortOrder > b.elem.sortOrder;
    });
    
    aSort.forEach(function (o) {
      var oLi = JSLITE.dom.create({tag: "li",
        parent: oList
      });
      oLi.dom.innerHTML = this.options.template.apply({ "name": JSLITE.util.capFirstLetter(o.elem.name), "rule": o.rule.message });
    }.bind(this));

    return oErrorBox;

  },

  validate: function () {

    this.counter = 0; //reset the counter;
    this.elements.forEach(function (oElem, i) {
      var sRule = oElem.rule,
        oElem = oElem.elem,
        aChunks = [],
        oRule,
        sMask;

      this.currentElement = oElem;
      JSLITE.dom.fly(oElem).trim();
      oRule = this.currentRule = JSLITE.Rules.getRule(sRule);
      if (oRule) {
        if ((aChunks = oElem.value.match(new RegExp(oRule.re)))) {
          this.pass();
          if (oRule.mask) { //if there's an input mask, apply it;
            sMask = oRule.mask;
            sMask = sMask.replace(/\{(\d+)\}/g, function (a, b) {
              return aChunks[b];
            });
            oElem.value = sMask.replace(/undefined/g, ""); //if any tokens are undefined (i.e., in "zip"), strip out "undefined";
          }
        } else {
          this.fail();
        }
      } else {
        if (/^\s*$/.test(oElem.value) || oElem.value === "") { //or just make sure any character was entered into the field?;
          this.fail();
        } else {
          this.pass();
        }
      }
    }.bind(this));

  }

};

/*****************************************************************************************************************/
/*****************************************************************************************************************/
/**
* @function JSLITE.ux.Tabs
* @param {Object} oClasses Optional If omitted will default to what has been set in JSLITE.tabClasses 
* @return {None}
* @describe <p>Inspired by the <a href="http://www.alistapart.com/articles/slidingdoors/" rel="external">article</a> at A List Apart.</p>
<p>Formerly <code>JSLITE.ux.SlidingDoors</code>.</p>
* @example
<div class="JSLITE_Tabs">
  <ol>
    <li id="selected"><a href="#" rel="description">Description</a></li>
    <li><a href="#" rel="source">Source</a></li>
    <li><a href="#" rel="example">Example</a></li>
  </ol>

  <div id="description" class="JSLITE_Tab">
  </div>

  <div id="source" class="JSLITE_Tab hide">
  </div>

  <div id="example" class="JSLITE_Tab hide">
  </div>
</div>

Each "rel" attribute in div.JSLITE_Tabs maps to a <div>.

*/
//<source>
JSLITE.ux.Tabs = function (oClasses) {

  var fnHookup = function (e) {
    var oTarget = e.target;
    //if (oTarget.nodeName.toLocaleLowerCase() === "a" && oTarget["rel"]) { //ie6 doesn't support HTMLElement.hasAttribute();
    if (oTarget.nodeName.toLocaleLowerCase() === "a" && oTarget.getAttribute("rel")) { //ie6 doesn't support HTMLElement.hasAttribute();
      if (oTarget.parentNode.id === "selected") {
        return false;
      }
      JSLITE.dom.gets("." + JSLITE.tabClasses.tabs, true).forEach(function (oDiv) {
        JSLITE.makeArray(oDiv.getElementsByTagName("li")).forEach(function (o) {
          o.id = ""; //remove every id to make sure that "selected" is assigned to the correct element;
        });
      });
      oTarget.parentNode.id = "selected";
      JSLITE.dom.gets("div." + JSLITE.tabClasses.tab, true).forEach(function (oDiv) {
        var o = JSLITE.dom.fly(oDiv);
        if (o.dom.id === oTarget.rel) {
          o.removeClass("hide");
        } else {
          if (!o.hasClass("hide")) {
            o.addClass("hide");
          }
        }
      });
    }
    e.preventDefault();
  },
  oDiv = JSLITE.dom.gets("." + JSLITE.tabClasses.tabs);

  oDiv.on("click", fnHookup); //event delegation;
  if (!JSLITE.isIE) {
    JSLITE.makeArray(oDiv.el.dom.getElementsByTagName("a")).forEach(function (oLink) {
      oLink.onfocus = function () {
        if (this.blur) {
          this.blur();
        }
      };
    });
  }

};
//</source>

/*****************************************************************************************************************/
/*****************************************************************************************************************/
JSLITE.ux.Tooltip = (function () {

  var fnAnimate = function (o) {
      JSLITE.ux.AnimationManager.add([
        { 
          anchor: true,
          elem: o.elem,
          direction: "right",
          fadeIn: true,
          go: o.width,
          speed: "slowRide"
        },
        { 
          anchor: true,
          elem: o.elem,
          direction: "bottom",
          fadeIn: true,
          go: o.height,
          speed: "slowRide",
          complete: function () {
            o.tooltipWrapper.setStyle({
              //textIndent: 0,
              visibility: "visible",
              width: o.tooltipWrapperWidth
            });
          }
        }
      ]).run();
  },

  fnBindHandler = function (oElem, bAnimate) {
    JSLITE.dom.fly(oElem).on("click", function (e) {
      var oWrapper = $(this.tooltip.wrapper),
        oWrapperStyles = oWrapper.style,
        oTooltipWrapper = JSLITE.dom.get(".JSLITE_TooltipWrapper", oWrapper),
        iWidth,
        iHeight,
        iTooltipWrapperWidth;

      oWrapperStyles.top = JSLITE.util.getY(e) + "px"; //use mouse coords (for now);
      oWrapperStyles.left = JSLITE.util.getX(e) + "px"; //use mouse coords (for now);
      if (bAnimate) {
        oWrapperStyles.opacity = 0; //set opacity to 0 and the motions to fadeIn so everything is invisible from the beginning else there could be a "flash";
      }
      oWrapperStyles.display = "block"; //it's possible to get the computed height and width after the display is set;

      if (bAnimate) {
        iWidth = parseInt(JSLITE.util.getStyle(oWrapper, "width"), 10);
        iHeight = parseInt(JSLITE.util.getStyle(oWrapper, "height"), 10);
        oTooltipWrapper.setStyle("visibility", "hidden"); //move the text off-screen so it's not shown before the animation is complete;
        iTooltipWrapperWidth = JSLITE.util.getStyle(oTooltipWrapper.dom, "width"); //get the width of the text body before it's reset or else the text will wrap and it won't be want as expected;
        oWrapperStyles.height = 0; //resetting both the height and the width ensures the animation starts from 0 and only expands to the points in the go property in the motions;
        oWrapperStyles.width = 0;
      }
      oWrapperStyles.zIndex = JSLITE.counter(); //ensure the z-index will always be one more than the last;
      $(this.tooltip.identifier).className = "";

      if (bAnimate) {
        fnAnimate({
          elem: $(this.tooltip.wrapper),
          height: iHeight,
          width: iWidth,
          tooltipWrapper: oTooltipWrapper,
          tooltipWrapperWidth: iTooltipWrapperWidth
        });
      }
      e.preventDefault();
    });
  },

  fnBuildTooltip = function (oTooltip) {
    oTooltip.wrapper = JSLITE.tooltipClass + "-" + oTooltip.identifier; //reference the string id;
    oTipDiv = JSLITE.dom.create({tag: "div",
      attr: {
        id: oTooltip.wrapper,
        className: JSLITE.tooltipClass
      },
      children: [
        JSLITE.dom.create({tag: "p",
          attr: {
            id: oTooltip.wrapper + "-Header",
            className: JSLITE.tooltipClass + "Header",
            innerHTML: JSLITE.globalSymbol
          },
          children: [
            JSLITE.dom.create({tag: "a",
              attr: {
                href: "#",
                id: oTooltip.wrapper + "-Close",
                className: JSLITE.tooltipClass + "Close",
                innerHTML: "Close",
                onclick: function () {
                  $(oTooltip.wrapper).style.display = "none";
                  return false;
                }
              }
            })
          ]
        }),
        JSLITE.dom.create({tag: "div",
          attr: {
            id: oTooltip.wrapper + "-Wrapper",
            className: JSLITE.tooltipClass + "Wrapper"
          }
        })
      ],
      parent: document.body
    });
    JSLITE.dom.get("#" + oTooltip.wrapper + "-Wrapper").append($(oTooltip.identifier));
  };

  /********************************************
  ********************************************/
  /**
  * @function JSLITE.ux.Tooltip
  * @param {String/Array} vElems (Optional)
  * @return {None}
  * @describe <p>There are two different ways that tooltips can be initialized.</p>
<ul>
  <li>Singularly, i.e., <code><a href="#jsdoc">JSLITE.Element.tooltip</a></code>:
  </li>
  <li>Batch, i.e., <code>JSLITE.ux.Tooltip.init</code>:
  </li>
</ul>
<p>If invoking the tooltip method of a <code>JSLITE.Element</code> reference type, simply pass a string or any identifier that has a string value as the sole argument.  For example, <code>JSLITE.dom.get("theLink").tooltip("This is my tooltip.")</code> or <code>oForm.tooltip($("thePara").innerHTML)</code>.</p>
<p><code>JSLITE.ux.Tooltip</code> is a Singleton, and tooltips can be initialized three different ways.</p>
<ul>
  <li>Initialize all tooltips that have a class name prefaced by <code>JSLITE_Tooltip</code> at once by invoking <code>JSLITE.ux.Tooltip.init()</code> without any arguments.</li>
  <li>Initialize a single tooltip by passing in a string DOM element identifier, i.e., <code>JSLITE.ux.Tooltip.init("theLinkID")</code>.</li>
  <li>Initialize one or more tooltips by passing in an array of strings DOM element identifiers, i.e., <code>JSLITE.ux.Tooltip.init(["one", "theLinkID", "greeting"])</code>.</li>
</ul>
<p>You can mix the different initializations methods on the same page, i.e.:
  <pre>
    <code>JSLITE.ux.Tooltip.init();</code>
    <code>JSLITE.dom.get("myLinkID").tooltip(sTooltipVar);</code>
  </pre>
</p>
<p>When tooltips are initialized in batch mode, i.e., <code>JSLITE.ux.Tooltip.init()</code>, any element that is to be a tooltip MUST have a special class name that the method will recognize.  For instance, this element will be initialized as a tooltip:
<blockquote>&lt;a href="#" id="one" class="JSLITE_Tooltip_html[test]"&gt;</blockquote>
<p>The important parts of the class name are the following (in order):</p>
<ul>
  <li><code>JSLITE_Tooltip</code> - the class name MUST begin with this.</li>
  <li><code>_</code> - please note the separator is always an underscore.</li>
  <li><code>html</code> - this signals that the script should fetch a hidden DOM element.</li>
  <li><code>[test]</code> - this maps to the hidden DOM element's <code>id</code> attribute (please note the enclosing brackets).</li> 
</ul>
<p>Note that when initializing using <code>JSLITE.ux.Tooltip.init([element1, element2])</code> that the script expects to find a class name with a structure simliar to what's documented above on each element that is specified in the method signature. Conversely, when initialized with no arguments, the script will first get a collection of all links in the <code>document</code> and initialize any link as a tooltip that has a class name with a structure similar to what's documented above. If nothing is found it returns silently.</p>
<p>If interested, you can see the regular expression by clicking on the Source tab.</p>
<p><a href="http://jslite.benjamintoll.com/examples/" rel="external">See tooltip examples</a></p>
  */
  //<source>
  return {

    init: function (vElems, bAnimate) {

      var oTemp,
        vElems,
        re = /JSLITE_Tooltip_([a-z]+)\[([a-z0-9]+)\]/i;

      if (this.dom) {
        oTemp = JSLITE.dom.create({tag: "div",
          attr: {
            innerHTML: vElems
          },
          parent: document.body
        });
        this.dom.tooltip = {
          identifier: oTemp.dom.id
        };
        fnBuildTooltip(this.dom.tooltip);
        fnBindHandler(this.dom, bAnimate);

      } else {
        vElems = vElems || document.getElementsByTagName("a"); //if passed w/o any arguments search every link by it's class name;
        arr = typeof vElems === "string" ? [JSLITE.dom.getDom(vElems)] :
          !JSLITE.isArray(vElems) ? JSLITE.makeArray(vElems) : vElems; //check if it's an instance of Array or a DOM collection;

        arr.forEach(function (elem) {
          elem = JSLITE.dom.getDom(elem);
          if (elem.className) {
            elem.className.replace(re, function (a, $1, $2) {
              elem.tooltip = {
                type: $1, //html or script;
                identifier: $2 //the div or the js variable where the data is;
              };
            });
          }

          if (!elem.tooltip) {
            return;
          }
          fnBuildTooltip(elem.tooltip);

          /*
           * NOTE
           * remember to dereference dom elements b/c of ie's COM reference counting;
           */
           fnBindHandler(elem, bAnimate);
        });
      }
    }
  };
  //</source>

}());

JSLITE.ux.Overlay = function (vElem) {
  this.element = JSLITE.dom.get(vElem);
  this.overlay = JSLITE.dom.create({tag: "div",
    style: {
      background: "url(http://www.benjamintoll.com/jslite/images/loading.gif) 50% 50% no-repeat",
      backgroundColor: "#CCC",
      display: "none",
      height: vElem === document.body ? Math.max(document.documentElement.offsetHeight, document.body.scrollHeight, document.documentElement.clientHeight) + "px": this.element.getStyle("height"),
      opacity: 0.7,
      filter: "alpha(opacity=70)",
      position: "absolute",
      top: 0,
      left: 0,
      width: vElem === document.body ? Math.max(document.body.scrollWidth, document.documentElement.clientWidth) + "px" : this.element.getStyle("width")
    },
    parent: this.element.dom
  });
};

JSLITE.extend(JSLITE.ux.Overlay, JSLITE.Observer, {
  hide: function () {
    this.overlay.dom.style.display = "none";
  },
  show: function () {
    this.overlay.dom.style.display = "block";
  }
});

/*****************************************************************************************************************/
//begin grid stuff;
/*****************************************************************************************************************/
/**
* @function JSLITE.ux.GridView
* @param {Object}
* @return {None}
* @extends {<a href="#jsdoc">JSLITE.Observer</a>}
* @describe <p>A base class for UI widgets such as <code><a href="#jsdoc">JSLITE.ux.Grid</a></code> and <code><a href="#jsdoc">JSLITE.ux.Pager</a></code>. It defines grid-specific templates and methods for parsing single and multiple rows of data. Expects a <code><a href="#jsdoc">JSLITE.ux.Reader</a></code> to be defined as well as a data store.</p>
* @example
JSLITE.extend(JSLITE.ux.GridView, JSLITE.Observer, {
  ...
});
*/
//<source>
JSLITE.ux.GridView = function () {
};
JSLITE.extend(JSLITE.ux.GridView, JSLITE.Observer, {
  makeCompound: function () { //process multiple rows of data;
    var cm = this.cm,
      ts = this.templates,
      //aData = this.store.gridData, //GridView expects an array of arrays from the store as its data (the data store deals with the specifics of how the data is formatted and simply passes an array of arrays to be rendered here, it's not the GridView's job to read data or parse it but simply put it into the grid);
      aData = this.store.storage.items, //GridView expects an array of arrays from the store as its data (the data store deals with the specifics of how the data is formatted and simply passes an array of arrays to be rendered here, it's not the GridView's job to read data or parse it but simply put it into the grid);
      aRows = [],
      n,
      len,
      aCells,
      i,
      iLen;

    for (n = 0, len = aData.length; n < len; n++) {
      d = aData[n].data;
      aCells = [];

      for (i = 0, iLen = this.cm.getColumnCount(); i < iLen; i++) {
        var name = this.store.reader.recordType.prototype.fields;
        //var name = this.store.reader.fields;
        aCells.push(ts.gridCell.apply({ //each property maps to a {token} in the gridCell template;
          //id: cm.getColumnId(i) || "",
          className: cm.getColumnClassName(i) || JSLITE.globalSymbol + "_Grid_cell_" + i,
          value: cm.getColumnRenderer(i) || d[cm.getDataIndex(i)],
          style: cm.getColumnStyle(i) || ""
        })); //apply the cell template to each cell object and push onto the stack;
      }

      aRows.push(ts.gridRow.apply({ //each property maps to a {token} in the gridRow template;
        cells: aCells.join(""),
        id: JSLITE.globalSymbol + "_Grid_row_" + n,
        className: (function (that) {
          var sClass = "";
          if (that.stripe) {
            sClass = n % 2 !== 0 ? JSLITE.globalSymbol + "_Grid_row_alt" : "";
          }
          return sClass;
        }(this)), 
        style: "width: " + this.cm.getTotalWidth() + "px;"
      })); //apply the row template to each collection of cells and push onto the stack;
    }
    return aRows.join("");
  },
  makeSimple: function (sTemplate) { //process only a single row of data, i.e., for the header;
    var cm = this.cm,
      aRows = [],
      i,
      len;

    for (i = 0, len = this.cm.getColumnCount(); i < len; i++) {
      aRows.push(this.templates[sTemplate].apply({ //each property maps to a {token} in the gridRow template;
        id: cm.getColumnId(i) || "",
        className: cm.getColumnClassName(i) || JSLITE.globalSymbol + "_Header_cell_" + i,
        value: cm.getColumnRenderer(i) || cm.getColumnHeader(i) || "",
        style: cm.getColumnStyle(i) || ""
      }));
    }
    return aRows.join("");
  },
  makeTemplates: function () {
    this.templates = {
      container: new JSLITE.Template("<div class='" + JSLITE.globalSymbol + "_Grid_container' style='{containerStyle}'><div id='" + this.id + "'><div class='" + JSLITE.globalSymbol + "_Grid_header'>{header}</div><div class='" + JSLITE.globalSymbol + "_Grid_scroller' style='{scrollerStyle}'><div class='" + JSLITE.globalSymbol + "_Grid_body'>{body}</div><a href=''></a></div></div></div>"),
      header: new JSLITE.Template("<table style='{style}'><thead><tr>{cells}</tr></thead></table>"),
      headerCell: new JSLITE.Template("<th class='" + JSLITE.globalSymbol + "_Header_cell {className}' id='{id}' style='{style}'><div style='{istyle}'>{value}</div></th>"),
      body: new JSLITE.Template("{rows}"),
      gridRow: new JSLITE.Template("<div id='{id}' class='" + JSLITE.globalSymbol + "_Grid_row {className}' style='{style}'><table><tbody><tr>{cells}</tr></tbody></table></div>"),
      gridCell: new JSLITE.Template("<td id='{id}' class='" + JSLITE.globalSymbol + "_Grid_cell {className}' style='{style}'><div style='{istyle}'>{value}</div></td>")
    };
  }
});
//</source>

/**
* @function JSLITE.ux.Grid
* @param {Object} options
* @return {None}
* @extends {<a href="#jsdoc">JSLITE.ux.GridView</a>}
* @events {afterrender, beforerender, headerclick, remove, rowclick}
* @describe <p>Standard grid UI widget that can also have a <code><a href="#jsdoc">JSLITE.ux.Pager</a></code> bound to it. The grid can have its data served either locally (<code><a href="#jsdoc">JSLITE.ux.LocalStore</a></code>) or remotely (<code><a href="#jsdoc">JSLITE.ux.RemoteStore</a></code>). The grid depends upon one of these data stores and a <code><a href="#jsdoc">JSLITE.ux.ColumnModel</a></code> as pluggable objects in order to render properly. Note the events that can be subscribed to.</p><p>Please refer to the grid example on the examples page and view the source.</p><p>The following properties are exposed to the developer:</p>
<ul>
  <li><code>id</code></li>
  <li><code>height</code></li>
  <li><code>width</code></li>
  <li><code>stripe</code> - zebra stripes the rows (default is not to stripe)</li>
  <li><code>pager</code></li>
</ul>
<p>Note that when a successful response returns from the server after an XHR for data, it's bound to the store in a <code>gridData</code> property that is checked in <code>init()</code> to determine whether or not to bound a handler to <code>gridload</code>. The reason it's called differently than <code>data</code> is because the pager needs access to the <code>total</code> property in order to properly display its paging information. Local stores, on the other hand, know that their data is already bound to the store by checking its <code>data</code> property in <code>render()</code>. Hopefully, this clarifies any potential confusion over the apparent discrepancy in the naming convention.</p>
<p><a href="http://jslite.benjamintoll.com/examples/grid.php" rel="external">See an example grid (beta)</a></p>
* @example
var grid = new JSLITE.ux.Grid({
  id: "theGrid",
  height: 250,
  width: 800,
  cm: cm,
  store: ds,
  stripe: true, //not striped by default;
  pager: new JSLITE.ux.Pager({
    page: 10,
    start: 0,
    store: ds//,
    //location: "top" //as an alternative, place the Pager above the header row;
  })
});
grid.render(document.body); 
*/
//<source>
JSLITE.ux.Grid = function (o) {
  this.id = o.id || JSLITE.dom.id();
  this.store = o.store;
  this.cm = o.cm;
  this.height = o.height;
  this.width = o.width;
  this.stripe = o.stripe || false;
  this.checkbox = o.checkbox;
  this.pager = o.pager;
  this.subscriberEvents([
    "afterrender",
    "beforerender",
    "headerclick",
    "remove",
    "rowclick"
  ]);
  this.init(); //bind the gridload handler and have the store fetch its data if it's an autoload grid;
};

JSLITE.extend(JSLITE.ux.Grid, JSLITE.ux.GridView, {
  add: function (v) {
    this.store.add(v);
    return this.store;
  },
  addRow: function (v) {
    this.store.addRow(v);
  },
  indexRows: function () {
    var oRows = JSLITE.dom.gets("." + JSLITE.globalSymbol + "_Grid_row", $(this.id), true);
    for (var i = 0, len = oRows.length; i < len; i++) {
      oRows[i].rowIndex = i
    }
  },
  init: function () {

    var fnBuildGrid = function () {
      this.makeTemplates();
      this.html = this.templates.container.apply({
        containerStyle: "width: " + this.width + "px;",
        scrollerStyle: "height: " + this.height + "px; width: " + this.width + "px",
        header: this.templates.header.apply({
          cells: this.makeHeader(),
          style: "width: " + this.cm.getTotalWidth() + "px;"
        }),
        body: this.templates.body.apply({rows: this.makeBody()})
      });
    };

    if (!this.store.gridData) { //if the grid data hasn't been loaded yet, i.e., it's a remote store, then bind a handler that listens for the store's "gridload" event;
      this.store.subscribe("gridload", function () { //listen for when the datastore calls its gridload method;
        //NOTE that before a grid is first rendered initialized will be undefined, but afterwards when a page is changed by the pager it will be true and it's then that we don't want to parse the templates again;
        if (!arguments.callee.initialized) { //only parse the templates once;
          fnBuildGrid.call(this);
          arguments.callee.initialized = true;
        } else {
          JSLITE.dom.get("#" + this.id + " ." + JSLITE.globalSymbol + "_Grid_body", true).innerHTML = this.makeBody(); //if the grid has already been rendered then only replace the rows on page changes;
          this.indexRows(); //re-index the rows;
        }
      }.bind(this));
    } else { //else construct the grid right away b/c the grid data is already available in the store, i.e., it's a local store and has it's autoload set to false and is depending on either fetch() or loadData() to render the grid;
      fnBuildGrid.call(this);
    }
    if (this.store.autoload) { //by default the datastore autoloads (fetches) the data but it's possible to not do this and fetch the data via the fetch() method;
      this.store.fetch(); //this call will get the data for asynchronous calls (for remote stores) but will not work for local stores, which are synchronous and fast since they're local and the timing is off;
    }
  },
  bindEvents: function (aChildren) {
    var fnFireEvent = function (o) {
      var oTarget = JSLITE.dom.get(o.event.target),
        oParentCell = oTarget.closest(o.parentCell),
        re = /.*_(\d+)$/;

      if (oParentCell) {
        o.scope.fire(o.type, {
          target: oTarget,
          selection: {
            value: oTarget.value(),
            cellIndex: parseInt(oParentCell.dom.className.replace(re, "$1"), 10),
            rowIndex: o.type === "headerclick" ? 0 : parseInt(oTarget.closest("div").dom.id.replace(re, "$1"), 10)//,
            //cell: oParentCell,
            //row: oTarget.closest("div")
          },
          originalEvent: o.event
        });
      }
    };

/*
    JSLITE.dom.fly(JSLITE.globalSymbol + "_Grid_body").on("dblclick", function (e) { //bind the click listener to the grid body (only once b/c when the pages are changed only the innerHTML of the body changes);
      JSLITE.dom.create({tag: "input",
        attr: {
          innerHTML: e.target.innerHTML,
          type: "text"
        },
        parent: e.target
      });
      fnFireEvent({
        scope: this,
        event: e,
        parentCell: "td",
        type: "rowdblclick"
      });
    }.bind(this));
*/

    JSLITE.dom.get("#" + this.id + " ." + JSLITE.globalSymbol + "_Grid_body").on("click", function (e) { //bind the click listener to the grid body (only once b/c when the pages are changed only the innerHTML of the body changes);
      fnFireEvent({
        scope: this,
        event: e,
        parentCell: "td",
        type: "rowclick"
      });
      //e.stopPropagation(); //this will kill the event from bubbling up anywhere else (like for the checkbox);
    }.bind(this));

    JSLITE.dom.get("#" + this.id + " ." + JSLITE.globalSymbol + "_Grid_header").on("click", function (e) {
      fnFireEvent({
        scope: this,
        event: e,
        parentCell: "th",
        type: "headerclick"
      });
      e.stopPropagation();
    }.bind(this));
  },
  makeBody: function () {
    return this.makeCompound();
  },
  makeHeader: function () {
    return this.makeSimple("headerCell");
  },
  remove: function () {
    if (this.fire("remove") !== false) { //this action can be prevented in an event handler that's subscribed to the grid;
      JSLITE.dom.get(this.id).parent().remove();
    }
  },
  render: function (elem) {
    var that = this; //store the scope b/c unsubscribe won't work properly when a dynamic scope is bound to the listener, i.e., this.store.subscribe("gridload", fn.bind(this)) (won't be unsubscribed);

    //NOTE this will only be invoked once upon initial grid rendering!;
    var doRender = function () {
      JSLITE.dom.insertHtml("beforeEnd", elem, this.html);
      this.indexRows();
      this.bindEvents();
      if (this.pager) {
        this.pager.init(this); //pass along the grid;
      }
      if (this.checkbox) {
        this.checkbox.init(this); //pass along the grid;
      }
      this.fire("afterrender");
    };

    if (this.fire("beforerender") !== false) {
      if (this.store.localStore) { //since the data is local, render the grid immediately instead of listening for an event;
        if (!this.store.data) {
          throw new Error("No data has been fetched!");
        }
        if (!this.html) {
          throw new Error("You've invoked render() before you've fetched your data!");
        }
        doRender.call(this);
      } else {
        var fn = function () {
          doRender.call(that);
          that.store.overlay = that.overlay = new JSLITE.ux.Overlay(that.id);
          that.store.unsubscribe("gridload", fn); //make sure to remove this handler or it will be called every time a page is changed in the pager;
        };
        this.store.subscribe("gridload", fn);
      }
    }
  }
});
//</source>

/**
* @function JSLITE.ux.Store
* @param {Object} options
* @return {None}
* @extends {<a href="#jsdoc">JSLITE.Observer</a>}
* @describe <p>Base class for all stores.</p><p>A store will fetch data right away when it's instantiated unless it's <code>autoload</code> property is set to <code>false</code> (it's <code>true</code> by default). If not fetched right away, the data can be loaded at any point afterwards by calling it's <code>load</code> method.</p><p>The methods that create the templates that construct the grid in <code>JSLITE.ux.Grid.init()</code> listen for the <code>gridload</code> event which is fired when the store loads its data unless the data is already within the store in which case the grid is constructed immediately.</p><p>Different scenarios for loading the data into the store so it's available for the grid to render it:</p>
<ul>
  <li>The <code><a href="#jsdoc">JSLITE.ux.RemoteStore</a></code> is configured with a proxy that immediately sends an HTTP request (via XHR) for data and then fires its <code>gridload</code> event when the response has been successfully received. The grid is instantiated (built) before the data returns so it must listen for this event to know when to render the grid.</li>
  <li>The same scenario as the previous one except for the fact that <code><a href="#jsdoc">JSLITE.ux.RemoteStore</a></code> does not immediately make its request for data (via XHR) (because <code>autoload</code> is set to <code>false</code> in the constructor) but waits until <code>fetch()</code> is called. The grid constructs as before because it's listening for the store's <code>gridload</code> to be fired when the data arrives from the remote source.</li>
  <li>The <code><a href="#jsdoc">JSLITE.ux.LocalStore</a></code> is configured with its <code>autoload</code> property set to <code>false</code> and its <code>data</code> property referencing a local cache of data. At some point (but before <code>JSLITE.ux.Grid.render()</code> is called), <code>fetch()</code> is called and the grid sees that the store already has its data and constructs itself. The <code>gridload</code> event handler is not bound and the grid is constructed immediately as the grid sees the store already has its data (it checks <code>this.store.gridData</code>).</li>
  <li>The same scenario as the previous one except for the fact that <code><a href="#jsdoc">JSLITE.ux.LocalStore</a></code> does not refer to a local data cache. The data is loaded at some point (but again before <code>JSLITE.ux.Grid.render()</code> is called) by calling <code>loadData</code> with the local data cache as the sole parameter.</li>
</ul>
<p>To sum up, a remote store always needs to fetch its data from a remote source (hence it's name) and therefore must listen for the <code>gridload</code> event from the store; in contrast, the local store receives its data immediately since it's local in the browser and binds this data to the store in its <code>data</code> property.</p>
*/
//<source>
JSLITE.ux.Store = function () {
  this.storage = new JSLITE.ux.Storage(function (o) {
    return o.id;
  });
  this.fields = this.reader.recordType.prototype.fields;
};

JSLITE.extend(JSLITE.ux.Store, JSLITE.Observer, {
  autoload: true,
  add: function (v) {
    this.storage.addAll(v);
  },
  clear: function () {
    this.storage.clear();
  },
  load: function () {

    if (this.fire("afterload") !== false) {
      switch (this.type) {
        case "json":
          //this.gridData = this.reader.parseJson(this.data);
          this.clear();
          this.add(this.reader.parseJson(this.data));
          break;
        case "xml":
          //this.gridData = this.reader.parseXML(this.data);
          this.add(this.reader.parseXML(this.data));
          break;
      }
      this.fire("gridload");
    }
  
    if (this.overlay) {
      this.overlay.hide();
    }

  },
  loadData: function (oData) {
    this.data = oData;
    this.load();
  }
});
//</source>

/**
* @function JSLITE.ux.LocalStore
* @param {Object} options
* @return {None}
* @extends {<a href="#jsdoc">JSLITE.ux.Store</a>}
* @events {afterload, beforeload, gridload, remove}
* @describe <p>Encapsulates a client-side cache consisting of local data and a <code><a href="#jsdoc">JSLITE.ux.Reader</a></code> object. The store currently only supports json and xml but will soon also support data arrays. A data type such as <code>json</code> must be specified in the <code>options</code> object or an exception will be thrown.</p><p>Note the events that can be subscribed to.</p><p>Currently, there is no support for pagers when the data is being served locally.</p><p>The store has no knowledge of the format of the local data. It's dependent upon the <code><a href="#jsdoc">JSLITE.ux.Reader</a></code> to parse the data and return an array of arrays that is cached by the store and rendered by the <code><a href="#jsdoc">JSLITE.ux.GridView</a></code>.</p>
* @example
var ds = new JSLITE.ux.LocalStore({
  data: oJson,
  reader: reader
});  
*/
//<source>
JSLITE.ux.LocalStore = function (o) {
  if (!o.type || [" json ", " xml ", " array "].join("").indexOf(" " + o.type + " ") === -1) {
    throw new Error("You must specify a valid data type to fetch!");
  }

  this.type = o.type;
  this.autoload = o.autoload === false ? false : true;
  this.data = o.data || null;
  this.reader = o.reader;
  this.data = o.data;
  this.data.total = o.data.rows.length;
  this.params = {
    limit: o.limit || 25
  };
  this.localStore = true; //set this so JSLITE.ux.Grid.render() renders the grid immediately;

  this.subscriberEvents([
    "afterload",
    "beforeload",
    "gridload",
    "remove"
  ]);

  JSLITE.ux.LocalStore.superclass.constructor.call(this);
};

JSLITE.extend(JSLITE.ux.LocalStore, JSLITE.ux.Store, {
  fetch: function (vPage) { //fetch essentially just calls load; i kept it as such b/c i want all data stores to have the same interface;
    this.fire("beforeload");
    this.load(); //since there is no asynchronous call, the load method is called before the render method is fired in JSLITE.ux.Grid.init();
  }
});
//</source>

/**
* @function JSLITE.ux.RemoteStore
* @param {Object} options
* @return {None}
* @extends {<a href="#jsdoc">JSLITE.ux.Store</a>}
* @events {afterload, beforeload, gridload, remove}
* @describe <p>Encapsulates a server-side cache consisting of remote data and a <code><a href="#jsdoc">JSLITE.ux.Reader</a></code> object. Uses the <code>XMLHttpRequest</code> object internally to fetch data from another resource. Note because of cross-domain security issues that a proxy must be used to fetch data from another domain.</p><p>When using this object to fetch your data remotely, the <code>url</code> from which to fetch the data as well as a <code>params</code> object that specifies the <code>start</code> and <code>limit</code> querystring parameters must be set in the <code>options</code> object. It goes without saying that a database that allows for a LIMIT clause or something of the sort must be in place and have these <code>params</code> properties passed to it in the XHR. To see how this works, an <code>options</code> object that would contain the following properties (the object is snipped for brevity and clarity):</p>
<blockquote>
<pre>
<code>
url: "../../lib/php/word_search.php?phrase=gli",
params: {
  start: 125,
  limit: 25
},
</code>
</pre>
</blockquote>
<p>would construct the following querysting to fetch the data from the specified resource:</p>
<blockquote>
<code>
../../lib/php/word_search.php?phrase=gli&start=125&limit=25
</code>
</blockquote>
<p>The store currently only supports json and xml but will soon also support data arrays. A data type such as <code>json</code> must be specified in the <code>options</code> object or an exception will be thrown. Note the events that can be subscribed to.</p><p>The store has no knowledge of the format of the data returned by the proxy. It's dependent upon the <code><a href="#jsdoc">JSLITE.ux.Reader</a></code> to parse the data and return an array of arrays that is cached by the store and rendered by the <code><a href="#jsdoc">JSLITE.ux.GridView</a></code>.</p>
* @example
var ds = new JSLITE.ux.RemoteStore({
  type: "json",
  url: "../../lib/php/word_search.php?phrase=gli",
  params: {
    start: 0,
    limit: 25 
  },
  reader: reader
});  
*/
//<source>
JSLITE.ux.RemoteStore = function (o) {
  if (!o.type || [" json ", " xml ", " array "].join("").indexOf(" " + o.type + " ") === -1) {
    throw new Error("You must specify a valid data type to fetch!");
  }

  this.type = o.type;
  this.autoload = o.autoload === false ? false : true;
  this.url = o.url;
  this.params = o.params;
  this.reader = o.reader;

  this.subscriberEvents([
    "afterload",
    "beforeload",
    "gridload",
    "remove"
  ]);

  JSLITE.ux.RemoteStore.superclass.constructor.call(this);
};

JSLITE.extend(JSLITE.ux.RemoteStore, JSLITE.ux.Store, {
  fetch: function (vPage) {
    var qs = "",
      iStart;

    if (this.params) {
      iStart = vPage && typeof vPage === "string" ?
        this.params.limit * (Number(vPage) - 1) :
          this.params.start;

      qs = (this.url.indexOf("?") > -1 ? "&" : "?") + "start=" + iStart + "&limit=" + this.params.limit //if this.url doesn't contain a "?" then we know that there are currently no attached parameters;
    }

    if (this.fire("beforeload") !== false) {
      JSLITE.ajax.load({
        url: this.url + qs,
        data: this.type,
        success: function (o) {
          this.data = o;
          this.load();
        }.bind(this),
        error: function (o) {
        }
      });
    }
  }
});
//</source>

/**
* @function JSLITE.ux.ColumnModel
* @param {Object} options
* @return {None}
* @extends {<a href="#jsdoc">JSLITE.Observer</a>}
* @describe <p>This object simply exists to provide metadata to the <code><a href="#jsdoc">JSLITE.ux.Grid</a></code> to tell it how to construct the grid header's column names and column widths. The <code><a href="#jsdoc">JSLITE.ux.GridView</a></code> type is dependent upon this type in that it makes heavy use of its methods, while the <code><a href="#jsdoc">JSLITE.ux.Reader</a></code> type must work with this type to properly have the data displayed in the grid.</p><p>For example, if the following is the column model:</p>
<blockquote>
<pre>
<code>
var cm = new JSLITE.ux.ColumnModel([
  { header: "Italian", width: 175 },
  { header: "Pronunciaton", width: 150 },
  { header: "Grammar", width: 100 },
  { header: "Translation", width: 375 }
]);
</code>
</pre>
</blockquote>
<p>then the reader type would be defined like the following to map to the column model:</p>

<blockquote>
<pre>
<code>
var oReader = new JSLITE.ux.Reader({
  root: "rows",
  fields: [
    { name: "grammar" },
    { name: "italian" },
    { name: "pronunciation" },
    { name: "translation" }
  ]
});
</code>
</pre>
</blockquote>
<p>An exception won't be thrown if the two types aren't properly mapped, but it will be visually apparent that something is wrong.</p>
<p>Note that if a <code>width</code> isn't provided for each column in the column model it will default to 100.</p>
<p>An instance of the column model must be plugged into the <code><a href="#jsdoc">JSLITE.ux.Grid</a></code>. Please see its documentation and example for details.</p>
* @example
var oColumnModel = new JSLITE.ux.ColumnModel({
  { header: "Italian", width: 200 },
  { header: "Pronunciation", width: 100 },
  { header: "Grammar", width: 150 },
  { header: "Translation", width: 200 }
});
*/
//<source>
JSLITE.ux.ColumnModel = function (a) {
  this.columns = a;
  this.defaultWidth = 100; //default column width;
  this.subscriberEvents("clickcolumnheader");
};
JSLITE.extend(JSLITE.ux.ColumnModel, JSLITE.Observer, {
  getColumns: function () {
    return this.columns;
  },
  getColumnClassName: function (i) {
    return this.columns[i].className;
  },
  getColumnCount: function () {
    return this.columns.length;
  },
  getColumnHeader: function (i) {
    return this.columns[i].header;
  },
  getColumnId: function (i) {
    return this.columns[i].id;
  },
  getColumnRenderer: function (i) {
    return this.columns[i].renderer;
  },
  getColumnStyle: function (i) {
    var sStyle = "width: " + this.getColumnWidth(i) + "px";
    return sStyle;
  },
  getColumnWidth: function (i) {
    return this.columns[i].width || this.defaultWidth;
  },
  getDataIndex: function (i) {
    return this.columns[i].dataIndex || ""
  },
  getTotalWidth: function () {
    if (!this.totalWidth) {
      this.totalWidth = 0;
      for (var i = 0, len = this.getColumnCount(); i < len; i++) {
        this.totalWidth += this.getColumnWidth(i);
      }
    }
    return this.totalWidth;
  }
});
//</source>

/**
* @function JSLITE.ux.Reader
* @param {Object} options
* @return {None}
* @describe <p>This parses the data that is provided to it by the store and returns an array of arrays that can be consumed by the <code><a href="#jsdoc">JSLITE.ux.GridView</a></code>.</p><p>The reader is completely dependent upon the <code>type</code> of data that is set within the store constructor to know how to parse it.</p><p>Supports both Json and XML; however, there is no XPath support at this time so only simple XML is supported. For example, documents such as the following will have no problem being parsed by the reader:</p>
<blockquote>
<pre>
<code>
&#60;jazz&#62;
  &#60;artist&#62;
    &#60;lastname&#62;Montgomery&#60;/name&#62;
    &#60;firstname&#62;Wes&#60;/name&#62;
    &#60;instrument&#62;guitar&#60;/instrument&#62;
  &#60;/artist&#62;

  &#60;artist&#62;
    &#60;lastname&#62;Evans&#60;/name&#62;
    &#60;firstname&#62;Bill&#60;/name&#62;
    &#60;instrument&#62;piano&#60;/instrument&#62;
  &#60;/artist&#62;

  &#60;artist&#62;
    &#60;lastname&#62;Coltrane&#60;/name&#62;
    &#60;firstname&#62;John&#60;/name&#62;
    &#60;instrument&#62;saxophone&#60;/instrument&#62;
  &#60;/artist&#62;
&#60;/jazz&#62;
</pre>
</code>
</blockquote>
* @example
var oReader = new JSLITE.ux.Reader({
  root: "rows",
  fields: [
    { name: "grammar" },
    { name: "italian" },
    { name: "pronunciation" },
    { name: "translation" }
  ]
});
*/
//<source>
JSLITE.ux.Record = function (oData, id) {
  this.data = oData;
  this.id = JSLITE.ux.Record.counter();
};
JSLITE.ux.Record.counter = (function () {
  var i = 1000;
  return function () {
    return i++;
  };
}());
JSLITE.ux.Record.create = function (o) {
  var F = JSLITE.extend(JSLITE.ux.Record, {}), //NOTE it's very important that F.prototype does not === JSLITE.ux.Record.prototype!; remember, this is a factory making distinct constructors that shouldn't share JSLITE.ux.Record.prototype, so instead JSLITE.extend creates a proxy prototype object that is totally distinct from JSLITE.ux.Record.prototype and the fields from each Reader are added to that;
    p = F.prototype;

  p.fields = new JSLITE.ux.Storage(function (o) {
    return o.name;
  });
  for (var i = 0, len = o.fields.length; i < len; i++) {
    p.fields.add(o.fields[i]);
  }
  return F;
};
JSLITE.ux.Reader = function (o) {
  this.root = o.root;
  this.recordType = JSLITE.ux.Record.create(o);
};

JSLITE.apply(JSLITE.ux.Reader.prototype, {
  parseJson: function (oJson) {
    var arr = [],
      aData = oJson[this.root],
      oFields = this.recordType.prototype.fields,
      aRecords = [],
      oData,
      o,
      sField;

    //map the raw data using the fields in the reader object; this.data will then be used by the GridView to populate the row data;
    for (var i = 0, len = aData.length; i < len; i++) {
      oData = aData[i];
      o = {};

      for (var j = 0, jlen = oFields.items.length; j < jlen; j++) {
        sField = oFields.items[j].name;
        o[sField] = oData[sField];
      }
      aRecords.push(new this.recordType(o));
    }
    return aRecords;
  },
  parseXML: function (oXML) {
    var arr = [],
      aData = oXML.getElementsByTagName(this.root),
      oFields = this.recordType.prototype.fields,
      o,
      aRecords = [];

    for (var i = 0, len = aData.length; i < len; i++) {
      o = {};
      for (var j = 0, jlen = oFields.items.length; j < jlen; j++) {
        o[oFields.items[j].name] = aData[i].getElementsByTagName(oFields.items[j].name)[0].firstChild.nodeValue;
      }
      aRecords.push(new this.recordType(o));
    }
    return aRecords;
/*
    return JSLITE.makeArray(aData).map(function (v) { //map the raw data using the fields in the reader object; this.data will then be used by the GridView to populate the row data;
      var a = [],
        aFields = this.recordType.prototype.fields;

      for (var i = 0, len = aFields.items.length; i < len; i++) {
        a.push(v.getElementsByTagName([aFields.items[i].name])[0].firstChild.nodeValue);
      }
      return a;
    }, this); //pass in the reader as the value of "this" for map's scope;
*/
  }
});
//</source>

/**
* @function JSLITE.ux.Pager
* @param {Object} options
* @return {None}
* @extends {<a href="#jsdoc">JSLITE.Observer</a>}
* @events {pagechange, pagerclick}
* @describe <p>This type can be plugged into a <code><a href="#jsdoc">JSLITE.ux.Grid</a></code>. It shares the data store with the grid, so it must be aware of the data store by having it passed in its constructor. By default the pager will appear at the bottom of the grid, although this can be changed by passing <code>location: "bottom"</code> in the <code>options</code> config object.</p><p>A pager signals to the remote store to fetch more data from its source as it's paged through.</p><p>If the pager isn't defined outside of the grid then any pager events must be subscribed to through the grid as its owner object. For example,</p>
<blockquote>
<pre>
<code>
var grid = new JSLITE.ux.Grid({
  height: 350,
  width: 490,
  cm: cm,
  store: ds,
  stripe: true,
  pager: new JSLITE.ux.Pager({
    store: ds,
    template: new JSLITE.Template("<strong>{total}</strong> / {pageStart} - {pageEnd}")
  })
});

grid.pager.subscribe("pagechange", function (e) {
  console.log("the current page is " + e.currentPage);
});
</code>
</pre>
</blockquote>
<p>Note in the above code that a pager can provide a <code><a href="#jsdoc">JSLITE.Template</a></code> object to define how the pager will display its page data. The tokens <code>pageStart</code>, <code>pageEnd</code> and <code>total</code> are preset and must be used. If a custom template isn't provided at construction a default one will be used.</p>
<p>At this time, only the <code><a href="#jsdoc">JSLITE.ux.RemoteStore</a></code> supports pagers. Note the events that can be subscribed to.</p>
* @example
*/
//<source>
JSLITE.ux.Pager = function (o) {
  this.start = o.start;
  this.store = o.store;
  this.location = o.location || "bottom";
  this.template = o.template || new JSLITE.Template("{pageStart} - {pageEnd} of {total}"); //provide a default template if one isn't provided;
  this.subscriberEvents([
    "pagechange",
    "pagerclick"
  ]);
};
JSLITE.extend(JSLITE.ux.Pager, JSLITE.Observer, {
  init: function (oGrid) {
    var that = this,
      sInsertHtml = "beforeEnd",
      sElem,
      arr = [],
      iPages = this.totalPages = Math.ceil(this.store.data.total / this.store.params.limit),
      i,
      sTemplate;

    this.grid = oGrid; //bind the grid to the pager (necessary?);

    //all this does is simply change the pager view control, i.e. "297 / 1 - 25";
    this.subscribe("pagechange", function (e) {
      var sPage = e.currentPage,
        sElem = "#" + oGrid.id,
        iLimit = this.store.params.limit,
        iPageStart = ((sPage - 1) * iLimit + 1),
        iTotal = this.store.data.total;

      //by listening to the store's afterload event the pager's page info changes will be in sync (this is an internal function b/c the value of sPage isn't known until the page is actually changed);
      this.store.subscribe("afterload", function (e) {
        JSLITE.dom.get(sElem + " ." + JSLITE.globalSymbol + "_Pager_records", true).innerHTML = this.totalPages == sPage ? //type coercion;
          this.template.apply({pageStart: iPageStart, pageEnd: iTotal, total: iTotal}) :
            this.template.apply({pageStart: iPageStart, pageEnd: iLimit * sPage, total: iTotal});

      }.bind(this));
    }.bind(this));

    if (this.location !== "bottom") {
      sInsertHtml = "beforeBegin";
      sElem = "#" + oGrid.id + " ." + JSLITE.globalSymbol + "_Grid_header";
    } else {
      sElem = "#" + oGrid.id;
    }

    //pass the pager to the html parser;
    sTemplate = iPages === 1 ?
      new JSLITE.Template("{pageStart} - {pageEnd}").apply({pageStart: 1, pageEnd: this.store.data.total}) : //if there's only one page apply a dynamically-built, one-off template;
        this.template.apply({pageStart: 1, pageEnd: this.store.params.limit, total: this.store.data.total});

    JSLITE.dom.insertHtml(sInsertHtml, JSLITE.dom.get(sElem, true), "<div class='" + JSLITE.globalSymbol + "_Pager_row clearfix'><table class='first_Pager_table'><tbody><tr><td>Page&nbsp;<select class='" + JSLITE.globalSymbol + "_Pager_select'></select>&nbsp;of " + iPages + "</td></tr></tbody></table><table><tbody><tr><td><span class='" + JSLITE.globalSymbol + "_Pager_records'>" + sTemplate + "</span></td></tr></tbody></table></div>"); //NOTE the template is being applied;

    for (i = 1; i <= iPages; i++) {
      arr.push(JSLITE.dom.create({tag: "option",
        attr: {
          innerHTML: i,
          value: i //note ie6 has to have a value attr explicitly declared or 'this.value' will be undefined;
        }
      }));
    }

    //append the option controls to the list and bind the handlers;
    JSLITE.dom.get("#" + oGrid.id + " ." + JSLITE.globalSymbol + "_Pager_select").append(arr).on("change", function (e) {
      var sValue = this.value;
      that.store.overlay.show();
      that.store.fetch(sValue); //initiate the request for the new page data;
      that.fire("pagechange", { //let the pager control know how to update its view;
        currentPage: sValue
      });
    });

    JSLITE.dom.get("#" + oGrid.id + " ." + JSLITE.globalSymbol + "_Pager_row").on("click", function (e) {
      var oTarget = JSLITE.dom.get(e.target);

      this.fire("pagerclick", {
        target: oTarget,
        originalEvent: e
      });
      e.stopPropagation();
    }.bind(this));
  }
});
//</source>

/**
* @function JSLITE.ux.Checkbox
* @param {Object} o An optional params object
* @return {None}
* @extends {<a href="#jsdoc">JSLITE.Observer</a>}
* @events {additem, removeitem, selectall, selectone}
* @describe
* @example
*/
//<source>
JSLITE.ux.Checkbox = function (o) {
  o = o || {}; //a params object is optional;
  //classname: o.class || JSLITE.globalSymbol + "_Checkbox";

  this.selections = new JSLITE.ux.Storage(function (o) {
    return o.id;
  });

  this.subscriberEvents([
    "additem",
    "removeitem",
    "selectall",
    "selectone"
  ]);
};
JSLITE.extend(JSLITE.ux.Checkbox, JSLITE.Observer, {
  getSelections: function () {
    return this;
  },
  init: function (oGrid) {
    var that = this;
    this.grid = oGrid;

    //bind the listener that will toggle all the row checkboxes when the 'select all' checkbox in the header is checked;
    //JSLITE.dom.get("input", $(JSLITE.globalSymbol + "_Header_checkbox")).on("click", function (e) {
    JSLITE.dom.get("input", $(this.grid.id)).on("click", function (e) {
      var iTotalRows;

      if (that.fire("selectall") !== false) { 
        JSLITE.dom.gets("." + that.className + " input", $(that.grid.id), true).forEach(function (v) {
          v.checked = this.checked;
        }, this);

        that.selections.clear(); //NOTE that when changing pages this will be cleared also when select all is checked, this should be revisited (in other words, if i want to retain selections from multiple pages this needs to be revisited);

        if (this.checked) {
          iTotalRows = JSLITE.dom.gets("." + JSLITE.globalSymbol + "_Grid_row", $(that.grid.id), true).length;
          while (iTotalRows--) {
            oSelection = that.grid.store.storage.getItem(iTotalRows);
            that.selections.add(oSelection);
          }
        }
        //console.log("all", that.selections.getAll().length);
        //console.log("data", that.selections.getAll());
      }
    });

    //subscribe to the data store to uncheck the header's checkbox if it had been checked on the previous page;
    this.grid.store.subscribe("afterload", function (e) {
      JSLITE.dom.get("input", $(this.grid.id), true).checked = false;
    }.bind(this));

    //event delegation on the grid itself for capturing when a row is selected/deselected;
    JSLITE.dom.fly(this.grid.id).on("click", function (e) {
      var target = e.target,
        index,
        oSelection;

      if (target.nodeName === "INPUT" && target.type === "checkbox") {
        index = JSLITE.dom.find(target, "." + JSLITE.globalSymbol + "_Grid_row").rowIndex;
        oSelection = that.grid.store.storage.getItem(index);
        if (target.checked) {
          if (that.fire("additem", { item: oSelection }) !== false) {
            that.selections.add(oSelection);
          }
        } else {
          if (that.fire("removeitem", { item: oSelection }) !== false) {
            that.selections.remove(oSelection);
          }
        }
      }
    });
  },

  className: JSLITE.globalSymbol + "_checkbox",
  //id: JSLITE.globalSymbol + "_checkbox_" + JSLITE.counter(),
  renderer: "<input style='margin: 0;' type='checkbox' />",
  width: 20
});
//</source>

/**
* @function JSLITE.ux.Storage
* @param {Function} keyFn A function that tells the object how to retrieve the stored information
* @return {None}
* @extends {<a href="#jsdoc">JSLITE.Observer</a>}
* @describe
* @example
*/
//<source>
JSLITE.ux.Storage = function (keyFn) {
  this.items = [];
  this.map = {};
  this.keys = [];
  this.getKey = keyFn || function (o) { return o.id; };
};
JSLITE.apply(JSLITE.ux.Storage.prototype, {
  add: function (o) {
    var sKey = this.getKey(o);
    if (sKey) {
      this.items.push(o);
      this.map[sKey] = o;
      this.keys.push(sKey);
    }
  },
  addAll: function (v) {
    if (JSLITE.isArray(v)) {
      for (var i = 0, len = v.length; i < len; i++) {
        this.add(v[i]);
      }
    } else if (typeof v === "object") {
      this.add(v);
    }
  },
  clear: function () {
    this.items.length = 0;
    this.keys.length = 0;
    this.map = {};
  },
  getAll: function () {
    return this.items;
  },
  getItem: function (index) {
    if (index > -1 && index < this.items.length) {
      return this.items[index];
    }
    return null;
  },
  remove: function (o) {
    var key = this.getKey(o);

    this.keys.remove(key);
    delete this.map[key];
    return this.items.remove(o);
  },
  size: function () {
    return this.items.length;
  }
});
//</source>

/*****************************************************************************************************************/
//end grid stuff;
/*****************************************************************************************************************/

JSLITE.apply(JSLITE.EventManager = (function () {
  var fnRegister = function (oDom, sType, fn) {
    JSLITE.dom.get(oDom).on(sType, fn);
  };

  return {
    register: fnRegister
  };
}()), JSLITE.Observer.prototype); //mixin the Observer type;

/*
JSLITE.EventManager.register(window, "load", function (e) {
  JSLITE.ux.DropZoneManager.subscriberEvents("nodedrop"); //w/o registering the event it can't be subscribed to;
  JSLITE.ux.DropZoneManager.subscribe("nodedrop", function (e) {
    alert("node drop canceled!");
    return false;
  });
});
*/
JSLITE.EventManager.register(document, "mouseup", function (e) {
  JSLITE.ux.DropZoneManager.onMouseUp(e);
});

JSLITE.ux.DropZoneManager = (function () {

  var i = 0,
    len,
    oDropZones = {},
    oDragSource, //the cloned dom element;
    oSourceElement, //the original dom element that has been selected to be dragged;
    sDropZoneTarget; //the zone target (an element id) where the dragged element will be dropped;

  function fnAdd(v, o) {
    var aElems = [],
      sEvent,
      oSubscribe;

    if (!(v instanceof Array)) {
      if (v instanceof JSLITE.Composite) {
        aElems = v.elements;
      } else {
        aElems = [JSLITE.dom.getDom(v)];
      }
      aElems.forEach(function (oElem) {
        var oZone = oDropZones[oElem.id] = oElem;

        JSLITE.apply(oZone, JSLITE.Observer.prototype); //each zone mixes in its own Observer functionality;
        oZone.subscriberEvents([
          "beforenodedrop",
          "afternodedrop"
        ]); //let the Observer know what events can be subscribed to;

        if (o.subscribe) {
          oSubscribe = o.subscribe;
          for (sEvent in oSubscribe) {
            if (oSubscribe.hasOwnProperty(sEvent)) {
              oZone.subscriberEvents(sEvent); //w/o registering the event it can't be subscribed to;
              oZone.subscribe(sEvent, oSubscribe[sEvent]);
            }
          }
        }

        oElem.sort = o.sort || false;
        oElem.snapToZone = o.snapToZone || false;
      });
    } else {
      oDropZones.push(JSLITE.dom.get(v));
    }

    v.on("mousedown", function (e) {
      var target = e.target;

      target = target.className.indexOf("JSLITE_draggable") !== -1 ? target : JSLITE.dom.find(target, ".JSLITE_draggable");
      if (target) {
        target.owner = this.id;
        oDragSource = target.cloneNode(true); //clone the target node and any children;
        oSourceElement = target;
        JSLITE.dom.fly(oDragSource).addClass("JSLITE_dragging"); //concatenate b/c we don't want to overwrite any class that may already be bound to it;
        document.body.appendChild(oDragSource);

        document.onmousemove = function (e) {
          e = e || window.event;
          JSLITE.dom.fly(oDragSource).setStyle({
            display: "block",
            top: JSLITE.util.getY(e) + 20 + "px",
            left: JSLITE.util.getX(e) + 10 + "px"
          });
        };
      }
      document.body.focus(); //cancel out any text selections;
      document.onselectstart = function () { return false; }; //prevent text selection in ie;
      e.preventDefault();
    });

    v.on("mouseover", function (e) {
      if (oDragSource) {
        if (oSourceElement.owner !== this.id) {
          sDropZoneTarget = this.id;
          JSLITE.dom.fly(oDragSource).addClass("JSLITE_overDropZone");
        }
      }
    });

    //NOTE it's very important to listen to this event so fnOnNodeDrop knows when it can remove the cloned node and when to remove the class when the node is over a no-drop area;
    v.on("mouseout", function (e) {
      if (oDragSource) {
        sDropZoneTarget = null;
        JSLITE.dom.fly(oDragSource).removeClass("JSLITE_overDropZone");
      }
    });
  }

  function fnOnNodeDrop(e) {
    if (!oDragSource) {
      return;
    }
  
    var o;

    if (sDropZoneTarget && sDropZoneTarget.indexOf(oSourceElement.owner) === -1) { //if sDropZoneTarget is not null (from a no-drop area) or within the same drop zone;
      oZoneTarget = $(sDropZoneTarget);

      o = JSLITE.ux.DropZoneManager.getDropZones()[sDropZoneTarget];
      if (o) {
        if (o.id !== oSourceElement.owner) {
          if (o.fire("beforenodedrop") !== false) { //drop the node in the drop zone if developer-provided callback doesn't cancel the behavior;
            document.body.removeChild(oDragSource); //remove the cloned node from the dom...;
            $(sDropZoneTarget).appendChild(oSourceElement); //...and re-append the original in the new drop zone;
            oSourceElement.owner = o.id; //swap out the previous zone owner for the new one;
  
            if (o.sort) {
              fnSort(sDropZoneTarget);
            }
  
            if (oSourceElement.snapped && !o.snapToZone) { //oSourceElement has already been snapped to the zone and now needs to have its original styles added back to it (unless dropped in another zone that needs to also be snapped to the zone);
              JSLITE.dom.fly(oSourceElement).setStyle(oSourceElement.originalStyles);
              oSourceElement.snapped = false;
            } else if (!oSourceElement.snapped && o.snapToZone) { //only snap to zone if it hasn't already been snapped;
              fnSnapToZone(oSourceElement);
            }
            //NOTE if it's already been snapped to zone and is dropped into another snapped zone, don't do anything above b/c it's already been snapped and has its original styles bound to itself;
          } else {
            document.body.removeChild(oDragSource);
          }
        }
        o.fire("afternodedrop");
      }
    } else {
      document.body.removeChild(oDragSource); //remove the cloned node from the dom...;
    }

    oDragSource = null; //...and remove the property so the check in the beginning of this method tcob;
    document.onmousemove = null;
    document.onselectstart = null;
  }

  function fnSnapToZone(oSourceElement) {
    var fnGetStyle = JSLITE.util.getStyle,
      oStyle = {
        borderTopColor: fnGetStyle(oSourceElement, "border-top-color"),
        borderTopStyle: fnGetStyle(oSourceElement, "border-top-style"),
        borderTopWidth: fnGetStyle(oSourceElement, "border-top-width"),
 
        borderRightColor: fnGetStyle(oSourceElement, "border-right-color"),
        borderRightStyle: fnGetStyle(oSourceElement, "border-right-style"),
        borderRightWidth: fnGetStyle(oSourceElement, "border-right-width"),

        borderBottomColor: fnGetStyle(oSourceElement, "border-bottom-color"),
        borderBottomStyle: fnGetStyle(oSourceElement, "border-bottom-style"),
        borderBottomWidth: fnGetStyle(oSourceElement, "border-bottom-width"),

        borderLeftColor: fnGetStyle(oSourceElement, "border-left-color"),
        borderLeftStyle: fnGetStyle(oSourceElement, "border-left-style"),
        borderLeftWidth: fnGetStyle(oSourceElement, "border-left-width"),

        marginTop: fnGetStyle(oSourceElement, "margin-top"),
        marginRight: fnGetStyle(oSourceElement, "margin-right"),
        marginBottom: fnGetStyle(oSourceElement, "margin-bottom"),
        marginLeft: fnGetStyle(oSourceElement, "margin-left")
      };

    oSourceElement.snapped = true;
    oSourceElement.style.border = oSourceElement.style.margin = 0;
    oSourceElement.originalStyles = oStyle;
  }

  //sort the drop zone's sortable elements after drop (NOTE that the sort is dependent upon a developer provided property called "sortOrder");
  function fnSort(sDropZone) {
    var arr = JSLITE.makeArray($(sDropZone).childNodes).filter(function (v) { //get all child nodes within the drop zone that have a "sortOrder" property;
      return (typeof v.sortOrder === "number"); //should there be a better check?;
    }),
    oFrag = document.createDocumentFragment(),
    oDropZone = JSLITE.dom.get(sDropZone);

    arr.sort(function (a, b) { //sort all nodes in this drop zone by their sort order property;
      return a.sortOrder - b.sortOrder;
    });

    oDropZone.remove(true); //remove all the nodes...;

    arr.forEach(function (v) { //...and readd them to the document fragment;
      oFrag.appendChild(v);
    });
    oDropZone.append(oFrag); //only append once!;
  }

  return {
    add: function (v, o) {
      o = o || {};
      return fnAdd(v, o);
    },
    getDropZones: function () {
      return oDropZones;
    },
    onMouseUp: function (e) {
      return fnOnNodeDrop.call(this, e);
    }
  };

}());

/*****************************************************************************************************************/
/*****************************************************************************************************************/
/**
* @function JSLITE.ux.AnimationManager
* @param {None}
* @return {None}
* @mixin {<a href="#jsdoc">JSLITE.Observer</a>}
* @events {animationadd, animationregister, animationremove, queuedestroy, timercreate, timerdestroy}
* @describe <p>This object is a singleton.</p>
<p><strong>On animation behaviors</strong></p>
<ul>
  <li>only one timer is used</li>
  <li>only animation objects that are instantiated by the constructor at runtime are pushed onto the queue stack (any motions or complete callbacks re-use these existing objects)</li>
  <li>these objects are re-used whenever an object has a motion or complete callback bound to it</li>
  <li>motions are synchronous animations that can be bound to an object via its motions property</li>
  <li>any object can have a callback bound to its complete property that creates a new motion by re-using (replacing) the current object</li>
  <li>the context can be switched at any time (either in a motion or in a callback);</li>
  <li>objects are removed from the queue stack when its determined that there are no more motions or there aren't any to begin with and there is no complete callback bound to the object</li>
  <li>when all objects are spliced from the stack and its empty, clear the timer</li>
  <li>an object will no longer be acted upon if its active property is false.  this happens when all of its frames have been cycled through. if it's then determined that there are no motions or callbacks, it is then removed from the stack</li>
  <li> the timer isn't initiated until run() is called on an object or the manager</li>
  <li>there should be a one-to-one ratio between registered motions and destroyed motions: for every motion created (animationregister) there should be one destroyed (animationremove)</li>
</ul>

<ul>
  <li>Every motion can pass a callback to be executed that is defined in the <code>complete</code> property. This can contain cleanup code, other application logic and more motions to be run.</li>
  <li>When an element is targeted to be animated in the <code>elem</code> property, subsequent motions will be applied to that element until another element is targeted by the same property or the motions are exhausted.</li>
  <li>Similarly, any property defined in one motion will be applied to subsequent motions unless its overwritten. For example, if a motion has its <code>fadeOut</code> property set, that element will fade out as will every element in every subsequent motion until its <code>fadeIn</code> property is set to <code>true</code>.</li>
  <li>In essence, all of the properties passed to a motion subscribe to a set/unset philosophy. Basically, if you turn on a property like <code>fadeIn</code> or <code>anchor</code>, it will continue to honor that until it's turned off or unset.</li>
</ul>

<pre>
NOTE!!!
  - if there are motions defined, the first motion is shifted off of the list and used for the first animiation, i.e., it OVERRIDES any animation defined in the object passed to JSLITE.ux.AnimationManager.add();
  - for example, the animation for {direction: "right", go: 200, etc.} will be overridden by the motions array and never be run:
  - the properties from one object are applied to the other (JSLITE.apply), see the constructor JSLITE.ux.Animation
JSLITE.ux.AnimationManager.add([
  {
    elem: $("animate2"),
    direction: "right",
    go: 200,
    speed: "slowRide",
    motions: testMotions,
    fadeOut: true
  }
]);

animation properties that can be overridden:
anchor
direction
end 
fadeIn
fadeOut
go
speed

NOTE if both end and go are defined, end will trump!;
This can happen if a motion is overrides the first animation (as explained above), and go is defined in the animation but end is defined in the first motion.  Since the properites are applied (JSLITE.apply), neither will ov
erwrite the other b/c it's not the same property (obviously!), but end will take precedence (look in JSLITE.ux.AnimationManager.createTween()). Likewise, if both fadeIn and fadeOut are defined, fadeOut will take precedence
(even if fadeIn is set on the first motion) (see JSLITE.ux.Animation.create);
</pre>
* @example
Let's start out by defining some motions:

var testMotions = [
  { elem: $("animate3"), direction: "right", end: 700 }, //animate the "animate3" element;
  { fadeIn: true, direction: "top", go: 100, speed: "slowRide" }, //"animate3" will continue to be animated until another element is explicitly specified;
  { direction: "bottom", end: 370, complete: function () { console.log("i'm done 1!"); } },
  { anchor: true, direction: "left", end: 0, speed: "slowRide" },
  { direction: "top", end: 0, fadeIn: true, speed: "slowRide", complete: function () { console.log("i'm done 2!"); } },
  { elem: $("animate2"), direction: "right", end: 450 }, //now animate the "animate2" element;
  { direction: "bottom", end: 300 }, //now "animate2" will continue to be animated until another element is selected;
  { direction: "right", end: 500, complete: function () { console.log("i'm done 3!"); } },
  { elem: $("animate"), direction: "top", go: 20 }, //now the "animate" element will be animated;
  { direction: "bottom", go: 391, speed: "easeIn" },
  { fadeIn: true, direction: "left", go: 100, complete: function () { console.log("i'm done 4!"); } }
];

Examples of use:

--------------------------------------------------------------------------------------------------
1. Pass an array of motions to be initiated.
--------------------------------------------------------------------------------------------------
JSLITE.ux.AnimationManager.add([
  { 
    elem: $("animate"),
    motions: testMotions
  }
]).run(); //note you can add one or more objects to the manager and then immediately run them;

--------------------------------------------------------------------------------------------------
2. Run an initial motion and then pass an array of motions to initate when the first is completed.
--------------------------------------------------------------------------------------------------
JSLITE.ux.AnimationManager.add([
  { 
    elem: $("animate2"),
    direction: "right",
    end: 725,
    speed: "blast",
    complete: function () {
      console.log("first motion has completed");
      this.run({
        motions: testMotions
      });
    }
  }
]);

JSLITE.ux.AnimationManager.run(); //the manager can also be called after the motion(s) are added;

--------------------------------------------------------------------------------------------------
3. Run several motions simultaneously, each doing its own thing.
--------------------------------------------------------------------------------------------------
JSLITE.ux.AnimationManager.add([
  { 
    elem: $("animate2"),
    direction: "right",
    end: 725,
    speed: "blast",
    fadeIn: true  
  },
  { 
    elem: $("animate3"),
    direction: "top",
    end: 0, 
    speed: "slowRide"
  },
  {
    elem: $("animate"),
    direction: "left",
    go: 100,
    speed: "linear",
    fadeOut: true
  }
]);

JSLITE.ux.AnimationManager.run();

--------------------------------------------------------------------------------------------------

//subscribe to its events;
JSLITE.ux.AnimationManager.subscribe("animationregister", function (e) {
  console.log(e.type);
});
JSLITE.ux.AnimationManager.subscribe("animationadd", function (e) {
  console.log(e.type);
});

JSLITE.ux.AnimationManager.subscribe("animationremove", function (e) {
  console.log(e.type, e);
});
JSLITE.ux.AnimationManager.subscribe("timercreate", function (e) {
  console.log(e.type);
});
JSLITE.ux.AnimationManager.subscribe("timerdestroy", function (e) {
  console.log(e.type);
});
*/
//<source>
JSLITE.apply(JSLITE.ux.AnimationManager = (function () {
  var aQueue = [],
    iTimer = null,
    reTest = /\bthis\.run\b/;

  arguments.callee.active = false; //this assures that only one timer is ever set by toggling it to true;

  return {
    speed: { //should always add up to 100;
      blast: [12, 12, 11, 10, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
      "default": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], //default is a reserved word, apparently;
      easeIn: [1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      linear: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      slowRide: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    },
    add: function (arr) {
      if (this.fire("animationadd", { animations: arr }) !== false) {
        arr.forEach(function (v) {
          new JSLITE.ux.Animation(v); //account for every possible property, undefined values are ok;
        });
      }
      return this;
    }.assert(Array),
    animate: function () { //this can be called by the singleton or by an individual object;
      var start = 0,
        i = 0,
        len = aQueue.length;

      for (; i < len; i++) {
        if (aQueue[i].active) {
          aQueue[i].animate();
          start++;
        }
      }

      if (start === 0 && iTimer) {
        if (!JSLITE.ux.AnimationManager.oncomplete || !JSLITE.ux.AnimationManager.oncomplete(aQueue)) { //only clear the timer if there aren't any motions left, i.e.;
          JSLITE.ux.AnimationManager.fire("timerdestroy");
          clearInterval(iTimer);
          iTimer = null;
          JSLITE.ux.AnimationManager.active = false;
        }
      }
    },
    clear: function () {
      if (this.fire("queuedestroy") !== false) {
        aQueue.length = 0;
      }
    },
    createTween: function (o) {
      var oElem = o.elem,
        iEnd = o.end,
        iGo = o.go,
        bAnchor = o.anchor,
        iBegin,
        iOpacity,
        iMove, //the number of pixels to move the element;
        iTotal,
        iFade = 0,
        aTween = [],
        aSpeed = this.speed[o.speed] || this.speed["default"], //"default" is a reserved word;
        len = aSpeed.length,
        bAdd,
        fnSeedValues = function (sDirection) {
          iBegin = parseInt(JSLITE.util.getStyle(oElem, sDirection), 10);
     	  iBegin = !iBegin ? 0 : iBegin;
          iOpacity = parseInt(JSLITE.util.getStyle(oElem, "opacity"), 10);
        };
      
      switch (o.direction) {
        case "right":
          fnSeedValues("left")
          iMove = (typeof iEnd !== "number") ? iGo : iEnd - iBegin;
          bAdd = true;
          break;
        case "left":
          fnSeedValues("left")
          iMove = (typeof iEnd !== "number") ? iGo : iBegin - iEnd;
          bAdd = false;
          break;
        case "bottom":
          fnSeedValues("top")
          iMove = (typeof iEnd !== "number") ? iGo : iEnd - iBegin;
          bAdd = true;
          break;
        case "top":
          fnSeedValues("top")
          iMove = (typeof iEnd !== "number") ? iGo : iBegin - iEnd;
          bAdd = false;
          break;
      }

      iTotal = bAnchor ? 0 : iBegin; //always seed the counter with the starting point;

      for (var i = 0; i < len; i++) {
        if (o.fadeIn) {
          iOpacity += aSpeed[i] / 100;
        } else if (o.fadeOut) {
          iFade += aSpeed[i] / 100;
          iOpacity = iFade > 1 ? 0 : 1 - iFade;
        }

        if (bAdd) {
          iTotal = bAnchor ? (iMove * aSpeed[i] / 100) : iTotal + (iMove * aSpeed[i] / 100);
        } else {
          iTotal = bAnchor ? (iMove * aSpeed[i] / 100) : iTotal - (iMove * aSpeed[i] / 100);
        }

        aTween[i] = {
          data: iTotal,
          opacity: iOpacity,
          event: null
        };
      }

      //bind the properties to 'this' here rather than in the constructor;
      o.tween = aTween;
      o.frame = 0;
      o.totalFrames = aTween.length
    },
    oncomplete: function () {
      var bContinue = false,
        i,
        len,
        oAnimation,
        aRemove = [];

      aQueue.forEach(function (v, i) { //the purpose of this is solely to remove unneeded objects after its motion has completed;
        var bRemove = false;
        if (v.motions) { //if motions were attached only remove the animation object if they are spent and there's no oncomplete method; otherwise, automatically keep it;
          if (!v.motions.length && !v.oncomplete) { //ok, no motions and no oncomplete callback, it's safe to remove;
            bRemove = true;
          } else if (!v.motions.length) { //if the object has no more motions (keep the object if there are still motions)...;
            if (v.oncomplete) {
              v.oncomplete();
              if (v.oncomplete && !reTest.test(v.oncomplete)) { //function decompilation: check to see if the text "this.run" is in the oncomplete callback; if there is an complete callback and "this.run" is not in the function, set the timer to be removed since the motions have been depleted and there's nothing else to do/run;
                bRemove = true; //ok, no more motions and no complete, it's safe to remove;
              }
            }
          } else if (v.oncomplete) { //allow each motion to be able to have a callable oncomplete method;
            //at the present time, don't allow a this.run to be called within a motion's oncomplete method;
            v.oncomplete();
            v.oncomplete = null; //immediately remove or it will be called when every subsequent motion is finished;
          }
        } else if (v.oncomplete) { //no motions but there is an oncomplete (NOTE that the oncomplete property will be undefined if there's no oncomplete property when JSLITE.ux.Animation.create is called, so this condition is automatically not met if an animation object doesn't contain this property);
          if (v.oncomplete && !reTest.test(v.oncomplete)) { //function decompliation: check to see if the text "this.run" is in the oncomplete callback; if there is a function and "this.run" is not in the function, it's safe to run it b/c it's not a motion and then mark it for gc;
            v.oncomplete();
            bRemove = true;
          } else if (!v.gotHere && reTest.test(v.oncomplete)) { //NOTE v.gotHere is just an arbitrary name;
            /*
              - NOTE if this.run is within C-style comments (a comment block), FF 3.6.10 doesn't parse the comments and therefore doesn't 'see' the this.run text inside them, it's like it doesn't 'see' them;
              - it's necessary to have an arbitrary property name like v.gotHere to make sure that v.oncomplete() isn't called more than once;
            */
            v.oncomplete();
            v.gotHere = true;
          } else {
            bRemove = true;
          }
        } else if (v.frame > v.totalFrames) { //there are no motions and no oncomplete, so it's safe to remove if the frame property is greater than the totalFrames property;
          bRemove = true;
        }
        if (bRemove) {
          this.fire("animationremove", {
            removedAnimation: v
          });
          aRemove.push(i); //push the index onto the stack to be removed;
        }
      }, this);
      for (n = 0, len = aRemove.length; n < len; n++) {
        aQueue.splice(aRemove.pop(), 1);
      }
      for (n = 0, len = aQueue.length; n < len; n++) { //loop through the motions;
        oAnimation = aQueue[n];
        if (oAnimation.motions) {
          if (oAnimation.motions.length) {
            oAnimation.create(oAnimation.motions.shift()); //remove from the front of the array (FIFO);
            oAnimation.active = true; //the object's animate method won't be called unless the object is active;
          }
        }
        bContinue = true; //setting to true ensures that that timer won't be cleared;
      }
      return bContinue; //returning false will clear the timer;
    },
    register: function (o) {
      if (this.fire("animationregister", { animation: o }) !== false) {
        o.active = true;
        aQueue.push(o);
      }
    },
    run: function () {
      if (iTimer || JSLITE.ux.AnimationManager.active) {
        return false; //already active;
      }
      if (aQueue.length) {
        JSLITE.ux.AnimationManager.active = true;
        iTimer = setInterval(JSLITE.ux.AnimationManager.animate, this.interval || 20);
        JSLITE.ux.AnimationManager.fire("timercreate");
      } else {
        throw new Error("There is nothing to run!");
      }
    }
  };
}()), JSLITE.Observer.prototype);

/******************************************
establish which events can be subscribed to
******************************************/
JSLITE.ux.AnimationManager.subscriberEvents([
  "animationadd",
  "animationregister",
  "animationremove",
  "animationrun",
  "queuedestroy",
  "timercreate",
  "timerdestroy"
]);
//</source>

/**
* @function JSLITE.ux.Animation
* @param {None}
* @return {None}
* @describe <p>Not called directly. All animations are handled through the <code><a href="#jsdoc">JSLITE.ux.AnimationManager</a></code> singleton. Please see that reference type for examples of usage.</p>
*/
//<source>
JSLITE.ux.Animation = function (o) {
  if (!o.elem) {
    throw new Error("No element provided for animation!");
  }
  this.active = false;
  this.motions = o.motions || null;
  if (this.motions) { //if there are motions that use the first one;
    o = JSLITE.apply(o, this.motions.shift()); //remove from the front of the array (FIFO);
  }
  this.create(o);
  JSLITE.ux.AnimationManager.register(this); //only queue objects in the constructor (this encourages re-use);
};
JSLITE.apply(JSLITE.ux.Animation.prototype, {
  animate: function (o) {
    var sDirection,
      iWidth,
      iHeight,
      iLeft;

    if (JSLITE.ux.AnimationManager.fire("animationrun") !== false) {
      if (this.frame < this.totalFrames) {
        sDirection = ["left", "right"].join("").indexOf(this.direction) !== -1 ? "left" : "top";

        if (this.anchor) {
          switch (this.direction) {
            case "right":
              iWidth = Number(JSLITE.util.getStyle(this.elem, "width").replace(/p[x|t]$/, "")); //cut off the text and convert to a Number to preserve it as a floating point number (parseInt quits when it sees a decimal point); when the width is 0, the browser could render it as pt rather than px so check for both cases (observed in FF 3.6.13);
              this.elem.style.left = iLeft;
              this.elem.style.width = iWidth + this.tween[this.frame].data + "px";
              break;
            case "left": //increase the width at the same time that the left style property is decreased the same amount as the width is increased;
              iWidth = Number(JSLITE.util.getStyle(this.elem, "width").replace(/p[x|t]$/, ""));
              iLeft = Number(JSLITE.util.getStyle(this.elem, "left").replace(/p[x|t]$/, ""));
              this.elem.style.width = iWidth + this.tween[this.frame].data + "px";
              this.elem.style.left = iLeft - this.tween[this.frame].data + "px";
              break;
            case "bottom": //increase the width at the same time that the left style property is decreased the same amount as the width is increased;
              iHeight = Number(JSLITE.util.getStyle(this.elem, "height").replace(/p[x|t]$/, ""));
              //iTop = parseInt(JSLITE.util.getStyle(this.elem, "top"), 10);
              var test = this.tween[this.frame].data;
              if (test < 1) {
                test = 1;
              }
              //this.elem.style.height = iHeight + this.tween[this.frame].data + "px";
              this.elem.style.height = iHeight + test + "px";
              break;
            case "top": //increase the width at the same time that the left style property is decreased the same amount as the width is increased;
              iHeight = Number(JSLITE.util.getStyle(this.elem, "height").replace(/p[x|t]$/, ""));
              this.elem.style.height = iHeight - this.tween[this.frame].data + "px";
              break;
          }
        } else {
          this.elem[sDirection] = this.tween[this.frame].data + "px";
          this.elem.style[sDirection] = this.tween[this.frame].data + "px";
        }
        //this.elem.style.opacity = this.tween[this.frame].opacity || 1;
        this.elem.style.opacity = this.tween[this.frame].opacity;
      }
      if (this.frame++ >= this.totalFrames) {
        this.active = false;
        if (this.fadeOut && this.elem.style.opacity !== 0) { //this is a hack b/c sometimes the opacity isn't 0 when the frames are exhausted, it could still be .1 b/c JavaScript math sucks;
          this.elem.style.opacity = 0;
        }
      }
    }
  },
  create: function (o) { //binding properties to the object here allows for object re-use;
    this.elem = o.elem || this.elem; //since objects can be re-used preserve the original value;
    this.direction = o.direction || "right";
    //this.anchor = o.anchor || false;
    this.anchor = typeof o.anchor === "boolean" ? o.anchor : this.anchor;
    this.go = typeof o.go === "number" ? o.go : null;
    this.end = typeof o.end === "number" ? o.end : null;
    this.interval = o.interval || null; //default is 20 ms;
    //this.speed = o.motions ? null : o.speed || this.speed;
    this.speed = o.speed || this.speed;
    this.motions = o.motions || this.motions;
    //this.fadeIn = typeof o.fadeIn === "boolean" ? o.fadeIn : this.fadeIn;
    //this.fadeOut = typeof o.fadeOut === "boolean" ? o.fadeOut : this.fadeOut; //there can't be a fadeOut if there's already a fadeIn;
    if (typeof o.fadeOut === "boolean") {
      this.fadeOut = o.fadeOut;
      this.fadeIn = null;
    } else if (typeof o.fadeIn === "boolean") {
      this.fadeIn = o.fadeIn;
      this.fadeOut = null;
    }
    this.oncomplete = o.complete || this.oncomplete;
    JSLITE.ux.AnimationManager.createTween(this);
  },
  reset: function () {
    JSLITE.ux.AnimationManager.reset();
  },
  run: function (o) {
    if (o) { //this branch allows an object to initiate another move in the complete callback; it's possible to supply a different element target; this promotes object re-use;
      this.active = true; //remember animate() won't be called unless active === true;
      this.create(o);
      this.oncomplete = o.complete;
    }
  
    if (!JSLITE.ux.AnimationManager.active) { //this initiates the timer (only call once);
      JSLITE.ux.AnimationManager.run.call(this);
    }
  }
});
//</source>
