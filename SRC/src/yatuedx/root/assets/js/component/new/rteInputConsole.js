import {ComponentBase}		  from '../componentBase.js';
import {sysConstStrings} 		from '../../core/sysConst.js'

const YSEDITOR_TEMPLATE = `
<div id="{editorWrapperId}"></div>
<div id="{fileuplddlid}" title="Upload image">
  <input type="file" id="yt_file_image" name="filename">
  <btton id="yt_btn_upload" class="upload_btn">Upload</button>
</div>`

const DEFAULT_CONTENT_DIV = '<div style="text-align: left;"></div>'

const CONTROL_NAME = "Advanced_Rich_Text_Editor";

const ID_RTE_IPUT = "yt_rte_input";

const REPLACE_YSEDITOR_ID = "{editorWrapperId}"
const REPLACE_FILE_UPLOAD_ID = "{fileuplddlid}"

const IMG_UPLOAD_COMMAND = "imgupload";
const FILE_UPLOAD_IMAGE_SRC = '<img src="assets/images/tools/file-upload.png" width="30" height="30" />';

const CLS_IMAGE_DIV = "yt_div_imserted_image"

let currentSelectedFile = null;

/*
 * Rich text edit input console
 */
class RteInputConsole extends ComponentBase {
    #parentView
    #myEditor
    #html
    #baseIdTag

    constructor(parentView, divId, baseIdTag, ysEditorId) {
        let editorWrapperId = ysEditorId ? ysEditorId : "yseditor_main";
        editorWrapperId = `${editorWrapperId}_${baseIdTag}`;
        const html = YSEDITOR_TEMPLATE
                      .replace(REPLACE_YSEDITOR_ID, editorWrapperId)
                      .replace(REPLACE_FILE_UPLOAD_ID, "yt_dl_file_upload")

        super("id", CONTROL_NAME, divId, html, null, ComponentBase.MOUNT_TYPE_INSERT, true);
        this.#parentView = parentView;
        this.#baseIdTag = baseIdTag;

        // add a button to count charactors
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

        let toolBarButons = [
          "undo", "redo", "bold", "italic", "underline", "h1", "h2", "h3",
          "left", "center", "right",  'ol', 'ul', IMG_UPLOAD_COMMAND, "charcount"
        ];
        if (this.#baseIdTag ===  sysConstStrings.RTE_TAG_MAIN) {
           // add a button to load image files for main content editor
          const parent = this;
          ysEditor.defineButton(IMG_UPLOAD_COMMAND, {
            command: IMG_UPLOAD_COMMAND,
            text: FILE_UPLOAD_IMAGE_SRC,
            title: "Upload an image and insert into the text",
            id: parent.getImageUploadId
          });
        } else {
          // remove "imgupload" for non-main tool bars
          const imgBtnIndex = toolBarButons.indexOf(IMG_UPLOAD_COMMAND)
          toolBarButons.splice(imgBtnIndex, 1)
        }
         
        this.#myEditor = new ysEditor({
            wrapper: `#${editorWrapperId}`,
            toolbar: toolBarButons,
            footer: false
          });

        // set id for its content console
        $(this.ysEditorContentSelector).attr('id', ID_RTE_IPUT);

        // clear content garbage
        $(this.ysEditorContentSelector).html('')

        /*
          * initialize dialog boxe for image uploading
        */
        $(this.fileUploadDialogSelector).dialog({
            autoOpen : false, 
            modal : true, 
            show : "blind", 
            hide : "blind", 
        });

        // handle paste event
        $(this.inputIdSelector).unbind("paste")
        $(this.inputIdSelector).bind("paste", this.#handlePaste.bind(this))

        // handle image upload event
        $(this.inputFileSelector).change(this.#handleFileInputChange.bind(this))
        $(this.getImageUploadSelector).click(this.#handleImageUploadOpenDialog.bind(this))
        $(this.fileUploadBtnSelector).unbind('click').click(this.#handleImageUpload.bind(this))
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

    #handleImageUploadOpenDialog(e) {
      e.preventDefault();
		  $(this.fileUploadDialogSelector).dialog("open");
      $(this.fileUploadBtnSelector).prop('disabled', true);
      e.stopPropagation()
    }

    #handleFileInputChange(e) {
      currentSelectedFile = e.target.files[0];
      $(this.fileUploadBtnSelector).prop('disabled', false);
    }

    #handleImageUpload(e) {
      e.preventDefault();
      e.stopPropagation();

      const reader = new FileReader();
      reader.readAsDataURL(currentSelectedFile);
      const contentEditor = this.inputIdSelector;
      $(this.fileUploadDialogSelector).dialog("close");
      $(contentEditor).focus()

      reader.onload = function () {
        const img = new Image();
        img.src =  reader.result;
        img.onload = function() {
          console.log(img.width);
          console.log(img.height);
        
          const imgNode = document.createElement("div");
          imgNode.classList.add(CLS_IMAGE_DIV);
          const oImg = document.createElement("img");
          oImg.src = reader.result
          oImg.style.width = 200;
          imgNode.append(oImg);

         /*
          const sel = window.getSelection();
          if (sel && sel.getRangeAt && sel.rangeCount) {
            const range = window.getSelection().getRangeAt(0);
            //const node = range.createContextualFragment(imgNode);
            range.insertNode(imgNode);
           } else if (document.selection && document.selection.createRange) {
            document.selection.createRange().pasteHTML(image);
          }
          */
         
          $(contentEditor).append(imgNode);
          $(`.${CLS_IMAGE_DIV}`).resizable({
              aspectRatio: img.width / img.height
          });
          const imgNodeAfter = document.createElement("br");
          imgNodeAfter.innerHTML = "Continue editing here ..."
          $(contentEditor).append(imgNodeAfter);
        }
      } 
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

  /*
    Erase text on the input board div
  */
  eraseInputBoard() {
    $(this.inputIdSelector).html('');
  }

  get ysEditorContentClass() {return 'yseditor-content'} 
  get ysEditorContentSelector() { return `.${this.ysEditorContentClass}`}

  get outputId() {
      return -1;
    }

  get getImageUploadId() { return "yt_btn_tool_image_upload_" + this.#baseIdTag}
  get getImageUploadSelector() { return `#${this.getImageUploadId}`}

  get fileUploadDialogId() {  return 'yt_dl_file_upload'}
  get fileUploadDialogSelector() {return `#${this.fileUploadDialogId}`}

  get inputFileId() { return 'yt_file_image'}
  get inputFileSelector(){return `#${this.inputFileId}`}

  get fileUploadBtnId() { return 'yt_btn_upload'}
  get fileUploadBtnSelector() {return `#${this.fileUploadBtnId}`}
}

export {RteInputConsole}