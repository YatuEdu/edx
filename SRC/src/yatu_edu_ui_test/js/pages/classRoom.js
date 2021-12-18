import {DisplayBoardForCodingTest} from '../test/displayBoardForCoding_Test.js';

let displayBoardForCodingTest = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "login page ready!" );
	displayBoardForCodingTest = new DisplayBoardForCodingTest(null);
});