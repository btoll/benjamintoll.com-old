<?php
$body_id = "links";
include_once("../lib/php/config.php");
include_once(HEADER);
#include_once("../lib/php/search_engines.php");
$links = new ItalyDAO();
?>

  <div id="text">
    <?php
    $arr = array("Museums and Galleries", "International News", "Hotels and Hostels", "Miscellaneous");
    //map each array element to the link type in the table;
    for ($i = 0; $i < count($arr); $i++) {
      echo "<h4>" . $arr[$i] . "</h4>\n";
      foreach ($links->getLinks($i) as $link) {
        echo $link;
      }
    }
    ?>
  </div>

  <?php
  include_once(FOOTER);
  ?>
