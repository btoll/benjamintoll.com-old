<?php
function __autoload($class) {
  require_once("/home/benjamin/public_html/italy/lib/php/classes/$class.php");
}

session_start();
# check for an active session
if (!$_SESSION['username']) {
  header("Location: http://www.benjamintoll.com/admin/");
}

if ($_POST['italian']) {
  if ($_POST['italian'] != '' && $_POST['translation'] != '') {
    $cfg = new ItalyDAO($_POST);
    $cfg->addWord();
  }
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Italian</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" type="text/css" href="../admin.css" />
<script type="text/javascript">
window.onload = function() {
  document.wordForm.italian.focus();
  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].type == "submit") inputs[i].onfocus = function () { if (this.blur) this.blur(); };
    if (inputs[i].type == "reset") {
      inputs[i].onfocus = function () { if (this.blur) this.blur(); };
      inputs[i].onclick = function () { document.wordForm.italian.focus(); };
    }
  }
};
</script>
</head>

<body>

  <p><a href="http://www.benjamintoll.com/admin/index.php?action=logout">Logout</a></p>

  <form name="wordForm" method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
    <table id="addWord">
      <tr>
        <td>Enter an Italian word or expression: <input type="text" name="italian" size="15" tabindex="1" /></td>
      </tr>
      <tr>
        <td>Enter its pronunciation: <input type="text" name="pronunciation" size="15" tabindex="2" /></td>
      </tr>
      <tr>
        <td><label><input type="radio" name="grammar" value="noun" tabindex="3" checked="checked" /></label> Noun
        <label><input type="radio" name="grammar" value="verb" tabindex="4" /> Verb</label></td>
      </tr>
      <tr>
        <td><label><input type="radio" name="grammar" value="adjective" tabindex="5" /> Adjective</label>
        <label><input type="radio" name="grammar" value="adverb" tabindex="6" /> Adverb</label></td>
      </tr>
      <tr>
        <td><label><input type="radio" name="grammar" value="conjunction" tabindex="7" /> Conjunction</label>
        <label><input type="radio" name="grammar" value="preposition" tabindex="8" /> Preposition</label></td>
      </tr>
      <tr>
        <td><label><input type="radio" name="grammar" value="pronoun" tabindex="9" /> Pronoun</label>
        <label><input type="radio" name="grammar" value="expression" tabindex="10" /> Expression</label></td>
      </tr>
      <tr>
        <td><label>Enter the English translation: <input type="text" name="translation" size="15" tabindex="11" /></label></td>
      </tr>
      <tr>
        <td><label><input type="submit" value="Submit" tabindex="12" /></label>
        <label><input type="reset" value="Clear" tabindex="13" /></label></td>
      </tr>
    </table>
  </form>

</body>
</html>
