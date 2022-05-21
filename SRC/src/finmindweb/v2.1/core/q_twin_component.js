var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { UserQuestionBase } from './q_base.js';
import { StringUtil } from './util.js';

var replacementForComponents = '{components_html}';
var replacementForId = '{id}';

var q_template_components = '\n<div id="fm_twin_{id}">\n{components_html}\n</div>';

var UserMultiControl = function (_UserQuestionBase) {
	_inherits(UserMultiControl, _UserQuestionBase);

	// list of components

	function UserMultiControl(qInfo, componentList) {
		_classCallCheck(this, UserMultiControl);

		var _this = _possibleConstructorReturn(this, (UserMultiControl.__proto__ || Object.getPrototypeOf(UserMultiControl)).call(this, qInfo));

		_this._components = componentList;
		return _this;
	}

	// Method for validating the result value upon moving away 
	// from the page.


	_createClass(UserMultiControl, [{
		key: 'onValidating',
		value: function onValidating() {
			var validated = true;
			for (var i = 0; i < this._components.length; i++) {
				if (this._components[i].onValidating) {
					validated = false;
					break;
				}
			}
			return validated;
		}

		// Method for hooking up event handler to handle RADIO 
		// selectioon change event

	}, {
		key: 'onChangeEvent',
		value: function onChangeEvent() {
			this._components.forEach(function (c) {
				return c.onChangeEvent();
			});
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
			this._components.forEach(function (c) {
				return c.setDisplayValue();
			});
		}

		// get display html for the entire enum group in form of radio buttons

	}, {
		key: 'displayHtml',
		get: function get() {
			var componentHtml = '';
			// combine sub-control html into an entire HTML
			this._components.forEach(function (c) {
				return componentHtml += c.displayHtml;
			});
			var htmlStr = q_template_components.replace(replacementForId, this.id).replace(replacementForComponents, componentHtml);

			return htmlStr;
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

	return UserMultiControl;
}(UserQuestionBase);

export { UserMultiControl };