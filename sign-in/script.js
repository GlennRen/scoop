$(document).ready(function() {
	if ((jQuery("meta[name='og:type']") && jQuery("meta[name='og:type']").attr("content") == "article") || (jQuery("meta[property='og:type']") && jQuery("meta[property='og:type']").attr("content") == "article")) {
		var scoopFragment = chrome.extension.getURL("index.html");
		jQuery.get(scoopFragment, function(data) {
			document.write(data + '<div class="iframe"><iframe src="' + document.location.href + '" width=500px height=100%></iframe></div>');

			jQuery("#signin").click(function() {
				var popup = window.open("https://605f443e.ngrok.com/login",
					"Sign In", "height=300,width=550,resizable=1");
			})
			jQuery(document).on("click", ".close", function() {
				jQuery("#scoop").remove();
			});
			jQuery(document).on("click", ".button.left img", function() {
				jQuery.ajax({
					url: "https://605f443e.ngrok.com/findTweets?url=" + document.location.href,
					type: "GET",
			});
			var scoopFragment = chrome.extension.getURL("tweets.html");
			jQuery.get(scoopFragment, function(data) {
				var $tweets = jQuery(data);
				jQuery("#scoop").html($tweets);
				jQuery.ajax({
					url: "https://605f443e.ngrok.com/findTweets?url=" + document.location.href,
					type: "GET",
					crossDomain: true,
					asyc: false,
					success: function(response) {
						console.log(response);
						for (var i = 0; i < response.length; i++) {
							var tweet = response[i];
							var $tweet = $(".template").first().clone().removeClass("template");
							$tweet.find(".tweet").attr("data-id", tweet["id"]);
							$tweet.find(".tweet").text(tweet["text"]);
							$tweet.find(".name a").text(tweet["author_name"]);
							$tweet.find(".name a").attr("href", "https://twitter.com/" + tweet["author_username"]);
							$tweet.find(".username").text("@" + tweet["author_username"]);
							$tweet.find(".button.left span").text(tweet["favorites"]);
							$tweet.find(".media-left img").attr("src", tweet["author_image"]);

							console.log($tweet);
							$("ul").append($tweet);
						}
					},
					error: function(xhr, status) {
						console.log(zhr, status);
					}
				});
			});
		});
	}
})