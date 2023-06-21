import {credMan} 		from '../../js/core/credMan.js'
import {Net}            from '../../js/core/net.js';

class ContentLoader {
    static async createContentLoader() {
        const myInstance = new ContentLoader();
		await myInstance.init();
		return myInstance;
    }

    async init() {
        const isLoggedIn = await credMan.hasLoggedIn();
		if (!isLoggedIn) {
			// go to login page (todo: append target url): extract the file name
			window.location.href = "./login.html";
            return;
		}
        // load content from student db
        document.body.innerHTML = '<div><h1> Hello </h1></div>'
    }
}

let contentLoader = null;
// A $( document ).ready() block.
$( document ).ready(async function() {
    console.log( "Index page ready!" );
	contentLoader = await ContentLoader.createContentLoader();
});