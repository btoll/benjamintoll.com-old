<?php
require_once("../lib/php/controller.php");
function __autoload($class) {
  require_once("/home/benjamin/public_html/lib/php/classes/$class.php");
}

$title = "benjamintoll.com - Contact";
$id = "contact";
$styles = '<link rel="stylesheet" type="text/css" href="http://www.benjamintoll.com/jslite/lib/css/jslite.css" />';
$scripts = <<<SCRIPT
<script type="text/javascript">
JSLITE.ready(function () {

  var callback = function (e) {
    var oScrubber = this.dom.scrubber;
    var oDiv = oScrubber.setErrorBox();
    if (oScrubber.getErrors() > 0) {
      JSLITE.dom.get(this.dom).before(oDiv);
      e.preventDefault();
    }
  };

  var oBox = JSLITE.dom.create({tag: "div", //default error box;
    attr: {className: JSLITE.globalSymbol + "_errorBox"},
    children: [
      JSLITE.dom.create({tag: "p",
        attr: {innerHTML: "The following form elements failed validation:"}
      }),
      JSLITE.dom.create({tag: "ol",
        attr: {className: JSLITE.globalSymbol + "_errorList"}
      })
    ]
  });

  var oForm = JSLITE.dom.get("contactForm");
  oForm.validate(callback, {
    classMap: "parent",
    errorBox: oBox,
    template: new JSLITE.Template("<em>{name}</em>", "<span>{rule}</span>")
  });

});
</script>
SCRIPT;

        require_once("../lib/includes/header.php");
        require_once("../lib/includes/branding.php");
      ?>

      <hr />
      <span class="pageHeader">Contact</span>
      <hr />

      <p>* Required Fields</p>
      <?php if(isset($html)) echo $html; ?>
      <form id="contactForm" method="post" action="<?=$_SERVER['PHP_SELF']?>">
        <fieldset>
          <ol>
            <li>
              <label for="full_name">Full Name <span>*</span></label>
              <input type="text" id="full_name" name="full_name" class="required" value="<?=isset($full_name) ? $full_name : '';?>" />
            </li>
            <li>
              <label for="email">Email <span>*</span></label>
              <input type="text" id="email" name="email" class="required-email" value="<?=isset($email) ? $email : '';?>" />
            </li>
            <li>
              <label for="website">Website</label>
              <input type="text" id="website" name="website" value="<?=isset($website) ? $website : '';?>" />
            </li>
            <li>
              <label for="message">Message <span>*</span></label>
              <textarea id="message" name="message" class="required"><?=isset($message) ? $message : '';?></textarea>
            </li>
            <li>
              <input type="submit" id="submitContact" name="submitContact" value="Submit" <?php if (isset($disable) && $disable == 1) echo "disabled='disabled'"; ?> />
            </li>
          </ol>
        </fieldset>
      </form>

    </div><!--end div#content-->

    <?php require_once("../lib/includes/footer.php"); ?>

</body>
</html>
