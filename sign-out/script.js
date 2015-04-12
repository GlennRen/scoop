console.log("HEY I\'M INJECTED")
$(function(){

	if ((jQuery("meta[name='og:type']") && jQuery("meta[name='og:type']").attr("content") == "article") || (jQuery("meta[property='og:type']") && jQuery("meta[property='og:type']").attr("content") == "article")){
		
		    var scoopFragment = 
		    	'<div id="scoop">'
		    	+ '<div id="top-bar">'
		    	+ '<p id="sign-out">Sign Out</p>'
		    	+ '<p id="title"><strong>Scoop</strong></p>'
		    	+ '<img src="x-button.png"/>'
		    	+ '</div></div>';
	    $('body').html( scoopFragment + '<div id="my-div"> ' + $('body').html() + '</div>');

	}

});