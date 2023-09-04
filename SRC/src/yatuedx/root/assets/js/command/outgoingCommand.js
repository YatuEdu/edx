import {PTCC_COMMANDS}			from '../command/programmingClassCommand.js'
import {StringUtil, UtilConst} 	from '../core/util.js'

class OutgoingCommand {
	#id
	#encodeIndex
	#data
	
	constructor(id, data1, ...params) {
		this.#id = id;
		this.#encodeIndex = this.getEncodeTextIndex(id, data1);
		this.#data = [];
		let dataToSendOut = data1;
		if (this.#encodeIndex === 0) {
			dataToSendOut = StringUtil.encodeText(data1);
		}
		this.#data.push(dataToSendOut);
		for (let i=0; i<params.length; i++) {
			let dataToSendOut = params[i];
			if (this.#encodeIndex === i+1) {
				if (dataToSendOut) {
					dataToSendOut = StringUtil.encodeText(dataToSendOut);
				} else {
					this.#encodeIndex = -1;
				}
			}
			this.#data.push(dataToSendOut);
		}
	}
	
	/*
		certain command that transmit html or code text needs to be base64 encoded
	*/
	getEncodeTextIndex(id, data1) {
		let encodeIndex = -1;
		switch (id) {
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_UPDATE:
				{
					switch (data1) {
						case UtilConst.STR_CHANGE_APPEND:
						case UtilConst.STR_CHANGE_PREPEND:
						case UtilConst.STR_CHANGE_MIDDLE:
							encodeIndex = 1;
							break;
						default:
							break;
					}
				}
				break;

			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_REFRESH:
			case PTCC_COMMANDS.PTC_PRIVATE_MSG:
			case PTCC_COMMANDS.GM_HELLO_FROM_PEER:					
			case PTCC_COMMANDS.GM_HELLO_FROM_SYSTEM:
				encodeIndex = 0;
				break;

			default:
				break;
		}
		return encodeIndex;
	}

 	/*
		Convert to JSON string in order to send on the wire
	*/
	get str() {
		const cmd = {
			id: this.#id,
			encodeIndex: this.#encodeIndex,
			data: this.#data,
		}
		return JSON.stringify(cmd)
	}
	
	get id() {
		return this.#id;
	}
	
	get encodeIndex() {
		return this.#encodeIndex;
	}

	get data() {
		return this.#data;
	}
	
	pushData(data) {
		this.#data.push(data);
	}
}


export { OutgoingCommand };