<?php
include_once("/home/benjamin/db/italy.php");
include_once("/home/benjamin/db/adodb5/adodb.inc.php");
include_once("/home/benjamin/db/adodb5/adodb-errorpear.inc.php");
//include_once("/usr/local/www/db/adodb5/adodb-pager.inc.php");
//include_once("/usr/local/www/db/adodb5/adodb-exceptions.inc.php");

class DB {

  protected $connection;

  public function __construct() {
    $this->connection = ADONewConnection("mysql://" . DB_Config::DBUSER . ":" . DB_Config::DBPASS . "@" . DB_Config::DBHOST . "/" . DB_Config::DBNAME . "?persist");
  }

  protected function closeConnection() {
    $this->connection->Close();
  }

}

?>
