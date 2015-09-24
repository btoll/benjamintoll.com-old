JSLITE.util = {

  /*****************************************************************************************************************/
  /*****************************************************************************************************************/
  /**
  * @function JSLITE.util.getDay
  * @param {Number} iDay
  * @return {Array}
  * @describe <p>In JavaScript, querying <code>Date.getDay()</code> returns an integer between 0 and 6. Use this method to map to the correct day.</p>
  */
  //<source>
  getDay: function (iDay) {

    var aDOTW = [];
    aDOTW[0] = "Sunday";
    aDOTW[1] = "Monday";
    aDOTW[2] = "Tuesday";
    aDOTW[3] = "Wednesday";
    aDOTW[4] = "Thursday";
    aDOTW[5] = "Friday";
    aDOTW[6] = "Saturday";
	
    return aDOTW[iDay];

  },
  //</source>
  
  /*****************************************************************************************************************/
  /*****************************************************************************************************************/
  /**
  * @function JSLITE.util.getHours
  * @param {Number} iHours
  * @return {Array}
  * @describe <p>In JavaScript, querying <code>Date.getHours()</code> returns an integer between 0 (midnight) and 23 (11 p.m.). Use this method only if using the 12-hour clock.</p>
  */
  //<source>
  getHours: function (iHour) {

    if (iHour == 0) {
      return 12;
    } else if (iHour > 12) {
      return iHour - 12;
    } else {
      return iHour;
    }

  },
  //</source>
	
  /*****************************************************************************************************************/
  /*****************************************************************************************************************/
  /**
  * @function JSLITE.util.getMinutes
  * @param {Number} iMinutes
  * @return {String/Number}
  * @describe <p>In JavaScript, querying <code>Date.getMinutes()</code> returns an integer between 0 and 59. If <code>iMinutes === 0</code>, return String <code>"00"</code> because JavaScript interprets Number <code>00</code> as <code>0</code>.</p>
  */
  //<source>
  getMinutes: function (iMinutes) {

    return iMinutes === 0 ? "00" : iMinutes;

  },
  //</source>
	
  /*****************************************************************************************************************/
  /*****************************************************************************************************************/
  /**
  * @function JSLITE.util.getMonth
  * @param {Number} iMonth
  * @return {Array}
  * @describe <p>In JavaScript, querying <code>Date.getMonth()</code> returns an integer between 0 and 11. Use this method to map to the correct month.</p>
  */
  //<source>
  getMonth: function (iMonth) {

    var aMOTY = [];
    aMOTY[0] = "January";
    aMOTY[1] = "February";
    aMOTY[2] = "March";
    aMOTY[3] = "April";
    aMOTY[4] = "May";
    aMOTY[5] = "June";
    aMOTY[6] = "July";
    aMOTY[7] = "August";
    aMOTY[8] = "September";
    aMOTY[9] = "October";
    aMOTY[10] = "November";
    aMOTY[11] = "December";

    return aMOTY[iMonth];

  }
  //</source>

};
