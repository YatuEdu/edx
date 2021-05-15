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
	*	names. Assume a word is given, we use this function to 
	*   turn the word into camel case word.
    *   For example, father is turned into Father
    *	
	*********************************************************/
	static convertToCamelCase(singWord) {
		return singWord.charAt(0).toUpperCase() + singWord.slice(1).toLowerCase();
	}
	
	/********************************************************
	*	Convert ',' separated integers into integer array
	*	
	*	For example， ‘1，3，5’ -> [1, 3, 5]
	*
	*********************************************************/
	static convertStringToArray(comaSeparatedArray) {
		const digits = comaSeparatedArray.split(',');
		return digits.map(s => parseInt(s));
	}
}

export { TimeUtil, StringUtil };
