<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>jsLite Lists</title>
<style type="text/css">
.testy {
  background: green;
}
</style>
<?php
include_once("/home/benjamin/public_html/lib/includes/jslite_scripts.php");
?>
<script type="text/javascript">
var aValues = ["Atlanta", "Florida", "Philadelphia", "New York", "Washington"];
var aText = ["Braves", "Marlins", "Phillies", "Mets", "Nationals"];
 
/*
NOTE: Opera won't set an option's selected property to true unless it's already in the document, so use defaultSelected instead;
http://groups.google.com/group/opera.general/browse_thread/thread/c2826d5164b2dc02?pli=1
*/
var aTeams = [
  { value: "Atlanta", innerHTML: "Braves", id: "Braves", className: "testy", increment: 1, defaultSelected: false },
  { value: "Florida", innerHTML: "Marlins", id: "Marlins", className: "testy", increment: 2, defaultSelected: false },
  { value: "Philadelphia", innerHTML: "Phillies", id: "Phillies", className: "testy", increment: 10, defaultSelected: true },
  { value: "New York", innerHTML: "Mets", id: "Mets", className: "testy", increment: 2.1, defaultSelected: false },
  { value: "Washington", innerHTML: "Nationals", id: "Nationals", className: "testy", increment: 5, defaultSelected: false }
];

JSLITE.ready(function () {

  JSLITE.dom.get("one").list(aText);
  JSLITE.dom.get("two").list(aText, aValues); //same order as new Option(text, value);
  JSLITE.dom.get("three").list(aTeams);

  JSLITE.dom.get("four").list(aText);
  JSLITE.dom.get("five").list(aTeams);

  JSLITE.dom.create({tag: "select", parent: "thePara"}).list(aTeams);

});
</script>
</head>

<body>

<h4>Pass a single parameter to <code>list()</code> whose array elements will be the values for both the list's text and value attributes.</h4>
<select id="one"></select>

<h4>Pass two parameters to <code>list()</code>. The first array's elements will be the values for the list's text attribute and the second array's elements will be the values for the value attribute.</h4>
<select id="two"></select>

<h4>Pass a single parameter to <code>list()</code> whose array elements will be objects whose properties map to both standard and custom attributes.</h4>
<select id="three"></select>

<h4>Pass a single parameter to <code>list()</code> whose array elements will be the values for the list's text.</h4>
<ol id="four"></ol>

<h4>Pass a single parameter to <code>list()</code> whose array elements will be objects whose properties map to both standard and custom attributes.</h4>
<ul id="five"></ul>

<h4>Create a new list, append it to another element and pass a single parameter to <code>list()</code> whose array elements will be objects whose properties map to both standard and custom attributes.</h4>
<p id="thePara"></p>

</body>
</html>
