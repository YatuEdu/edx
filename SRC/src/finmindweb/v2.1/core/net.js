import _regeneratorRuntime from 'babel-runtime/regenerator';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { sysConstants } from './sysConst.js';

var API_FOR_BENEFICIARY_INFO = 2021819;
var API_FOR_CONTINGENT_BENEFICIARY_INFO = 2021821;
var API_FOR_FILE_UPLOAD = 2021818;
var API_FOR_MESSAGE_RETRIEVAL = 2021823;
var API_FOR_MESSAGE_SENDING = 2021824;
var API_FOR_PIPELINE_BLOCKS = 2021829;
var API_FOR_GETTING_QA_IN_BLOCK = 2021830;
var API_FOR_SIGN_IN_WITH_EMAIL = 2021830;
var API_FOR_SIGN_IN_WITH_NAME = 202102;
var API_FOR_BEST_PREMIUM_QUOTE = 2021809;

var FILE_UPLOAD_OP = 1;
var FILE_LIST_OP = 2;
var FILE_DOWNLOAD_OP = 3;
var FILE_DELETE_OP = 4;

var EMPTY_FILE_NAME = '';

var Net = function () {
	function Net() {
		_classCallCheck(this, Net);
	}

	_createClass(Net, null, [{
		key: 'login',

		/**
  	FinMind API for user-login
  **/
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(userName, userPassword) {
				var req;
				return _regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								req = Net.composeRequestDataForLogin_private(userName, userPassword);
								// remote call

								_context.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context.abrupt('return', _context.sent);

							case 4:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function login(_x, _x2) {
				return _ref.apply(this, arguments);
			}

			return login;
		}()
	}, {
		key: 'loginWithEmail',
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(email, userPassword) {
				var req;
				return _regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								req = Net.composeRequestDataForLoginWithEmail_private(email, userPassword);
								// remote call

								_context2.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context2.abrupt('return', _context2.sent);

							case 4:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function loginWithEmail(_x3, _x4) {
				return _ref2.apply(this, arguments);
			}

			return loginWithEmail;
		}()

		/**
  	FinMind API for registering a new user
  **/

	}, {
		key: 'signUp',
		value: function () {
			var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(userFirstName, userMiddleName, userLastName, email, userPassword) {
				var req;
				return _regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								req = Net.composeRequestDataForSignUp_private(userFirstName, userMiddleName, userLastName, email, userPassword);
								// remote call

								_context3.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context3.abrupt('return', _context3.sent);

							case 4:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function signUp(_x5, _x6, _x7, _x8, _x9) {
				return _ref3.apply(this, arguments);
			}

			return signUp;
		}()

		/**
  	FinMind API for user sign-out
  **/

	}, {
		key: 'signOut',
		value: function () {
			var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(token) {
				var req;
				return _regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								req = Net.composeRequestDataForSignOut_private(token);
								// remote call

								_context4.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context4.abrupt('return', _context4.sent);

							case 4:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function signOut(_x10) {
				return _ref4.apply(this, arguments);
			}

			return signOut;
		}()

		/**
  	FinMind API for starting an application for a product id
  **/

	}, {
		key: 'startAplication',
		value: function () {
			var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(prodId, token) {
				var req;
				return _regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								req = Net.composeRequestDataForStartAplication_private(prodId, token);
								// remote call

								_context5.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context5.abrupt('return', _context5.sent);

							case 4:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this);
			}));

			function startAplication(_x11, _x12) {
				return _ref5.apply(this, arguments);
			}

			return startAplication;
		}()

		/**
  	FinMind API for getting a block of user-questions
  **/

	}, {
		key: 'getBlockQuestions',
		value: function () {
			var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(appId, token) {
				var req;
				return _regeneratorRuntime.wrap(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								req = Net.composeRequestDataForUserQuestionBlock_private(appId, token);
								// remote call

								_context6.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context6.abrupt('return', _context6.sent);

							case 4:
							case 'end':
								return _context6.stop();
						}
					}
				}, _callee6, this);
			}));

			function getBlockQuestions(_x13, _x14) {
				return _ref6.apply(this, arguments);
			}

			return getBlockQuestions;
		}()

		/**
  	FinMind API for getting basic info for a block
  **/

	}, {
		key: 'getBlockInfo',
		value: function () {
			var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(blockId) {
				var req, res;
				return _regeneratorRuntime.wrap(function _callee7$(_context7) {
					while (1) {
						switch (_context7.prev = _context7.next) {
							case 0:
								req = Net.composeRequestDataForBlockInfo_private(blockId);
								// remote call

								_context7.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								res = _context7.sent;

								if (!res.error) {
									_context7.next = 8;
									break;
								}

								return _context7.abrupt('return', { error: res.error });

							case 8:
								return _context7.abrupt('return', {
									blockName: res.data[0].name,
									blockDescription: res.data[0].description,
									blockNote: res.data[0].note
								});

							case 9:
							case 'end':
								return _context7.stop();
						}
					}
				}, _callee7, this);
			}));

			function getBlockInfo(_x15) {
				return _ref7.apply(this, arguments);
			}

			return getBlockInfo;
		}()

		/**
  	FinMind API for getting app beneficiary 
  **/

	}, {
		key: 'getBeneficiaryInfo',
		value: function () {
			var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(appId, token) {
				var req;
				return _regeneratorRuntime.wrap(function _callee8$(_context8) {
					while (1) {
						switch (_context8.prev = _context8.next) {
							case 0:
								req = Net.composeRequestDataForAppBeneficiaryInfo_private(appId, token, API_FOR_BENEFICIARY_INFO);
								// remote call

								_context8.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context8.abrupt('return', _context8.sent);

							case 4:
							case 'end':
								return _context8.stop();
						}
					}
				}, _callee8, this);
			}));

			function getBeneficiaryInfo(_x16, _x17) {
				return _ref8.apply(this, arguments);
			}

			return getBeneficiaryInfo;
		}()

		/**
  	FinMind API for getting app CONTINGENT beneficiary INFO
  **/

	}, {
		key: 'getContingentBeneficiaryInfo',
		value: function () {
			var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(appId, token) {
				var req;
				return _regeneratorRuntime.wrap(function _callee9$(_context9) {
					while (1) {
						switch (_context9.prev = _context9.next) {
							case 0:
								req = Net.composeRequestDataForAppBeneficiaryInfo_private(appId, token, API_FOR_CONTINGENT_BENEFICIARY_INFO);
								// remote call

								_context9.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context9.abrupt('return', _context9.sent);

							case 4:
							case 'end':
								return _context9.stop();
						}
					}
				}, _callee9, this);
			}));

			function getContingentBeneficiaryInfo(_x18, _x19) {
				return _ref9.apply(this, arguments);
			}

			return getContingentBeneficiaryInfo;
		}()

		/**
  	FinMind API for getting app existing isurance
  **/

	}, {
		key: 'getEixstingInsuranceInfo',
		value: function () {
			var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(appId, token) {
				var req;
				return _regeneratorRuntime.wrap(function _callee10$(_context10) {
					while (1) {
						switch (_context10.prev = _context10.next) {
							case 0:
								req = Net.composeRequestDataForAppEixstingInsuranceInfo_private(appId, token);
								// remote call

								_context10.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context10.abrupt('return', _context10.sent);

							case 4:
							case 'end':
								return _context10.stop();
						}
					}
				}, _callee10, this);
			}));

			function getEixstingInsuranceInfo(_x20, _x21) {
				return _ref10.apply(this, arguments);
			}

			return getEixstingInsuranceInfo;
		}()

		/**
  	FinMind API for getting all block ids for all the answered questions 
  	for an application for a given user
  **/

	}, {
		key: 'getAppPipelineBlocks',
		value: function () {
			var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11(appId, token) {
				var req;
				return _regeneratorRuntime.wrap(function _callee11$(_context11) {
					while (1) {
						switch (_context11.prev = _context11.next) {
							case 0:
								req = Net.composeRequestDataForAppPipelineBlocks_private(appId, token);
								// remote call

								_context11.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context11.abrupt('return', _context11.sent);

							case 4:
							case 'end':
								return _context11.stop();
						}
					}
				}, _callee11, this);
			}));

			function getAppPipelineBlocks(_x22, _x23) {
				return _ref11.apply(this, arguments);
			}

			return getAppPipelineBlocks;
		}()

		/**
  	FinMind API for getting all the answered questions 
  	for a given pipeline block of an application for a given user
  **/

	}, {
		key: 'getQAForBlockOfApp',
		value: function () {
			var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee12(appId, blockId, token) {
				var req;
				return _regeneratorRuntime.wrap(function _callee12$(_context12) {
					while (1) {
						switch (_context12.prev = _context12.next) {
							case 0:
								req = Net.composeRequestDataForGettingQAForABlock_private(appId, blockId, token);
								// remote call

								_context12.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context12.abrupt('return', _context12.sent);

							case 4:
							case 'end':
								return _context12.stop();
						}
					}
				}, _callee12, this);
			}));

			function getQAForBlockOfApp(_x24, _x25, _x26) {
				return _ref12.apply(this, arguments);
			}

			return getQAForBlockOfApp;
		}()

		/**
  	FinMind API for saving a block of user-questions-answerws
  **/

	}, {
		key: 'saveBlockQuestions',
		value: function () {
			var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee13(appId, blckId, questions, token) {
				var req;
				return _regeneratorRuntime.wrap(function _callee13$(_context13) {
					while (1) {
						switch (_context13.prev = _context13.next) {
							case 0:
								req = Net.composeRequestDataForSavingUserQuestionBlock_private(appId, blckId, questions, token);
								// remote call

								_context13.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context13.abrupt('return', _context13.sent);

							case 4:
							case 'end':
								return _context13.stop();
						}
					}
				}, _callee13, this);
			}));

			function saveBlockQuestions(_x27, _x28, _x29, _x30) {
				return _ref13.apply(this, arguments);
			}

			return saveBlockQuestions;
		}()

		/**
  	FinMind API for getting the next block of user-questions for anonymous user
  **/

	}, {
		key: 'getWizardQuestions',
		value: function () {
			var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee14(prodId, blckId) {
				var req;
				return _regeneratorRuntime.wrap(function _callee14$(_context14) {
					while (1) {
						switch (_context14.prev = _context14.next) {
							case 0:
								req = Net.composeRequestDataForNextWizardBlock_private(prodId, blckId);
								// remote call

								_context14.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context14.abrupt('return', _context14.sent);

							case 4:
							case 'end':
								return _context14.stop();
						}
					}
				}, _callee14, this);
			}));

			function getWizardQuestions(_x31, _x32) {
				return _ref14.apply(this, arguments);
			}

			return getWizardQuestions;
		}()

		/**
  	FinMind API for updating block branching information
  **/

	}, {
		key: 'agentUpdateBlockBranchingConditions',
		value: function () {
			var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee15(token, blockId, xml) {
				var req;
				return _regeneratorRuntime.wrap(function _callee15$(_context15) {
					while (1) {
						switch (_context15.prev = _context15.next) {
							case 0:
								req = Net.composeRequestDataForUpdateBlockBranchingConditions_private(token, blockId, xml);
								// remote call

								_context15.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context15.abrupt('return', _context15.sent);

							case 4:
							case 'end':
								return _context15.stop();
						}
					}
				}, _callee15, this);
			}));

			function agentUpdateBlockBranchingConditions(_x33, _x34, _x35) {
				return _ref15.apply(this, arguments);
			}

			return agentUpdateBlockBranchingConditions;
		}()

		/**
  	FinMind API for getting a QUOTE premium 
  **/

	}, {
		key: 'getPremiumQuote',
		value: function () {
			var _ref16 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee16(xml, token) {
				var req;
				return _regeneratorRuntime.wrap(function _callee16$(_context16) {
					while (1) {
						switch (_context16.prev = _context16.next) {
							case 0:
								req = Net.composeRequestDataForGetPremiumQuote_private(xml, token);
								// remote call

								_context16.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context16.abrupt('return', _context16.sent);

							case 4:
							case 'end':
								return _context16.stop();
						}
					}
				}, _callee16, this);
			}));

			function getPremiumQuote(_x36, _x37) {
				return _ref16.apply(this, arguments);
			}

			return getPremiumQuote;
		}()

		/**
  	Yatu API for user-token validness check.
  	Warning: do not call too often
  **/

	}, {
		key: 'tokenCheck',
		value: function () {
			var _ref17 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee17(token) {
				var req;
				return _regeneratorRuntime.wrap(function _callee17$(_context17) {
					while (1) {
						switch (_context17.prev = _context17.next) {
							case 0:
								req = Net.composeRequestDataForTokenCheck_private(token);
								// remote call

								_context17.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context17.abrupt('return', _context17.sent);

							case 4:
							case 'end':
								return _context17.stop();
						}
					}
				}, _callee17, this);
			}));

			function tokenCheck(_x38) {
				return _ref17.apply(this, arguments);
			}

			return tokenCheck;
		}()

		/**
   *  API for file uploading
   *	operation:
   *     1 upload
   *     2 list
   *     3 download
   *     4 delete
   */

	}, {
		key: 'fileUpload',
		value: function () {
			var _ref18 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee18(t, uploadFileName, pipleLineKey, appKey, conversationKey) {
				var req;
				return _regeneratorRuntime.wrap(function _callee18$(_context18) {
					while (1) {
						switch (_context18.prev = _context18.next) {
							case 0:
								req = Net.composeRequestDataForFileOperation_private(t, uploadFileName, pipleLineKey, appKey, conversationKey, FILE_UPLOAD_OP, 0);
								// remote call

								_context18.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context18.abrupt('return', _context18.sent);

							case 4:
							case 'end':
								return _context18.stop();
						}
					}
				}, _callee18, this);
			}));

			function fileUpload(_x39, _x40, _x41, _x42, _x43) {
				return _ref18.apply(this, arguments);
			}

			return fileUpload;
		}()

		/**
   *  API for file listing
   *	operation:
   *     1 upload
   *     2 list
   *     3 download
   *     4 delete
   */

	}, {
		key: 'getUploadedFiles',
		value: function () {
			var _ref19 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee19(t, pipleLineKey, appKey, conversationKey) {
				var req;
				return _regeneratorRuntime.wrap(function _callee19$(_context19) {
					while (1) {
						switch (_context19.prev = _context19.next) {
							case 0:
								req = Net.composeRequestDataForFileOperation_private(t, EMPTY_FILE_NAME, pipleLineKey, appKey, conversationKey, FILE_LIST_OP, 0);
								// remote call

								_context19.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context19.abrupt('return', _context19.sent);

							case 4:
							case 'end':
								return _context19.stop();
						}
					}
				}, _callee19, this);
			}));

			function getUploadedFiles(_x44, _x45, _x46, _x47) {
				return _ref19.apply(this, arguments);
			}

			return getUploadedFiles;
		}()

		/**
   *  API for file removal
   *	operation:
   *     1 upload
   *     2 list
   *     3 download
   *     4 delete
   */

	}, {
		key: 'deleteUploadedFiles',
		value: function () {
			var _ref20 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee20(t, uploadFileName, pipleLineKey, appKey, conversationKey) {
				var req;
				return _regeneratorRuntime.wrap(function _callee20$(_context20) {
					while (1) {
						switch (_context20.prev = _context20.next) {
							case 0:
								req = Net.composeRequestDataForFileOperation_private(t, uploadFileName, pipleLineKey, appKey, conversationKey, FILE_DELETE_OP);
								// remote call

								_context20.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context20.abrupt('return', _context20.sent);

							case 4:
							case 'end':
								return _context20.stop();
						}
					}
				}, _callee20, this);
			}));

			function deleteUploadedFiles(_x48, _x49, _x50, _x51, _x52) {
				return _ref20.apply(this, arguments);
			}

			return deleteUploadedFiles;
		}()

		/**
   *  API for file downloading
   *	operation:
   *     1 upload
   *     2 list
   *     3 download
   *     4 delete
   */

	}, {
		key: 'downloadUploadedFiles',
		value: function () {
			var _ref21 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee21(t, uploadFileName, pipleLineKey, appKey, conversationKey) {
				var req;
				return _regeneratorRuntime.wrap(function _callee21$(_context21) {
					while (1) {
						switch (_context21.prev = _context21.next) {
							case 0:
								req = Net.composeRequestDataForFileOperation_private(t, uploadFileName, pipleLineKey, appKey, conversationKey, FILE_DOWNLOAD_OP);
								// remote call

								_context21.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context21.abrupt('return', _context21.sent);

							case 4:
							case 'end':
								return _context21.stop();
						}
					}
				}, _callee21, this);
			}));

			function downloadUploadedFiles(_x53, _x54, _x55, _x56, _x57) {
				return _ref21.apply(this, arguments);
			}

			return downloadUploadedFiles;
		}()

		/**
  	FinMind API for Best premium 
  **/

	}, {
		key: 'getBestPremium',
		value: function () {
			var _ref22 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee22(quoteXML) {
				var req;
				return _regeneratorRuntime.wrap(function _callee22$(_context22) {
					while (1) {
						switch (_context22.prev = _context22.next) {
							case 0:
								req = Net.composeRequestDataForBestPremium_private(quoteXML, API_FOR_BEST_PREMIUM_QUOTE);
								// remote call

								_context22.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context22.abrupt('return', _context22.sent);

							case 4:
							case 'end':
								return _context22.stop();
						}
					}
				}, _callee22, this);
			}));

			function getBestPremium(_x58) {
				return _ref22.apply(this, arguments);
			}

			return getBestPremium;
		}()

		/**
  	FinMind API for getting all messages 
  **/

	}, {
		key: 'getMessages',
		value: function () {
			var _ref23 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee23(appId, token) {
				var req;
				return _regeneratorRuntime.wrap(function _callee23$(_context23) {
					while (1) {
						switch (_context23.prev = _context23.next) {
							case 0:
								req = Net.composeRequestDataForGetMessages_private(appId, token, API_FOR_MESSAGE_RETRIEVAL);
								// remote call

								_context23.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context23.abrupt('return', _context23.sent);

							case 4:
							case 'end':
								return _context23.stop();
						}
					}
				}, _callee23, this);
			}));

			function getMessages(_x59, _x60) {
				return _ref23.apply(this, arguments);
			}

			return getMessages;
		}()

		/**
  	FinMind API for sending a message 
  **/

	}, {
		key: 'sendMessages',
		value: function () {
			var _ref24 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee24(appId, type, msg, token) {
				var req;
				return _regeneratorRuntime.wrap(function _callee24$(_context24) {
					while (1) {
						switch (_context24.prev = _context24.next) {
							case 0:
								req = Net.composeRequestDataForSendingMessages_private(appId, token, type, msg, API_FOR_MESSAGE_SENDING);
								// remote call

								_context24.next = 3;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 3:
								return _context24.abrupt('return', _context24.sent);

							case 4:
							case 'end':
								return _context24.stop();
						}
					}
				}, _callee24, this);
			}));

			function sendMessages(_x61, _x62, _x63, _x64) {
				return _ref24.apply(this, arguments);
			}

			return sendMessages;
		}()

		/**
   FinMind API for user to get own applications
   **/

	}, {
		key: 'getApplications',
		value: function () {
			var _ref25 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee25(token, pageSize, pageNo, searchBy) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee25$(_context25) {
					while (1) {
						switch (_context25.prev = _context25.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021836
									},
									data: {
										pageSize: pageSize,
										pageNo: pageNo,
										searchBy: searchBy
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context25.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context25.abrupt('return', _context25.sent);

							case 5:
							case 'end':
								return _context25.stop();
						}
					}
				}, _callee25, this);
			}));

			function getApplications(_x65, _x66, _x67, _x68) {
				return _ref25.apply(this, arguments);
			}

			return getApplications;
		}()

		/**
   FinMind API for agent to get applications
   **/

	}, {
		key: 'getApplications',
		value: function () {
			var _ref26 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee26(token, appStatus, pageSize, pageNo, searchBy, orderBy) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee26$(_context26) {
					while (1) {
						switch (_context26.prev = _context26.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021836
									},
									data: {
										appStatus: appStatus,
										pageSize: pageSize,
										pageNo: pageNo,
										searchBy: searchBy,
										orderBy: orderBy
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context26.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context26.abrupt('return', _context26.sent);

							case 5:
							case 'end':
								return _context26.stop();
						}
					}
				}, _callee26, this);
			}));

			function getApplications(_x69, _x70, _x71, _x72, _x73, _x74) {
				return _ref26.apply(this, arguments);
			}

			return getApplications;
		}()

		/**
   FinMind API for agent to get clients
   **/

	}, {
		key: 'getClients',
		value: function () {
			var _ref27 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee27(token, pageSize, pageNo, searchBy) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee27$(_context27) {
					while (1) {
						switch (_context27.prev = _context27.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021837
									},
									data: {
										pageSize: pageSize,
										pageNo: pageNo,
										name: searchBy
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context27.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context27.abrupt('return', _context27.sent);

							case 5:
							case 'end':
								return _context27.stop();
						}
					}
				}, _callee27, this);
			}));

			function getClients(_x75, _x76, _x77, _x78) {
				return _ref27.apply(this, arguments);
			}

			return getClients;
		}()

		/**
   FinMind API for user to get applications
   **/

	}, {
		key: 'getMyApplications',
		value: function () {
			var _ref28 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee28(token, pageSize, pageNo, searchBy) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee28$(_context28) {
					while (1) {
						switch (_context28.prev = _context28.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021835
									},
									data: {
										"name": searchBy,
										"pageSize": pageSize,
										"pageNo": pageNo
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context28.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context28.abrupt('return', _context28.sent);

							case 5:
							case 'end':
								return _context28.stop();
						}
					}
				}, _callee28, this);
			}));

			function getMyApplications(_x79, _x80, _x81, _x82) {
				return _ref28.apply(this, arguments);
			}

			return getMyApplications;
		}()

		/**
   FinMind API for user to get profile
   **/

	}, {
		key: 'getMyProfile',
		value: function () {
			var _ref29 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee29(token) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee29$(_context29) {
					while (1) {
						switch (_context29.prev = _context29.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021838
									},
									data: {}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context29.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context29.abrupt('return', _context29.sent);

							case 5:
							case 'end':
								return _context29.stop();
						}
					}
				}, _callee29, this);
			}));

			function getMyProfile(_x83) {
				return _ref29.apply(this, arguments);
			}

			return getMyProfile;
		}()

		/**
   FinMind API for user to save profile
   **/

	}, {
		key: 'updateMyProfile',
		value: function () {
			var _ref30 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee30(token, email, phone_number, first_name, middle_name, last_name, birthday, gender, address1, address2, city, state, zip_code, license_issue_state, license_expire_date, license_number) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee30$(_context30) {
					while (1) {
						switch (_context30.prev = _context30.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021839
									},
									data: {
										email: email,
										phone_number: phone_number,
										first_name: first_name,
										middle_name: middle_name,
										last_name: last_name,
										birthday: birthday,
										gender: gender,
										address1: address1,
										address2: address2,
										city: city,
										state: state,
										zip_code: zip_code,
										license_issue_state: license_issue_state,
										license_expire_date: license_expire_date,
										license_number: license_number
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context30.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context30.abrupt('return', _context30.sent);

							case 5:
							case 'end':
								return _context30.stop();
						}
					}
				}, _callee30, this);
			}));

			function updateMyProfile(_x84, _x85, _x86, _x87, _x88, _x89, _x90, _x91, _x92, _x93, _x94, _x95, _x96, _x97, _x98, _x99) {
				return _ref30.apply(this, arguments);
			}

			return updateMyProfile;
		}()

		/**
   FinMind API for user to get application info
   **/

	}, {
		key: 'getApplicationInfo',
		value: function () {
			var _ref31 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee31(appId, token) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee31$(_context31) {
					while (1) {
						switch (_context31.prev = _context31.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021840
									},
									data: {
										appId: appId
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context31.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context31.abrupt('return', _context31.sent);

							case 5:
							case 'end':
								return _context31.stop();
						}
					}
				}, _callee31, this);
			}));

			function getApplicationInfo(_x100, _x101) {
				return _ref31.apply(this, arguments);
			}

			return getApplicationInfo;
		}()

		/**
   FinMind API for agent to get clients
   **/

	}, {
		key: 'getPeoples',
		value: function () {
			var _ref32 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee32(token, pageSize, pageNo, searchBy) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee32$(_context32) {
					while (1) {
						switch (_context32.prev = _context32.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021842
									},
									data: {
										pageSize: pageSize,
										pageNo: pageNo,
										name: searchBy
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context32.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context32.abrupt('return', _context32.sent);

							case 5:
							case 'end':
								return _context32.stop();
						}
					}
				}, _callee32, this);
			}));

			function getPeoples(_x102, _x103, _x104, _x105) {
				return _ref32.apply(this, arguments);
			}

			return getPeoples;
		}()

		/**
   FinMind API for agent to get applications
   **/

	}, {
		key: 'getAllApplications',
		value: function () {
			var _ref33 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee33(token, appStatus, pageSize, pageNo, searchBy, orderBy) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee33$(_context33) {
					while (1) {
						switch (_context33.prev = _context33.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021841
									},
									data: {
										appStatus: appStatus,
										pageSize: pageSize,
										pageNo: pageNo,
										searchBy: searchBy,
										orderBy: orderBy
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context33.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context33.abrupt('return', _context33.sent);

							case 5:
							case 'end':
								return _context33.stop();
						}
					}
				}, _callee33, this);
			}));

			function getAllApplications(_x106, _x107, _x108, _x109, _x110, _x111) {
				return _ref33.apply(this, arguments);
			}

			return getAllApplications;
		}()

		/**
   FinMind API for agent to get applications
   **/

	}, {
		key: 'agentClientUpdate',
		value: function () {
			var _ref34 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee34(token, clientId, quickNote) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee34$(_context34) {
					while (1) {
						switch (_context34.prev = _context34.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021843
									},
									data: {
										clientId: clientId,
										quickNote: quickNote
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context34.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context34.abrupt('return', _context34.sent);

							case 5:
							case 'end':
								return _context34.stop();
						}
					}
				}, _callee34, this);
			}));

			function agentClientUpdate(_x112, _x113, _x114) {
				return _ref34.apply(this, arguments);
			}

			return agentClientUpdate;
		}()

		/**
   FinMind API for before upload file
   **/

	}, {
		key: 'beforeUploadFile',
		value: function () {
			var _ref35 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee35(token, uploadFileName) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee35$(_context35) {
					while (1) {
						switch (_context35.prev = _context35.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021818
									},
									data: {
										pipelineKey: "",
										applicationKey: "",
										conversationKey: "",
										fileName: uploadFileName,
										operationType: 1,
										userOpSelfFile: 1
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context35.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context35.abrupt('return', _context35.sent);

							case 5:
							case 'end':
								return _context35.stop();
						}
					}
				}, _callee35, this);
			}));

			function beforeUploadFile(_x115, _x116) {
				return _ref35.apply(this, arguments);
			}

			return beforeUploadFile;
		}()

		/**
   FinMind API for list upload file
   **/

	}, {
		key: 'listUploadFile',
		value: function () {
			var _ref36 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee36(token, uploadFileName) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee36$(_context36) {
					while (1) {
						switch (_context36.prev = _context36.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021818
									},
									data: {
										pipelineKey: "",
										applicationKey: "",
										conversationKey: "",
										fileName: uploadFileName,
										operationType: 2,
										userOpSelfFile: 1
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context36.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context36.abrupt('return', _context36.sent);

							case 5:
							case 'end':
								return _context36.stop();
						}
					}
				}, _callee36, this);
			}));

			function listUploadFile(_x117, _x118) {
				return _ref36.apply(this, arguments);
			}

			return listUploadFile;
		}()

		/**
   FinMind API for download file
   **/

	}, {
		key: 'downloadFile',
		value: function () {
			var _ref37 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee37(token, fileName) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee37$(_context37) {
					while (1) {
						switch (_context37.prev = _context37.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021818
									},
									data: {
										pipelineKey: "",
										applicationKey: "",
										conversationKey: "",
										fileName: fileName,
										operationType: 3,
										userOpSelfFile: 1
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context37.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context37.abrupt('return', _context37.sent);

							case 5:
							case 'end':
								return _context37.stop();
						}
					}
				}, _callee37, this);
			}));

			function downloadFile(_x119, _x120) {
				return _ref37.apply(this, arguments);
			}

			return downloadFile;
		}()

		/**
   FinMind API for delete file
   **/

	}, {
		key: 'deleteFile',
		value: function () {
			var _ref38 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee38(token, fileName) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee38$(_context38) {
					while (1) {
						switch (_context38.prev = _context38.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021818
									},
									data: {
										pipelineKey: "",
										applicationKey: "",
										conversationKey: "",
										fileName: fileName,
										operationType: 4,
										userOpSelfFile: 1
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context38.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context38.abrupt('return', _context38.sent);

							case 5:
							case 'end':
								return _context38.stop();
						}
					}
				}, _callee38, this);
			}));

			function deleteFile(_x121, _x122) {
				return _ref38.apply(this, arguments);
			}

			return deleteFile;
		}()

		/**
   FinMind API for delete file
   **/

	}, {
		key: 'getProductList',
		value: function () {
			var _ref39 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee39(token, fileName) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee39$(_context39) {
					while (1) {
						switch (_context39.prev = _context39.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021844
									},
									data: {}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context39.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context39.abrupt('return', _context39.sent);

							case 5:
							case 'end':
								return _context39.stop();
						}
					}
				}, _callee39, this);
			}));

			function getProductList(_x123, _x124) {
				return _ref39.apply(this, arguments);
			}

			return getProductList;
		}()

		/**
   FinMind API for create insurance policy
   **/

	}, {
		key: 'insurancePolicyAdd',
		value: function () {
			var _ref40 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee40(token, productId, clientId, insuredName, coverageAmount, effectiveDate, status) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee40$(_context40) {
					while (1) {
						switch (_context40.prev = _context40.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021846
									},
									data: {
										productId: productId,
										clientId: clientId,
										insuredName: insuredName,
										coverageAmount: coverageAmount,
										effectiveDate: effectiveDate,
										status: status
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context40.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context40.abrupt('return', _context40.sent);

							case 5:
							case 'end':
								return _context40.stop();
						}
					}
				}, _callee40, this);
			}));

			function insurancePolicyAdd(_x125, _x126, _x127, _x128, _x129, _x130, _x131) {
				return _ref40.apply(this, arguments);
			}

			return insurancePolicyAdd;
		}()

		/**
   FinMind API for create insurance policy
   **/

	}, {
		key: 'insurancePolicyList',
		value: function () {
			var _ref41 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee41(token, pageSize, pageNo, name) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee41$(_context41) {
					while (1) {
						switch (_context41.prev = _context41.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021845
									},
									data: {
										name: name,
										pageSize: pageSize,
										pageNo: pageNo
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context41.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context41.abrupt('return', _context41.sent);

							case 5:
							case 'end':
								return _context41.stop();
						}
					}
				}, _callee41, this);
			}));

			function insurancePolicyList(_x132, _x133, _x134, _x135) {
				return _ref41.apply(this, arguments);
			}

			return insurancePolicyList;
		}()

		/**
   FinMind API for add insurance policy file
   **/

	}, {
		key: 'insurancePolicyFileAdd',
		value: function () {
			var _ref42 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee42(token, policyId, fileName, fileSize, fileNameUn) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee42$(_context42) {
					while (1) {
						switch (_context42.prev = _context42.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021848
									},
									data: {
										policyId: policyId,
										fileName: fileName,
										fileSize: fileSize,
										fileNameUn: fileNameUn
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context42.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context42.abrupt('return', _context42.sent);

							case 5:
							case 'end':
								return _context42.stop();
						}
					}
				}, _callee42, this);
			}));

			function insurancePolicyFileAdd(_x136, _x137, _x138, _x139, _x140) {
				return _ref42.apply(this, arguments);
			}

			return insurancePolicyFileAdd;
		}()

		/**
   FinMind API for list insurance policy file
   **/

	}, {
		key: 'insurancePolicyFileList',
		value: function () {
			var _ref43 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee43(token, policyId) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee43$(_context43) {
					while (1) {
						switch (_context43.prev = _context43.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021852
									},
									data: {
										policyId: policyId
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context43.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context43.abrupt('return', _context43.sent);

							case 5:
							case 'end':
								return _context43.stop();
						}
					}
				}, _callee43, this);
			}));

			function insurancePolicyFileList(_x141, _x142) {
				return _ref43.apply(this, arguments);
			}

			return insurancePolicyFileList;
		}()

		/**
   FinMind API for delete insurance policy file
   **/

	}, {
		key: 'insurancePolicyFileDelete',
		value: function () {
			var _ref44 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee44(token, policyId, fileId) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee44$(_context44) {
					while (1) {
						switch (_context44.prev = _context44.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021849
									},
									data: {
										policyId: policyId,
										fileId: fileId
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context44.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context44.abrupt('return', _context44.sent);

							case 5:
							case 'end':
								return _context44.stop();
						}
					}
				}, _callee44, this);
			}));

			function insurancePolicyFileDelete(_x143, _x144, _x145) {
				return _ref44.apply(this, arguments);
			}

			return insurancePolicyFileDelete;
		}()

		/**
   FinMind API for delete insurance policy file
   **/

	}, {
		key: 'findClient',
		value: function () {
			var _ref45 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee45(token, email) {
				var requestData, req;
				return _regeneratorRuntime.wrap(function _callee45$(_context45) {
					while (1) {
						switch (_context45.prev = _context45.next) {
							case 0:
								requestData = {
									header: {
										token: token,
										api_id: 2021851
									},
									data: {
										email: email
									}
								};
								req = Net.composePostRequestFromData_private(requestData);
								// remote call

								_context45.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, req);

							case 4:
								return _context45.abrupt('return', _context45.sent);

							case 5:
							case 'end':
								return _context45.stop();
						}
					}
				}, _callee45, this);
			}));

			function findClient(_x146, _x147) {
				return _ref45.apply(this, arguments);
			}

			return findClient;
		}()

		/**
  	compose finMind API request for starting to apply for a product
  **/

	}, {
		key: 'composeRequestDataForStartAplication_private',
		value: function composeRequestDataForStartAplication_private(prodId, token) {
			var requestData = {
				header: {
					token: token,
					api_id: 2021807
				},
				data: {
					prodId: prodId,
					applicantRelationShip: 0
				}
			};
			return Net.composePostRequestFromData_private(requestData);
		}

		/**
  	compose finMind API request for Best Premium
  **/

	}, {
		key: 'composeRequestDataForBestPremium_private',
		value: function composeRequestDataForBestPremium_private(quoteXML, apiId) {
			var requestData = {
				header: {
					token: '',
					api_id: apiId
				},
				data: {
					quote: quoteXML
				}
			};
			return Net.composePostRequestFromData_private(requestData);
		}
	}, {
		key: 'composeRequestDataForGetMessages_private',
		value: function composeRequestDataForGetMessages_private(applicationId, t, apiId) {
			var requestData = {
				header: {
					token: t,
					api_id: apiId
				},
				data: {
					appId: applicationId
				}
			};
			return Net.composePostRequestFromData_private(requestData);
		}
	}, {
		key: 'composeRequestDataForSendingMessages_private',
		value: function composeRequestDataForSendingMessages_private(applicationId, t, type, msgText, apiId) {
			var requestData = {
				header: {
					token: t,
					api_id: apiId
				},
				data: {
					appId: applicationId,
					msgType: type,
					msg: msgText
				}
			};
			return Net.composePostRequestFromData_private(requestData);
		}
	}, {
		key: 'composeRequestDataForFileOperation_private',
		value: function composeRequestDataForFileOperation_private(t, uploadFileName, pipleLineKey, appKey, conversationKey, op, userOpSelfFile) {
			var requestData = {
				header: {
					token: t,
					api_id: API_FOR_FILE_UPLOAD
				},
				data: {
					pipelineKey: pipleLineKey,
					applicationKey: appKey,
					conversationKey: conversationKey,
					fileName: uploadFileName,
					operationType: op,
					userOpSelfFile: userOpSelfFile
				}
			};

			return Net.composePostRequestFromData_private(requestData);
		}

		/**
  	compose finMind API request for user-question
  **/

	}, {
		key: 'composeRequestDataForUserQuestionBlock_private',
		value: function composeRequestDataForUserQuestionBlock_private(appId, token) {
			var requestData = {
				header: {
					token: token,
					api_id: 2021805
				},
				data: {
					appId: appId
				}
			};
			return Net.composePostRequestFromData_private(requestData);
		}

		/**
  	compose finMind API request for app-beneficiary
  **/

	}, {
		key: 'composeRequestDataForAppBeneficiaryInfo_private',
		value: function composeRequestDataForAppBeneficiaryInfo_private(appId, token, apiId) {
			var requestData = {
				header: {
					token: token,
					api_id: apiId
				},
				data: {
					appId: appId
				}
			};
			return Net.composePostRequestFromData_private(requestData);
		}
	}, {
		key: 'composeRequestDataForAppPipelineBlocks_private',
		value: function composeRequestDataForAppPipelineBlocks_private(appId, token) {
			var requestData = {
				header: {
					token: token,
					api_id: API_FOR_PIPELINE_BLOCKS
				},
				data: {
					appId: appId
				}
			};
			return Net.composePostRequestFromData_private(requestData);
		}

		/*
  	Compose request for API: API_FOR_GETTING_QA_IN_BLOCK to get all questions/answers
  	for a given block.
  */

	}, {
		key: 'composeRequestDataForGettingQAForABlock_private',
		value: function composeRequestDataForGettingQAForABlock_private(appId, blockId, token) {
			var requestData = {
				header: {
					token: token,
					api_id: API_FOR_GETTING_QA_IN_BLOCK
				},
				data: {
					appId: appId,
					currentBlockId: blockId
				}
			};
			return Net.composePostRequestFromData_private(requestData);
		}

		/**
  	compose finMind API request for app-existing insurance
  **/

	}, {
		key: 'composeRequestDataForAppEixstingInsuranceInfo_private',
		value: function composeRequestDataForAppEixstingInsuranceInfo_private(appId, token) {
			var requestData = {
				header: {
					token: token,
					api_id: 2021822
				},
				data: {
					appId: appId
				}
			};
			return Net.composePostRequestFromData_private(requestData);
		}

		/*
  	finMind API request forming for Login API
  */

	}, {
		key: 'composeRequestDataForLogin_private',
		value: function composeRequestDataForLogin_private(userName, userPassword) {
			var loginData = {
				header: {
					token: "",
					api_id: API_FOR_SIGN_IN_WITH_NAME
				},
				data: {
					name: userName,
					pwh: sha256(sha256(userPassword))
				}
			};
			return Net.composePostRequestFromData_private(loginData);
		}

		/*
  	finMind API request format for Login (with email) API
  */

	}, {
		key: 'composeRequestDataForLoginWithEmail_private',
		value: function composeRequestDataForLoginWithEmail_private(email, userPassword) {
			var loginData = {
				header: {
					token: "",
					api_id: API_FOR_SIGN_IN_WITH_EMAIL
				},
				data: {
					name: email,
					pwh: sha256(sha256(userPassword))
				}
			};
			return Net.composePostRequestFromData_private(loginData);
		}

		/**
  	Yatu API for user-sign up and register for Yatu service
  **/

	}, {
		key: 'composeRequestDataForSignUp_private',
		value: function composeRequestDataForSignUp_private(userFirstName, userMiddleName, userLastName, email, userPassword) {
			var loginData = {
				header: {
					token: "",
					api_id: 202101
				},

				data: {
					name: email,
					email: email,
					fistName: userFirstName,
					middleName: userMiddleName,
					lastName: userLastName,
					pwh: sha256(sha256(userPassword))
				}
			};
			return Net.composePostRequestFromData_private(loginData);
		}

		/**
  	Yatu API request for user sign-out
  **/

	}, {
		key: 'composeRequestDataForSignOut_private',
		value: function composeRequestDataForSignOut_private(token) {
			var loginData = {
				header: {
					token: token,
					api_id: 200001
				},

				data: {}
			};
			return Net.composePostRequestFromData_private(loginData);
		}

		/**
  	finMind request forming for token validation
  **/

	}, {
		key: 'composeRequestDataForTokenCheck_private',
		value: function composeRequestDataForTokenCheck_private(t) {
			// query for the yatu token's validness
			var queryData = {
				header: {
					token: t,
					api_id: 200000
				},

				data: {}
			};

			return Net.composePostRequestFromData_private(queryData);
		}

		/**
  	finMind request forming for block info retriever API
  **/

	}, {
		key: 'composeRequestDataForBlockInfo_private',
		value: function composeRequestDataForBlockInfo_private(blckId) {
			var requestData = {
				header: {
					token: "",
					api_id: 2021817
				},
				data: {
					blockId: blckId
				}
			};
			return Net.composePostRequestFromData_private(requestData);
		}

		/**
  	finMind request forming for saving user questions API
  **/

	}, {
		key: 'composeRequestDataForSavingUserQuestionBlock_private',
		value: function composeRequestDataForSavingUserQuestionBlock_private(aid, bid, questionsXml, token) {
			var requestData = {
				header: {
					token: token,
					api_id: 2021806
				},
				data: {
					appId: aid,
					blockId: bid,
					qAndA: questionsXml
				}
			};
			return Net.composePostRequestFromData_private(requestData);
		}

		/**
  	finMind request forming for API of obtaining next block of wizard questions
  **/

	}, {
		key: 'composeRequestDataForNextWizardBlock_private',
		value: function composeRequestDataForNextWizardBlock_private(prodId, blckId) {
			var requestData = {
				header: {
					token: "",
					api_id: 202183
				},
				data: {
					productId: prodId,
					currentBlockId: blckId
				}
			};
			return Net.composePostRequestFromData_private(requestData);
		}
	}, {
		key: 'composeRequestDataForGetPremiumQuote_private',
		value: function composeRequestDataForGetPremiumQuote_private(xml, token) {
			var requestData = {
				header: {
					token: "",
					api_id: 2021809
				},
				data: {
					quote: xml
					/* quote":"<quoteRequest><gender>MALE</gender>
     <birthday>2001-06-04</birthday>
     <haveCriticalIllness>true</haveCriticalIllness>
     <haveChronicIllness>true</haveChronicIllness
     ><haveGeneticillnessInFamily>true</haveGeneticillnessInFamily>
     <smoke>NEVER</smoke>
     <marijuana>RARELY</marijuana>
     <drug>NEVER</drug>
     <militaryService>false</militaryService>
     <highRiskActivity>false</highRiskActivity>
     <checkedOptions>LIVING_BENEFIT</checkedOptions>
     <checkedOptions>ACCIDENTAL_DEATH_RIDER</checkedOptions>
     <checkedOptions>CHRONICLE_ILLNESS_RIDER</checkedOptions>
     <coverageAmount>200000</coverageAmount>
     coverageTime>10</coverageTime>
     </quoteRequest> 
     */
				}
			};

			return Net.composePostRequestFromData_private(requestData);
		}

		/**
  	finMind request forming for API of updating block branching information
  **/

	}, {
		key: 'composeRequestDataForUpdateBlockBranchingConditions_private',
		value: function composeRequestDataForUpdateBlockBranchingConditions_private(token, blockId, xml) {
			var requestData = {
				header: {
					token: token,
					api_id: 2021815
				},
				data: {
					blockId: blockId,
					conditionXML: xml
				}
			};
			return Net.composePostRequestFromData_private(requestData);
		}

		/**
  	forming request data for finMind API calls
  **/

	}, {
		key: 'composePostRequestFromData_private',
		value: function composePostRequestFromData_private(data) {
			return {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			};
		}

		/**
  	main method for doing Yatu post API calls
  **/

	}, {
		key: 'remoteCall',
		value: function () {
			var _ref46 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee46(url, requestOptions) {
				var ret, response, message, res;
				return _regeneratorRuntime.wrap(function _callee46$(_context46) {
					while (1) {
						switch (_context46.prev = _context46.next) {
							case 0:
								ret = { data: null, code: 0, err: "" };
								_context46.prev = 1;
								_context46.next = 4;
								return fetch(url, requestOptions);

							case 4:
								response = _context46.sent;

								if (response.ok) {
									_context46.next = 8;
									break;
								}

								message = uiMan.getTextWithParams(languageConstants.SERVER_ERROR_WITH_RESPONSE, response.status);
								throw new Error(message);

							case 8:
								_context46.next = 10;
								return response.json();

							case 10:
								res = _context46.sent;

								ret.data = res.data;
								ret.errCode = res.result.code;
								if (ret.errCode !== 0) {
									ret.err = { code: ret.errCode, msg: res.result.msg };
								}
								_context46.next = 19;
								break;

							case 16:
								_context46.prev = 16;
								_context46.t0 = _context46['catch'](1);

								ret.err = { code: 1099, msg: _context46.t0.message };

							case 19:
								return _context46.abrupt('return', ret);

							case 20:
							case 'end':
								return _context46.stop();
						}
					}
				}, _callee46, this, [[1, 16]]);
			}));

			function remoteCall(_x148, _x149) {
				return _ref46.apply(this, arguments);
			}

			return remoteCall;
		}()
	}]);

	return Net;
}();

export { Net };