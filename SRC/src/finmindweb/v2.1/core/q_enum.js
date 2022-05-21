var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { UserQuestionBase } from './q_base.js';
import { StringUtil } from './util.js';

var replacementForClass = '{clss}';
var replacementForName = '{nm}';
var replacementForValue = '{vl}';
var replacementForId = '{id}';
var replacementForRadio = '{radio}';

var q_template_enum_group = '\n<div class="mb-4">\n\t{radio}\n</div>\n';

var q_template_enum = '\n<div class="form-check form-check-inline me-5">\n\t<input class="form-check-input" type="radio" name="{nm}" id="" value="{vl}">\n\t<label class="form-label fs-6p" for="">{vl}</label>\n</div>\n';

var q_template_enum_ro = '\n<div class="form-check form-check-inline me-5">\n\t<span class="form-control form-control-lg">{vl}</span>\n</div>\n';

var UserEnumQuestionRadio = function (_UserQuestionBase) {
	_inherits(UserEnumQuestionRadio, _UserQuestionBase);

	function UserEnumQuestionRadio(qInfo, enumValues) {
		_classCallCheck(this, UserEnumQuestionRadio);

		var _this = _possibleConstructorReturn(this, (UserEnumQuestionRadio.__proto__ || Object.getPrototypeOf(UserEnumQuestionRadio)).call(this, qInfo));

		_this._enumValues = enumValues;
		_this._value = qInfo.sv1;
		// cameral case
		if (_this._value) {
			_this._value = StringUtil.convertToCamelCase(_this._value);
		}
		return _this;
	}

	// Method for validating the result value upon moving away 
	// from the page.


	_createClass(UserEnumQuestionRadio, [{
		key: 'onValidating',
		value: function onValidating() {
			if (this._value && this._enumValues.includes(this._value)) {
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
			var radioName = this.radioName;
			var jqName = 'input[name=\'' + radioName + '\']';
			$(jqName).change(function (e) {
				e.preventDefault();
				var rName = self.radioName;
				var jqStatus = 'input[name=\'' + rName + '\']:checked';
				self.setValue($(jqStatus).val());
			});
		}

		// Setting the enum value from the UI when handling the
		// selection change event

	}, {
		key: 'setValue',
		value: function setValue(obj) {
			this._value = obj;
			if (typeof obj !== 'string' || !this.onValidating()) {
				throw new Error('invalid value for question: ' + this.id);
			}
		}

		// This method can be called when we need to serialize the question / answer
		// to JSON format (usually for session store)

	}, {
		key: 'serialize',
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
				var selector = 'input:radio[name=' + this.radioName + '][value=\'' + this._value + '\']';
				$(selector).prop('checked', true);
			}
		}

		// get radio class 

	}, {
		key: 'radioClass',
		get: function get() {
			return 'enum_for_' + this.id;
		}

		// get radio (group) name 

	}, {
		key: 'radioName',
		get: function get() {
			return 'name_for_' + this.id;
		}

		// get radio id

	}, {
		key: 'radioId',
		get: function get() {
			return 'radio_' + this.id + '_' + this._value;
		}

		// get display html for the entire enum group in form of radio buttons

	}, {
		key: 'displayHtml',
		get: function get() {
			var clssStr = this.radioClass;
			var name = this.radioName;
			var radioStr = "";
			for (var i = 0; i < this._enumValues.length; i++) {
				var theValue = this._enumValues[i];
				radioStr += q_template_enum.replace(replacementForClass, clssStr).replace(replacementForName, name).replace(replacementForId, this.id).replace(new RegExp(replacementForValue, 'g'), theValue);
			}

			var htmlStr = q_template_enum_group.replace(replacementForRadio, radioStr);
			return htmlStr;
		}

		// get read-only display html for the address combination

	}, {
		key: 'displayHtmlReadOnly',
		get: function get() {
			return q_template_enum_ro.replace(replacementForValue, this._value);
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

	return UserEnumQuestionRadio;
}(UserQuestionBase);

export { UserEnumQuestionRadio };