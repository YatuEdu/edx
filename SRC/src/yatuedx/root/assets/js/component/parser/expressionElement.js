class ExpressionElement {
	#token
	
	constructor(token) {
		this.#token = token;
	}
	
	get token() { return this.#token}
	
	// overridable methods
	
	// this method decides if two expression elements can be adjacent to each other
	// the calling of this method is in form of: a.canBeFollowedBy(b), where a is the first element and
	// b is the element after a.
	canBeFollowedBy(another) { return true }
}

export { ExpressionElement } 