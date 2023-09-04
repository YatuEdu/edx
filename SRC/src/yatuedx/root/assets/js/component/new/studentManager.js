import {ComponentBase}              from '../componentBase.js'
import {ProgrammingClassCommandUI}  from '../../pages/programmingClassCommandUI.js'
import {StringUtil}                 from '../../core/util.js'
import {sysConstants }              from '../../core/sysConst.js'

const STUDENT_CONTAINER_TEMPLATE = 
`<div id="{ctnrid}">
 </div>`

 const STUDENT_INFO_TEMPLATE = 
`<h3>{stdnm}</h3>
<div style="min-height: 200px">
    <div style="background-color: #007fff">
        <button class="{rnbtnclss} save_work_btn" id="{runid}" title="Run student code for {stdnm}">
            <img src="../../../../assets/images/tools/run.png" width="40px" height="43"/>
        </button>
    </div>
    <div>
    <textarea id="{stdtaid}" spellcheck="false" placeholder="no code written yet" style="background: #274c43"></textarea>
    </div>
</div>`

const RELACEMENT_CONTAINER_ID = "{ctnrid}"
const RELACEMENT_TEXTAREA_ID = "{stdtaid}"
const RELACEMENT_STUDENT_NAME = "{stdnm}"
const RELACEMENT_RUN_BUTTON_ID = "{runid}"
const RELACEMENT_RUN_BUTTON_CLASS = "{rnbtnclss}"

class Student {
    #name
    #programmingClassCommandUI

    constructor(name, inputConsoleId, outputConsoleId, groupType) {
        this.#name = name
        if (groupType === sysConstants.CLASS_TYPE_JS) {
            this.#programmingClassCommandUI = new ProgrammingClassCommandUI(inputConsoleId, outputConsoleId);
        }
    }

    runCode() {
        if (this.#programmingClassCommandUI) {
            this.#programmingClassCommandUI.runCodeFromTextInput()
        }
    }

    /*
        getters and setters
    */
   get name() { return this.#name }

}

class StudentManager extends ComponentBase {
	#parentView
    #studentList

	constructor(parentView, parentDivId) {
        super("id", "student_man", parentDivId);
        this.#parentView = parentView
        this.#studentList = []
        this.#initUi()
    }

    #initUi() {
        const componentHtml = STUDENT_CONTAINER_TEMPLATE
            .replace(RELACEMENT_CONTAINER_ID, this.containerId);
        
        // mount the component to UI
        super.mount(componentHtml, ComponentBase.MOUNT_TYPE_INSERT);
    }

    /*
        public methods
    */

    addStudents(names) {
        names.forEach( student => {
            this.addStudent(student.userName)
        });
    }

    addStudent(name) {
        if (this.#studentList.find(s => s.name === name)) {
            // student already present
            return;
        }

        // re-initialize the root accordin
        this.#initUi()
        const newStudent = new Student(name, this.studentTaId(name), this.#parentView.contentInputConsole.outputId, this.#parentView.groupType);

        // here comes a new student
        this.#studentList.push(newStudent);

        // re-compose html for all students
        this.#studentList.forEach( student => {
            const studentHtml = STUDENT_INFO_TEMPLATE
                .replaceAll(RELACEMENT_STUDENT_NAME, student.name)
                .replace(RELACEMENT_RUN_BUTTON_CLASS, this.runCodeClass)
                .replace(RELACEMENT_RUN_BUTTON_ID, this.runCodeId(student.name))
                .replace(RELACEMENT_TEXTAREA_ID, this.studentTaId(student.name));

            $(this.containerSelector).append(studentHtml)
        });

        // create accordin
        $(this.containerSelector).accordion({
            collapsible: true
          });

        // hook up run code events
        $(this.runCodeClassSelector).click(this.runCode.bind(this))
    }

    /*
        event handlers
    */
    runCode(e) {
        e.preventDefault(); 
        const studentName = StringUtil.getIdStrFromBtnId(e.currentTarget.id)
        const student = this.#studentList.find(s => s.name === studentName)
        if (student) {
            student.runCode()
        }
    }

    getSutudentCode(name) {
        const studentTaId = this.getStudentTaIdSelector(name);
        return $(studentTaId).val()
    }

    setStudentCode(name, newCode) {
        const studentTaId = this.getStudentTaIdSelector(name);
        $(studentTaId).val(newCode)
    }

    /*
     getters and setters
     */

    get containerId() { return 'yt_student_container'}

    get containerSelector() { return `#${this.containerId}`}

    get runCodeClass() { return 'yt_btn_run_student_code'}

    get runCodeClassSelector() { return `.${this.runCodeClass}` }

    get runCodeIdBase() { return 'yt_btn_run_student_code'}

    get taIdBase() { return 'yt_ta_student_code'}

    getStudentTaIdSelector(student) { return `#${this.studentTaId(student)}` }

    runCodeId(student) { return `${this.runCodeIdBase}_${student}`}

    studentTaId(student) {return `${this.taIdBase}_${student}` }

}

export {StudentManager}

