<?php
function __autoload($class) {
  require_once("/home/benjamin/public_html/italy/lib/php/classes/$class.php");
}

$cfg = new ItalyDAO();

switch ($_GET['function']) {

  case "check_email":
    $cfg->checkEmail($_GET['email']);
    break;

  case "conjugate_verb":
    $cfg->conjugateVerb($_GET['verb'], $_GET['tense']);
    break;

  case "random_word":
    $cfg->getRandomWord();
    break;

}

?>
