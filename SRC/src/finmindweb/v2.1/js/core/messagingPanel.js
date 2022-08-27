import {credMan} 				from './credManFinMind.js';
import {MessagingMan} 			from './messaging.js'
import {TimeUtil, ArrayUtil}	from './util.js';

const template_for_datetime = `
<div class="text-center fs-8 text-body text-opacity-50">
{msg_time}
</div>`;

const template_for_message_left = `
<div class="chat-left d-flex align-items-start my-3">
  <div class="chat-avatar rounded-pill overflow-hidden me-2">
    <img src="../img/avatar-demo.jpeg" class="img-fluid">
  </div>
  <div class="chat-msg">
	<h6 class="fs-8 text-body text-opacity-50 mb-1">{src}</h6>
    <article class="bg-white fs-7 text-body text-opacity-75 order-3">
        {msg}
    </article>
</div>
</div>
`;

const template_for_message_right_text = `
<div class="chat-right d-flex align-items-start justify-content-end my-3">
	<div class="chat-msg">
		<h6 class="fs-8 text-end text-body text-opacity-50 mb-1">{usr}</h6>
		<div class="d-flex align-items-center">
        <article class="bg-primary fs-7 text-white">
        {msg}
        </article>
		</div>
	</div>
</div>
`;

const template_for_message_right_image = `
<div class="chat-right d-flex align-items-start justify-content-end my-3">
	<div class="chat-msg">
		<h6 class="fs-8 text-end text-body text-opacity-50 mb-1">{usr}</h6>
		<div class="d-flex align-items-center">
			<article class="bg-primary fs-7 text-white text-opacity-75 order-3">
				<div class="d-flex">
					<div class="me-3 ">
						<h6 class="fs-7">{f_name}</h6>
						<span class="fs-8 text-body text-opacity-50">{f_size}</span>
					</div>
					<div>
						<img src="../img/{f_ico}.svg" style="width: 2rem;">
					</div>
				</div>
			</article>
		</div>
	</div>
</div>
`;

const template_for_message_left_image = `
<div class="chat-left d-flex align-items-start my-3">
  <div class="chat-avatar rounded-pill overflow-hidden me-2">
    <img src="../img/avatar-demo.jpeg" class="img-fluid">
  </div>
  <div class="chat-msg">
    <h6 class="fs-8 text-body text-opacity-50 mb-1">{src}</h6>
    <div class="d-flex align-items-center">
        <article class="bg-white fs-7 text-body text-opacity-75 order-3">
            <div class="d-flex">
                <div class="me-3">
                    <h6 class="fs-7">{f_name}</h6>
                    <span class="fs-8 text-body text-opacity-50">{f_size}</span>
                </div>
                <div>
                    <img src="../img/ico-file-pdf.svg" style="width: 2rem;">
                </div>
            </div>
        </article>
    </div>
  </div>
</div>
`;

const replacementForSource = '{src}';
const replacementForMessage = '{msg}';
const replacementForUserName = '{usr}';
const replacementForFileName = '{f_name}';
const replacementForFileSize = '{f_size}';
const replacementForFileIco = '{f_ico}';
const replacementForDateTime = '{msg_time}';


const MSG_LEFT = 'FinMind Assistant';
const MSG_RIGHT = 'Tim Wang';
const TODAY =  'Today';
const YESTERDAY = 'Yesterday';


const msgTemplateMap = new Map([
    [ '2_1', {src: MSG_LEFT, template: template_for_message_left} ],  			// message text from agent
	[ '1_1', {src: MSG_RIGHT, template: template_for_message_right_text} ],  	// message text from user
	[ '1_2', {src: MSG_RIGHT, template: template_for_message_right_image} ],  	// message image from user
    [ '2_2', {src: MSG_LEFT, template: template_for_message_left_image} ],  			// message image from user
]);

class MessagingPanel {

	#maxMessage;
	#messagingMan;

	constructor(maxMessage, appId) {
		this.#maxMessage = maxMessage;
		this.#messagingMan = new MessagingMan(appId);
	}

	/*
		Obtain the html representation for a list of messages
	*/
	displayHtml(msseages) {
		let html = '';
		if (ArrayUtil.isEmpty(msseages)) {
			return html;
		}

		// SHOW ALL MESSAGES in reverse order
		let msgDateTimeStr = null;
		let len = msseages.length > this.#maxMessage ? this.#maxMessage : msseages.length;
		for (let i = len - 1; i >= 0; i--) {
			const msg = msseages[i];

			// show message date and time (accurate to minutes)
			const newDTString =  this.getDateTimeFormatedStr(msg.msg_time);
			if (msgDateTimeStr != newDTString) {
				// show a new dateString
				msgDateTimeStr = newDTString;
				html += template_for_datetime
							.replace(replacementForDateTime, msgDateTimeStr);
			}
            let myRole = credMan.credential.role;
            let temKey = null;

            if ((myRole==='agent' && msg.msg_source===2)
                || (myRole==='user' && msg.msg_source===1)
            ) {
                temKey = `1_${msg.msg_type}`;
            } else {
                temKey = `2_${msg.msg_type}`;
            }

            let msgSource = null;
            if (msg.msg_source===1) {
                msgSource = "User";
            } else if (msg.msg_source===2) {
                msgSource = "FinMind Assistant";
            }
            let fileName = '';
            if (msg.msg_type===2) {
                fileName = msg.msg_deails;
            }
            let fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
            if (fileType==='jpeg' || fileType==='bmp')
                fileType = 'jpg';
			let msgData = msgTemplateMap.get(temKey);

			html += msgData.template
                .replace(replacementForSource, msgSource)
                .replace(replacementForMessage, msg.msg_deails)
                .replace(replacementForFileName, fileName)
                .replace(replacementForFileSize, '')
                .replace(replacementForFileIco, 'ico-file-'+fileType)
                .replace(replacementForUserName, credMan.credential.name);
		}
		return html;
	}

	getDateTimeFormatedStr(msgTime) {
		const msgdateNow = new Date(msgTime);
		const now = Date.now();

		const diffDay = TimeUtil.diffDays(msgdateNow, now);
		let dayStr = '';
		if (diffDay == 0) {
			dayStr = TODAY;
		}
		else if (diffDay == 1) {
			dayStr = YESTERDAY;
		}
		else {
			dayStr = TimeUtil.getDateString(msgdateNow);
		}
		const timeString = TimeUtil.getTimeStringWithoutSeconds(msgdateNow);
		return `${dayStr} ${timeString}`;
	}

	async getMessages() {
		const mewMsgCount = await this.#messagingMan.getMessages();
		if (mewMsgCount > 0) {
			return this.displayHtml(this.#messagingMan.messages);
		}

		return '';
	}

	async sendMsg(type, msg) {
		const mewMsgCount = await this.#messagingMan.sendMessage(type, msg);
		if (mewMsgCount > 0) {
			const topMsgList = this.#messagingMan.messages.slice(0, mewMsgCount);
			return this.displayHtml(topMsgList);
		}

		return '';
	}
}

export { MessagingPanel };
