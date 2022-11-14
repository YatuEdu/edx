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

	static testEqual(str1, str2)  {
		const len1 = str1.length;
		const len2 = str2.length;
		if (len1 != len2) {
			return false;
		}
		
		// find difference by forward comparison:
		let i = 0;
		for (; i < len1 ; i++) {
			if (str1.charAt(i) != str2.charAt(i)) {
				break;
			}
		}
		if (i < len1) {
			return false;
		}
		
		return true;
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
	static getIdStrFromBtnId(btnId) {
		const indx = btnId.lastIndexOf("_");
		return btnId.substring(indx+1);
	}
	
	/*
	  most of Yatu control id is in form of "btn_xxx", where xxx is the associated
	  object id.  The id could be user, group, or anything else.
	 */
	static getIdFromBtnId(btnId) {
		return parseInt(StringUtil.getIdStrFromBtnId(btnId));
	}
	
	static getExt(filename) {
		const indx = filename.lastIndexOf(".");
		return filename.substring(indx+1);
	}
	
	/*
		Our simple and 99% good message digest algorithm
	 */
	static charIndxesForSha256 = [0, 2, 4, 6, 8, 10, 12, 14, 16, 33, 35, 41, 47, 49, 51, 63];
	
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

class RegexUtil {
	static YATU_NAME_REGEX = /^[A-Za-z][A-Za-z0-9_]+$/;
	static NUMBER_REGEX =  /^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/;
	static ALPGANUMERIC_REXP = /^[a-z0-9]+$/;
	
	/*
		yatu name must be alphabet and digit only
	*/
	static isValidYatuName(name) {
		return RegexUtil.YATU_NAME_REGEX.test(name);
	}
	
	/*
		test if a string contains only a number.
	 */
	static isNumberString(str) {
		return RegexUtil.NUMBER_REGEX.test(str);
	}
	
	/* test is a char is letter or digit */
	charIsLetter(c) {
	  if (typeof c !== 'string') {
		return false;
	  }

	  return RegexUtil.ALPGANUMERIC_REXP.test(c);
	}
}

class PageUtil {
	static loadJsCssfile(filename){
		const filetype = StringUtil.getExt(filename);
		
		if (filetype=="js"){ //if filename is a external JavaScript file
			const fileref = document.createElement('script')
			fileref.setAttribute("type","text/javascript")
			fileref.setAttribute("src", filename)
		}
		else if (filetype=="css"){ //if filename is an external CSS file
			const fileref = document.createElement("link")
			fileref.setAttribute("rel", "stylesheet")
			fileref.setAttribute("type", "text/css")
			fileref.setAttribute("href", filename)
		}
		if (typeof fileref != "undefined") {
			//document.getElementsByTagName("head")[0].appendChild(fileref)
		}
	}
	
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
	
	static highlightSelectionLine(textArealId, lineNum) {
		// assuming controlId is a textarea, we need to first find its position
		const text = document.getElementById(textArealId).value;
		const lines = text.split("\n");
		let startPos = 0;
		for(let x = 0; x < lines.length; x++) {
			if(x == lineNum) {
				break;
			}
			startPos += (lines[x].length+1);
		}
		const endPos = lines[lineNum].length + startPos;
		
		// now call highlightSelection with begin end parameters
		PageUtil.highlightSelection(textArealId, startPos, endPos);
	}
	
	static highlightSelection(textArealId, begin, end) {
		const txt = document.getElementById(textArealId);
		if(txt.createTextRange ) {
		  const selRange = txt.createTextRange();
		  selRange.collapse(true);
		  selRange.moveStart('character', begin);
		  selRange.moveEnd('character', end);
		  selRange.select();
		  txt.focus();
		} else if(txt.setSelectionRange ) {
		  txt.focus();
		  txt.setSelectionRange(begin, end);
		} else if( typeof txt.selectionStart != 'undefined' ) {
		  txt.selectionStart = begin;
		  txt.selectionEnd = end;
		  txt.focus();
		}
	}
}

class Dbg {
	static assertTrue(asserted, err) {
		if (!asserted) {
			alert(err);
		}
	}
}

export { TimeUtil, StringUtil, RegexUtil, PageUtil, Dbg, UtilConst};
