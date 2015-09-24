function Scrubber(obj) {

  //class methods:
  // 1. privileged validatate();
  // 2. prototype resetElements(); #sets the LABELs and text INPUTs back to their default colors;
  // 3. prototype capFirstLetter();
  // 4. prototype getErrors();

  //public properties;
  this.theForm = obj;
  this.data = [];
  this.errors = [];
  this.successes = [];

  //private properties;
  var required = [];
  var args = {}; //an object that stores presentational information passed to this.getErrors();

  //the 'constructor' function takes the form and loops through its elements looking for any 'required' fields and any fields that need 'attention';
  var theLength = this.theForm.elements == undefined ? 1 : this.theForm.elements.length; //if this.theForm.elements is undefined then a single form input element has been passed rather than the entire form;
  for (var i = 0; i < theLength; i++) {

    var elem = this.theForm.elements == undefined ? this.theForm : this.theForm.elements[i];
    if (elem.className && elem.className.indexOf("required") != -1) {
	  if (!elem.value.match(/\S/)) { //flag fields that only contain whitespace;
	    required.push(["blank", elem.name]);
	  } else {
	    if (elem.className.indexOf(" ") != -1) { //there's more than one class;
	      var aType = elem.className.substring(elem.className.indexOf("-")+1, elem.className.indexOf(" ")); //only keep what's after '-' and before the space (" "), indicating there's another class name;
	    } else { //there's only one class;
	      var aType = elem.className.substring(elem.className.indexOf("-")+1); //only keep what's after '-';
		}
		required.push([aType, elem.name, elem.value]);
	  }

    } else if (elem.className && elem.className.indexOf("attention") != -1) {
      //only add the element to the 'attention' array if the user entered a value;
      if (elem.value.match(/\S/)) { //only add to the required array if there's no whitespace;
	    if (elem.className.indexOf(" ") != -1) { //there's more than one class;
	      var rType = elem.className.substring(elem.className.indexOf("-")+1, elem.className.indexOf(" ")); //only keep what's after '-' and before the space (" "), indicating there's another class name;
        } else { //there's only one class;
	      var rType = elem.className.substring(elem.className.indexOf("-")+1); //only keep what's after '-';
	    }
	    required.push([rType, elem.name, elem.value]);
	  }
	}

  }
  this.data = required;

} //end class Scrubber;

Scrubber.prototype.validate = function() {

  for (var i = 0; i < this.data.length; i++) {

    switch(this.data[i][0]) {
      case "alpha":
		if (!this.data[i][2].match(/^[a-zA-Z]+$/)) {
		  var message = " can only contain letters.";
		  this.errors.push([this.data[i][1], message]);
		}
	    break;

      case "alphanumeric":
		if (!this.data[i][2].match(/^[a-zA-Z0-9]+$/)) {
		  var message = " can only contain letters and/or numbers.";
		  this.errors.push([this.data[i][1], message]);
		}
	    break;

      case "blank":
		var message = " cannot be blank.";
		this.errors.push([this.data[i][1], message]);
	    break;

      case "date":
		if (!this.data[i][2].match(/^[0-9]{2}([-\/.]?)[0-9]{2}\1([0-9]{2,4})$/)) { //NOTE the backreference to ensure that the character separators are the same;
		  var message = " can only contain numbers and forward slashes, dashes or periods and must include a two-digit month and day and a two-digit or four-digit year.";
		  this.errors.push([this.data[i][1], message]);
		} else {
		  if (this.data[i][2].length == 8) { //four-digit year;
		    this.successes.push([this.data[i][1], this.data[i][2].substring(0, 2) + "/" + this.data[i][2].substring(2, 4) + "/"+ this.data[i][2].substring(4, 8)]);
		  } else if (this.data[i][2].length == 6) { //two-digit year;
		    this.successes.push([this.data[i][1], this.data[i][2].substring(0, 2) + "/" + this.data[i][2].substring(2, 4) + "/"+ this.data[i][2].substring(4, 6)]);
		  }
		}
	    break;

      case "decimal":
		if (!this.data[i][2].match(/^[0-9]*\.[0-9]+$/)) {
		  var message = " can only contain decimals.";
		  this.errors.push([this.data[i][1], message]);
		}
	    break;

      case "email":
		if (!this.data[i][2].match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)) {
		  var message = " failed validation.";
		  this.errors.push([this.data[i][1], message]);
		}
	    break;

      case "numeric":
		if (!this.data[i][2].match(/^[0-9]+$/)) {
		  var message = " can only contain numbers.";
		  this.errors.push([this.data[i][1], message]);
		}
	    break;

      case "phone":
	    var pattern = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
		//The phone number regular expression accepts phone number in both local format (eg. 02 1234 5678 or 123 123 4567) or international format (eg. +61 (0) 2 1234 5678 or +1 123 123 4567). It also accepts an optional extention of up to five digits prefixed by x or ext (eg. 123 123 4567 x89) - http://javascript.about.com/library/blre.htm;
		if (!this.data[i][2].match(pattern)) {
		  var message = " failed validation.";
		  this.errors.push([this.data[i][1], message]);
		} else {
		  var theValue = this.data[i][2].replace(/[^a-zA-Z0-9]/g, ''); //strip out anything except alphanumeric chars;
		  if (theValue.charAt(0) == '1') { //we don't want
		    var message = " cannot begin with a one (1).";
		    this.errors.push([this.data[i][1], message]);

		  } else if (theValue.match(/(x|ext)/)) { //there is an extension;
			if (theValue.indexOf("ext") != -1) {
			  var format = theValue.substring(0, theValue.indexOf("ext")); //chop off 'ext';
			  if (format.length == 10) {
				//formats (717)737-8879 ext1234;
			    this.successes.push([this.data[i][1], "(" + format.substring(0, 3) + ")" + format.substring(3, 6) + "-" + format.substring(6, 10) + " " + theValue.substring(theValue.indexOf("ext"), theValue.length)]);
			  } else if (format.length == 7) {
				//formats 737-8879 ext1234;
				this.successes.push([this.data[i][1], "(" + format.substring(0, 3) + "-" + format.substring(3, 7) +  " " + theValue.substring(theValue.indexOf("ext"), theValue.length)]);
			  }
			} else if (theValue.indexOf("x") != -1) {
			  var format = theValue.substring(0, theValue.indexOf("x")); //chop off 'x';
			  if (format.length == 10) {
				//formats (717)737-8879 x1234;
			    this.successes.push([this.data[i][1], "(" + format.substring(0, 3) + ")" + format.substring(3, 6) + "-" + format.substring(6, 10) + " " + theValue.substring(theValue.indexOf("x"), theValue.length)]);
			  } else if (format.length == 7) {
				//formats 737-8879 x1234;
				this.successes.push([this.data[i][1], "(" + format.substring(0, 3) + "-" + format.substring(3, 7) +  " " + theValue.substring(theValue.indexOf("x"), theValue.length)]);
			  }
			}

		  } else { //there is no extension;
		    if (theValue.length == 10) {
			  //formats (717)737-8879;
			  this.successes.push([this.data[i][1], "(" + theValue.substring(0, 3) + ")" + theValue.substring(3, 6) + "-" + theValue.substring(6, 10)]);
			} else if (theValue.length == 7) {
			  //formats 737-8879;
			  this.successes.push([this.data[i][1], "(" + theValue.substring(0, 3) + "-" + theValue.substring(3, 7)]);
			}
		  }
		}
	    break;

      case "ssn":
		if (!this.data[i][2].match(/^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/)) {
		  var message = " failed validation.";
		  this.errors.push([this.data[i][1], message]);
		} else {
		  if (this.data[i][2].length != 11) {
		    var format = this.data[i][2].replace(/-/g, '');
		    var theValue = format.substring(0, 3) + "-" + format.substring(3, 5) + "-" + format.substring(5, 9);
		    this.successes.push([this.data[i][1], theValue]);
		  }
		}
	    break;

      case "url":
		if (!this.data[i][2].match(/^((http|ftp|https):\/\/)?(www.?\.)?.+\..{2,3}$/)) { //a good start but needs work;
		  var message = " failed validation.";
		  this.errors.push([this.data[i][1], message]);
		} else {
		  if (!this.data[i][2].match(/^www\./)) {
		    this.successes.push([this.data[i][1], "www." + this.data[i][2]]);
		  }
		}
	    break;

      case "zipcode":
		if (!this.data[i][2].match(/^[0-9]{5}-?([0-9]{4})?$/)) {
		  var message = " failed validation.";
		  this.errors.push([this.data[i][1], message]);
		} else {
		  //correct formatting is either '17057' or '17057-1234';
		  if (this.data[i][2].length == 6) { //length = 6 b/c there's a trailing hyphen;
		    this.successes.push([this.data[i][1], this.data[i][2].substring(0, this.data[i][2].length-1)]); //chop off the hyphen;
		  } else if (this.data[i][2].length == 9) {
			this.successes.push([this.data[i][1], this.data[i][2].substring(0, 5) + "-" + this.data[i][2].substring(5, 9)]);
		  }
		}
	    break;

	  default:
	    break;
    }

  }
  //alert(this.successes);
  //insert each correctly formatted element value into the DOM;
  for (var i = 0; i < this.successes.length; i++) {
    document.getElementById(this.successes[i][0]).value = this.successes[i][1];
  }
  return this.errors.length == 0 ? false : true;

}; //end validate() method;

Scrubber.prototype.getErrors = function() {

  args = arguments.length > 0 ? arguments[0] : null;
  if (this.errors.length > 0) {
   if (args) {
    if (args.changeElementColors) { //reset the LABELs and text INPUTs if they were set to be changed;
      this.resetElements();
	}

    if (args.div) { //construct an error list to be inserted into the DOM; 
	  if (!args.divHeader) { //provide a default divHeader for the outputted error list;
		var html = "\t<p>Please remedy the following:</p>\n";
	  } else {
		var html = "<p>" + args.divHeader + "</p>\n";
	  }
	  html += "\t<ul>\n";
	  for (var i = 0; i < this.errors.length; i++) {
		//capitalize the first letter of the field name(s);
	    html += "\t\t<li><strong>" + this.capFirstLetter(this.errors[i][0]) + "</strong>" + this.errors[i][1] + "</li>\n";
	  }
      html += "\t</ul>\n";
	}

    if (args.changeElementColors) {
	  if (args.yellowFade) { //Yellow Fade Technique;
	    for (var i = 0; i < this.errors.length; i++) {
		  for (var j = 0; j < this.theForm.childNodes.length; j++) {
			var elem = this.theForm.childNodes[j];
	        yellowFade(document.getElementById(this.errors[i][0]), args.fadeColor[0], args.fadeColor[1], args.fadeColor[2]); //apply the YFT to the appropriate text inputs;
			if (args.labelColor && this.errors[i][0] == elem.htmlFor) {
			  elem.style.color = "rgb("+args.labelColor[0]+", "+args.labelColor[1]+", "+args.labelColor[2]+")";
		    } else if (!args.labelColor && errors[i][0] == elem.htmlFor) { //use a default color b/c no label color was supplied;
			  elem.className = "error";
			}
		  }
		}

	  } else { //or NO Yellow Fade Technique;
	    for (var i = 0; i < this.errors.length; i++) {
		  for (var j = 0; j < this.theForm.childNodes.length; j++) {
			var elem = this.theForm.childNodes[j];
		    if (args && args.errorColor) {
	          document.getElementById(this.errors[i][0]).style.backgroundColor = "rgb("+args.errorColor[0]+", "+args.errorColor[1]+", "+args.errorColor[2]+")";
              //next, take care of the LABELs;
		      if (this.errors[i][0] == elem.htmlFor) {
			    if (args.labelColor) {
			      elem.style.color = "rgb("+args.labelColor[0]+", "+args.labelColor[1]+", "+args.labelColor[2]+")";
				} else { //use a default color b/c no label color was supplied;
				  elem.className= "error";
				}
		      }
		    }
		  }
		}
      }

	}

    if (args.div && args.divID) { //display the error div and insert the html immediately in the provided div;
	  document.getElementById(args.divID).innerHTML = html;
	  document.getElementById(args.divID).style.display = "block";
	  return false;
	} else if (args.div && !args.divID) { //display the error div but return the html to be inserted manually;
      return html;
	}

  /*********************************************************************************************/
  /*********************default style (no args passed to this.getErrors();)*********************/
  /*********************************************************************************************/
  } else if (!args) { //fire this code block if no arguments are passed to this.getErrors();
	 
    //the default errors will be:
	// 1. text inputs - background-color: yellow;
	// 2. labels - color: red;
	//also, there will be no error div or YFT;

    this.resetElements(); //reset the LABELs and text INPUTs if they were set to be changed;
	    
	for (var i = 0; i < this.errors.length; i++) {
	  for (var j = 0; j < this.theForm.childNodes.length; j++) {
		var elem = this.theForm.childNodes[j];
	    document.getElementById(this.errors[i][0]).style.backgroundColor = "#ffc";
        //next, take care of the LABELs;
	    if (this.errors[i][0] == elem.htmlFor) {
		  elem.style.color = "#f00";
		}
	  }
	}
  }

  } else { //this.getErrors() shouldn't ever be called if this.validate() doesn't return any array elements, but we'll leave this block here just in case;
    this.resetElements(); //reset the LABELs and text INPUTs if they were set to be changed;
	return false;
  }

}; //end getErrors() method;

Scrubber.prototype.resetElements = function() {

  var theLength = this.theForm.elements == undefined ? 1 : this.theForm.elements.length; //if this.theForm.elements is undefined then a single form input element has been passed rather than the entire form;
  for (var i = 0; i < theLength; i++) {

    var elem = this.theForm.elements == undefined ? this.theForm : this.theForm.elements[i];
    if (elem.getAttribute("type") != "submit") {
	  if (args && args.noErrorColor) {
        elem.style.backgroundColor = "rgb("+args.noErrorColor[0]+", "+args.noErrorColor[1]+", "+args.noErrorColor[2]+")";
	  } else { //no argument was passed to the method, so use a default color;
		elem.style.backgroundColor = "#fff";
	  }
	}
  }

  for (var i = 0; i < this.theForm.childNodes.length; i++) {

	var elem = this.theForm.childNodes[i];
	if (elem.nodeType == 1 && elem.nodeName == "LABEL") {
	  elem.style.color = "#000";
	  //elem.className = "defaultLabelColor";
	}
  }
  
}; //end resetElements() method;

Scrubber.prototype.capFirstLetter = function(field) {
	
  if (field.indexOf("_") != -1) { //replace any underscores w/ spaces and then capitalize the first letter of each word;
	field = field.replace(/_/, " ");
	var fields = field.split(" "); //create an array of the field chunks;
	for (var i = 0; i < fields.length; i++) { //capitalize the first letter of each chunk;
	  fields[i] = fields[i].substring(0, 1).toUpperCase() + fields[i].substring(1, fields[i].length);
	}
	return field = fields.join(" ");

  } else { //'field' is only one word;
    return field.substring(0, 1).toUpperCase() + field.substring(1, field.length);
  }

}; //end capFirstLetter() method;