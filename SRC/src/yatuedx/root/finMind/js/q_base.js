class UserQuestionBase {

	/**
		public methods
	**/
    constructor(id, txt, type) {
		// init
		this._qid = id;
		this._qText = txt;
		this._qType = type;
	}
	
	// virtual method for hooking up event handler to handleEvent
	// question answer change event
	onChangeEvent() {
		throw new Error('onChangeEvent: sub-class-should-overload-this');
	}
	
	// virtual method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		throw new Error('onChangeEvent: sub-class-should-overload-this');
	}
	
	// property getter for question id 
	get id() {
		return this._qid;
	}
	
	// property getter for question text 
	get question() {
		return this._qText;
	}
	
	// property getter for question type 
	get type() {
		return this._qType;
	}
	
	// get display html 
	get displayHtml() {
		throw new Error('displayHtml: sub-class-should-overload-this');
	}
	
	// get xml for service
	get serverXML() {
		throw new Error('displayHtml: sub-class-should-overload-this');
	}
}

export { UserQuestionBase };