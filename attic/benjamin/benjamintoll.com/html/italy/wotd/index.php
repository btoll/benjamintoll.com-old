<?php
$body_id = "wotd";
include_once("../lib/php/config.php");
include_once(HEADER);
#include_once("../lib/php/search_engines.php");
$cfg = new ItalyDAO();
?>

  <div id="text">
    <form id="wotdForm" method="post" action="<?=$_SERVER['PHP_SELF']?>">
      <p>Enter your email to receive the <strong>Word of the Day</strong></p>
      <label><input class="text" type="text" id="email" name="email" /></label>
      <label><input class="submit" type="submit" name="submit" value="Submit" /></label>
    </form>

    <div id="response">
      <?php
        if (isset($_POST['email'])) {
          $cfg->checkEmail($_POST['email']);
        }
      ?>
    </div>

    <div id="random">
      <?=$cfg->getRandomWord();?>
    </div>

    <form id="refreshForm" method="post" action="<?=$_SERVER['PHP_SELF']?>">
      <label><input class="submit" type="submit" name="refresh" value="Refresh" /></label>
    </form>
  </div>

  <?php
  include_once(FOOTER);
  ?>
