<?php
# by Benjamin Toll (ben@benjamintoll.com)
# rewrite began on July 9, 2005
# modified on June 30, 2007

session_start();
# check for an active session
if (!$_SESSION['username']) {  # not logged in, redirect them to login script
  header("Location: http://www.benjamintoll.com/admin/");
} else {
  if ($_POST['menu'] == "italy")
    header("Location: italy/menu.php");
  elseif ($_POST['menu'] == "linux")
    header("Location: linux/index.php");
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Menu</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<style type="text/css">
fieldset { width: 310px; }
legend { background-color: #eed; border: 1px solid #ccc; }
</style>
<script type="text/javascript">
window.onload = function() {
  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++)
    if (inputs[i].type == "radio") inputs[i].onchange = function() { this.form.submit(); };
};
</script>
<body>

<p><a href="http://www.benjamintoll.com/admin/index.php?action=logout">Logout</a></p>

<form name="menu" method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
<fieldset>
  <legend>Menu</legend>
  <label><input type="radio" name="menu" value="italy" /> Italy</label>
  <label><input type="radio" name="menu" value="linux" /> Linux</label>
</fieldset>
</form>
</body>
</html>
