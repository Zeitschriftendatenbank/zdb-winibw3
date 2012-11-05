// Datei:			zdb_scripte_01.js
// Autor:			Johann Rolschewski, Wenke Röper, Carsten Klee (ZDB)
// Ueberarbeitung: 	Karen Hachmann (GBV)
// Test: 			Althaus (DNB), 28.08.2009, Update
// Korrekturen: 		Johann Rolschewski (ZDB), 19.04.2010,  zdb_Normadatenkopie, zdb_Reziprok
// Korrektur: 		Johann Rolschewski (ZDB), 12.05.2010, Korrektur zdb_Reziprok
// Korrektur:		Carsten Klee (ZDB),
//					29.10.2012	zdb_reziprok in dnb_public_extern.js verschoben (gnd kompatibel)
//					23.06.2011 replace * in pissn/eissn in zdb_EZB
//					04.01.2011 replace * in pissn in __druckausgabe
//					14.12.2010 neue EZB-DDC-Konkordanz Notationen
//					03.11.2010 Korrektur Klammern7120
//					21.10.2010 Korrektur Klammern7120
//					13.10.2010 neu Hilfsfunktion __zdb5080() in Verbindung mit zdb_Digitalisierung (); __zdbTiteldatenKopie()
//					06.10.2010 __druckausgabe( )  geringfügige Änderung
//					27.09.2010 zdb_Digitalisierung() --> Feld 4244 Titel 
//					24.09.2010 Feldauf7120 vereinfacht --> gleiches Verhalten bei 4024
//					10.09.2010 neue Hilfsfunktioen, neue Funktion merkeZDB
//					21.07.2010, zdb_EZB() und __EZBNota() an DDC angepasst,
//					neue Hilfsfunktion __zdbArrayUnique(),
//					alle hebis-Funktionen in zdb umbenannt
//					23.07.2010, __druckausgabe() Internetausg. geändert in Online-Ausg.
//					30.07.2010 zdb_ExemplarErfassen(), try and catch exception
//

var anfangsfenster;
//========================================
// START ****** ZDB-Hilfsfunktionen ******
//========================================

var messageBoxHeader = "Header";

function __zdbGetRecord ( format, extmode ) {

	var scr;
	var satz = null;
	scr = application.activeWindow.getVariable("scr");
	if ( (scr == "") || ("#7A#8A#".indexOf(scr) < 0) ) {
	__zdbError("Dieses Skript muss aus der Volldarstellung oder der "
				+ "Kurztitelliste aufgreufen werden.");
		return null;
	}
	if ( (format != "P") && (format != "D") ) {
		__zdbError("Funktion getRecord mit falschem Format \"" + format
					+ "\"aufgerufen.\n"
					+ "Bitte wenden Sie sich an Ihre Systembetreuer.");
		return null;
	}
	if (scr == "7A") {
		if (!__zdbCheckKurztitelAuswahl())	return null;
	}
	application.activeWindow.command("show " + format, false);
	if (extmode) {
		satz = __zdbGetExpansionFromP3VTX();
	} else {
		satz = application.activeWindow.copyTitle();
		satz = satz.replace(/\r/g,"");
	}
	if (scr == "7A")
		application.activeWindow.simulateIBWKey("FE");
	else if (format == "P")
		application.activeWindow.command("show D",false);
	satz = satz + "\n";
	return satz;
}


function __zdbError(msgText) {
	__zdbMsg(msgText,"e");
	return;
}

function __zdbYesNo(msgtxt) {

	var prompter = utility.newPrompter();
	var button;
	button = prompter.confirmEx(messageBoxHeader,msgtxt,
									"Ja","Nein",null,null,null);
	//prompter = null;
	return !button;
}


function __zdbMsg(msgText,iconChar) {

	var messageBoxHeader;
	var icon;
	switch (iconChar) {
		case "a":	icon = "alert-icon";
					messageBoxHeader = "Achtung!"; // cs 15.07.10
					break;
		case "e":	icon = "error-icon";
					messageBoxHeader = "Fehler!"; // cs 15.07.10
					break;
		case "q":	icon = "question-icon";
					messageBoxHeader = "Frage:"; // cs 15.07.10
					break;
		default: 	icon = "message-icon";
					messageBoxHeader = "Meldung!"; // cs 15.07.10
					break;
	}
		application.messageBox(messageBoxHeader,msgText,icon);
		return;
}


function __zdbCheckKurztitelAuswahl() {

	application.activeWindow.simulateIBWKey("FR");
	if (__zdbYesNo("Sie haben das Skript aus der Kurztitelliste aufgerufen.\n"
				+ "Zur Sicherheit:\n\n"
				+ "Ist dies der gewünschte Datensatz?"))		return true;
	//application.activeWindow.simulateIBWKey("FE");
	return false;
}


function __zdbGetExpansionFromP3VTX() {

	satz = application.activeWindow.getVariable("P3VTX");
	satz = satz.replace("<ISBD><TABLE>","");
	satz = satz.replace("<\/TABLE>","");
	satz = satz.replace(/<BR>/g,"\n");
	satz = satz.replace(/^$/gm,"");
	satz = satz.replace(/^Eingabe:.*$/gm,"");
	satz = satz.replace(/<a[^<]*>/gm,"");
	satz = satz.replace(/<\/a>/gm,"");

	return satz;
}

function __zdbArrayUnique(a) {

	var r = new Array();
	o:for(var i = 0, n = a.length; i < n; i++)
	{
			for(var x = 0, y = r.length; x < y; x++)
			{
				if(r[x]==a[i]) continue o;
			}
			r[r.length] = a[i];
	}
	return r;
}

//--------------------------------------------------------------------------------------------------------
//name:		_zdbGetTag
//replaces:		_zdbGetTag
//calls:		__kategorieInhalt
//description:	simplifies __kategorieInhalt by copy the title an leaving the tag out
//user:	  	all users
//input: 		string tag
//return:		value of the tagline
//author: 		Carsten Klee
//date:		2010-09-10
//version:		1.0.0.0
//--------------------------------------------------------------------------------------------------------

function __zdbGetTag(tag){
	return __kategorieInhalt(application.activeWindow.copyTitle(), tag, false);
}
//--------------------------------------------------------------------------------------------------------
//name:		__zdbClipTag
//replaces:		__zdbClipTag
//calls:		__zdbGetTag
//description:	same as __zdbGetTag but puts the tagline value into the clipboard
//user:	  	all users
//input: 		string tag
//return:		Clipboard contains value of the tagline
//author: 		Carsten Klee
//date:		2010-09-10
//version:		1.0.0.0
//--------------------------------------------------------------------------------------------------------

function __zdbClipTag(tag){
	application.activeWindow.clipboard = __zdbGetTag(tag);
}
//========================================
// Ende ****** ZDB-Hilfsfunktionen ******
//========================================
function zdb_AutomatischeSuchBox(){

	anfangsfenster = application.activeWindow.windowID; // globale Variable, die vom Skript HoleIDN verwendet wird
	open_xul_dialog("chrome://ibw/content/xul/ZDB_AutomatischeSuchBox.xul", null);

}

function zdb_HoleIDN() {
	// Wurde vorab eine Suche mit dem Skript "Automatische Suchbox" ausgeführt?
	if (typeof anfangsfenster == "undefined") {
		application.messageBox("HoleIDN", "Vor Aufruf des Skriptes \"HoleIDN\" muss zunächst eine automatische Suche mit Hilfe des Skriptes \"AutomatischeSuchBox\" gestartet werden.", "alert-icon");
	} else {
		// Ist das aktive Fenster eine Trefferliste?
		var strScreen = application.activeWindow.getVariable("scr");
		if (strScreen != "7A" && strScreen != "8A") {
			application.messageBox("HoleIDN", "Die Funktion muss aus der Trefferliste aufgerufen werden.", "alert-icon");
		} else {
			//  IDN des markierten Titels aus der Trefferliste ermitteln
			var idn = application.activeWindow.getVariable("P3GPP");
			// ID des aktiven Fensters ermitteln
			var fenster = application.activeWindow.windowID;
			// Falls das Bearbeitungsfenster ( = anfangsfenster) geschlossen wurde, gibt das System einen "uncaught exception"-Fehler aus. Um diesen abzufangen, wird mit TRY CATCH gearbeitet.
			try {
				// Zurück zum Anfangsfenster gehen
				application.activateWindow(anfangsfenster);
				// War der Ausgangsbildschirm ein Vollanzeige im Bearbeitungsmodus?
				if (!application.activeWindow.title){
					application.messageBox("HoleIDN", "Das Ausgangsfenster muss eine Vollanzeige im Bearbeitungsmodus sein.", "alert-icon");
				} else {
					// IDN einfügen
					application.activeWindow.title.insertText("!" + idn + "!");
					// Trefferliste schließen
					application.closeWindow(fenster);
				}
			} catch(e) {
				application.messageBox("HoleIDN", "Das Bearbeitungsfenster, in welches die IDN eingefügt werden soll, ist nicht mehr geöffnet.", "alert-icon");
			}
		}
	}

}

function zdb_MerkeIDN() {

	var idn = application.activeWindow.getVariable("P3GPP");
	var idn_formatiert = "!" + idn + "!";
	application.activeWindow.clipboard = idn_formatiert;

}
//--------------------------------------------------------------------------------------------------------
//name:		zdb_merkeZDB
//replaces:		MerkeIDN
//description:	storing a record's ZDB-ID to the clipboard
// calls		__zdbGetRecord; __zdbError; __zdbClipTag
//user:	  	all users
//input: 		none
//return:		Clipboard contains ZDB-ID
//author: 		Carsten Klee
//date:		2010-09-10
//version:		1.0.0.0
//status:		testing
//--------------------------------------------------------------------------------------------------------

function zdb_merkeZDB() {
		var strScreen = application.activeWindow.getVariable("scr");
		if ( strScreen !="8A" ) {
			__zdbError("Script muss aus der Vollanzeige aufgerufen werden");
			return false;
		}
		application.activeWindow.title = __zdbGetRecord("D",false);
		__zdbClipTag("2110");
}



//========================================
// Start ****** ZDB-Titelkopien ******
//========================================
//--------------------------------------------------------------------------------------------------------
//name:		__zdbSwitchCode4244()
//description:	switch between codes f, s and z and return textual representations
//called by:		zdb_Digitalisierung ()
//user:	  	all users
//input: 		none
//return:		textual representations
//author: 		Carsten Klee
//date:		2010-09-28
//version:		1.0.0.0
//status:		stable
//--------------------------------------------------------------------------------------------------------
function __zdbSwitchCode4244(code) {
	var text = "";
	switch(code){
		case "f" : text = "Vorg. ";
		break;
		case "s" : text = "Forts. ";
		break;
		case "z" : text = "Vorg. u. Forts. ";
		break;
	}
	return text;

}
//--------------------------------------------------------------------------------------------------------
//name:		__zdb5080()
//description:	clears field 5080 from zdb notation, leaves only ddc
//called by:		zdb_Digitalisierung (); __zdbTiteldatenKopie()
//user:	  	all users
//input: 		none
//return:		void
//author: 		Carsten Klee
//date:		2010-10-13
//version:		1.0.0.0
//status:		testing
//--------------------------------------------------------------------------------------------------------
function __zdb5080(){
	var cat5080 = application.activeWindow.title.findTag("5080", 0, false, true, false); // inhalt wird markiert
	var arr5080 = cat5080.split("%");
	// nur ddc wird ueber markierung geschrieben
	application.activeWindow.title.insertText(arr5080[0]);
}

function __zdbNormdatenKopie() {

	application.overwriteMode = false;
	var idn = application.activeWindow.getVariable("P3GPP");
	var typ = application.activeWindow.getVariable("P3VMC");
	application.activeWindow.command("show d", false);
	application.activeWindow.copyTitle();
	application.activeWindow.command("ein n", false);
	application.activeWindow.title.insertText(" *** Normdatenkopie *** \n");
	application.activeWindow.pasteTitle();
	application.activeWindow.title.endOfBuffer(false);
	if (typ == "Tb") {
		application.activeWindow.title.insertText("??? ||!" + idn + "!");
	}
	//application.activeWindow.title.startOfBuffer(false);
	application.activeWindow.title.findTag("005", 0, false, true, true);
	application.activeWindow.title.endOfField(false);
}

function __zdbTiteldatenKopie() {
	// Überschrift und IDN einfügen
	application.overwriteMode = false;
	var idn = application.activeWindow.getVariable("P3GPP");
	application.activeWindow.command("show d", false);
	application.activeWindow.copyTitle();
	application.activeWindow.command("ein t", false);
	application.activeWindow.title.insertText(" *** Titeldatenkopie *** \n");
	application.activeWindow.pasteTitle();
	application.activeWindow.title.endOfBuffer(false);
	application.activeWindow.title.insertText("???? !" + idn + "!");
	application.activeWindow.clipboard = idn;

	// Ersetzungen in Kategorie 0600
	var codes0600 = application.activeWindow.title.findTag("0600", 0, false, true, true);
	if (codes0600 != "") {
		deletecodes = new Array("ee", "mg", "nw", "vt", "ra", "rb", "ru", "rg");
		for (var i = 0; i < deletecodes.length; i++) {
			if (codes0600.match(deletecodes[i])) {
				var pos_deletecodes = codes0600.indexOf(deletecodes[i]) + deletecodes[i].length;
				if (codes0600.charAt(pos_deletecodes) == ";") {
					deletecodes[i] = deletecodes[i] + ";";
				}
				codes0600 = codes0600.replace(deletecodes[i],"");
			}
		}
		if (codes0600 != "") application.activeWindow.title.insertText(codes0600);
		else application.activeWindow.title.deleteLine(1);
		}

	//application.activeWindow.title.startOfBuffer(false);
	application.activeWindow.title.findTag("0500", 0, false, true, true);
	application.activeWindow.title.endOfField(false);
	application.activeWindow.title.insertText("xz");
	
	// Kategorie 5080 bereinigen: nur DDC
	__zdb5080();
}

function zdb_Datensatzkopie() {
	if (application.activeWindow.getVariable("scr") != "8A"){
		application.messageBox("Datensatzkopie","Der Datensatz muss sich in der Vollanzeige befinden!", "alert-icon");
		return;
	}
	//Persönliche Einstellung des Titelkopie-Pfades ermitteln
	var titlecopyfileStandard = application.getProfileString("winibw.filelocation", "titlecopy", "");
	// Titelkopie auf zdb_titeldatenkopie.ttl setzen
	application.activeWindow.titleCopyFile = "resource:/ttlcopy/zdb_titeldatenkopie.ttl";

	if (application.activeWindow.materialCode.charAt(0) == "T") {
		__zdbNormdatenKopie();
		} else {
		__zdbTiteldatenKopie();
	}

	//Wiederherstellen des ursprünglichen Pfades der Titelkopie-Datei:
	application.activeWindow.titleCopyFile = titlecopyfileStandard;
}

function zdb_DigiConfig() {

	// Die mittels "zdb_DigiConfig" gespeicherten Inhalte werden automatisch von der Funktion "zdb_Digitalisierung" übernommen
	open_xul_dialog("chrome://ibw/content/xul/ZDB_DigitalisierungConfig.xul", null);

}

function zdb_Digitalisierung () {

	// Prüfen ob Bildschirm = Trefferliste oder Vollanzeige
	var strScreen = application.activeWindow.getVariable("scr");
	if (strScreen != "7A" && strScreen != "8A") {
			application.messageBox("Digitalisierung", "Die Funktion muss aus der Trefferliste oder der Vollanzeige aufgerufen werden.", "alert-icon");
			return;
	}

	// Prüfen, ob Titeldatensatz mit bibliographischer Gattung "A" aufgerufen, bei "T" oder "O" Fehlermeldung ausgeben
	var matCode = application.activeWindow.materialCode.charAt(0);
	if(matCode == "T" || matCode == "O") {
		application.messageBox("Digitalisierung", "Die Funktion kann nur für Titelsätze des Satztyps \"A\" verwendet werden.", "alert-icon");
		return true;
	}
	
	//-- open title
	application.activeWindow.command("k p", false);
	
	//--- vars we need
	var feld4244 = new Array();
	var subfield = "";
	var code = "";
	var x = 0;
	
	//-- analyse and convert field 4244
	while(application.activeWindow.title.findTag("039E", x, false, true, false) !== ""){
			feld4244[x] = application.activeWindow.title.findTag("039E", x, false, true, false);
			code = feld4244[x].match(/\$b./)[0][2];
			//---switch the subfields
			switch(feld4244[x].match(/\$b.\$./)[0][4]){
				case "r" : feld4244[x] = "4244 " + code +"#{" + feld4244[x].match(/\$b.\$r(.*)/)[1] + "}";
				break;
				case "a" : feld4244[x] = "4244 " + code +"#{" + feld4244[x].match(/\$b.\$a(.*)\$9/)[1] + " ---> " + feld4244[x].match(/\$8--[A-Za-z]{4}--(.*)/)[1] + "}";
				break;
				default : feld4244[x] = "4244 " + code +"#{" + __zdbSwitchCode4244(code) + " ---> " + feld4244[x].match(/\$8--[A-Za-z]{4}--(.*)/)[1] + "}";
				break;
			}
			x++;
	}
	//-- close title and go back
	zdb_Back();
	

	// Titelkopie auf zdb_titeldatenkopie_digi.ttl setzen
	var titlecopyfileStandard = application.getProfileString("winibw.filelocation", "titlecopy", "");
	application.activeWindow.titleCopyFile = "resource:/ttlcopy/zdb_titeldatenkopie_digi.ttl";
	application.overwriteMode = false;
	var idn = application.activeWindow.getVariable("P3GPP");
	application.activeWindow.command("show d", false);

	// Gespeicherte individuelle Angaben aus Datei DigiConfig.txt (sofern vorhanden) übernehmen
	var digiConfig = new Array();
	var fileInput = Components.classes["@oclcpica.nl/scriptinputfile;1"]
						.createInstance(Components.interfaces.IInputTextFile);
	if(fileInput.openSpecial("ProfD", "DigiConfig.txt")) {
		var aLine = "";
		while((aLine = fileInput.readLine()) != null) {
			partOfLine = aLine.match(/([0-9]*)\s(.*)/);
			digiConfig[partOfLine[1]] = partOfLine[2];
			if (partOfLine[1] == "1101" && partOfLine[2] == "") {
				digiConfig[partOfLine[1]] = "cr";
			}
		}
	} else {
		digiConfig[1101] = "cr";
		digiConfig[1109] = "";
		digiConfig[2050] = "";
		digiConfig[4048] = "";
		digiConfig[4085] = "";
		digiConfig[4119] = "";
		digiConfig[4233] = "";
		digiConfig[4237] = "";
		digiConfig[4251] = "";
	}

	// Titelaufnahme kopieren und neue Titelaufnahme anlegen
	application.activeWindow.copyTitle();
	application.activeWindow.command("ein t", false);
	application.activeWindow.title.insertText(" *** Titeldatenkopie Digitalisierung *** \n");
	application.activeWindow.pasteTitle();
    //Wiederherstellen des ursprünglichen Pfades der Titelkopie-Datei:
    application.activeWindow.titleCopyFile = titlecopyfileStandard;
	
	// Kategorie 0500: Bibliographische Gattung/Status ändern
	var f0500 = application.activeWindow.title.findTag("0500", 0, false, true, true);
	f0500 = f0500.replace("A","O");
	f0500 = f0500.replace("v","x");
	application.activeWindow.title.insertText(f0500);

	// Kategorie 0600: Ersetzungen und Ergänzungen
	var codes0600 = application.activeWindow.title.findTag("0600", 0, false, true, true);
	if (codes0600 != "") {
		deletecodes = new Array("es", "ks", "sf", "sm", "mg", "mm", "nw", "ra", "rb", "rc", "rg", "ru", "ee", "vt");
		for (var i = 0; i < deletecodes.length; i++) {
			if (codes0600.match(deletecodes[i])) {
				var pos_deletecodes = codes0600.indexOf(deletecodes[i]) + deletecodes[i].length;
				//application.messageBox("", deletecodes[i], "");
				if (codes0600.charAt(pos_deletecodes) == ";") {
					deletecodes[i] = deletecodes[i] + ";";
				}
				codes0600 = codes0600.replace(deletecodes[i],"");
			}
		}
		if (codes0600 != "") {
			if(codes0600.charAt(codes0600.length-1) == ";") {
				application.activeWindow.title.insertText(codes0600);
				application.activeWindow.title.insertText("ld;dm");
			} else {
				application.activeWindow.title.insertText(codes0600);
				application.activeWindow.title.insertText(";ld;dm");
			}
		} else {
			application.activeWindow.title.insertText("ld;dm");
		}
	} else {
		application.activeWindow.title.insertText("\n0600 ld;dm");
	}

	// Kategorie 1101: individuell gefüllt oder leer ausgeben
	application.activeWindow.title.endOfBuffer(false);
	application.activeWindow.title.insertText("1101 " + digiConfig[1101] + "\n");

	// Kategorie 1109: individuell gefüllt oder leer ausgeben
	application.activeWindow.title.endOfBuffer(false);
	application.activeWindow.title.insertText("1109 " + digiConfig[1109] + "\n");

	// Kategorie 2050: individuell gefüllt oder leer ausgeben
	application.activeWindow.title.endOfBuffer(false);
	application.activeWindow.title.insertText("2050 " + digiConfig[2050] + "\n");

	// Kategorie 4048: individuell gefüllt oder leer ausgeben
	application.activeWindow.title.endOfBuffer(false);
	application.activeWindow.title.insertText("4048 " + digiConfig[4048] + "\n");

	// Kategorie 4085: individuell gefüllt oder leer ausgeben
	application.activeWindow.title.endOfBuffer(false);
	application.activeWindow.title.insertText("4085 =u " + digiConfig[4085] + "\n");

	// Kategorie 4119: individuell gefüllt oder leer ausgeben
	application.activeWindow.title.endOfBuffer(false);
	application.activeWindow.title.insertText("4119 " + digiConfig[4119] + "\n");

	// Kategorie 4233: individuell gefüllt oder leer ausgeben
	application.activeWindow.title.endOfBuffer(false);
	application.activeWindow.title.insertText("4233 " + digiConfig[4233] + "\n");

	// Kategorie 4237: individuell gefüllt oder leer ausgeben
	application.activeWindow.title.endOfBuffer(false);
	application.activeWindow.title.insertText("4237 " + digiConfig[4237] + "\n");

	// Kategorie 4251: individuell gefüllt oder leer ausgeben
	application.activeWindow.title.endOfBuffer(false);
	application.activeWindow.title.insertText("4251 " + digiConfig[4251] + "\n");

	// Kategorie 2010: Inhalt in 2013 ausgeben und löschen
	var f2010 = application.activeWindow.title.findTag("2010", 0, false, true, true);
	if (f2010 != "") {
		application.activeWindow.title.deleteLine(1);
		application.activeWindow.title.insertText("2013 |p|" + f2010 + "\n");
	}

	// Kategorie 4000: falls 4005 nicht vorhanden, Text "[[Elektronische Ressource]]" anfügen
	if (application.activeWindow.title.findTag("4005", 0, false, true, true) == "") {
		var f4000 = application.activeWindow.title.findTag("4000", 0, true, true, false);
		if (f4000.indexOf(" // ") !== -1) {
			application.activeWindow.title.endOfField(false);
		} else if (f4000.indexOf(" : ") !== -1) {
			application.activeWindow.title.startOfField(false);
			application.activeWindow.title.charRight(f4000.indexOf(" : "), false);
		} else if (f4000.indexOf(" = ") !== -1) {
			application.activeWindow.title.startOfField(false);
			application.activeWindow.title.charRight(f4000.indexOf(" = "), false);
		} else if (f4000.indexOf(" / ") !== -1) {
			application.activeWindow.title.startOfField(false);
			application.activeWindow.title.charRight(f4000.indexOf(" / "), false);
		} else {
			application.activeWindow.title.findTag("4000", 0, true, true, false)
			application.activeWindow.title.endOfField(false);
		}
		application.activeWindow.title.insertText(" [[Elektronische Ressource]]");

	// Kategorie 4005: falls vorhanden, Text "[[Elektronische Ressource]]" anfügen
	} else {
		var f4005 = application.activeWindow.title.findTag("4005", 0, true, true, false);
		if (f4005.indexOf(" // ") !== -1) {
			application.activeWindow.title.endOfField(false);
		} else if (f4005.indexOf(" : ") !== -1) {
			application.activeWindow.title.startOfField(false);
			application.activeWindow.title.charRight(f4005.indexOf(" : "), false);
		} else if (f4005.indexOf(" = ") !== -1) {
			application.activeWindow.title.startOfField(false);
			application.activeWindow.title.charRight(f4005.indexOf(" = "), false);
		} else if (f4005.indexOf(" / ") !== -1) {
			application.activeWindow.title.startOfField(false);
			application.activeWindow.title.charRight(f4005.indexOf(" / "), false);
		} else {
			application.activeWindow.title.findTag("4005", 0, true, true, false)
			application.activeWindow.title.endOfField(false);
		}
		application.activeWindow.title.insertText(" [[Elektronische Ressource]]");
	}

	// Kategorie 4060: falls Feld vorhanden, wird Inhalt mit Text "Online-Ressource" überschrieben
	//			   falls Feld nicht vorhanden, wird es angelegt und mit Text "Online-Ressource" befüllt
	if (application.activeWindow.title.findTag("4060", 0, false, true, true) != "") {
		application.activeWindow.title.insertText("Online-Ressource");
	} else {
		application.activeWindow.title.endOfBuffer(false);
		application.activeWindow.title.insertText("4060 Online-Ressource");
	}

	// Kategorie 4234: anlegen und mit Text "4243 Druckausg.![...IDN...]!" befüllen
	application.activeWindow.title.endOfBuffer(false);
	application.activeWindow.title.insertText("\n4243 Druckausg.!" + idn + "!");
	
	// Kategorie 4244: löschen und neu ausgeben
	while(application.activeWindow.title.findTag("4244", 0, false, true, true) !== ""){
		application.activeWindow.title.deleteLine(1);
	}
	for(var num in feld4244){
		application.activeWindow.title.insertText(feld4244[num] + "\n");
	}
	
	// Kategorie 5080 bereinigen: nur DDC
	__zdb5080();
}
//========================================
// Ende ****** ZDB-Titelkopien ******
//========================================


function zdb_ILTISseiten() {

	application.shellExecute ("http://support.ddb.de/iltis/inhalt.htm", 5, "open", "");

}


function zdb_BibliothekDefinieren() {

	open_xul_dialog("chrome://ibw/content/xul/ZDB_BibliothekDefinieren.xul", null);

}


function zdb_KennungWechseln() {

	var wert;
	if ((wert = application.activeWindow.caption) == "") {
		wert = "ZDB-Hauptbestand";
	}
	if (wert.indexOf("ZDB-Hauptbestand") >= 0 || wert.indexOf("ZDB-UEbungsbestand") >= 0) {
		open_xul_dialog("chrome://ibw/content/xul/ZDB_KennungWechseln.xul", null);
	} else {
		application.messageBox("KennungWechseln", "Die Funktion \"KennungWechseln\" kann nur im ZDB-Hauptbestand oder ZDB-Übungsbestand aufgerufen werden", "alert-icon");
		return;
	}

}

function zdb_ExemplarErfassen() {

	var strScreen = application.activeWindow.getVariable("scr");
	if (strScreen == "8A" || strScreen == "7A" || strScreen == "MT") {
		// FileInput-Objekt deklarieren
		var fileInput = Components.classes["@oclcpica.nl/scriptinputfile;1"]
							.createInstance(Components.interfaces.IInputTextFile);
		// Falls die Datei "Eigene_Bibliothek.txt"  exisitiert, wird sie geöffnet und ihr Inhalt ausgelesen
		var eigene_bibliothek;
		if (fileInput.openSpecial("ProfD", "Eigene_Bibliothek.txt")) {
			eigene_bibliothek = fileInput.readLine();
		} else {
			eigene_bibliothek = "";
		}
		application.activeWindow.command("show d", false);
		// Sichert Inhalt des Zwischenspeichers, da dieser sonst durch copyTitle() überschrieben würde

		try{
			var clipboard = application.activeWindow.clipboard;
		} catch(e){
			// do nothing
		}
		// Kopiert Titel
		var kopie = application.activeWindow.copyTitle();
		application.activeWindow.clipboard = clipboard;
		//Schleife von 1 bis 99, da max. 99 Exemplare pro Bibliothek erfasst werden können
		for (var i = 1; i <= 99; i++) {
			var vergleich = 7000 + i;
			if (kopie.indexOf(vergleich) == -1) {
				var eingabe = vergleich + " x\n4800 " + eigene_bibliothek + "\n7100 \n7109 \n8031 \n8032 \n";
				// Definiert, wo Cursor im Titelbildschirm plaziert wird
				var zeile = 1;
				if (eigene_bibliothek) {
					zeile = 2;
				}
				// Exemplarsatz anlegen und befüllen
				application.activeWindow.command("e e" + i, false);
				if (application.activeWindow.status != "ERROR") {
					application.activeWindow.title.startOfBuffer(false);
					application.activeWindow.title.insertText(eingabe);
					application.activeWindow.title.startOfBuffer(false);
					application.activeWindow.title.lineDown(zeile, false);
					application.activeWindow.title.charRight(5, false);
					return;
				} else {
					return;
				}
			}
		}
	} else {
			application.messageBox("ExemplarErfassen", "Die Funktion kann nur aus der Trefferliste oder der Vollanzeige aufgerufen werden.",  "alert-icon");
	}

}

function zdb_TitelErfassen() {

	application.overwriteMode = false;
	application.activeWindow.command("ein t", false);
	if (application.activeWindow.status != "OK") {
		application.messageBox("Titelerfassung", "Sie haben nicht die nötigen Berechtigungen, um einen Titel zu erfassen.", "alert-icon");
		return false;
	}
	application.activeWindow.title.insertText(
				"0500 Abxz\n"
			+ "1100 \n"
			+ "4000 \n"
			+ "4025 \n"
			+ "4030 \n"
			+ "5080 \n");
	application.activeWindow.title.startOfBuffer(false);
	application.activeWindow.title.lineDown(1, false);
	application.activeWindow.title.charRight(5, false);

}


function zdb_MailboxsatzAnlegen() {

	var ppn;

	application.overwriteMode = false;
	ppn = application.activeWindow.getVariable("P3GPP");
	application.activeWindow.command("ein t", false);
	if (application.activeWindow.status != "OK") {
		application.messageBox("MailboxsatzAnlegen", "Sie haben nicht die nötigen Berechtigungen, um einen Mailboxsatz anzulegen.", "alert-icon");
		return false;
	}
	application.activeWindow.title.insertText (
				"0500 am\n"
			+ "8900 !" + ppn + "!\n"
			+ "8901 \n"
			+ "8902 ");
	application.activeWindow.title.startOfBuffer(false);
	application.activeWindow.title.lineDown(2, false);
	application.activeWindow.title.charRight(5, false);

}

function zdb_LinkUrl() {
	// Ermittelt URLs aus den Feldern 4085 =u, 4085 =g, 485 =u, 485  =g, 750 =e, 750 =g
	// Ausgangsbildschirm ermitteln
	var strScreen = application.activeWindow.getVariable("scr");
	if (strScreen == "8A") {
		application.activeWindow.command("show d", false);
		open_xul_dialog("chrome://ibw/content/xul/ZDB_LinkUrl.xul", null);
	} else {
		application.messageBox("LinkURL", "Das Skript muss aus der Vollanzeige aufgerufen werden.", "alert-icon");
		return;
	}

}


function zdb_LokUrl() {
	// Ermittelt URLs aus den Feldern 7135 =u, 7135 =g
	// Ausgangsbildschirm ermitteln
	var strScreen = application.activeWindow.getVariable("scr");
	if (strScreen == "8A") {
		application.activeWindow.command("show d", false);
		open_xul_dialog("chrome://ibw/content/xul/ZDB_LokUrl.xul", null);
	} else {
		application.messageBox("LokURL", "Das Skript muss aus der Vollanzeige aufgerufen werden.", "alert-icon");
		return;
	}

}


// =======================================================================
// START ***** FELD 7120 *****
// =======================================================================
// Das Script muss im Editierbildschirm aufgerufen werden im Feld 8032 oder 7121 oder 4025.
// Das Feld 7120 (oder 4026) wird erzeugt und über dem Feld ausgegeben.
// Unterfunktionen:
// 	Feldauf7120()
// 	Klammern7120()
// 	Vor7120()
// 	Bindestrich7120()
// 	Tilde7120()
// 	Punkt71204024()
// 	Gleich7120()
// 	Komma71204024()
// 	Ziffer7120()
// 	Musterjahr7120()
// =======================================================================


function zdb_Feld7120() {

	// Edit-Bildschirm ? scr= IT, MT, IE, ME
	var strScreen = application.activeWindow.getVariable("scr");
	if (strScreen != "IE" && strScreen != "IT" && strScreen != "ME" && strScreen != "MT") {
		application.messageBox("Feld7120", "Die Funktion muss aus dem Edit-Bildschirm für Titel oder Exemplare aufgerufen werden.", "alert-icon");
	} else {
		// Globale Fehlervariable
		fehlerin7120 = "";
		// Feld markieren, in dem der Cursor steht
		application.activeWindow.title.startOfField(false);
		application.activeWindow.title.endOfField(true);
		var feld8032 = application.activeWindow.title.selection;
		// Feldnummer ermitteln
		var feldnummer = feld8032.substring(0, 4);
		// In Abhängigkeit der Feldnummer, wird festgelegt, welches Feld zu erzeugen ist (7120 oder 4025)
		if (feldnummer == "8032" || feldnummer == "7121") {
			feldnummer = "7120";
		} else if (feldnummer == "4025") {
			feldnummer = "4024";
		} else {
		// Skriptabbruch, falls Aufruf aus falschem Feld erfolgt
			application.messageBox("Feld7120", "Die Funktion darf nicht für das Feld " + feldnummer + " aufgerufen werden.", "alert-icon");
			return;
		}
		// Feldinhalt ermitteln
		var inhalt8032 = feld8032.substring(5, feld8032.length);
		var inhalt7120 = Feldauf7120(inhalt8032, feldnummer);
		if (fehlerin7120 != "") {
			application.messageBox("Feld7120", fehlerin7120, "alert-icon");
		}
		// Feld ausgeben
		application.activeWindow.title.startOfField(false);
		application.activeWindow.title.insertText("\n");
		application.activeWindow.title.lineUp(1, false);
		application.activeWindow.title.insertText(feldnummer + " " + inhalt7120);
	}

}


function Feldauf7120(inhalt8032, feldnummer) {

	// '==================================================
	// ' Auswertung von Heftnummern für Feld 4024
	// '   Komma7120 --> Komma71204024
	// '   Punkt7120 --> Punkt71204024
	// '==================================================

	pos = new Array();
	feld = new Array();
	var temp_felder = new Array();
	var temp_felder2 = new Array();
	var temp_felder3 = new Array();
	var teil1;
	var teil2;
	var band1;
	var jahr1;
	var band2;
	var jahr2;
	var hilfsfeld = inhalt8032;
	var inhalt7120 = "";

	// Klammern und Rautezeichen (#) entfernen
	hilfsfeld = Klammern7120(hilfsfeld);

	// Vortexte löschen
	hilfsfeld = Vor7120(hilfsfeld);

	// Ziffer, Punkt, Ziffer bzw. Ziffer Punkt Leerzeichen Ziffer wird ersetzt durch Ziffer*Ziffer 
	hilfsfeld = hilfsfeld.replace(/([0-9])\.\s{0,1}([0-9])/g, "$1*$2");
	// bzw. Ziffer Punkt Leerzeichen (Fall: Band.[?] -> Band. -> Band*) // cs 02.11.2010
	//hilfsfeld = hilfsfeld.replace(/([0-9])\.\s{0,1}([0-9]){0,1}/g, "$1*$2");
	// Bindestrich mit Leerzeichen durch ~ ersetzen
	hilfsfeld = Bindestrich7120(hilfsfeld);

	// Leerzeichen und Texte entfernen
	hilfsfeld = hilfsfeld.replace(/\s/g, "");
	hilfsfeld = hilfsfeld.replace(/SS/g, "");
	hilfsfeld = hilfsfeld.replace(/WS/g, "");
	hilfsfeld = hilfsfeld.replace(/Nr\./g, "");
	hilfsfeld = hilfsfeld.replace(/u\./g, ",");
	hilfsfeld = hilfsfeld.replace(/nachgewiesen/gi, "");
	hilfsfeld = hilfsfeld.replace(/\.Danachabbestellt/gi, "");

	// Ermitteln, ob und an welchen Stellen Semikola vorkommen
	var j = 0;
	var posi = 2;
	pos[0] = 0;
	while (posi > -1) {
		posi = hilfsfeld.indexOf(";", posi);
		if (posi > -1) {
			j++;
			posi++
			pos[j] = posi;
		}
	}
	j++;
	pos[j] = hilfsfeld.length + 2;

	for (var i = 0; i < j; i++) {
		feld[i] = hilfsfeld.substring(pos[i], pos[i+1] - 1);
		temp_felder = Tilde7120(feld[i], "", "");
		teil1 = temp_felder[0];
		teil2 = temp_felder[1];
		band1 = "";
		jahr1 = "";
		heft1 = "";
		band2 = "";
		jahr2 = "";
		heft2 = "";
		temp_felder2 = Punkt71204024(teil1, band1, jahr1, heft1);
		band1 = temp_felder2[0];
		jahr1 = temp_felder2[1];
		heft1 = temp_felder2[2];
		if (teil2 != "-") {
			temp_felder3 = Punkt71204024(teil2, band2, jahr2, heft2);
			band2 = temp_felder3[0];
			jahr2 = temp_felder3[1];
			heft2 = temp_felder3[2];
		}
		if (inhalt7120 != "" && (band1 || jahr1 || band2 || jahr2 != "")) {
			inhalt7120 = inhalt7120 + "; ";
		}

		//if (feldnummer == "7120") {
		// Feld 7120 aufbauen
			if (band1 != "") {
				inhalt7120 = inhalt7120 + "\/v" + band1;
			}
			if (jahr1 != "") {
				inhalt7120 = inhalt7120 + "\/b" + jahr1;
			}
			if (band2 != "") {
				inhalt7120 = inhalt7120 + "\/V" + band2;
			}
			if (jahr2 != "") {
				inhalt7120 = inhalt7120 + "\/E" + jahr2;
			}
		//} else {
		// Feld 4024 aufbauen
		/*	if (heft1 != "") {
				inhalt7120 = inhalt7120 + "\/a" + heft1;
			}
			if (jahr1 != "") {
				inhalt7120 = inhalt7120 + "\/b" + jahr1;
			}
			else if (band1 != "") {
				inhalt7120 = inhalt7120 + "\/v" + band1;
			}

			if (heft2 != "") {
				inhalt7120 = inhalt7120 + "\/A" + heft2;
			}
			if (jahr2 != "") {
				inhalt7120 = inhalt7120 + "\/E" + jahr2;
			}
			else if (band2 != "") {
				inhalt7120 = inhalt7120 + "\/V" + band2;
			}
		}
		*/
		if (teil2 == "-") {
			inhalt7120 = inhalt7120 + "-";
		}
	}
	return inhalt7120;

	//inhalt7120 = hilfsfeld
	//return inhalt7120;

}


function Klammern7120(feld) {

	var klammern7120 = feld;

	// Runde Klammern und Inhalt weglassen
	klammern7120 = klammern7120.replace(/\([^)]*\)/gi, "");
	// Geschweifte Klammern und Inhalt weglassen
	klammern7120 = klammern7120.replace(/\{[^}]*\}/gi, "");
	// Nummernzeichen und Inhalt weglassen
	klammern7120 = klammern7120.replace(/#[^#]*#/gi, "");

	// Muster = 4 Ziffern oder 4 Ziffern, Schrägstrich, 2 Ziffern
	// Eckige Klammern mit Inhalt Fragezeichen weglassen
	klammern7120 = klammern7120.replace(/(\[\?\])/gi, "");
	// Eckige Klammern mit Inhalt: Muster, Semikolon weglassen
	//klammern7120 = klammern7120.replace(/\[\d{4}];|\[\d{4}\/\d\d];/gi, ";");
	// Eckige Klammern mit Inhalt: Muster, Bindestrich, Blank weglassen
	klammern7120 = klammern7120.replace(/\[\d{4}]- |\[\d{4}\/\d\d]- /, " -");
	// Eckige Klammern mit Inhalt: Muster am Feldende weglassen
	//klammern7120 = klammern7120.replace(/\[\d{4}]$|\[\d{4}\/\d\d]$/, "");

	// Eckige Klammern entfernen
	klammern7120 = klammern7120.replace(/\[/gi, "");
	klammern7120 = klammern7120.replace(/\]/gi, "");

	return klammern7120;
}


function Vor7120(feld) {

	// Vom Anfang her alles vor 1. Ziffer löschen

	var vor7120 = feld;
	var len = vor7120.length;
	// Erstes Zeichen ermitteln
	var first = vor7120.substring(0,1);
	// Wenn erstes Zeichen keine Zahl und auch kein Leerzeichen ist, wird es gelöscht
	while (isNaN(first) || first == " ") {
		vor7120 = vor7120.substring(1,len);
		first = vor7120.substring(0,1);
	}
	return vor7120;

}


function Bindestrich7120(feld) {

	// Bindestrich mit Leerzeichen durch ~ ersetzen

	var hilfsfeld = feld;
	var kommada = false;
	var bindestrich7120 = "";
	var len = hilfsfeld.length;
	// "ff." am Ende durch "-" ersetzen, sofern Inhalt länger als 3 Zeichen lang
	if (len > 3 && hilfsfeld.substring(len - 3, len) == "ff.") {
		hilfsfeld = hilfsfeld.substring(0, len - 3) + "-";
		len = hilfsfeld.length;
	}
	// Bindestrich ohne Komma davor durch "~" ersetzen
	for (var i = 0; i <= len; i++) {
		var zeichen = hilfsfeld.substring(i, i + 1);
		if (zeichen == ";") {
			kommada = false;
		}
		if (zeichen == ",") {
			kommada = true;
		}
		if (zeichen == "-" && kommada == false) {
			bindestrich7120 = bindestrich7120 + "~";
		} else {
			bindestrich7120 = bindestrich7120 + zeichen;
		}
	}
	// Bindestrich mit Leerzeichen durch "~" ersetzen
	bindestrich7120 = bindestrich7120.replace(/\s-\s/g, "~");
	bindestrich7120 = bindestrich7120.replace(/\s-/g, "~");
	bindestrich7120 = bindestrich7120.replace(/-\s/g, "~");
	len = bindestrich7120.length;
	if (bindestrich7120.substring(len - 1, len) == "-") {
		bindestrich7120 = bindestrich7120.substring(0, len - 1) + "~";
	}
	return bindestrich7120;

}


function Tilde7120(feld, teil1, teil2) {

	// Unterfunktion zu Feld7120 -> Feldauf7120
	// Aufgabe: Feld bei Tilde in Teil1 und Teil2 zerlegen

	var posi = feld.indexOf("~");
	if (posi == -1) {
		teil1 = feld;
		teil2 = "";
	} else if (posi == feld.length - 1) {
		teil1 = feld.substring(0, feld.length - 1);
		teil2 = "-";
	} else {
		teil1 = feld.substring(0, posi);
		teil2 = feld.substring(posi + 1, feld.length);
	}
	var felder = new Array(teil1, teil2);
	return felder;

}


function Punkt71204024(feld, band, jahr, heft) {

	// Unterfunktion zu Feld7120 -> Feldauf7120
	// Aufgaben:
	//	- Entfernen von "zu", "F.", "S.", "Ser.", "Trim." mit jeweils zugehörigem Vortext
	//	- Teilen und speichern von Band und Jahr in einzelnen variablen

	var len = feld.length;
	if (feld == "") {
		band = "";
		jahr = "";
	} else {
		var posi = feld.indexOf("zu");
		if (posi > -1 && posi < len) {
			feld = feld.substring(posi + 2, len);
		}
		posi = feld.indexOf("F.");
		if (posi > -1 && posi < len) {
			feld = feld.substring(posi + 2, len);
		}
		posi = feld.indexOf("S.");
		if (posi > -1 && posi < len) {
			feld = feld.substring(posi + 2, len);
		}
		posi = feld.indexOf("Ser.");
		if (posi > -1 && posi < len) {
			feld = feld.substring(posi + 4, len);
		}
		posi = feld.indexOf("Trim.");
		if (posi > -1 && posi < len) {
			feld = feld.substring(posi + 5, len);
		}
		// Trennen von Band und Jahr -> Speichern in zwei getrennten Variablen
		posi = feld.indexOf("*");

		if (posi == -1) {
			jahr = feld;
		} else if (posi == len) {
			band = feld;
		} else {
			band = feld.substring(0, posi);
			jahr = feld.substring(posi + 1, len);
		}

		if (band != "") {
			band = Gleich7120(band);
		}
		if (band != "") {
			var temp = Komma71204024(band, heft);
			band = temp[0];
			heft = temp[1];
		}
		if (band != "") {
			band = Ziffer7120(band);
		}
		if (jahr != "") {
			jahr = Gleich7120(jahr);
		}
		if (jahr != "") {
			var temp = Komma71204024(jahr, heft);
			jahr = temp[0];
			heft = temp[1];
		}
		if (jahr != "") {
			jahr = Ziffer7120(jahr);
		}
		if (heft != "") {
			heft = Ziffer7120(heft);
		}
		if (band == "" && (isNaN(jahr.substring(0,4)) || jahr.length < 4)) {
			band = jahr;
			jahr = "";
		}
		// Prüfungen an den Zahlen
		if (jahr != "") {
			jahr = Musterjahr7120(jahr);
		}
	}
	var felder = new Array(band, jahr, heft);

	return felder;

}


function Gleich7120(feld) {

	// Unterfunktion zu Feld7120 -> Feldauf7120 -> Punkt7120
	// Aufgaben: Alles hinter Gleichheitszeichen bis Zeilenende entfernen

	var posi = feld.indexOf("=");
	if (posi > -1 ) {
		feld = feld.substring(0, posi);
	}
	return feld;

}


function Komma71204024(feld, heft) {

	// Unterfunktion zu Feld7120 -> Feldauf7120 -> Punkt7120
	// Aufgaben: Feld bei Komma abschneiden
	var posi = feld.indexOf(",");
	if (posi > -1 ) {
		heft = feld.substring(posi + 1, feld.length);
		feld = feld.substring(0, posi);
	}
	var return_vars = new Array(feld, heft);
	return return_vars;

}


function Ziffer7120(feld) {

	// Unterfunktion zu Feld7120 -> Feldauf7120 -> Punkt7120
	// Aufgaben: Falsche Zeichen (~ *) entfernen

	var falschezeichen = "";
	var zeich = "";
	var ziffern7120 = "";
	for (i = 0; i < feld.length; i++) {
		zeich = feld.substring(i, i + 1);
		if (zeich == "~") {
			zeich = "-";
		}
		if (zeich == "*") {
			zeich = ".";
		}
		if (isNaN(zeich)) {
			if (zeich == "/" && i > 0) {
				ziffern7120 = ziffern7120 + zeich;
			} else {
				falschezeichen = falschezeichen + zeich;
				ziffern7120 = ""
			}
		} else {
			ziffern7120 = ziffern7120 + zeich;
		}
	}
	if (falschezeichen != "") {
		fehlerin7120 = fehlerin7120 + "Ungültige Zeichen werden weggelassen: " + falschezeichen + "\n";
	}
	return ziffern7120;

}


function Musterjahr7120(feld) {

	// Unterfunktion zu Feld7120 -> Feldauf7120 -> Punkt7120
	// Aufgaben: verschiedene Zahlenprüfungen

	var musterjahr = feld;
	// RegEx-Muster = zzzz/zzzz oder zzzz/zz oder zzzz/z oder zzzz
	var suche = /\d{4}\/\d{4}|\d{4}\/\d{2}|\d{4}\/\d{1}|\d{4}/;
	var ergebnis = suche.exec(musterjahr);
	if (ergebnis == null || (feld.length == 8 || feld.length > 9)) {
		fehlerin7120 = fehlerin7120 + "Falsche Jahreszahl wird weggelassen: " + musterjahr + "\n";
		musterjahr = "";
	}
	return musterjahr;
}

// =======================================================================
// ENDE ***** FELD 7120 *****
// =======================================================================


// =======================================================================
// START ***** EZB *****
// =======================================================================
function __druckausgabe( dppn ) {

	var arr = new Array();
	var eppn = application.activeWindow.getVariable("P3GPP");
	var regexp;
	var satz;

	application.activeWindow.command("f idn " + dppn, true);

	if (application.activeWindow.status != "OK") {
		__zdbError("Die über 4243 verlinkte Druckausgabe existiert nicht.");
		return null;
	}

//	DocType = 1. Zeichen im Feld 0500
	if (application.activeWindow.materialCode.charAt(0) != "A") {
		__zdbMsg("Record der 'Druckausgabe' hat Materialcode "
					+ application.activeWindow.materialCode);
		return "";
	}

	satz = __zdbGetRecord("D",false);
	if (satz == null)			return null;

	regexp = new RegExp("!" + eppn + "!","gm");
	arr = satz.match(regexp);
	if (arr == null) {
		application.activeWindow.command("k",false);
		if (application.activeWindow.status != "OK") {
			__zdbMSG("Sie sind nicht berechtigt, den Datensatz zu ändern.");
			return "";
		}
		application.activeWindow.title.endOfBuffer(false);
		application.activeWindow.title.insertText("4243 Online-Ausg.!" + eppn + "!\n"); // cs 23.07.2010
		//application.messageBox("EPPN", eppn, "alert-icon");
			application.activeWindow.simulateIBWKey("FR");
		//	Korrektur ausgeführt, dann ist der Titel im diagn. Format
		//	sonst im Korrekturformat
		//application.messageBox("SCR", application.activeWindow.getVariable("scr"), "alert-icon");
		if (application.activeWindow.getVariable("scr") != "8A") {
			__zdbMsg("Die Korrektur des Titel ist fehlgeschlagen. Bitte holen"
					+ "Sie dies direkt über die WinIBW nach.");
			return "";
		}
	} else {
		application.messageBox("Test","Die Verknüpfung zur Internetausgabe im Feld 4243 ist schon vorhanden.", "alert-icon");
	}

//---Feld "2010" , zurückgeben
	arr = satz.match(/^2010 .*/gm);
	if (arr == null)			return "";

	arr[0] = arr[0].replace(/^2010 (.*)/,"$1");
	return arr[0].replace(/\*/,"");

}


function __EZBNota(maske) {

	var DDC_EZB = {
		"000":["AK-AL","SQ-SU"],
		"004":["SQ-SU"],
		"010":["A"],
		"020":["AN"],
		"030":[""],
		"050":["A"],
		"060":["AK-AL"],
		"070":["AP"],
		"080":[""],
		"090":[""],
		"100":["CA-CI"],
		"130":["A"],
		"150":["CL-CZ"],
		"200":["B"],
		"220":["B"],
		"230":["B"],
		"290":["B"],
		"300":["Q","MN-MS"],
		"310":["Q"],
		"320":["MA-MM"],
		"330":["Q"],
		"333.7":["ZP"],
		"340":["P"],
		"350":["P"],
		"355":["MA-MM"],
		"360":["MN-MS","Q","A"],
		"370":["AK-AL","D"],
		"380":["Q","ZG"],
		"390":["LA-LC"],
		"400":["E"],
		"420":["H"],
		"430":["G"],
		"439":["G"],
		"440":["I"],
		"450":["I"],
		"460":["I"],
		"470":["F"],
		"480":["F"],
		"490":["E"],
		"491.8":["K"],
		"500":["TA-TD"],
		"510":["SA-SP"],
		"520":["U"],
		"530":["U"],
		"540":["V"],
		"550":["TE-TZ"],
		"560":["TE-TZ"],
		"570":["W"],
		"580":["W"],
		"590":["W"],
		"600":["ZG"],
		"610":["V","WW-YZ"],
		"620":["ZL","ZN","ZP"],
		"621.3":["ZN"],
		"624":["ZG","ZP"],
		"630":["ZA-ZE","WW-YZ"],
		"640":["ZA-ZE"],
		"650":["Q"],
		"660":["V","ZL"],
		"670":["ZL"],
		"690":["ZH-ZI"],
		"700":["LH-LO"],
		"710":["ZH-ZI"],
		"720":["ZH-ZI"],
		"730":["N"],
		"740":["LH-LO"],
		"741.5":["A"],
		"750":["LH-LO"],
		"760":["LH-LO"],
		"770":["LH-LO"],
		"780":["LP-LZ"],
		"790":["A"],
		"791":["LH-LO"],
		"792":["A"],
		"793":["ZX-ZY"],
		"796":["ZX-ZY"],
		"800":["E"],
		"810":["H"],
		"820":["H"],
		"830":["G"],
		"839":["G"],
		"840":["I"],
		"850":["I"],
		"860":["I"],
		"870":["F"],
		"880":["F"],
		"890":["K","E"],
		"891.8":["K"],
		"900":["N"],
		"910":["N","R"],
		"914.3":["N"],
		"920":["A","N"],
		"930":["LD-LG"],
		"940":["N"],
		"943":["N"],
		"950":["N"],
		"960":["N"],
		"970":["N"],
		"980":["N"],
		"990":["N"],
		"B":[""],
		"K":["A"],
		"S":[""]
	};
	if (maske == "")		return ""; // brauchen wir das noch?

	return DDC_EZB[maske];

}


//
// ZDB-Funktionen > EZB
//
//=============
function zdb_EZB() {

	var arr = new Array();
	var _ddcnota = new Array();
	var _ezbnota = new Array();
	var _ezb = new Array();
	var satz;
	var title, publisher, eissn, pissn, zdb_id, url;
	var volume1;
	var kat5080;
	var idx, jdx;
	var winsnap;
	var EZB_satz;


//	url zur EZB
	var dbformUrl="http://www.bibliothek.uni-regensburg.de/internal/ezeit/dbform.phtml?";
	var frontDoor = "http://www.bibliothek.uni-regensburg.de/ezeit/?";

//	Dokumenttyp  8A: Vollanzeige, 7A: Kurzliste, MT: Fehler
	var strScreen = application.activeWindow.getVariable("scr");
	if ( (strScreen !="7A") && (strScreen !="8A") ) {
		__zdbError("Script muss aus der Vollanzeige/Kurzliste aufgerufen werden"); // cs 15.07.10
		return false;
	}

	satz = __zdbGetRecord("D",false);

//---Feld "2110" , Inhalt nach zdb_id
	arr = satz.match(/^2110 .*/gm);
	if (arr == null) {
		__zdbError("Die ZDB-ID (2110) fehlt");
		return false;
	}
	zdb_id = arr[0].substr(5);

//---Feld "4000" , Inhalt nach title
	arr = satz.match(/^4000 .*/gm);
	if (arr == null) {
		__zdbError("Der Titel (4000) fehlt");
		return false;
	}

	title = arr[0].substr(5);
	idx = title.indexOf(" : ");
	if (idx >= 0)	title = title.substr(0,idx);
	idx = title.indexOf(" = ");
	if (idx >= 0)	title = title.substr(0,idx);
	title = title.replace("[[Elektronische Ressource]]","");
	title = title.replace("//","/");
	idx = title.indexOf(" @");
	if (idx == 0)	title = title.substr(2);
	else if (idx > 0) {
		title = title.substr(idx+2) + ", " + title.substr(0,idx);
	}

	//---Feld "4005" , Inhalt an title anhängen
	arr = satz.match(/^4005 .*/gm);
	if (arr != null) {
		arr[0] = arr[0].substr(5);
		arr[0] = arr[0].replace("{",". ");
		arr[0] = arr[0].replace("}","");
		title = title + arr[0];
	}

	title = title.replace("%","%25");
	title = title.replace("&","%26");
	//title = encodeURI(title);
//---Feld "4030" , Inhalt nach publisher
	arr = satz.match(/^4030 .*/gm);
	if (arr == null) {
		__zdbError("Verlagsort(e) und Verleger (4030) fehlen.");
		return false;
	}
	publisher = arr[0].substr(5);
	publisher = publisher.replace("%","%25");
	publisher = publisher.replace("&","%26");

//---Feld "2010" , Inhalt nach eissn
	eissn = "";
	arr = satz.match(/^2010 .*/gm);
	if (arr != null)
	{
		eissn = arr[0].substr(5);
		eissn = eissn.replace('*','');
	}
	idx = eissn.indexOf(" ");
	if (idx >= 0)
	{
		eissn = eissn.substr(idx);
		eissn = eissn.replace('*','');
	}
//---URL-Feld "4085" , Inhalt nach url, mehrere aneinander
	url = "";
	arr = satz.match(/^4085 .*=u .*/gm);
	if (arr != null) {
		for (idx=0; idx<arr.length; idx++) {
			jdx = arr[idx].indexOf("=u ");
			if (jdx < 0)					continue;
			arr[idx] = arr[idx].substr(jdx+3);
			jdx = arr[idx].indexOf("=x ");
			if (jdx >= 0)	arr[idx] = arr[idx].substr(0,jdx);
			if (arr[idx].substr(0,frontDoor.length) == frontDoor)		continue;
			url += "\n" + arr[idx];
		}
	}

	if (url == "") {
		__zdbError("Die URL (4085) fehlt.");
		return false;
	}
	url = url.substr(1);
	url = url.replace("%","%25");
	url = url.replace("&","%26");

//---Feld "4025" , Inhalt nach volume1
	volume1 = "";
	arr = satz.match(/^4025 .*/gm);
	if (arr != null) {
		volume1 = arr[0].substr(5);
		volume1 = volume1.replace("%","%25");
		volume1 = volume1.replace("&","%26");
	}

//---Feld "5080" , Inhalt nach notation
// geändert cs 2010-07-21

	// inhalt von 5080 ohne zdb-notation
	kat5080 = satz.match(/^5080 [\w ;]*/gm);
	// nur ddc notation
	_ddcnota = kat5080[0].substr(5).split(';');

	if (_ddcnota != null) {
		for(var i in _ddcnota){
			// ruft ddc-ezb konkordanz
			_ezb = __EZBNota(_ddcnota[i]);
			for(var x in _ezb) {
				_ezbnota.push(_ezb[x]);
			}
		}
	//--- nur unique ezb-notationen
	_ezbnota = __zdbArrayUnique(_ezbnota);
	}

//---Druckausgabe: reziproke Verknüpfung und Druck-ISSN
	arr = satz.match(/^4243 Druckausg.[:]*!.*/gm);
	if (arr != null) {
		winsnap = application.windows.getWindowSnapshot();
		arr[0] = arr[0].replace(/^4243 Druckausg.[:]*!([^!]*)!/,"$1");
		pissn = __druckausgabe(arr[0]);
		application.windows.restoreWindowSnapshot(winsnap);
	}

	if (pissn == "" ) {
		if (!__zdbYesNo("Eine reziproke Verknüpfung ist nicht möglich. Möchten Sie trotzdem fortfahren?")) {
			return false;
		}
	} else {
		pissn = (!pissn) ? '' : pissn.replace('*','');
	}


	EZB_satz =
		"title="     + escape(title)   + "&publisher="  + escape(publisher)
	+ "&eissn="      + eissn   + "&pissn="      + pissn
	+ "&zdb_id="     + zdb_id  + "&url="        + escape(url)
	+ "&volume1="    + escape(volume1);
	if(_ezbnota != null){
		for(var i in _ezbnota){
			EZB_satz += "&notation[]=" + _ezbnota[i];
		}
	}
	EZB_satz +=	"&charset=utf8";
	EZB_satz = EZB_satz.replace(/ /g,"%20");
	application.shellExecute(dbformUrl+EZB_satz,5,"open","");
//	4 bedeutet ja und nein; 6=ja 7=nein
	if (__zdbYesNo (
				"Falls nicht automatisch Ihr Browser mit der EZB-Darstellung\n"
			+ "in den Vordergrund kommt, wechseln Sie bitte in den Browser\n"
			+ "und kontrollieren die Übereinstimmung Ihrer Aufnahme mit dem\n"
			+ "im Browser gezeigten Titel.\n\n"
			+ "Ist die EZB-Aufnahme korrekt und soll die Frontdoor-url\n"
			+ "eingetragen werden?") ) {
	//	Press the "Korrigieren" button
		application.activeWindow.command("k d", false);
		if (application.activeWindow.status != "OK") {
			__zdbMsg("Sie sind nicht berechtigt, den Datensatz zu ändern.");
			return false;
		}
	//	Go to end of buffer without expanding the selection
		application.activeWindow.title.endOfBuffer(false);
	//	EZB-Frontdoor einfügen
		application.activeWindow.title.insertText("4085 =u " + frontDoor);
		application.activeWindow.title.insertText(zdb_id.substr(0,zdb_id.length-2));
		application.activeWindow.title.insertText("=x F");
	//	Press the <ENTER> key
		application.activeWindow.simulateIBWKey("FR");

	//	Dokumenttyp  8A: korrekt, MT: Fehler
		if (application.activeWindow.getVariable("scr") != "8A") {
			__zdbMsg("Die Korrektur des Titel ist fehlgeschlagen. Bitte holen"
					+ "Sie dies direkt über die WInIBW nach.");
			return "";
		}

	}

}

// =======================================================================
// ENDE ***** EZB *****
// =======================================================================

function zdb_Back(){

	// Workaround für Button Zurück ( gedrehter Pfeil nach links)
	application.activeWindow.simulateIBWKey("FE");

}

function zdb_WinIBWHandbuch(){

	// Zukünftig für DNB: https://wiki.d-nb.de/x/mYAV, wird per Update geaendert.
	application.shellExecute ("http://www.gbv.de/wikis/cls/WinIBW3:Handbuch", 5, "open", "");

}