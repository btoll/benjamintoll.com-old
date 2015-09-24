<?php
include_once("/home/benjamin/lib/php/italy/italy.php");
#the autoloader function is here instead of putting it on every php script that needs it;
include_once("/home/benjamin/public_html/italy/lib/php/config.php");
function __autoload($class) {
  require_once("/home/benjamin/public_html/italy/lib/php/classes/$class.php");
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Online Italian Dictionary presented by benjamintoll.com</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="description" content="An online Italian dictionary provided by benjamintoll.com." />
<meta name="keywords" content="italy.benjamintoll.com, online Italian dictionary, Italian dictionary, Italian, Italy" />
<link rel="stylesheet" type="text/css" href="../../lib/css/italy.css" />
<script type="text/javascript" src="../../lib/js/italy.js"></script>
<script type="text/javascript" src="../../lib/js/xhr.js"></script>
</head>
<body id="<?=htmlentities($body_id);?>">
<div id="main">

  <div id="nav">
    <ul class="level1">
      <li><a id="dictionaryHref" href="/" title="Dictionary">Dictionary</a></li>
      <li><a id="pronunciationHref" href="/pronunciation/" title="Pronunciation">Pronunciation</a></li>
      <li><a id="wotdHref" href="/wotd/" title="Word Of The Day">Word Of The Day</a></li>
      <li class="submenu"><a id="grammarHref" class="crossHair" href="/grammar/numbers.php" title="Grammar">Grammar</a>
        <ul class="level2">
          <li><a href="/grammar/numbers.php" title="Numbers">Numbers</a></li>
          <li><a href="/grammar/pronouns.php" title="Pronouns">Pronouns</a></li>
          <li><a href="/grammar/verbs.php" title="Verbs">Verbs</a></li>
        </ul>
      </li>
      <li><a id="linksHref" href="/links/" title="Links">Links</a></li>
      <li><a id="contactHref" href="http://www.benjamintoll.com/contact/" title="Contact">Contact</a></li>
    </ul>
  </div>

  <div id="imageContainer">
    <img id="image" src="/images/Giovanni_Bellini_Il_Doge.jpg" alt="Giovanni Bellini" />
    <p id="imageDescription"></p>
  </div>

