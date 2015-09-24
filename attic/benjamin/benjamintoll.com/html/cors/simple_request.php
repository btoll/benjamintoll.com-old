<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, X-Requested-With');
//header('Access-Control-Allow-Credentials: true');
//header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
//header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");
/*

$str = <<<STR
{   
    foo: 'bar'
}
STR;

echo $str;
*/
echo('{"companies":[{"company":"3m Co","price":71.72,"change":0.02,"pctChange":0.03,"lastChange":"9/1 12:00am"}],"total":1}')
?>
