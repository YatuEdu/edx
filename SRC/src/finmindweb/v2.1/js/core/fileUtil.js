import {Net} from "./net.js";
import {credMan} from "./credManFinMind.js";

class FileUtil {

    static async uploadFile(token, file, progressHandle) {
        // 检查文件大小
        if (file.size <= 0 || file.size > (40 * 1024 * 1024)) {
            return {
                errMsg: "File size cannot be larger than 40MB"
            }
        }

        // 文件后缀分析
        let suffix = file.name.substring(file.name.lastIndexOf('.') + 1);
        let fileNameUn = this.genFileName(suffix);
        let fileName = file.name;
        let fileSize = file.size;

        let that = this;
        let ret = await Net.beforeUploadFile(token, fileNameUn);
        if (ret.code==null || ret.code==0) {
            let resUrl = ret.data.url;
            if (window.FileReader) {
                progressHandle(0);
                let fReader = new FileReader();
                let xhreq = this.createHttpRequest();
                xhreq.onreadystatechange = function () {
                    if (xhreq.readyState == 4) {
                        if (xhreq.status == 200) {
                            progressHandle(100);
                        } else {
                            let responseData = xhreq.responseText;
                            progressHandle(-1, "file upload failed" + responseData);
                        }
                    }
                };
                fReader.onload = function (e) {
                    console.log("try send to url:\n" + resUrl);
                    xhreq.open("PUT", resUrl, true);
                    xhreq.setRequestHeader("Content-Type", that.getContentType(suffix)); //pdf类型 ok
                    xhreq.setRequestHeader("uploadfile_name", encodeURI(fileNameUn)); //兼容中文
                    xhreq.send(fReader.result);
                };
                fReader.onprogress = function (e) {
                    let progress = e.loaded*100/e.total;
                    if (progress>=100) progress = 99.9;
                    progressHandle(progress);
                };
                fReader.readAsArrayBuffer(file);
            }
        } else {
            progressHandle(-2, "file upload failed" + ret.msg);
        }

        return {
            suffix: suffix,
            fileNameUn: fileNameUn,
            fileName: fileName,
            fileSize: fileSize
        }
    }

    static createHttpRequest() {
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

    static getContentType(suffix) {
        let type = 'application/octet-stream';
        switch (suffix) {
            case 'pdf':
                type = 'application/pdf';
                break;

            case 'jpeg':
            case 'bmp':
            case 'jpg':
                type = 'image/jpeg';
                break;
            case 'doc':
            case 'docx':
                type = 'application/msword';
                break;
        }
        return type;
    }

    static genFileName(suffix) {
        let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
            a = t.length,
            n = "";
        for (let i = 0; i < 32; i++) n += t.charAt(Math.floor(Math.random() * a));
        let timestamp = new Date().getTime();
        return n + timestamp + '.' + suffix;
    }

}

export {FileUtil}
