class UserQuestionBase {
	/**
		qInfo is an object coming from finMind server:
		{block_id, attr_id, attr_name, attr_type, attr_label, attr_question, sequence_id,
		 iv1, iv2, dv1, dv2, sv1, sv2, sv3, sv4, sv5, }
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
	
	// property getter for question name 
	get name() {
		return this.#qInfo.attr_name;
	}
	
	// property getter for question label 
	get label() {
		return this.#qInfo.attr_label;
	}
	
	// property getter for question text 
	get question() {
		return this.#qInfo.attr_question;
	}
	
	// property getter for question type 
	get type() {
		return this.this.#qInfo.attr_type;
	}
	
	// get XML element for parent control if I am serving as a sub-control
	get xmlElement() {
		throw new Error('signature: sub-class-should-overload-this');
	}
	
	// get display html 
	get displayHtml() {
		throw new Error('displayHtml: sub-class-should-overload-this');
	}
	
	// get xml for service
	get serverXML() {
		throw new Error('serverXML: sub-class-should-overload-this');
	}
}

export { UserQuestionBase };