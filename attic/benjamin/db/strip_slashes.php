<?php
include_once("db.php");
include_once("italy.php");
include_once("adodb5/adodb.inc.php");
include_once("adodb5/adodb-errorpear.inc.php");

$connection = ADONewConnection("mysql://" . DB_Config::DBUSER . ":" . DB_Config::DBPASS . "@" . DB_Config::DBHOST . "/" . DB_Config::DBNAME . "?persist");
$result = mysql_query("SELECT * FROM words WHERE pronunciation LIKE '%%\\\\\%%'");
echo "Found " .  mysql_num_rows($result) . " records\n";
while ($row = mysql_fetch_object($result)) {
  #echo $row->pronunciation . "\n";
  $query = $connection->Prepare("UPDATE words SET pronunciation = ? WHERE italian = ?");
  $connection->Execute($query, array(stripslashes($row->pronunciation), $row->italian));
}
?>
