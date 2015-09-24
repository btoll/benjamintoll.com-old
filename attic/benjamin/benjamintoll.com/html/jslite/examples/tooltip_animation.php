<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>jsLite Animation - tooltips</title>
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
JSLITE.ready(function () {

  JSLITE.dom.gets("a[href^=http][rel]").tooltip(["{rel}", " {", "<a href='{href}'>{href}</a>", "}"], true);

});
</script>
</head>

<body>

<p>Lorem ipsum dolor sit amet, <a href="http://www.benjamintoll.com/" rel="Check out this site!">consectetur adipiscing</a> elit. Maecenas bibendum, odio commodo commodo pharetra, odio nisi tempus massa, vitae porta justo tellus eu lorem. Pellentesque lobortis, leo bibendum euismod laoreet, neque dolor mattis ipsum, sit amet porta urna sapien nec augue. Duis eu leo arcu. Maecenas urna lectus, tempus id tempor ac, <a href="http://italy.benjamintoll.com/" rel="Si parla l'Italiano">egestas sed sem</a>. Duis sit amet tincidunt augue. Pellentesque dictum porta sem posuere tristique. Pellentesque habitant morbi tristique senectus et <a href="http://code-buddy.benjamintoll.com/" rel="Code Buddy, more than meets the eye!">netus et malesuada</a> fames ac turpis egestas. Duis blandit tincidunt mi, nec porttitor tortor mattis at. Donec sit amet volutpat turpis. Cras euismod vulputate nisi, vitae molestie libero condimentum non. Etiam scelerisque elementum ante eget luctus. Aliquam erat volutpat. Fusce non tempor est. Suspendisse diam justo, cursus id accumsan in, hendrerit vel felis. Maecenas cursus magna et ligula sollicitudin varius.</p>

</body>
</html>
