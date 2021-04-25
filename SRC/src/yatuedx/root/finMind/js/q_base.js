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
	
	setValue(obj) {
		throw new Error('setValue: sub-class-should-overload-this');
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