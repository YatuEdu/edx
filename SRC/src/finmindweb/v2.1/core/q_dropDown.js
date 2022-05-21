var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { UserQuestionBase } from './q_base.js';
import { StringUtil } from './util.js';
import { MetaDataManager } from './metaDataManager.js';

var replacementForId = '{id}';
var replacementForValue = '{vl}';
var replacementForName = '{nm}';
var replacementForOptionBody = '{opt_body}';
var replacementForLabel = '{lb}';
var replacementFordDivId = '{divid}';

var select_option_html_template = '\n<div class="mb-4" id="{divid}">\n  <label class="form-label">{lb}</label>\n  <select class="form-select form-control-lg" id="select_option_{id}">\n\t{opt_body}\n  </select>\n</div>\n';

var select_option_html_template_no_label_no_div = '\n<select class="form-select form-control-lg" id="select_option_{id}">\n\t{opt_body}\n</select>\n';

var select_option_item_template = '\n<option value="{nm}">{vl}</option>\n';

var q_template_selection_ro = '\n<div class="form-check form-check-inline me-5">\n\t<label class="form-label">{lb}</label>\n\t<span class="form-control form-control-lg">{vl}</span>\n</div>\n';

var UserDropdownSelection = function (_UserQuestionBase) {
	_inherits(UserDropdownSelection, _UserQuestionBase);

	function UserDropdownSelection(qInfo, enumValues, childId, noLabel) {
		_classCallCheck(this, UserDropdownSelection);

		var _this = _possibleConstructorReturn(this, (UserDropdownSelection.__proto__ || Object.getPrototypeOf(UserDropdownSelection)).call(this, qInfo, childId));

		_this._enumValues = enumValues;
		_this._value = qInfo.sv1 ? qInfo.sv1 : _this._enumValues[0];
		_this._noLable = noLabel;
		return _this;
	}

	// Method for validating the result value upon moving away 
	// from the page.


	_createClass(UserDropdownSelection, [{
		key: 'onValidating',
		value: function onValidating() {
			// no need for validation is it is not visible
			if (!this.visible) {
				return true;
			}

			if (this._value && this._value.indexOf(MetaDataManager.dropDownNoneSelection) == -1) {
				return true;
			}
			return false;
		}

		// Method for hooking up event handler to handle RADIO 
		// selectioon change event

	}, {
		key: 'onChangeEvent',
		value: function onChangeEvent() {
			var jqSel = '#' + this.myId;
			var self = this;
			$(jqSel).change(function (e) {
				e.preventDefault();
				var jqSelOpt = '#' + self.myId + ' option:selected';
				var selVal = $(jqSelOpt).text();
				self.setValue(selVal);
			});
		}

		// Setting the enum value from the UI when handling the
		// selection change event

	}, {
		key: 'setValue',
		value: function setValue(obj) {
			this._value = obj;
			if (!this.onValidating()) {
				this._value = '';
			}
		}

		// This method is called after the UI is rendered to display its
		// input value (or selection fo check box and radio button and dropdown)

	}, {
		key: 'setDisplayValue',
		value: function setDisplayValue() {
			// set initial radio selection if selection value is presented:
			if (this._value) {
				var jqSel = '#' + this.myId;
				var indx = this._enumValues.indexOf(this._value);
				$(jqSel).val(indx).change();
			}
		}

		// Over-ride: get value object 

	}, {
		key: 'serialize',


		// This method can be called when we need to serialize the question / answer
		// to JSON format (usually for session store)
		value: function serialize() {
			this.qInfo.sv1 = this._value;
		}

		// get question in xml format for saving to API server

	}, {
		key: 'value',
		get: function get() {
			return this._value;
		}

		// get the id of the selection controllers

	}, {
		key: 'myId',
		get: function get() {
			return 'select_option_' + this.id;
		}

		// get XML element for parent control if I am serving as a sub-control

	}, {
		key: 'xmlElement',
		get: function get() {
			return { tag: 'strv', obj: this._value };
		}

		// get display html for the entire enum group in form of radio buttons

	}, {
		key: 'displayHtml',
		get: function get() {
			var template = this._noLable ? select_option_html_template_no_label_no_div : select_option_html_template;
			var selStr = template.replace(new RegExp(replacementForId, 'g'), this.id).replace(replacementForLabel, this.label).replace(replacementFordDivId, '' + this.wrapperDivId);

			var optionStr = "";
			for (var i = 0; i < this._enumValues.length; i++) {
				var theValue = this._enumValues[i];

				optionStr += select_option_item_template.replace(replacementForName, i).replace(replacementForValue, theValue);
			}
			selStr = selStr.replace(replacementForOptionBody, optionStr);
			return selStr;
		}

		// get read-only display html for the drop-down selectioon

	}, {
		key: 'displayHtmlReadOnly',
		get: function get() {
			return q_template_selection_ro.replace(replacementForLabel, this.label).replace(replacementForValue, this._value);
		}
	}, {
		key: 'serverXML',
		get: function get() {
			var ret = '';
			if (this.onValidating()) {
				ret = '<qa>\n\t\t\t\t\t<id>' + this.id + '</id>\n\t\t\t\t\t<strv>' + this._value + '</strv>\n\t\t\t\t</qa>';
			}
			return ret;
		}
	}]);

	return UserDropdownSelection;
}(UserQuestionBase);

export { UserDropdownSelection };