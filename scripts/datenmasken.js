//Datei:	datenmasken.js
//Autor:	Karen Hachmann, GBV
//Datum:	September 2005


function open_xul_dialog(theUrl, theFeatures, theArguments)
{
	// try to get the window-watcher
	var ww    = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
                                 .getService(Components.interfaces.nsIWindowWatcher);

	if (!ww) {
		// no chance, give up
		return false;
	}

	// let's try to get a valid parent
	var theParent = ww.activeWindow;

	var features = null;

	if (theFeatures != null) {
		features = theFeatures;
	} else {
		// you may choose to remove some of the features
		// you may also want to specify width=xxx and/or height=xxx
		features = "centerscreen,chrome,close,titlebar,resizable,modal,dialog=yes";
	}

	// it doesn't matter, if we don't have a parent
	// we just use the active window, whether its null or not
	ww.openWindow(theParent, theUrl, "", features, theArguments);
}


function datenmasken_dialog()
{
	open_xul_dialog("chrome://ibw/content/xul/datenmasken_dialog.xul", null);
}


function DatenmaskeEinfuegen(maskenNr)
{
	var theFileInput = utility.newFileInput();
	var thePrompter = utility.newPrompter();
	var antwort, dasKommando = "", kommandoTitel, kommandoNorm;
	var theLine;
	var titel;
	var fileName = "\\datenmasken\\maske" + maskenNr + ".txt";
	var fileNameBinDir = "\\defaults\\datenmasken\\maske" + maskenNr + ".txt";

	//auf welchem Schirm befinden wir uns?
	var screenNr = application.activeWindow.getVariable("scr");

	//Kommandos zum Eingeben von Titeln und Normdaten
	kommandoTitel = "\\inv 1"
	kommandoNorm = "\\inv 2"

	// Datenmaskendatei im Verzeichnis profiles\<user>\datenmasken oeffnen:
	if (!theFileInput.openSpecial("ProfD", fileName)) {
		if (!theFileInput.openSpecial("BinDir", fileNameBinDir)) {
			application.messageBox("Fehler", "Datei " + theList.value + " wurde nicht gefunden.", "error-icon");
			return;
		}
	}
	for (titel = ""; !theFileInput.isEOF(); ) {
		titel += theFileInput.readLine() + "\n"
	}
	theFileInput.close();

	var editing = (application.activeWindow.title != null);

	if ((Datentyp = titel.substr(0,4)) == "0500")
		dasKommando = kommandoTitel
	else if ((Datentyp = titel.substr(0,3)) == "005")
		dasKommando = kommandoNorm
	else if (!editing) {
		//wenn weder 0500 noch 005 vorkommt, muss er Benutzer nun entscheiden:
		antwort = thePrompter.select("Auswahl", "Leider konnte die WinIBW nicht erkennen," +
			"ob die Datenmaske f�r Titel oder Normdaten verwendet werden soll.\n" +
			"Bitte w�hlen Sie aus:", "Titeldaten\nNormdaten");

		if (!antwort) {
			// Benutzer hat den Dialog abgebrochen:
			return;
		}
		if (antwort == "Titeldaten")
			dasKommando = kommandoTitel
		else if (antwort == "Normdaten")
			dasKommando = kommandoNorm
	}

	if (dasKommando == "") {
		// The data is inserted in the edit window at the cursor position.
		// The "++" is not removed (as in maskeEinfuegen), because the data already present
		// might contain this.
		application.activeWindow.title.endOfBuffer(false);
		maskeEinfuegen(titel);
		return;
	}

	//wenn editing = true, dann wird das Kommando in neuem Fenster ausgef�hrt
	application.activeWindow.command(dasKommando, editing);

	// Eingeben oder Abbruch, falls kein titleedit vorliegt:
	if (application.activeWindow.title) {
	    maskeEinfuegen(titel);
	}
	else {
		application.messageBox("Fehler", "Datenmaske kann nicht eingef�gt werden!", "error-icon");
		return;
	}
}

function maskeEinfuegen(titel)
{
    //Datenmaske einf�gen:
    var startP = application.activeWindow.title.selStart;
	application.activeWindow.title.insertText(titel);
	application.activeWindow.title.setSelection(startP, startP, false);
	var suchePlus = application.activeWindow.title.find("++", false, false, true);

	if (suchePlus == true){
		//Entfernen der Plusse, der Cursor bleibt hier stehen:
		application.activeWindow.title.deleteSelection();
	}
}

function Datenmaske1()
{
	DatenmaskeEinfuegen("01");
}
function Datenmaske2()
{
	DatenmaskeEinfuegen("02");
}
function Datenmaske3()
{
	DatenmaskeEinfuegen("03");
}
function Datenmaske4()
{
	DatenmaskeEinfuegen("04");
}
function Datenmaske5()
{
	DatenmaskeEinfuegen("05");
}
function Datenmaske6()
{
	DatenmaskeEinfuegen("06");
}
function Datenmaske7()
{
	DatenmaskeEinfuegen("07");
}
function Datenmaske8()
{
	DatenmaskeEinfuegen("08");
}
function Datenmaske9()
{
	DatenmaskeEinfuegen("09");
}
function Datenmaske10()
{
	DatenmaskeEinfuegen("10");
}

function Datenmaske11()
{
	DatenmaskeEinfuegen("11");
}
function Datenmaske12()
{
	DatenmaskeEinfuegen("12");
}
function Datenmaske13()
{
	DatenmaskeEinfuegen("13");
}
function Datenmaske14()
{
	DatenmaskeEinfuegen("14");
}
function Datenmaske15()
{
	DatenmaskeEinfuegen("15");
}
function Datenmaske16()
{
	DatenmaskeEinfuegen("16");
}
function Datenmaske17()
{
	DatenmaskeEinfuegen("17");
}
function Datenmaske18()
{
	DatenmaskeEinfuegen("18");
}
function Datenmaske19()
{
	DatenmaskeEinfuegen("19");
}
function Datenmaske20()
{
	DatenmaskeEinfuegen("20");
}
function DatenmaskenMore_dialog()
{
    open_xul_dialog("chrome://ibw/content/xul/moreDatenmasken_dialog.xul", null);
}