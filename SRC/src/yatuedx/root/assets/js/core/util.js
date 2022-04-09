class TimeUtil {
	static DAY = 'day';
	static HOUR = 'hour';
	static MINUTE = 'min';
	static SECOND = 'sec';
	static MM = 'mm';
	
	static diffMinutes(dt1, dt2) 
	{
		const diff =(dt2 - dt1) / 60000;
		return Math.round(diff);
	}
	
	static timeDiffIn(unit, t1, t2) {
		// milliseconds between t1 & t2
		let diffUnit = (t2 - t1); 
		switch(unit) {
			case TimeUtil.HOUR:
				diffUnit =  Math.floor((diffUnit % 86400000) / 3600000); // hours
				break;
			
			case TimeUtil.MINUTE:
				diffUnit = Math.round(((diffUnit % 86400000) % 3600000) / 60000); // minutes
				break;
				
			case TimeUtil.DAY:
				diffUnit = Math.floor(diffUnit / 86400000); // days
				break;
				
			case TimeUtil.MM:
				break;
				
			default:
				throw 'unknown time unit';
		}
		
		return diffUnit;
	}
	
	static sqlDateToJsDate(sqlDate) {
		return new Date(Date.parse(sqlDate));
	}
}

const UtilConst = {
	STR_CHANGE_NON: 0,
	STR_CHANGE_APPEND: 1,
	STR_CHANGE_DELETE_END: 2,
	STR_CHANGE_PREPEND: 3,
	STR_CHANGE_DELETE_BEGIN: 4,
	STR_CHANGE_MIDDLE: 5,
	STR_CHANGE_ALL: 6,
};

class StringUtil {
	/*
		Compare two strings and find the difference in them:
		returns an object.
		
		pre-requisit: two strings with bigger than 0 length
		
		{flag: f, delta: d, changeBegin: b, changeEnd: e}
		flag:
			0) strings equal
			1) new srting appended
			2) deleted at the end
			3) prepended at the beginning
			4) deleted at the beginning
			5) replaced in the middle
	Notes:
		This function demonstrate the difficulties for writing a function that will
		work for several scenarios and a generic solutions for all these scenarios with
		minimum number of scans.
		
		We define six change flags here as constant
	*/

	static findChangeBetweenText(oldStr, newStr)  {
		const oldLen = oldStr.length;
		const newLen = newStr.length;
		const len = newLen > oldLen ? newLen: oldLen;
		
		// find difference by forward comparison:
		// flags covered: 0) 1) 2)
		let begin = oldLen;
		for (let i = 0; i < len ; i++) {
			if (oldStr.charAt(i) != newStr.charAt(i)) {
				begin = i;
				break;
			}
		}
		
		// equal?
		if (oldLen == newLen &&  begin == newLen) {
			return {flag: UtilConst.STR_CHANGE_NON};
		}
		
		// new string is appended at the end
		// the following condition is actually:
		// if (begin == oldLen && newLen > oldLen
		if (begin == oldLen) {
			return {flag: UtilConst.STR_CHANGE_APPEND, delta: newStr.substring(begin)};
		}

		// substring string is deleted at the end
		// the following condition is actually:
		// if (begin == newLen && newLen < oldLen
		if (begin == newLen ) {
			return {flag: UtilConst.STR_CHANGE_DELETE_END, length: newLen};
		}
		
		// find difference by backward comparison:
		// flags covered: 3, 4, 5 scenarios
		let rearLen = 0;
		for (; rearLen < len; rearLen++) {
			if (oldStr.charAt(oldLen-1-rearLen) != newStr.charAt(newLen-1-rearLen)) {
				break;
			}
		}
		
		// prepended at beginning
		// the following condition is actually:
		// if (rearLen == oldLen && newLen > oldLen
		if (rearLen === oldLen) {
			return {flag: UtilConst.STR_CHANGE_PREPEND, delta: newStr.substring(0, newLen-oldLen)};
		}
		
		// deleted at beginning
		// the following condition is actually:
		// if (rearLen == newLen && newLen < oldLen
		if (rearLen === newLen) {
			return {flag: UtilConst.STR_CHANGE_DELETE_BEGIN, length: newLen};
		}
		
		// replaced in the middle
		
		// first getting the new strings which replace old string in the middle
		const deltaStr  = newStr.substring(begin, newLen-rearLen);
		
		// returns the delta string as well as the range of the old string that need to be replaced
		return {flag: UtilConst.STR_CHANGE_MIDDLE, delta: deltaStr, begin: begin, end: oldLen-rearLen };
	}

	/*
	  Replace a piece of chars in the middle of string with another string.
	  For example, 
		x = "abcdef";
		y = "12"
		z = replaceInTheMiddle(x, y, 2, 3) => ab12def
		
	 */
	static replaceInTheMiddle(oldStr, middleString, begin, end)  {
		return oldStr.substring(0,begin) +  middleString + oldStr.substring(end);
	}
	
	/*
	  most of Yatu control id is in form of "btn_xxx", where xxx is the associated
	  object id.  The id could be user, group, or anything else.
	 */
	static getIdFromBtnId(btnId) {
		const indx = btnId.lastIndexOf("_");
		return parseInt(btnId.substring(indx+1));
	}
	
	/*
		Our Symply and 99% good message digest algorithm
	 */
	static charIndxesForSha256 = [0, 1, 5, 6, 11, 19, 21, 45, 46, 47, 55, 61, 63];
	/*
		Our Symply and 99% good message digest algorithm: digest generation
	 */
	static getMessageDigest(msg) {
		const msgSha =sha256(msg);
		let d = '';
		for(let i = 0; i < StringUtil.charIndxesForSha256.length; i++) {
			d += msgSha.charAt(StringUtil.charIndxesForSha256[i]);
		}
		return d;
	}
	
	/*
		Our Symply and 99% good message digest algorithm: digest verifcation
	 */
	 static verifyMessageDigest(msg, d) {
		const d2 = StringUtil.getMessageDigest(msg);
		if (d2.localeCompare(d) == 0) {
			return true;
		}
		return false;
	}
	
}

class PageUtil {

	static getUrlParameterMap() {
		const sPageURL = window.location.search.substring(1);
		const sURLVariables = sPageURL.split('&');
		const paramMap = new Map();
		// enumerate the URL params to find our target
		for (let i = 0; i < sURLVariables.length; i++) {
			const sParameterName = sURLVariables[i].split('=');
			const val = typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
			paramMap.set(sParameterName[0], val);
		}
		return paramMap;
	}
}

class Dbg {
	static assertTrue(asserted, err) {
		if (!asserted) {
			alert(err);
		}
	}
}

export { TimeUtil, StringUtil, PageUtil, Dbg, UtilConst};
