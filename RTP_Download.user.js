// ==UserScript==
// @name        RTP Play Download
// @description Inclui links directos nas páginas do RTP Play. Não funciona para alguns vídeos.
// @description Quando não funciona mostra as flashvars
// @namespace   somini
// @include     http://www.rtp.pt/play/p*/e*
// @grant       none
// @version     2.0
// ==/UserScript==

var files = [
	{
		"from"	: 'nas2.share/wavrss/',
		"to"	: 'http://rsspod.rtp.pt/podcasts/',
		"type"	: 'audio'
	},
	{
		"from"	: 'nas2.share/h264/',
		"to"	: 'http://rsspod.rtp.pt/videocasts/',
		"type"	: 'audio'
	}
];
function findText() {
	var text, regex, res;
	// Attempt 1: Last script in the body
	var scripts = document.getElementsByTagName('script');
	text = scripts[scripts.length - 1].innerHTML;
	regex = /"file": "(.*?)"/;

	res = text.match(regex)[1]; // Get the Regex's first group

	return res;
}

// Get the internal filepath
var innerURL = findText();
console.log("RTP Inner Link: "+innerURL);

// Get the public filepath
var outerURL;
var keepGoing = (files.length !== 0);
var idx = 0;
while (keepGoing) {
	var f = files[idx];
	if (innerURL.startsWith(f.from)) {
		console.log("Got a match: '"+f.from+"' matches '"+innerURL+"'");
		outerURL = f.to + innerURL.substring(f.from.length);
		keepGoing = false; // Matched
	}
	idx++;
	keepGoing = (idx < files.length);
}
console.log("RTP Real Link: "+outerURL);

// Create a direct link, if it exists
if (outerURL) {
	var nodeParent = document.getElementsByTagName("article")[0];
	var node = document.createElement("div");
	var nodeLink = document.createElement("a");
	node.setAttribute('style','width: 100%; height: 50px; background: red;');
	nodeLink.setAttribute('href',outerURL);
	nodeLink.appendChild(document.createTextNode("Link Directo"));
	node.appendChild(nodeLink);
	nodeParent.appendChild(node);
}
else {
	console.log("Couldn't find anything: "+innerURL);
}
