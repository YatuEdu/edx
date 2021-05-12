class TimeUtil {
	static DAY = 'day';
	static HOUR = 'hour';
	static MINUTE = 'min';
	static SECOND = 'sec';
	static MM = 'mm';
	
	static diffMinutes(dt1, dt2) 
	{
		const diff =(dt2 - dt1) / 60000;
		return Math.abs(Math.round(diff));
	}
}

class StringUtil {
	/*
	  most of Yatu control id is in form of "btn_xxx", where xxx is the associated
	  object id.  The id could be user, group, or anything else.
	  */
	static getIdFromBtnId(btnId) {
		const indx = btnId.lastIndexOf("_");
		return parseInt(btnId.substring(indx+1));
	}
	
	/********************************************************
	*	Camel case string
	*	Camel case is widely used in Java, C++, c# as variable 
	*	names. Here we use this function to turn any string into
	 *  camel case. Assume a word is given.
	 ********************************************************/
	static convertToCamelCase(singWord) {
		return singWord.charAt(0).toUpperCase() + singWord.slice(1).toLowerCase();
	}
}

export { TimeUtil, StringUtil };
