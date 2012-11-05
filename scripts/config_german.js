/*************************************************************************************************
 *
 *	This file contains PICA specific configuration for the standard WinIBW script functions
 *
 *  !!! Please do not modify this file, because the standard scripts depend on it !!!
 *
 *  !!! If you need modifications, please provide your own file with the appropriate settings !!!
 *
 *************************************************************************************************
 *************************************************************************************************
 *	$Header$
 *
 *
 *	$Log$
 *	angepasst ZDB 2010/08/04: schulzec
 *	geprueft und angepasst GBV 2008/07/21: hachmann
 *
 *	Revision 1.6  2004/12/13 10:33:06  bouwmeester
 *	Added syntax coloring for Marc21 ("M").
 *
 *	Revision 1.5  2004/11/10 11:05:31  hofmann
 *	implemented "picaCopyRecord" standard scripts; made WinIBW aware of current "systeem" and "bestand" (via "P3VSY" and "P3VBE")
 *
 *	Revision 1.4  2004/11/09 15:07:39  hofmann
 *	some more standard scripts
 *
 *	Revision 1.3  2004/10/08 09:25:45  hofmann
 *	added missing syntax colouring related stuff
 *
 *	Revision 1.2  2004/07/15 11:41:59  hofmann
 *	all kind of script related stuff
 *
 *	Revision 1.1  2004/07/13 09:55:22  hofmann
 *	some more script related stuff
 *
 *
 **************************************************************************************************
 */

/*******************************************************************************************************
 * The contents of the columns of parametersArray is described as following:
 * column  0 = format
 * column  1 = tagMaterialAuthority
 * column  2 = tagMaterialTitle
 * column  3 = regExpMatCode
 * column  4 = cmdShowFull
 * column  5 = regExpAddToTag
 * column  6 = titleLinkPrefix
 * column  7 = authorityLinkPrefix
 * column  8 = linkSuffix
 * column  9 = killString
 * column 10 = requiredTag
 * column 11 = requiredData
 ********************************************************************************************************
 */
function rtrim(argvalue) {
		while (1) {
				if (argvalue.substring(argvalue.length - 1, argvalue.length) != " ")
				break;
				argvalue = argvalue.substring(0, argvalue.length - 1);
		}
		return argvalue;
}

const gConfig =
{
		// parametersArray contains configuration parameter values for the standard WinIBW script function
		parametersArray : [["d", "005", "0500", /(..)/, "\\too d", /^30[0-8][0-9]$/, "!", "!", "!", "1698 Umlenkung auf: ", "4700", ".",],
										["unm", "008", "008", /\$a(..)/, "\\too unm", /^~ $/, "$0", "$3", "", "023 $a", "", "",],
										["m21", "002", "002", /(..)/, "\\too m", /^30(0|1)[0-9]$/, "!", "!", "!", "1699  = ", "4700", ".",],
										["p", "002@", "002@", /\$0(..)/, "\\too p", "", "$9", "$9", "", "038K $A", "", "",]],

	// standard presentation format
	format: "",

	// get the format property corresponding to the given format
		getFormat: function (){
				this.switchFormat();
				return this.format.toLowerCase();
		},


	// tag containing material code in case of authorities
	tagMaterialAuthority: "",

	// get the tagMaterialAuthority property corresponding to the given format
		getTagMaterialAuthority: function (){
				this.switchFormat();
				return this.tagMaterialAuthority;
		},

	// tag containing material code in case of titles
	tagMaterialTitle: "",

	// get the tagMaterialTitle property corresponding to the given format
		getTagMaterialTitle: function (){
				this.switchFormat();
				return this.tagMaterialTitle;
		},

	// regular expression to get the required positions from the material type from the content
	// of the tag containing the material Type
	regExpMatCode: "",

	// get the regExpMatCode property corresponding to the given format
		getRegExpMatCode: function () {
				this.switchFormat();
				return this.regExpMatCode;
		},

	// url of string bundle containing messages
	messageURL: "resource:/scripts/messages_de.properties",

	// command for full presentation
	cmdShowFull: "",

	// get the cmdShowFull property corresponding to the given format
		getCmdShowFull: function () {
				this.switchFormat();
				return this.cmdShowFull;
		},

	// regular expression which is matched against the tag for pasting links
	// if the regex matches, the link is appended, otherwise the content is overwritten
	regExpAddToTag: "",

	// get the regExpAddToTag property corresponding to the given format
		getRegExpAddToTag: function () {
				this.switchFormat();
				return this.regExpAddToTag;
		},

	// text that is inserted before links in title records
	titleLinkPrefix: "",

	// get the titleLinkPrefix property corresponding to the given format
		getTitleLinkPrefix: function () {
				this.switchFormat();
				return this.titleLinkPrefix;
		},

	// text that is inserted before links in authority records
	authorityLinkPrefix: "",

	// get the authorityLinkPrefix property corresponding to the given format
		getAuthorityLinkPrefix: function () {
				this.switchFormat();
				return this.authorityLinkPrefix;
		},

	// text that is inserted after links in records
	linkSuffix: "",

	// get the linkSuffix property corresponding to the given format
		getLinkSuffix: function () {
				this.switchFormat();
				return this.linkSuffix;
		},

	// tag and subfield/interpunction used for kill requests
	killString: "",

	// get the killString property corresponding to the given format
		getKillString: function () {
				this.switchFormat();
				return this.killString;
		},

		// requiredTag for inserting
		requiredTag: "",

		// get the requiredTag for inserting corresponding to the given format
		getRequiredTag: function () {
				this.switchFormat();
				return this.requiredTag;
		},

		// requiredData for inserting
		requiredData: "",

		// get the requiredData for inserting corresponding to the given format
		getRequiredData: function () {
				this.switchFormat();
				return this.requiredData;
		},

		// insert required tags to be present to pass record validation
	insertRequiredTags: function() {
			var required_Tag = this.getRequiredTag();
			if (required_Tag != "") {
				if (application.activeWindow.title.findTag(required_Tag, 0, true, false, false) == "") {
					// there is no 4700, add it
					application.activeWindow.title.endOfBuffer(false);
					var requiredTagAndData = required_Tag + this.getRequiredData();
					application.activeWindow.title.insertText(requiredTagAndData);
				}
		}else {
				return;
		}
	},

	// function specifies if we need a system switch, for copying the record
	needSystemSwitch: function() {
		return false;
	},

	// syntax colouring settings for editscreen
	setSyntaxColour:  function() {
		application.addSyntaxColor("d", "(^\\d{3,4})", "0x999900");
		application.addSyntaxColor("d", "(!\\d{8,10}(\\d|x|X)!)", "0xFF0000");
		application.addSyntaxColor("d", "^710\\d [^\\n]*( @ )", "0x999900");
		application.addSyntaxColor("d", "^710\\d [^\\n]*( % )", "0x999900");
		application.addSyntaxColor("d", "^710\\d [^\\n]*(\\(\\()", "0x999900");
		application.addSyntaxColor("d", "^710\\d [^\\n]*(\\)\\))", "0x999900");
		application.addSyntaxColor("d", "^710\\d [^\\n]*(!!)", "0x999900"); // always the last !!
	//	application.addSyntaxColor("d", "^710\\d [^\\n](!!(?![\\s\\n]))", "0x999900");
		application.addSyntaxColor("d", "^710\\d [^!]*(!!)", "0x999900"); // always the first !!
		application.addSyntaxColor("d", "^710\\d [^\\n]*( ; )", "0x999900");
		application.addSyntaxColor("d", "^8032 (#[^#]*#)", "0x999900");
		application.addSyntaxColor("d", "(/v\\B|/b\\B|/V\\B|/E\\B)", "0x999900");
	//	application.addSyntaxColor("d", "^7120[^-]*(-$)", "0x999900");
		application.addSyntaxColor("d", "( =[a-z]+ )", "0x999900");
		/*application.addSyntaxColor("d", "( =b )", "0x999900");
		application.addSyntaxColor("d", "( =c )", "0x999900");
		application.addSyntaxColor("d", "( =d )", "0x999900");
		application.addSyntaxColor("d", "( =e )", "0x999900");
		application.addSyntaxColor("d", "( =f )", "0x999900");
		application.addSyntaxColor("d", "( =g )", "0x999900");
		application.addSyntaxColor("d", "( =h )", "0x999900");
		application.addSyntaxColor("d", "( =y )", "0x999900");*/
		application.addSyntaxColor("d", "(\\$[a-zA-Z0-9])", "0x0000CC");


		// eigentlich keine Syntaxfarben:
		application.ignoredColor = "0x0000CC"; // (rot)
		application.protectedColor = "0x0000CC"; // (rot)
	},


	// switchFormat function sets all the parameters to the values corresponding to the given format
		switchFormat: function (){
				var i = 0;
				var format_tmp = rtrim(application.activeWindow.getVariable("P3GDB"));
				var requiredformat = format_tmp.toLowerCase();
					if (requiredformat != this.format){
							for (i=0; i<this.parametersArray.length; i++) {
								if (this.parametersArray[i][0] == requiredformat){
										this.format = this.parametersArray[i][0];
										this.tagMaterialAuthority = this.parametersArray[i][1];
										this.tagMaterialTitle = this.parametersArray[i][2];
										this.regExpMatCode = this.parametersArray[i][3];
										this.cmdShowFull = this.parametersArray[i][4];
										this.regExpAddToTag = this.parametersArray[i][5];
										this.titleLinkPrefix = this.parametersArray[i][6];
										this.authorityLinkPrefix = this.parametersArray[i][7];
										this.linkSuffix = this.parametersArray[i][8];
										this.killString = this.parametersArray[i][9];
										this.requiredTag = this.parametersArray[i][10];
										this.requiredData = this.parametersArray[i][11];
										break;
								}
						}
						if (i==this.parametersArray.length) {
								application.messageBox("message", "No such format supported at ATF!", "");
						}
				}
		}

};