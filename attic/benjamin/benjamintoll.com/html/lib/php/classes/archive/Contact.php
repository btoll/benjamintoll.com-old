<?php

class Contact implements IData {

  private $DB = null;
  private $cleaned = array();
  private $not_valid = array();

  public function __construct(ADODB_mysql $DB, $postvars = null) {
    $this->DB = $DB;
    if ($postvars) { //if getAll() $postvars will be null;
      foreach ($postvars as $key => $value) {
        $this->cleaned[$key] = $this->clean($value);
      }
    }
  }

  public function clean($value) {
    return trim(strip_tags($value));
  }

  public function validate() {
    $arr = array();
    foreach ($this->cleaned as $key => $value) {
      switch ($key) {
        case "c_full_name":
          if (empty($value)) {
            $arr[] = "Full name cannot be empty.";
          }
          break;
        case "c_email":
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
        case "c_message":
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

  public function getErrors() {
    return $this->not_valid;
  }

  public function setErrors($errors) {
    $this->not_valid = $errors;
  }

  public function add() {
    $query = $this->DB->Prepare("INSERT INTO contact VALUES (null, ?, ?, ?, ?, null)");
    $rs = $this->DB->Execute($query, array($this->cleaned['c_full_name'], $this->cleaned['c_email'], $this->cleaned['c_website'], $this->cleaned['c_message']));
    if ($this->DB->ErrorNo() > 0) {
      echo "An error occurred.";
    }
    $this->cleaned['id'] = $this->DB->Insert_ID(); //add the record id to the array;
  }

  public function getAll() {
    $rs = $this->DB->Execute("SELECT * FROM contact");
    if ($rs) {
      $rows = array();
      while ($row = $rs->FetchNextObject($toupper = false)) {
        $clean = array();
        foreach ($row as $key => $value) {
          $clean[$key] = trim(stripslashes($value), "'");
        }
        $rows[] = $clean;
      }
      echo json_encode($rows);
    }
  }

  public function getRow($id) {
    $query = $this->DB->Prepare("SELECT * FROM contact WHERE c_email = ?");
    $rs = $this->DB->Execute($query, array($id));
    $row = $rs->GetRowAssoc($toupper = false);
    $clean = array();
    foreach ($row as $key => $value) {
      $clean[$key] = trim(stripslashes($value), "'");
    }
    echo json_encode($clean);
  }

  public function __toString() {
    return $this->cleaned;
  }

}

?>
