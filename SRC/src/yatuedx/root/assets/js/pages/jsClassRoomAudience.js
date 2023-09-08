import {ClassRoomAudience} 				    from './classRoomAudience.js';
import {ProgrammingClassCommandUI}          from './programmingClassCommandUI.js';

const BTN_RUN_CODE  					= "yt_btn_run_code_on_student_board";

class JSClassRoomAudience extends ClassRoomAudience {
	#programmingClassCommandUI;
	
    constructor(classMode, groupType, groupId, sequenceId) {
        super(classMode, groupType, groupId, sequenceId)
    }
	
    async init() {
        await super.init()
        
		this.#initUi()

        // creating programming support component
        this.#programmingClassCommandUI = new ProgrammingClassCommandUI(this.contentInputConsole.inputId, this.contentInputConsole.outputId);

        // hook up event 'run code sample'
        $(this.runCodeButton).click(this.#handleRun.bind(this));
    }

	// show features not related to this console:
	#initUi() {
		$(this.forCodingOnlyClassSelector).show()
	}
	  
    /**
     *  Event handlers
     */

    /*
		Hnandle running code using text from code baord
	*/
	#handleRun(e) {
		e.preventDefault(); 
		
		//obtain code from local "exercise board" and execute it locally
		this.#runCodeFrom(null);
	}
  
    /*
		Run JS Code Smaple (from remote source) and print results on the Console
	*/
	v_remoteRun(codeText) {
		//if (this.#isInTeachingMode) { todo
			// when in teaching mode, only show out put for this run
		//	$(this.resultConsoleControl).val("");
		//}
		let errorInfo = null;
		if (codeText) {
			this.#runCodeFrom(codeText)
        }
	}

    /**
     *  Getters and Setters
     */

	get runCodeButton() {
		return `#${BTN_RUN_CODE}`;
	}

    /**
     * Overridden methods
     */

	/*
	 * Run code when teacher asked from remote end
	 * @param {*} code 
	 */
	v_runCodeFrom(code) {
		this.#runCodeFrom(code)
	}

    /*
		Run JS Code from given code text, or from code input consoole
	*/
	#runCodeFrom(codeText) {
		let errorInfo = null;
		if (!codeText) {
			// run code locally text console
			errorInfo = this.#programmingClassCommandUI.runCodeFromTextInput()
		} else {
			// run code from teacher
			errorInfo = suthis.#programmingClassCommandUI.executeCode(codeText);
		}

        	// display error?
		if (errorInfo) {
			this.contentInputConsole.showDiagnoticMessage(errorInfo);
		} 
	}
}

export {JSClassRoomAudience}

