var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { UserQuestionBase } from './q_base.js';

var replacementForClass = '{clss}';
var replacementForValue = '{vl}';
var replacementForLabel = '{lb}';

var q_template_date = '\n<div class="mb-4">\n\t<label for="IssueDate" class="form-label">{lb}</label>\n\t<input type="date" min="{min}" max="{max}" name="dob" value="{vl}" class="form-control form-control-lg {clss}">\n</div>\n';

var q_template_date_ro = '\n<div class="mb-4">\n\t<label for="IssueDate" class="form-label">{lb}</label>\n\t<span class="form-control form-control-lg">{vl}</span>\n</div>\n';

var ourDateFormat = 'MM/DD/YYYY';
var dateFormat = [moment.ISO_8601, ourDateFormat];

var UserDateQuestion = function (_UserQuestionBase) {
	_inherits(UserDateQuestion, _UserQuestionBase);

	function UserDateQuestion(qInfo, minDate, maxDate) {
		_classCallCheck(this, UserDateQuestion);

		var _this = _possibleConstructorReturn(this, (UserDateQuestion.__proto__ || Object.getPrototypeOf(UserDateQuestion)).call(this, qInfo));

		_this._minDate = minDate;
		_this._maxDate = maxDate;
		_this.validateAndSave(qInfo.sv1);
		return _this;
	}

	// Method for validating the result value upon moving away 
	// from the page.


	_createClass(UserDateQuestion, [{
		key: 'onValidating',
		value: function onValidating() {
			return this.onValidatingInternal(this._dateStr);
		}

		// Method for validating the result value upon moving away 
		// from the page.

	}, {
		key: 'onValidatingInternal',
		value: function onValidatingInternal(dateString) {
			return moment(dateString, dateFormat, true).isValid();
		}

		// Method for hooking up event handler to handle text change event

	}, {
		key: 'onChangeEvent',
		value: function onChangeEvent() {
			var self = this;
			// check validness
			$('.' + this.uiClass).blur(function () {
				var dateString = $(this).val();
				if (!self.validateAndSave(dateString)) {
					// REVERT
					$(this).val('');
				}
			});
		}
	}, {
		key: 'validateAndSave',
		value: function validateAndSave(dateStr) {
			if (this.onValidatingInternal(dateStr)) {
				this.setValue(dateStr);
				return true;
			} else {
				this.setValue('');
				return false;
			}
		}
	}, {
		key: 'setValue',
		value: function setValue(obj) {
			this._dateStr = obj;
		}

		// This method can be called when we need to serialize the question / answer
		// to JSON format (usually for session store)

	}, {
		key: 'serialize',
		value: function serialize() {
			this.qInfo.sv1 = this._dateStr;
		}

		// Over-ride: get value object 

	}, {
		key: 'value',
		get: function get() {
			return this._dateStr;
		}

		// get low value class 

	}, {
		key: 'uiClass',
		get: function get() {
			return 'date_for_' + this.id;
		}
	}, {
		key: 'dateFromat',
		get: function get() {
			if (!this._dateStr) {
				return "";
			}

			// Note that HTML date format is yyyy-mm-dd while
			// in finMind server we store the date format as mm/dd/yyyy
			return moment(this._dateStr).format('YYYY-MM-DD');
		}

		// get display html for the date control UI

	}, {
		key: 'displayHtml',
		get: function get() {
			var htmlDateFormat = this.dateFromat;

			var htmlStr = q_template_date.replace(replacementForClass, this.uiClass).replace(replacementForValue, htmlDateFormat).replace(replacementForLabel, this.label).replace("{min}", this._minDate).replace("{max}", this._maxDate);
			return htmlStr;
		}

		// get read-only display html for the date control UI

	}, {
		key: 'displayHtmlReadOnly',
		get: function get() {
			return q_template_date_ro.replace(replacementForLabel, this.label).replace(replacementForValue, this.dateFromat);
		}

		// get the question in xml format for saving to API server

	}, {
		key: 'serverXML',
		get: function get() {
			var ret = '';
			if (this.onValidating()) {
				ret = '<qa>\n\t<id>' + this.id + '</id>\n\t<strv>' + this._dateStr + '</strv>\n</qa>';
			}
			return ret;
		}
	}]);

	return UserDateQuestion;
}(UserQuestionBase);

export { UserDateQuestion };