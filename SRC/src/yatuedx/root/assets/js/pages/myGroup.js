import {sysConstants, languageConstants, groupTypeConstants} from '../core/sysConst.js'
import {AuthPage} 						 from '../core/authPage.js'
import {Net}                             from '../core/net.js';
import {MyClassTemplates}				 from '../component/groupCard.js';
import {TimeUtil,StringUtil,PageUtil}	 from '../core/util.js';

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
				const groupByClass = this.#groupByReduce(classList, "class_name");
				let classRowHtml = "";
				for(const clss in groupByClass) {
					const classHtml  = MyClassTemplates.CLASS
										.replace(MyClassTemplates.REPLAC_CLASS_NAME, clss);

					const groupBySequences = this.#groupByReduce(groupByClass[clss], "sequence_id");
					let sequnceRows = "";
					for(const seq in groupBySequences) {
						const sequenceList = groupBySequences[seq];
						sequenceList.forEach(q => {
							const jsDate = new Date(q.start_time * 1000);
							const sequenceHtml  = MyClassTemplates.SEQUENCE
													.replace(MyClassTemplates.REPLACE_SEQUENCE_NAME, q.sequence_name)
													.replace(MyClassTemplates.REPLACE_SEQUENCESTART, jsDate.toString())
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
	
	/*
	sortScheduleByTime(schedule) {
		if (schedule.length < 1) {
			return;
		}
		
		// sort by time in descending order
		schedule.sort( (g1, g2) => {
			if (!g1.begin_date && !g2.begin_date) {
				return 0;
			}
			if (g1.begin_date && !g2.begin_date) {
				return -1;
			}
			if (g2.begin_date && !g2.begin_date) {
				return 1;
			}
			
			// comparing date_time
			const t1 = Date.parse(g1.start_time);
			const t2 = Date.parse(g2.start_time + ' ' + g2.begin_time);
			const tnorm1 = new Date(t1);
			const tmorm2 = new Date(t2);
			// side effect by setting displayable time format for the group member
			g1.dt = t1.toString();
			g2.dt = t2.toString();
			g1.displayDate = tnorm1.toDateString();
			g2.displayDate = tmorm2.toDateString();
			g1.displayTime = tnorm1.toLocaleTimeString();
			g2.displayTime = tmorm2.toLocaleTimeString();

			// comparing (early first)
			if (t1 < t2) {
				return -1;
			}
			return 1;
		});
	} */

	
	/*
	async retrieveMyGroups(t, top) {
		const ret = await Net.getAllMyGroups(t, top);
		// append new groups
		if (ret.code === 0) {
			for(let i = 0; i < ret.data.length; i++) {
				const g = ret.data[i];
				const bntId = `#card_btn_${g.secId}`;
				$(".publicGroupRow").append(getGroupCardHtml({id: g.secId, name: g.name, type: g.type}));
				$( bntId ).text("申请加入");
				$( bntId ).click(this.handleJoining.bind(this));
			}
		}
	}
	*/
	
	handleRefill(e) {
		e.preventDefault();
		alert('entering:' + $(this).attr('data-grp-name') + ":" + $(this).attr('data-grp-type'));
	}
	
	
	/**
		Enter the exercize room if applicable
	**/
	handleExercize(e) {
		e.preventDefault();
		
		// go to exercize room as student
		const groupId = $(this).attr('data-grp-id');
		const groupOwner = $(this).attr('data-grp-owner');
		window.location.href =  `./class-room.html?group=${groupId}&teacher=${groupOwner}&mode=1`;
	}
	
	/**
		Enter the video chat group if applicable
	**/
	handleEntering(e) {
		e.preventDefault();
		
		// retrieve group meta data
		const groupId = $(this).attr('data-grp-id');
		const groupName = $(this).attr('data-grp-name');
		const groupType = $(this).attr('data-grp-type');
		const groupOwner = $(this).attr('data-grp-owner');
		const startTimeStr =  $(this).attr('data-grp-dt');
		if (startTimeStr) {
			const startTime =Number(startTimeStr);
			// only allowed to going 10 minutes before a class starts
			const diffInMinutes = TimeUtil.diffMinutes(Date.now(), startTime);
			if (diffInMinutes > 10) {
				alert("The group will be open 10 minutes before it starts");
				return;
			}
			if ( diffInMinutes < -20) {
				alert("You are too late to join this class! Try to be punctual next time.");
				return;
			}
		}
		// check 
		if (groupType == groupTypeConstants.GPT_EDU_JSP) {
			if ( (this.credential.role === sysConstants.YATU_ROLE_TEACHER || 
				 this.credential.role === sysConstants.YATU_ROLE_ADMIN ) && 
				  this.credential.name === groupOwner ) {
				// go to class room as teacher
				window.location.href =  `./class-room-teacher.html?group=${groupId}`;
			}
			else {
				// go to class room as student
				window.location.href =  `./class-room.html?group=${groupId}&teacher=${groupOwner}`;				
			}
		}
		else {
			// go to chat page
			window.location.href =  `./legacy/videoChat.html?group=${groupId}`; 
		}
								   //`./videoChat.html`;

		// `./legacy/chat.html??group=${groupId}`;
	}
	
}

let myGroupPageHandler = null;

$( document ).ready(async function() {
    console.log( "myGroup page ready!" );
	myGroupPageHandler = await MyGroupPageHandler.createMyGroupPageHandler()
});