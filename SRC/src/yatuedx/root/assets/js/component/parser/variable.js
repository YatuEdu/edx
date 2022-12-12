import {TokenConst, Token}		from '../parser/token.js'

class Variable {
	#token
	#type
	#dataType
	
	constructor(token, type) {
		this.#token = token;
		this.#type = type;
		this.#dataType = TokenConst.VAR_DATA_UNKNOWN;	
	}
	
	get token() { return this.#token; }
	get type() { return this.#type; }
	get isLocal() { return this.#type === TokenConst.VAR_TYPE_LET; }
	get isConst() { return this.#type === TokenConst.VAR_TYPE_CONST; }
	get isFunctionParameter() { return this.#type === TokenConst.VAR_TYPE_FUNC_PARAMETER; }
	get isFunction() { return this.#type === TokenConst.VAR_TYPE_FUNCTION; }
	get isTemp() { return this.#type === TokenConst.VAR_TYPE_TEMP; }
	get dataType() { return this.#dataType; }
	set dataType(dt) { this.#dataType = dt; }
}

export {Variable}