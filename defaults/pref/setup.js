//preferences Carsten Klee 2012-02-10

pref("ibw.startup.language", "DU");
pref("ibw.userscript.language", "js");
pref("ibw.CodedData.CatFormat", "D");
pref("ibw.hyperlinks.PPNLink", "\\zoe+\\12");
pref("ibw.images.path", "resource:/images");
pref("ibw.CodedData.noOp", "<img src='resource:/images/noop.gif'>");
pref("winibw.messages.error", 3);
pref("winibw.messages.alert", 1);
pref("winibw.messages.message", 1);
pref("ibw.startup.homepage", "resource:/startup/start_ZDB.htm");
pref("winibw.ui.version", 1);
pref("winibw.help.normal", "");
pref("winibw.help.access", "http://www.zeitschriftendatenbank.de/erschliessung");
pref("winibw.help.cataloguing", "/arbeitsunterlagen.html");
pref("winibw.help.prefix", "");
pref("winibw.help.suffix", ".html");
pref("winibw.help.url_base", "/arbeitsunterlagen/zeta/");
pref("winibw.help_MI.url_base", "/arbeitsunterlagen/zeta/");
pref("winibw.help_II.url_base", "/arbeitsunterlagen/zeta/");
pref("winibw.help_MI.prefix", "");
pref("winibw.help_MI.suffix", ".html");
pref("winibw.help_II.prefix", "");
pref("winibw.help_II.suffix", ".html");
pref("winibw.help.AccessControl", true);
pref("ibw.standardScripts.script.01", "resource:/scripts/config_german.js");
pref("ibw.standardScripts.script.02", "resource:/scripts/standard_utility.js");
pref("ibw.standardScripts.script.03", "resource:/scripts/standard_linking.js");
pref("ibw.standardScripts.script.04", "resource:/scripts/standard_kill.js");
pref("ibw.standardScripts.script.05", "resource:/scripts/standard_create.js");
pref("ibw.standardScripts.script.06", "resource:/scripts/standard_copy.js");
pref("ibw.standardScripts.script.07", "resource:/scripts/standard.js");
pref("ibw.standardScripts.script.08", "resource:/scripts/datenmasken.js");
pref("ibw.standardScripts.script.09", "resource:/scripts/gbv_public.js");
pref("ibw.standardScripts.script.010", "resource:/scripts/gbv_exemplarmasken.js");
pref("ibw.standardScripts.script.11", "resource:/scripts/zdb_scripte_01.js");
pref("ibw.standardScripts.script.12", "resource:/scripts/zdb_scripte_02.js");
pref("ibw.standardScripts.script.13", "resource:/scripts/zdb_scripte_03.js");
pref("ibw.standardScripts.script.14", "resource:/scripts/dnb_authorities.js");
pref("ibw.standardScripts.script.15", "resource:/scripts/dnb_titles.js");
pref("ibw.standardScripts.script.16", "resource:/scripts/dnb_public_extern.js");
pref("ibw.standardScripts.script.17", "resource:/scripts/dnb_datenmasken.js");
pref("ibw.updateservice.url", "http://www.zeitschriftendatenbank.de/fileadmin/user_upload/ZDB/winibw/update");
pref("ibw.presentation.syntaxcolor.D.regex.1", "(<[bB][rR]>)(70[0-9][0-9])");
pref("ibw.presentation.syntaxcolor.D.format.1", '$1<span style="font-weight:bold;color:CC3300">$2</span>');
pref("ibw.presentation.syntaxcolor.D.regex.2", "(<[bB][rR]>)(\w{3,4})");
pref("ibw.presentation.syntaxcolor.D.format.2", '$1<span style="font-weight:bold">$2</span>');
pref("ibw.presentation.syntaxcolor.D.regex.3", "(.*?)(?:<[bB][rR]>)");
pref("ibw.presentation.syntaxcolor.D.format.3", '<div style="direction: ltr">$1</div>');
pref("ibw.presentation.syntaxcolor.D.regex.4", "(\$T.*?&amp;&amp;)");
pref("ibw.presentation.syntaxcolor.D.format.4", '<span style="color:660099">$1</span>');
pref("ibw.presentation.syntaxcolor.D.regex.5", "(\$[a-zA-Z0-9])");
pref("ibw.presentation.syntaxcolor.D.format.5", '<span style="font-weight:bold;color:CC3300">$0</span>');
pref("ibw.presentation.syntaxcolor.D.regex.6", "(=[a-z]+ )");
pref("ibw.presentation.syntaxcolor.D.format.6", '<span style="font-weight:bold;color:CC3300">$0</span>');
pref("ibw.presentation.syntaxcolor.DA.regex.1", "(<[bB][rR]>)(\[\d{4} *\])");
pref("ibw.presentation.syntaxcolor.DA.format.1", '$1<span style="font-weight:bold">$2</span>');
pref("ibw.presentation.syntaxcolor.DA.regex.2", "(<[bB][rR]>)(70[0-9][0-9])");
pref("ibw.presentation.syntaxcolor.DA.format.2", '$1<span style="font-weight:bold;color:CC3300">$2</span>');
pref("ibw.presentation.syntaxcolor.DA.regex.3", "(.*?)(?:<[bB][rR]>)");
pref("ibw.presentation.syntaxcolor.DA.format.3", '<div style="direction: ltr">$1</div>');
pref("ibw.presentation.syntaxcolor.DA.regex.4", "(\$[a-zA-Z0-9])");
pref("ibw.presentation.syntaxcolor.DA.format.4", '<span style="font-weight:bold;color:CC3300">$0</span>');
pref("ibw.presentation.syntaxcolor.DA.regex.5", "(=[a-z]+ )");
pref("ibw.presentation.syntaxcolor.DA.format.5", '<span style="font-weight:bold;color:CC3300">$0</span>');
pref("ibw.presentation.syntaxcolor.P.regex.level0", "(<[bB][rR]>)(0\d{2}[A-Z@])");
pref("ibw.presentation.syntaxcolor.P.format.level0", '$1<span style="font-weight:bold;color:008080">$2</span>');
pref("ibw.presentation.syntaxcolor.P.regex.level1", "(<[bB][rR]>)(1\d{2}[A-Z@])");
pref("ibw.presentation.syntaxcolor.P.format.level1", '$1<span style="font-weight:bold;color:000099">$2</span>');
pref("ibw.presentation.syntaxcolor.P.regex.exnr", "(<[bB][rR]>)(208@\\/\\d{2})");
pref("ibw.presentation.syntaxcolor.P.format.exnr", '$1<span style="font-weight:bold;color:CC3300">$2</span>');
pref("ibw.presentation.syntaxcolor.P.regex.level2", "(<[bB][rR]>)(2\d{2}[A-Z@])");
pref("ibw.presentation.syntaxcolor.P.format.level2", '$1<span style="font-weight:bold">$2</span>');
pref("ibw.presentation.syntaxcolor.P.regex.subfield", "(\xc6\x92[a-zA-Z0-9])");
pref("ibw.presentation.syntaxcolor.P.format.subfield", '<span style="font-weight:bold;color:CC3300">$0</span>');
pref("ibw.presentation.syntaxcolor.PA.regex.iln", "(<[bB][rR]>)(101@ )");
pref("ibw.presentation.syntaxcolor.PA.format.iln", '$1<span style="font-weight:bold">$2</span>');
pref("ibw.presentation.syntaxcolor.PA.regex.exnr", "(<[bB][rR]>)(208@\\/\\d{2})");
pref("ibw.presentation.syntaxcolor.PA.format.exnr", '$1<span style="font-weight:bold;color:CC3300">$2</span>');
pref("ibw.presentation.syntaxcolor.PA.regex.subfield", "(\xc6\x92[a-zA-Z0-9])");
pref("ibw.presentation.syntaxcolor.PA.format.subfield", '<span style="font-weight:bold;color:CC3300">$0</span>');
pref("ibw.taglen.D.title", '4');
pref("ibw.taglen.D.authority", '3');
pref("Richtlinie.Einrichtung", "ZETA");
