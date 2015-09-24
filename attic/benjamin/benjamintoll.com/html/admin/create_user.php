<?php
function __autoload($class) {
  require_once("/home/benjamin/public_html/lib/php/classes/$class.php");
}
if ($_POST['submit']) {
  if ($_POST['username'] != "" && $_POST['password'] != "") {
    $contact = new ContactDAO($_POST);
    $contact->createUser();
    header("Location: index.php");
  }
}		
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Admin :: www.benjamintoll.com</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<style type="text/css">
fieldset {
  margin: 30px auto;
  width: 310px;
}
label {
  clear: left;
  float: left;
  margin-left: 10px;
  padding: 5px 0;
  text-align: right;
  width: 150px;
}
legend {
  background-color: #ffc;
  border: 1px solid #ccc;
}
</style>
<script type="text/javascript">
window.onload = function() {
  document.login.username.focus();
  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].type == "submit" || inputs[i].type == "reset") inputs[i].onfocus = function() { if(this.blur)this.blur(); };
    if (inputs[i].type == "reset") {
      inputs[i].onfocus = function() { if(this.blur)this.blur(); };
      inputs[i].onclick = function() { document.getElementById("username").focus(); };
    }
  }
};
</script>
</head>

<body>

<form name="login" method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
<fieldset>
  <legend>Please create a username and password.</legend>
  <label for="username">Username</label><input type="text" id="username" name="username" />
  <label for="password">Password</label><input type="password" id="password" name="password" />
  <label for="submit"></label><input type="submit" id="submit" name="submit" value="Login"/>
  <label for="reset"></label><input type="reset" id="reset" name="reset" value="Clear" />
</fieldset>
</form>

</body>
</html>
