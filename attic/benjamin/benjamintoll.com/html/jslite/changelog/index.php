<?php
$title = "benjamintoll.com - jsLite Changelog Page";
$id = "changelog";
$styles = "";
$scripts = "";

        require_once("../../lib/includes/header.php");
        require_once("../../lib/includes/branding.php");
      ?>

      <hr />
      <span class="pageHeader">Changelog</span>
      <hr />

      <ul id="changelogRoot">
        <li><p class="version">2.0.1</p>
          <ul>
            <li><a href="http://jslite.benjamintoll.com/api/#JSLITE.ux.Pager"><code>Pagers</code></a> can now define a custom template to display their page information. Please see the <a href="../examples/">examples page</a> for more information.</li>
          </ul>
        </li>
        <li><p class="version">2.0</p>
          <ul>
            <li>Added drag and drop functionality.</li>
          </ul>
        </li>
        <li><p class="version">1.9</p>
          <ul>
            <li>Added an animation utility and an <code>animate</code> method on every JSLITE.Element element. Please see <a href="http://jslite.benjamintoll.com/api/#JSLITE.ux.AnimationManager"><code>JSLITE.ux.AnimationManager</code></a>, <a href="http://jslite.benjamintoll.com/api/#JSLITE.ux.Animation"><code>JSLITE.ux.Animation</code></a> and <a href="http://jslite.benjamintoll.com/api/#JSLITE.Element.Animate"><code>JSLITE.Element
.Animate</code></a>.</li>
            <li>Added a custom logger, <a href="http://jslite.benjamintoll.com/api/#JSLITE.log"><code>JSLITE.log</code></a>.</li>
            <li>Added the <a href="http://jslite.benjamintoll.com/api/#JSLITE.dom.find"><code>JSLITE.dom.find</code></a> method.</li>
            <li>Added the <a href="http://jslite.benjamintoll.com/api/#JSLITE.deepCopy"><code>JSLITE.deepCopy</code></a> method.</li>
            <li>Added the <a href="http://jslite.benjamintoll.com/api/#JSLITE.Element.value"><code>JSLITE.Element.value</code></a> method.</li>
            <li>Added the <a href="http://jslite.benjamintoll.com/api/#JSLITE.ux.fade"><code>JSLITE.ux.fade</code></a> method.</li>
            <li>Refactored <a href="http://jslite.benjamintoll.com/api/#JSLITE.domQuery"><code>JSLITE.domQuery</code></a> to be a singleton because I needed to expose some of its functionality to other methods, in part
icular <a href="http://jslite.benjamintoll.com/api/#JSLITE.dom.find"><code>JSLITE.dom.find</code></a>. This change should not effect developers as <code>JSLITE.domQuery</code> was never meant to be called directly.</li
>
            <li>Refactored all of the <a href="http://jslite.benjamintoll.com/api/#JSLITE.ux.Grid"><code>JSLITE.ux.Grid</code></a> functionality to be more flexible. Removed <code>JSLITE.ux.JsonStore</code> and added b
oth the <a href="http://jslite.benjamintoll.com/api/#JSLITE.ux.RemoteStore"><code>JSLITE.ux.RemoteStore</code></a> and the <a href="http://jslite.benjamintoll.com/api/#JSLITE.ux.LocalStore"><code>JSLITE.ux.LocalStore</
code></a> to allow for just two stores, local and remote, that can be used to fetch and store different data based upon the value of its <code>type</code> property and its location.</li>
            <li>Refactored <a href="http://jslite.benjamintoll.com/api/#JSLITE.Element.removeClass"><code>JSLITE.Element.removeClass</code></a> so it can now also take an array of classes to remove.</li>
            <li>Refactored <a href="http://jslite.benjamintoll.com/api/#JSLITE.Element.parent"><code>JSLITE.Element.parent</code></a> so it can now also take an argument to specify what node name the parent element sho
uld match.</li>
            <li>The Selectors API is now being detected using feature detection.</li>
            <li><a href="http://jslite.benjamintoll.com/api/#JSLITE.dom.gets"><code>JSLITE.dom.gets</code></a> now implements part of the Selectors API under the hood if the client's browser supports it (document.query
SelectorAll).</li>
            <li>Refactored <code>JSLITE.ajax</code> so it now publishes an <code>abort</code> event which can be subscribed to (the event is fired when a timeout is reached). Also, fixed a bug where timeouts weren't be
ing set properly.</li>
            <li>Refactored <a href="http://jslite.benjamintoll.com/api/#JSLITE.dom.get"><code>JSLITE.dom.get</code></a> so it can now also accept a CSS selector as an argument. If more than one element is found, only t
he first one is returned. This is designed to be backwards-compatible so previous APIs won't break.</li>
            <li>Refactored <a href="http://jslite.benjamintoll.com/api/#JSLITE.Element.on"><code>JSLITE.Element.on</code></a> to accept either a string or an array of event types.</li>
            <li>Refactored <a href="http://jslite.benjamintoll.com/api/#JSLITE.Element.un"><code>JSLITE.Element.un</code></a> to accept either a string or an array of event types.</li>
            <li>Fixed a bug in <a href="http://jslite.benjamintoll.com/api/#JSLITE.Element.getStyle"><code>JSLITE.Element.getStyle</code></a> where it wasn't returning the correct value for current versions of Opera.</
li>
            <li>Fixed a bug in <a href="http://jslite.benjamintoll.com/api/#JSLITE.dom.create"><code>JSLITE.dom.create</code></a> where it wasn't applying <code>float</code> properties in the <code>style</code> object.
</li>
            <li>Added more API documentation.</li>
          </ul>
        </li>
        <li><p class="version">1.8</p>
          <ul>
            <li>Updated the API docs to reflect the custom events associated with a control, i.e., <a href="http://jslite.benjamintoll.com/api/#JSLITE.ux.Grid"><code>the grid</code></a>.</li>
            <li>Added basic grid functionality with the <a href="http://jslite.benjamintoll.com/api/#JSLITE.ux.Grid"><code>JSLITE.ux.Grid</code></a> type. This works in conjunction with the <a href="http://jslite.benjamintoll.com/api/#JSLITE.ux.ColumnModel"><code>JSLITE.ux.ColumnModel</code></a>, <a href="http://jslite.benjamintoll.com/api/#JSLITE.ux.DataStore"><code>JSLITE.ux.DataStore</code></a> and <a href="http://jslite.benjamintoll.com/api/#JSLITE.ux.Reader"><code>JSLITE.ux.Reader</code></a> types.</li>
            <li>Refactored the <a href="http://jslite.benjamintoll.com/api/#JSLITE.Observer"><code>JSLITE.Observer</code></a> type.</li>
            <li>Renamed the JSLITE.Observer.exposeEvents method to <a href="http://jslite.benjamintoll.com/api/#JSLITE.Observer.subscriberEvents"><code>JSLITE.Observer.subscriberEvents</code></a>.</li>
            <li>Added <code>Function.prototype.bind</code> to allow for functions to be executed in any object context.</li>
            <li>Added <a href="http://jslite.benjamintoll.com/api/#JSLITE.Element.show"><code>JSLITE.Element.show</code></a>.</li>
            <li>Added <a href="http://jslite.benjamintoll.com/api/#JSLITE.Element.getStyle"><code>JSLITE.Element.getStyle</code></a>.</li>
            <li>Removed <code>JSLITE.dom.getStyle</code>.</li>
            <li>Rewrote <a href="http://jslite.benjamintoll.com/api/#JSLITE.Element.append"><code>JSLITE.Element.append</code></a> to allow for both a single element or a collection of elements to be appended to a parent.</li>
            <li>Rewrote <a href="http://jslite.benjamintoll.com/api/#JSLITE.Element.remove"><code>JSLITE.Element.remove</code></a> to also allow for all the children of an element to be removed.</li>
            <li>Fixed a bug in <a href="http://jslite.benjamintoll.com/api/#JSLITE.ajax.load"><code>JSLITE.ajax.load</code></a> that did not allow for synchronous requests.</li>
          </ul>
        </li>
        <li><p class="version">1.7</p>
          <ul>
            <li>Added the <a href="http://jslite.benjamintoll.com/api/#JSLITE.Observer"><code>JSLITE.Observer</code></a> abstract reference type that can be extended to allow for custom events.</li>
            <li>Added <code>JSLITE.dom.closest</code>.</li>
            <li>Rewrote <a href="http://jslite.benjamintoll.com/api/#JSLITE.domQuery"><code>JSLITE.domQuery</code></a>, the CSS selector engine, to support child selectors, adjacent sibling selectors and attribute filters (please see documentation).</li>
            <li>Removed <code>JSLITE.dom.getElementsByClassName</code>. The enhanced CSS Selector Engine now supports this functionality and more.</li>
            <li>Removed <code>JSLITE.dom.nodeCrawler</code>. The enhanced CSS Selector Engine now supports this functionality and more.</li>
            <li>Removed <code>JSLITE.dom.removeClassName</code>. The enhanced CSS Selector Engine now supports this functionality and more.</li>
            <li>Extracted DOM-related utility functions from <code>JSLITE.js</code>, placing them within the new <code>JSLITE.util</code> namespace in <code>JSLITE.util.js</code>.</li>
            <li>Added:
              <ul>
                <li><a href="http://jslite.benjamintoll.com/api/#JSLITE.Element.append"><code>JSLITE.Element.append</code></a></li>
                <li><a href="http://jslite.benjamintoll.com/api/#JSLITE.Element.remove"><code>JSLITE.Element.remove</code></a></li>
              </ul>
            </li>
            <li>Refactored:
              <ul>
                <li><code>JSLITE.ajax</code></li>
                <li><a href="http://jslite.benjamintoll.com/api/#JSLITE.ux.Tooltip"><code>JSLITE.ux.Tooltip</code></a></li>
                <li><a href="http://jslite.benjamintoll.com/api/#JSLITE.extend"><code>JSLITE.extend</code></a></li>
                <li><a href="http://jslite.benjamintoll.com/api/#JSLITE.Element.tooltip"><code>JSLITE.Element.tooltip</code></a></li>
              </ul>
            </li>
            <li>Fixed a bug in <a href="http://jslite.benjamintoll.com/api/#JSLITE.dom.formElements"><code>JSLITE.dom.formElements</code></a> where it was collecting any element with a <code>name</code> attribute instead of just form elements.</li>
            <li>Began internationalization:
              <ul>
                <li>Changed <code>toLowerCase</code> to <code>toLocaleLowerCase</code></li>
                <li>Changed <code>toUpperCase</code> to <code>toLocaleUpperCase</code></li>
              </ul>
            </li>
          </ul>
        </li>
        <li><p class="version">1.6</p>
          <ul>
            <li>Allows for either a JSLITE.Element or a plain old DOM element to be returned for some DOM manipulation and retrieval queries (please refer to the <a href="../api/">API documentation</a> for more details).</li>
            <li>All methods in a JSLITE.Element wrapper return the wrapper to allow for chaining.</li>
            <li>Changed two property names in <a href="http://jslite.benjamintoll.com/api/#JSLITE.dom.create"><code>JSLITE.dom.create</code></a>:
              <ul>
                <li><code>elem</code> is now <code>tag</code></li>
                <li><code>attributes</code> is now <code>attr</code></li>
              </ul>
            </li>
          </ul>
        </li>
        <li><p class="version">1.5</p>
          <ul>
            <li>Added a simple CSS selector engine.</li>
          </ul>
        </li>
        <li><p class="version">1.x</p>
          <ul>
            <li>Core functionality.</li>
          </ul>
        </li>
      </ul>

    </div>

  <?php require_once("../../lib/includes/footer.php"); ?>

</body>
</html>
