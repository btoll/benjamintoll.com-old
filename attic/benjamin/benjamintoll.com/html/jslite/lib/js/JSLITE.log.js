/*
 * jsLite
 *
 * Copyright (c) 2009 - 2011 Benjamin Toll (benjamintoll.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */

/*
  this is designed to behave like FF's console.log;
*/

/**
* @function log
* @param {Mixed}
* @return {Mixed}
* @mixin {<a href="#jsdoc">JSLITE.Observer</a>}
* @describe
<p>This is a Singleton.</p>
* @example
//seed the logger;

JSLITE.log.enable({
  JSLITE_systemLog: function (e) {
    $("log").innerHTML += "<br />" + e.log;
  },

  debug: function (e) {
    $("debug").innerHTML += "<br />" + e.log;
  },

  error: function (e) {
    $("error").innerHTML += "<br />" + e.log;
  }
});

//now we can use the log types we've seeded, plus add or disable any others;

JSLITE.log.debug([1, 2, 3], "bob", JSLITE.log);
JSLITE.log.debug("An example of type coercion is ", 10 == "10", JSLITE.log instanceof Object);

JSLITE.log.enable("phillies", function () {});

JSLITE.log.disable("debug");

JSLITE.log.debug("debug");

JSLITE.log.error("error!");
*/
//<source>
JSLITE.apply(JSLITE.log = (function () { //create a mixin singleton object;
  var oMethods = {},
    aSystemLog = [],
    aArgs = [],
    aLogTypes = [],
    sMethod,

  fnLogEvent = function (sLog) {
    aSystemLog.push(sLog);
    JSLITE.log.fire("JSLITE_systemLog", {
      log: sLog,
      archive: aSystemLog
    });
  },

  fnGetValueFromType = function (aType) {
    var i = 0,
      len = aType.length,
      arr = [],
      vType;

    for (; i < len; i++) {
      vType = aType[i];
      switch (true) {
        case typeof vType === "string":
        case typeof vType === "number":
        case typeof vType === "boolean":
        case vType instanceof Object:
          arr.push(vType);
          break;
        case vType instanceof Array:
          arr.push(vType.toString());
          break;
        case typeof vType === "function":
          arr.push(vType());
          break;
      }
    }
    return arr.join(" ");
  },

  log = function (args, state) {
    aLogTypes.length = 0; //reset this array every time log is called;

    switch (true) {
      case args[0] instanceof Array: //args looks like (["debug", fn]);
        aArgs = args[0];
        break;
      case typeof args === "string": //args looks like ("debug"), comes from when an object of log types is passed to enable();
        aArgs = [args];
        break;
      default: //args looks like ("debug", fn);
        aArgs = [args[0]];
    }

    for (var i = 0, len = aArgs.length; i < len; i++) {
      sMethod = aArgs[i]; //optimize;
      oMethods[sMethod] = state; //manage the hash;
      aLogTypes.push(sMethod);
      JSLITE.log[sMethod] = (function (sMethod) {
        return function (type) {
          if (!oMethods[sMethod]) { //the state var is the crux; simply manage your object hash to determine how the method is called;
            fnLogEvent("The " + sMethod + " log type has been disabled.");
          } else {
            this.fire(sMethod, {
              log: fnGetValueFromType(JSLITE.makeArray(arguments))
            });
          }
        };
      }(sMethod)); //each method var must be scoped as a local var in the closure so pass it in as a function argument;
    }
    fnLogEvent("The following log types have been " + (state ? "enabled" : "disabled") + ": " + aLogTypes.toString() + ".");
  };

  return {
    disable: function () {
      log(arguments, false); //simply turn the state off;
    },
    enable: function (v) {
      var field;

      if (v.constructor === Object) { //remember to expect either an object or string;
        for (field in v) {
          if (v.hasOwnProperty(field) && field !== "logfile") {
            this.subscriberEvents(field); //w/o registering the event it can't be subscribed to;
            this.subscribe(field, v[field]);
            log(field, true); //the second argument tells the private log function how to behave;
          }
        }
      } else {
        this.subscriberEvents(v);
        if (!arguments[1]) { //not passing a second argument (a function) allows us to enable a log and then subscribe to it later;
          return;
        }
        this.subscribe(v, arguments[1]);
        log(arguments, true);
      }
    },
    flush: function () {
      //flush temporarily so the logs don't take up too much memory;
      aSystemLog.length = 0;
    }
  };
}()), JSLITE.Observer.prototype); //mixin the Observer type;
//</source>

JSLITE.log.enable("JSLITE_systemLog");
