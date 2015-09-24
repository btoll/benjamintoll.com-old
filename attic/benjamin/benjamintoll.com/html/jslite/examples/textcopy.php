<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>jsLite Text Copy</title>
<style type="text/css">
body {
  padding: 50px;
}
form {
  float: left;
}
fieldset {
  background: #F2EFE9;
  border-style: none;
  border-top: 1px solid #BFBAB0;
  clear: left;
  float: left;
  width: 100%;
}
legend {
  font-weight: bold;
  margin-left: 1em;
  padding: 0;
}
legend span { /*ff doesn't allow <legend> to be moved so wrap the text in a <span>*/
  font-size: 135%;
  margin-top: 0.5em;
  position: absolute;
}
ol {
  list-style: none;
  margin: 1em 0 0 0;
  padding: 2.5em 1em 0 1em;
}
li {
  clear: left;
  float: left;
  padding: 0 0 1em 0;
  width: 100%;
}
label {
  clear: left;
  float: left;
  margin: 0 1em 0 0;
  /*text-align: right;*/
  width: 150px;
}
fieldset.submit {
  background: none;
  float: none;
  /*width: auto;*/
}
fieldset.submit input {
  margin: 1.5em 0 0 14em;
}
</style>

<!--[if lte IE 7]>
<style type="text/css">
legend {
  position: relative;
  top: -0.75em;
  left: -7px;
}
legend span {
  margin-top: 1.25em;
}
fieldset {
  position: relative;
}
fieldset ol {
  padding-top: 2.25em;
}
</style>
<![endif]-->

<?php
include_once("/home/benjamin/public_html/lib/includes/jslite_scripts.php");
?>
<script type="text/javascript">
JSLITE.ready(function () {

  var callback = function (e) {
    var target = e.target
    $(target.id + "2").value = target.value;
  };

  JSLITE.dom.gets("#theForm input").on(["keyup", "change"], callback); //is change even necessary?;
  JSLITE.dom.gets("#theForm2 input").disable();

});
</script>
</head>

<body>

<h3>This should look familiar. Enter text into the form on the left and see it replicated in the form on the right.</h3>

<form id="theForm" name="theForm" action="">
  <fieldset>
  <legend><span>Contact Information</span></legend>
  <ol>
    <li>
      <label for="lastName">Last Name</label>
      <input type="text" id="lastName" name="lastName" />
    </li>
    <li>
      <label for="firstName">First Name</label>
      <input type="text" id="firstName" name="firstName" />
    </li>
    <li>
      <label for="city">City</label>
      <input type="text" id="city" name="city" />
    </li>
    <li>
      <label for="state">State</label>
      <input type="text" id="state" name="state" />
    </li>
    <li>
      <label for="zip">Zip</label>
      <input type="text" id="zip" name="zip" />
    </li>
    <li>
      <input type="submit" id="submit" name="submit" value="Submit" />
    </li>
  </fieldset>
</form>

<form id="theForm2" name="theForm2" action="">
  <fieldset>
  <legend><span>Billing Information</span></legend>
  <ol>
    <li>
      <label for="lastName2">Last Name</label>
      <input type="text" id="lastName2" name="lastName2" />
    </li>
    <li>
      <label for="firstName2">First Name</label>
      <input type="text" id="firstName2" name="firstName2" />
    </li>
    <li>
      <label for="city2">City</label>
      <input type="text" id="city2" name="city2" />
    </li>
    <li>
      <label for="state2">State</label>
      <input type="text" id="state2" name="state2" />
    </li>
    <li>
      <label for="zip2">Zip</label>
      <input type="text" id="zip2" name="zip2" />
    </li>
    <li>
      <input type="submit" id="submit2" name="submit2" value="Submit" />
    </li>
  </fieldset>
</form>

</body>
</html>
