import _regeneratorRuntime from 'babel-runtime/regenerator';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { PipelineManager } from './pipelineManager.js';
import { Net } from './net.js';
import { credMan } from './credManFinMind.js';
import { ApplicationQAndAManager } from "./applicationQAndAManager.js";

/**
	Manager for Application PipeLine
**/

var ApplicationPipelineManager = function (_PipelineManager) {
	_inherits(ApplicationPipelineManager, _PipelineManager);

	function ApplicationPipelineManager(store, appId) {
		_classCallCheck(this, ApplicationPipelineManager);

		return _possibleConstructorReturn(this, (ApplicationPipelineManager.__proto__ || Object.getPrototypeOf(ApplicationPipelineManager)).call(this, store, appId));

		// get current answered blocks first if any
		// 获取目前已经回答的问题， 如果用户上次没有回答完， 这次不用从头开始。
		// this.initalizeState();
	}

	/**
 	Retrieve all question blocks answered from FinMind backend for 
 	the current user
 **/


	_createClass(ApplicationPipelineManager, [{
		key: 'initalizeState',
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
				var t, blocks, qaLst, i, blockId, name, description, html;
				return _regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								t = credMan.credential.token;
								_context.next = 3;
								return Net.getAppPipelineBlocks(this._appId, t);

							case 3:
								blocks = _context.sent;

								if (!(blocks && blocks.data.length > 0)) {
									_context.next = 23;
									break;
								}

								qaLst = void 0;
								i = 0;

							case 7:
								if (!(i < blocks.data.length)) {
									_context.next = 19;
									break;
								}

								blockId = blocks.data[i].block_id;

								// get qestion / answer for this block

								_context.next = 11;
								return Net.getQAForBlockOfApp(this._appId, blockId, t);

							case 11:
								qaLst = _context.sent;

								this._qAndAManager = new ApplicationQAndAManager(this._appId);
								_context.next = 15;
								return this._qAndAManager.setUserQuestionsFromServerData(qaLst.data);

							case 15:
								this._qAndAManagerHistoryList.push(this._qAndAManager);

							case 16:
								i++;
								_context.next = 7;
								break;

							case 19:
								name = this._qAndAManager.blockName;
								description = this._qAndAManager.blockDescription;
								html = this._qAndAManager.getUserQustionHtmlInternal();

								if (html) {
									$('#fm_wz_block_name').text(name);
									$('#fm_wz_block_description').html(description);
									$('#user_question_block').html(html);
									this.hookUpEvents();
								}

							case 23:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function initalizeState() {
				return _ref.apply(this, arguments);
			}

			return initalizeState;
		}()

		/**
  	Get the next block of questions from finMind and dispolay it
  **/

	}, {
		key: 'v_getNextQuestionBlock',
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(token, param) {
				return _regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return Net.getBlockQuestions(this._appId, token);

							case 2:
								return _context2.abrupt('return', _context2.sent);

							case 3:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function v_getNextQuestionBlock(_x, _x2) {
				return _ref2.apply(this, arguments);
			}

			return v_getNextQuestionBlock;
		}()

		/**
  	To save all the answered questions to finMind service
  **/

	}, {
		key: 'v_save',
		value: function () {
			var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(t) {
				var qXML;
				return _regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								qXML = this.prot_formQuestionsXml();
								_context3.next = 3;
								return Net.saveBlockQuestions(this._appId, this._qAndAManager.blockId, qXML, t);

							case 3:
								return _context3.abrupt('return', _context3.sent);

							case 4:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function v_save(_x3) {
				return _ref3.apply(this, arguments);
			}

			return v_save;
		}()
	}]);

	return ApplicationPipelineManager;
}(PipelineManager);

export { ApplicationPipelineManager };