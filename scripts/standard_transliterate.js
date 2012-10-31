 /*************************************************************************************************
 * 
 *	This file contains the standard WinIBW script functions for transliteration
 *
 *************************************************************************************************
 */					
 var selectedNumber_trans;				// selected number in numberList
 var selectedSourceCode_trans;		// selected sourceCode in sourceTargetList
 var selectedTargetCode_trans;		    // selected targetCode in sourceTargetList
 var dataFilename_trans = "transliterateData.txt"; // the file for storing transliterate-data, which is in the directory /profiles/user-name/transliterate
 
const transliterateUtility =
{   
    numbersArray: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
                            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",                             
                            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
                            "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
                            "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
                            "51", "52", "53", "54", "55", "56", "57", "58", "59", "60",
                            "61", "62", "63", "64", "65", "66", "67", "68", "69", "70",
                            "71", "72", "73", "74", "75", "76", "77", "78", "79", "80",
                            "81", "82", "83", "84", "85", "86", "87", "88", "89", "90",
                            "91", "92", "93", "94", "95", "96", "97", "98", "99",],                               
    
getNextNumber: function(curNr) {        
		for (i = 0; i < this.numbersArray.length; i++) {
			if (this.numbersArray[i] == curNr) {
				return this.numbersArray[i+1];
			}				
		}
	},

    add_numberLanCode: function(lineNr, tag, nr_sourceCode, nr_targetCode) {
         var currentLineNr;
 
         application.activeWindow.title.startOfField(false); 
         application.activeWindow.title.charRight(tag.length+1, false);
         application.activeWindow.title.insertText(nr_sourceCode);
         
         application.activeWindow.title.lineDown(1, false);
         currentLineNr = application.activeWindow.title.currentLineNumber;
         if (currentLineNr == lineNr) {
            application.activeWindow.title.endOfField(false);
			application.activeWindow.title.insertText("\n");
	     } else {	
	        application.activeWindow.title.startOfField(false);
		 }	
           
         var tagNrCode = tag + " " + nr_targetCode + "\n";
		 application.activeWindow.title.insertText(tagNrCode); 
		 application.activeWindow.title.startOfField(false);
    }, 
        
    readSavedDataFromFile: function() {
        var theFileInput = utility.newFileInput();
            
        // ProfD is the mozilla definition of the location where user profile is located.   
    	if (!theFileInput.openSpecial("ProfD", "\\transliterate\\" + dataFilename_trans)) {
    			application.messageBox("Alert",gPicaUtility.getMessage("SetupTransliterate"), "alert-icon");
    			return false;
    	}
    		
    	for (var i=0; i<3; i++) {
    	   switch (i) {
    	       	case 0:  selectedNumber_trans = theFileInput.readLine();  break;	
    			case 1:  selectedSourceCode_trans = theFileInput.readLine();  break;	
    			case 2:  selectedTargetCode_trans = theFileInput.readLine();  break;
    			default: break;	
    		}	
    	}
        
        theFileInput.close(); 
	return true;	
    }
};        

// The function is to repeat transliterate process with saved data
function repeatTransliterate()
{	 
    if (!application.activeWindow.title) {
		application.messageBox("Alert",gPicaUtility.getMessage("MustBeEditing"), "alert-icon"); 
		return;
	}	
		
    // read the saved transliterate-data from the file "transliterateData.txt"
    if (!transliterateUtility.readSavedDataFromFile()) 
    	return;
	    
    // set the start point of the selected texts   
    var positionStart = application.activeWindow.title.selStart;
     
    // set the end point of the selected texts
    var positionEnd = application.activeWindow.title.selEnd;
    application.activeWindow.title.setSelection(positionEnd, positionEnd, "false");
    application.activeWindow.title.lineDown(1, false);
    var lineNrEnd = application.activeWindow.title.currentLineNumber;
    var selectLineNrEnd = lineNrEnd;
   
    // preparations for adding number and languagecode for each line
    application.activeWindow.title.setSelection(positionStart, positionStart, "false");
    var curTag, curLineNr;
    var oldTag = 0;
    var theNumber, lineNrCurrent;
    var numberSourceCode, numberTargetCode;
    var contEmptyTag = 0;
    var contTag = 0;
    var lineNrMax;
    var doUp = false;
    
    // process the empty tag before the first line of the selection
    curLineNr = application.activeWindow.title.currentLineNumber;
    if (curLineNr > 1) {
		while (application.activeWindow.title.tag == "") {
			if (curLineNr != 1) {
				application.activeWindow.title.lineUp(1, false); 
				doUp = true;
				curLineNr = application.activeWindow.title.currentLineNumber;
			} else {
				doUp = false;
				break;
			}			
		}
		if (doUp == true) {	
			application.activeWindow.title.lineDown(1, false);
		}	
	 }	
	 
	// within the selection, cont empty tags and no-empty tags  
    do {
			curLineNr = application.activeWindow.title.currentLineNumber;
		 	curTag = application.activeWindow.title.tag;
		 	if 	(curTag == "") {
		 		contEmptyTag++;
		 	} else {
		 		contTag++;
		 	}	
		 	application.activeWindow.title.lineDown(1, false);
	}  while (curLineNr < selectLineNrEnd-1)		 	
    
    // get the end of line after transliteration 
    lineNrEnd = lineNrEnd + contTag; 
    
    // set the cursor at the begining of the selection
    application.activeWindow.title.setSelection(positionStart, positionStart, "false"); 
    
    // add number and languagecode for each line 
    do {
    	 curLineNr = application.activeWindow.title.currentLineNumber;
         curTag = application.activeWindow.title.tag;
 
		 // if line is empty, only move cursor one line down
		 if (curTag == "") {
		 	if (curLineNr >= lineNrEnd-1) {
				break;	
			}	
			
			oldTag = curTag; 
			lineNrCurrent  = application.activeWindow.title.currentLineNumber;
			application.activeWindow.title.lineDown(1, false);
		 } else {		        
			if ( (curTag == oldTag) && (curLineNr != 1) ) {
     			theNumber = transliterateUtility.getNextNumber(theNumber);
				numberSourceCode = "[\\" + theNumber + "," + selectedSourceCode_trans + "\\]";
				numberTargetCode = "[\\" + theNumber + "," + selectedTargetCode_trans + "\\]";
			} else {
				theNumber = selectedNumber_trans;
       			numberSourceCode = "[\\" + selectedNumber_trans + "," + selectedSourceCode_trans + "\\]";
				numberTargetCode = "[\\" + selectedNumber_trans + "," + selectedTargetCode_trans + "\\]";
			}
			transliterateUtility.add_numberLanCode(curLineNr, curTag, numberSourceCode, numberTargetCode); 
			lineNrCurrent  = application.activeWindow.title.currentLineNumber;
			oldTag = curTag; 
		}    
     }  while (lineNrCurrent < lineNrEnd)
     
     // perform transliterate process     
     application.activeWindow.pressButton(2); 
     
// set the cursor at the beginning of the next line after transliteration
//     application.activeWindow.title.startOfField(false);
//     application.activeWindow.title.lineDown(1, false);
//     application.activeWindow.title.lineDown(lineNrEnd-1-contEmptyTag, false);
//	 application.activeWindow.title.startOfField(false);  
}

