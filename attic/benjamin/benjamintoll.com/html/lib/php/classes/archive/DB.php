<?php
include_once("/home/benjamin/db/italy.php");
include_once("/home/benjamin/db/adodb5/adodb.inc.php");
//include_once("/home/benjamin/db/adodb5/adodb-exceptions.inc.php");

class DB {

  private $connection;

  public function __construct() {
    $this->connection = ADONewConnection("mysql://" . DB_Config::DBUSER . ":" . DB_Config::DBPASS . "@" . DB_Config::DBHOST . "/" . DB_Config::DBNAME . "?persist");
  }

  public function getConnection() {
    return $this->connection;
  }

  public function closeConnection() {
    $this->connection->Close();
  }

}

?>
