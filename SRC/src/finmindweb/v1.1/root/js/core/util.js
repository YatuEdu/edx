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
	
	/********************************************************
	*	Convert  integer into , seperated thousands
	*	
	*	For example， 10000 ->10,000
	*
	*********************************************************/	
	static intToNumberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	
	/********************************************************
	*	Convert  integer representation with coma back to integer
	*
	*	
	*	For example， 10000 <- 10,000
	*
	*********************************************************/	
	static strWithCommasToInteger(s) {
		const num = s.replace(new RegExp(',', 'g'), '');
		return parseInt(num, 10);
	}
	
	/********************************************************
	*	Convert  integer representation to SSN representation:
	*	
	*	For example， 345678900 => 345-67-8900
	*
	*********************************************************/	
	static formatSocialSecurity(str){
		let ssnDisplay = str.replace(/\D/g, '');
		ssnDisplay = ssnDisplay.replace(/^(\d{3})/, '$1-');
		ssnDisplay = ssnDisplay.replace(/-(\d{2})/, '-$1-');
		ssnDisplay = ssnDisplay.replace(/(\d)-(\d{4}).*/, '$1-$2');
		return ssnDisplay;
	}
	
		/********************************************************
	*	Convert  integer representation to USA/Canada phone number
	*	
	*	For example， 2064454455 => 206-445-4455
	*
	*********************************************************/	
	static formatUSPhoneNumber(str){
		let ssnDisplay = str.replace(/\D/g, '');
		ssnDisplay = ssnDisplay.replace(/^(\d{3})/, '$1-');
		ssnDisplay = ssnDisplay.replace(/-(\d{3})/, '-$1-');
		ssnDisplay = ssnDisplay.replace(/(\d)-(\d{4}).*/, '$1-$2');
		return ssnDisplay;
	}

	static convertToSSN(s) {
		const num = s.replace(new RegExp(',', 'g'), '');
		return parseInt(num, 10);
	}
}

export { TimeUtil, StringUtil };
