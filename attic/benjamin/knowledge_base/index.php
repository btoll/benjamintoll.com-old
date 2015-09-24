<?php

include_once("../lib/knowledge_base.php");

?>
<html>

<head>

<title>benjamintoll.com - Knowledge Base</title>

<link rel="stylesheet" href="/home/home.css">

<script language="javascript" src="/home/email.js">
</script>

</head>

<body onLoad="document.categories.phrase.focus()">

<table id="parent_table" align="center">

<tr>

<td align="left">Knowledge Base</td>

</tr>

<tr>

<td><hr noshade width="400" size="1"></td>

</tr>

</table>

<center>

<br>

The following is a growing list of articles or notes <br>

that have proven either helpful to us or to our clients.

<br><br>

<form name="categories" method="post" action="search.php">

<table>

<tr>

	<td>Search by subject:

		<select name="categories"><option value="select">Select</option>

		<?php

			// create the drop-down list for the categories;

			list_categories();

		?>

		</select></td>

</tr>

<tr>
	<td><br></td>
</tr>

<tr>
	<td align="center">-<b>or</b>-</td>
</tr>

<tr>
	<td><br></td>
</tr>

<tr>
	<td>Search by keyword(s): <input type="text" name="phrase"></td>

</tr>
</table>

<br>

<table>
<tr>
	<td><input type="submit" name="submit" value="Search"></td>
	<!--<td><input type="submit" name="all" value="Search Entire Database"></td>-->
</tr>
</table>

<br><br>

Please <a href="javascript: mailto('ben', 'benjamintoll.com', 'Knowledge Base');">email</a> us with any questions.

</form>

</center>

</body>

</html>
