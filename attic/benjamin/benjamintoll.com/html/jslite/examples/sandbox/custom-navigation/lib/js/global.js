/*
NOTES:

TESTED in the current releases of Chrome, FF, Safari and Opera, and IE 6
It was very important for the application to function in all browsers.  Older browsers such as IE 6 that don't support more current css don't currently appear the same visually, but this could be remedied using a separate stylesheet specifically targeting the browser using a conditional comment.

KNOWN ISSUES: Safari only supports reverse sorts
*/

/*
NOTE that the data structure that creates the data structure resides outside of the singleton and can be plugged into the app using the Netflix.setNavItem API.  This show how easy it is to fetch the data from any local or remote system via an http request and json response.
*/
var aItems = [
  {
    label: "Suggestions For You",
    assets: [
      "14546619.jpg",
      "408939.jpg",
      "443317.jpg",
      "445522.jpg",
      "528009.jpg",
      "541027.jpg"
    ]
  },
  {
    label: "Recently Watched",
    assets: [
      "60000890.jpg",
      "60002556.jpg",
      "60020435.jpg",
      "60022048.jpg",
      "60022922.jpg",
      "60023619.jpg"
    ]
  },
  {
    label: "New Arrivals",
    assets: [
      "60028202.jpg",
      "60030359.jpg",
      "60030529.jpg",
      "60030653.jpg",
      "60034311.jpg",
      "60035214.jpg",
      "70112730.jpg",
      "70113005.jpg",
      "70117293.jpg",
      "70117370.jpg"
    ]
  },
  {
    label: "Instant Queue",
    assets: [
      "70003040.jpg",
      "70011274.jpg",
      "70018715.jpg",
      "70019981.jpg",
      "70019994.jpg",
      "70020062.jpg",
      "70023522.jpg",
      "806456.jpg"
    ]
  }
];

var Netflix = (function () {
  var create = JSLITE.dom.create,
    get = JSLITE.dom.get,
    iColPerRow = 4,
    iRow,
    oNavContainer = null,
    oContentContainer = null,
    oCache = {},
    oAddElementCache = {},
    sAssetDir = "",
    iScrollDistance = 260,
    fnMakeNavArea = function () {
      for (var n = 0, len = oNav.items.length; n < len; n++) {
        oNavContainer.dom.appendChild(create({tag: "div",
          attr: {
            id: "navBox" + n,
            className: "navBox",
            innerHTML: oNav.items[n].label,
            row: n
          }
        }).dom);
      }
    },
    fnSelect = function (e) {
      if (get(".movieBox.selected").dom) { //if a dom element already has been selected then first remove the "selected" class;
        get(".movieBox.selected").removeClass("selected");
      }
      this.addClass("selected");
    },
    fnMakeRow = function (arr) {
      var aCells = [];

      for (var i = 0, len = arr.length; i < len; i++) {
        aCells.push(create({tag: "td",
          attr: {
            className: "movieBox",
            id: "contentBoxCell" + iRow + (i % iColPerRow), //since the concatenation begins w/ a string everything will be concatenated as such;
            col: i % iColPerRow,
            row: iRow
          },
          children: [
            create({tag: "img",
              attr: {
                src: sAssetDir + arr[i]
              }
            })
          ]
        }));
      }
      return create({tag: "tr",
        attr: {
          id: "contentBoxRow" + iRow
        },
        children: aCells
      });
    },
    fnMakeContent = function (sNavItem) {
      var oItem,
        aRows = [],
        arr = [],
        oTable = null;

      if (JSLITE.isIE || !oCache[sNavItem]) { //ie6 doesn't like appending the table from the cache, not sure why;
        for (var i = 0, len = oNav.items.length; i < len; i++) {
          oItem = oNav.items[i];
          if (oItem.label === sNavItem) {
            var a = [],
              n = 0,
              iEnd = iColPerRow;
  
            iRow = 0;
            while ((a = oItem.assets.slice(n, iEnd)) && a.length) { //get rows of 4 from the oItem.assets array until there's none left;
              aRows.push(fnMakeRow(a));
              a.length = 0; //reset the array each time;
              n += iColPerRow; //increment the start index;
              iEnd += iColPerRow; //increment the end index;
              iRow++; //increment the row count;
            }
            oTable = create({tag: "table",
              attr: {
                id: JSLITE.util.camelCase(sNavItem)
              },
              children: [
                create({tag: "tbody",
                  children: aRows
                })
              ]
            });
            oCache[sNavItem] = oTable;
            oContentContainer.append(oTable);
          }
        }
      } else {
        oContentContainer.append(oCache[sNavItem]);
      }
    },
    oNav = {
      items: [] //this will be a array of objects that will tell the app how to build the nav bar and which assets are mapped to each nav item;
    };

  return {

    /**
    * @function Netflix.init
    * @param {None}
    * @return {None}
    * @describe Initializes the app by creating the nav and content containers and then creating their respective content.  Gives the first category in the nav menu focus.  Note that several methods allow for re-initializing init when new dom elements are added or a sort algorithm.
    */
    init: function () {
      if (this.getRows() === 0) {
        throw new Error("There are no nav items to build!");
      }

      var oNav = get("nav"),
        oContent = get("content"),
        sLabel;

      if ($("navContainer")) {
        $("navContainer").innerHTML = "";
        $("contentContainer").innerHTML = "";
      } else {
        oNavContainer = create({tag: "div", attr: { id: "navContainer" }});
        oContentContainer = create({tag: "div", attr: { id: "contentContainer" }, parent: $("content")});
      }

      fnMakeNavArea();
      oNav.append(oNavContainer);
      Netflix.makeContentArea(get(".navBox").value());

      /*
        inefficient, but ie6 needs to recreate these dom elements rather than getting them from cache if init() is called again after a category is added and with the true flag set (to re-init);
        this is necessary when something is added to the dom (content or nav) and then the app is re-initialized and the added dom elements were added to the table that is the focus when the page is loaded;
      */
      if (JSLITE.isIE && !JSLITE.isEmpty(oAddElementCache)) {
        for (sLabel in oAddElementCache) {
          Netflix.addElement(oAddElementCache[sLabel]);
        }
      }

      get(".navBox").addClass("hasNavFocus").dom.focus(); //give focus to the first nav item;
    },

    /**
    * @function Netflix.addElement
    * @param {Object} Options
    * @return {None}
    * @describe Adds a new element to the parent passed in the options parameter. Note about adding elements to the content tables: since each table is stored in cache and retrieved/removed each time the nav bar is navigated, when a new element is added to a particular table it must be stored in the element cache if it's parent node isn't presently in the dom.  This element cache is checked everytime the nav bar is navigated up or down to see if a new element is to be added to the dom, b/c at that time the parent node is in the dom and the new element can be added.  So, this allows new elements to "added" to the dom no matter if the parent element is currently in the dom (it will be added later when it is).  Sort before adding new elements.
    */
    addElement: function (o) {
      if (!o) {
        throw new Error("You must provide a new element!");
      }

      if ($(JSLITE.util.camelCase(o.label))) {
        var oParent = o.getParent(),
          oCloned;

        for (var i = 0, len = oParent.length; i < len; i++) {
          oCloned = JSLITE.dom.getDom(o.newElem).cloneNode(true);
          oParent[i].appendChild(oCloned);
        }
        if (JSLITE.isIE) { //ie needs to create the new elements each time, so cache the metadata object;
          oAddElementCache[o.label] = o;
        }
      } else {
        oAddElementCache[o.label] = o;
      }
    },

    /**
    * @function Netflix.addRow
    * @param {Object} Options
    * @param {Boolean} bRefresh True if the init() should be called to re-initialize the app with the new changes
    * @return {None}
    * @describe Adds a new element(s) to an existing table.  The name is a slight misnomer, as there are no constraints as to how many elements can be added.  Even there a row is defined in the iColPerRow variable, each row(s) will be dynamically generated regardless of the number of elements passed to this method.
    */
    addRow: function (o, bRefresh) {
      if (!o) {
        throw new Error("You must provide a category row!");
      }

      var oItem = null,
        sLabel = o.label;

      for (var i = 0, len = oNav.items.length; i < len; i++) {
        oItem = oNav.items[i];
        aAssets = oItem.assets;
        if (oItem.label === sLabel) {
          oItem.assets = oItem.assets.concat(o.assets);
          delete oCache[sLabel]; //delete the cached entry so it will pick up the new additions(s);
        }
      }
      if (bRefresh) { //should the new nav items be added now?;
        this.init();
      }
    },

    /**
    * @function Netflix.getElementCache
    * @param {None}
    * @return {None}
    * @describe Allows access to the oAddElementCache object.
    */
    getElementCache: function () {
      return oAddElementCache;
    },

    /**
    * @function Netflix.getRows
    * @param {None}
    * @return {None}
    * @describe Allows access to the number of current categories.
    */
    getRows: function () {
      return oNav.items.length;
    },

    /**
    * @function Netflix.makeContentArea
    * @param {String} sNavItem
    * @return {None}
    * @describe Creates the dom structure for the specified nav item.  In this particular case, it's a table.  Also, it sets the title of the content area, which mirrors the name of the nav item.
    */
    makeContentArea: function (sNavItem) {
      if (!sNavItem) {
        throw new Error("You must provide a category name!");
      }

      get("#content h1").value(sNavItem); //set the title in the content area;
      fnMakeContent(sNavItem);
    },

    /**
    * @function Netflix.setAssetDir
    * @param {String} sPath
    * @return {None}
    * @describe Sets the path where the assets are stored in the filesystem.
    */
    setAssetDir: function (sPath) {
      sAssetDir = sPath;
    },

    /**
    * @function Netflix.setNavItem
    * @param {Mixed} vItem Could be an object or an array of objects for new categories
    * @param {Boolean} bRefresh True if the init() should be called to re-initialize the app with the new changes
    * @return {None}
    * @describe Adds new categories(s) to the nav area.
    */
    setNavItem: function (vItem, bRefresh) {
      if (!vItem) {
        throw new Error("You must provide a category!");
      }

      var aItems = oNav.items;

      if (!(vItem instanceof Array)) { 
        aItems.push(vItem);
      } else {
        vItem.forEach(function (v) {
          aItems.push(v);
        }); 
      }
      if (bRefresh) { //should the new nav items be added now?;
        this.init();
      }
    },

    /**
    * @function Netflix.getScrollDistance
    * @param {None}
    * @return {None}
    * @describe Gets the distance in pixels that an individual scroll up or down should move.
    */
    getScrollDistance: function () {
      return iScrollDistance;
    },

    /**
    * @function Netflix.setScrollDistance
    * @param {Number} iDistance
    * @return {None}
    * @describe Sets the distance in pixels that an individual scroll up or down should move.
    */
    setScrollDistance: function (iDistance) {
      iScrollDistance = iDistance;
    },

    /**
    * @function Netflix.sort
    * @param {Object} Options
    * @param {Boolean} bRefresh True if the init() should be called to re-initialize the app with the new changes
    * @return {None}
    * @describe Sorts both the items (categories) and the assets (table cell contents). If sorting the items, simply specify the type of sort ("sort", "reverse", or custom function).  If sorting the assets, specify the sort type and the label, which is the category whose assets are to be sorted. Note that if doing a default sort ("sort"), it's not necessary to specify the type.  Sort before adding new elements.
    */
    sort: function (o, bRefresh) {
      if (!o.type) {
        throw new Error("A sort type must be provided!");
      }

      var v = o.how,
        sLabel = o.label;

      var fnSort = function (arr) {
        switch (true) {
          case typeof v === "undefined":
            arr.sort();
            break;
          case typeof v === "string" && v === "reverse":
            arr.reverse();
            break;
          case typeof v === "function":
            arr.sort(v);
            break;
        }
      }

      switch (o.type) {
        case "items":
          fnSort(oNav.items);
          break;

        case "assets":
          for (var i = 0, len = oNav.items.length; i < len; i++) {
            oItem = oNav.items[i];
            aAssets = oItem.assets;
            if (oItem.label === sLabel) {
              //fnSort(aAssets);
              fnSort(oNav.items[i].assets);
            }
          }
          break;
      }

      if (bRefresh) { //should the nav items be resorted now?;
        if (oCache[sLabel]) {
          delete oCache[sLabel];
        }
        this.init();
      }
    }
  };

}());
  
JSLITE.ready(function () {
  var create = JSLITE.dom.create,
    get = JSLITE.dom.get,
    bNavNavigation = true,
    bContentNavigation = false;

  Netflix.setAssetDir("box_art/");
  Netflix.setNavItem(aItems);

  Netflix.init();

  Netflix.sort({
    type: "items",
    how: function (a, b) {
      return a.label > b.label;
    }
  }, true);

  Netflix.sort({
    type: "assets",
    label: "Suggestions For You",
    how: function (a, b) {
      return a < b;
    }
  }, true);

  var oNewElem = create({tag: "input",
    attr: {
      className: "testElement",
      value: "New Release"
    }
  });

  var oNewElem2 = create({tag: "input",
    attr: {
      className: "testElement",
      value: "Oldies but Goodies"
    }
  });

  Netflix.addElement({
    label: "Suggestions For You",
    newElem: oNewElem,
    getParent: function () {
      return JSLITE.dom.gets("td", $("contentBoxRow0")).elements;
    }
  });

  Netflix.addElement({
    label: "Recently Watched",
    newElem: oNewElem,
    getParent: function () {
      return JSLITE.dom.gets("td", $("contentBoxRow1")).elements;
    }
  });

  Netflix.addRow({
    label: "Recently Watched",
    assets: [
      "70077176.jpg",
      "70079918.jpg",
      "70108140.jpg",
      "70112727.jpg",
      "70112730.jpg",
      "70113005.jpg",
      "70117293.jpg",
      "70117370.jpg",
      "806456.jpg"
    ]
  });

  Netflix.addRow({
    label: "Instant Queue",
    assets: [
      "60022048.jpg",
      "60022922.jpg",
      "60023619.jpg",
      "60028202.jpg"
    ]
  }, true);

  Netflix.setNavItem({
    label: "Test Category",
    assets: [
      "60002556.jpg",
      "60020435.jpg",
      "60022048.jpg",
      "60022922.jpg"
    ]
  }, true);

  Netflix.addElement({
    label: "Test Category",
    newElem: oNewElem2,
    getParent: function () {
      return JSLITE.dom.gets("td", $("contentBoxRow0")).elements;
    }
  });

  get(document).on("keydown", function (e) {
    var oFocusedElement = null,
      oTemp = null,
      bRemoveNavFocus = false,
      bRemoveContentFocus = false,
      iRow,
      oElementCache = null,
      sLabel;

    if (bNavNavigation) {
      oFocusedElement = get(".hasNavFocus");
      iRow = oFocusedElement.dom.row;
      switch (e.keyCode) {
        case 13: //enter;
          fnSelect.call(oFocusedElement, e); break;
        case 38: //up;
          oTemp = get("navBox" + (iRow - 1));
          if (oTemp) {
            oTemp.addClass("hasNavFocus");
            $("contentContainer").innerHTML = "";
            bRemoveNavFocus = true;
          }
          break;
        case 39: //right;
          get(".movieBox").addClass("hasContentFocus").dom.focus();
          oFocusedElement.addClass("navKeepFocus");
          bNavNavigation = false;
          bContentNavigation = true;
          break;
        case 40: //down;
          oTemp = get("navBox" + (iRow + 1));
          if (oTemp) {
            oTemp.addClass("hasNavFocus");
            $("contentContainer").innerHTML = "";
            bRemoveNavFocus = true;
          }
          break;
        case 37: //left;
          //there will never be a left navigation move from the nav menu;
          break;
      }

      if (bRemoveNavFocus) {
        oFocusedElement.removeClass("hasNavFocus");
        Netflix.makeContentArea(get(".hasNavFocus").value());

        /*
          see if there are any elements to be added to this particular category;
          see the comment in the Netflix.addElement method to understand why this cache is used;
        */
        if (oTemp) {
          sLabel = oTemp.value();
          oElementCache = Netflix.getElementCache();
          if (oElementCache[sLabel]) {
            Netflix.addElement(oElementCache[sLabel]);
            if (!JSLITE.isIE) {
              delete oElementCache[sLabel];
            }
          }
        }
      }

    } else if (bContentNavigation) {
      oFocusedElement = get(".hasContentFocus");
      iRow = oFocusedElement.dom.row,
      iDistance = Netflix.getScrollDistance();

      switch (e.keyCode) {
        case 13: //enter;
          alert(get("img", oFocusedElement.dom).dom.src);
          break;
        case 38: //up;
          if (iRow) {
            $("contentContainer").scrollTop -= iDistance;
            get("contentBoxCell" + (iRow - 1) + oFocusedElement.dom.col).addClass("hasContentFocus");
            bRemoveContentFocus = true;
          }
          break;
        case 39: //right;
          if (oFocusedElement.dom.nextSibling) {
            oTemp = get("contentBoxCell" + iRow + (oFocusedElement.dom.col + 1));
            if (oTemp) { //same thing with the string concatenation as above;
              oTemp.addClass("hasContentFocus");
              bRemoveContentFocus = true;
            }
          }
          break;
        case 40: //down;
          if (iRow < Netflix.getRows()) {
            oTemp = get("contentBoxCell" + (iRow + 1) + oFocusedElement.dom.col);
            if (oTemp) {
              $("contentContainer").scrollTop += iDistance;
              oTemp.addClass("hasContentFocus");
              bRemoveContentFocus = true;
            }
          }
          break;
        case 37: //left;
          if (oFocusedElement.dom.previousSibling && oFocusedElement.dom.previousSibling.row === iRow) {
            get("contentBoxCell" + iRow + (oFocusedElement.dom.col - 1)).addClass("hasContentFocus");
            bRemoveContentFocus = true;
          } else {
            bNavNavigation = true;
            bContentNavigation = false;
            bRemoveContentFocus = true;
            JSLITE.dom.get(".navKeepFocus").removeClass("navKeepFocus");
            $("contentContainer").scrollTop = 0; //scroll back to top when focus goes back to the nav;
          }
          break;
      }

      if (bRemoveContentFocus) {
        oFocusedElement.removeClass("hasContentFocus");
      }

    }

    e.preventDefault();
  });

});
