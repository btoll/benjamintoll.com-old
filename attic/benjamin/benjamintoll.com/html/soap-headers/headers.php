<?php
include_once("JSON.php");

$headers = array();
foreach (getallheaders() as $name => $value) {
  $headers[] = "$name: $value\n";
}


$json = new Services_JSON();
echo $json->encode($headers);
?>