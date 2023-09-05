import {ComponentBase}		from '../componentBase.js';
import {StringUtil}       from '../../core/util.js';

const CONTROL_NAME = "Advanced_Rich_Text_Editor";

const CSS_CONTENT_EDITOR = "yseditor-content";
const ID_RTE_IPUT = "yt_rte_input";

/***
 * Rich text edit input console
 */
class RteInputConsole extends ComponentBase {
    #parentView
    #myEditor
    #html

    constructor(parentView, divId, baseIdTag, ysEditorId) {
        let editorWrapperId = ysEditorId ? ysEditorId : "yseditor_main";
        editorWrapperId = `${editorWrapperId}_${baseIdTag}`;
        const html = `<div id="${editorWrapperId}"></div>`;
        const css = "../../assets/js/ysEditor/css/yseditor.css";

        super("id", CONTROL_NAME, divId, html, css, ComponentBase.MOUNT_TYPE_INSERT, true);
        this.#parentView = parentView;

        ysEditor.defineButton("charcount", {
            text: "Characters: ",
            callback: function(button, editor) {
              const self = this;
              button.element.textContent = self.text + editor.getText().split('').length;
              editor.element.addEventListener('keyup', function() {
                button.element.textContent = self.text + editor.getText().split('').length;
              });
            }
          });
      
          this.#myEditor = new ysEditor({
            wrapper: `#${editorWrapperId}`,
            toolbar: [
              "undo", "redo", "bold", "italic", "underline", "h1", "h2", "h3",
              "left", "center", "right", "charcount"
            ],
            footer: false
          });

        // set id for its content console
        $(`.${CSS_CONTENT_EDITOR}`).attr('id', ID_RTE_IPUT);

        // handle paste event
        $(this.inputIdSelector).unbind("paste")
        $(this.inputIdSelector).bind("paste", this.#handlePaste.bind(this))
    }

    #handlePaste(e) {
      e.preventDefault();
      const pastedContent = this.#setImageSize(e.originalEvent.clipboardData);
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      selection.deleteFromDocument();
      const imgNode = document.createElement("div");
      imgNode.innerHTML = this.#formatInsertedImage(pastedContent);
      selection.getRangeAt(0).insertNode(imgNode);
      selection.collapseToEnd();
      e.stopPropagation()
    }

    #setImageSize(clipboardData) {
      if (clipboardData.types.indexOf('text/html') > -1) {
        let html = clipboardData.getData('text/html')
        const imageIndex = html.indexOf("<img src=");
        if (imageIndex > 0) {
          // add max height to the image
          const srcHead = 'src="';
          const srcStart = html.indexOf(srcHead, imageIndex) + srcHead.length
          const srcEnd  =  html.indexOf('"', srcStart + 1)
          html = html.slice(srcStart, srcEnd)
          //console.log(html)
        }
        return html;
      }

      if(clipboardData.types.indexOf('text') > -1) {
        return clipboardData.getData('text')
      }

      return null;
    }

    #formatInsertedImage(src) {
      return `
      <div class="yt_div_imserted_image">
        <img src="${src}">
      </div>`;
    }

    get code() {
      return $(this.inputIdSelector).html();
    }

    set code(codeStr) {
      $(this.inputIdSelector).html(codeStr);
    }

    get inputId() {
        return ID_RTE_IPUT;
    }

    // selector for input text area id
    get inputIdSelector() {
      return `#${this.inputId}`;
    }

	 /*
		get selected text range from code input area
	 */
	getSelection() {
    if (window.getSelection().rangeCount) {
      const selectedRange = window.getSelection().getRangeAt(0)
      return {
				begin: selectedRange.startOffset,
				end:   selectedRange.endOffset
		  };
	  }
  }

  get outputId() {
      return -1;
    }
}

export {RteInputConsole}