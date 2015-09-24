<?php
session_start();
# check for an active session
if (!$_SESSION['username']) {  # not logged in, redirect them to login script
  header("Location: http://www.benjamintoll.com/admin/");
} else {
  if ($_POST['menu'] == 'word')
    header("Location: add_word.php");
  elseif ($_POST['menu'] == 'verb')
    header("Location: add_verb.php");
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Menu</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" type="text/css" href="http://www.benjamintoll.com/jslite/lib/css/jslite.css" /> 
<style type="text/css">
  fieldset { width: 310px; }
  legend { background-color: #eed; border: 1px solid #ccc; }
  #subscribers { margin: 40px; }
  #subscribers p { font: bold 16px arial; }
</style>
<?php
include_once("/home/benjamin/public_html/lib/includes/jslite_scripts.php");
?>
<script type="text/javascript">
JSLITE.ready(function () {
  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].type == "radio") inputs[i].onchange = function() { this.form.submit(); };
  }

  var cm = new JSLITE.ux.ColumnModel([
    { header: "Email Address", dataIndex: "email", width: 275 }
  ]);

  var reader = new JSLITE.ux.Reader({
    root: "rows",
    total: "total",
    fields: [
      {name: "email"}
    ]
  });
 
  var ds = new JSLITE.ux.RemoteStore({
    type: "json",
    url: "contacts_proxy.php",
    params: {
      start: 0,
      limit: 25
    },
    reader: reader
  });
 
  var grid = new JSLITE.ux.Grid({
    id: "theGrid",
    height: 450,
    width: 290,
    cm: cm,
    store: ds,
    stripe: true,
    pager: new JSLITE.ux.Pager({
      store: ds
    })
  });

  grid.render($("emailsGrid"));
});
</script>
<body>

<p><a href="http://www.benjamintoll.com/admin/index.php?action=logout">Logout</a></p>

<form name="menu" method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
<fieldset>
  <legend>Menu</legend>
  <label><input type="radio" name="menu" value="verb" /> Add a Verb</label>
  <label><input type="radio" name="menu" value="word" /> Add a Word</label>
</fieldset>
</form>

<div id="subscribers">
  <p>Subscribers</p>
  <div id="emailsGrid">
  </div>
</div>
</body>
</html>
