<?php
include_once("/home/benjamin/public_html/lib/php/interfaces/Email.php");

class LinuxDAO extends DB implements Email {

  protected $template;
  protected $errors = array();

  public function __construct($vars = null) {
    parent::__construct();
    #$this->template = new Template;
    $this->post = $vars;
    $this->scrubber = new Scrubber;
  }

  public function __destruct() {
    $this->closeConnection();
  }

  public function addPhrase() {
    $query = $this->connection->Prepare("INSERT INTO linux VALUES (?)");
    $this->connection->Execute($query, array($this->post['phrase']));

/*
    echo $this->connection->ErrorNo() > 0 ?
      $this->template->duplicateRecord($this->scrubber->toHtml($this->post['phrase'])) :
        $this->template->newRecord($this->scrubber->toHtml($this->post['phrase']));
*/
  }

  public function checkEmail($email) {
    $cleaned = $this->scrubber->scrubEmail($email);
    if (!$cleaned) {
      echo "<p style=\"color: purple;\">You did not enter a valid email address.</p>\n";
    } else {
      $query = $this->connection->Prepare("SELECT email FROM email_addresses WHERE email = ?");
      $rs = $this->connection->Execute($query, array($cleaned));
      if ($this->connection->ErrorNo() == 0) {
        if ($rs->RecordCount() > 0) {
          echo "<p style=\"color: red;\">This address already exists.  Please enter another.</p>\r\n";
        } else {
          $query = $this->connection->Prepare("INSERT INTO email_addresses VALUES (?)");
          $this->connection->Execute($query, array($cleaned));
          #send me an email alerting me that someone has signed up;
          $this->sendEmail((object) array(
            "subscriber" => $cleaned,
            "message" => "You have just received a Linux Command of the Day request from " . $cleaned,
            "subject" => "Linux Command of the Day Request",
            "mail_to" => "benjam72@yahoo.com",
            "mail_from" => "cotd@benjamintoll.com"
          ));

          #send the user an email confirming their desire to receive the Word of the Day;
          $this->sendEmail((object) array(
            "message" => "You have just signed up to receive the Linux Command of the Day from http://www.benjamintoll.com.  If you feel you have received this message in error, simply reply to this email with 'unsubscribe' in the body of the message.",
            "subject" => "Linux Command of the Day confirmation",
            "mail_to" => $cleaned,
            "mail_from" => "cotd@benjamintoll.com"
          ));
          echo "<p><span style=\"color: navy;\">The Linux COTD will be sent to the following address:</span> $email</p>\n";
        }
      }
    }
  }

  public function sendEmail($params) {
    mail($params->mail_to, $params->subject, $params->message, "From: " . $params->mail_from);
  }

}
?>
