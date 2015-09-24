function validate(obj) {

  if (document.all) {
	//obj = obj.srcElement ? obj.srcElement : obj;
	//obj = obj.srcElement ? obj = { elem: document.getElementById(obj.srcElement.parentNode.id), ev: "blur" } : obj;
	obj = obj.srcElement ?
	  obj = {
	    formObj: document.getElementById(obj.srcElement.parentNode.id),
	    elem: obj.srcElement,
	    evt: "blur"
	  }
	  : obj;

  } else {
	//obj = obj.constructor === Event ? this : obj;
	//obj = obj.constructor === Event ? obj = { elem: document.getElementById(this.parentNode.id), ev: "blur" } : obj;
	obj = obj.constructor === Event ?
	  obj = {
		formObj: document.getElementById(this.parentNode.id),
	    elem: this,
		evt: "blur"
	  }
	  : obj;
  }

  var scrub = new Scrubber(obj);

  if (scrub.validate()) {

	if (!formSubmit) {
	  scrub.increment();
	}

	var values = {
	  div: true,
	  yellowFade: false,
	  changeElementColors: true, //should the LABELs and text INPUTs change to indicate an error?;
	  divID: "errors",
	  divHeader: "Please make changes to the following:",
	  noErrorColor: [255, 255, 255],
	  fadeColor: [100, 100, 100],
	  errorColor: [255, 255, 204],
	  labelColor: [255, 0, 0]
	};

    var errors = scrub.getErrors(values);
    if (!errors) { //'errors' will be undefined if there is no argument passed to this.getErrors() or if 'div' = 'true' and there is a divID provided;
	  return false;
	} else if (errors.constructor === String) { //this block will be fired if 'div' = 'true' but there is no divID provided;
      document.getElementById("errors").innerHTML = errors;
      document.getElementById("errors").style.display = "block";
	  return false;
	}
	
  } else if (allGood) { //no errors, allow the browser to submit the form;
    document.getElementById("errors").innerHTML = "Form passed validation!";
    document.getElementById("errors").style.display = "block";
  }

}