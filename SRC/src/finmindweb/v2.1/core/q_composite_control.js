var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { UserQuestionBase } from './q_base.js';
import { StringUtil } from './util.js';

var replacementForComponents = '{components_html}';
var replacementForId = '{id}';
var replacementFordDivId = '{divid}';

var q_template_components = '\n<div id="fm_composite_{id}">\n{components_html}\n</div>';

var UserCompositeControl = function (_UserQuestionBase) {
	_inherits(UserCompositeControl, _UserQuestionBase);

	// list of components
	function UserCompositeControl(qInfo, componentList, handleLowerEvent) {
		_classCallCheck(this, UserCompositeControl);

		var _this = _possibleConstructorReturn(this, (UserCompositeControl.__proto__ || Object.getPrototypeOf(UserCompositeControl)).call(this, qInfo));

		_this._components = componentList;
		_this._handleLowerEvent = handleLowerEvent;
		return _this;
	}

	// Method for validating the result value upon moving away 
	// from the page.


	_createClass(UserCompositeControl, [{
		key: 'onValidating',
		value: function onValidating() {
			var validated = true;
			for (var i = 0; i < this._components.length; i++) {
				if (!this._components[i].onValidating()) {
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

			// we can also listen to the "firt component"'s change event and do things 
			// format the text and reset the display
			if (this._handleLowerEvent) {
				var self = this;
				var selector = '#' + this.myId;
				$(selector).change(function (e) {
					// we are at the top of the food chain
					e.stopPropagation();

					// get the state from the first component and pass it to the reset of the component.
					// other components could choose to handle the state change event of the 1st component.
					self._components[0].serialize();
					var state = self._components[0].qInfo;

					// pass the state down
					self.handlePeerStateChange(state);
				});
			}
		}

		// Handle state-change event triggered by peer component FOR those classes
		// which derives from this class.

	}, {
		key: 'handlePeerStateChange',
		value: function handlePeerStateChange(state) {
			throw new Error('handlePeerStateChange: sub-class-should-overload-this');
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

		// GET the 'index' component id

	}, {
		key: 'getComponentDivId',
		value: function getComponentDivId(index) {
			return 'fm_comp_div_' + this.id + '_' + index;
		}

		// get display html for the copomsite control

	}, {
		key: 'displayHtml',
		get: function get() {
			var componentHtml = '';
			// combine sub-control html into an entire HTML
			for (var i = 0; i < this._components.length; i++) {
				componentHtml += this._components[i].displayHtml;
			}
			var htmlStr = q_template_components.replace(replacementForId, this.id).replace(replacementForComponents, componentHtml);

			return htmlStr;
		}

		// get read-only display html for the copomsite control

	}, {
		key: 'displayHtmlReadOnly',
		get: function get() {
			var componentHtml = '';
			// combine sub-control html into an entire HTML
			for (var i = 0; i < this._components.length; i++) {
				componentHtml += this._components[i].displayHtmlReadOnly;
			}
			var htmlStr = q_template_components.replace(replacementForId, this.id).replace(replacementForComponents, componentHtml);

			return htmlStr;
		}
		// get the div id

	}, {
		key: 'myId',
		get: function get() {
			return 'fm_composite_' + this.id;
		}

		// get question in xml format for saving to API server
		//  note: tag object of a control is : {tag: "str", obj: this._value};

	}, {
		key: 'serverXML',
		get: function get() {
			var tagCounterMap = {};
			var ret = '<qa>\n<id>' + this.id + '</id>';

			// get subcontrol tag
			for (var i = 0; i < this._components.length; i++) {
				var tagObj = this._components[i].xmlElement;
				var element = tagObj.tag;
				if (!tagCounterMap[tagObj.tag]) {
					tagCounterMap[tagObj.tag] = 1;
				} else {
					tagCounterMap[tagObj.tag] = tagCounterMap[tagObj.tag] + 1;
					element = element + tagCounterMap[tagObj.tag];
				}
				ret += '<' + element + '>' + tagObj.obj + '</' + element + '>';
			}

			ret += '</qa>';
			return ret;
		}
	}]);

	return UserCompositeControl;
}(UserQuestionBase);

export { UserCompositeControl };