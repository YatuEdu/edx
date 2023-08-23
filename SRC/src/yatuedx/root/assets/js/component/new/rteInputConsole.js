import {ComponentBase}		from '../componentBase.js';

const CONTROL_NAME = "Advanced_Rich_Text_Editor";

const CSS_CONTENT_EDITOR = "yseditor-content";
const ID_RTE_IPUT = "yt_rte_input";

/***
 * Rich text edit input console
 */
class RteInputConsole extends ComponentBase {
    #parentView
    #myEditor

    constructor(parentView, divId) {
        const html = '<div id="yseditor"></div>';
        const css = "../../assets/js/ysEditor/css/ysEditor.css";

        super("id", CONTROL_NAME, divId, html, css, ComponentBase.MOUNT_TYPE_INSERT, true);
        this.#parentView = parentView;

        ysEditor.defineButton("charcount", {
            text: "Characters: ",
            callback: function(button, editor) {
              var self = this;
              button.element.textContent = self.text + editor.getText().split('').length;
              editor.element.addEventListener('keyup', function() {
                button.element.textContent = self.text + editor.getText().split('').length;
              });
            }
          });
      
          this.#myEditor = new ysEditor({
            toolbar: [
              "undo", "redo", "bold", "italic", "underline", "h1", "h2", "h3",
              "left", "center", "right", "charcount"
            ],
            footer: false
          });

        // set id for its content console
        $(`.${CSS_CONTENT_EDITOR}`).attr('id', ID_RTE_IPUT);
        
    }

    get code() {

    }

    set code(codeStr) {
        
    }

    inputId() {
        return ID_RTE_IPUT;
    }

    // selector for input text area id
	get inputIdSelector() {
		return  `#${this.inputId}`;
	}

	 /**
		get selected text range from code input area
	 **/
	getSelection() {
		return {
				begin: $(this.inputIdSelector).prop('selectionStart'),
				end:   $(this.inputIdSelector).prop('selectionEnd')
		};
	}

    outputId() {

    }
}

export {RteInputConsole}