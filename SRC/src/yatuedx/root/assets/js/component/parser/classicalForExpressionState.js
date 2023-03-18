import {StateAction, ParsingState}		from './parsingState.js'
import {ExpressionState} 				from './expressionState.js'
import {AssignmentState}				from './assignmentState.js'
import {CodeBlockState}					from './codeBlockState.js'
import {VarDeclarationState}			from './varDeclarationState.js'
import {TokenError, TokenConst}			from './token.js'
import {Scope}							from './scope.js'

class ClassicalForExpressionState extends ParsingState {
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.stage = ClassicalForExpressionState.BEGIN_STATE;
	}
	
	static get BEGIN_STATE() {return 0; }
	static get INIT_EXPR_STATE() {return 1; }
	static get INIT_EXPR_BODY_STATE() {return 2; }
	static get EXIT_CONDTION_EXPR_STATE() {return 3; }
	static get ITERATION_EXPR_STATE() {return 4; }
	
	advance(nextToken, pos) {
		let bodyStarted = false;
		let nextState = null;
		let stateEnded = false;
		let skipNextToken = true;
		do {
			if (this.stage === ClassicalForExpressionState.BEGIN_STATE) {
				// check function name
				if (!nextToken.isOpenRoundBracket) {
					this.error = new TokenError(TokenError.ERROR_EXPECTING_TOKEN_PREFIX + '(', nextToken);
					break;
				}
				
				this.stage = ClassicalForExpressionState.INIT_EXPR_STATE;
				// mark this token as THE BEGINING OF A FOR LOOP
				nextToken.blockTag = TokenConst.BLOCK_TAG_FOR_LOOP_START;
				break;
			}	
			
			if (this.stage === ClassicalForExpressionState.INIT_EXPR_STATE) {
				// definition of loop variable
				
				// empty initialization?
				if (nextToken.isSemicolon) {
					this.stage = ClassicalForExpressionState.EXIT_CONDTION_EXPR_STATE;
					nextState = new ExpressionState(pos, nextToken, this.scope, this.codeAnalyst, false);
					break;
				}
				
				// assignment encounteed
				if (this.matchTokenName(pos+1, '=') ) {
					nextState = new AssignmentState(pos, nextToken, this.scope, this.codeAnalyst, false);
					this.stage = ClassicalForExpressionState.INIT_EXPR_BODY_STATE;
					break;
				}
				
				// variable declaration encounteed
				if (nextToken.isVarDeclaration ) {
					nextState = new VarDeclarationState(pos, nextToken, this.scope, this.codeAnalyst);
					this.stage = ClassicalForExpressionState.INIT_EXPR_BODY_STATE;
					break;						
				}
			
				break;
			}

			if (this.stage === ClassicalForExpressionState.INIT_EXPR_BODY_STATE) {
				this.stage = ClassicalForExpressionState.EXIT_CONDTION_EXPR_STATE;
				nextState = new ExpressionState(pos, nextToken, this.scope, this.codeAnalyst, false);
				skipNextToken = false;	
				break;
			}
			
			if (this.stage === ClassicalForExpressionState.EXIT_CONDTION_EXPR_STATE ) {
				this.stage = ClassicalForExpressionState.ITERATION_EXPR_STATE;
				nextState = new ExpressionState(pos, nextToken, this.scope, this.codeAnalyst, false);
				skipNextToken = false;	
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
		if (this.stage === ClassicalForExpressionState.EXIT_CONDTION_EXPR_STATE) {
			if (!token.isSemicolon) {
				hasError = true;
			}
		} 
		else if (this.stage === ClassicalForExpressionState.ITERATION_EXPR_STATE) {
			if (token.isCloseRoundBracket) {
				this.stage = ClassicalForExpressionState.LOOP_BODY_STARTS_STATE;
				
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

export {ClassicalForExpressionState}
