<?php
if ($_POST) {
  print_r($_POST);
  return;
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>jsLite sandbox :: Ajax Form Submission</title>
<style type="text/css">
#response {
  border: 1px solid #000;
  font: normal 12px verdana;
  margin-left: 600px;
  padding: 10px;
  position: absolute;
  width: 300px;
}
#response div {
  font-family: monospace;
  white-space: pre;
}
form {
  width: 580px;
}
fieldset {
  margin: 20px 0;
}
form ol {
  list-style: none;
}
form ol li {
  margin: 5px 0;
}
form label {
  display: inline-block;
  margin-right: 10px;
  text-align: right;
  width: 150px;
}
form ol input[type="submit"] {
  margin-left: 180px;
}
</style>
<?php
include_once("/home/benjamin/public_html/lib/includes/jslite_scripts.php");
?>
<script type="text/javascript">
JSLITE.ready(function () {

  var form = JSLITE.dom.get("theForm");
  form.on("submit", function (e) {
    var errors = JSLITE.dom.fly(this).validate();
    if (errors === 0) {
      JSLITE.ajax.load({
        url: this.action,
        type: "post",
        postvars: form.serialize(),
        success: function (sResponse) {
          JSLITE.dom.gets("#response div").elements[0].innerHTML = sResponse;
        }
      });
    }
    e.preventDefault();
  });

});
</script>
</head>

<body>

<div id="response">
  <p>Server response:</p>
  <div></div>
</div>

<form id="theForm" method="post" action="<?=$_SERVER['PHP_SELF']?>">
<fieldset>
<legend>Fill Me Out</legend>
  <ol>
    <li>
      <label for="title">Title</label>
      <input type="radio" name="title" value="mr" checked="checked" /> Mr.
      <input type="radio" name="title" value="mrs" /> Mrs.
      <input type="radio" name="title" value="ms" /> Ms.
      <input type="radio" name="title" value="dr" /> Dr.
    </li>
    <li>
      <label for="firstName">First Name</label>
      <input type="text" id="firstName" name="firstName" class="required" value="Ben" />
    </li>
    <li>
      <label for="lastName">Last Name</label>
      <input type="text" id="lastName" name="lastName" class="required" value="Toll" />
    </li>
    <li>
      <label for="city">City</label>
      <input type="text" id="city" name="city" value="Phoenix" />
    </li>
    <li>
      <label for="ssn">SSN</label>
      <input type="text" id="ssn" name="ssn" class="required-ssn" value="123-45-6789" />
    </li>
    <li>
      <label for="email">Email</label>
      <input type="text" id="email" name="email" />
    </li>
    <li>
      <label for="phone">Phone</label>
      <input type="text" id="phone" name="phone" class="required-phone" value="(717) 756-2200" />
    </li>
    <li>
      <label for="preferences">Preferences</label>
      <input type="checkbox" name="yearly" /> Yearly
      <input type="checkbox" name="monthly" /> Monthly
      <input type="checkbox" name="weekly" /> Weekly
      <input type="checkbox" name="daily" /> Daily
    <li>
      <label for="sports">Sports</label>
      <select id="sports" name="sports[]" multiple="multiple">
        <option value="baseball" selected="selected">Baseball</option>
        <option value="football">Football</option>
        <option value="golf" selected="selected">Golf</option>
        <option value="tennis">Tennis</option>
      </select>
    </li>
    <li>
      <label for="state">State</label>
      <select id="state" name="state">
        <option value="AZ" selected="selected">Arizona</option>
        <option value="NM">New Mexico</option>
        <option value="PA">Pennsylvania</option>
      </select>
    </li>
    <li>
      <label for="zip">ZIP</label>
      <input type="text" id="zip" name="zip" class="required-zip" value="85048" />
    </li>
    <li>
      <label for="notes">Notes</label>
      <textarea id="notes" name="notes">These are my notes.</textarea>
    </li>
    <li>
      <input type="submit" id="submit" value="Submit" />
    </li>
  </ol>
</fieldset>
</form>

</body>
</html>
