/*
 * jsLite
 *
 * Copyright (c) 2009 - 2011 Benjamin Toll (benjamintoll.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */

JSLITE.ajax = (function () {

  /**
  * @property oDefaults
  * @type Object
  * @describe <p>Private. Contains the default configuration options which can be changed within the object literal passed as the parameter to <code><a href="#jsdoc">JSLITE.ajax.load</a></code>.</p>
  */
  //<source>
  var oDefaults = {
    type: "get",
    data: "html", //the data type that'll be returned from the server;
    url: "",
    postvars: "",
    headers: "", //the headers that will be returned (for HEAD requests only);
    timeout: 60000, //how long to wait before considering the request to be a timeout;
    complete: function () {},
    error: function () {},
    success: function () {},
    abort: function () {},
    async: true
  },
  //</source>

  fnGetXHR = function () {

    var aFactory = [
      function () { return new XMLHttpRequest(); },
      function () { return new ActiveXObject("MSXML2.XMLHTTP.3.0"); },
      function () { return new ActiveXObject("MSXML2.XMLHTTP"); },
      function () { return new ActiveXObject("Microsoft.XMLHTTP"); }
    ],
    i,
    len;

    for (i = 0, len = aFactory.length; i < len; i++) {
      try {
        aFactory[i]();
      } catch (e) {
        continue;
      }
      fnGetXHR = aFactory[i]; //memoize the function;
      return aFactory[i]();
    }

    /*if we get here than none of the methods worked*/
    throw new Error("XMLHttpRequest object cannot be created.");

  },

  fnSendRequest = function (xhr, options) {

    var timeoutLength = options.timeout; //we're going to wait for a request for x seconds before giving up;
    
    /*initialize a callback which will fire x seconds from now,
      canceling the request if it has not already occurred*/
    setTimeout(function () {
      if (xhr) {
        xhr.abort();
        options.abort();
      }
    }, timeoutLength);

    //watch for when the state of the document gets updated;
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (fnHttpSuccess(xhr)) { //check to see if the request was successful;
          options.success(fnHttpData(xhr, options)); //execute the success callback w/ the data returned from the server;

        } else { //otherwise, an error occurred so execute the error callback;
          options.error();
        }
        options.complete(); //call the completion callback;
        xhr = null; //clean up after ourselves to avoid memory leaks;
      }
    };

    if (options.type === "HEAD") { //open the asynchronous request (based upon the type of request);
      xhr.open(options.type, options.url);
    } else {
      xhr.open(options.type, options.url, options.async);
    }

    if (options.type === "post") { //establish the connection to the server;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(options.postvars);
    } else {
      xhr.send(null);
    }

  },

  fnHttpSuccess = function (r) { //determine the success of the HTTP response;
    try {
      //if no server status is provided and we're actually requesting a local file then it was successful;
      return !r.status && location.protocol === "file:" ||
  
        //any status in the 200 range is good;
        (r.status >= 200 && r.status < 300) ||

          //successful if the document has not been modified;
          r.status === 304 ||

            //Safari returns an empty status if the file has not been modified
            JSLITE.isSafari && typeof r.status === "undefined";

    } catch (e) {
    }
    //if checking the status failed then assume that the request failed;
    return false;
  },
  
  fnHttpData = function (r, options) { //extract the correct data from the HTTP response;

    var ct = r.getResponseHeader("content-type"), //get the content-type header;
      data;

    if (options.type === "HEAD") { //if a HEAD request was made, determine which header name/value pair to return (or all of them) and exit function;
      return !options.headers ? r.getAllResponseHeaders() : r.getResponseHeader(options.headers);
    }

    //if the specified type is "script", execute the returned text response as if it were javascript;
    if (options.data === "json") {
      return eval("(" + r.responseText + ")");
    }

    //determine if some form of xml was returned from the server;
    data = ct && ct.indexOf("xml") > -1;

    //get the xml document object if xml was returned from the server, otherwise return the text contents;
    data = options.data === "xml" || data ? r.responseXML : r.responseText;
    return data;
  };

  return {

    /**
    * @function JSLITE.ajax.get
    * @param {String} sURL The destination from where to fetch the data.
    * @return {String/XML/JSON}
    * @describe <p>Always performs a GET request and is synchronous. <code><a href="#jsdoc">JSLITE.Element.ajax</a></code> is an alias of this method and should be used when dealing with an <code><a href="#jsdoc">JSLITE.Element</a></code> or <code><a href="#jsdoc">JSLITE.Composite</a></code> object.</p>
    * @example
var oLink = JSLITE.dom.get("theLink");

var sResponse = oLink.ajax("http://localhost-jslite/sandbox/assert.html");
or
var sResponse = JSLITE.ajax.get("http://localhost-jslite/sandbox/assert.html");

oLink.tooltip(sResponse);
or
oLink.tooltip(JSLITE.ajax.get("http://localhost-jslite/sandbox/assert.html"));
    */
    //<source>
    get: function (sURL) {

      var xhr,
        options = JSLITE.apply(JSLITE.proto(oDefaults), {
          url: sURL,
          async: false
        }); 

      xhr = fnGetXHR();
      fnSendRequest(xhr, options);
      return xhr.responseText;

    },
    //</source>

    /**
    * @function JSLITE.ajax.load
    * @param {Object} opts An object literal.
    * @return {String/XML/JSON}
    * @describe <p>Used for general-purpose Ajax request. Define callbacks and other customizable features within <code>opts</code>.</p>
<p><a href="http://jslite.benjamintoll.com/examples/ajaxFormSubmission.php" rel="external">See an example of an Ajax form submission</a></p>
    * @example
var x = JSLITE.ajax.load({
  url: sURL,
  data: "html",
  type: "POST",
  success: function (sResponse) {
    $("myDiv").innerHTML = sResponse.HTMLify();
  }
});
    */
    //<source>
    load: function (opts) {

      var xhr,
        options = JSLITE.apply(JSLITE.proto(oDefaults), opts); //make a clone of oDefaults so each closure gets its own copy;

      xhr = fnGetXHR();
      fnSendRequest(xhr, options);
      if (!opts.async) {
        if (fnHttpSuccess(xhr)) {
          return fnHttpData(xhr, options);
        }
      }
  
    }
    //</source>

  };
  //</source>
  
}());
