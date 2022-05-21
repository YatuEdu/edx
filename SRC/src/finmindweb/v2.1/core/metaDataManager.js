var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { Net } from './net.js';

/*
 Some known regex
 */

var REG_FOR_EVERYTHING = /.*/gim;
var REG_FOR_SSN = /^\d{3}-?\d{2}-?\d{4}$/;
var REG_FOR_US_PHONE_NUMBER = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
var REG_FOR_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
	Enum strings.  TODO: generate them from finMind API
**/
var drop_down_none_selection = '----------';
var enumValueForSex = ['Male', 'Female', 'Other'];
var enumValueForMarriage = ['Single', 'Married', 'Divorced', 'Widowed'];
var enumExerciseFrequency = ['Never', 'Rarely', 'Sometimes', 'Often'];
var enumDrinkingFrequency = ['Never', 'Light', 'Social Occasion', 'Heavy'];
var enumResidence = ['Own', 'Rent'];
var enumIncomeRange = ['Under 20K', '20-50K', '50-100K', '100-150K', 'Above 150K'];
var intention = ['Providing protection for my family, maximize death benefit', 'Providing living benefits, long term care', 'Providing living benefits with specified medical conditions', 'Cash accumulation for supplemental income', 'Mortgage protection', 'Estate planning', 'I am not sure', 'I want to get an illustration', 'I want to know more about product from Insurer List'];
var enumYesNo = ['Yes', 'No'];
var enumUsCitizenOrNot = ['US Citizen', 'US Green-card holder', 'None of the above'];
// const enumCoverageAmount =  [
// '300K',
// '400K',
// '500K',
// '600K',
// '700K',
// '800K',
// '900K',
// '1million',
// '2millions',
// '3millions',
// '4millions',
// '5millions',
// '6millions',
// '7millions',
// '8millions',
// '9millions',
// '10millions',
// ];
var enumCoverageAmount = ['$300,000', '$400,000', '$500,000', '$600,000', '$700,000', '$800,000', '$900,000', '$1 million', '$2 millions', '$3 millions', '$4 millions', '$5 millions', '$6 millions', '$7 millions', '$8 millions', '$9 millions', '$10 millions'];

// convertion map: amount string to amount integer
var AMOUNT_CONVERTION_MAP = new Map([['$300,000', 300000], ['$400,000', 400000], ['$500,000', 500000], ['$600,000', 600000], ['$700,000', 700000], ['$800,000', 800000], ['$900,000', 900000], ['$1 million', 1000000], ['$2 millions', 2000000], ['$3 millions', 3000000], ['$4 millions', 4000000], ['$5 millions', 5000000], ['$6 millions', 6000000], ['$7 millions', 7000000], ['$8 millions', 8000000], ['$9 millions', 9000000], ['$10 millions', 10000000]]);

var enumCoverageType = ['Term life', 'Permanent life'];
var enumTermCoverageYears = ['Permanent life', '10 years', '15 years', '20 years', '25 years', '30 years', '35 years', '40 years'];

var enumApplicantRelationship = ['Self', 'Child', 'Parent', 'Spouse'];
var enumBeneficiaryRelationship = ['Child', 'Spouse', 'Parent', 'Other'];
var enumImminentEvent = ['Want to consider living benefit option', 'Take or plan to take any of high-risk activities such as skydiving, scuba diving, car racing, hang gliding, ultralight flying, cave exploration, and etc.', 'A member of, or plan on joining any branch of, the Armed Forces or reserve military unit', 'Want to consider adding accidental death benefits as rider', 'Want to consider adding chronicle illness benefits as rider', 'Want to consider adding critical medical/injuries/disability benefits as rider', 'Want to consider adding terminal illness benefits as rider', "Want to consider adding children's term rider"];

var stateList = [drop_down_none_selection, 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Oregon', 'Washionton'];

var countryList = [drop_down_none_selection, 'United States', 'Afghanistan', 'Canada', 'China', 'France', 'Israel', 'Russia', 'South Africa', 'South Korea', 'Taiwan', 'Thailand', 'United Kingdom'];

var enumMilServices = ['Army', 'Air Force', 'Coast Guard', 'Marine Corps', 'Navy', 'Space Force'];

var enumAvocation = ['Skydiving or Parachuting', 'Underwater and Scuba Diving', 'Gliding (Kite or Other), or Flying Ultra-Light Aircraft', 'Motor Racing on land or water', 'Ballooning', 'Mountain Climbing'];

var enumPaymentSchedule = ['Monthly', 'Quarterly', 'Semi-annual', 'Annually'];
var enumImmigrationVisaType = ['Student (F)', 'Business (L)', 'Work (H)', 'Other'];

var enumInsCompanies = ['Columbus', 'New York Life', 'Trans Pacific', 'Other'];

// TODO: obtain this from server 
var enumMap = new Map([[6, enumValueForSex], // enum type for sex
[7, enumValueForMarriage], // enum type for marriage status
[8, enumExerciseFrequency], // enum type for weekly exercise
[9, enumDrinkingFrequency], // enum type for drinking often
[10, enumResidence], // enum type for residence situation
[12, enumIncomeRange], // enum type for income range
[13, enumYesNo], // enum type for yes no question
[14, enumCoverageAmount], // enum type for coverage amount
[15, enumCoverageType], // enum type for coverage type
[16, enumTermCoverageYears], // enum type for term coverage years
[17, enumApplicantRelationship], // enum type for applicant relationship
[34, enumImminentEvent], // enum type for emerneng events
[19, intention], // enum type for issurance purpose
[20, enumYesNo], // enum type for yes no question with extra text area
[25, enumUsCitizenOrNot], [26, stateList], // enum for US STATE LIST
[27, enumMilServices], // enum for military services
[28, enumAvocation], // enum for avocation
[29, enumPaymentSchedule], // enum for payment schedule
[30, countryList], // enum for country
[31, countryList], // enum for country
[32, enumImmigrationVisaType], // enum for immigration visa type
[50, enumBeneficiaryRelationship], // enum for beneficiary relationship
[60, enumInsCompanies]]);

var enumYesValueMap = new Map([[20, 'Yes'], [25, 'US Green-card holder']]);

var attrList = [{ id: 1, question_text: 'Insured gender', type: 6, cat: 1 }, { id: 2, question_text: 'Insured age', type: 1, cat: 1 }, { id: 3, question_text: 'insured height', type: 4, cat: 1 }, { id: 7, question_text: 'How often does the insured exercise', type: 8, cat: 2 }, { id: 11, question_text: 'Insured marriage status', type: 7, cat: 1 }, { id: 12, question_text: 'How often does the insured drink?', type: 8, cat: 2 }, { id: 19, question_text: 'In how many years does the insured plan to retire?', type: 8, cat: 2 }, { id: 25, question_text: 'Does the insured use marijuana?', type: 8, cat: 2 }, { id: 26, question_text: 'Does the insured smoke?', type: 8, cat: 2 }, { id: 29, question_text: 'Have the insured been diagnosed with critical or severe illnesses such as heart attack, cancer,  tumor, lung or respiratory disorder, brain or nerve system disorder, HIV/AIDS and etc (Tip: Common critical or severe illnesses)?', type: 13, cat: 3 }, { id: 31, question_text: 'Does any of the following apply to the insured?', type: 18, cat: 2 }, { id: 1024, question_text: 'Thank you for choosing permanent life insurance. Please check all insurance needs that apply in order for our agent to assist you better?', type: 19, cat: 2 }];

var attrNameList = {
	email: 'app_email',
	name: 'app_name',
	address: 'app_address'
};

var MetaDataManager = function () {
	function MetaDataManager() {
		_classCallCheck(this, MetaDataManager);
	}

	_createClass(MetaDataManager, null, [{
		key: 'dropDownNoneSelection',

		/**
  	get drop_down_none_selection
  **/
		get: function get() {
			return drop_down_none_selection;
		}

		/**
  	get Reg_For_Everything
  **/

	}, {
		key: 'regForEverything',
		get: function get() {
			return REG_FOR_EVERYTHING;
		}

		/**
  	get reg_for_ssn
  **/

	}, {
		key: 'regForSSN',
		get: function get() {
			return REG_FOR_SSN;
		}

		/**
  	get REG_FOR_US_PHOMNE_NUMBER
  **/

	}, {
		key: 'regForUSPhoneNumber',
		get: function get() {
			return REG_FOR_US_PHONE_NUMBER;
		}

		/**
  	get REG_FOR_EMAIL
  **/

	}, {
		key: 'regForeEmail',
		get: function get() {
			return REG_FOR_EMAIL;
		}

		/**
  	get enumMap
  **/

	}, {
		key: 'enumMap',
		get: function get() {
			return enumMap;
		}

		/**
  	get amount convertion map
  **/

	}, {
		key: 'amountConvertionMap',
		get: function get() {
			return AMOUNT_CONVERTION_MAP;
		}
	}, {
		key: 'enumTermCoverageYears',
		get: function get() {
			return enumTermCoverageYears;
		}

		/**
  	get enumYesValueMap
  **/

	}, {
		key: 'enumYesValueMap',
		get: function get() {
			return enumYesValueMap;
		}

		/*
    get attr name
    */

	}, {
		key: 'attrNames',
		get: function get() {
			return attrNameList;
		}

		/**
  	get All supported attributes
  **/

	}, {
		key: 'attrList',
		get: function get() {
			return attrList;
		}
	}]);

	return MetaDataManager;
}();

export { MetaDataManager };