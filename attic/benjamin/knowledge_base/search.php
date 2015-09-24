<?php

// this script handles the user input from /knowledge_base/index.php;

if (isset($_POST['submit'])) {

	if ($_POST['categories'] == 'select' && !$_POST['phrase']) {

		// don't do anything if a category has not been selected and the user still hits Search;

		header("Location: /knowledge_base/index.php");

		exit();

	}

	if ($_POST['categories'] != 'select' && $_POST['phrase']) {

		// don't do anything if both a category and a phrase has been selected;

		header("Location: /knowledge_base/index.php");

		exit();

	}

	if ($_POST['categories'] != 'select') {

		// list all text_files as a hyperlink that relate to the user's search choice;

		echo "<center>\n\n";
		
		include_once("../lib/knowledge_base.php");

		list_text_files($_POST['categories']);

		echo "<a href=\"/knowledge_base/index.php\"><font color=\"navy\">Back</font></a>\n";

	}

	if ($_POST['phrase']) {

                                // use this function for security purposes;

		$phrase = htmlentities($_POST['phrase']);

		// call the function that will search the database by phrase;

		echo "<center>\n\n";
		
		include_once("../lib/knowledge_base.php");

		list_by_phrase($phrase);

		echo "<a href=\"/knowledge_base/index.php\"><font color=\"navy\">Back</font></a>\n";

	}

}

if (isset($_POST['all'])) {

		// list all text_files as a hyperlink;

		echo "<center>\n\n";
		
		include_once("../lib/knowledge_base.php");

		list_all_files();

		echo "<a href=\"/knowledge_base/index.php\"><font color=\"navy\">Back</font></a>\n";

}

?>

<html>

<body link="olive" alink="olive" vlink="olive">

</body>

</html>
