import {Net} 		from './net.js'
import {credMan} 	from './credManFinMind.js';
import {ArrayUtil}	from './util.js';

const replqcementForMessageText = '{msg_text}';

class MessagingMan {  
    #template_text_msg;
	#template_img_msg;
	#messageList;
	#appId;
	
    constructor(appId){ 
		this.#appId = appId;
		this.#messageList = [];
	}
	
	/**
		Retrieve all messages from finMind.
	**/
	async getMessages() {
		const retData = await Net.getMessages(this.#appId, credMan.credential.token);
		if (retData) {
			return this.mergeMessages(retData.data);
		}
		
		return 0;
	}
	
	/**
		send a message to finMind.
	**/
	async sendMessage(type, msg) {
		const retData = await Net.sendMessages(this.#appId, type, msg, credMan.credential.token);
		
		// a change to sync new messages after sending a message
		if (retData) {
			return this.mergeMessages(retData.data);
		}
		
		// error, UI decides what message to show
		return 0;
	}
	
	/**
		Merge new messages with the old messages from finMind.
		Note that the messages come in in reverse chronological order
		so that we only need to add new messages.
	**/
	mergeMessages(allMessageList) {
		if (ArrayUtil.isEmpty(this.#messageList)) {
			this.#messageList = allMessageList;
			return this.#messageList.length;
		}
		
		// add new messages if not already in, since
		// allMessageList is desending, we only need to find the top N 
		// elelemnts that are new.
		let i = 0;
		for (; i < allMessageList.length; i++ ) {
			const m = allMessageList[i];
			if (this.#messageList.find(e => e.id == m.id )) {
				break;
			}
			// Insert a new message at the beginning
			this.#messageList.unshift(m);
		}
		
		//"i" new messages added
		return i;  
	}
	
	get messages() {
		return this.#messageList;
	}
}

export {MessagingMan};


	
	
   