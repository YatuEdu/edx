import {ComponentBase}  from '../componentBase.js'
import {StringUtil}  from '../../core/util.js'

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
    <textarea id="{stdtaid}"></textarea>
    </div>
</div>`

const RELACEMENT_CONTAINER_ID = "{ctnrid}"
const RELACEMENT_TEXTAREA_ID = "{stdtaid}"
const RELACEMENT_STUDENT_NAME = "{stdnm}"
const RELACEMENT_RUN_BUTTON_ID = "{runid}"
const RELACEMENT_RUN_BUTTON_CLASS = "{rnbtnclss}"

class StudentManager extends ComponentBase {
	#parentView
	#outputId
	#baseIdTag
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
        if (this.#studentList.includes(name)) {
            // student already present
            return;
        }

        // re-initialize the root accordin
        this.#initUi()

        this.#studentList.push(name);

        // here comes a new student
        this.#studentList.forEach( student => {
            const studentHtml = STUDENT_INFO_TEMPLATE
                .replaceAll(RELACEMENT_STUDENT_NAME, student)
                .replace(RELACEMENT_RUN_BUTTON_CLASS, this.runCodeClass)
                .replace(RELACEMENT_RUN_BUTTON_ID, this.runCodeId(student))
                .replace(RELACEMENT_TEXTAREA_ID, this.studentTaId(student));

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
        const student = StringUtil.getIdStrFromBtnId(e.currentTarget.id);
        alert(student)
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

