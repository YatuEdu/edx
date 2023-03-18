import {StateAction, ParsingState}		from './parsingState.js'
import {ExpressionState} 				from './expressionState.js'
import {AssignmentState}				from './assignmentState.js'
import {CodeBlockState}					from './codeBlockState.js'
import {VarDeclarationState}			from './varDeclarationState.js'
import {TokenError, TokenConst}			from './token.js'
import {Scope}							from './scope.js'

class ForOfExpressionState extends ParsingState {
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.stage = ForOfExpressionState.BEGIN_STATE;
	}
	
	static get BEGIN_STATE() {return 0; }
	static get ELEMENT_VAR_STATE() {return 1; }
	static get ITERABLE_VAR_STATE() {return 2; }

	
	advance(nextToken, pos) {
		let bodyStarted = false;
		let nextState = null;
		let stateEnded = false;
		let skipNextToken = true;
		do {
			if (this.stage === ForOfExpressionState.BEGIN_STATE) {
				// check function name
				if (!nextToken.isOpenRoundBracket) {
					this.error = new TokenError(TokenError.ERROR_EXPECTING_TOKEN_PREFIX + '(', nextToken);
					break;
				}
				
				this.stage = ForOfExpressionState.ELEMENT_VAR_STATE;
				// mark this token as THE BEGINING OF A FOR LOOP
				nextToken.blockTag = TokenConst.BLOCK_TAG_FOR_LOOP_START;
				break;
			}	
			
			if (this.stage === ForOfExpressionState.ELEMENT_VAR_STATE) {
				// definition of loop variable
				
				// variable declaration encounteed
				if (!nextToken.isName ) {
					this.error = new TokenError(TokenError.ERROR_EXPECTING_TOKEN_PREFIX + '(', nextToken);
					break;
					
				}
				
				// Add a variable to represent the array element
				//nextState = new VarDeclarationState(pos, nextToken, this.scope, this.codeAnalyst);
				this.stage = ForOfExpressionState.ITERABLE_VAR_STATE;
				break;	
			
				break;
			}
			
		} while(false);
		
		if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		
		if (nextState) {
			nextState.parentState = this;
		}
		return new StateAction(nextState, this.error, stateEnded, skipNextToken);
	}
	
	isTheLastToken(token) {
		let hasError = false;
		if (this.stage === ForOfExpressionState.ITERABLE_VAR_STATE) {
			if (token.isCloseRoundBracket) {
				this.stateEnded = true;
				// mark this token as THE END  OF A FOR LOOP expression
				token.blockTag = TokenConst.BLOCK_TAG_FOR_LOOP_EXPRS_END;
			} else {
				hasError = true;	
			}
		} 
		
		if (hasError) {	
			this.error = new TokenError("Invalid token found inside 'for' statement", token);	
			this.codeAnalyst.errors.push(this.error);
		}
		return this.stateEnded;	
	}
}

export {ForOfExpressionState}
