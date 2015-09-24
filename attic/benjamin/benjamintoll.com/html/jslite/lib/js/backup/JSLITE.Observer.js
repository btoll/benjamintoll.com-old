/*
 * jsLite
 *
 * Copyright (c) 2009 - 2011 Benjamin Toll (benjamintoll.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */

/**
* @function Observer
* @param {None}
* @return {None}
* @describe <p>Abstract class, useful for custom events. This reference type is meant to be extended, i.e., <blockquote><code>JSLITE.extend(MyNewClass, JSLITE.Observer);</code></blockquote></p>
*/
//<source>
JSLITE.Observer = function () {
};
//</source>

JSLITE.Observer.prototype = {

  constructor: JSLITE.Observer,

  /**
  * @function JSLITE.Observer.subscriberEvents
  * @param {Array/String} v
  * @return {None}
  * @describe <p>Define the custom events that the type will expose. Pass either an array where the property of custom events or a comma-delimited list of strings in the constructor. If the object then subscribes to one of the exposed events, the function will be mapped to the event name in <code>this.events</code>.</p>
  * @example
var Person = function (name) {
  this.name = name;
  this.subscriberEvents("say", "walk");
};

--or--

var Person = function (name) {
  this.name = name;
  this.subscriberEvents(["say", "walk"]);
};
  */
  //<source>
  subscriberEvents: function (v) {

    if (!this.events) {
      this.events = {};
    }
    if (typeof v === "string") {
      for (var i = 0, args = arguments; args[i]; i++) {
        if (!this.events[args[i]]) {
          this.events[args[i]] = [];
        }
      }
    } else if (JSLITE.isArray(v)) {
      v.forEach(function (a) {
        this.events[a] = [];
      }.bind(this));
    }

  },
  //</source>

  /**
  * @function JSLITE.Observer.fire
  * @param {String} sType
  * @param {Object} options Optional
  * @return {Boolean}
  * @describe <p>Publishes a custom event. The first argument passed to the observer is an object with the following defined properties:</p>
<ul>
  <li><code>target</code> A reference to observed object.</li>
  <li><code>type</code> The name of the event.</li>
</ul>
<p>The second argument is an optional <code>options</code> object that contains other data to pass to the subscribing event listener(s).</p>
<p>Note that custom events bubble, so returning <code>false</code> in the callback will prevent this behavior.</p>
  */
  //<source>
  fire: function (sType, options) {

    var oEvents = this.events,
      bBubble = true,
      oCustomEvent;

    if (!oEvents) {
      return false;
    }

    if (oEvents[sType]) {
      oCustomEvent = {
        target: this,
        type: sType
      };
      if (options && !JSLITE.isEmpty(options)) {
        JSLITE.apply(oCustomEvent, options);
      }
      oEvents[sType].forEach(function (fn) {
        bBubble = fn.call(this, oCustomEvent); //will return false if bubbling is canceled; NOTE a callback returning undefined will not prevent the event from bubbling;
      }.bind(this));
    } else {
      bBubble = false;
    }
    return bBubble;

  },
  //</source>

  /**
  * @function JSLITE.Observer.isObserved
  * @param {String} sType
  * @return {Boolean}
  * @describe <p>Returns <code>true</code> if the event has one or more subscribers (<code>false</code> otherwise). Note it doesn't query for a specific handler.</p>
  */
  //<source>
  isObserved: function (sType) {

    return !!this.events[sType];

  },
  //</source>

  /**
  * @function JSLITE.Observer.purgeSubscribers
  * @param {None}
  * @return {None}
  * @describe <p>Removes all of an object's event handlers.</p>
  */
  //<source>
  purgeSubscribers: function () {

    this.events = {};

  },
  //</source>

  /**
  * @function JSLITE.Observer.subscribe
  * @param {String} sType Event to listen for
  * @param {Function} fn Callback
  * @return {None}
  * @describe <p>Listen to a pre-defined event by passing the name of the event to and the callback to be invoked when that event occurs.</p>
  */
  //<source>
  subscribe: function (sType, fn) {

    if (!this.events) {
      return; //if there are no events then we know that the subscriberEvents api wasn't used, so exit;
    }
    var oEvents = this.events;
    if (!oEvents[sType]) {
      return; //can't subscribe to an event that wasn't established within the constructor!;
      //oEvents[sType] = [];
    }
    if (oEvents[sType]) {
      oEvents[sType].push(fn);
    } else {
      oEvents[sType] = fn;
    }

  }.assert(String, Function),
  //</source>

  /**
  * @function JSLITE.Observer.unsubscribe
  * @param {String} sType
  * @param {Function} fn
  * @return {None}
  * @describe <p>Remove the event listener that was previously subscribed.</p>
  */
  //<source>
  unsubscribe: function (sType, fn) {

    var oEvents = this.events;
    if (oEvents && oEvents[sType]) {
      oEvents[sType].remove(fn);
    }

  }.assert(String, Function)
  //</source>

};
