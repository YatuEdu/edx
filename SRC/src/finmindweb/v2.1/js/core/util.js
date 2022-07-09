class TimeUtil {
	static DAY = 'day';
	static HOUR = 'hour';
	static MINUTE = 'min';
	static SECOND = 'sec';
	static MM = 'mm';
	static ONE_DAY = 1000 * 60 * 60 * 24;

	static diffMinutes(dt1, dt2)
	{
		const diff =(dt2 - dt1) / 60000;
		return Math.abs(Math.round(diff));
	}

	static diffDays(dt1, dt2) {
		return  Math.round ( (dt2 - dt1) / TimeUtil.ONE_DAY );
	}

	static getTimeString(dt) {
		return dt.toTimeString().split(' ')[0];
	}

	static getTimeStringWithoutSeconds(dt) {
		const ts =  TimeUtil.getTimeString(dt);
		const secindx = ts.lastIndexOf(":");
		return ts.substring(0, secindx);
	}

	static getDateString(dt) {
		return dt.toDateString();
	}
}

class StringUtil {
	/*
		Tell if an objectct is a string or not
	 */
	static isString(obj) {
		if (typeof obj === 'string' || obj instanceof String) {
			return true;
		}
		return false;
	}

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


	static randomString(e) {
		e = e || 32;
		let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
			a = t.length,
			n = "";
		for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
		return n;
	}
}

class ArrayUtil {
	static isEmpty(a) {
		return !a || a.length == 0;
	}
}

class ValidUtil {
	static isEmailValid(str) {
		const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!regExp.test(str.toLowerCase())) {
			return false;
		} else {
			return true;
		}
	}

	static isPhoneValid(str) {
		const regExp = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
		if (!regExp.test(str.toLowerCase())) {
			return false;
		} else {
			return true;
		}
	}

	static isLicenseNumberValid(str) {
		const regExp = /^[0-9]*$/;
		if (!regExp.test(str.toLowerCase())) {
			return false;
		} else {
			return true;
		}
	}

}

export { TimeUtil, StringUtil, ArrayUtil, ValidUtil };
