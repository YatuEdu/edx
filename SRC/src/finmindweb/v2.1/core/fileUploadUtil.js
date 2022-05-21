import _regeneratorRuntime from 'babel-runtime/regenerator';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { sysConstants } from './sysConst.js';
import { Net } from './net.js';
import { credMan } from './credManFinMind.js';

var FileUploadUtil = function () {
	function FileUploadUtil() {
		_classCallCheck(this, FileUploadUtil);
	}

	_createClass(FileUploadUtil, null, [{
		key: 'handleUploadFile',


		/**
  	Open explorer and upload a stream from a local file
  **/
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(fileInput, fileDesignatedName, refreshProgress, appId) {
				var file, ret, resUrl, fReader, xhReq;
				return _regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								if (!(!fileInput || fileInput.value == "")) {
									_context.next = 2;
									break;
								}

								return _context.abrupt('return');

							case 2:
								file = fileInput.files[0];

								if (!(file.size <= 0 || file.size > sysConstants.MAX_FILE_SIZE)) {
									_context.next = 6;
									break;
								}

								refreshProgress(0, false, 'File size not meet the requirements');
								return _context.abrupt('return');

							case 6:

								// start uploading
								refreshProgress(0, true, '');
								_context.next = 9;
								return FileUploadUtil.sendFileNameToServerBeforeUpload_priv(fileDesignatedName, appId);

							case 9:
								ret = _context.sent;

								if (!ret.code) {
									_context.next = 14;
									break;
								}

								// encontered error, exit
								refreshProgress(0, false, ret.err);
								$(fileInput).val("");
								return _context.abrupt('return');

							case 14:

								// got target url, upload to it
								resUrl = ret.data.url;
								fReader = new FileReader();
								xhReq = FileUploadUtil.createHttpRequest_priv();


								xhReq.onreadystatechange = function () {
									if (xhReq.readyState == 4) {
										if (xhReq.status == 200) {
											refreshProgress(100, true, '');
										} else {
											var responseData = xhReq.responseText;
											refreshProgress(0, false, responseData);
											$(fileInput).val("");
										}
									}
								};

								fReader.onload = function (e) {
									//xhreq.open("PUT","https://fdwebinsst-bkt1.s3.us-west-2.amazonaws.com/themiscellaneous/%E4%B8%ADpdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210524T060904Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Credential=AKIA3O77ERYBPO3YO7XO%2F20210524%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=3bb3238522ae7b4feadc48aaf56e036d719df7b4cc0652abba9573fa5436dc34",true);
									console.log("try send to url:\n" + resUrl);
									xhReq.open("PUT", resUrl, true);

									//xhreq.setRequestHeader("Content-Type", "application/octet-stream"); //流类型 ok
									xhReq.setRequestHeader("Content-Type", "application/pdf"); //pdf类型 ok
									//	xhReq.setRequestHeader("Content-Length", file.size);     //文件大小
									xhReq.setRequestHeader("uploadfile_name", encodeURI(fileDesignatedName)); //兼容中文
									xhReq.send(fReader.result);
								};
								fReader.onprogress = function (e) {
									//	uploadProgress.value = e.loaded*100/e.total;
									console.log("progress: " + e.loaded * 100 / e.total);
									refreshProgress(Math.round(e.loaded * 100 / e.total), true, '');
								};

								// start reading and pushing to server...
								_context.next = 22;
								return fReader.readAsArrayBuffer(file);

							case 22:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function handleUploadFile(_x, _x2, _x3, _x4) {
				return _ref.apply(this, arguments);
			}

			return handleUploadFile;
		}()

		/**
   * 1 upload, 2 list, 3 download, 4 delete
   */

	}, {
		key: 'sendFileNameToServerBeforeUpload_priv',
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(uploadFileName, appId) {
				var appKey;
				return _regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								appKey = appId.toString();
								return _context2.abrupt('return', Net.fileUpload(credMan.credential.token, uploadFileName, appKey, appKey, appKey));

							case 2:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function sendFileNameToServerBeforeUpload_priv(_x5, _x6) {
				return _ref2.apply(this, arguments);
			}

			return sendFileNameToServerBeforeUpload_priv;
		}()
	}, {
		key: 'createHttpRequest_priv',
		value: function createHttpRequest_priv() {
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
						alert("Sorry, your browser does not support this function！");
					}
				}
			}
			return xmlHttp;
		}
	}]);

	return FileUploadUtil;
}();

export { FileUploadUtil };