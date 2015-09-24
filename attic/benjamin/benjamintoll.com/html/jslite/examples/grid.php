<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>jsLite JSLITE.ux.Grid</title>
<link rel="stylesheet" type="text/css" href="http://www.benjamintoll.com/jslite/lib/css/jslite.css" />
<style type="text/css">
#xmlGrid, 
#jsonGrid {
  margin: 40px;
}
</style>
<?php
include_once("/home/benjamin/public_html/lib/includes/jslite_scripts.php");
?>
<script type="text/javascript">
JSLITE.ready(function () {

  var sm = new JSLITE.ux.Checkbox();

  var cm = new JSLITE.ux.ColumnModel([
    sm,
    { header: "Italian", dataIndex: "italian", width: 175 },
    { header: "Pronunciation", dataIndex: "pronunciation", width: 150 },
    { header: "Grammar", dataIndex: "grammar", width: 100 },
    { header: "Translation", dataIndex: "translation", width: 375 }
  ]);

  var reader = new JSLITE.ux.Reader({
    root: "rows",
    total: "total",
    fields: [
      {name: "italian"},
      {name: "pronunciation"},
      {name: "grammar"},
      {name: "translation"}
    ]
  });

  var ds = new JSLITE.ux.RemoteStore({
    type: "json",
    url: "../../lib/php/word_search.php?phrase=gli",
    params: {
      start: 0,
      limit: 25
    },
    reader: reader
  });

  var pager = new JSLITE.ux.Pager({
    store: ds,
    location: "top",
    template: new JSLITE.Template("<strong>{total}</strong> / {pageStart} - {pageEnd}")
  });

/*
  sm.subscribe("selectall", function (e) {
    console.log(e);
    return false;
  });
*/

  var grid = new JSLITE.ux.Grid({
    id: "theGrid",
    height: 250,
    width: 840,
    cm: cm,
    store: ds,
    checkbox: sm,
    stripe: true, //not striped by default;
    pager: pager
  });

  grid.render($("jsonGrid"));

/*
*****************************************************************************************************
*****************************************************************************************************
*/

  var sm2 = new JSLITE.ux.Checkbox();

  var cm2 = new JSLITE.ux.ColumnModel([
    sm2, 
    { header: "First Name", dataIndex: "firstname", width: 175 },
    { header: "Last Name", dataIndex: "lastname", width: 150 },
    { header: "Instrument", dataIndex: "instrument", width: 100 },
    { header: "Genre", dataIndex: "genre", width: 375 }
  ]);

  var reader2 = new JSLITE.ux.Reader({
    root: "musician",
    fields: [
      {name: "firstname"},
      {name: "lastname"},
      {name: "instrument"},
      {name: "genre"}
    ]
  });

  var ds2 = new JSLITE.ux.RemoteStore({
    type: "xml",
    url: "musicians.xml",
    reader: reader2
  });

  var grid2 = new JSLITE.ux.Grid({
    id: "theGrid2",
    height: 250,
    width: 840,
    cm: cm2,
    checkbox: sm2,
    store: ds2,
    stripe: true //not striped by default;
  });

  grid2.render($("xmlGrid"));

});
</script>
</head>

<body>

  <h3>Grid with an XML data store</h3>
  <div id="xmlGrid">
  </div>

  <h3>Grid with a Json data store</h3>
  <div id="jsonGrid">
  </div>

</body>
</html>
