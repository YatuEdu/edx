import _regeneratorRuntime from 'babel-runtime/regenerator';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { UserTextQuestion } from './q_text.js';
import { UserFormatterText } from './q_formatter_text.js';
import { UserIntegerQuestionText } from './q_integer.js';
import { UserDropdownSelection } from './q_dropDown.js';
import { UserCompositeControl } from './q_composite_control.js';
import { UserBeneficiaryControl } from './q_beneficiary.js';
import { UserCompositeControlWithTwoDropdowns } from './q_composite_control_with_two_dropdowns.js';
import { InsuranceInfoComponentDynList } from './q_insuranceInfo_component_dyn_list.js';
import { MetaDataManager } from './metaDataManager.js';
import { StringUtil } from './util.js';
import { Net } from './net.js';
import { credMan } from './credManFinMind.js';

var DEFAULT_NO_BENEFICIARY = 1;
var DEFAULT_NO_CONTINGENT_BENEFICIARY = 0;

/*
	COMPONENT FACTORY FOR text field control
*/

var UIComponentFactory = function () {
	function UIComponentFactory() {
		_classCallCheck(this, UIComponentFactory);
	}

	_createClass(UIComponentFactory, null, [{
		key: 'createTextField',

		/*
  	Create regex powered text input control according to its
  	type.
  */
		value: function createTextField(qInfo) {
			var regex = null;
			var formatter = null;
			var numberOnly = false;

			if (qInfo.attr_name === 'app_email') {
				// email regex
				regex = MetaDataManager.regForeEmail;
			} else if (qInfo.attr_name === 'app_phone') {
				// us phone number regex
				regex = MetaDataManager.regForUSPhoneNumber;
				formatter = StringUtil.formatUSPhoneNumber;
				numberOnly = true;
			} else if (qInfo.attr_name.indexOf('ssn') >= 0) {
				// us ssn regex
				regex = MetaDataManager.regForSSN;
				formatter = StringUtil.formatSocialSecurity;
				numberOnly = true;
			} else {
				// reg for everything
				regex = null;
			}

			if (!formatter) {
				return new UserTextQuestion(qInfo, regex);
			}

			// formatter text input
			return new UserFormatterText(qInfo, numberOnly, regex, formatter);
		}

		/**
  	A composition control consists of two or more instances of defined 'UserQuestionBase' object
  **/

	}, {
		key: 'createCompositionControl',
		value: function createCompositionControl(qInfo) {
			// multiple labels extraction:
			var labels = qInfo.attr_label.split('*');

			// composite control for driver lic - state
			if (qInfo.attr_name === 'app_driver_lic') {
				var components = [];

				// create lic text input:
				//		partial qinfo contains label is enough because it is a sub-control
				var subqInfo = { attr_id: qInfo.attr_id, attr_label: labels[0], sv1: qInfo.sv1 };
				var regex = MetaDataManager.regForEverything;
				var com1 = new UserTextQuestion(subqInfo, regex);
				components.push(com1);

				// create state drop down list:
				//		partial qinfo contains label is enough because it is a sub-control
				var STATE_ENUM_ID = 26;
				var subqInfo2 = { attr_id: qInfo.attr_id, attr_label: labels[1], sv1: qInfo.sv2 };
				var com2 = new UserDropdownSelection(subqInfo2, MetaDataManager.enumMap.get(STATE_ENUM_ID), true);
				components.push(com2);

				// now create composite control
				return new UserCompositeControl(qInfo, components);
			}

			// composite control for birth contry - state if us
			if (qInfo.attr_name === 'app_country_of_birth') {
				var _components = [];

				// create lic text input:
				//		partial qinfo contains label is enough because it is a sub-control
				var _subqInfo = { attr_id: qInfo.attr_id, attr_label: labels[0], sv1: qInfo.sv1 };
				var _regex = MetaDataManager.regForEverything;
				var COUNTRY_ENUM_ID = 30;
				var _com = new UserDropdownSelection(_subqInfo, MetaDataManager.enumMap.get(COUNTRY_ENUM_ID), 0);
				_components.push(_com);

				// create state drop down list:
				//		partial qinfo contains label is enough because it is a sub-control
				// Note: since the 2nd DROPDOWN LIST has the same attribute id and this will not work.  We 
				//       append an extra index number at the end (_2)
				var _subqInfo2 = { attr_id: qInfo.attr_id + "_2", attr_label: labels[1], sv1: qInfo.sv2 };
				var _STATE_ENUM_ID = 26;
				var _com2 = new UserDropdownSelection(_subqInfo2, MetaDataManager.enumMap.get(_STATE_ENUM_ID), 1);
				_components.push(_com2);

				// now create composite control
				return new UserCompositeControlWithTwoDropdowns(qInfo, _components, 'United States');
			}

			// composite control for 'employment"
			if (qInfo.attr_name === 'app_employment') {
				var _components2 = [];

				// create empolyer input:
				//		partial qinfo contains label is enough because it is a sub-control
				var _subqInfo3 = { attr_id: qInfo.attr_id, attr_label: labels[0], sv1: qInfo.sv1 };
				var _regex2 = null;
				var _com3 = new UserTextQuestion(_subqInfo3, _regex2);
				_components2.push(_com3);

				// create duty:
				//		partial qinfo contains label is enough because it is a sub-control
				// Note: since the 2nd text field has the same attribute id and this will not work.  We 
				//       append an extra index number at the end (_2)			
				var _subqInfo4 = { attr_id: qInfo.attr_id + "_2", attr_label: labels[1], sv1: qInfo.sv2 };
				var _com4 = new UserTextQuestion(_subqInfo4, _regex2);
				_components2.push(_com4);

				// now create composite control
				return new UserCompositeControl(qInfo, _components2);
			}

			// composite control for 'employment details"
			if (qInfo.attr_name === 'app_employment_details') {
				var _components3 = [];

				// create empolyer input:
				//		partial qinfo contains label is enough because it is a sub-control
				var _subqInfo5 = { attr_id: qInfo.attr_id, attr_label: labels[0], sv1: qInfo.sv1 };
				var _regex3 = null;
				var _com5 = new UserTextQuestion(_subqInfo5, _regex3);
				_components3.push(_com5);

				// create duty:
				//		partial qinfo contains label is enough because it is a sub-control
				// Note: since the 2nd text field has the same attribute id and this will not work.  We 
				//       append an extra index number at the end (_2)
				var _subqInfo6 = { attr_id: qInfo.attr_id + "_2", attr_label: labels[1], sv1: qInfo.sv2 };
				var _com6 = new UserTextQuestion(_subqInfo6, _regex3);
				_components3.push(_com6);

				// now create composite control
				return new UserCompositeControl(qInfo, _components3);
			}
		}

		/*
  	Create beneficary complex control 
  */

	}, {
		key: 'createBeneficiaryControl',
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(appId, qInfo, isContingent) {
				var beneficiaryList, minimum, defaultNo;
				return _regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:

								// get benificary info from server
								beneficiaryList = null;
								minimum = 1;
								defaultNo = DEFAULT_NO_BENEFICIARY;

								if (!isContingent) {
									_context.next = 11;
									break;
								}

								minimum = 0;
								defaultNo = DEFAULT_NO_CONTINGENT_BENEFICIARY;
								_context.next = 8;
								return Net.getContingentBeneficiaryInfo(appId, credMan.credential.token);

							case 8:
								beneficiaryList = _context.sent;
								_context.next = 14;
								break;

							case 11:
								_context.next = 13;
								return Net.getBeneficiaryInfo(appId, credMan.credential.token);

							case 13:
								beneficiaryList = _context.sent;

							case 14:
								return _context.abrupt('return', new UserBeneficiaryControl(qInfo, beneficiaryList.data, defaultNo, minimum));

							case 15:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function createBeneficiaryControl(_x, _x2, _x3) {
				return _ref.apply(this, arguments);
			}

			return createBeneficiaryControl;
		}()

		/*
  	Create Existing Isurance Composite Control
  */

	}, {
		key: 'createExistingIsuranceControl',
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(appId, qInfo) {
				var insList;
				return _regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return Net.getEixstingInsuranceInfo(appId, credMan.credential.token);

							case 2:
								insList = _context2.sent;
								return _context2.abrupt('return', new InsuranceInfoComponentDynList(qInfo, insList.data, 1, 0, ['Name', 'Policy Number', 'Replace', 'Action']));

							case 4:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function createExistingIsuranceControl(_x4, _x5) {
				return _ref2.apply(this, arguments);
			}

			return createExistingIsuranceControl;
		}()
	}]);

	return UIComponentFactory;
}();

export { UIComponentFactory };