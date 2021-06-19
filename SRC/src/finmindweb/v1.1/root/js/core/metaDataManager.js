import {Net}          	from './net.js';

/**
	Enum strings.  TODO: generate them from finMind API
**/
const enumValueForSex =  ['Male', 'Female', 'Other' ];
const enumValueForMarriage =  ['Single', 'Married', 'Divorced', 'Widowed' ];
const enumExerciseFrequency =  ['Never', 'Rarely', 'Sometimes', 'Often' ];
const enumDrinkingFrequency =  ['Never', 'Light', 'Social Occasion', 'Heavy' ];
const enumResidence =  ['Own', 'Rent' ];
const enumIncomeRange =  ['Under 20K', '20-50K', '50-100K', '100-150K', 'Above 150K'];
const enumYesNo =  ['Yes', 'No'];
const enumCoverageAmount =  [
'300K',
'400K',
'500K',
'600K',
'700K',
'$800K',
'$900K',
'$1 million',
'$2 millions',
'$3 millions',
'$4 millions',
'$5 millions',
'$6 millions',
'$7 millions',
'$8 millions',
'$9 millions',
'$10 millions',
];
const enumCoverageType =  ['Term', 'Permanant'];
const enumTermCoverageYears = ['10 years', '15 years', '20 years', '25 years', '30 years', '35 years', '40 years'];
const enumApplicantRelationship = ['Self', 'Child', 'Parent', 'Spouse'];
const enumImminentEvent = 
			['Want to consider living benefit option', 
			 'Take or plan to take any of high-risk activities such as skydiving, scuba diving, car racing, hang gliding, ultralight flying, cave exploration, and etc.', 
			 'A member of, or plan on joining any branch of, the Armed Forces or reserve military unit.'
			];

// TODO: obtain this from server 
const enumMap = new Map([
    [ 6, enumValueForSex ],  			// enum type for sex
    [ 7, enumValueForMarriage],  		// enum type for marriage status
    [ 8, enumExerciseFrequency],   		// enum type for weekly exercise
	[ 9, enumDrinkingFrequency],   		// enum type for drinking often
	[ 10, enumResidence],  				// enum type for residence situation
	[ 12, enumIncomeRange],  			// enum type for income range
	[ 13, enumYesNo],  					// enum type for yes no question
	[ 14, enumCoverageAmount],  		// enum type for coverage amount
	[ 15, enumCoverageType],  			// enum type for coverage type
	[ 16, enumTermCoverageYears],  		// enum type for term coverage years
	[ 17, enumApplicantRelationship],  	// enum type for applicant relationship
	[ 18, enumImminentEvent],  			// enum type for emerneng events
  ]);

const attrList =  [
	{id: 1, question_text: 'Insured gender',	type: 6,	cat: 1},
	{id: 2, question_text: 'Insured age',	type: 1,	cat: 1},
	{id: 3, question_text: 'insured height',	type: 4,	cat: 1},
	{id: 7, question_text: 'How often does the insured exercise',	type: 8,	cat: 2},
	{id: 11, question_text: 'insured marriage status',	type: 7,	cat: 1},
	{id: 12, question_text: 'How often does the insured drink?',	type: 8,	cat: 2},
	{id: 19, question_text: 'In how many years does the insured plan to retire?',	type: 8,	cat: 2},
	{id: 25, question_text: 'Does the insured use marijuana?',	type: 8,	cat: 2},
	{id: 26, question_text: 'Does the insured smoke?',	type: 8,	cat: 2},
	{id: 29, question_text: 'Have the insured been diagnosed with critical or severe illnesses such as heart attack, cancer,  tumor, lung or respiratory disorder, brain or nerve system disorder, HIV/AIDS and etc (Tip: Common critical or severe illnesses)?',	type: 13, cat:3},
	{id: 31, question_text: 'Does any of the following apply to the insured?',	type: 18,	cat: 2},	
];

class MetaDataManager {
	/**
		get enumMap
	**/
	static get enumMap() {
		return enumMap
	}
	
	/**
		get All supported attributes
	**/	
	static get attrList() {
		return attrList;
	}
}

export { MetaDataManager };