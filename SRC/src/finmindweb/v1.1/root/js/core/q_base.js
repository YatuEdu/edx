class UserQuestionBase {
	/**
		qInfo is an object coming from finMind server:
		{attr_id, question_text, attr_type, iv1, iv2, sv1, sv2, dv1, dv2}
	**/
	#qInfo;
	
	/**
		public methods
	**/
    constructor(qInfo) {
		this.#qInfo = qInfo;
	}
	
	// virtual method for hooking up event handler to handleEvent
	// question answer change event
	onChangeEvent() {
		throw new Error('onChangeEvent: sub-class-should-overload-this');
	}
	
	// This method can be called after the UI is rendered to display its
	// input value (or selection fo check box and radio button and dropdown)
	setDisplayValue() {
	}
	
	// This method can be called when we need to serialize the question / answer
	// to JSON format (usually for session store)
	serialize() {
		throw new Error('serialize: sub-class-should-overload-this');
	}
	
	// virtual method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		throw new Error('onChangeEvent: sub-class-should-overload-this');
	}
	
	// property getter for qInfo 
	get qInfo() {
		return this.#qInfo;
	}
	
	// property getter for question id 
	get id() {
		return this.#qInfo.attr_id;
	}
	
	// property getter for question text 
	get question() {
		return this.#qInfo.question_text;
	}
	
	// property getter for question type 
	get type() {
		return this.this.#qInfo.attr_type;
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