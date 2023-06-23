import {credMan} 		    from '../../js/core/credMan.js'
import {LocalStoreAccess}	from '../../js/core/localStorage.js'
import {StringUtil}	        from '../../js/core/util.js';
import {sysConstants}       from '../../js/core/sysConst.js'

class ContentLoader {
    #codeStore =  new LocalStoreAccess(sysConstants.YATU_MY_CODE_STORE_KEY);
	
    static async createContentLoader() {
        const myInstance = new ContentLoader();
		await myInstance.init();
		return myInstance;
    }

    async init() {
        debugger;
        const isLoggedIn = await credMan.hasLoggedIn();
		if (!isLoggedIn) {
			// go to login page (todo: append target url): extract the file name
			window.location.href = "./login.html";
            return;
		}
        // load content from student db
        // first load from local storage
        let codeTextEncoded = this.#codeStore.getItem();
        if (codeTextEncoded) {
            const codeText = StringUtil.decodeText(codeTextEncoded);
            document.body.innerHTML = codeText;

            // extract code:
            const tagBegin = '<script>';
            const tagEnd = '</script>';
            const codeStart = codeText.indexOf(tagBegin) + tagBegin.length;
            const codeEnd = codeText.indexOf(tagEnd, codeStart);
            const codeToEval = codeText.substring(codeStart, codeEnd);
            eval(codeToEval);
        }
        else {
         '<div><h1> Hello </h1></div>'
        }
       
    }
}

let contentLoader = null;
// A $( document ).ready() block.
$( document ).ready(async function() {
    console.log( "Index page ready!" );
	contentLoader = await ContentLoader.createContentLoader();
});