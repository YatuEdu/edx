import {StateAction, ParsingState}		from './parsingState.js'
import {FunctionDefState}               from './functionDefState.js'
import {Variable}						from './variable.js'
import {Token, TokenError, TokenConst}	from './token.js'

class Es6ClassDefState extends ParsingState {
    #className
    #superClassName

    static get CLASS_PRIVATE_MEMBER_START()     {return "#" }

	static get CLASS_DEC_STATE()    {return 0 }
    static get CLASS_DEC_STATE_1()  {return 1 }
    static get CLASS_DEC_STATE_2()  {return 2 }
    static get CLASS_DEC_STATE_3()  {return 3 }
    static get CLASS_DEC_BODY()     {return 4 }
    static get CLASS_METHOD_BODY()     {return 5 }

	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.stage = Es6ClassDefState.CLASS_DEC_STATE;
	}
	
	advance(nextToken, pos) {
        let nextState = null;
        let stateEnded = false;
        let advanceToNextToken = true;
		do {
            if (Es6ClassDefState.CLASS_DEC_STATE === this.stage) {
                if (nextToken.isName) {
                    this.#className = nextToken.name;
                    this.stage = Es6ClassDefState.CLASS_DEC_STATE_1;
                }
                break;
            }

            if (Es6ClassDefState.CLASS_DEC_STATE_1 === this.stage) {
                if (nextToken.isExtendKey) {
                    this.stage = Es6ClassDefState.CLASS_DEC_STATE_2;
                    break;
                }

                if (nextToken.isOpenCurlyBracket) {
                    this.stage = Es6ClassDefState.CLASS_DEC_BODY;
                    break;
                }
            }

            if (Es6ClassDefState.CLASS_DEC_STATE_2 === this.stage) {
                if (nextToken.isName) {
                    this.#superClassName = nextToken.name;
                    this.stage = Es6ClassDefState.CLASS_DEC_STATE_3;
                    break;
                }
            }

            if (Es6ClassDefState.CLASS_DEC_STATE_3 === this.stage) {
                if (nextToken.isOpenCurlyBracket) {
                    this.stage = Es6ClassDefState.CLASS_DEC_BODY;
                    break;
                }
            }

            if (Es6ClassDefState.CLASS_DEC_BODY === this.stage) {
                if (nextToken.isCloseCurlyBracket) {
                    // class definition completed successfully
                    stateEnded = true;
                    break;
                }

                // private variable definition
                if (this.#isPrivateVariableDef(pos)) {
                    this.scope.addLocalVariable(nextToken.name, new Variable(nextToken, TokenConst.VAR_TYPE_MEMBER));
                    break;
                }

                // constructor seen
                if (nextToken.isConstructor) {
                    this.stage = Es6ClassDefState.CLASS_METHOD_BODY;

                    // look forward to see if super is called first
                    if (this.#superClassName) {
                        const funcBodyStartPos = this.findAheadFuncDefBody(pos+1);
                        const firstStatement = this.codeAnalyst.meaningfulTokens[funcBodyStartPos];
                        if (!firstStatement || !firstStatement.isSuper) {
                            this.error = new TokenError("Should call super method for its base class.", nextToken);
                            break;
                        }
                    }  
                }

                // method definition see
                if (this.stage !== Es6ClassDefState.CLASS_METHOD_BODY && this.#isMethodDef(pos)) {
                    this.stage = Es6ClassDefState.CLASS_METHOD_BODY;
                }

                // enter function definition block (for the method definition)
                if (this.stage === Es6ClassDefState.CLASS_METHOD_BODY) {
                    nextState = new FunctionDefState(pos, nextToken, this.scope, this.codeAnalyst);	
                    nextState.parentState = this;
                    advanceToNextToken = false;
                    break;
                 }
            }

            // if we come here, we run into unknown token
            this.error = new TokenError("Invalid state in 'class' definition.", nextToken);
        } while(false);

        if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		return new StateAction(nextState, this.error, stateEnded, advanceToNextToken);
	}

    /*
        called by spawned state (such as function definition state) when it ends parsing
     */
	isTheLastToken(token) {
		// functiona body ends, so we are completely done
		if (this.stage ===  Es6ClassDefState.CLASS_METHOD_BODY) {
			this.stage = Es6ClassDefState.CLASS_DEC_BODY;
		}
		return false;	
	}

    #isPrivateVariableDef(pos) {
        // At least 2 tokens, for example: #x }
        const len = this.codeAnalyst.meaningfulTokens.length;
        if (len < pos + 2) {
            return false;
        }

        let objName = this.codeAnalyst.meaningfulTokens[pos];
        if (!objName.isName && !objName.name.startsWith(Es6ClassDefState.CLASS_PRIVATE_MEMBER_START)){
            return false;
        }

        objName = this.codeAnalyst.meaningfulTokens[pos+1];
        if (!objName.isCR && !objName.isSemicolon){
            return false;
        }

        return true;
    }

    #isMethodDef(pos) {
        // At least 4 tokens, for example: foo() {} }
        const len = this.codeAnalyst.meaningfulTokens.length;
        if (len < pos + 6) {
            return false;
        }

        let objName = this.codeAnalyst.meaningfulTokens[pos];
        if (!objName.isName){
            return false;
        }

        let foundOpen = false;
		for(let i = pos + 1; i < len-1; i++) {
			const token = this.codeAnalyst.meaningfulTokens[i];
			if (!foundOpen) {
				if (token.isOpenRoundBracket) {
					foundOpen = true;
				}
			} else {
				if (token.isCloseRoundBracket) {
					return true;
				}
				if (token.isCloseCurlyBracket) {
					return false;
				}
			}
		}

        return false;
    }
}

export {Es6ClassDefState}