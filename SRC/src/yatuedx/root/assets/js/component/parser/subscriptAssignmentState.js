import {StateAction, ParsingState}		from './parsingState.js'
import {CodeBlockState}					from './codeBlockState.js'
import {ExpressionState}				from './expressionState.js'
import {ArraySubscriptionState}			from './arraySubscriptionState.js'
import {TokenError, TokenConst}			from './token.js'
import {Scope}							from '../parser/scope.js'

class SubscriptAssignmentState extends ParsingState {
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.stage = SubscriptAssignmentState.SUBSCRIPT_STATE;
	}
	
	static get SUBSCRIPT_STATE() {return 0; }
	static get ASSIGNMENT_INIT_STATE() {return 1; }
	static get ASSIGNMENT_STATE() {return 2; }
	
	advance(nextToken, pos) {
		let nextState = null;
		let stateEnded = false;
		let advanceToNextToken = true;
		do {
			if (nextToken.isName && this.stage == SubscriptAssignmentState.SUBSCRIPT_STATE) {
				this.stage = SubscriptAssignmentState.ASSIGNMENT_INIT_STATE;
				
				// entering ArraySubscriptionState state, push this state to stack
				nextState = new ArraySubscriptionState(pos, nextToken, this.scope, this.codeAnalyst);
				break;
			}		
			
			if (nextToken.isAssignment && this.stage == SubscriptAssignmentState.ASSIGNMENT_INIT_STATE) {
				this.stage = SubscriptAssignmentState.ASSIGNMENT_STATE;
				
				// IF-state ended nicely, enter a new code block:
				nextState = new ExpressionState(pos,nextToken, this.scope, this.codeAnalyst);	
				stateEnded = true;					
				break;
			}
			
			// error
			// if we come here, we run into unknown token
			this.error = new TokenError("Invalid subscript assignment syntax.", nextToken);
		} while (false);
		
		if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		return new StateAction(nextState, this.error, stateEnded, advanceToNextToken);
	}
}

export {SubscriptAssignmentState}
