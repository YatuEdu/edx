import {ComponentBase}		from './componentBase.js';

const CONTAINER_HTML_TMPLATE = `<div id="msg_input_output_container" class="row mb-0">
    <div class="col-12 code-console-container-dimention">
        <div class="msg-board msg-board-dimention-midium"
            id="{msgoutputid}" 
            placeholder="Enter study notes here"
            spellcheck="true">
        </div>
        <textarea class="msg-board msg-board-dimention-small"
            style="height: 100%;"
            id="{msginputid}" 
            spellcheck="true" 
            placeholder="Enter your messages"
            rows="2"></textarea>
    </div>
</div>`

const MESSAGE_HTML_TMPLATE = 
`<div title="{from}" class="row mb-0">
    <div class="col-10 {msgstyle}">{msgcontent}</div>
</div>`;


const CSS_MESSAGE_IN = "msg_in";
const CSS_MESSAGE_OUT = "msg_out";

const REPLACE_MSG_OUTPUT = "{msgoutputid}";
const REPLACE_MSG_INPUT  = "{msginputid}";
const REPLACE_MSG_STYLE = "{msgstyle}"
const REPLACE_MSG_CONTENT = "{msgcontent}";
const REPLACE_MSG_TITLE = "{from}";

const MSG_SENDER_ME = "me";

class MessageBoard extends ComponentBase {
	#sendMessageMethod

	constructor(parentDivId, sendMessageMethod) {
		super("id", "message boards", parentDivId);
		this.#sendMessageMethod = sendMessageMethod;

		const componentHtml = CONTAINER_HTML_TMPLATE
								.replace(REPLACE_MSG_INPUT, this.messageInputId)
								.replace(REPLACE_MSG_OUTPUT, this.messageOutputId);
								
		// mount the component to UI
		super.mount(componentHtml, ComponentBase.MOUNT_TYPE_INSERT);
		
		// hook up event handleer
        $(this.messageInputSelector).keydown(this.#handleSendMessage.bind(this));
	}

    /***
     * public facing methods
     */
    displayMessage(who, msg) {
        let css = ""
        let displayMessage = msg
        if (who === MSG_SENDER_ME) {
            css = CSS_MESSAGE_OUT;
        } else {
            css = CSS_MESSAGE_IN;
        }
       
        let msgHtml =  MESSAGE_HTML_TMPLATE
                            .replace(REPLACE_MSG_STYLE, css)
                            .replace(REPLACE_MSG_CONTENT, displayMessage)
                            .replace(REPLACE_MSG_TITLE, who)
        $(this.messageOutputSelector).append(msgHtml);
    }
	
	/* event handler */
	 
    /***
      * Send message button clicked and send message to the group. This only works during live class.
    */
    #handleSendMessage(e) {
        if(e.which !== 13){ 
            return;
        }

        const outgoingMsg = $(e.target).val();

        // send message to teacher (so far we only allow messages between student and teacher)
        //this.#displayBoardForCoding.sendMsgToTeacher(outgoingMsg);
        this.#sendMessageMethod(outgoingMsg)

        // display my message as well
        this.displayMessage(MSG_SENDER_ME, outgoingMsg);

        // clear sent messages:
        $(e.target).val("");

        // prevent "enter"" to be populated and handled further
        e.stopPropagation();
        e.preventDefault(); 			
    }
	
	/* getters / setters */
	
    get messageContainerId() {
        return "msg_input_output_container";
    }

    get messageContainerSelector() {
        return `#${this.messageContainerId}`;;
    }

	// message input id
	get messageInputId() {
		return "yt_ta_msg_input"
	}

    get messageInputSelector() {
		return `#${this.messageInputId}`;
	}

    get messageOutputId() {
		return "yt_div_msg_output"
	}

    get messageOutputSelector() {
		return `#${this.messageOutputId}`;
	}

    /***
     * Private methods
     */
	
}

export {MessageBoard}