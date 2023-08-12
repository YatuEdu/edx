import {StateAction, ParsingState}			from './parsingState.js'
import {FunctionCallState}					from './functionCallState.js'

class NewInstanceCallState extends ParsingState {

	static get BEGIN_STATE()    {return 0 }
    static get CONSTRUCTOR_NAME_STATE()  {return 1 }

	constructor(beginPos, beginToken, scope, codeAnalyst, functionInfo) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.stage = NewInstanceCallState.BEGIN_STATE;
	}
	
	advance(token, pos) {
		let nextState = null;
		let stateEnded = false;
		let skipThisToken = true;
		do {
			if (this.stage === NewInstanceCallState.BEGIN_STATE) {
				// check "("
				if (!token.isName) {
					this.error = new TokenError("Invalid 'new' syntax", token);
					break;
				}
				this.stage = NewInstanceCallState.CONSTRUCTOR_NAME_STATE;
				break;
			}

			if (this.stage === NewInstanceCallState.CONSTRUCTOR_NAME_STATE) {
				// check "("
				if (token.isOpenRoundBracket) {
					// enter function calling state
					nextState = new FunctionCallState(pos, token, this.scope, this.codeAnalyst, false);
					skipThisToken = false;
					break;
				}
				
				// state ended
				stateEnded = true;
				break;
			}
		} while(false);
		
		if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		
		return new StateAction(nextState, this.error, stateEnded, skipThisToken);
	}
}

export {NewInstanceCallState}