<?php
require_once("../lib/php/controller.php");
function __autoload($class) {
  require_once("../lib/php/classes/$class.php");
}

$title = "benjamintoll.com - About";
$styles = "";
$scripts = "";
$id = "about";

        require_once("../lib/includes/header.php");
        require_once("../lib/includes/branding.php");
      ?>

      <hr />
      <span class="pageHeader">About</span>
      <hr />

      <ul id="aboutMe">
        <li>Engineer at <a href="http://www.sencha.com/">Sencha</a></li>
        <li>First alumnus of <a href="http://www.terray.com/">TASC</a> boot camp</li>
        <li>Earned a history degree from the University of New Mexico</li>
        <li>Have lived in San Jose, Albuquerque, Phoenix and <a href="http://en.wikipedia.org/wiki/Pozzuoli">Pozzuoli, Italy</a></li>
        <li>Originally from Camp Hill, Pennsylvania</li>
<!--
        <li>Currently living in the Bay Area with my wife <a href="../images/bob_and_chuck.jpg">and</a> <a href="../images/bob.jpg">two</a> <a href="../images/chuck.jpg">cats</a></li>
-->
        <li>Currently living in the Boston area with my family</li>
<!--
        <li>Has noodled around on guitar since first being exposed to Led Zeppelin as a teenager and is currently studying jazz guitar under <a href="http://www.hristovitchev.com/">Hristo Vitchev</a></li>
-->
      </ul>

    </div><!--end div#content-->

    <?php require_once("../lib/includes/footer.php"); ?>

</body>
</html>
