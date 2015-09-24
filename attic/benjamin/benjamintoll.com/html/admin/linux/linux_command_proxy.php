<?php
include_once("/home/benjamin/db/blueboy2.php");
include_once("../italy/JSON.php");

$sql = sprintf("SELECT linux FROM linux ORDER BY linux %s LIMIT %d, %d", $_GET['dir'], $_GET['start'], $_GET['limit']);
$sql2 = sprintf("SELECT linux FROM linux");
$result = mysql_query($sql);
$result2 = mysql_query($sql2);

$rows = array();
while ($row = mysql_fetch_object($result)) {
  $rows[] = $row;
}

$json = new Services_JSON();

#allows jsonp, if needed (note the json is wrapped in parens);
#echo $_GET['jsonp_callback'] . "({\"total\": " . mysql_num_rows($result2) . ", \"records\": " . mysql_num_rows($result) . ", \"rows\": " . $json->encode($rows) . "})";
echo $_GET['callback'] . "({\"total\": " . mysql_num_rows($result2) . ", \"records\": " . mysql_num_rows($result) . ", \"rows\": " . $json->encode($rows) . "})";
?>
