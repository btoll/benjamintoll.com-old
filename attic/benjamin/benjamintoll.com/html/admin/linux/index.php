<?php
function __autoload($class) {
  require_once("/home/benjamin/public_html/lib/php/classes/$class.php");
}

session_start();
# check for an active session
if (!$_SESSION['username']) {
  header("Location: http://www.benjamintoll.com/admin/");
}

if ($_POST['phrase']) {
  $cfg = new LinuxDAO($_POST);
  $cfg->addPhrase();
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Linux</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" type="text/css" href="http://www.benjamintoll.com/jslite/lib/css/jslite.css" />
<style>
#subscribers { margin: 40px; }
#subscribers p { font: bold 16px arial; }
#subscribers > div {
  float: left;
  margin-right: 20px;
}
</style>
<?php
include_once("/home/benjamin/public_html/lib/includes/jslite_scripts.php");
?>
<script type="text/javascript">
JSLITE.ready(function () {
  document.linux.phrase.focus();
  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].type == "submit") inputs[i].onfocus = function () { if (this.blur) this.blur(); };
    if (inputs[i].type == "reset") {
      inputs[i].onfocus = function () { if (this.blur) this.blur(); };
      inputs[i].onclick = function () { document.linux.phrase.focus(); };
    }
  }

  var cm = new JSLITE.ux.ColumnModel([
    { header: "Email", dataIndex: "email", width: 200 }
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
    url: "linux_subscribers_proxy.php",
    params: {
      start: 0,
      limit: 25
    },
    reader: reader
  });
 
  var grid = new JSLITE.ux.Grid({
    height: 350,
    width: 215,
    cm: cm,
    store: ds,
    stripe: true,
    pager: new JSLITE.ux.Pager({
      store: ds
    })
  });

  grid.render($("subscribersGrid"));

  /*****************************************/

  var cm2 = new JSLITE.ux.ColumnModel([
    { header: "Command", dataIndex: "linux", width: 475 }
  ]);

  var reader2 = new JSLITE.ux.Reader({
    root: "rows",
    total: "total",
    fields: [
      {name: "linux"}
    ]
  });
 
  var ds2 = new JSLITE.ux.RemoteStore({
    type: "json",
    url: "linux_command_proxy.php",
    params: {
      start: 0,
      limit: 25
    },
    reader: reader2
  });
 
  var grid2 = new JSLITE.ux.Grid({
    height: 350,
    width: 490,
    cm: cm2,
    store: ds2,
    stripe: true,
    pager: new JSLITE.ux.Pager({
      store: ds2,
      template: new JSLITE.Template("<strong>{total}</strong> / {pageStart} - {pageEnd}")
    })
  });

  grid2.render($("commandGrid"));
});
</script>
</head>

<body>

  <p><a href="http://www.benjamintoll.com/admin/index.php?action=logout">Logout</a></p>

  <form name="linux" method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
    <label>Enter your phrase: <textarea name="phrase" rows="15" cols="100" tabindex="1"></textarea></label>
    <label><input type="submit" value="Submit" tabindex="2" /></label>
    <label><input type="reset" value="Clear" tabindex="3" /></label>
  </form>

<div id="subscribers">
  <p>Subscribers</p>
  <div id="subscribersGrid">
  </div>
  <div id="commandGrid">
  </div>
</div>
</body>
</html>
