var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { UserQuestionBase } from './q_base.js';
import { StringUtil } from './util.js';
import { MetaDataManager } from './metaDataManager.js';

var replacementForClass = '{clss}';
var replacementForName = '{nm}';
var replacementForAddr = '{addr}';
var replacementForCity = '{cty}';
var replacementForZip = '{zp}';
var replacementForId = '{id}';
var replacementForSt = '{st}';
var replacementForState = '{st_name}';
var replacementForStates = '{states}';
var replacementForStateSelect = '{state_selects}';

var state_select_html_template = '\n<select class="form-select form-control-lg" id="select_state_{id}">\n\t{states}\n</select>\n';

var state_option_item_template = '\n<option value="{st}">{st_name}</option>\n';

var q_template_text = '\n<div class="row mb-4">\n\t<div class="col">\t\n\t\t<label class="form-label" for="address">Adress</label>\n\t\t<input type="text" id="address_{id}" class="form-control form-control-lg user_name_input" data-seq="1" value="{addr}" maxlength="32"/>\n\t</div>\n</div>\n<div class="row mb-4">\n\t<div class="col">\n\t\t<label class="form-label" for="city">City</label>\n\t\t<input type="text" id="city_{id}" class="form-control form-control-lg user_name_input" data-seq="1" value="{cty}" maxlength="32"/>\t\n\t</div>\n\t<div class="col">\n\t\t<label class="form-label" for="state">State</label>\n\t\t{state_selects}\n\t</div>\n\t<div class="col">\t\n\t\t<label class="form-label"  for="Zip code">ZipCode</label>\n\t\t<input type="text" id="zip_{id}" class="form-control form-control-lg user_name_input" data-seq="1" value="{zp}" maxlength="32"/>\n\t</div>\n</div>';

var q_template_text_ro = '\n<div class="row mb-4">\n\t<div class="col">\t\n\t\t<label class="form-label" for="address">Adress:</label>\n\t\t<span class="form-control form-control-lg">{addr}</span>\n\t</div>\n</div>\n<div class="row mb-4">\n\t<div class="col">\n\t\t<label class="form-label" for="city">City:</label>\n\t\t<span class="form-control form-control-lg">{cty}</span>\n\t</div>\n\t<div class="col">\n\t\t<label class="form-label" for="state">State</label>\n\t\t<span class="form-control form-control-lg">{st}</span>\n\t</div>\n\t<div class="col">\t\n\t\t<label class="form-label"  for="Zip code">ZipCode</label>\n\t\t<span class="form-control form-control-lg">{zp}</span>\n\t</div>\n</div>';

var UserAdressQuestion = function (_UserQuestionBase) {
	_inherits(UserAdressQuestion, _UserQuestionBase);

	function UserAdressQuestion(qInfo) {
		_classCallCheck(this, UserAdressQuestion);

		var _this = _possibleConstructorReturn(this, (UserAdressQuestion.__proto__ || Object.getPrototypeOf(UserAdressQuestion)).call(this, qInfo));

		_this._address = qInfo.sv1;
		_this._city = qInfo.sv2;
		_this._state = qInfo.sv3;
		_this._zip = qInfo.sv4;
		return _this;
	}

	// Method for validating the result value upon moving away 
	// from the page.


	_createClass(UserAdressQuestion, [{
		key: 'onValidating',
		value: function onValidating() {
			if (this._address && this._city && this._state && this._zip) {
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
			var addrSelector = '#' + this.addressInputId;
			$(addrSelector).blur(function () {
				self.setAddress($(addrSelector).val());
			});

			var citySelector = '#' + this.cityInputId;
			$(citySelector).blur(function () {
				self.setCity($(citySelector).val());
			});

			var stateSelector = '#' + this.stateSelectId;
			$(stateSelector).change(function () {
				self.setState($(stateSelector).val());
			});

			var zipSelector = '#' + this.zipInputId;
			$(zipSelector).blur(function () {
				self.setZip($(zipSelector).val());
			});

			$(zipSelector).on('input', function (e) {
				var obj = $(zipSelector).val();

				if (obj.length > 5) obj = obj.slice(0, 5);
				$(zipSelector).val(obj);
			});
			$(zipSelector).on('keypress', function (e) {
				return e.keyCode >= 48 && e.keyCode <= 57;
			});
		}

		// Setting address value

	}, {
		key: 'setAddress',
		value: function setAddress(obj) {
			if (typeof obj !== 'string') {
				throw new Error('invalid value for question: ' + this.id);
			}
			this._address = obj;
		}

		// Setting city value

	}, {
		key: 'setCity',
		value: function setCity(obj) {
			if (typeof obj !== 'string') {
				throw new Error('invalid value for question: ' + this.id);
			}
			this._city = obj;
		}

		// Setting state value

	}, {
		key: 'setState',
		value: function setState(obj) {
			if (typeof obj !== 'string') {
				throw new Error('invalid value for question: ' + this.id);
			}
			this._state = obj;
		}

		// Setting zip value

	}, {
		key: 'setZip',
		value: function setZip(obj) {
			if (typeof obj !== 'string') {
				throw new Error('invalid value for question: ' + this.id);
			}
			this._zip = obj;
		}

		// This method can be called when we need to serialize the question / answer
		// to JSON format (usually for session store)

	}, {
		key: 'serialize',
		value: function serialize() {
			this.qInfo.sv1 = this._address;
			this.qInfo.sv2 = this._city;
			this.qInfo.sv3 = this._state;
			this.qInfo.sv4 = this._zip;
		}

		// This method is called after the UI is rendered to display its
		// input value (or selection fo check box and radio button and dropdown)

	}, {
		key: 'setDisplayValue',
		value: function setDisplayValue() {

			// set initial input value for addresas
			if (this._address) {
				var selector = '#' + this.addressInputId;
				$(selector).val(this._address);
			} else {
				var _selector = '#' + this.addressInputId;
				$(_selector).val('');
			}

			// set initial input value for city 
			if (this._city) {
				var _selector2 = '#' + this.cityInputId;
				$(_selector2).val(this._city);
			} else {
				var _selector3 = '#' + this.cityInputId;
				$(_selector3).val('');
			}

			// set initial state option if present
			if (this._state) {
				var _selector4 = '#' + this.stateSelectId;
				$(_selector4).val(this._state);
			}

			// set initial input value for zip 
			if (this._zip) {
				var _selector5 = '#' + this.zipInputId;
				$(_selector5).val(this._zip);
			} else {
				var _selector6 = '#' + this.zipInputId;
				$(_selector6).val('');
			}
		}
	}, {
		key: 'addressInputId',


		// get address input id
		get: function get() {
			return 'address_' + this.id;
		}

		// get city input id

	}, {
		key: 'cityInputId',
		get: function get() {
			return 'city_' + this.id;
		}

		// get state seledct id

	}, {
		key: 'stateSelectId',
		get: function get() {
			return 'select_state_' + this.id;
		}

		// get zip input id

	}, {
		key: 'zipInputId',
		get: function get() {
			return 'zip_' + this.id;
		}

		// get display html for the address combination

	}, {
		key: 'displayHtml',
		get: function get() {
			var stateList = MetaDataManager.enumMap.get(26); // todo: use const variable
			var stateOptions = '';
			var i = 0;
			stateList.forEach(function (st) {
				return stateOptions += state_option_item_template.replace(replacementForSt, st).replace(replacementForState, st);
			});
			var stateSelect = state_select_html_template.replace(replacementForId, this.id).replace(replacementForStates, stateOptions);

			var htmlStr = q_template_text.replace(new RegExp(replacementForId, 'g'), this.id).replace(replacementForAddr, this._address).replace(replacementForCity, this._city).replace(replacementForZip, this._zip).replace(replacementForStateSelect, stateSelect);

			return htmlStr;
		}

		// get read-only display html for the address combination

	}, {
		key: 'displayHtmlReadOnly',
		get: function get() {
			var htmlStr = q_template_text_ro.replace(new RegExp(replacementForId, 'g'), this.id).replace(replacementForAddr, this._address).replace(replacementForCity, this._city).replace(replacementForZip, this._zip).replace(replacementForSt, this._state);

			return htmlStr;
		}

		// get question in xml format for saving to API server

	}, {
		key: 'serverXML',
		get: function get() {
			var ret = '';
			if (this.onValidating()) {
				ret = '<qa>\n<id>' + this.id + '</id>\n<strv>' + this._address + '</strv>\n<strv2>' + this._city + '</strv2>\n<strv3>' + this._state + '</strv3>\n<strv4>' + this._zip + '</strv4>\n</qa>';
			}
			return ret;
		}
	}]);

	return UserAdressQuestion;
}(UserQuestionBase);

export { UserAdressQuestion };