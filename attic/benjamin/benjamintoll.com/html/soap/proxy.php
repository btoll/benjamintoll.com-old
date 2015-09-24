<?php
// PHP Proxy

//put the HEADER data in the header;
$header = array();
foreach (getallheaders() as $key => $value) {
  if (strtolower($key) == "soapserver") {  //the case of the SOAPServer header is different by browser;
    $url = $value;
  }
  $header[] = $key.":".$value;
}

//Start the Curl session
$session = curl_init($url);

// Don't return HTTP headers. Do return the contents of the call
curl_setopt($session, CURLOPT_HEADER, false);
curl_setopt($session, CURLOPT_HTTPHEADER, $header); 

//Capture all data posted
$postdata = $GLOBALS['HTTP_RAW_POST_DATA'];

// If it's a POST, put the POST data in the body
if ($postdata) {
  curl_setopt ($session, CURLOPT_POSTFIELDS, $postdata);
}

// The web service returns XML. Set the Content-Type appropriately
header("Content-Type:text/xml");

// Make the call
$response = curl_exec($session);
$header_size = curl_getinfo($session,CURLINFO_HEADER_SIZE);
$result = substr($response, $header_size );

echo $result;

curl_close($session);

?>