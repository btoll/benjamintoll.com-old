function Scrubber(obj) {

  //class methods:
  // 1. privileged validatate();
  // 2. private resetElements(); #sets the LABELs and text INPUTs back to their default colors;
  // 3. private capFirstLetter();
  // 4. privileged getErrors();

  //private properties;
  var theForm = obj;
  var required = [];
  var attention = [];
  var data = [];
  var errors = [];
  var args = {}; //an object that stores presentational information passed to this.getErrors();

  //the 'constructor' function takes the form and loops through its elements looking for any 'required' fields and any fields that need 'attention';
  for (var i = 0; i < theForm.elements.length; i++) {
	
	var elem = theForm.elements[i];
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
      if (!elem.value.match(/\S/)) {
	    if (elem.className.indexOf(" ") != -1) { //there's more than one class;
		  var rType = elem.className.substring(elem.className.indexOf("-")+1, elem.className.indexOf(" ")); //only keep what's after '-' and before the space (" "), indicating there's another class name;
        } else { //there's only one class;
	      var rType = elem.className.substring(elem.className.indexOf("-")+1); //only keep what's after '-';
	    }
	    attention.push([rType, elem.name, elem.value]);
	  }

	}

  }
  //data = required + attention;
  data = required;

  this.validate = function() {

    for (var i = 0; i < data.length; i++) {

      switch(data[i][0]) {
        case "alpha":
	      var pattern = /^[a-zA-Z]+$/;
		  if (!data[i][2].match(pattern)) {
		    var message = " can only contain letters.";
		    errors.push([data[i][1], message]);
		  }
	      break;

        case "alphamix":
	      var pattern = /^[a-zA-Z0-9.,-]+$/;
		  if (!data[i][2].match(pattern)) {
		    var message = " can only contain letters and/or numbers.";
		    errors.push([data[i][1], message]);
		  }
	      break;

        case "alphanumeric":
	      var pattern = /^[a-zA-Z0-9]+$/;
		  if (!data[i][2].match(pattern)) {
		    var message = " can only contain letters and/or numbers.";
		    errors.push([data[i][1], message]);
		  }
	      break;

        case "blank":
		  var message = " cannot be blank.";
		  errors.push([data[i][1], message]);
	      break;

        case "date":
	      var pattern = /^[0-9]{1,2}[-\/]?[0-9]{1,2}[-\/][0-9]{2,4}$/;
		  if (!data[i][2].match(pattern)) {
		    var message = " can only contain numbers and forward slashes or dashes.";
		    errors.push([data[i][1], message]);
		  }
	      break;

        case "decimal":
	      var pattern = /^[0-9]*\.[0-9]+$/;
		  if (!data[i][2].match(pattern)) {
		    var message = " can only contain decimals.";
		    errors.push([data[i][1], message]);
		  }
	      break;

        case "email":
	      var pattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
		  if (!data[i][2].match(pattern)) {
		    var message = " failed validation.";
		    errors.push([data[i][1], message]);
		  }
	      break;

        case "numeric":
	      var pattern = /^[0-9]+$/;
		  if (!data[i][2].match(pattern)) {
		    var message = " can only contain numbers.";
		    errors.push([data[i][1], message]);
		  }
	      break;

        case "phone":
	      var pattern = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
		  //The phone number regular expression accepts phone number in both local format (eg. 02 1234 5678 or 123 123 4567) or international format (eg. +61 (0) 2 1234 5678 or +1 123 123 4567). It also accepts an optional extention of up to five digits prefixed by x or ext (eg. 123 123 4567 x89) - http://javascript.about.com/library/blre.htm;
		  if (!data[i][2].match(pattern)) {
		    var message = " failed validation.";
		    errors.push([data[i][1], message]);
		  }
	      break;

        case "ssn":
	      var pattern = /^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/;
		  if (!data[i][2].match(pattern)) {
		    var message = " failed validation.";
		    errors.push([data[i][1], message]);
		  }
	      break;

        case "url":
	      var pattern = /^((http|ftp|https):\/\/)?(www.?\.)?.+\..{2,3}$/; //a good start but needs work;
		  if (!data[i][2].match(pattern)) {
		    var message = " failed validation.";
		    errors.push([data[i][1], message]);
		  }
	      break;

        case "zipcode":
	      var pattern = /^[0-9]{5}-?([0-9]{4})?$/;
		  if (!data[i][2].match(pattern)) {
		    var message = " failed validation.";
		    errors.push([data[i][1], message]);
		  }
	      break;

	    default:
	      break;
      }

	}

    return errors.length == 0 ? false : true;

  };

  var resetElements = function() {

    for (var i = 0; i < theForm.elements.length; i++) {
      if (theForm.elements[i].getAttribute("type") != "submit") {
	    if (args && args.noErrorColor) {
          theForm.elements[i].style.backgroundColor = "rgb("+args.noErrorColor[0]+", "+args.noErrorColor[1]+", "+args.noErrorColor[2]+")";
		} else { //no argument was passed to the method, so use a default color;
		  theForm.elements[i].style.backgroundColor = "#fff";
		}
	  }
    }

	for (var i = 0; i < theForm.childNodes.length; i++) {
	  if (theForm.childNodes[i].nodeType == 1 && theForm.childNodes[i].nodeName == "LABEL") {
	    theForm.childNodes[i].style.color = "#000";
		//theForm.childNodes[i].className = "defaultLabelColor";
	  }
	}
  }

  var capFirstLetter = function(field) {
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
  }

  this.getErrors = function() {

    args = arguments.length > 0 ? arguments[0] : null;

    if (errors.length > 0) {

     if (args) {

      if (args.changeElementColors) { //reset the LABELs and text INPUTs if they were set to be changed;
	    resetElements();
	  }

      if (args.div) { //construct an error list to be inserted into the DOM; 
		if (!args.divHeader) { //provide a default divHeader for the outputted error list;
		  var html = "\t<p>Please remedy the following:</p>\n";
		} else {
		  var html = "<p>" + args.divHeader + "</p>\n";
		}
	    html += "\t<ul>\n";
	    for (var i = 0; i < errors.length; i++) {
		  //capitalize the first letter of the field name(s);
	      html += "\t\t<li><strong>" + capFirstLetter(errors[i][0]) + "</strong>" + errors[i][1] + "</li>\n";
	    }
		html += "\t</ul>\n";
	  }

      if (args.changeElementColors) {
	    if (args.yellowFade) { //Yellow Fade Technique;
		  for (var i = 0; i < errors.length; i++) {
		    for (var j = 0; j < theForm.childNodes.length; j++) {
	          yellowFade(document.getElementById(errors[i][0]), args.fadeColor[0], args.fadeColor[1], args.fadeColor[2]); //apply the YFT to the appropriate text inputs;
			  if (args.labelColor && errors[i][0] == theForm.childNodes[j].htmlFor) {
			    theForm.childNodes[j].style.color = "rgb("+args.labelColor[0]+", "+args.labelColor[1]+", "+args.labelColor[2]+")";
		      } else if (!args.labelColor && errors[i][0] == theForm.childNodes[j].htmlFor) { //use a default color b/c no label color was supplied;
				theForm.childNodes[j].className = "error";
			  }
		    }
		  }

	    } else { //or NO Yellow Fade Technique;
	      for (var i = 0; i < errors.length; i++) {
		    for (var j = 0; j < theForm.childNodes.length; j++) {
		      if (args && args.errorColor) {
	            document.getElementById(errors[i][0]).style.backgroundColor = "rgb("+args.errorColor[0]+", "+args.errorColor[1]+", "+args.errorColor[2]+")";
                //next, take care of the LABELs;
		        if (errors[i][0] == theForm.childNodes[j].htmlFor) {
				  if (args.labelColor) {
			        theForm.childNodes[j].style.color = "rgb("+args.labelColor[0]+", "+args.labelColor[1]+", "+args.labelColor[2]+")";
				  } else { //use a default color b/c no label color was supplied;
				    theForm.childNodes[j].className= "error";
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

       resetElements(); //reset the LABELs and text INPUTs if they were set to be changed;
	    
	   for (var i = 0; i < errors.length; i++) {
		 for (var j = 0; j < theForm.childNodes.length; j++) {
	       document.getElementById(errors[i][0]).style.backgroundColor = "#ffc";
           //next, take care of the LABELs;
		   if (errors[i][0] == theForm.childNodes[j].htmlFor) {
			 theForm.childNodes[j].style.color = "#f00";
		   }
		 }
	   }
	 }

	} else { //this.getErrors() shouldn't ever be called if this.validate() doesn't return any array elements, but we'll leave this block here just in case;
      resetElements(); //reset the LABELs and text INPUTs if they were set to be changed;
	  return false;
	}

  };

}