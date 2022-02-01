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
};}

export { TimeUtil, StringUtil, PageUtil};
