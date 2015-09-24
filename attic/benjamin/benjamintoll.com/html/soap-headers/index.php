<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>SOAP headers</title>
<script type="text/javascript" src="jquery-1.2.6.js"></script>
<script type="text/javascript" src="jqXMLUtils.js"></script>
<script type="text/javascript" src="jqSOAPClient.js"></script>
<script type="text/javascript">
var soap = function (oOptions) {

  var soapBody = new SOAPObject(oOptions.object);
  soapBody.ns = oOptions.ns;
  soapBody.appendChild(new SOAPObject(oOptions.method)).val(oOptions.value); //Here I set the value of the zip code

  //Create a new SOAP Request pass SOAPAction and Body content parameters
  var sr = new SOAPRequest(oOptions.action, soapBody);

  //Lets send it
  SOAPClient.Proxy = oOptions.proxy; //Specify local proxy file
  SOAPClient.SOAPServer = oOptions.server; //My proxy uses SOAPServer header to redirect my requests
  SOAPClient.SendRequest(sr, oOptions.callback); //Send request to server and assign callback function

};

$(document).ready(function(){

  soap({
    ns: "http://www.webserviceX.NET",
    object: "GetInfoByCity",
    method: "USCity",
    value: "Harrisburg",
    action: "http://www.webserviceX.NET/GetInfoByCity",
    proxy: "headers.php",
    server: "http://www.webservicex.net/uszip.asmx",
    callback: function (oResponse) {
      var div = document.createElement("div");
      var arr = [];
      for (var i = 0, iLength = oResponse.length; i < iLength; i++) {
        arr.push(oResponse[i] + "<br />");
      }
      div.innerHTML = arr.join("");
      document.body.appendChild(div);
    }
  });

});
</script>
</head>

<body>
</body>
</html>