import {ClassRoomOwner} 				    from './classRoomOwner.js';
import {ProgrammingClassCommandUI}          from './programmingClassCommandUI.js';

class JSClassRoomOwner extends ClassRoomOwner {
	#programmingClassCommandUI;
	
    constructor(classMode, groupType, groupId, sequenceId) {
        super(classMode, groupType, groupId, sequenceId)
    }
	
    async init() {
        await super.init()
		
        // creating programming support component
        this.#programmingClassCommandUI = new ProgrammingClassCommandUI(this.contentInputConsole.inputId, this.contentInputConsole.outputId);

		// initialize UI
		this.#initUi()

        // hook up event 'run code sample'
        $(this.runCodeButton).click(this.handleRunCode.bind(this));
    }

	/*
	 initialize UI elements
	 */
	#initUi() {
		// show features not related to this console:
		$(this.forCodingOnlyClassSelector).show()
	}

    /**
     *  Event handlers
     */


    /*
		Run code sample on students board
	*/
	handleRunCode(e) {
		e.preventDefault(); 
		
		// run code locally first
		const errorInfo = this.#programmingClassCommandUI.runCodeFromTextInput();
		
		// run code for each student second if we are in teaching mode
		if (this.classMode === 0) {
			this.commCenterForPresenter.runCode();
		}
		
		// display error?
		if (errorInfo) {
			this.contentInputConsole.showDiagnoticMessage(errorInfo);
		}
	}
}

export {JSClassRoomOwner}

