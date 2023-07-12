class DomUtil {
    static toggleSelectionStyle(spanCss, styleOption, toggleNotesStyle) {
        if (!window.getSelection) return;

        const sel = window.getSelection();
        if (!sel.rangeCount) return;

        // we got selected text to work on:
        const range = sel.getRangeAt(0).cloneRange();
        let span = range.commonAncestorContainer.parentElement;
        if (!span.classList.contains(spanCss)) {
            span = document.createElement("span");
            span.classList.add(spanCss);
            range.surroundContents(span);
            span.addEventListener('dblclick', toggleNotesStyle);
        }

        // change span style
        DomUtil.changeSpanStyle(span, styleOption);
        sel.removeAllRanges();
        sel.addRange(range);      
    }

    static changeSpanStyle(span, styleOption) {
        switch (styleOption) {
            case 'b':
                span.style.fontWeight = "bold";
                break;
            case 'i':
                span.style.fontStyle = "italic";
                break;
            case 'u':
                span.style.textDecoration  = "underline";
                break;
            case 'h1':
                span.style.fontWeight  = "bold";
                span.style.fontSize = "xx-large"
                break;
            case 'h2':
                span.style.fontWeight  = "bold";
                span.style.fontSize = "x-large"
                break;
            default:
                break;
        }
    }
       
}

export  {DomUtil};