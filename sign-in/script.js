console.log("HEY I\'M INJECTED")
$(function(){
	if ((jQuery("meta[name='og:type']") && jQuery("meta[name='og:type']").attr("content") == "article") || (jQuery("meta[property='og:type']") && jQuery("meta[property='og:type']").attr("content") == "article")){
		
		    var scoopFragment = 
		    	'<div id="scoop">'
		    	+ '<p id="title"><strong>Scoop</strong></p>'
		    	+ '<div id="sign-info">'
		    	+ '<p id="welcome"><strong>Welcome to Scoop!</strong></p>'
		    	+ '<p id="reason">We need access to your Twitter Account so you can reply to comments.</p>'
		    	
		    	+ '</div>'
		    	+ '</div>';
	    document.write(scoopFragment + '<iframe src="' + document.location.href + '" width=80% height=100%></iframe>')
	}

});