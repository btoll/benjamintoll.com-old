<?php
include_once("/home/benjamin/db/db.php");
include_once("JSON.php");

$sql = sprintf("SELECT email FROM email_addresses ORDER BY email LIMIT %d, %d", $_GET['start'], $_GET['limit']);
$sql2 = sprintf("SELECT email FROM email_addresses");
$result = mysql_query($sql);
$result2 = mysql_query($sql2);

$rows = array();
while ($row = mysql_fetch_object($result)) {
  $rows[] = $row;
}

$json = new Services_JSON();
echo "{\"total\": " . mysql_num_rows($result2) . ", \"records\": " . mysql_num_rows($result) . ", \"rows\": " . $json->encode($rows) . "}";
?>
