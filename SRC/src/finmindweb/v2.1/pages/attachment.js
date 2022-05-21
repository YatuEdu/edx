import _regeneratorRuntime from 'babel-runtime/regenerator';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { sysConstants } from '../core/sysConst.js';
import { credMan } from '../core/credManFinMind.js';
import { Net } from '../core/net.js';

/**
	This class manages both login and sigup workflow
**/

var Attachment = function () {
	function Attachment(credMan) {
		_classCallCheck(this, Attachment);

		this.applicationId = "1021";
		this.pipeline = "101";

		this.credMan = credMan;
		this.init();
	}

	// hook up events


	_createClass(Attachment, [{
		key: 'init',
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
				var _this = this;

				return _regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								// when button is clicked
								$('#void_check_btn').click(function (e) {
									return _this.handleUploadFile(e, $('#void_check_file')[0], $('#void_check_file_tips'));
								});
								$('#driver_license_btn').click(function (e) {
									return _this.handleUploadFile(e, $('#driver_license_file')[0], $('#driver_license_file_tips'));
								});
								$('#green_card_btn').click(function (e) {
									return _this.handleUploadFile(e, $('#green_card_file')[0], $('#green_card_file_tips'));
								});

							case 3:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function init() {
				return _ref.apply(this, arguments);
			}

			return init;
		}()
	}, {
		key: 'handleUploadFile',
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(e, fileInput, tips) {
				var file, ret, resUrl, fReader, xhreq;
				return _regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								e.preventDefault();

								if (!(fileInput.value == "")) {
									_context2.next = 5;
									break;
								}

								tips.innerText = "请选择一个文件";
								_context2.next = 14;
								break;

							case 5:
								file = fileInput.files[0];

								if (!(file.size <= 0 || file.size > 40 * 1024 * 1024)) {
									_context2.next = 10;
									break;
								}

								tips.innerText = "文件不符合要求";
								_context2.next = 14;
								break;

							case 10:
								_context2.next = 12;
								return this.sendFileNameToServerBeforeUpload(file.name);

							case 12:
								ret = _context2.sent;

								if (ret.code == null || ret.code == 0) {
									resUrl = ret.data.url;

									if (window.FileReader) {
										fReader = new FileReader();
										xhreq = this.createHttpRequest();

										xhreq.onreadystatechange = function () {
											if (xhreq.readyState == 4) {
												if (xhreq.status == 200) {
													tips.innerText = "文件上传成功";
													alert("文件上传成功");
												} else {
													tips.innerText = "文件上传失败了";
													var responseData = xhreq.responseText;
													alert("文件上传失败：" + responseData);
												}
											}
										};
										fReader.onload = function (e) {
											//xhreq.open("PUT","https://fdwebinsst-bkt1.s3.us-west-2.amazonaws.com/themiscellaneous/%E4%B8%ADpdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210524T060904Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Credential=AKIA3O77ERYBPO3YO7XO%2F20210524%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=3bb3238522ae7b4feadc48aaf56e036d719df7b4cc0652abba9573fa5436dc34",true);
											console.log("try send to url:\n" + resUrl);
											xhreq.open("PUT", resUrl, true);

											//xhreq.setRequestHeader("Content-Type", "application/octet-stream"); //流类型 ok
											xhreq.setRequestHeader("Content-Type", "application/pdf"); //pdf类型 ok
											xhreq.setRequestHeader("Content-Length", file.size); //文件大小
											xhreq.setRequestHeader("uploadfile_name", encodeURI(file.name)); //兼容中文
											xhreq.send(fReader.result);
										};
										fReader.onprogress = function (e) {
											//	uploadProgress.value = e.loaded*100/e.total;
										};
										fReader.readAsArrayBuffer(file);
									}
								} else {
									tips.innerText = "文件上传失败" + ret.msg;
									alert("文件上传失败" + ret.msg);
								}

							case 14:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function handleUploadFile(_x, _x2, _x3) {
				return _ref2.apply(this, arguments);
			}

			return handleUploadFile;
		}()

		/**
   * 1 upload, 2 list, 3 download, 4 delete
   */

	}, {
		key: 'sendFileNameToServerBeforeUpload',
		value: function () {
			var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(uploadFileName) {
				var requestData, requestBody, res;
				return _regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								requestData = {
									header: {
										token: this.credMan.credential.token,
										api_id: 2021818
									},
									data: {
										pipelineKey: this.pipeline,
										applicationKey: this.applicationId,
										conversationKey: "",
										fileName: uploadFileName,
										operationType: 1,
										userOpSelfFile: 0
									}
								};
								requestBody = {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify(requestData)
								};
								_context3.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, requestBody);

							case 4:
								res = _context3.sent;
								return _context3.abrupt('return', res);

							case 6:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function sendFileNameToServerBeforeUpload(_x4) {
				return _ref3.apply(this, arguments);
			}

			return sendFileNameToServerBeforeUpload;
		}()
	}, {
		key: 'listFiles',
		value: function () {
			var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
				var requestData, requestBody, res, i, fileListDiv, input, br;
				return _regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								requestData = {
									header: {
										token: this.credMan.credential.token,
										api_id: 2021818
									},
									data: {
										pipelineKey: this.pipeline,
										applicationKey: this.applicationId,
										conversationKey: "",
										fileName: "",
										operationType: 2,
										userOpSelfFile: 0
									}
								};
								requestBody = {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify(requestData)
								};
								_context4.next = 4;
								return Net.remoteCall(sysConstants.FINMIND_PORT, requestBody);

							case 4:
								res = _context4.sent;

								if (!res.error) {
									_context4.next = 9;
									break;
								}

								return _context4.abrupt('return', { error: res.error });

							case 9:
								for (i in res.data) {
									console.log(res.data[i]);
									fileListDiv = document.getElementById('fileList');
									input = document.createElement("input");

									input.setAttribute('type', 'text');
									input.setAttribute('width', '400px');
									input.setAttribute('class', 'file_list_item');
									input.setAttribute('ReadOnly', 'True'); //设置文本为只读类型
									input.value = res.data[i];
									fileListDiv.appendChild(input);
									//换行
									br = document.createElement("br");

									fileListDiv.appendChild(br);
								}

							case 10:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function listFiles() {
				return _ref4.apply(this, arguments);
			}

			return listFiles;
		}()
	}, {
		key: 'createHttpRequest',
		value: function createHttpRequest() {
			var xmlHttp = null;
			try {
				// Firefox, Opera 8.0+, Safari
				xmlHttp = new XMLHttpRequest();
			} catch (e) {
				// Internet Explorer
				try {
					xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e) {
						alert("您的浏览器不支持AJAX！");
					}
				}
			}
			return xmlHttp;
		}
	}]);

	return Attachment;
}();

var attachment = null;

$(document).ready(function () {
	attachment = new Attachment(credMan);
	attachment.listFiles();
});