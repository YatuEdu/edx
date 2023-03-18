import {StateAction, ParsingState}		from './parsingState.js'
import {ExpressionState}				from './expressionState.js'
import {TokenConst, TokenError}			from './token.js'
import {Variable}						from './variable.js'

class AssignmentState extends ParsingState {
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		
		super(beginPos, beginToken, scope, codeAnalyst);
		if (!beginToken.isName) {
			this.error = new TokenError("Invalid variable name found", beginToken);
			
		} else {
			// assignment to const is not allowed
			const v = scope.findVariable(beginToken.name, false);
			if (v && v.isConst) {
				this.error = new TokenError("Const variable can not be changed", beginToken);
			}
		}
		
		if (this.error) {
			codeAnalyst.errors.push(this.error);
		}
		this.stage = AssignmentState.BEGIN_STATE;
	}
	
	static get BEGIN_STATE() {return 0; }
	static get EXPR_STATE() {return 1; }
	
	advance(nextToken, pos) {
		if (this.error) {
			return new StateAction(null, this.error, true)
		}
		
		let nextState = null;
		let advanceToNext = false;
		do {
			if (AssignmentState.BEGIN_STATE === this.stage) {
				if (!nextToken.isAssignment) {
					this.error = new TokenError(TokenError.ERROR_INVALID_ASSIGNMENT_XPRESSION, nextToken);
					codeAnalyst.errors.push(this.error);
				}
				this.stage = AssignmentState.EXPR_STATE;
				// start the expression
				nextState = new ExpressionState(pos, nextToken, this.scope, this.codeAnalyst);
				nextState.parentState = this;
				advanceToNext = true;
				break;
			}
		
		}
		while(false);
		
		// go to expression state		 
		return new StateAction(nextState, this.error, this.stateEnded, advanceToNext);			
	}
	
	/**
		assignment is done, can add a new variable.
	 **/
	isTheLastToken(token) {
		this.stateEnded = true;
		if (AssignmentState.EXPR_STATE !== this.stage) {
			this.error = new TokenError(TokenError.ERROR_INVALID_ASSIGNMENT_XPRESSION, token);
			this.codeAnalyst.errors.push(this.error);
			return this.stateEnded;
		} 
		
		// expression state ended, we can add the new variable now if not already added
		const v = this.scope.findVariable(this.beginToken.name, false);
		if (!v) {
			// Implicit variable declaration as global (windows) variable
			const newVar = new Variable(this.beginToken, TokenConst.VAR_TYPE_WINDOW);
			this.scope.addWindowsVariable(this.beginToken.name, newVar); 
		}
		return this.stateEnded;	
	}	
}

export {AssignmentState}