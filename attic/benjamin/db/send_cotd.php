<?php
include_once("/home/benjamin/db/blueboy2.php");

// select a random italian word or phrase;
$sql = "SELECT linux FROM linux ORDER BY rand() LIMIT 1";
$result = mysql_query($sql) or die("The server cannot be reached at this time.");
$display = mysql_fetch_row($result) or die("The server cannot be reached at this time.");

// send an email to everyone in the email_addresses table;
$sql2 = "SELECT email FROM email_addresses";
$result2 = mysql_query($sql2) or die("The server cannot be reached at this time.");
//put the email together;
while ($row = mysql_fetch_array($result2)) {

  //wrap the queried words in HTML prior to building the message;
  $message = "
    <style>
      p { margin-bottom: 10px; }
    </style>
    <html>
    <body>
    <p>$display[0]</p>
    <hr />
    <p>The Linux Command of the Day is brought to you by <a href=\"http://www.benjamintoll.com/\">www.benjamintoll.com</a>.</p>
    <p>Thank you for your interest in the Linux operating system and our website.</p>
    </body>
    </html>\n";
  $subject = "Linux Command of the Day";
  $mail_to = "$row[email]";
  //make sure the headers are HTML compliant;
  $headers = "MIME-Version:  1.0\r\n";
  $headers .= "Content-type: text/html; charset=UTF-8\r\n";
  $headers .= "From: Linux COTD <cotd@benjamintoll.com>\r\n";
  mail($mail_to, $subject, $message, $headers);

}

mysql_close();
?>
