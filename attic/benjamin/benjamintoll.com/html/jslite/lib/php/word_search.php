<?php
include_once("/home/benjamin/db/db.php");
include_once("JSON.php");

#########################################

$sql = sprintf("SELECT italian, pronunciation, grammar, translation FROM words WHERE italian LIKE '%%%s%%' ORDER BY italian, grammar LIMIT %d, %d", strip_tags($_GET["phrase"]), strip_tags($_GET["start"]), strip_tags($_GET["limit"]));
$sql2 = sprintf("SELECT italian, pronunciation, grammar, translation FROM words WHERE italian LIKE '%%%s%%' ORDER BY italian, grammar", strip_tags($_GET["phrase"]));

//if there is nothing returned then let the user know and the script will end;
$result = mysql_query($sql);
$result2 = mysql_query($sql2);

//this function counts the results in the array and displays the result
//on the page along with the word searched for;
$num_results = mysql_num_rows($result);
$total = mysql_num_rows($result2);
$rows = array();
//while ($row = mysql_fetch_row($result)) { //fetch as an array;
while ($row = mysql_fetch_object($result)) { //fetch as an object;
  $rows[] = $row;
}

$json = new Services_JSON();
# allow for jsonp
echo $_GET['callback'] . "({\"total\": " . $total . ", \"records\": " . $num_results . ", \"rows\": " . $json->encode($rows) . "})";
?>
