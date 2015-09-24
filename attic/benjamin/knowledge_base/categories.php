<?php

// enter some years into an array;

$category = array(
	'1' => 'FreeBSD',
	'2' => 'Apache',
	'3' => 'PHP',
	'4' => 'MySQL',
	'5' => 'Linux',
	'6' => 'SQL',
);


// create the CATEGORIES array:

echo "<select name=\"category\"><option value=\"select\">Select</option>\n\n";

for($n = 0; $n < count($category); $n++) {

    	$row = each($category);

   	echo "<option value=\"$row[key]\">$row[value]</option>\n";

}

echo "</select>\n";

?>
