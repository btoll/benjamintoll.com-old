<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>jsLite sandbox :: HTML Templating Engine</title>
<style type="text/css">
html * {
  margin: 0;
  padding: 0;
}
#wrapper {
  border: 1px solid #CCC;
  min-height: 600px;
  width: 980px;
}
#header {
  background: #FFC;
  height: 100px;
  width: 100%;
}
#nav, #content {
  float: left;
}
#nav {
  width: 222px;
}
#content {
  width: 700px;
}
ul {
  list-style: none;
}
</style>
<?php
include_once("/home/benjamin/public_html/lib/includes/jslite_scripts.php");
?>
<script type="text/javascript">
JSLITE.ready(function () {

  var fn = function (e) {
    alert(e.target.innerHTML);
    e.preventDefault();
  };

  var oTemplate = new JSLITE.Template("<div id={0}><div id={1}></div><ul id={2}></ul><div id={3}></div></div>");
  oTemplate.append(document.body, ["wrapper", "header", "nav", "content"]);

  var oHeader = JSLITE.dom.get("header");
  oHeader.dom.innerHTML = "<p>This is my header.</p>";

  var oList = JSLITE.dom.get("nav");
  oList.list(["<a href=\"\#\">Home</a>", "<a href=\"#\">About</a>", "<a href=\"#\">Contact</a>"]);
  var cLinks = JSLITE.dom.gets("a", oList.dom);
  cLinks.on("click", fn);

  var oContent = JSLITE.dom.get("content");
  oContent.dom.innerHTML = "<p>This is where my content will go.</p>";

});
</script>
</head>

<body>
</body>
</html>
