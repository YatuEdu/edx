import {Net}          	from './net.js';

/*
 Some known regex
 */
 
 const reg_for_everything = /.*/gim;
 
/**
	Enum strings.  TODO: generate them from finMind API
**/
const drop_down_none_selection = '----------';
const enumValueForSex =  ['Male', 'Female', 'Other' ];
const enumValueForMarriage =  ['Single', 'Married', 'Divorced', 'Widowed' ];
const enumExerciseFrequency =  ['Never', 'Rarely', 'Sometimes', 'Often' ];
const enumDrinkingFrequency =  ['Never', 'Light', 'Social Occasion', 'Heavy' ];
const enumResidence =  ['Own', 'Rent' ];
const enumIncomeRange =  ['Under 20K', '20-50K', '50-100K', '100-150K', 'Above 150K'];
const intention =  [
	'Providing protection for my family, maximize death benefit', 
	'Providing living benefits, long term care', 
	'Providing living benefits with specified medical conditions', 
	'Cash accumulation for supplemental income', 
	'Mortgage protection',
	'Estate planning',
	'I am not sure',
	'I want to get an illustration',
	'I want to know more about product from Insurer List'
	];
const enumYesNo =  ['Yes', 'No'];
const enumUsCitizenOrNot =  ['US Citizen', 'US Green-card holder', 'None of the above'];
const enumCoverageAmount =  [
'300K',
'400K',
'500K',
'600K',
'700K',
'800K',
'900K',
'1million',
'2millions',
'3millions',
'4millions',
'5millions',
'6millions',
'7millions',
'8millions',
'9millions',
'10millions',
];
const enumCoverageType =  ['Term Life', 'Permanent Life'];
const enumTermCoverageYears = ['10 years', '15 years', '20 years', '25 years', '30 years', '35 years', '40 years'];
const enumApplicantRelationship = ['Self', 'Child', 'Parent', 'Spouse'];
const enumImminentEvent = 
			['Want to consider living benefit option', 
			 'Take or plan to take any of high-risk activities such as skydiving, scuba diving, car racing, hang gliding, ultralight flying, cave exploration, and etc.', 
			 'A member of, or plan on joining any branch of, the Armed Forces or reserve military unit.',
			 'Want to consider adding accidental death benefits as rider.',
			 'Want to consider adding chronicle illness benefits as rider',
			 'Want to consider adding critical medical/injuries/disability benefits as rider.',
			 'Want to consider adding terminal illness benefits as rider.',
			 "Want to consider adding children's term rider.",
			];

const stateList =  [
drop_down_none_selection,
'Alabama',
'Alaska',
'Arizona',
'Arkansas',
'California',
'Colorado',
'Connecticut',
'Delaware',
'Oregon',
'Washionton'
];

const countryList =  [
drop_down_none_selection,
'United States',
'Afghanistan',
'Canada',
'China',
'France',
'Israel',
'Russia',
'South Africa',
'South Korea',
'Taiwan',
'Thailand',
'United Kingdom',

];

const enumMilServices= [
	'Army',
	'Air Force',
	'Coast Guard',
	'Marine Corps',
	'Navy',
	'Space Force',
];

const enumAvocation= [
	'Skydiving or Parachuting',
	'Underwater and Scuba Diving',
	'Gliding (Kite or Other), or Flying Ultra-Light Aircraft',
	'Motor Racing on land or water',
	'Ballooning',
	'Mountain Climbing',
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
	[ 19, intention],					// enum type for issurance purpose
	[ 20, enumYesNo],  					// enum type for yes no question with extra text area
	[ 25, enumUsCitizenOrNot],			
	[ 26, stateList],					// enum for US STATE LIST
	[ 27, enumMilServices],				// enum for military services
	[ 28, enumAvocation],				// enum for avocation
	[ 30, countryList],					// enum for country
  ]);

const enumYesValueMap = new Map([
	[20, 'Yes'],
	[25, 'US Green-card holder'],
]);

const attrList =  [
	{id: 1, question_text: 'Insured gender',	type: 6,	cat: 1},
	{id: 2, question_text: 'Insured age',	type: 1,	cat: 1},
	{id: 3, question_text: 'insured height',	type: 4,	cat: 1},
	{id: 7, question_text: 'How often does the insured exercise',	type: 8,	cat: 2},
	{id: 11, question_text: 'Insured marriage status',	type: 7,	cat: 1},
	{id: 12, question_text: 'How often does the insured drink?',	type: 8,	cat: 2},
	{id: 19, question_text: 'In how many years does the insured plan to retire?',	type: 8,	cat: 2},
	{id: 25, question_text: 'Does the insured use marijuana?',	type: 8,	cat: 2},
	{id: 26, question_text: 'Does the insured smoke?',	type: 8,	cat: 2},
	{id: 29, question_text: 'Have the insured been diagnosed with critical or severe illnesses such as heart attack, cancer,  tumor, lung or respiratory disorder, brain or nerve system disorder, HIV/AIDS and etc (Tip: Common critical or severe illnesses)?',	type: 13, cat:3},
	{id: 31, question_text: 'Does any of the following apply to the insured?',	type: 18,	cat: 2},
	{id: 1024, question_text: 'Thank you for choosing permanent life insurance. Please check all insurance needs that apply in order for our agent to assist you better?',	type: 19,	cat: 2},
];

const attrNameList =  {
	email: 'app_email',
	name:  'app_name',
	address: 'app_address',
};

class MetaDataManager {
	/**
		get drop_down_none_selection
	**/
	static get dropDownNoneSelection() {
		return drop_down_none_selection;
	}
	
	/**
		get Reg_For_Everything
	**/
	static get regForEverything() {
		return reg_for_everything;
	}
	
	/**
		get enumMap
	**/
	static get enumMap() {
		return enumMap
	}
	
	/**
		get enumYesValueMap
	**/
	static get enumYesValueMap() {
		return enumYesValueMap;
	}
	
	/*
	  get attr name
	  */
	static get attrNames() {
		return attrNameList;
	}
	
	/**
		get All supported attributes
	**/	
	static get attrList() {
		return attrList;
	}
	
}

export { MetaDataManager };