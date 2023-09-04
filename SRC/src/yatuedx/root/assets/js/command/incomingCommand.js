import {StringUtil, UtilConst} 	from '../core/util.js'

/*
const COMMAND_OBJ_TEMPLETE = {
	id: 100,
	encodeIndex: -1,
	data: ['abc', 100, 0】,
	version: {
		major: 1,
		minor: 0,
		build: 0
	}
};
*/

class IncomingCommand {
	#sender;
	#cmdObject;
	
	constructor(cmdString, sender) {
		this.#sender = sender;
		this.#cmdObject = JSON.parse(cmdString);
		const encodedTextIndex = this.#cmdObject.encodeIndex;
		if (encodedTextIndex !== -1) {
			const dataToDecode = this.#cmdObject.data[encodedTextIndex]
			this.#cmdObject.data[encodedTextIndex] = StringUtil.decodeText(dataToDecode)
		}
	}
	
	/*
		Retrieve command sender
	*/
	get sender() {
		return this.#sender;
	}
	
	/*
		Retrieve command version
	*/
	get version() {
		return this.#cmdObject.version;
	}
	
	/*
		Retrieve command version major
	*/
	get versionMajor() {
		return this.#cmdObject.version.major;
	}
	
	/*
		Retrieve command version minor
	*/
	get versionMinor() {
		return this.#cmdObject.version.minor;
	}
	
	/*
		Retrieve command version build
	*/
	get versionBuild() {
		return this.#cmdObject.version.build;
	}
	
	/*
		Retrieve command ID
	*/
	get id() {
		return this.#cmdObject.id;
	}
	
	/*
		Retrieve command data
	*/
	get data() {
		return this.#cmdObject.data;
	}
	
	/*
		Retrieve command data 1st element
	*/
	get data1() {
		return this.#cmdObject.data[0];
	}
	
	/*
		Retrieve command data 2nd element
	*/
	get data2() {
		return this.#cmdObject.data[1];
	}
	
	/*
		Retrieve command data Nth element (n STARTS FROM 0)
	*/
	dataN(n) {
		if (this.#cmdObject.data.length > n) {
			return this.#cmdObject.data[n];
		}
		throw new Error('dataN: index is out of range'); 
	}
}


export { IncomingCommand };