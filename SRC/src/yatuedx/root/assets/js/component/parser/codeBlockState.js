import {StateAction, ParsingState}		from './parsingState.js'
import {Es6ClassDefState}				from './es6ClassDefState.js'
import {ForLoopState}					from './forLoopState.js'
import {WhileLoopState}					from './whileLoopState.js'
import {FunctionDefState}				from './functionDefState.js'
import {ExpressionState}				from './expressionState.js'
import {FunctionCallState}				from './functionCallState.js'
import {AssignmentState}				from './assignmentState.js'
import {SubscriptAssignmentState}		from './subscriptAssignmentState.js'
import {ObjectMethodCallState}			from './objectMethodCallState.js'
import {IfState}						from './ifState.js'
import {VarDeclarationState}			from './varDeclarationState.js'
import {Scope}							from './scope.js'
import {Token, TokenError, TokenConst}	from './token.js'

class CodeBlockState extends ParsingState {
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		if (beginToken && !beginToken.isOpenCurlyBracket) {
			this.error = new TokenError("Invalid cpde block: '{' expected", beginToken);
			codeAnalyst.errors.push(this.error);
		}
	}
	
	advance(nextToken, pos) {
		const tokenInfo = Token.getTokenInfo(nextToken.name);
		if (nextToken.isElse) {
			// ignore else since it is just another block or expression
			return new StateAction(null, null, false);
		}

		// entering es6 class block
		if (this.isEs6Class(pos)) {
			const newScope = new Scope(this.scope);	
			// entering a CLASS block state
			const nextState = new Es6ClassDefState(pos, nextToken, newScope, this.codeAnalyst);	
			return new StateAction(nextState, null, false);
		}

		// enering a new code block:
		if (nextToken.isOpenCurlyBracket) {
			const newScope = new Scope(this.scope);	
			// entering a nested block state
			const nextState = new CodeBlockState(pos, nextToken, newScope, this.codeAnalyst);	
			return new StateAction(nextState, null, false);
		}
				
		// current code block ended:
		if (nextToken.isCloseCurlyBracket) {
			// also set parent state to finish if any
			if (this.parentState) {
				this.parentState.isTheLastToken(nextToken);
			}
			return new StateAction(null, null, true);
		}
		
		// if it is a "for" loop statement
		if (this.isForLoop(pos)) {
			const nextState = new ForLoopState(pos, nextToken, new Scope(this.scope), 
											   this.codeAnalyst, false);
			return new StateAction(nextState, null, false);
		}
		
		// if it is a "for" loop statement
		if (nextToken.isWhileLoop) {
			const nextState = new WhileLoopState(pos, nextToken, new Scope(this.scope), 
											   this.codeAnalyst, false);
			return new StateAction(nextState, null, false);
		}
		
		// is it a subscript assignment, such as a[i] = 10;
		if (this.isSubscriptAssignment(pos)) {
			const nextState = new SubscriptAssignmentState(pos, nextToken, new Scope(this.scope), 
											   this.codeAnalyst, false);
			// we keep this token for SubscriptAssignmentState state
			const advanceToNextToken = false;
			return new StateAction(nextState, null, false, advanceToNextToken); 
		}
		
		// if it is a function definition statement
		if (this.isFunctionDefinition(pos)) {
			const nextState = new FunctionDefState(pos, nextToken, this.scope, 
												   this.codeAnalyst, false);
			return new StateAction(nextState, null, false);
		}
		
		// if it is an object method call
		if (this.isObjectMethodCall(pos)) {
			const nextState = new ObjectMethodCallState(pos, nextToken, this.scope, 
												   this.codeAnalyst, false);
			return new StateAction(nextState, null, false);
		}
		
		// return statement
		if (nextToken.isReturn) {
			// go to expression state		
			const nextState = new ExpressionState(pos, nextToken, 
												  this.scope, this.codeAnalyst);
			return new StateAction(nextState, null, false);			
		}
		
		// if it is a function call semantics
		const funcCall = this.isFunctionCall(pos);
		if (funcCall.isFunctionCall) {
			const nextState = new FunctionCallState(pos, nextToken, this.scope, 
													this.codeAnalyst, false);
			return new StateAction(nextState, null, false);
		}
		
		// IF statement encountered:
		if (tokenInfo && tokenInfo.keyType === TokenConst.IF_KEY) {
			const nextState = new IfState(pos, nextToken, this.scope, 
										  this.codeAnalyst);
			return new StateAction(nextState, null, false);
		}		
		
		// assignment encounteed
		if (this.matchTokenName(pos+1, '=') ) {
			const nextState = new AssignmentState(pos, nextToken, this.scope, 
												  this.codeAnalyst, false);
			return new StateAction(nextState, null, false);
		}
		
		// variable declaration encounteed
		if (nextToken.isVarDeclaration ) {
			const nextState = new VarDeclarationState(pos, nextToken, this.scope, 
													  this.codeAnalyst);
			return new StateAction(nextState, null, false);
									
		}
		
		// Note: this must be the last to call for independednt exptession statement (such as X++)
		if (this.isEpressionStatement(pos)) {
			// go to expression state		
			const nextState = new ExpressionState(pos, nextToken, 
												  this.scope, this.codeAnalyst);
			const advanceToNextToken = false;
			return new StateAction(nextState, null, false, advanceToNextToken);			
		}
		
		// if we come here, we are still in the same code block, keep probing ahead
		return new StateAction(null, null, false);
	}
}

export {CodeBlockState}

