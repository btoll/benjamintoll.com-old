<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, X-Requested-With');

$start = $_GET['start'];
$limit = $_GET['limit'];
$name = $_GET['name'] . '_';
$total = $_GET['total'];
for ($i = 0; $i < $limit; $i++) {
    $record_num = $i + $start;
    $id = $name . $record_num;
    $arr[] = "{ name: '$id',  email: '$id@extjs.com',  phone: '555-111-1224 x$record_num'  }";
}
echo "{ success: true, total: $total, rows: [" . join($arr, ', ') . "] }";
?>
