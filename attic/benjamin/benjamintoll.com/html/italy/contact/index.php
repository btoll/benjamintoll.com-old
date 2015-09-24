<?php
# by Benjamin Toll (ben@benjamintoll.com)
# rewrite began on July 9, 2005
# modified on December 14, 2006

include_once("../header.php");

?>
<body id="contact">

<?php
include_once(MENU);
?>

<div id="image">
   <img src="../images/marriage_at_cana_veronese2.jpg" border="0" alt="Veronese" />
</div>  <!-- end div#image -->

<?php
if (isset($_POST['send'])) {
  $basket = array();
  $errors = array();
  $referers = array();
  $n = 0;
  $i = 0;
  $to = '';
  $subject = '';
  $headers = '';
  $message = '';

  foreach ($_POST as $key => $value) {
    $basket[$key] = addslashes(htmlentities(trim($value)));
  }

  if ($basket['name'] == '' || $basket['email'] == '' || $basket['subject'] == '' || $basket['message'] == '') {
    if ($basket['name'] == '') {
      $errors[] = "<span style=\"color: red;\">Name cannot be blank.</span>\n";
    }
    if ($basket['email'] == '') {
      $errors[] = "<span style=\"color: red;\">Email cannot be blank.</span>\n";
    }
    if ($basket['subject'] == '') {
      $errors[] = "<span style=\"color: red;\">Subject cannot be blank.</span>\n";
    }
    if ($basket['message'] == '') {
      $errors[] = "<span style=\"color: red;\">Message cannot be blank.</span>\n";
    }

    # if 'http://' is in the variable, strip it out before returning it or else it will contain
    # multiple instances of 'http://';
    if (stristr($basket['website'], 'http://')) {
      $basket['website'] = substr($basket['website'], 7, strlen($basket['website']));
    }

  } else {
    $referers = array("www.benjamintoll.com", "benjamintoll.com", "localhost", "127.0.0.1");
    for ($n = 0; $n < count($referers); $n++) {
      if (strstr($_SERVER['HTTP_REFERER'], $referers[$n])) {
        $i = 1;
      }
    }
    if ($i > 0) {
      $to = "benjam72@yahoo.com";
      $subject = $basket['subject'];
      $headers = "MIME-Version: 1.0\n";
      $headers .= "Content-Type: text/plain\n";
      $headers .= "From: benjamintoll.com Email Bot <noreply@benjamintoll.com>\n";
      $message = "<p><strong>Sender's name:</strong><br /> " . $basket['name'] . "</p>\n";
      $message .= "<p><strong>Sender's email:</strong><br /> " . $basket['email'] . "</p>\n";
      if ($basket['website']) {
        $message .= "<p><strong>Sender's website:</strong><br /> " . $basket['website'] . "</p>\n";
      }
      $message .= "<p><strong>Sender's message:</strong><br />" . nl2br($basket['message']) . "</p>\n";
      mail($to, $subject, $message, $headers);
      if (!$mail) {
        $errors[] = "<span style=\"color:blue;\">Message successfully delivered.</span>\n";
        unset($basket); # unset the arrays so the fields will be blank after successful delivery;
        unset($_POST);
      } else {
        $errors[] = "<span style=\"color:red;\">Message could not be delivered.</span>\n";
      }
    }
  }
}
?>

<body id="contact">

<?php
   include_once(MENU);
?>

<hr />
<span class="pageHeader">Contact Us</span>
<hr />

<p>
<?php
if ($errors) {
  echo "<ul>\n";
  foreach($errors as $error) {
    echo "\t<li>$error</li>\n";
  }
  echo "</ul>\n";
} else {
  echo "&nbsp;";
}
?>
</p>

<div id="contact_us">
  <fieldset>
  <legend>Submission Form</legend>
  <form method="post" action="<?=$_SERVER['PHP_SELF']?>">
    <label for="your_name">Your name</label><input type="text" name="name" value="<?=$basket['name']?>" />
    <label for="your_email">Your email</label><input type="text" name="email" value="<?=$basket['email']?>" />
    <label for="your_website">Your website</label><input type="text" name="website" value="http://<?=$basket['website']?>" />
    <label for="your_subject">Your subject</label><input type="text" name="subject" value="<?=$basket['subject']?>" />
    <label for="your_message">Your message</label><textarea name="message" rows="10"><?=$basket['message']?></textarea>
    <label for="submit"></label><input type="submit" name="send" value="Send Message" style="text-align: center;" />
  </form>
  </fieldset>
</div><!-- end div#contact_us -->

<?php
include_once("http://italy.benjamintoll.com/footer.php");
?>