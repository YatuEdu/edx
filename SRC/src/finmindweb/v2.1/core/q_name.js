var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { UserQuestionBase } from './q_base.js';
import { StringUtil } from './util.js';

var replacementForValue1 = '{val1}';
var replacementForValue2 = '{val2}';
var replacementForValue3 = '{val3}';
var replacementForId = '{id}';

var q_template_fst_mid_lst_name = '\n\t<div class="row mb-4">\n\t\t<div class="col">\t\t\n\t\t\t<label class="form-label" for="first_name">First name</label>\n\t\t\t<input type="text" id="first_name_{id}" class="form-control form-control-lg user_name_input" data-seq="1" value="{val1}" maxlength="20"/>\n\t\t</div>\n\t\t<div class="col">\n\t\t\t<label class="form-label" for="middle_name">Middle name</label>\n\t\t\t<input type="text" id="middle_name_{id}" class="form-control form-control-lg user_name_input" data-seq="1" value="{val2}" maxlength="20"/>\n\t\t</div>\t\n\t\t<div class="col">\t\t\n\t\t\t<label class="form-label" for="last_name">Last name</label>\n\t\t\t<input type="text" id="last_name_{id}" class="form-control form-control-lg user_name_input" data-seq="1" value="{val3}" maxlength="20"/>\n\t\t</div>\n\t</div>';

var q_template_fst_mid_lst_name_ro = '\n\t<div class="row mb-4">\n\t\t<div class="col">\t\t\n\t\t\t<label class="form-label" for="first_name">First name</label>\n\t\t\t<span class="form-control form-control-lg">{val1}</span>\n\t\t</div>\n\t\t<div class="col">\n\t\t\t<label class="form-label" for="middle_name">Middle name</label>\n\t\t\t<span class="form-control form-control-lg">{val2}</span>\n\t\t</div>\t\n\t\t<div class="col">\t\t\n\t\t\t<label class="form-label" for="last_name">Last name</label>\n\t\t\t<span class="form-control form-control-lg">{val3}</span>\n\t\t</div>\t\n\t</div>';

var UserNameQuestion = function (_UserQuestionBase) {
	_inherits(UserNameQuestion, _UserQuestionBase);

	function UserNameQuestion(qInfo) {
		_classCallCheck(this, UserNameQuestion);

		var _this = _possibleConstructorReturn(this, (UserNameQuestion.__proto__ || Object.getPrototypeOf(UserNameQuestion)).call(this, qInfo));

		_this._first = qInfo.sv1 ? qInfo.sv1 : '';
		_this._middle = qInfo.sv2 ? qInfo.sv2 : '';
		_this._last = qInfo.sv3 ? qInfo.sv3 : '';
		return _this;
	}

	// Method for validating the result value upon moving away 
	// from the page.


	_createClass(UserNameQuestion, [{
		key: 'onValidating',
		value: function onValidating() {
			if (this._first && this._last) {
				return true;
			}
			return false;
		}

		// Method for hooking up event handler to handle RADIO 
		// selectioon change event

	}, {
		key: 'onChangeEvent',
		value: function onChangeEvent() {
			var self = this;
			//when text edit is done, set the value ffrom the text field:
			var selector = '#' + this.firstId;
			$(selector).blur(function () {
				self.setValueFirst($(selector).val());
			});

			var selectorMid = '#' + this.middleId;
			$(selectorMid).blur(function () {
				self.setValueMiddle($(selectorMid).val());
			});

			var selectorLast = '#' + this.lastId;
			$(selectorLast).blur(function () {
				self.setValueLast($(selectorLast).val());
			});
		}
	}, {
		key: 'setValueFirst',
		value: function setValueFirst(obj) {
			if (typeof obj !== 'string') {
				throw new Error('invalid value for question: ' + this.id);
			}
			this._first = obj.trim();
		}
	}, {
		key: 'setValueMiddle',
		value: function setValueMiddle(obj) {
			if (typeof obj !== 'string') {
				throw new Error('invalid value for question: ' + this.id);
			}
			this._middle = obj.trim();
		}
	}, {
		key: 'setValueLast',
		value: function setValueLast(obj) {
			if (typeof obj !== 'string') {
				throw new Error('invalid value for question: ' + this.id);
			}
			this._last = obj.trim();
		}

		// This method can be called when we need to serialize the question / answer
		// to JSON format (usually for session store)

	}, {
		key: 'serialize',
		value: function serialize() {
			this.qInfo.sv1 = this._first;
			this.qInfo.sv2 = this._middle;
			this.qInfo.sv3 = this._last;
		}

		// This method is called after the UI is rendered to display its
		// input value (or selection fo check box and radio button and dropdown)

	}, {
		key: 'setDisplayValue',
		value: function setDisplayValue() {
			// set initial radio selection if selection value is presented:
			if (this._first) {
				var selector = '#' + this.firstId;
				$(selector).val(this._first);
			}
			if (this._middle) {
				var _selector = '#' + this.middleId;
				$(_selector).val(this._middle);
			}
			if (this._last) {
				var _selector2 = '#' + this.lastId;
				$(_selector2).val(this._last);
			}
		}

		// get first name id

	}, {
		key: 'firstId',
		get: function get() {
			return 'first_name_' + this.id;;
		}

		// get first name id

	}, {
		key: 'middleId',
		get: function get() {
			return 'middle_name_' + this.id;;
		}

		// get last name id

	}, {
		key: 'lastId',
		get: function get() {
			return 'last_name_' + this.id;;
		}

		// get display html for the entire enum group in form of radio buttons

	}, {
		key: 'displayHtml',
		get: function get() {
			var htmlStr = q_template_fst_mid_lst_name.replace(new RegExp(replacementForId, 'g'), this.id).replace(replacementForValue1, this._first).replace(replacementForValue2, this._middle).replace(replacementForValue3, this._last);

			return htmlStr;
		}

		// get read-only display html for the name composition control

	}, {
		key: 'displayHtmlReadOnly',
		get: function get() {
			return q_template_fst_mid_lst_name_ro.replace(replacementForValue1, this._first).replace(replacementForValue2, this._middle).replace(replacementForValue3, this._last);
		}

		// get question in xml format for saving to API server

	}, {
		key: 'serverXML',
		get: function get() {
			var ret = '';
			if (this.onValidating()) {
				ret = '<qa>\n<id>' + this.id + '</id>\n<strv>' + this._first + '</strv>\n<strv2>' + this._middle + '</strv2>\n<strv3>' + this._last + '</strv3>\n</qa>';
			}
			return ret;
		}
	}]);

	return UserNameQuestion;
}(UserQuestionBase);

export { UserNameQuestion };