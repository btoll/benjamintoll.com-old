function validate(obj) {

  if (document.all) {
	obj = obj.srcElement ? obj.srcElement : obj;
  } else {
	obj = obj.constructor === Event ? this : obj;
  }

  var scrub = new Scrubber(obj);
  if (scrub.validate()) {

	var values = {
	  "div": true,
	  "yellowFade": false,
	  "changeElementColors": true, //should the LABELs and text INPUTs change to indicate an error?;
	  "divID": "errors",
	  "divHeader": "Please correct the following errors:",
	  "noErrorColor": [255, 255, 255],
	  "fadeColor": [100, 100, 100],
	  "errorColor": [255, 255, 204],
	  "labelColor": [255, 0, 0]
	};

    var errors = scrub.getErrors(values);
    if (!errors) { //'errors' will be undefined if there is no argument passed to this.getErrors() or if 'div' = 'true' and there is a divID provided;
	  return false;
	} else if (errors.constructor === String) { //this block will be fired if 'div' = 'true' but there is no divID provided;
      document.getElementById("errors").innerHTML = errors;
      document.getElementById("errors").style.display = "block";
	  return false;
	}
	
  } else { //no errors, allow the browser to submit the form;
    document.getElementById("errors").innerHTML = "Form passed validation!";
    document.getElementById("errors").style.display = "block";
  }

}