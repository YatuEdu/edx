import {sysConstants, sysConstStrings, languageConstants} 	from '../core/sysConst.js'
import {uiMan} 												from '../core/uiManager.js';
import {CodeAnalyst}										from './new/codeAnalyst.js'

/**
	This class handles JS Code runner board
**/
class CodeError {
	#exception;
	#analyticalInfo;
	
	constructor(exception, analyticalInfo) {
		this.#exception = exception;
		this.#analyticalInfo = analyticalInfo;
	}
	
	get exception() { return this.#exception; }
	get analyticalInfo() { return this.#analyticalInfo; }
}

/**
	This class handles JS Code runner board
**/
class JSCodeExecutioner {
	#consoleId;

    constructor(consoleId) {
		this.#consoleId = consoleId; 

		// set global functions for our usage
		window.div = this.#integerDiv
	}
	
	/*
		Run program on the board.
	 */
	executeCode(srcTxt) {
		return this.#runJSCode(srcTxt);
	}
	
	/*
		Format program on the board.
	 */
	formatCode(src) {
		const codeAnalyst = new CodeAnalyst(src);
		const result = codeAnalyst.formatCode();
		if (result.hasError) {
			return {hasError: true, errors: this.#handleErrors(result.errors, null)}
		} else {
			return result;
		}
	}
	
	#getConsoleId() {
		return `#${this.#consoleId}`;
	}
	
	/*
		Run js code 
	 */
	#runJSCode(src) {
		src = src.trim();
		let analyticalInfo = [];
		let newSrc = src;
		let codeAnalyst = null;
		if (src) {
			// anaylize code
			codeAnalyst = new CodeAnalyst(src);
			analyticalInfo  = codeAnalyst.shallowInspect();
			
			// add code as AOP interceptor
			const instrumentedCode = codeAnalyst.instrumentSourceCode();
			if (instrumentedCode) {
				newSrc = instrumentedCode;
				console.log("instrumented code:");
				console.log(instrumentedCode);
			}
			
		}
		
		// todo: in near future refine code analyst so that when we detected error, no need to executeCode.
		//	if (analyticalInfo.length) {
		//		return new CodeError(null, analyticalInfo);
		//	}
		
		if (newSrc) {
			const returnSrc = codeAnalyst.printAllVaraibles();
			if (returnSrc) {
				newSrc += "\n" + returnSrc;
			}
			// run code
			try {
				// keep existinv console out put
				const consoleId = this.#getConsoleId();
				let oldTxt = $(consoleId).val();
				let codeOutputHeaderTxt = "";
				$(consoleId).val('');
				
				// expecting program output:
				if (codeAnalyst.hasIO) {
					codeOutputHeaderTxt = sysConstStrings.EXE_PROGRAM_OUTPUT;
				}
				
				// exec code
				const func = new Function('print', 'printx', newSrc);
				func(this.#printLine.bind(this), this.#printx.bind(this));
				
				// append the old output with the new output
				const newTxt = $(consoleId).val();
				$(consoleId).val(`${codeOutputHeaderTxt}${newTxt}${sysConstStrings.EXE_PROGRAM_FIN}${oldTxt}`);
				
			}
			catch (e) {
				// return error info to caller 
				return this.#handleErrors(analyticalInfo, e);
			}
		} else {
			this.#printLine('No code is present')
		}
		// no error 
		return null;
	}
	
	/**
		When errors are encountered, we use our own JS cod analyst to dispply our
		diagnostic messagews
	 **/
	#handleErrors(analyticalInfo, e) {
		// analyse the code
		return new CodeError(e, analyticalInfo);
	}
	
	/*
		append message text to console in a new line
	 */
	#printLine(...msgs) {
		this.#appendMessage(true, msgs);
	}
	
	/*
		append message text to console on the same line
	 */
	#printx(...msgs) {
		this.#appendMessage(false, msgs);
	}
	
	/*
		append message text to console.
	 */
	#appendMessage(newLine, args) {
		let msgTxt = "";
		for (const a of args) {
			let argText = a;
			if (a && typeof a === 'object' && a.constructor === Object) {
				argText = this.#getObjectProperties(a);
			} else if (Array.isArray(a)) {
				argText = this.#displayArray(a);
			} else if (a instanceof Function) {
				argText = "Function";
			}
			
			msgTxt += msgTxt ? ' ' + argText : argText;
		}
		
		//  insert message to console
		const consoleId = this.#getConsoleId();
		const oldTxt = $(consoleId).val();
		let printTex = '';
		if (oldTxt) {
			printTex = `${oldTxt}${msgTxt}`;
		}
		else {
			printTex = `${msgTxt}`;
		}
		
		if (newLine) {
			printTex += '\n';
		} else {
			printTex += ' ';
		}
		
		$(consoleId).val(printTex);
    }
	
	#getObjectProperties(obj) {
		let objText = "{";
		let i = 0;
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				const objValStr = (typeof obj[key] === 'string' || obj[key] instanceof String) ? 
									`"${obj[key]}"` : `${obj[key]}`;
				const kvPair = `${key}: ${objValStr}`;;
				objText += i++ == 0 ? `${kvPair}, ` : `${kvPair}`;
			}
		}
		objText += "}";
        return objText;
    }
	
	#displayArray(arr) {
		let objText = "[";
		let bodyText = "";
		arr.forEach(e => {
			bodyText += bodyText ? `, ${e}` : e;
		});
		objText += bodyText + "]";
        return objText;
	}

	/*
		Global variables and functions
	 */
		#integerDiv(a, b) {
			if (b === 0) {
				alert('Infinity');
			}

			return Math.trunc(a / b);
		}

}

export {JSCodeExecutioner}