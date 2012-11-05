/*	Datei:	gbv_public.js
	Autor:	Karen Hachmann, GBV
	Datum:	2006
*/
function __screenID(){
	return application.activeWindow.getVariable("scr");
}

function __matCode(){
	return application.activeWindow.materialCode;
}

function __matCode1(){
	//0500, 005 1. Position
	return application.activeWindow.materialCode.charAt(0);
}
function __matCode2(){
	//0500, 005 2. Position
	return application.activeWindow.materialCode.charAt(1);
}
function __matCode3(){
	//0500, 005 3. Position
	return application.activeWindow.materialCode.charAt(2);
}
function __Materialbenennung()
{
	// Funktion wird von Aaup() und Avu() verwendet, um den Materialcode für 1108 zu ermitteln
	// außerdem beim Anlegen von Aufsätzen
	switch (__matCode1())
	{
		case "B":
			Materialart = "\n1108 Bildtonträger";
			break;
		case "E":
			Materialart = "\n1108 Mikroform";
			break;
		case "G":
			Materialart = "\n1108 Tonträger";
			break;
		case "M":
			Materialart = "\n1108 Musikdruck";
			break;
		case "O":
			Materialart = "\n1108 Elektronische Ressource";
			break;
		case "S":
			Materialart = "\n1108 Elektronische Ressource";
			break;
		case "Z":
			Materialart = "\n1108 "; //hier kann man nicht wissen, welches Material vorliegt
			break;
		default:
			Materialart = "";
	}
	//if (Materialart != "") Materialart = "\n" + Materialart;
	return Materialart;
}

function __docType(){
	//funktioniert nur im title-edit-control!
	//Bei Neuaufnahmen kann application.activeWindow.materialCode nicht verwendet werden
	//weil kein Rückgabewert.
	var str0500 = application.activeWindow.title.findTag("0500", 0, false, false, true);
	if (str0500 != ""){
		return str0500;
	} else {
		return application.activeWindow.title.findTag("005", 0, false, false, true)
		}
}
function __alleMeldungen()
{
	var msgAnzahl, msgText, msgType;
	var i;
	var alleMeldungen = "";
	msgAnzahl = application.activeWindow.messages.count;
	for (i=0; i<msgAnzahl; i++)	
	{
		msgText = application.activeWindow.messages.item(i).text;
		msgType = application.activeWindow.messages.item(i).type;
		alleMeldungen += msgText + "\n";
	}
	//application.messageBox("Bitte beachten Sie die Meldungen!", alleMeldungen, "message-icon");
	return alleMeldungen;
}
function meldungenInZwischenspeicher()
{
	var strMeldung = __alleMeldungen();
	//am Ende Zeilenumbruch entfernen:
	strMeldung = strMeldung.substr(0, strMeldung.length-1);
	application.activeWindow.clipboard = "\u0022" + strMeldung + "\u0022"; // u0022 = Quot
	application.activeWindow.appendMessage("Der Meldetext wurde in den Zwischenspeicher kopiert.", 3);
}
function __blanksLinksLoeschen()
{
	var blankTest;
	do {
		application.activeWindow.title.charLeft(1, true);
		blankTest = application.activeWindow.title.selection;
		if (blankTest == " ") application.activeWindow.title.deleteSelection();
	}
	while (blankTest == " ");
}

function __formatD()
{
	//Präsentationsformat prüfen und auf "D" umstellen
	if (application.activeWindow.getVariable("P3GPR") != "D") {
		application.activeWindow.command ("\\too d", false);
	}

}

function ZETA()
{
	var strkat;
	if (!application.activeWindow.title){
		application.shellExecute ("http://www.zeitschriftendatenbank.de/erschliessung/arbeitsunterlagen/zeta..html", 5, "open", "");
	} else {
		strkat = application.activeWindow.title.tag;
		application.shellExecute ("http://www.zeitschriftendatenbank.de/erschliessung/arbeitsunterlagen/zeta/" + strkat + ".html", 5, "open", "");
		}
}

function WinIBWHandbuch()
{
	application.shellExecute ("http://www.gbv.de/wikis/cls/WinIBW3:Handbuch", 5, "open", "");
}
//----------------------------------------------------------
//Beide Funktionen gehören zusammen!
function __loescheBisKategorieEnde()
{
	if (!application.activeWindow.title) {
	return false;
	}
}
function loescheBisKategorieEnde()
{
	//steht nur zur Verfügung, wenn __loescheBisKategorieEnde() nicht false
	application.activeWindow.title.deleteToEndOfLine();
}
//----------------------------------------------------------
//Beide Funktionen gehören zusammen!
function __loescheKategorie()
{
	if (!application.activeWindow.title) {
	return false;
	}
}
function loescheKategorie()
{
	//steht nur zur Verfügung, wenn __loescheKategorie() nicht false
	application.activeWindow.title.deleteLine(1);
}
//----------------------------------------------------------
function Kategorienbeschreibung()
{
	var xulFeatures = "centerscreen, chrome, close, titlebar,resizable, modal=no, dependent=yes, dialog=yes";
	open_xul_dialog("chrome://ibw/content/xul/gbv_kategorie_dialog.xul", xulFeatures);
}
function Sacherschliessungsrichtlinie()
{
	application.shellExecute ("http://www.gbv.de/vgm/info/mitglieder/02Verbund/01Erschliessung/02Richtlinien/04Sacherschliessungsrichtlinie/", 5, "open", "");
}

// ------- MessageBoxen GBV --------
var messageBoxHeader="";

function __warnung(meldungstext)
{
	application.messageBox(messageBoxHeader, meldungstext, "alert-icon");
}
function __fehler(meldungstext)
{
	application.messageBox(messageBoxHeader, meldungstext, "error-icon");
}

function __meldung(meldungstext)
{
	application.messageBox(messageBoxHeader, meldungstext, "message-icon");
}
function __frage(meldungstext)
{
	application.messageBox(messageBoxHeader, meldungstext, "question-icon");
}
// ------- Ende MessageBoxen GBV --------

function __ppnPruefung(zeile)
{
	//kommt im String ein PPN-Link vor?
	var regExpPPN = /!(\d{8}[\d|x|X])!/;
	if (regExpPPN.test(zeile) == true){
		regExpPPN.exec(zeile);
		return RegExp.$1;
	} else {return "";}
}

function __alleZeilenArray()
{
	//gibt alle Zeilen des in der Vollanzeige befindlichen Datensatzes als Array aus.
	var zeilen = application.activeWindow.copyTitle().split("\r\n");
	return zeilen;
}
function __kategorieInhalt(strTitle, kategorie, bPlus)
{
	/*Ermitteln von Kategorien aus der Vollanzeige (nicht Korrekturstatus!)
	Kategorie + Inhalt werden ausgegeben
	In strTitle muss der kopierte Datensatz übergeben werden
	In kategorie muss die gesuchte Kategorie genannt werden
	Mit bPlus wird festgelegt, ob Ausgabewert mit Kategorie (true) oder ohne Kategorie (false) 
	Aufruf: __kategorieInhalt(strTitle, "4000", true)
	*/
	var strKategorie, strKategoriePlus;
	var zeilen = strTitle.split("\r\n");
	var laenge = kategorie.length;
	var i;
	for (i=0; i<zeilen.length; i++){
		if (zeilen[i].substring(0,laenge) == kategorie) {
			strKategoriePlus = zeilen[i];
			strKategorie = zeilen[i].substring(laenge+1);
			break;
		} else {
			strKategoriePlus= "";
			strKategorie = "";
		}
	}
	//Rückgabewert mit Kategorie oder ohne?
	if (bPlus == true){
		return strKategoriePlus;
		} else {
			return strKategorie
		}
}

function kategorieAnalysePlus(strKategorie, strFeld)
{
	var analysePlus = "";
	var lPos1 = strKategorie.indexOf("\u0192" + strFeld);
	
	if (lPos1 != -1) {
		analysePlus = strKategorie.substring(lPos1+2);
		var lPos2 = analysePlus.indexOf("\u0192"); //Beginn des nächsten Unterfeldes
		if (lPos2 != -1){ 
			analysePlus = analysePlus.substring(0, lPos2);
		}
	}
	
	return analysePlus;
}

function kategorieLoeschen(kategorie)
{
	//Ersatz für title.ttl in Sonderfällen:
	//im Titleedit-Schirm: jedes Vorkommnis der Kategorie wird gelöscht 
	while (application.activeWindow.title.findTag(kategorie, 0, true, true, false) != ""){
			//__meldung ("loesche die Zeile " + kategorie);
			application.activeWindow.title.deleteLine(1);
	}
}

function loescheZeileAbPosition(kategorie, position)
{
	//Sucht Kategorie und löscht den Rest der Zeile ab position
	if(application.activeWindow.title.findTag(kategorie, 0, true, true, true) != "")
	{
		application.activeWindow.title.startOfField(false);
		application.activeWindow.title.charRight(position, false);
		application.activeWindow.title.deleteToEndOfLine();
	}
}

function __datum()
{	
	//Form: JJJJ.MM.TT
	var heute = new Date();
	
	var strMonat = heute.getMonth();
	strMonat = strMonat + 1;
	if (strMonat <10){strMonat = "0" + strMonat};
	
	var strTag = heute.getDate();
	if (strTag <10){strTag = "0" + strTag}; 
	
	var datum = heute.getFullYear() + "." + strMonat + "." + strTag;
	return datum;
}

