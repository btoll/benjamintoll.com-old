<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>jsLite - JSLITE.Element.closest</title>
<style type="text/css">
.baz {
  background: green;
}
</style>
<?php
include_once("/home/benjamin/public_html/lib/includes/jslite_scripts.php");
?>
<script type="text/javascript">
JSLITE.ready(function () {

  JSLITE.dom.get(document).on("click", function (e) {
    var vElem = JSLITE.dom.get(e.target).closest("li");
    if (vElem) {
      vElem.toggleClass("baz");
    }
  });


});
</script>
</head>

<body>

<h3>This example uses <code>JSLITE.Element.closest</code> with event delegation.</h3>
<div id="to" class="tool foo">
  <ul id="theUL">
    <li id="one"><strong>one</strong></li>
    <li id="two"><strong>two</strong></li>
    <li id="three"><strong>three</strong></li>
    <li id="four" class="gremlin three">four
      <p><em>i am not!</em></p>
      <p><strong id="str">i am inside a &lt;strong&gt; element!</strong></p>
    </li>
    <li id="five"><em>five</em></li>
    <li id="six"><strong>six</strong></li>
  </ul>
</div>

<p>I am a paragraph, all alone!</p>

</body>
</html>
