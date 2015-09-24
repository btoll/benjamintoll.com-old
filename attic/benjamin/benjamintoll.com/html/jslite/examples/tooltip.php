<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>jsLite - tooltips</title>
<style type="text/css">
fieldset {
  margin: 60px;
}
</style>
<link rel="stylesheet" type="text/css" href="../../lib/css/jslite.css" />
<?php
include_once("/home/benjamin/public_html/lib/includes/jslite_scripts.php");
?>
<script type="text/javascript">
var sTip = "I am JavaScript string.";
var sList = "<p>Vacation destinations:</p><ul style=\"padding-left: 25px;\"><li>New York</li><li>Rome</li><li>London</li><li>Prague</li><li>the sticks</li></ul>";
JSLITE.ready(function () {

  JSLITE.ux.Tooltip.init(); //initialize the classed links;
  JSLITE.dom.get("inner").tooltip($("theForm").innerHTML);
  JSLITE.dom.get("textContent").tooltip(JSLITE.dom.get("theForm").textContent());
  JSLITE.dom.get("js").tooltip(sTip);
  JSLITE.dom.get("jsList").tooltip(sList);

  var oAjax = JSLITE.dom.get("ajax");
  oAjax.tooltip(oAjax.ajax("toolbox.html"));

});
</script>
</head>

<body>

<form id="theForm">
<fieldset>
<legend>Tooltips</legend>
  <p><a href="#" id="inner">This is the form's innerHTML value</a></p>
  <p><a href="#" id="textContent">This is the textContent of the form (non-formatted)</a></p>
  <p><a href="#" id="textContent" class="JSLITE_Tooltip_html[test2]">This is a hidden div, already in the DOM.</a></p>
  <p><a href="#" id="js">This is the value of a JavaScript variable.</a></p>
  <p><a href="#" id="jsList">This is the value of another JavaScript variable, but it could just as easily be the results of an Ajax request.</a></p>
  <p><a href="#" id="one" class="JSLITE_Tooltip_html[test]">This is another hidden div, already in the DOM.</a></p>
  <p><a href="#" id="ajax">This is the result of an Ajax GET request.</a></p>
</fieldset>
</form>

<div id="test" class="hide">
  <p>World Champion Philladelphia Phillies '08!</p>
  <p>Phoenix, AZ</p>
</div>

<div id="test2" class="hide">
  <p>Philladelphia Eagles '08!</p>
  <p>Maybe Next Year '09!</p>
</div>

</body>
</html>
