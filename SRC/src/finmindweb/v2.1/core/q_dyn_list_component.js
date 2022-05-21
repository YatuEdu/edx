var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var replacementForElementColumn = '{elem_clmn_html}';
var replacementForId = '{id}';
var replacementForRemoveBtnClass = '{rmbtnclss}';
var REMOVE_BTN_CLASS = 'fm_wz_btn_clss_remove_one_component';

var q_templete_dyn_list_column = '\n<div id="dynlist_element_row_{id}" class="row g-0 px-3 px-md-0">\n\t{elem_clmn_html}\n</div>\n';

var q_templete_dyn_list_column_ro = '\n<div class="row g-0 px-3 px-md-0">\n\t{elem_clmn_html}\n</div>\n';

var DynamicListElement = function () {
	function DynamicListElement(attrId, componentId) {
		_classCallCheck(this, DynamicListElement);

		this._attrId = attrId;
		this._componentId = componentId;
	}

	/*
 	Abstract methods that need to be overriden
 */

	// get html text 


	_createClass(DynamicListElement, [{
		key: 'v_getHtml',
		value: function v_getHtml() {
			throw new Error('signature: sub-class-should-overload-this');
		}

		// This method is called after the UI is rendered to display its
		// input value (or selection fo check box and radio button and dropdown)

	}, {
		key: 'setDisplayValue',
		value: function setDisplayValue() {
			throw new Error('signature: sub-class-should-overload-this');
		}

		// get the components in xml format for sending to finMind 
		// API server

	}, {
		key: 'subElementId',
		value: function subElementId(n) {
			return 'sub_element_' + n + '_' + this.controlId;
		}

		// get display html for dynamic list

	}, {
		key: 'serverXML',
		get: function get() {
			throw new Error('signature: sub-class-should-overload-this');
		}

		/*
     protected methods
  */

	}, {
		key: 'controlId',
		get: function get() {
			return this._attrId + '_' + this._componentId;
		}
	}, {
		key: 'removeButtonId',
		get: function get() {
			return 'fm_wz_btn_remove_element_' + this.controlId;
		}
	}, {
		key: 'rowId',
		get: function get() {
			return 'dynlist_element_row_' + this.controlId;
		}
	}, {
		key: 'displayHtml',
		get: function get() {
			var htmlStr = q_templete_dyn_list_column.replace(new RegExp(replacementForId, 'g'), this.controlId).replace(replacementForRemoveBtnClass, REMOVE_BTN_CLASS).replace(replacementForElementColumn, this.v_getHtml());
			return htmlStr;
		}

		// get read-only display html for dynamic list

	}, {
		key: 'displayHtmlReadOnly',
		get: function get() {
			var htmlStr = q_templete_dyn_list_column_ro.replace(replacementForElementColumn, this.v_getHtmlReadOnly());
			return htmlStr;
		}
	}]);

	return DynamicListElement;
}();

export { DynamicListElement, REMOVE_BTN_CLASS };