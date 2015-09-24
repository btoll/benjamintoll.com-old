<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Music Theory Quiz by benjamintoll.com</title>
<link rel="stylesheet" type="text/css" href="http://www.benjamintoll.com/jslite/lib/css/jslite.css" />
<link rel="stylesheet" type="text/css" href="lib/css/global.css" />
<style type="text/css">
.warning {
  display: none;
}
</style>
<!--[if IE]>
<style type="text/css">
.warning {
  color: red;
  display: block;
  font-size: 13px;
  margin-bottom: 5px;
}
</style>
<![endif]-->
<?php
include_once("/home/benjamin/public_html/lib/includes/jslite_scripts.php");
?>
<script type="text/javascript" src="lib/js/chord_quiz.js"></script>
<script type="text/javascript" src="lib/js/key_signatures_quiz.js"></script>
</head>
<body>

<p class="warning">Warning: this functionality has not been properly tested on your browser and will probably not work!</p>

<form id="mainMenu">
  <fieldset>
    <legend>Main Menu</legend>
    <label><input type="radio" name="quiz" value="chordQuiz" /> Chord Quiz</label>
    <label><input type="radio" name="quiz" value="chordBuilder" /> Chord Builder</label>
    <label><input type="radio" name="quiz" value="keySignaturesQuiz" /> Key Signatures Quiz</label>
  </fieldset>
</form>

<div id="chordQuiz" style="display: none;">
  <form id="chordMenu">
    <fieldset>
      <legend>Skill Level</legend>
      <label><input type="radio" id="advanced" name="difficulty" value="advanced" checked="checked" /> Advanced</label>
      <label><input type="radio" id="intermediate" name="difficulty" value="intermediate" /> Intermediate</label>
      <label><input type="radio" id="beginner" name="difficulty" value="beginner" /> Beginner</label>
    </fieldset>
  </form>

  <h3>Guess the chord below by selecting a Chord, Type and an Inversion</h3>
  <h3>Build the chord below by selecting the Notes that make it up</h3>

  <div id="currentChordContainer">
    <div id="currentChord" class="clearfix"></div>
    <button class="skipChord">Skip Chord</button>
  </div>

  <p>Drag a note into each box</p>
  <div id="dropZoneContainer" class="clearfix" style="display: none;">
    <div class="dropZone"></div>
    <div class="dropZone"></div>
    <div class="dropZone"></div>
    <div class="dropZone"></div>
  </div>

  <p>Chord</p>
  <div id="notes" class="clearfix">
  </div>

  <p>Type</p>
  <div id="chords" class="clearfix">
  </div>

  <p>Inversion</p>
  <div id="inversions" class="clearfix">
  </div>
</div>

<div id="keySignaturesQuiz" style="display: none;">
  <h3>Guess the key signature below by selecting the Key</h3>

  <div id="currentKeySignature" class="clearfix">
  </div>

  <p>Key</p>
  <div id="keySignatures" class="clearfix">
  </div>
</div>

</body>
</html>
