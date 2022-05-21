var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimeUtil = function () {
	function TimeUtil() {
		_classCallCheck(this, TimeUtil);
	}

	_createClass(TimeUtil, null, [{
		key: 'diffMinutes',
		value: function diffMinutes(dt1, dt2) {
			var diff = (dt2 - dt1) / 60000;
			return Math.abs(Math.round(diff));
		}
	}, {
		key: 'diffDays',
		value: function diffDays(dt1, dt2) {
			return Math.round((dt2 - dt1) / TimeUtil.ONE_DAY);
		}
	}, {
		key: 'getTimeString',
		value: function getTimeString(dt) {
			return dt.toTimeString().split(' ')[0];
		}
	}, {
		key: 'getTimeStringWithoutSeconds',
		value: function getTimeStringWithoutSeconds(dt) {
			var ts = TimeUtil.getTimeString(dt);
			var secindx = ts.lastIndexOf(":");
			return ts.substring(0, secindx);
		}
	}, {
		key: 'getDateString',
		value: function getDateString(dt) {
			return dt.toDateString();
		}
	}]);

	return TimeUtil;
}();

TimeUtil.DAY = 'day';
TimeUtil.HOUR = 'hour';
TimeUtil.MINUTE = 'min';
TimeUtil.SECOND = 'sec';
TimeUtil.MM = 'mm';
TimeUtil.ONE_DAY = 1000 * 60 * 60 * 24;

var StringUtil = function () {
	function StringUtil() {
		_classCallCheck(this, StringUtil);
	}

	_createClass(StringUtil, null, [{
		key: 'isString',

		/*
  	Tell if an objectct is a string or not
   */
		value: function isString(obj) {
			if (typeof obj === 'string' || obj instanceof String) {
				return true;
			}
			return false;
		}

		/*
    most of Yatu control id is in form of "btn_xxx", where xxx is the associated
    object id.  The id could be user, group, or anything else.
    */

	}, {
		key: 'getIdFromBtnId',
		value: function getIdFromBtnId(btnId) {
			var indx = btnId.lastIndexOf("_");
			return parseInt(btnId.substring(indx + 1));
		}

		/********************************************************
  *	Camel case string
  *	Camel case is widely used in Java, C++, c# as variable 
  *	names. Assume a word is given, we use this function to 
  *   turn the word into camel case word.
     *   For example, father is turned into Father
     *	
  *********************************************************/

	}, {
		key: 'convertToCamelCase',
		value: function convertToCamelCase(singWord) {
			return singWord.charAt(0).toUpperCase() + singWord.slice(1).toLowerCase();
		}

		/********************************************************
  *	Convert ',' separated integers into integer array
  *	
  *	For example， ‘1，3，5’ -> [1, 3, 5]
  *
  *********************************************************/

	}, {
		key: 'convertStringToArray',
		value: function convertStringToArray(comaSeparatedArray) {
			var digits = comaSeparatedArray.split(',');
			return digits.map(function (s) {
				return parseInt(s);
			});
		}

		/********************************************************
  *	Convert  integer into , seperated thousands
  *	
  *	For example， 10000 ->10,000
  *
  *********************************************************/

	}, {
		key: 'intToNumberWithCommas',
		value: function intToNumberWithCommas(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		/********************************************************
  *	Convert  integer representation with coma back to integer
  *
  *	
  *	For example， 10000 <- 10,000
  *
  *********************************************************/

	}, {
		key: 'strWithCommasToInteger',
		value: function strWithCommasToInteger(s) {
			var num = s.replace(new RegExp(',', 'g'), '');
			return parseInt(num, 10);
		}

		/********************************************************
  *	Convert  integer representation to SSN representation:
  *	
  *	For example， 345678900 => 345-67-8900
  *
  *********************************************************/

	}, {
		key: 'formatSocialSecurity',
		value: function formatSocialSecurity(str) {
			var ssnDisplay = str.replace(/\D/g, '');
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

	}, {
		key: 'formatUSPhoneNumber',
		value: function formatUSPhoneNumber(str) {
			var ssnDisplay = str.replace(/\D/g, '');
			ssnDisplay = ssnDisplay.replace(/^(\d{3})/, '$1-');
			ssnDisplay = ssnDisplay.replace(/-(\d{3})/, '-$1-');
			ssnDisplay = ssnDisplay.replace(/(\d)-(\d{4}).*/, '$1-$2');
			return ssnDisplay;
		}
	}, {
		key: 'convertToSSN',
		value: function convertToSSN(s) {
			var num = s.replace(new RegExp(',', 'g'), '');
			return parseInt(num, 10);
		}
	}]);

	return StringUtil;
}();

var ArrayUtil = function () {
	function ArrayUtil() {
		_classCallCheck(this, ArrayUtil);
	}

	_createClass(ArrayUtil, null, [{
		key: 'isEmpty',
		value: function isEmpty(a) {
			return !a || a.length == 0;
		}
	}]);

	return ArrayUtil;
}();

var ValidUtil = function () {
	function ValidUtil() {
		_classCallCheck(this, ValidUtil);
	}

	_createClass(ValidUtil, null, [{
		key: 'isEmailValid',
		value: function isEmailValid(str) {
			var regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!regExp.test(str.toLowerCase())) {
				return false;
			} else {
				return true;
			}
		}
	}, {
		key: 'isPhoneValid',
		value: function isPhoneValid(str) {
			var regExp = /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/;
			if (!regExp.test(str.toLowerCase())) {
				return false;
			} else {
				return true;
			}
		}
	}, {
		key: 'isLicenseNumberValid',
		value: function isLicenseNumberValid(str) {
			var regExp = /^[0-9]*$/;
			if (!regExp.test(str.toLowerCase())) {
				return false;
			} else {
				return true;
			}
		}
	}]);

	return ValidUtil;
}();

export { TimeUtil, StringUtil, ArrayUtil, ValidUtil };