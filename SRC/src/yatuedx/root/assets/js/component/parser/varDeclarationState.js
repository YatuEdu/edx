import {StateAction, ParsingState}		from './parsingState.js'
import {Variable}						from './variable.js'
import {TokenError}						from './token.js'
import {ExpressionState} 				from './expressionState.js'


class VarDeclarationState extends ParsingState {
	#varToken
	#varType
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.#varType = beginToken.varType;
		this.stage = 0
	}
	
	// next token must be a variable name
	advance(token, pos) {
		let nextState = null;
		let skipNextToken = false;
		do {
				
			if (this.stage == 0) {
				this.stage = 1;
				
				// invalid variable name or variable was declared before?
				if (!token.isName) {
					this.error = new TokenError("Invalid variable name found", token)
				} else if (this.scope.findVariable(token.name, true)) {
					this.error = new TokenError(`Variable "${token.name}" has already been declared in the same scope.`, token)
				}
				this.#varToken = token;
				break;
			}
			
			if (this.stage == 1) {
				if (token.isAssignment) {
					// enter expression state
					this.stage = 2;
					nextState = new ExpressionState(pos, token, this.scope, this.codeAnalyst);
					nextState.parentState = this;
				} else {
					// error if const var is not assigned
					if (this.beginToken.isConstVarDeclaration) {
						this.error = new TokenError(`Variable "${this.beginToken.name}" needs to be assigned.`, this.beginToken);
						break;
					}
					this.stateEnded = true;
				}
				break;
			}
			
		} while(false);
		
		if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		return new StateAction(nextState, this.error, this.stateEnded);
	} 
	
	// assignment is done, can add a new variable
	isTheLastToken(token) {
		if (this.stage == 2) {
			// add a new variable
			const newVar = new Variable(this.#varToken, this.#varType);
			this.scope.variableMap.set(this.#varToken.name, newVar); 
			this.stateEnded = true;
		} else {
			this.error = new TokenError("Variable declaration invalid state encountered", token);
			this.codeAnalyst.errors.push(this.error);
		}
		return this.stateEnded;	
	}	
}

export {VarDeclarationState}

