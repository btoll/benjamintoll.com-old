<?php
$title = "benjamintoll.com - jsLite Examples Page";
$id = "examples";
$styles = "";
$scripts = "";

        require_once("../../lib/includes/header.php");
        require_once("../../lib/includes/branding.php");
      ?>

      <hr />
      <span class="pageHeader">Examples</span>
      <hr />

      <p>Check back frequently for more examples.</p>
      <p>Please view the source on each example page.</p>
      <ul>
        <li><a href="ajaxFormSubmission.php">Ajax Form Submission</a></li>
        <li><a href="template.php">Create an HTML Templating Engine</a></li>
        <li><a href="dragdrop.php">Drag and Drop (beta)</a></li>
        <li><a href="validate.php">Form Validation</a></li>
        <li><a href="grid.php">Grid (beta)</a></li>
        <li><a href="list.php">Lists</a></li>
        <li><a href="textcopy.php">Text Copy</a></li>
        <li><a href="tooltip.php">Tooltips</a></li>
        <li><a href="tooltip2.php">More Tooltips</a></li>
        <li><a href="tooltip_animation.php">Animated Tooltips (beta)</a></li>
        <li><a href="closest.php">Using <code>JSLITE.Element.closest</code> with event delegation</a></li>
      </ul>

      <p>NOTE that anything marked beta hasn't been properly tested on IE. In my full-time job I no longer work with browsers, so I do what I can, when I can.</p>
      </div><!--end div#content-->

      <?php require_once("../../lib/includes/footer.php"); ?>

      </div>

</body>
</html>
