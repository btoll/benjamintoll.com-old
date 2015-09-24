<?php
# by Benjamin Toll (ben@benjamintoll.com)
# rewrite began on July 9, 2005

include_once("/home/benjamin/db/db.php");

// select a random italian word or phrase;
$sql = "SELECT * FROM words ORDER BY rand() LIMIT 1";
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
      p { margin-bottom: 20px; }
    </style>
    <html>
    <body>
    <p><span style=\"color: olive; font-size: 15px;\">Here is your Word of the Day:</span></p>
    <p><span style=\"color: navy; font-size: 14px;\"><u>$display[0]</u></span> [" . stripslashes($display[1]) . "], <span style=\"color: purple; font-size: 14px;\">$display[2]:</span> <strong>$display[3]</strong></p>
    <hr />
    <p>The Word of the Day is brought to you by <a href=\"http://www.benjamintoll.com/\">www.benjamintoll.com</a> and <a href=\"http://italy.benjamintoll.com/\">italy.benjamintoll.com</a>.</p>
    <p>Thank you for your interest in the Italian language and our websites.</p>
    <p>All definitions taken from <i>Collins Mondadori Nuovo Dizionario Inglese</i>, Copyright 1995, HarperCollins Publishers, ISBN 0-06-275517-X</p>
    <form method=\"post\" action=\"http://italy.benjamintoll.com/unsubscribe.php\">
    <span>** To unsubscribe from this list click <input type=\"submit\" name=\"submit\" value=\"here\" />. **</span>
    <input type=\"hidden\" name=\"email\" value=\"$row[email]\" />
    </form>
    </body>
    </html>\n";
  $subject = "Italian Word of the Day";
  $mail_to = "$row[email]";
  //make sure the headers are HTML compliant;
  $headers = "MIME-Version:  1.0\r\n";
  $headers .= "Content-type: text/html; charset=UTF-8\r\n";
  $headers .= "From: Italian WOTD <wotd@benjamintoll.com>\r\n";
  mail($mail_to, $subject, $message, $headers);

}

mysql_close();
?>
