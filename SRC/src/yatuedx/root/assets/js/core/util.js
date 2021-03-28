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
}

export { TimeUtil, StringUtil };
