import {CodeInputConsole}	    from './new/codeInputConsole.js';
import {RteInputConsole}        from './new/rteInputConsole.js';
import {groupTypeConstants} 	from '../core/sysConst.js'


const GROUP_TYPE_TO_INPUT_TYPE_MAP = new Map ([
    [groupTypeConstants.GPT_EDU_GENERIC_PRESENTATION, {description: "rich_text_presentation", implementationClass: RteInputConsole }],
    [groupTypeConstants.GPT_EDU_JSP, {description: "js_programming",         implementationClass: CodeInputConsole}],
    [groupTypeConstants.GPT_EDU_JSP_NODE, {description: "web design with node.js, js, and sql",  implementationClass: CodeInputConsole}]
]);

class ContentInputConsole {
    #delegateToComponent

    constructor(groupType, parentView, divId, baseIdTag, outputId) {
        const impl = GROUP_TYPE_TO_INPUT_TYPE_MAP.get(groupType);
        if (!impl) {
            alert("Unknown class room type:" + groupType)
            return;
        }
        this.#delegateToComponent = new impl.implementationClass(parentView, divId, baseIdTag, outputId);
    }

    /**
     * 
     * @returns Interface methods
     */
    showOutput() {
        return this.#delegateToComponent.showOutput();
    }

    /**
     * show error dialog if any error occurs during program execution
     */
    showDiagnoticMessage(errInfo) {
        return this.#delegateToComponent.showDiagnoticMessage(errInfo);
    }

    /**
     * getters and setters
     */
    get code() {
       return this.#delegateToComponent.code;
    }

    set code(str) {
        $(this.codeInputTextArea).val(str);
        this.#delegateToComponent.code = str;
    }

    get inputId() {
        return this.#delegateToComponent.inputId;
    }

    get inputIdSelector() {
        return this.#delegateToComponent.inputIdSelector;
    }

    get outputId() {
        return this.#delegateToComponent.outputId;
    }

    get inputIsTextArea() {
        return this.#delegateToComponent instanceof CodeInputConsole
    }

    /**
		get selected text range from content input area
	 **/
	getSelection() { return this.#delegateToComponent.getSelection() }
}

export {ContentInputConsole}