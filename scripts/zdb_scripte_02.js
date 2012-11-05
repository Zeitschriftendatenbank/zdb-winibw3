// Datei:		zdb_scripte_02.js
// Autor:			Carsten Schulze (ZDB)
// Korrektur:		Carsten Schulze (ZDB),
//					26.05.2011 closed theFileInput in __zdbCheckUpdates
//					15.03.2011 zdb_updateMeldung() korrigiert
//					05.01.2011 zdb_updateMeldung mit Felermeldung erg�nzt
//					04.01.2011 __zdbGetXML mit try & catch erg�nzt
//========================================
// START ****** Update ******
//========================================
//Script wird beim Start der WinIBW3 ausgef�hrt:
//zdb_updateMeldung();

function zdb_updateMeldung()
{
	var date = __zdbUpdateDate();
	if(!date || date == false) {
		application.messageBox("Verbindung nicht m�glich", "Die WinIBW kann wahrscheinlich keine Daten aus dem WWW abrufen.", "alert-icon");
		return;
	}
	//application.messageBox("Datum", date, "message-icon");
	//__zdbCheckUpdates(date);
	if (application.getProfileString("zdb.updateservice", "lastdate", "") < date) {
		application.writeProfileString("zdb.updateservice", "lastdate", date);
		application.messageBox("Hinweis zum Update", "Die Scripte der WinIBW3 sind aktualisiert worden.", "message-icon");
	}
}
//========================================
// ENDE****** Update ******
//========================================
//--------------------------------------------------------------------------------------------------------
//name:		__zdbCheckUpdates()
//replaces:		__zdbCheckUpdates()
// calls		__zdbGetXML() , __zdbXMLValues()
//description:	compares last modified date of files with date of last update
//user:	  	all users
//input: 		date of the last update
//return:		message Box with files which are not up to date
//author: 		Carsten Schulze
//date:		2010-09-24
//version:		1.0.0.0
//status:		testing
//--------------------------------------------------------------------------------------------------------
function __zdbCheckUpdates(date){
	//--- the schema to retrieve
	var schema = {
		rowtag: "file",
		columns: [
			{tagname: "@destination", label: "Destination"},
		]
	}
	var url = application.getProfileString("ibw.updateservice", "url", "") + "/update.xml"
	var xmlDoc = __zdbGetXML(url);
	//--- give me all files from the first node
	var files = __zdbXMLValues(xmlDoc, schema ,1,0);
	
	//--- initiate date as an  date object
	var year = date[0] + "" + date[1] + "" + date[2] + "" + date[3]; //---  2010
	var month = parseInt(date[4] + "" + date[5],10)-1; //--- 0 = Jan, 1 = Feb etc
	var day = parseInt(date[6] + "" + date[7],10); //--- 1...31
	var lastDateUpdate = new Date(year,month,day).getTime(); //--- covert to milliseconds
	//--- iterate files
	for(var num in files){
	//---	replace slash with backslash
		var fileName = files[num][0].replace(/\057/g,"\\");
		var theFileInput = utility.newFileInput();
	//---	get the path of the file within the BinDir
		var filePath = theFileInput.getSpecialPath("BinDir", fileName);
		theFileInput.close();
		//--- initiate a local file
		var localFile = Components.classes['@mozilla.org/file/local;1']
				 .createInstance(Components.interfaces.nsILocalFile);					 
	//---	initiate the local file with the file path
		localFile.initWithPath(filePath);
		localFile.normalize();
	//--- 	does it exist now
		if ( localFile.exists() == false ) {
			application.messageBox("Fehler", "Datei " + filePath + " wurde nicht gefunden.\n" + 
			"M�glicherweise funktioniert Ihr automatisches Update nicht.", "error-icon");
		} else {
		//---	intiate a date object for each file date
			var simpleDate = new Date(localFile.lastModifiedTime).toDateString();
		//---	covert to a simple string and get milliseconds
			var fileLastMod = new Date(simpleDate).getTime();
		//---	application.messageBox("Update Meldung", "File:" + fileLastMod + "Update:" + lastDateUpdate, "alert-icon");
			if(fileLastMod < lastDateUpdate){
				notUptoDate += filePath + "\n";
				application.messageBox("Update Meldung", "Die Datei " + filePath + " ist �lter als das aktuelle Update.\n" + 
				"M�glicherweise sind Ihre Skripte veraltet.\n" + 
				"L�schen Sie Ihre Tempor�ren Internetdateien oder �berpr�fen Sie,\n" +
				"ob eventuell Proxy-Einstellungen oder Zugriffsrechte ge�ndert werden m�ssen.", "alert-icon");
		// --	this gives winibw the chance to perform the update again		
				application.writeProfileString("ibw.updateservice", "lastdate", date);
			}
		}
	}
}

//--------------------------------------------------------------------------------------------------------
//name:		__zdbUpdateDate()
//replaces:		__zdbUpdateDate()
// calls		__zdbGetXML() , __zdbXMLValues()
//description:	gets the date of the last update
//user:	  	all users
//input: 		void
//return:		date of last update
//author: 		Carsten Schulze
//date:		2010-09-24
//version:		1.0.0.0
//status:		testing
//--------------------------------------------------------------------------------------------------------
function __zdbUpdateDate(){	
	//--- the schema to retrieve
	var schema = {
		rowtag: "update",
		columns: [
			{tagname: "@date", label: "Datum"}
		]
	
	}
	var url = application.getProfileString("ibw.updateservice", "url", "") + "/update.xml"
	var xmlDoc = __zdbGetXML(url);
	if(!xmlDoc || xmlDoc == false) return false;
	var datum = __zdbXMLValues(xmlDoc, schema ,1,0);
	//application.messageBox("Datum",datum, false);
	return datum[0][0];
}
//--------------------------------------------------------------------------------------------------------
//name:		__zdbGetXML()
//replaces:		__zdbGetXML()
//description:	makes a xmlhttprequest to fetch a xml document
//user:	  	all users
//input: 		the url of the xml document to fetch
//return:		the xml document
//author: 		Carsten Schulze
//date:		2011-01-04
//version:		1.0.0.1
//status:		testing
//--------------------------------------------------------------------------------------------------------
function __zdbGetXML(url){
	var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
	try {
		req.open('GET', url, false);
		req.send(null);
		return req.responseXML;
	} catch(e) {
		return false;
	}
}

//--------------------------------------------------------------------------------------------------------
//name:		__zdbXMLValues()
//replaces:		__zdbXMLValues()
// calls		__zdbRowValues(), __zdbFilterXML()
//description:	parses a xml document and retrieves the values decribed by a schema
//			a schema looks like:
//			var schema = {
//				rowtag: "theNameOfTheTagToEvaluate",
//				filter: [
//					{tagname: "theNameOfTheTagsORTheAttributeToEvaluate", value: "TheValueToFilterFor"}
//				],
//				columns: [
//					{tagname: "theNameOfTheTagsORTheAttributeToGetTheValueFrom", lable: "LableOfTheValue"},
//					more Tags allowed here...
//				]			
//			}
//user:	  	all users
//input: 		xmldoc: the xml document, schema: the schema for retrieving the values, xmlRowsCount: number of nodes to evaluate (0 = all), start: the node to start evaluating (0 = first node)
//return:		array: the values according to the schema
//author: 		Carsten Schulze
//date:		2010-09-24
//version:		1.0.0.0
//status:		testing
//--------------------------------------------------------------------------------------------------------

function __zdbXMLValues(xmldoc, schema, xmlRowsCount, start) {
	
    //--- get the elements that contain our data from the xml document
    var xmlrows = xmldoc.getElementsByTagName(schema.rowtag);
	//--- if xmlRowsCount is zero, all rows are processed
	if(xmlRowsCount == 0) xmlRowsCount = xmlrows.length;
	var val = new Array();
    //--- Loop through these elements. Each one contains a row of the table
    for(var r=0; r < xmlRowsCount; r++) {
		var value = new Array();
    //---	This is the XML element that holds the data for the row
        var xmlrow = xmlrows[r];
    //---	Loop through the columns specified by the schema object
        for(var c = start; c < schema.columns.length; c++) {
			var sc = schema.columns[c];
			var tagname = (typeof sc == "string")?sc:sc.tagname;
			
		//---	first check if to filter the rows
			if(schema.filter){
			//---	now check to filter a single row and getr the content
				if(__zdbFilterXML(xmlrow,schema) !== false) value[c] = __zdbRowValues(xmlrow,schema,tagname);
				val[r] = value;
			}
		//---	don't filter rows
			else {
			//---	just get the content
				value[c] = __zdbRowValues(xmlrow,schema,tagname);
				val[r] = value;
			}
        }
    }
	return val;
}
//--------------------------------------------------------------------------------------------------------
//name:		__zdbFilterXML()
//replaces:		__zdbFilterXML()
//description:	filters a node according to the schema
//user:	  	all users
//input: 		xmlrow: a node, schema: the schema to filter for,
//return:		the xml document
//author: 		Carsten Schulze
//date:		2010-09-24
//version:		1.0.0.0
//status:		testing
//--------------------------------------------------------------------------------------------------------
function __zdbFilterXML(xmlrow,schema){
	var sc = schema.filter[0];
	//--- filter attribute or tag?
	if (sc.tagname.charAt(0) == '@') {
	//---	is this row to parse? Yes or No?
		var bool = (xmlrow.getAttribute(sc.tagname.substring(1)) == sc.tagname) ? true : false;
		return bool;
	} 
	//--- filter a tag
	else {
	//---	is this row to parse? Yes or No?
		var xmlcell = xmlrow.getElementsByTagName(sc.tagname)[0];
		var bool = (xmlcell.firstChild.data == sc.value) ? true : false;
		return bool;
	}
}
//--------------------------------------------------------------------------------------------------------
//name:		__zdbRowValues()
//replaces:		__zdbRowValues()
//description:	extracts the values of attributes or tags
//user:	  	all users
//input: 		xmlrow: a node, schema: the schema, tagname: name of the tag
//return:		the value
//author: 		Carsten Schulze
//date:		2010-09-24
//version:		1.0.0.0
//status:		testing
//--------------------------------------------------------------------------------------------------------
function __zdbRowValues(xmlrow,schema,tagname){
	//--- check if its an attribute you want
	if (tagname.charAt(0) == '@') {
	//---	If the tagname begins with '@', it is an attribute name
		return xmlrow.getAttribute(tagname.substring(1));
	}
	else {
		var xmlcell = xmlrow.getElementsByTagName(tagname)[0];
	//---	Assume that element has a text node as its first child
		return xmlcell.firstChild.data;
	}

}

function excelTabelle()
{
	var xulFeatures = "centerscreen, chrome, close, titlebar,modal=no,dependent=yes, dialog=yes";
	open_xul_dialog("chrome://ibw/content/xul/gbv_excelTabelle_dialog.xul", xulFeatures);
}
