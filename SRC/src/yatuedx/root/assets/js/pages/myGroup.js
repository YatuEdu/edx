import {groupTypeConstants, sysConstants} 	from '../core/sysConst.js'
import {AuthPage} 				from '../core/authPage.js'
import {Net}                    from '../core/net.js';
import {MyClassTemplates}		from '../component/groupCard.js';


/**
	This class manages all classesd the user belongs to
**/
class MyGroupPageHandler extends AuthPage {
	
	/* 
	 static facotry method for MyGroupPageHandler to assure that it calls its
	 async init method.
	 */
	 static async createMyGroupPageHandler() {
		const myInstance = new MyGroupPageHandler();
		await myInstance.init();
		return myInstance;
	}
	
    constructor() {
		super();
	}
	
	// hook up events
	async init() {
		// important: must call AuthPage init asynchronously
		await super.init();

		// GET my signed up classes
		await this.retrieveMyClasses();

		// Enable one "go to class" button if a live class is going on right now:
		$(this.gotoLiveButtonClassSelector).each(this.enableGotoLiveClassButton.bind(this));

		// event handler hookup
		$(this.gotoLiveButtonClassSelector).click(this.handleEntering.bind(this));
		$(this.sequenceDescriptionExpandClassSelector).click(this.handleSequenceDescriptionExpand.bind(this));
		$(this.gotoExersizeBtnClassSelector).click(this.handleGotoExcersizeRm.bind(this));
	}	
	
	/**
		retrieve the groups that I am registered with.
	 **/
	async retrieveMyClasses() {
		const ret = await Net.myClassSchedules(this.credential.token);
		if (ret.code === 0) {
			const mySchedules = ret.data;

			// group by SUBJECT name
			const groupBySubjectSchedules = this.#groupByReduce(mySchedules, "subject_name");
			// process each class
			let subjectRows = "";
			for(const subject in groupBySubjectSchedules) {
				// html row for this class
				let subjectRowHtml = MyClassTemplates.SUBJECT
										.replace(MyClassTemplates.REPLACE_SUBJECT_NAME, subject);
				// group by classes
				const classList = groupBySubjectSchedules[subject];

				// group by class names
				const groupByClass = this.#groupByReduce(classList, "class_id");
				let classRowHtml = "";
				for(const clssId in groupByClass) {
					const currentClassList = groupByClass[clssId];
					const defaultSequenceIdForExercise = currentClassList[0].sequence_id;
					const classHtml  = MyClassTemplates.CLASS
										.replace(MyClassTemplates.REPLAC_CLASS_NAME, currentClassList[0].class_name)
										.replace(MyClassTemplates.REPLACE_GOTO_EXCERSICE_RM_BTN_CLASS, this.gotoExersizeBtnClass)
										.replaceAll(MyClassTemplates.REPLACE_GROUP_ID, clssId)
										.replaceAll(MyClassTemplates.REPLACE_SEQUENCE_ID, defaultSequenceIdForExercise)

					const groupBySequences = this.#groupByReduce(currentClassList, "sequence_id");
					let sequnceRows = "";
					for(const seq in groupBySequences) {
						const sequenceList = groupBySequences[seq];
						sequenceList.forEach(q => {
							const jsDate = new Date(q.start_time * 1000);
							const sequenceHtml  = MyClassTemplates.SEQUENCE
													.replace(MyClassTemplates.REPLACE_SEQUENCE_NAME, q.sequence_name)
													.replace(MyClassTemplates.REPLACE_SEQUENCESTART, jsDate.toString())
													.replaceAll(MyClassTemplates.REPLACE_GROUP_ID, q.class_id)
													.replaceAll(MyClassTemplates.REPLACE_SEQUENCE_ID, q.sequence_id)
													.replace(MyClassTemplates.REPLACE_SEQUENCE_DESCRPT_DIV, this.sequenceDescriptionDivId(q.sequence_id))
													.replace(MyClassTemplates.REPLACE_SEQUENCE_DESCRPT, q.sequence_description)
													.replace(MyClassTemplates.REPLACEMENT_SEQUENCE_DESCRPT_EXPAND_BTN_TEXT, this.getExpButtonText(true))
													.replace(MyClassTemplates.REPLACE_SEQUENCE_DESCRPT_EXPAND_CLASS, this.sequenceDescriptionExpandClass)
													.replace(MyClassTemplates.REPLACE_GOTO_LIVE_CLASS, this.gotoLiveButtonClass)
													.replace(MyClassTemplates.REPLACE_SEQUENCELEN, q.length_in_min / 60); 
							sequnceRows += sequenceHtml;
						});
					}
					classRowHtml += classHtml.replace(MyClassTemplates.REPLACE_SEQUENCE_ROWS, sequnceRows);		
				}
				subjectRowHtml = subjectRowHtml.replace(MyClassTemplates.REPLACE_CLASS_ROWS, classRowHtml);
				subjectRows += subjectRowHtml;
			}
			const html = MyClassTemplates.SECTION
			 				.replace(MyClassTemplates.REPLACE_SUBJECT_ROWS, subjectRows);

			 $(".myGroupRow").append(html);
		}
	}

	#groupByReduce(myClassSchedules, key) {
		return myClassSchedules.reduce((acc, currentValue) => {
			let groupKey = currentValue[key];
			if (!acc[groupKey]) {
			acc[groupKey] = [];
			}
			acc[groupKey].push(currentValue);
			return acc;
		}, {});
	}
	
	/**
		Enter the exercize room if applicable
	**/
	handleGotoExcersizeRm(e) {
		e.preventDefault();
		
		// go to exercize room as student
		const jqObject = e.target;
		const groupId = $(jqObject).attr('data-clss-id');
		const seqId = $(jqObject).attr('data-seq-id');

		// set class room mode
		window.location.href 
		=  `./class-room.html?${sysConstants.UPN_GROUP}=${groupId}&${sysConstants.UPN_SEQUENCE}=${seqId}&${sysConstants.UPN_TEACHER}=any&mode=1`;
	}
	
	/**
	 * Expand or shrink the sequence description.
	 * 
	 * @param {*} e 
	 */
	handleSequenceDescriptionExpand(e) {
		e.preventDefault();

		const jqObject = e.target;
		const seqId  = parseInt($(jqObject).attr('data-seq-id'));
		const btnTxt = $(jqObject).html();
		if (this.getExpButtonText(true) === btnTxt) {
			$(this.sequenceDescriptionDivSelector(seqId)).show();
			$(jqObject).html(this.getExpButtonText(false));
		} else {
			$(this.sequenceDescriptionDivSelector(seqId)).hide();
			$(jqObject).html(this.getExpButtonText(true));
		}
	}

	/**
		Enter live class when a live class is happening
	**/
	handleEntering(e) {
		e.preventDefault();
		const target = e.target;

		// retrieve group meta data
		const {groupId, sequenceId} = this.retrieveGroupAndSequenceId(target);

		// live class is going on...
		if (!this.liveSession ||
			this.liveSession.group_id !== groupId ||
			this.liveSession.sequence_id !==  sequenceId) {
				alert("Live class is not available!");
				return;
		}

		// where to go
		if (this.liveSession.group_type === groupTypeConstants.GPT_EDU_JSP) {
			// go to class room as student
			window.location.href =  `./class-room.html`;				
		} else {
			// go to chat page
			window.location.href =  `./legacy/videoChat.html?group=${groupId}`; 
		}
	}

	enableGotoLiveClassButton(indx, target) {
		const {groupId, sequenceId} = this.retrieveGroupAndSequenceId(target);
		if (this.liveSession &&
			this.liveSession.group_id === groupId &&
			this.liveSession.sequence_id ===  sequenceId) {
				$(target).prop('disabled', false);
		} else {
				$(target).prop('disabled', true);
		}
	}

	/* retrieve group id and sequence id from button */
	retrieveGroupAndSequenceId(target) {
		const groupId = parseInt($(target).attr('data-clss-id'));
		const sequenceId = parseInt($(target).attr('data-seq-id'));
		return {groupId: groupId, sequenceId:sequenceId}

	}
	

	/* sequence description expansion button */
	get sequenceDescriptionExpandClass() { return "sequence-descrpt-exp"}
	get sequenceDescriptionExpandClassSelector() { return `.${this.sequenceDescriptionExpandClass}`}

	/* sequence description expansion div */
	sequenceDescriptionDivId(seqId) { return `sequence-descrpt-div-${seqId}`}
	sequenceDescriptionDivSelector(seqId) { 
		return `#${this.sequenceDescriptionDivId(seqId)}`
	}

	/* go to excersize rm button */
	get gotoExersizeBtnClass() { return 'go-to-excersize-rm'}
	get gotoExersizeBtnClassSelector() { return `.${this.gotoExersizeBtnClass}` }

	/* go to live clas room button class */
	get gotoLiveButtonClass() { return 'go-to-live-session'}
	get gotoLiveButtonClassSelector() { return `.${this.gotoLiveButtonClass}`}

	/* dynamic button text for detail expandin button */
	getExpButtonText(expand) {
		if (expand) {
			return "+";
		}

		return "-";
	}
	
}

let myGroupPageHandler = null;

$( document ).ready(async function() {
    console.log( "myGroup page ready!" );
	myGroupPageHandler = await MyGroupPageHandler.createMyGroupPageHandler()
});