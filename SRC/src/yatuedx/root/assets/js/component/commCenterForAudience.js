import {CommunicationSpace} from './communicationSpace.js';
import {DisplayBoard} 		from './displayBoard.js';
import {PTCC_COMMANDS}  	from '../command/programmingClassCommand.js'
import {OutgoingCommand}	from '../command/outgoingCommand.js'

const REPLACE_FOR_BODY = '{bdy}';
const REPLACE_FOR_LINE = '{ln}';
const REPLACE_FOR_TEXT = '{tx}';
const REPLACE_FOR_CLASS = '{clss}';
const REPLACE_FOR_WORD = '{wd}';

const WORD_SPLIT_SPACE_REGEX = /\S+/g;
const TAB_HTML_STRING = "&emsp;";
const TAB_STRING = "\t";
const SPACE_HTML_STRING = "&nbsp;";
const SPACE = " ";

// state machine:
const UNKNOWN_STATE = "US";
const SPACE_STATE = "SS";
const TEXT_STATE = "TxtS";

const TABLE_TEMPLATE =
`
<table>
  <tbody>
  {bdy}
  </tboday>
</table>`;

const LINE_TEMPLATE =
`
<tr id="line_{ln}">
  <td class="blob-num js-line-number js-code-nav-line-number" data-line-number="{ln}">{ln}</td>
  <td id="code_line_{ln}" class="blob-code displayCode">{tx}</td>
  <td id="comment_line_{ln}" class="blob-comment displayComment">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
</tr>
`;

const WORD_TEMPLATE =
`
<span class="{clss}">{wd}</span>
`;

class CommCenterForAudience extends CommunicationSpace { 
	#view;
	#liveSession;
	
	/*private*/
	constructor(liveSession, view) {
		super(view.videoAreaId, view.screenShareBtnId); 
		this.#view = view;
		this.#liveSession = liveSession;
		this.initUI();
	}
	
	/* 
	 static facotry method for DisplayBoardForCoding to assure that it calls its
	 async init method.
	 */
	static async createCommCenterForAudience(liveSession, view) {
		const myInstance = new CommCenterForAudience(liveSession, view);
		await myInstance.init(liveSession);
		return myInstance;
	}
	
	/**
		Initialize the EVENT handler for the UI
	**/
	initUI() {
		$('#yt_test_board').click(this.handleTest.bind(this));	
	}
	
	/*
	*/
	handleTest() {
	}
	
	get classTeacher() {
		return this.#liveSession.owner_name;
	}
	
	/*
		execute command from classroom
	*/
	v_execute(cmdObject) {
		// direct the command to UI
		let sendToUi = true;
		switch(cmdObject.id) {
			// set board mode to readonly or not
			case PTCC_COMMANDS.PTC_CLASSROOM_SWITCH_MODE:
				this.setClassMode(cmdObject);
				break;
				
			case PTCC_COMMANDS.PTC_CODE_RUN:
				// run code
				this.runCode(cmdObject);
				break;
			
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_REFRESH:
				this.dsiplayCode(cmdObject);
				break;
			
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_UPDATE:
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_HIGH_LIGHT:
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_VERTICALLY_SCROLL:
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_RE_SYNC:
			case PTCC_COMMANDS.PTC_PRIVATE_MSG:
			case PTCC_COMMANDS.GM_HELLO_FROM_PEER:	
				this.#view.v_execute(cmdObject);
				break;
				
			default:
				sendToUi = false
				break;
		}
	}
	
	/**	
		Control visibility of a user for video. Student override it to allow only 
		see the class teacher and herself, not other students.
	**/	
	v_isUserVisible(user) {
		if (this.classTeacher === user || this.me === user)
		{
			return true;
		}
		return false;
	}
	
	/**
		During exercise mode, student send their most recent code to teacher 
		to examine
	 **/
	updateCodeBufferAndSync(codeUpdateObj) {
		let cmd = this.composeContentUpateMsg(codeUpdateObj);
		if (cmd) {
			this.sendMessageToUser(this.classTeacher, cmd.str);
		}
	}
	
	/**
		During class,student can send messages to teacher at any time
	 **/
	sendMsgToTeacher(msg) {
		if (msg) {
			const cmd = new OutgoingCommand(PTCC_COMMANDS.GM_HELLO_FROM_PEER, 	// command id
											msg);								// msg body
			this.sendMessageToUser(this.classTeacher, cmd.str);
		}
	}
	
	/**
		Display formatted code samples on UI (VIEW)
	 **/
	dsiplayCode(cmdObject) {
		// save the code in our buffer
		const codeText = cmdObject.data[0];
		
		// format the code
		this.refresh(codeText);
		
		// send a "refresh" command to UI
		const uiCmd = {id: cmdObject.id, data: [ codeText, this.formatedText ] }
		this.#view.v_execute(uiCmd);
	}
	
	/**
		Run code samples on UI (VIEW)
	 **/
	runCode(cmdObject) {	
		// send an "execute" command to UI
		const uiCmd = {id: cmdObject.id, data: [ this.originalText ] }
		this.#view.v_execute(uiCmd);
	}
	
	/**
		Set class room mode to "readonly" or "readwrite"
	 **/
	setClassMode(cmdObject) {
		this.#view.v_execute(cmdObject);
	}
	
	/*
		Overload method for generating HTML for lines of code
	*/
	v_composeHtml() {
		const linesText = this._textLines;
		let lines = '';
		for(let i = 0; i < linesText.length;  ++i) {
			// wrap word with different color according to its nature
			const wordsHtml = this.prv_getWordWrap(linesText[i]);
			
			// form a code line
			lines += LINE_TEMPLATE
						.replace(new RegExp(REPLACE_FOR_LINE, 'g'), i)
						.replace(REPLACE_FOR_TEXT, wordsHtml);
		}
		return TABLE_TEMPLATE
						.replace(REPLACE_FOR_BODY, lines);
	} 
	
	/*
		private method
	*/
	prv_getWordWrap(wordLine) {		
		if (!wordLine)
			return "";
			
		// tokenize a line of words into a list of lnaguage specifc tokens
		const tokens = this.v_tokenizeString(wordLine);
		
		// wrap each token with proper span tags
		let wrappedLine = [];
		tokens.forEach(token => {	
			let css = MAP_JS_KEYWORD.get(token);
			if (!css) {
				css = NON_KEY_CLASS;
			}
			else if (css === TAB_CLASS) {
				// tab needs no span 
				css = '';
			}
			
			// span wrapping
			if (css) {
				wrappedLine += 
					WORD_TEMPLATE
						.replace(REPLACE_FOR_CLASS, css)
						.replace(REPLACE_FOR_WORD, token);
			}
			// no span wrapping
			else {
				wrappedLine += token;
			}
		});

		return wrappedLine; 
	}
	
	/*
		tokenize string for JScript, using a specified state-machine:
			StateFactory
	*/
	v_tokenizeString(wordLine) {
		const tokens = [];
		const tokennizationSM = new StateFactory(tokens);
		let state = tokennizationSM.create(UNKNOWN_STATE);
		for(let i = 0; i < wordLine.length; i++) {
			state = state.accept(wordLine[i]);
		}
		state.exit();
		return tokens;
	}
	
	/*
		Append one or space html elements to represent spacesHtml
	*/
	prv_getSpacesHtml(foundSpaces) {
		let spacesHtml = "";
		for(let i = 0; i < foundSpaces; i++) {
			spacesHtml += SPACE_HTML_STRING;
		}
		return spacesHtml;
	}
	
	/*
		Append one or space html elements to represent spacesHtml
	*/
	prv_founbdToken(begin, end) {
		return begin != -1 && end != -1 && end > begin
	}
	
	// Rid of extra Space
	//const wrods = wordLine.match(WORD_SPLIT_SPACE_REGEX);
	//wrods.forEach(word => {
			
	/*
		replace \t with const  = '&emsp;";
	*/
	prv_replaceTabs(lines) {
		const newLines = [];
		// replace all \t with &emsp;
		lines.forEach(l => newLines.push(l.replace(RegExp(TAB_STRING, 'g'), TAB_HTML_STRING)));
		return 	newLines;
	}
}

export { CommCenterForAudience };