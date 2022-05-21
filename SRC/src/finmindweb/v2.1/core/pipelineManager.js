import _regeneratorRuntime from 'babel-runtime/regenerator';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { ApplicationQAndAManager } from './applicationQAndAManager.js';

/**
	Manager for pipeline question down-loading, dynamic HTML generation,
	event handling, and question-answer saving.
	There are two derivation classes: 
		- ApplicationPipeLineManager
		- WizardPipeLineManager
**/

var PipelineManager = function () {
	function PipelineManager(store, appId) {
		_classCallCheck(this, PipelineManager);

		this._store = store;
		this._appId = appId;
		this._qAndAManager = null;
		this._qAndAManagerHistoryList = [];
	}

	/**
 	Get current blockId
 **/


	_createClass(PipelineManager, [{
		key: 'setBlockInfo',


		/**
  	Block Id and Block Info are obtained by different API at slightly diferent time.
  	Hence we need a method to set it from outside.
  **/
		value: function setBlockInfo(blockName, blockDescription, blockNote) {
			this._qAndAManager.blockName = blockName;
			this._qAndAManager.blockDescription = blockDescription;
			this._qAndAManager.blockNote = blockNote;
		}

		/**
  	Block Id and Block Info are obtained by different API at slightly diferent time.
  	Hence we need a method to set it from outside.
  **/

	}, {
		key: 'getBlockInfo',
		value: function getBlockInfo() {
			return {
				blockName: this._qAndAManager.blockName,
				blockDescription: this._qAndAManager.blockDescription
			};
		}

		/**
  	Dynamically generated html input controls hooking up event handler
  **/

	}, {
		key: 'hookUpEvents',
		value: function hookUpEvents() {
			// Obtain the list for every newly appended input elements
			var inputElements = this._qAndAManager.currentQuestions;

			// now hook up all the input elements event handlers for 
			inputElements.forEach(function (e) {
				return e.onChangeEvent();
			});

			// now set the input value (or selection) if any
			inputElements.forEach(function (e) {
				return e.setDisplayValue();
			});
		}

		/**
  	Get the next block of questions from finMind and 
  	dispolay it dynamically as HTML text
  **/

	}, {
		key: 'nextBlock',
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(token, param) {
				var _this = this;

				var objIndex, restLen, currBlck, resp;
				return _regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								// if the next blocks are in history list. need to spline ALL THE BLOCKS BEHIND IT
								objIndex = this._qAndAManagerHistoryList.findIndex(function (q) {
									return q === _this._qAndAManager;
								});

								if (objIndex < this._qAndAManagerHistoryList.length - 1) {
									// Remove the last n elements
									restLen = this._qAndAManagerHistoryList.length - objIndex - 1;

									if (restLen > 0) {
										// remove the last N blocks after this block due to the block change:
										this._qAndAManagerHistoryList.splice(-1 * restLen);
									}
								}

								currBlck = this._qAndAManager === null ? 0 : this._qAndAManager.blockId;

								this._qAndAManager = new ApplicationQAndAManager(this._appId);
								this._qAndAManagerHistoryList.push(this._qAndAManager);

								// initialize it from finMind API
								_context.next = 7;
								return this.v_getNextQuestionBlock(token, currBlck);

							case 7:
								resp = _context.sent;

								if (!(resp && resp.err)) {
									_context.next = 11;
									break;
								}

								alert(resp.err); // todo: go to error pageX
								return _context.abrupt('return', '');

							case 11:
								if (!resp.quote) {
									_context.next = 13;
									break;
								}

								return _context.abrupt('return', resp);

							case 13:
								_context.next = 15;
								return this.prv_composeUserQustionHtml(resp.data);

							case 15:
								return _context.abrupt('return', _context.sent);

							case 16:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function nextBlock(_x, _x2) {
				return _ref.apply(this, arguments);
			}

			return nextBlock;
		}()

		/**
  	Test if there is a previous block of questions to go.  UI call this to disable or
  	enable the "prev" buton.
  **/

	}, {
		key: 'canGotoPreviousBlock',
		value: function canGotoPreviousBlock() {
			// there is enough element to go
			if (this.getPreviousBlockIndex() >= 0) {
				return true;
			}

			// get the index of the previous block
			return false;
		}
	}, {
		key: 'getPreviousBlockIndex',
		value: function getPreviousBlockIndex() {
			var _this2 = this;

			// no previous element to go
			if (this._qAndAManagerHistoryList.length < 2) {
				return -1;
			}

			// get the index of the previous block
			return this._qAndAManagerHistoryList.findIndex(function (q) {
				return q === _this2._qAndAManager;
			}) - 1;
		}

		/**
  	Get the previous block of questions from _qAndAManagerHistoryList 
  	by going back to the stack.  When moving forward again, we need to see
  	if the previous question block is dirty.  If dirty, get from server.  If clean,
  	retieve from _qAndAManagerHistoryList.
  **/

	}, {
		key: 'previousBlock',
		value: function previousBlock() {
			// no previous
			var prevIndex = this.getPreviousBlockIndex();
			if (prevIndex < 0) {
				return null;
			}

			// first current block index
			this._qAndAManager = this._qAndAManagerHistoryList[prevIndex];

			// get html
			return { name: this._qAndAManager.blockName,
				description: this._qAndAManager.blockDescription,
				html: this._qAndAManager.getUserQustionHtmlInternal(),
				note: this._qAndAManager.blockNote
			};
		}

		/**
  	Validate and then save all the answered questions to finMind service
  **/

	}, {
		key: 'validateAndSaveCurrentBlock',
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(token) {
				var currentBlockId, currentQuestions, found, resp;
				return _regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								if (!(this._qAndAManager == null)) {
									_context2.next = 2;
									break;
								}

								return _context2.abrupt('return', true);

							case 2:

								// no current data to save, can move on
								currentBlockId = this._qAndAManager.blockId;

								if (!(currentBlockId <= 0)) {
									_context2.next = 5;
									break;
								}

								return _context2.abrupt('return', true);

							case 5:

								// first validate the current questions
								currentQuestions = this._qAndAManager.currentQuestions;
								found = currentQuestions.find(function (e) {
									return e.onValidating() === false;
								});

								if (!found) {
									_context2.next = 10;
									break;
								}

								alert('Question \'' + found.question + '\' needs to be answered');
								return _context2.abrupt('return', false);

							case 10:
								_context2.next = 12;
								return this.v_save(token);

							case 12:
								resp = _context2.sent;

								if (!(resp && resp.err)) {
									_context2.next = 18;
									break;
								}

								alert(resp.err);
								return _context2.abrupt('return', false);

							case 18:
								return _context2.abrupt('return', true);

							case 19:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function validateAndSaveCurrentBlock(_x3) {
				return _ref2.apply(this, arguments);
			}

			return validateAndSaveCurrentBlock;
		}()

		/**
  	To save all the answered questions to finMind service.
  	This method shall be overriden by the child classes.
  **/

	}, {
		key: 'v_save',
		value: function () {
			var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(t) {
				return _regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								throw new Error('save: sub-class-should-overload-this');

							case 1:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function v_save(_x4) {
				return _ref3.apply(this, arguments);
			}

			return v_save;
		}()

		/**
  	Get the next block of questions from finMind and dispolay it
  **/

	}, {
		key: 'v_getNextQuestionBlock',
		value: function () {
			var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(t) {
				return _regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								throw new Error('save: sub-class-should-overload-this');

							case 1:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function v_getNextQuestionBlock(_x5) {
				return _ref4.apply(this, arguments);
			}

			return v_getNextQuestionBlock;
		}()

		/**
  	private method
  	
  	Form question/answer UI by dynamically generate HTML block based
  	on the questions obtained from server.
  **/

	}, {
		key: 'prv_composeUserQustionHtml',
		value: function () {
			var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(qList, fromCachedBlock) {
				var qMap;
				return _regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								// mrege with session-stored wizard list if any
								qMap = this.prot_deserialize();

								if (qMap != null && qMap.size > 0) {
									this.prv_mergeQlist(qList, qMap);
								}
								_context5.next = 4;
								return this._qAndAManager.getUserQustionHtml(qList);

							case 4:
								return _context5.abrupt('return', _context5.sent);

							case 5:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this);
			}));

			function prv_composeUserQustionHtml(_x6, _x7) {
				return _ref5.apply(this, arguments);
			}

			return prv_composeUserQustionHtml;
		}()

		/**
  	private method
  	
  	Set question's answer from a previously answered question map.
  	The masp is created from session storage.
  **/

	}, {
		key: 'prv_mergeQlist',
		value: function prv_mergeQlist(qList, qMap) {
			var _this3 = this;

			qList.forEach(function (q) {
				if (qMap.has(q.attr_id)) {
					_this3.prv_copyQinfo(q, qMap.get(q.attr_id));
				}
			});
		}

		/**
  	private method
  	
  	Deep copy the answer from one qInfo to another qinfo 
  **/

	}, {
		key: 'prv_copyQinfo',
		value: function prv_copyQinfo(qTarget, qSource) {
			if (typeof qSource.iv1 !== 'undefined') {
				qTarget.iv1 = qSource.iv1;
			}
			if (typeof qSource.iv2 !== 'undefined') {
				qTarget.iv2 = qSource.iv2;
			}
			if (typeof qSource.sv1 !== 'undefined') {
				qTarget.sv1 = qSource.sv1;
			}
			if (typeof qSource.sv2 !== 'undefined') {
				qTarget.sv2 = qSource.sv2;
			}
			if (typeof qSource.dv1 !== 'undefined') {
				qTarget.dv1 = qSource.dv1;
			}
			if (typeof qSource.dv2 !== 'undefined') {
				qTarget.dv2 = qSource.dv2;
			}
		}

		/**
  	Protected method
  	
  	Serialize all questions ans answsers in one XML node.
  **/

	}, {
		key: 'prot_formQuestionsXml',
		value: function prot_formQuestionsXml() {
			var questions = this._qAndAManager.currentQuestions;
			var xml = '<block>';
			questions.forEach(function (q) {
				return xml += q.serverXML;
			});
			xml += '</block>';
			return xml;
		}

		/**
  	Protected method
  	
  	Serialze the question map object (containing previously answered questions) 
  **/

	}, {
		key: 'prot_seriaslize',
		value: function prot_seriaslize(qMap) {
			this._store.setItem(JSON.stringify(qMap, function (key, value) {
				// serilization with replacer
				if (value instanceof Map) {
					return {
						dataType: 'Map',
						value: Array.from(value.entries())
					};
				} else {
					return value;
				}
			}));
		}

		/**
  	Protected method
  	
  	Retrieve serialized map object (containing previously answered questions) and
  	desiarized into a Map object
  **/

	}, {
		key: 'prot_deserialize',
		value: function prot_deserialize() {
			var qMap = null;
			var storeMapStr = this._store.getItem();
			if (storeMapStr) {
				qMap = JSON.parse(storeMapStr, function (key, value) {
					// desrialization with receiver func
					if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null) {
						if (value.dataType === 'Map') {
							return new Map(value.value);
						}
					}
					return value;
				});
			} else {
				qMap = new Map();
			}
			return qMap;
		}
	}, {
		key: 'blockId',
		get: function get() {
			return this._qAndAManager ? this._qAndAManager.blockId : 0;
		}
	}]);

	return PipelineManager;
}();

export { PipelineManager };