import {StateAction, ParsingState}			from './parsingState.js'
import {CodeBlockState} 					from './codeBlockState.js'
import {Variable}							from './variable.js'
import {Scope}								from './scope.js'
import {TokenError, TokenConst}				from './token.js'

class FunctionDefState extends ParsingState {
	#funcName
	#funcArgumentMap
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.#funcArgumentMap = new Map();
		this.stage = FunctionDefState.FUNCTION_NAME_STATE;
	}
	
	static get FUNCTION_NAME_STATE() {return 0; }
	static get OPEN_BRACKET_STATE() {return 1; }
	static get ARGUMENT_STATE() {return 2; }
	static get ARGUMENT_SEPERATOR_STATE() {return 3; }
	static get FUNCTION_SIGNATURE_ENDED_STATE() {return 4; }
	static get FUNCTION_BODY_STATE() {return 5; }
	
	advance(nextToken, pos) {
		let bodyStarted = false;
		let nextState = null;
		do {
			if (this.stage === FunctionDefState.FUNCTION_NAME_STATE) {
				// check function name
				if (!nextToken.isName) {
					this.error = new TokenError("Invalid function name found", nextToken);
					break;
				}
					
				const foo = this.scope.findVariable(nextToken.name, true);
				if (foo) {
					this.error = new TokenError("Function name declared before", nextToken);
					break;
				}
				this.#funcName = nextToken;
				this.stage = FunctionDefState.OPEN_BRACKET_STATE;
				break;
			}
			
			if (this.stage === FunctionDefState.OPEN_BRACKET_STATE) {
				// check "("
				if (!nextToken.isOpenRoundBracket) {
					this.error = new TokenError("Invalid function syntax. '(' expected", nextToken);
					break;
				}
					
				this.stage = FunctionDefState.ARGUMENT_STATE;
				break;
			}
			
			if (this.stage === FunctionDefState.ARGUMENT_STATE) {
				// check if definition ended
				if (nextToken.isCloseRoundBracket) {
					this.stage = FunctionDefState.FUNCTION_SIGNATURE_ENDED_STATE;
					break;
				}
				
				// check variable name
				if (!nextToken.isName) {
					this.error = new TokenError("Invalid function argument. A variable name is expected", nextToken);
					break;
				}
				
				// add argument
				this.#addNewArgument(nextToken);
				
				this.stage = FunctionDefState.ARGUMENT_SEPERATOR_STATE;
				break;
			}
			
			if (this.stage === FunctionDefState.ARGUMENT_SEPERATOR_STATE) {
				// check if definition ended
				if (nextToken.isCloseRoundBracket) {
					this.stage = FunctionDefState.FUNCTION_SIGNATURE_ENDED_STATE;;
					break;
				}
				
				// check coma
				if (!nextToken.isComma) {
					this.error = new TokenError("Invalid function definition syntax.',' is expected", nextToken);
					break;
				}
					
				this.stage = FunctionDefState.ARGUMENT_STATE;
				break;
			}
			
			// Expecting function "{}" Block
			if (this.stage === FunctionDefState.FUNCTION_SIGNATURE_ENDED_STATE) {
				// check if definition ended
				if (!nextToken.isOpenCurlyBracket) {
					this.error = new TokenError("Invalid function definition syntax.'{' is expected", nextToken);
					break;
				}
				
				// add all function arguments into the function block scope if any
				let funcScope = this.scope;
				if (this.#funcArgumentMap.size > 0) {
					funcScope = new Scope(this.scope);
					this.#funcArgumentMap.forEach((v,k) => funcScope.addLocalVariable(k, new Variable(v, TokenConst.VAR_TYPE_FUNC_PARAMETER)));
				}
				this.stage === FunctionDefState.FUNCTION_BODY_STATE;
				
				// entering function body block state
				nextState = new CodeBlockState(pos, nextToken, funcScope, this.codeAnalyst);	
				nextState.parentState = this;
				this.stage = FunctionDefState.FUNCTION_BODY_STATE;
				break;
			}
			
			// unkown state
			this.error = new TokenError("Invalid function definition syntax", nextToken);
			break;
		} while(true);
		
		if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		
		return new StateAction(nextState, this.error, this.stateEnded);
	}
	
	// function block end?
	isTheLastToken(token) {
		// functiona body ends, so we are completely done
		if (this.stage === FunctionDefState.FUNCTION_BODY_STATE && token.isCloseCurlyBracket) {
			const newFunction = new Variable(this.#funcName, TokenConst.VAR_TYPE_FUNCTION);
			this.scope.addWindowsVariable(this.#funcName.name, newFunction); 
			this.stateEnded = true;
		}
		return this.stateEnded;	
	}

	// add an argument
	#addNewArgument(token) {
		if (this.#funcArgumentMap.get(token.name)) {
			this.error = new TokenError("Duplicate argument name used", token);
		} else {
			this.#funcArgumentMap.set(token.name, token); 
		}
	}	
}

export {FunctionDefState}