var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { UserQuestionBase } from './q_base.js';

var replacementForClass1 = '{clss1}';
var replacementForClass2 = '{clss2}';
var replacementForMin1 = '{min1}';
var replacementForMax1 = '{max1}';
var replacementForMin2 = '{min2}';
var replacementForMax2 = '{max2}';
var replacementForValue1 = '{val1}';
var replacementForValue2 = '{val2}';

var q_template_integer_pair = '\n\t<input type="number" min="{min1}"  max="{max1}" step="1" class="{clss1}" data-seq="1" value="{val1}"/>\n\t<input type="number" min="{min2}"  max="{max2}" step="1" class="{clss2}" data-seq="2" value="{val2}"/>\n';

var UserIntegerPairQuestion = function (_UserQuestionBase) {
	_inherits(UserIntegerPairQuestion, _UserQuestionBase);

	function UserIntegerPairQuestion(qInfo, low1, high1, low2, high2) {
		_classCallCheck(this, UserIntegerPairQuestion);

		var _this = _possibleConstructorReturn(this, (UserIntegerPairQuestion.__proto__ || Object.getPrototypeOf(UserIntegerPairQuestion)).call(this, qInfo));

		_this._min1 = low1;
		_this._max1 = high1;
		_this._min2 = low2;
		_this._max2 = high2;
		_this._firstValue = qInfo.iv1;
		_this._secondValue = qInfo.iv2;
		return _this;
	}

	// Method for validating the result value upon moving away 
	// from the page.


	_createClass(UserIntegerPairQuestion, [{
		key: 'onValidating',
		value: function onValidating() {
			if (this._firstValue === parseInt(this._firstValue, 10) && this._secondValue === parseInt(this._secondValue, 10)) {
				return true;
			}
			return false;
		}

		// Method for hooking up event handler to handle text change event

	}, {
		key: 'onChangeEvent',
		value: function onChangeEvent() {
			var self = this;
			// first integer
			$('.' + this.uiClass1).blur(function () {
				self.setValue1($(this).val());
			});

			// second integer
			$('.' + this.uiClass2).blur(function () {
				self.setValue2($(this).val());
			});
		}
	}, {
		key: 'setValue1',
		value: function setValue1(obj) {
			this._firstValue = parseInt(obj, 10);
		}
	}, {
		key: 'setValue2',
		value: function setValue2(obj) {
			this._secondValue = parseInt(obj, 10);
		}

		// This method can be called when we need to serialize the question / answer
		// to JSON format (usually for session store)

	}, {
		key: 'serialize',
		value: function serialize() {
			this.qInfo.iv1 = this._firstValue;
			this.qInfo.iv2 = this._secondValue;
		}

		// get low value class 

	}, {
		key: 'uiClass1',
		get: function get() {
			return 'integer_pair1_for_' + this.id;
		}

		// get high value class 

	}, {
		key: 'uiClass2',
		get: function get() {
			return 'integer_pair2_for_' + this.id;
		}

		// get display html for the entire enum group in form of radio buttons

	}, {
		key: 'displayHtml',
		get: function get() {
			var htmlStr = q_template_integer_pair.replace(replacementForClass1, this.uiClass1).replace(replacementForClass2, this.uiClass2).replace(replacementForMin1, this._min1).replace(replacementForMax1, this._max1).replace(replacementForMin2, this._min2).replace(replacementForMax2, this._max2);
			// SET INITIAL VALUES IF ANY
			if (this.onValidating()) {
				htmlStr = htmlStr.replace(replacementForValue1, this._firstValue).replace(replacementForValue2, this._secondValue);
			}
			return htmlStr;
		}

		// get the question in xml format for saving to API server

	}, {
		key: 'serverXML',
		get: function get() {
			var ret = '';
			if (this.onValidating()) {
				ret = '<qa>\n\t\t\t\t\t<id>' + this.id + '</id>\n\t\t\t\t\t<intv>' + this._firstValue + '</intv>\n\t\t\t\t\t<intv2>' + this._secondValue + '</intv2>\n\t\t\t\t</qa>\n\t\t\t\t';
			}
			return ret;
		}
	}]);

	return UserIntegerPairQuestion;
}(UserQuestionBase);

export { UserIntegerPairQuestion };