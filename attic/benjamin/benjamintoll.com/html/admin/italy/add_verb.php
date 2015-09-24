<?php
# by Benjamin Toll (ben@benjamintoll.com)
# rewrite began on July 9, 2005
# modified on June 30, 2007

include_once("../lib/load_libs.php");

session_start();
# check for an active session
if (!$_SESSION['username']) {  # not logged in, redirect them to login script
     header("Location: http://www.benjamintoll.com/admin/");
}

	if (isset($_POST['verb'])) {

		// exit if regular or irregular isn't selected;

		if (!$_POST['menu'] or !$_POST['menu2'] or !$_POST['past_part']) {

			echo "<body link=\"navy\" vlink=\"navy\" alink=\"navy\">\n";

			echo "Please completely fill out the form.\n<br />";

			echo "<a href=\"add_verb.php\" onfocus=\"if(this.blur)this.blur();\">Back</a>\n";

			echo "</body>";

			exit;

		}

		if (!$_POST['verb']) {

			echo "You must enter a verb.\n<br />";

		} else {

			$verb = trim($_POST['verb']);

			// first check to make sure it's a verb;

			// get the length of the verb entered;

			$verb_length = strlen($verb);

			// get the root of the verb entered;

			$cut_verb = ($verb_length - 3);

			// get the last three letters of the verb entered;

			$check_verb = substr($verb, $cut_verb, $verb_length);

			if ($check_verb != 'are' and $check_verb != 'ire' and $check_verb != 'ere' and $check_verb != 'rsi') {

				echo "<body link=\"navy\" vlink=\"navy\" alink=\"navy\">\n";

				echo "<font color=\"tan\">$verb</font> is not a verb.\n<br>";

				echo "<a href=\"add_verb.php\" onfocus=\"if(this.blur)this.blur();\">Back</a>\n";

				echo "</body>";

				exit;

			} else { // it's a verb, so continue;

				// cut off the last letters and return just the root;

				if ($check_verb == 'rsi') {

					$cut_verb = ($verb_length - 4);

					$root = substr($verb, 0, $cut_verb);

				} else {

					$root = substr($verb, 0, $cut_verb);

				}

			}

			// now direct the user to the next step based upon their choice of regular or irregular;

			if ($_POST['menu'] == 'regular' or $_POST['menu'] == 'reflexive') {

				$query = conjugate($verb, $root, $_POST['menu'], $_POST['menu2'], $check_verb, $_POST['past_part']);

				if (!$query) {

					echo "Data could not be entered.\n";

				} else {

					echo "<font color=\"navy\">$verb</font> has been successfully conjugated \n<br />";

					echo "and added to the database.<br />\n";

					echo "<body link=\"navy\" vlink=\"navy\" alink=\"navy\">\n";

					echo "<a href=\"add_verb.php\">Back</a>\n";

					echo "</body>";

					exit;

				}

			} elseif ($_POST['menu'] == 'irregular') {

				// to be completed;
				header("Location:  ../secure/irregular.php");
				exit;

			}

		}

	}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Add a Verb</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<script type="text/javascript">
window.onload = function() {
  document.conjugate.verb.focus();

  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].type == "radio" || inputs[i].type == "submit") inputs[i].onfocus = function() { if(this.blur)this.blur(); };
    if (inputs[i].type == "reset") {
      inputs[i].onfocus = function() { if(this.blur)this.blur(); };
      inputs[i].onclick = function() { document.conjugate.verb.focus(); };
    }
  }

  var link = document.getElementsByTagName("a")[0];
  link.onfocus = function() { if(this.blur)this.blur(); };

};
</script>
</head>

<body>

<p><a href="http://www.benjamintoll.com/admin/index.php?action=logout">Logout</a></p>

<form name="conjugate" method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">

<table border="0" cellpadding="2" cellspacing="0">

<tr>
  <td></td>
  <td style="color: navy;">Verb</td>
</tr>
<tr>
  <td></td>
  <td><input type="text" name="verb" size="15" /></td>
</tr>
<tr>
  <td></td>
  <td><input type="radio" name="menu" value="regular" /> Regular</td>
</tr>
<tr>
  <td></td>
  <td><input type="radio" name="menu" value="irregular" /> Irregular</td>
</tr>
<tr>
  <td></td>
  <td><input type="radio" name="menu" value="reflexive" /> Reflexive</td>
</tr>
<tr>
  <td></td>
  <td style="color: navy; text-align: left;"><br />Conjugated with</td>
</tr>
<tr>
  <td></td>
  <td><input type="radio" name="menu2" value="avere" /> Avere</td>
</tr>
<tr>
  <td></td>
  <td><input type="radio" name="menu2" value="essere" /> Essere</td>
</tr>
<tr>
  <td></td>
  <td style="color: navy; text-align: left;"><br />Past Participle</td>
</tr>
<tr>
  <td></td>
  <td><input type="text" name="past_part" size="15" /></td>
</tr>
<tr>
  <td></td>
  <td><br /><input type="submit" name="submit" value="Submit" />
  <input type="reset" name="reset" value="Clear" /></td>
</tr>
</table>

<p><a href="menu.php">Back</a></p>

</body>
</html>
