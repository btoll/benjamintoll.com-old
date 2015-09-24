<?php
if (isset($_POST['submitContact'])) {
  $contact = new ContactDAO($_POST);
  if ($contact->validate()) {
    $contact->addContact();
    unset($_POST);
    $html = "<div class='JSLITE_errorBox'>" .
      "<p>Thank you for your submission.</p>" .
      "<p>If you requested it, I will contact you shortly.</p>" .
      "</div>";
    $disable = 1; //disable the submit button;

  } else {
    $errors = $contact->getErrors();
    $html = "<div class='JSLITE_errorBox'>" .
      "<p>The following form elements failed validation:</p>" .
      "<ol class='JSLITE_errorList'>";

    foreach ($errors as $value) {
      $html .= "<li>" . $value . "</li>";
    }

    $html .= "</ol></div>";

    //define some variables that will set the values of form fields;
    if (isset($_POST['full_name'])) {
      $full_name = htmlentities($_POST['full_name']);
    }
    if (isset($_POST['email'])) {
      $email = htmlentities($_POST['email']);
    }
    if (isset($_POST['website'])) {
      $website = htmlentities($_POST['website']);
    }
    if (isset($_POST['message'])) {
      $message = htmlentities($_POST['message']);
    }
  }
  return;
}
?>
