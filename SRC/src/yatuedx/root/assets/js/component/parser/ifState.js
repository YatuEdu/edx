import {StateAction, ParsingState}		from './parsingState.js'
import {CodeBlockState}					from './codeBlockState.js'
import {ExpressionState}				from './expressionState.js'
import {TokenError, TokenConst}			from './token.js'
import {Scope}							from '../parser/scope.js'

class IfState extends ParsingState {
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.stage = IfState.INIT_STATE;
	}
	
	static get INIT_STATE() {return 0; }
	static get IN_EXPRE() {return 1; }
	static get IF_ENDED() {return 2; }
	
	advance(nextToken, pos) {
		let nextState = null;
		let stateEnded = false;
		let skipThisToken = false;
		do {
			if (nextToken.isOpenRoundBracket && this.stage == IfState.INIT_STATE) {
				nextToken.blockTag = TokenConst.BLOCK_TAG_IF_START;
				this.stage = IfState.IN_EXPRE;
				// entering expression state, push this state to stack
				nextState = new ExpressionState(pos, nextToken, this.scope, this.codeAnalyst);
				break;
			}		
			
			if (this.stage == IfState.IN_EXPRE) {
				this.stage = IfState.IF_ENDED;
				// IF-state ended nicely, enter a new code block:
				nextState = new CodeBlockState(pos, 					// current token position
											nextToken, 				// starting token
											new Scope(this.scope), 	// new scope spawned from the current one
											this.codeAnalyst);		
				stateEnded = true;
				break;
			}
			
			// if we come here, we run into unknown token
			this.error = new TokenError("Invalid state in 'if' statement.", nextToken);
		} while (false);
		
		if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		return new StateAction(nextState, this.error, stateEnded);
	}
}

export {IfState}