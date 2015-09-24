<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>jsLite Drag &amp; Drop</title>
<link rel="stylesheet" type="text/css" href="http://www.benjamintoll.com/jslite/lib/css/jslite.css" />
<style type="text/css">
.dropZone {
  border: 1px solid #000;
  float: left;
  height: 300px;
  margin: 20px;
  width: 300px;
}
.last {
  height: 50px;
  width: 50px;
}
</style>
<link rel="stylesheet" type="text/css" href="../../lib/css/jslite.css" />
<?php
include_once("/home/benjamin/public_html/lib/includes/jslite_scripts.php");
?>
<script type="text/javascript">
JSLITE.ready(function () {

  var oDZM = JSLITE.ux.DropZoneManager;

  oDZM.add(JSLITE.dom.get(".dropZone"), {
    sort: true //sort the drop zone's sortable elements after drop;
  });

  oDZM.add(JSLITE.dom.gets(".dropZone + .dropZone, .dropZone + .dropZone + .dropZone"));

  oDZM.add(JSLITE.dom.gets(".dropZone.last"), {
    snapToZone: true,
    subscribe: {
      beforenodedrop: function (e) {
        //console.log("beforenodedrop!");
        if (JSLITE.dom.gets(".JSLITE_draggable", this).length) { //only drop if there isn't another child element in the target drop zone;
          //console.log("element was not dropped, there can be only one DOM element drop zone!");
          alert("element was not dropped, there can be only one DOM element in this drop zone!");
          return false;
        }
      },
      afternodedrop: function (e) {
        //console.log("afternodedrop!");
      }
    }
  });

  for (var i = 0; i < 10; i++) {
    JSLITE.dom.create({tag: "div",
      attr: {
        className: "JSLITE_draggable",
        sortOrder: i
      },
      style: {
        border: "1px solid #CCC",
        float: "left",
        height: "50px",
        margin: "10px",
        textAlign: "center",
        width: "50px"
      },
      children: [
        JSLITE.dom.create({tag: "span",
          attr: {
            innerHTML: i
          },
          style: {
            display: "block",
            padding: "15px 0"
          }
        })
      ],
      parent: JSLITE.dom.get(".dropZone", true)
    });
  }

});
</script>
</head>

<body>

  <div class="dropZone">
  </div>

  <div class="dropZone">
  </div>

  <div class="dropZone">
  </div>

  <div class="dropZone last">
  </div>

</body>
</html>
