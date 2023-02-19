import {StateAction, ParsingState}			from './parsingState.js'
import {ExpressionState} 					from './expressionState.js'
import {AssignmentState}					from './assignmentState.js'
import {VarDeclarationState}				from './varDeclarationState.js'
import {TokenError, TokenConst}				from './token.js'

class CommentState extends ParsingState {
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.stage = ForLoopState.BEGIN_STATE;
	}
	
	static get BEGIN_STATE() {return 0; }
	static get INIT_EXPR_STATE() {return 1; }
	static get INIT_EXPR_BODY_STATE() {return 2; }
	static get EXIT_CONDTION_EXPR_STATE() {return 3; }
	static get ITERATION_EXPR_STATE() {return 4; }
}

export {CommentState}