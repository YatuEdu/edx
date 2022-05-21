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
var replacementForLabel = '{lb}';
var replacementForRadio = '{radio}';
var replacementForText = '{txt}';

var q_template_enum_text_group = '\n<div class="mb-4 enum_with_text">\n\t{radio}\n</div>\n<div class="mb-4">\n\t{txt}\n</div>\n';

var q_template_enum = '\n<div class="form-check form-check-inline me-5">\n\t<input class="form-check-input" type="radio" data-name="Radio 5" name="{nm}" value="{vl}">\n\t<label class="form-check-label" for="">{vl}</label>\n</div>';

var q_template_enum_text = '\n<div class="col" id="div_with_text_{id}">\n\t<label for="enum_text" class="form-label">{lb}</label>\n\t<input type="text" id="tx_addtional_text_input_{id}" class="form-control form-control-lg" data-seq="1" value="" maxlength="32"/>\n</div>\n';

var q_template_enum_ro = '\n<div class="form-check form-check-inline me-5">\n\t<label class="form-check-label" for="">{vl}</label>\n</div>';

var q_template_enum_text_ro = '\n<div class="col"">\n\t<label for="enum_text" class="form-label">{lb}</label>\n\t<label class="form-check-label" for="">{vl}</label>\n</div>\n';

var UserEnumRadioWithText = function (_UserQuestionBase) {
	_inherits(UserEnumRadioWithText, _UserQuestionBase);

	function UserEnumRadioWithText(qInfo, enumValues, yesValue, childId) {
		_classCallCheck(this, UserEnumRadioWithText);

		var _this = _possibleConstructorReturn(this, (UserEnumRadioWithText.__proto__ || Object.getPrototypeOf(UserEnumRadioWithText)).call(this, qInfo, childId));

		_this._enumValues = enumValues;
		_this._value = qInfo.sv1;
		_this._value2 = qInfo.sv2;
		_this._yesValue = yesValue;

		// cameral case (why?)
		//if (this._value) {
		//	this._value = StringUtil.convertToCamelCase(this._value);
		//}
		return _this;
	}

	// Method for validating the result value upon moving away 
	// from the page.


	_createClass(UserEnumRadioWithText, [{
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

			// also set text event:
			var txtField = '#' + this.textId;
			$(txtField).blur(function () {
				self.setValue2($(txtField).val());
			});
		}

		// Setting the enum value from the UI when handling the
		// selection change event

	}, {
		key: 'setValue',
		value: function setValue(obj) {
			this._value = obj;
			if (typeof obj !== 'string' || !this.onValidating()) {}
			this.setTextDisplay();
		}
	}, {
		key: 'setValue2',
		value: function setValue2(obj) {
			this._value2 = obj;
			if (typeof obj !== 'string') {}
		}
	}, {
		key: 'setTextDisplay',
		value: function setTextDisplay() {
			var txtField = '#' + this.textId;
			var textDiv = '#' + this.textDivId;

			// if value is the first, show text are, or hide text area
			if (this._value === this._yesValue) {
				// display text
				$(textDiv).show();
				$(txtField).val(this._value2);
			} else {
				// hide text
				$(textDiv).hide();
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

				// display text area? or hide it
				this.setTextDisplay();
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

		// get text id

	}, {
		key: 'textId',
		get: function get() {
			return 'tx_addtional_text_input_' + this.id;
		}

		// get text div id

	}, {
		key: 'textDivId',
		get: function get() {
			return 'div_with_text_' + this.id;
		}

		// get display html for the entire control

	}, {
		key: 'displayHtml',
		get: function get() {
			var clssStr = this.radioClass;
			var name = this.radioName;
			var htmlRadio = "";
			for (var i = 0; i < this._enumValues.length; i++) {
				var theValue = this._enumValues[i];
				htmlRadio += q_template_enum.replace(replacementForClass, clssStr).replace(replacementForName, name).replace(replacementForId, this.id).replace(new RegExp(replacementForValue, 'g'), theValue);
			}
			// text box for extra text input
			var htmlText = q_template_enum_text.replace(new RegExp(replacementForId, 'g'), this.id).replace(replacementForLabel, this.label);

			var htmlRadioAndText = q_template_enum_text_group.replace(replacementForRadio, htmlRadio).replace(replacementForText, htmlText);

			return htmlRadioAndText;
		}

		// get read-only display html for the entire control

	}, {
		key: 'displayHtmlReadOnly',
		get: function get() {
			// if value is the first, show text are, or hide text area
			var enumStr = q_template_enum_ro.replace(replacementForValue, this._value);
			var extrText = '';
			if (this._value === this._yesValue) {
				extrText = q_template_enum_text_ro.replace(replacementForLabel, this.label).replace(replacementForValue, this._value2);
			}
			return enumStr + extrText;
		}

		// get question in xml format for saving to API server

	}, {
		key: 'serverXML',
		get: function get() {
			var ret = '';
			if (this.onValidating()) {
				ret = '<qa>\n<id>' + this.id + '</id>\n<strv>' + this._value + '</strv>\n<strv2>' + this._value2 + '</strv2>\n</qa>';
			}
			return ret;
		}
	}]);

	return UserEnumRadioWithText;
}(UserQuestionBase);

export { UserEnumRadioWithText };