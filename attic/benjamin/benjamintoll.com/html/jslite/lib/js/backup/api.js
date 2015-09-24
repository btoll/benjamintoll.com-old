/*
 * jsLite
 *
 * Copyright (c) 2009 Benjamin Toll (benjamintoll.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */

JSLITE.ready(function () {

  (function () {
  
    /*first declare all vars and functions*/
    /*save this regex just in case*/
    ///((?:[a-zA-z_\-]*\.)*[a-zA-z_\-]*)\s*[:=]\s*\(?function\s*\([a-zA-Z,\s]*\)/; //matches "Array.prototype.forEach = function (callback, oOptional)";

    var sSymbol = "JSLITE", //set the global symbol to search for;
      aKeywords = ["function", "property", "type", "param", "return", "events", "describe", "example"], //set the @tags to search for in the source, i.e., "@param", "@return", etc.;
      aObjects = [], //create a an array that holds the top-level objects to be used in the re, i.e. [util,dom,ux,xhr,prototype];
      oNamespaces = {}, //this object will hold all of the methods and chunks from each parsed script;
      aSignature = [], //this array will hold the method signature constructed from @function and @param, i.e., "JSLITE.dom.attachHandler: function(vElem) { ... }";
      oFragment = document.createDocumentFragment(),
      oSource = {}, //associative array, holds method name => method source, used for searches;
      arr;

    var fnPaintList = function (obj, oChunk, aChunk) {
      arr.push("<h4>" + obj.name + "</h4>"); //ex. "Parameters:";
      for (var i = 0, iLength = aChunk.length; i < iLength; i++) {
        arr.push("<ul>");
        if (aChunk[i].name && aChunk[i].type) {
          arr.push("<li><code>" + aChunk[i].name + "</code> : " + aChunk[i].type);
        } else {
          arr.push("<li>");
          arr.push("<code>" + aChunk[i].name + "</code>"); //if either is empty it doesn't matter as far as the markup is concerned;
          arr.push(aChunk[i].type);
        }
        if (aChunk[i].description) {
          arr.push("<p>" + aChunk[i].description + "</p></li>");
        } else {
          arr.push("</li>");
        }
        arr.push("</ul>");
      }
    };

    var oMap = { //different sections must display differently;
      describe: {
        name: "Describe:",
        template: function (obj, oChunk) {
          arr.push("<h4 id=\"details\">" + obj.name + "</h4>");
          arr.push("<div class=\"describe\">" + oChunk["describe"][0].description + "</div>");
        }
      },
      example: {
        template: function (obj, oChunk) {
          /*NOTE the way the regex is written, if the first word consists of alpha characters then it will be matched by the third subexpression (name) so it's then needed to be added here (aTemp[1])*/
          var aTemp = [];
          aTemp[0] = "<div class=\"describe\"><pre><code>";
          aTemp[1] = oChunk["example"][0].name;
          aTemp[2] = " ";
          aTemp[3] = oChunk["example"][0].description.invoke("HTMLify");
          aTemp[4] = "</code></pre></div>";
          $("example").innerHTML =  aTemp.join(""); 
        }
      },
      "function": {
        template: function (obj, oChunk) {
          var arr = [];
          var sFuncName = oChunk["function"][0].name;
          for (var i = 0, iLength = oChunk["param"].length; i < iLength; i++) {
            arr.push(oChunk["param"][i].name);
          }
          //$("title").innerHTML = aSignature[0] = "<a href='#'>" + (sFuncName.indexOf(".") == -1 ? JSLITE.globalSymbol + "." + sFuncName : sFuncName) + "</a>"; //if there's no period in the function name then append the global symbol; also, wrap the method name in a link so the user can click it and go directly to the source;
          $("title").innerHTML = aSignature[0] = sFuncName.indexOf(".") == -1 ? JSLITE.globalSymbol + "." + sFuncName : sFuncName; //if there's no period in the function name then append the global symbol;
          aSignature[1] = sFuncName.indexOf("prototype") == -1 ? ":" : " = ";
          aSignature[2] = " function (";
          aSignature[3] = arr.join(", ");
          aSignature[4] = ") { ... }"; //this will be inserted via innerHTML in fnJSDoc;
        }
      },
      "property": {
        template: function (obj, oChunk) {
          aSignature.length = 0;
          aSignature.push(oChunk["type"][0].name);
          $("title").innerHTML = oChunk["property"][0].name;
          if (oChunk["describe"]) {
            var aTemp = [];
            aTemp[0] = "<div class=\"describe\"><pre><code>";
            aTemp[1] = oChunk["describe"][0].name;
            aTemp[2] = " ";
            aTemp[3] = oChunk["describe"][0].description.invoke("HTMLify");
            aTemp[4] = "</code></pre></div>";
            $("description").innerHTML =  aTemp.join(""); 
          }
        }
      },
      param: {
        name: "Parameters:",
        template: fnPaintList
      },
      "return": {
        name: "Returns:",
        template: fnPaintList
      },
      events: {
        name: "Events:",
        template: fnPaintList
      }
    };

    var oUL = {}, oLink = {}; //remember the elements between invocations;
    var fnJSDoc = function (e) { //display all the info for each link that will appear in the tabs;
      var oTarget = e.target, sInnerHTML = oTarget.innerHTML;
      if (oTarget.rel) return false; //end if the link isn't in the menu tree, a special link in the api or a link in the search form results;

      var fnExpander = function () { //links in the menubar and links in the search list have different target objects;
        var oList = JSLITE.dom.get(oUL), oHref = JSLITE.dom.get(oLink);
        JSLITE.dom.gets("#tree > li > a + ul[id!=" + oUL.id + "]").replaceClass("hide", "show"); //close every list except for the one that was clicked on;
        JSLITE.dom.gets("#tree > li > a").replaceClass("expand", "contract");
        if (oList.hasClass("hide")) {
          oList.replaceClass("show", "hide");
          oHref.replaceClass("contract", "expand");
        } else {
          oList.replaceClass("hide", "show");
          oHref.replaceClass("expand", "contract");
        }
      };

      var fnHowMany = function (sInnerHTML) {
        var s;
        switch (JSLITE.util.howMany(sInnerHTML, ".")) {
          case 1: s = sInnerHTML.slice(sInnerHTML.indexOf(".") + 1); break;
          case 2: s = sInnerHTML.slice(0, sInnerHTML.lastIndexOf(".")); break;
          case 0: return sInnerHTML;
        }
        return s;
      }

      var fnGetJSDoc = function (sInnerHTML) {
        var v, p;
        try {
          v = $(sInnerHTML).jsdoc;
          p = v.chunk; //if we get here try to access an object property (remember if $(sInnerHTML) resolves to an actual HTMLElement but does not have a jsdoc property we could still get here b/c "undefined" wouldn't throw an error, but trying to access a property on the undefined data type would throw an error);
        } catch (e) {
          v = $(fnHowMany(sInnerHTML)).jsdoc;
        }
        return v;
      }

      if (oTarget.nodeName.toLocaleLowerCase() === "a" && oTarget.className.indexOf("expand") === -1 && oTarget.className.indexOf("contract") === -1) { //only target the links within each "header";
        /*remove the "selected" classname from $("tree") and then add it to the current <a>*/
        JSLITE.dom.gets("#tree a").removeClass("selected"); //remove the selected class from any element that may have it;
        if (oTarget.href.indexOf("#jsdoc") === -1) oTarget.className = "selected"; //only give the target the selected class if it's not a #jsdoc link;
        $("example").innerHTML = ""; //to be safe remove any text in case the current method doesn't have its @example flag set;
        var jsdoc = oTarget.jsdoc || fnGetJSDoc(sInnerHTML); //if oTarget.jsdoc is null, the link was clicked in the api (i.e., in the description of a method) so lookup the jsdoc object using innerHTML (and if that fails use fnHowMany to get just the namespace we need);
        if (jsdoc.chunk) { //paint the Description tab;
          var aChunk = jsdoc.chunk;
          arr = [];
          arr.push("<h1 id=\"methodSignature\"></h1>"); //to be filled in by oMap["function".template(), ex. "Array.prototype.forEach = function (callback, oOptional) { }";
          for (var i in aChunk) {
            if (aChunk.hasOwnProperty(i)) { //filter out inherited properties from its prototype;
              if (oMap[i]) { //some of the @keywords in aKeywords don't have a template so filter them out;
                oMap[i].template(oMap[i], aChunk, aChunk[i]); //functions are varargs;
              }
            }
          }

          $("description").innerHTML = arr.join("");
          $("source").innerHTML = "<div><pre><code>" + jsdoc.source + "</code></pre></div>";
          $("methodSignature").innerHTML = aSignature.join("");
          JSLITE.dom.fly("response").replaceClass("show", "hide");
        }
      }

      switch (true) { //expand the menu and highlight the method;
        case ["expand", "contract"].contains(JSLITE.trim(oTarget.className)): //only target the "header" links; also, trim the classname or it won't match (i.e., " contract" won't match);
          oUL = oTarget.nextSibling;
          oLink = oTarget;
          fnExpander();
          break;
        case !!oTarget.namespace: //if the link has a namespace property then we know it's a link from a search;
          oUL = $(oTarget.namespace);
          oLink = oUL.previousSibling;
          if (["hide"].contains(oUL.className)) { //don't expand if user clicked on a method in a module that's already been expanded;
            fnExpander();
          }
          $(sInnerHTML).className = "selected";
          break;
        case oTarget.href && oTarget.href.indexOf("#jsdoc") > -1:
          var s = fnHowMany(sInnerHTML) || s; //determine how many periods (namespaces) are in the text;

          oUL = !$(s) || $(s).nodeName !== "UL" ? $("JSLITE." + s) : $(s); //first we must target a <ul> to expand it, so if s doesn't map to a <ul> we know to prefix it with "JSLITE" which will map to a <ul> (this happens in cases where the <ul id="JSLITE.domQuery"> and <a id="domQuery");
          if (oUL.nodeName !== "UL") oUL = $("JSLITE");
          oLink = oUL.previousSibling;
          if (["hide"].contains(oUL.className)) { //don't expand if user clicked on a method in a module that's already been expanded;
            fnExpander();
          }
          s = !$(s) || $(s).nodeName !== "A" ? sInnerHTML : s; //do the opposite check as what we did previously when applying the classname;
          $(s).className = "selected";
          break;
      }

      JSLITE.dom.gets("#searchList a").removeClass("selected"); //remove any "selected" classname from the search list;
      if (e.preventDefault) {
        e.preventDefault();
      } else {
    	return false;
      }
    };

    var fnSearch = function (e) {
      if ($("search").value !== "") {
        aFunctions = [];
        var sSearch = $("search").value, sSearchBy = $("searchBy").value, oFragment = document.createDocumentFragment();
        var fnListItem = function (obj, sMethod) {
          var oLink = JSLITE.dom.create({tag: "li",
            children: [
              JSLITE.dom.create({tag: "a",
                attr: {
                  href: "#",
                  innerHTML: sMethod,
                  namespace: obj.namespace, //to open the appropriate menubar;
                  jsdoc: obj.jsdoc //attach the meat and potatoes;
                }
              })
            ]
          });
          return oLink;
        }
        for (var i in oSource) {
          switch (sSearchBy) {
            case "source":
              if (oSource[i].source.indexOf(sSearch) != -1) {
                oFragment.appendChild(fnListItem(oSource[i], i).dom);
              }
              break;
            case "method":
              if (i.indexOf(sSearch) != -1) {
                oFragment.appendChild(fnListItem(oSource[i], i).dom);
              }
          }
        }
        $("searchList").className = "show";
        $("searchList").innerHTML = "";
        if (oFragment.childNodes.length > 0) {
          $("searchList").appendChild(oFragment);
        } else {
          $("searchList").appendChild(JSLITE.dom.create({tag: "li", attr: {innerHTML: "No items found."}}).dom);
        }
        JSLITE.dom.blur({tag: "a", parent: "searchList"});
        JSLITE.dom.fly("searchList").on("click", fnJSDoc); //finally, delegate the listener;
      }
      e.preventDefault();
    };

    var fnListBuilder = function (arr, obj) {
      var sNamespace = obj.namespace;
      JSLITE.dom.create({tag: "li",
        children: [
          /*create the top-level <a> that will open/close the menu*/
          JSLITE.dom.create({tag: "a",
            attr: {
              href: "#",
              className: "expand",
              innerHTML: sNamespace
            }
          }),
          /*create the <ul> to which we'll append each <a>method</a>*/
          JSLITE.dom.create({tag: "ul",
            attr: {
              id: sNamespace,
              className: "hide"
            }
          })
        ],
        parent: "tree"
      });
      for (var i = 0, iLength = arr.length; i < iLength; i++) {
        //sMethod = arr[i]['chunk']['function'][0].name;
        if (arr[i]['chunk']['function']) {
          sMethod = arr[i]['chunk']['function'][0].name;
          oSource[arr[i]['chunk']['function'][0].name] = {source: arr[i].source, jsdoc: arr[i], namespace: sNamespace}; //capture all functions and properties and their source (for searches);
        } else if (arr[i]['chunk']['property']) {
          sMethod = arr[i]['chunk']['property'][0].name;
          oSource[arr[i]['chunk']['property'][0].name] = {source: arr[i].source, jsdoc: arr[i], namespace: sNamespace};
        }
/*
        ["function", "property"].forEach(function (value) {
          sMethod = arr[i].chunk[value][0].name;
          oSource[arr[i].chunk[value][0].name] = {source: arr[i].source, jsdoc: arr[i], namespace: sNamespace}; //capture all functions and properties and their source (for searches);
        });
*/

        /*if the object the method is in is the same as sNamespace, then chop off the namespace from @function, i.e., sMethod above will contain "JSLITE.ready" so chop off "JSLITE.dom." else just use sMethod as
 is (i.e., "Array.prototype.forEach"); the point is to allow for function names that are named other than what is expected
          - also, make sure the namespace !== the method, otherwise, JSLITE.Element doesn't show up if it's contained w/in JSLITE.Element.js*/
        if (sMethod.indexOf(sNamespace) != -1 && sMethod !== sNamespace) {
          var sAbbreviatedMethod = sMethod.substring(sNamespace.length + 1);
        }
        var oNewElem = JSLITE.dom.create({tag: "li",
          children: [
            JSLITE.dom.create({tag: "a",
              attr: {
                href: obj.url,
                id: sMethod,
                innerHTML: sAbbreviatedMethod || sMethod, //in the case of "JSLITE.Element" or "JSLITE.Composite", sAbbreviatedMethod will be undefined so use sMethod;
                jsdoc: arr[i] //attach the meat and potatoes;
              }
            })
          ]
        });
        oFragment.appendChild(oNewElem.dom);
      }

      $(sNamespace).appendChild(oFragment); //append fragment to the <ul>;
    };

    var oScripts = document.getElementsByTagName("script");
    for (var i = 0, iLength = oScripts.length; i < iLength; i++) (function (oScript) {
      if (oScript.src && oScript.src.indexOf(sSymbol) != -1) { //only parse if they contain a src attribute (so we know they're linking to an external file) and the global symbol is contained in the url;
        var sURL = oScript.src;
        var sNamespace = oScript.src.replace(new RegExp(".*(" + sSymbol + ".*)\\.js"), "$1"); //i.e., "JSLITE.Element", "JSLITE.dom", etc.;
        JSLITE.ajax.load({
          url: sURL,
          success: function (sResponse) {
            var x;
            //var re = /\/\*\*(?:\n|\r\n){1}(.|\n|\r\n)*?<\/source>/g; //matches /** ... </source>;
            var re = /\/\*\*(?:\r\n){1}(.|\r\n)*?<\/source>/g; //matches /** ... </source>;
            var aChunks = []; //store each match;
            oNamespaces[sNamespace] = []; //each namespace will be a property whose value will be an array of key/value pairs ("method" and "chunk");

            while (x = re.exec(sResponse)) { //load up each chunk;
              aChunks.push(x[0]);
            }

            for (var i = 0, iLength = aChunks.length; i < iLength; i++) {
              var sChunk = aChunks[i];
              //var sSource = sChunk.match(/<source>((.|\n|\r\n)*)\/\/<\/source>/)[1]; //get the source code;
              var sSource = sChunk.match(/<source>((.|\r\n)*)\/\/<\/source>/)[1]; //get the source code;
              var aGetChunks = [];
              if (new RegExp("@" + aKeywords.join("|")).test(sChunk)) {
                var x;
                //var rePattern = new RegExp("@(" + aKeywords.join("|") + ")\\s*(?:{(.*?)})?(?:\\s*\\b(\[a-zA-Z\.]*)\\b\\s*)?((.|\\n|\\r\\n)*?)\\*", "g");
                var rePattern = new RegExp("@(" + aKeywords.join("|") + ")\\s*(?:{(.*?)})?(?:\\s*\\b(\[a-zA-Z0-9\.]*)\\b\\s*)?((.|\\r\\n)*?)\\*", "g");
                while (x = rePattern.exec(sChunk)) { //extract each keyword's stuff;
                  if (!aGetChunks[x[1]]) aGetChunks[x[1]] = []; //create arrays on-the-fly;
                  aGetChunks[x[1]].push({type: x[2] || "", name: x[3] || "", description: x[4] || ""});
                }
              }
              oNamespaces[sNamespace].push({chunk: aGetChunks, source: sSource});
            }
            fnListBuilder(oNamespaces[sNamespace], {namespace: sNamespace, url: sURL}); //each <script> found gets its own list;
          }
        });
      }
    })(oScripts[i]);

    setTimeout(function () {
      JSLITE.ux.Tabs();
      JSLITE.dom.targetBlank();
      JSLITE.dom.blur({tag: "a", parent: "tree"});
      JSLITE.dom.fly("searchForm").on("submit", fnSearch);
      if (location.hash) {
    	var e = {
    	  target: {
    	    nodeName: "A",
    	    innerHTML: location.hash.slice(1), //chop off the "#";
    	    href: "#jsdoc",
    	    className: ""
    	  }
    	};
        fnJSDoc(e);
      }
      if (JSLITE.isIE) document.execCommand("BackgroundImageCache", false, true); //kills the nasty background image flicker bug in ie6;
    }, 1000);

    /*event delegation*/
    JSLITE.dom.fly("tree").on("click", fnJSDoc);
    JSLITE.dom.fly("response").on("click", fnJSDoc);

  })();

});
