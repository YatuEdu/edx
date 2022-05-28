class UIUtil {
    /**
     * text，selector, date
     */
    static uiEnterEdit(element, type, data) {

        if (data instanceof Array) {
            let map = new Map();
            for(let d of data) {
                map.set(d, d);
            }
            data = map;
        }
        switch (type) {
            case 'text':
                let textCurr = element.html();
                if (textCurr==null) textCurr = '';
                element.html('');
                let textInput = $(`
                    <input class="form-control form-control-lg">
                `);
                textInput.val(textCurr);
                element.append(textInput);
                break;
            case 'selector':
                let selectCurr = element.html();
                element.html('');
                let selector = $(`
                    <select class="form-select form-control-lg">
                    </select>
                `);
                data.forEach(function(value, key) {
                    $(selector).append($('<option>', {
                        value: value,
                        text: key
                    }));
                    if (key===selectCurr) {
                        selector.val(value);
                    }
                });
                element.append($(selector));
                break;
            case 'date':
                let dateCurr = element.html();
                element.html('');
                let dateSelector = $(`
                    <input id="effectiveDateInput" type="date" min="1922-04-30" name="dob"
                     class="form-control form-control-lg date_for_3"/>
                `);
                dateSelector.val(dateCurr);
                element.append($(dateSelector));
                break;
        }
    }

    static uiExitEdit(element, type) {
        let elementVal = null;
        let elementText = null;
        switch (type) {
            case 'text':
                elementVal = element.find("input").val();
                element.empty();
                element.html(elementVal);
                return elementVal;
            case 'selector':
                elementVal = element.find("select").val();
                elementText = element.find("select option:selected").text();
                element.empty();
                element.html(elementText);
                return elementVal;
            case 'date':
                elementVal = element.find("input").val();
                element.empty();
                element.html(elementVal);
                return elementVal;
        }
    }

}

export {UIUtil}