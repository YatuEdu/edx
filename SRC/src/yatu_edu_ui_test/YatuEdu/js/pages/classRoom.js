import {DisplayBoardForCodingTest} from '../test/displayBoardForCoding_Test.js';


let DisplayBoardForCodingTest = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "login page ready!" );
	DisplayBoardForCodingTest = new DisplayBoardForCodingTest(null);
});