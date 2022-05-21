var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { UserQuestionBase } from './q_base.js';
import { StringUtil } from './util.js';

var replacementForId = '{id}';
var replacementForLabel = '{lb}';
var replacementForValue = '{vl}';
var replacementFordDivId = '{divid}';

var q_template_decimal_input = '\n<div id="{divid}>\n\t<label>{lb}</label>\n\t<input id="tx_number_input_{id}" type="text" class="fm_text_input" value=""/>\n</div>\n';

var q_template_decimal_ro = '\n<div>\n\t<label>{lb}</label>\n\t<span class="form-control form-control-lg">{vl}</span>\n</div>\n';

var UserDecimalQuestionText = function (_UserQuestionBase) {
	_inherits(UserDecimalQuestionText, _UserQuestionBase);

	function UserDecimalQuestionText(qInfo, childId) {
		_classCallCheck(this, UserDecimalQuestionText);

		// set the existing vlaue
		var _this = _possibleConstructorReturn(this, (UserDecimalQuestionText.__proto__ || Object.getPrototypeOf(UserDecimalQuestionText)).call(this, qInfo, childId));

		_this._value = qInfo.iv1;
		return _this;
	}

	// Method for validating the result value upon moving away 
	// from the page.


	_createClass(UserDecimalQuestionText, [{
		key: 'onValidating',
		value: function onValidating() {
			if (this._value === parseInt(this._value, 10)) {
				return true;
			}
			return false;
		}

		// Method for hooking up event handler to handle text change event

	}, {
		key: 'onChangeEvent',
		value: function onChangeEvent() {
			var self = this;
			var selector = '#' + this.myId;
			$(selector).change(function (e) {
				e.preventDefault();
				var obj = $(selector).val();

				// get the integer value from input
				var iv = StringUtil.strWithCommasToInteger(obj);
				self.setValue(iv);
			});

			// Add "," per thousands
			$(selector).keyup(function (e) {
				e.preventDefault();
				var obj = $(selector).val();
				if (obj) {
					// get the integer value from input
					var iv = StringUtil.strWithCommasToInteger(obj);
					// now convert to string with comma
					$(selector).val(StringUtil.intToNumberWithCommas(iv));
				}
			});

			// prevent none digit from entering
			$(selector).keydown(function (e) {
				// Allow: backspace, delete, tab, escape and enter
				if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
				// Allow: Ctrl+A
				e.keyCode == 65 && e.ctrlKey === true ||
				// Allow: home, end, left, right
				e.keyCode >= 35 && e.keyCode <= 39) {
					// let it happen, don't do anything
					return;
				}
				// Ensure that it is a number and stop the keypress
				if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
					e.preventDefault();
				}
			});
		}

		// Validate the input value and save teh legit value

	}, {
		key: 'setValue',
		value: function setValue(iv) {
			this._value = iv;
		}

		// This method can be called when we need to serialize the question / answer
		// to JSON format (usually for session store)

	}, {
		key: 'serialize',
		value: function serialize() {
			this.qInfo.iv1 = this._value;
		}

		// get the input UI element id 

	}, {
		key: 'setDisplayValue',


		// This method is called after the UI is rendered to display its
		// input value
		value: function setDisplayValue() {
			// set initial radio selection if selection value is presented:
			if (this._value) {
				var selector = '#' + this.myId;
				// convert to string with comma
				$(selector).val(StringUtil.intToNumberWithCommas(this._value));
			}
		}

		// get display html for the control

	}, {
		key: 'myId',
		get: function get() {
			return 'tx_number_input_' + this.id;
		}

		// get text input label

	}, {
		key: 'textLabel',
		get: function get() {
			return this.qInfo.attr_label;
		}
	}, {
		key: 'displayHtml',
		get: function get() {
			var clssStr = this.uiClass;
			var htmlStr = q_template_decimal_input.replace(new RegExp(replacementForId, 'g'), this.id).replace(replacementForLabel, this.textLabel).replace(replacementFordDivId, '' + this.wrapperDivId);
			return htmlStr;
		}

		// get read-only display html for the control

	}, {
		key: 'displayHtmlReadOnly',
		get: function get() {
			return q_template_decimal_ro.replace(replacementForLabel, this.textLabel).replace(replacementForValue, this._value);
		}

		// get the question in xml format for saving to API server

	}, {
		key: 'serverXML',
		get: function get() {
			var ret = '';
			if (this.onValidating()) {
				ret = '<qa>\n\t\t\t\t\t<id>' + this.id + '</id>\n\t\t\t\t\t<intv>' + this._value + '</intv>\n\t\t\t\t</qa>\n\t\t\t\t';
			}
			return ret;
		}
	}]);

	return UserDecimalQuestionText;
}(UserQuestionBase);

export { UserDecimalQuestionText };