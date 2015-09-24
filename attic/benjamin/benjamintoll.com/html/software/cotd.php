<?php
function __autoload($class) {
  require_once("/home/benjamin/public_html/lib/php/classes/$class.php");
}

$title = "benjamintoll.com - Linux Command of the Day";
$id = "cotd";
$styles = "";
$scripts = "";

require_once("../lib/includes/header.php");
require_once("../lib/includes/branding.php");
?>

      <hr />
      <span class="pageHeader">Linux Command of the Day</span>
      <hr />

      <p>I'm a Linux enthusiast.</p>
      <p>I thought it would be a great idea to receive a Linux command every day. Nothing fancy, just the result of doing a <a href="http://www.linuxclues.com/articles/12.htm">whatis</a> command.</p>
      <form method="post" action="<?=$_SERVER['PHP_SELF']?>">
        <p>Enter your email to receive the <strong>Linux Command of the Day</strong></p>
        <?php
          if (isset($_POST['email'])) {
            $contact = new LinuxDAO();
            $contact->checkEmail($_POST['email']);
          }
        ?>
        <label><input class="text" type="text" id="email" name="email" /></label>
        <label><input class="submit" type="submit" name="submit" value="Submit" /></label>
      </form>

    </div><!--end div#content-->
    <?php
      require_once("../lib/includes/footer.php");
    ?>
</body>
</html>
