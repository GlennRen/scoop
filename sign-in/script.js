console.log("HEY I\'M INJECTED")
$(function(){
	if ((jQuery("meta[name='og:type']") && jQuery("meta[name='og:type']").attr("content") == "article") || (jQuery("meta[property='og:type']") && jQuery("meta[property='og:type']").attr("content") == "article")){
		    var scoopFragment = chrome.extension.getURL("index.html");
		    $.get(scoopFragment, function(data){
		    	document.write(data + '<iframe src="' + document.location.href + '" width=78% height=100%></iframe>')
		    })
	}
});