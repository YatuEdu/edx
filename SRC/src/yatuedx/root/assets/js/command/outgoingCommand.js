/***
const COMMAND_OBJ_TEMPLETE = {
	id: 100,
	data: ['abc', 100, 0】,
	version: {
		major: 1,
		minor: 0,
		build: 0
	}
};
**/

class OutgoingCommand {
	#id;
	#data;
	
	constructor(id, data1, ...params) {
		this.#id = id;
		this.#data = [];
		this.#data.push(data1);
		for (let i=0; i<params.length; i++) {
			this.#data.push(params[i]);
		}
	}
	
	/**
		Convert to JSON string in order to send on the wire
	**/
	get str() {
		const cmd = {
			id: this.#id,
			data: this.#data,
		}
		return JSON.stringify(cmd)
	}
	
	get id() {
		return this.#id;
	}
	
	get data() {
		return this.#data;
	}
	
	pushData(data) {
		this.#data.push(data);
	}
}


export { OutgoingCommand };