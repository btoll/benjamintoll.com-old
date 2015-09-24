<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>jsLite sandbox :: Form Validation</title>
<style type="text/css">
.error {
  color: red;
}
.disabled {
  color: #CCC;
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
.tester {
  background: blue;
}
</style>
<link rel="stylesheet" type="text/css" href="../../lib/css/jslite.css" />
<?php
include_once("/home/benjamin/public_html/lib/includes/jslite_scripts.php");
?>
<script type="text/javascript">
JSLITE.ready(function () {

  var callback = function (e) {
    var oScrubber = this.dom.scrubber;
    var oDiv = oScrubber.setErrorBox();
    if (oScrubber.getErrors() > 0) {
      JSLITE.dom.get(this.dom).before(oDiv);
    } else {
      alert('passed');
    }
    e.preventDefault();
  };

  JSLITE.dom.get("theForm").validate();

  var oBox = JSLITE.dom.create({tag: "div", //default error box;
    attr: {className: JSLITE.globalSymbol + "_errorBox"},
    children: [
      JSLITE.dom.create({tag: "p",
        attr: {innerHTML: "The following form elements failed validation:"}
      }),
      JSLITE.dom.create({tag: "ol",
        attr: {className: JSLITE.globalSymbol + "_errorList"}
      })
    ]
  });

  var oForm2 = JSLITE.dom.get("theForm2");
  oForm2.validate(callback, {
    classMap: "parent",
    errorBox: oBox,
    template: new JSLITE.Template("<em>{name}</em>", "<span>{rule}</span>")
  });

  JSLITE.Rules.setRule("date", {re: "^\\d{2}/\\d{2}/\\d{4}$", message: "The date must be in the following format: xx/xx/xxxx"}); 

});
</script>
</head>

<body>

<form id="theForm">
<fieldset>
<legend>Fill Me Out</legend>
  <ol>
    <li>
      <label for="firstName">First Name</label>
      <input type="text" id="firstName" name="firstName" class="required" />
    </li>
    <li>
      <label for="lastName">Last Name</label>
      <input type="text" id="lastName" name="lastName" class="required" />
    </li>
    <li>
      <label for="city">City</label>
      <input type="text" id="city" name="city" />
    </li>
    <li>
      <label for="ssn">SSN</label>
      <input type="text" id="ssn" name="ssn" class="required-ssn" />
    </li>
    <li>
      <label for="email">Email</label>
      <input type="text" id="email" name="email" />
    </li>
    <li>
      <label for="phone">Phone</label>
      <input type="text" id="phone" name="phone" class="required-phone" />
    </li>
    <li>
      <label for="zip">ZIP</label>
      <input type="text" id="zip" name="zip" class="required-zip" />
    </li>
    <li>
      <input type="submit" id="submit" name="submit" value="Submit" />
    </li>
  </ol>
</fieldset>
</form>

<form id="theForm2">
<fieldset>
<legend>Fill Me Out</legend>
  <ol>
    <li>
      <label for="firstName2">First Name
        <input type="text" id="firstName2" name="firstName2" class="required" />
      </label>
    </li>
    <li>
      <label for="lastName2">Last Name
        <input type="text" id="lastName2" name="lastName2" class="required" />
      </label>
    </li>
    <li>
      <label for="phone2">Phone
        <input type="text" id="phone2" name="phone2" class="required-phone" />
      </label>
    </li>
    <li>
      <input type="submit" id="submit2" name="submit2" value="Submit" />
    </li>
  </ol>
</fieldset>
</form>

</body>
</html>
