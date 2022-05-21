var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { UserQuestionBase } from './q_base.js';
import { StringUtil } from './util.js';

var replacementForClass = '{clss}';
var replacementQuestion = '{qst}';
var replacementForName = '{nm}';
var replacementForIndex = '{indx}';
var replacementForValue = '{vlu}';
var replacementForCheckBoxGroup = '{cbg}';

var q_template_enum_single_old = '\n\t<input \ttype="checkbox" \n\t\t\tname="{nm}" \n\t\t\tclass="{clss}"\n\t\t\tdata-indx="{indx}"\n\t\t\tvalue="{vlu}">{vlu}<br>';

var q_template_enum_single = '\n<div class="div-block-62">\n\t<div class="div-block-61"><label class="w-checkbox checkbox-field-3 _3">\n\t\t<div class="w-checkbox-input w-checkbox-input--inputType-custom checkbox-3"></div>\n\t\t<input type="checkbox" class="{clss}" id="checkbox-3" name="{nm}" value="{vlu}" data-indx="{indx}" data-name="Checkbox 3">\n\t\t<span class="radio-button-label-2 w-form-label">{vlu}</span>\n\t  </label></div>\n\t<div data-hover="1" data-delay="0" class="tip w-dropdown">\n\t  <div class="tip-toggle w-dropdown-toggle"><img src="../images/help-circle.svg" loading="eager" alt=""></div>\n<!--\t  <nav class="tip-list w-dropdown-list">-->\n<!--\t\t<div class="tip-text">There should be some explanation here.</div>-->\n<!--\t  </nav>-->\n\t</div>\n</div>\n';

var q_template_enum_multiple = '\n<form>      \n    <fieldset>          \n        {cbg}  \n    </fieldset>      \n</form>\n';

var UserEnumQuestionCheckbox = function (_UserQuestionBase) {
	_inherits(UserEnumQuestionCheckbox, _UserQuestionBase);

	function UserEnumQuestionCheckbox(qInfo, enumValues) {
		_classCallCheck(this, UserEnumQuestionCheckbox);

		var _this = _possibleConstructorReturn(this, (UserEnumQuestionCheckbox.__proto__ || Object.getPrototypeOf(UserEnumQuestionCheckbox)).call(this, qInfo));

		_this._enumValues = enumValues;
		if (qInfo.sv1) {
			_this._value = StringUtil.convertStringToArray(qInfo.sv1);
		} else {
			_this._value = [];
		}
		return _this;
	}

	// Method for validating the result value upon moving away 
	// from the page.


	_createClass(UserEnumQuestionCheckbox, [{
		key: 'onValidating',
		value: function onValidating() {
			var _this2 = this;

			// make sure all the index value is in range and no duplicates found
			if (!Array.isArray(this._value)) {
				return false;
			}
			var indxSet = new Set(this._value);

			// detect duplicates
			if (this._value.length != indxSet.size) {
				return false;
			}
			// detect range error
			if (undefined !== this._value.find(function (e) {
				return e >= _this2._enumValues.length || e < 0;
			})) {
				return false;
			}
			return true;
		}

		// Method for hooking up event handler to handle RADIO 
		// selectioon change event

	}, {
		key: 'onChangeEvent',
		value: function onChangeEvent() {
			var classSelector = '.' + this.groupClass;
			var self = this;

			$(classSelector).change(function () {
				// get all the indexs of the selected items
				var checkboxes = $(classSelector);
				self._value = [];
				for (var i = 0; i < checkboxes.length; i++) {
					if (checkboxes[i].checked) {
						var inx = $(checkboxes[i]).attr("data-indx");
						self._value.push(inx);
					}
				}
			});
		}

		// Setting the enum value from the UI when handling the
		// selection change event

	}, {
		key: 'setValue',
		value: function setValue(obj) {
			this._value = obj;
			if (!Array.isArray(obj) || !this.onValidating()) {
				throw new Error('invalid value for question ' + this.id);
			}
		}

		// This method can be called when we need to serialize the question / answer
		// to JSON format (usually for session store)

	}, {
		key: 'serialize',
		value: function serialize() {
			this.qInfo.sv1 = this.getSerializedValue();
		}
	}, {
		key: 'getSerializedValue',
		value: function getSerializedValue() {
			var sv = '';
			for (var i = 0; i < this._value.length; i++) {
				if (i > 0) {
					sv += ',';
				}
				sv += this._value[i];
			}
			return sv;
		}

		// This method is called after the UI is rendered to display its
		// input value (or selection fo check box and radio button and dropdown)

	}, {
		key: 'setDisplayValue',
		value: function setDisplayValue() {
			if (this._value.length == 0) {
				return;
			}
			var classSelector = '.' + this.groupClass;
			// get all the indexs of the selected items
			var checkboxes = $(classSelector);
			for (var i = 0; i < checkboxes.length; i++) {
				var target = checkboxes[i];
				var inxStr = $(target).attr("data-indx");
				//const index = parseInt(inxStr, 10);
				if (this._value.includes(inxStr)) {
					$(target).prop('checked', true);
				} else {
					$(target).prop('checked', false);
				}
			}
		}

		// get radio class 

	}, {
		key: 'groupClass',
		get: function get() {
			return 'enum_multi_for_' + this.id;
		}

		// get radio (group) nsme 

	}, {
		key: 'groupName',
		get: function get() {
			return 'name_for_' + this.id;
		}

		// get display html for the entire enum group in form of checkboxes

	}, {
		key: 'displayHtml',
		get: function get() {
			var clssStr = this.groupClass;
			var name = this.groupName;
			var htmlStrGroup = "";
			for (var i = 0; i < this._enumValues.length; i++) {
				var theValue = this._enumValues[i];
				htmlStrGroup += q_template_enum_single.replace(replacementForClass, clssStr).replace(replacementForName, name).replace(replacementForIndex, i).replace(new RegExp(replacementForValue, 'g'), theValue);
			}
			var htmlStr = q_template_enum_multiple.replace(replacementQuestion, this._qText).replace(replacementForCheckBoxGroup, htmlStrGroup);
			return htmlStr;
		}

		// get question in xml format for saving to API server

	}, {
		key: 'serverXML',
		get: function get() {
			var ret = '';
			if (this.onValidating()) {
				ret = '\n<qa>\n\t<id>' + this.id + '</id>\t\n\t{body}\n</qa>';
				var body = '';
				this._value.forEach(function (i) {
					return body += '<indx>' + i + '</indx>';
				});
				ret = ret.replace('{body}', body);
			}
			return ret;
		}
	}]);

	return UserEnumQuestionCheckbox;
}(UserQuestionBase);

export { UserEnumQuestionCheckbox };