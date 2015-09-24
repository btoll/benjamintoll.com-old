<?php
include_once("/home/benjamin/public_html/lib/php/interfaces/Email.php");

class ContactDAO extends DB implements Email  {

  private $salt = "@gR8/hq4B!a"; 
  protected $scrubber;
  protected $cleaned = array();
  protected $errors = array();

  public function __construct($vars = null) {
    parent::__construct();
    $this->scrubber = new Scrubber;
    if (!is_null($vars)) {
      $this->cleaned = $this->scrubber->fromHtml($vars);
    }
  }

  public function __destruct() {
    $this->closeConnection();
  }

  public function addContact() {
    $query = $this->connection->Prepare("INSERT INTO contact VALUES (null, ?, ?, ?, ?, null)");
    $this->connection->Execute($query, array($this->cleaned['full_name'], $this->cleaned['email'], $this->cleaned['website'], $this->cleaned['message']));
    if ($this->connection->ErrorNo() > 0) {
      //echo "An error occurred.";
    }
    $this->cleaned['id'] = $this->connection->Insert_ID(); //add the record id to the array;
    
    $this->sendEmail((object) array(
      "message" => "Someone has just contacted you via your website. How exciting! Here's the info:\n\nName: {$this->cleaned['full_name']}\nEmail: {$this->cleaned['email']}\nWebsite: {$this->cleaned['website']}\nMessage: {$this->cleaned['message']}",
      "subject" => "benjamintoll.com request for contact",
      "mail_to" => "benjam72@yahoo.com",
      "mail_from" => "ben@benjamintoll.com"
    ));
  }

  public function checkEmail($email) {
    #stub
  }

  public function authenticateUser() {
    $query = $this->connection->Prepare("SELECT username FROM users WHERE username = ? AND password = ?");
    $rs = $this->connection->Execute($query, array($this->cleaned['username'], sha1($this->cleaned['password'] . $salt)));
    if ($this->connection->ErrorNo() == 0) {
      return $rs->RecordCount() > 0 ? true : false;
    }
    return false;
  }

  public function createUser() {
    $query = $this->connection->Prepare("INSERT INTO users VALUES (?, ?, null)");
    $this->connection->Execute($query, array($this->cleaned['username'], sha1($this->cleaned['password'] . $salt)));
  }

  public function getErrors() {
    return $this->errors;
  }

  private function setErrors($errors) {
    $this->errors = $errors;
  }

  public function sendEmail($params) {
    mail($params->mail_to, $params->subject, $params->message, "From: " . $params->mail_from);
  }

  public function validate() {
    $arr = array();
    foreach ($this->cleaned as $key => $value) {
      switch ($key) {
        case "full_name":
          if (empty($value)) {
            $arr[] = "Full name cannot be empty.";
          }
          break;
        case "email":
          if (empty($value)) {
            $arr[] = "Email address cannot be empty.";
          } else {
            //if (!preg_match("/^[\w-]+(\.[\w-]+)*@[a-z0-9-]+(\.[\w-]+)*(\.[a-z]{2,3})$/i", $value)) {
            if (!preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i", $value)) {
              $arr[] = "Invalid email address.";
            }
            /*
            list($user, $domain) = explode("@", $value);
            if (!checkdnsrr($domain, "MX")) {
              $arr[] = "Invalid email address.";
            }
            */
          }
          break;
        case "message":
          if (empty($value)) {
            $arr[] = "Message cannot be empty.";
          }
          break;
      }
    }
    try {
      if (!empty($arr)) {
        throw new Form_Validation_Exception();
      }
      return 1; //if successful;
    } catch (Form_Validation_Exception $e) {
      $this->setErrors($arr);
    }
  }

}
?>
