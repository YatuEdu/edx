import {StateAction, ParsingState}		from './parsingState.js'
import {ExpressionState} 				from './expressionState.js'
import {CodeBlockState}					from './codeBlockState.js'
import {AssignmentState}				from './assignmentState.js'
import {VarDeclarationState}			from './varDeclarationState.js'
import {TokenError, TokenConst}			from './token.js'
import {Scope}							from './scope.js'

class WhileLoopState extends ParsingState {
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.stage = WhileLoopState.BEGIN_STATE;
	}
	
	static get BEGIN_STATE() {return 0; }
	static get WHILE_EXPR_STATE() {return 1; }
	static get WHILE_BODY_STARTS_STATE() {return 2; }
	static get WHILE_BODY_STATE() {return 3; }
	
	advance(nextToken, pos) {
		let bodyStarted = false;
		let nextState = null;
		let stateEnded = false;
		let skipNextToken = true;
		do {
			if (this.stage === WhileLoopState.BEGIN_STATE) {
				// check open round bracket
				if (!nextToken.isOpenRoundBracket) {
					this.error = new TokenError(TokenError.ERROR_EXPECTING_TOKEN_PREFIX + "'('", nextToken);
					break;
				}
				
				// expression must be non-empty
				const following = this.getTokenByPosition(pos+1);
				if (following.isCloseRoundBracket) {
					this.error = new TokenError(TokenError.ERROR_EXPECTING_TOKEN_PREFIX + "'logical expression'", nextToken);
					break;
				}
				
				this.stage = WhileLoopState.WHILE_EXPR_STATE;
				
				// mark this token as THE BEGINING OF A while loop logical expression
				nextToken.blockTag = TokenConst.BLOCK_TAG_WHILE_LOOP_EXPS_START;
				nextState = new ExpressionState(pos, nextToken, this.scope, this.codeAnalyst, false);
				break;
			}	
			
			if (this.stage === WhileLoopState.WHILE_BODY_STARTS_STATE) {
				// check close round bracket 
				if (!nextToken.isOpenCurlyBracket) {
					this.error = new TokenError(TokenError.ERROR_EXPECTING_TOKEN_PREFIX + "'{'", nextToken);
					break;
				}
				
				this.stage = WhileLoopState.WHILE_BODY_STATE;
				
				// mark this token as THE BEGINING OF a LOOP body
				nextToken.blockTag = TokenConst.BLOCK_TAG_LOOP_BODY_START;
				nextState = new CodeBlockState(pos, nextToken, new Scope(this.scope), this.codeAnalyst, false);
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
		if (this.stage === WhileLoopState.WHILE_EXPR_STATE) {
			if (!token.isCloseRoundBracket) {
				this.error = new TokenError(TokenError.ERROR_EXPECTING_TOKEN_PREFIX + "')'", token);	
			}
			this.stage = WhileLoopState.WHILE_BODY_STARTS_STATE;
		} 
		else if (this.stage === WhileLoopState.WHILE_BODY_STATE) {
			if (token.isCloseCurlyBracket) {
				this.stateEnded = true;
				// mark this token as THE END OF A WHILE LOOP
				token.blockTag = TokenConst.BLOCK_TAG_LOOP_BODY_END;
			} else {
				this.error = new TokenError(TokenError.ERROR_EXPECTING_TOKEN_PREFIX + "'}'", token);	
			}
		}

		if (this.error) {	
			this.codeAnalyst.errors.push(this.error);
		}
		return this.stateEnded;	
	}
}

export {WhileLoopState}
