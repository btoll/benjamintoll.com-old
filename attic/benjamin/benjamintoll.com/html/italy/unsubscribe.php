<?php
# by Benjamin Toll (ben@benjamintoll.com)
# rewrite began on July 9, 2005
# modified on January 1, 2013
include_once("/home/benjamin/db/db.php");
?>
<html>
<head>
<title>Unsubscribe :: italy.benjamintoll.com</title>
</head>

<body>
<center>
<br /><br /><br />
Are you sure you wish to push that button?

<form method="post" action="<?=$_SERVER['PHP_SELF']?>">
<table border="1" cellpadding="4" cellspacing="4">
<tr>
  <td style="color: red;"><?=$_POST['email']?>
  <input type="submit" name="remove" value="Remove From List" />
  <input type="hidden" name="email" value="<?=$_POST['email']?>" />
  </td>
</tr>
</table>
</form>

<?php
if (isset($_POST['remove'])) {
  if (isset($_POST['email']) && $_POST['email'] != "") {
    // strip the text box of whitespace and potential malicious code
    $email = trim(htmlentities($_POST['email']));
    // check to see if address is actually in the database;
    $sql = sprintf("SELECT * FROM email_addresses WHERE email = '%s'", $email);
    $result = @mysql_query($sql);
    if (mysql_num_rows($result) == 1) {  # the address exists so let's delete it
      $sql = sprintf("DELETE FROM email_addresses WHERE email = '%s'", $email);
      @mysql_query($sql);
      echo "<span style=\"color: blue;\">";
      echo "Goodbye, we miss you already!";
      echo "</span>";
    } else {  # the address was not found in the database
      echo "<span style=\"color: red;\">";
      echo "Sorry, email address not found.";
      echo "</span>";
    }
  }
}
?>

</body>
</html>
