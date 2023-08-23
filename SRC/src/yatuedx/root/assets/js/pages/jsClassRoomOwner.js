import {ClassRoomOwner} 				    from './classRoomOwner.js';
import {ProgrammingClassCommandUI}          from './programmingClassCommandUI.js';

const BTN_RUN_CODE  					= "yt_btn_run_code_on_student_board";

class JSClassRoomOwner extends ClassRoomOwner {
	#programmingClassCommandUI;
	
    constructor(classMode, groupType, groupId, sequenceId) {
        super(classMode, groupType, groupId, sequenceId)
    }
	
    async init() {
        await super.init()
        // creating programming support component
        this.#programmingClassCommandUI = new ProgrammingClassCommandUI(this.contentInputConsole.inputId, this.contentInputConsole.outputId);

        // hook up event 'run code sample'
        $(this.runCodeButton).click(this.handleRunCode.bind(this));

		// handle maximize or minimize video screen
		$(this.videoAreaId).click(this.toggleVideoSize);

    }

    /**
     *  Event handlers
     */


    /**
		Run code sample on students board
	**/
	handleRunCode(e) {
		e.preventDefault(); 
		
		// run code locally first
		const errorInfo = this.#programmingClassCommandUI.runCodeFromTextInput();
		
		// run code for each student second if we are in teaching mode
		if (this.classMode === 0) {
			this.commCenterForTeacher.runCode();
		}
		
		// display error?
		if (errorInfo) {
			this.contentInputConsole.showDiagnoticMessage(errorInfo);
		} else {
			// show output cosole
			this.contentInputConsole.showOutput();
		}
	}

    /**
     *  Getters and Setters
     */
	get runCodeButton() {
		return `#${BTN_RUN_CODE}`;
	}
}

export {JSClassRoomOwner}

