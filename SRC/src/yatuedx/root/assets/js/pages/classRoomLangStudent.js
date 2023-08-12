import {ClassRoomLang} 					from './classRoomLang.js'
import {PageUtil, StringUtil, RegexUtil, UtilConst, CollectionUtil}	from '../core/util.js';
import {PTCC_COMMANDS}					from '../command/programmingClassCommand.js'
import {DisplayBoardForCoding}			from '../component/displayBoardForCoding.js'

const DIV_VIEDO_AREA 					= "yt_div_video_area";
const BTN_SHARE_SCREEN 					= "yt_btn_share_screen";
const YT_DIV_TEXT_INPUT_ID              = "yt_div_text_board";

class ClassRoomLangStudent extends ClassRoomLang {
	#displayBoardForCoding 
	#groupId
    #sequenceId

	/* 
	 static facotry method for JSClassRoomTeacher to assure that it calls its
	 async init method.
	 */
	 static async createClassRoomLangStudent() {
		const myInstance = new ClassRoomLangStudent();
		await myInstance.init();
		return myInstance;
	}

    constructor() {
		super(YT_DIV_TEXT_INPUT_ID, DIV_VIEDO_AREA, BTN_SHARE_SCREEN)
	}

    async init() {
        this.#displayBoardForCoding = 
				await DisplayBoardForCoding.createDisplayBoardForCoding(
													this.liveSession, 
													this);
				this.#groupId = this.liveSession.group_id;
				this.#sequenceId = this.liveSession.sequence_id;
    }

    /**
		Execute a command encapsulated by command string (cmd)
	**/
	v_execute(cmd) {
		console.log("received command:" + cmd.id);
		switch(cmd.id) {
			// set board mode to readonly or not
			case PTCC_COMMANDS.PTC_CLASSROOM_SWITCH_MODE:
				//this.setClassMode(cmd.data[0]);
				break;
				
			// update the sample code
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_UPDATE:
				this.updateCodeSample(cmd.data);
				break;
				
			// highlight a range of text
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_HIGH_LIGHT:
				this.highlightSelection(cmd.data[0], cmd.data[1]);
				break;			
			// Sroll up or down
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_VERTICALLY_SCROLL:
				this.scrollVertically(cmd.data[0]);
				break;
			// resync my code with teachwer
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_RE_SYNC:
				//this.syncCodeWithTeacherer(cmd);
				break;
				
			// run code sample and show result on console
			case PTCC_COMMANDS.PTC_CODE_RUN:
				//this.runCodeFrom(cmd.data[0]);
				break;
				
			// GOT message from peers
			case PTCC_COMMANDS.PTC_PRIVATE_MSG:
				//this.receiveMsgFrom(cmd);
				break;
				
			default:
				break;
		}
	}

    /**
		Append or replace Code Smaple on the Whiteboard
	**/	
	updateCodeSample(how) {
		// obtain the new code sample using an algorithm defined in parent class as a static method
		const {newContent, digest} = ClassRoomLang.updateContentByDifference(how, this.code);
		
		// update the code on UI
		this.code = newContent;
		
		// close output in teaching mode (when new code comes)
		//if (this.#isInTeachingMode) {
		//	this.#codeInputConsoleComponent.hideOutput();
		//}
		if (!newContent) {
			return;  // no need to validate
		}
		
		// verify the digest if it is present
		if (digest) {
			if (StringUtil.verifyMessageDigest(newContent, digest)) { 
				console.log('verfied content');
			} else {
				console.log('content not verified, asking for re-sync');
				this.#displayBoardForCoding.askReSync(this.#displayBoardForCoding.classTeacher);
			}
		}
		else {
			console.log('No digest available');
		}
	}
}

let langClassRoom = null;

// A $( document ).ready() block.
$( document ).ready(async function() {
    console.log( "LangClassRoom page ready!" );
	langClassRoom = await ClassRoomLangStudent.createClassRoomLangStudent();
});