var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { UserQuestionBase } from './q_base.js';
import { StringUtil } from './util.js';

var replacementForLabel = '{lb}';
var replacementForValue = '{vl}';
var replacementForId = '{id}';
var replacementFordDivId = '{divid}';

var q_template_text = '\n<div class="mb-4">\n  <label for="ExistingInsurance" class="form-label">{lb}</label>\n  <input type="text" id="tx_field_{id}" class="form-control form-control-lg" placeholder="Please enter" value="{vl}">\n</div>\n';

var q_template_text_ro = '\n<div class="mb-4">\n  <label for="ExistingInsurance" class="form-label">{lb}</label>\n  <span class="form-control form-control-lg">{vl}</span>\n </div>\n';

var UserTextQuestion = function (_UserQuestionBase) {
	_inherits(UserTextQuestion, _UserQuestionBase);

	function UserTextQuestion(qInfo, regex, childId) {
		_classCallCheck(this, UserTextQuestion);

		var _this = _possibleConstructorReturn(this, (UserTextQuestion.__proto__ || Object.getPrototypeOf(UserTextQuestion)).call(this, qInfo, childId));

		_this._value = qInfo.sv1 != null ? qInfo.sv1 : '';
		_this._regex = regex;
		return _this;
	}

	// Method for validating the result value upon moving away 
	// from the page.


	_createClass(UserTextQuestion, [{
		key: 'onValidating',
		value: function onValidating() {
			if (this._value && this.regexValidating(this._value)) {
				return true;
			}
			return false;
		}

		// Method for validating the result value upon moving away 
		// from the page.

	}, {
		key: 'regexValidating',
		value: function regexValidating(v) {
			return this._regex == null || this._regex.test(v);
		}

		// Method for hooking up event handler to handle RADIO 
		// selectioon change event

	}, {
		key: 'onChangeEvent',
		value: function onChangeEvent() {
			var self = this;
			//when text edit is done, set the value ffrom the text field:
			var selector = '#' + this.myId;
			$(selector).blur(function (e) {
				e.preventDefault();
				var newVal = $(selector).val();

				// if it does not conform with the regex, alert and not set
				if (newVal && !self.regexValidating(newVal)) {
					alert('Invalid ' + self.label + ' value');
					return;
				}
				self.setValue(newVal);
			});
		}

		// Setting the enum value from the UI when handling the
		// selection change event

	}, {
		key: 'setValue',
		value: function setValue(obj) {
			if (typeof obj !== 'string') {
				throw new Error('invalid value for question: ' + this.id);
			}
			this._value = obj.trim();
		}

		// get XML element for parent control if I am serving as a sub-control

	}, {
		key: 'serialize',


		// This method can be called when we need to serialize the question / answer
		// to JSON format (usually for session store)
		value: function serialize() {
			this.qInfo.sv1 = this._value;
		}

		// This method is called after the UI is rendered to display its
		// input value (or selection fo check box and radio button and dropdown)

	}, {
		key: 'setDisplayValue',
		value: function setDisplayValue() {
			// set initial radio selection if selection value is presented:
			if (this._value) {
				var selector = '#' + this.myId;
				$(selector).val(this._value);
			}
		}

		// get radio class 

	}, {
		key: 'xmlElement',
		get: function get() {
			return { tag: 'strv', obj: this._value };
		}
	}, {
		key: 'myId',
		get: function get() {
			return 'tx_field_' + this.id;;
		}

		// get display html for the entire enum group in form of radio buttons

	}, {
		key: 'displayHtml',
		get: function get() {
			var htmlStr = q_template_text.replace(replacementForId, this.id).replace(replacementForLabel, this.label).replace(replacementForValue, this._value).replace(replacementFordDivId, '' + this.wrapperDivId);

			return htmlStr;
		}

		// get read-only display html for the address combination

	}, {
		key: 'displayHtmlReadOnly',
		get: function get() {
			var htmlStr = q_template_text_ro.replace(replacementForLabel, this.label).replace(replacementForValue, this._value);

			return htmlStr;
		}
		// get question in xml format for saving to API server

	}, {
		key: 'serverXML',
		get: function get() {
			var ret = '';
			if (this.onValidating()) {
				ret = '<qa>\n<id>' + this.id + '</id>\n<strv>' + this._value + '</strv>\n</qa>';
			}
			return ret;
		}
	}]);

	return UserTextQuestion;
}(UserQuestionBase);

export { UserTextQuestion };