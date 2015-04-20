$(document).ready(function() {
	if ((jQuery("meta[name='og:type']") && jQuery("meta[name='og:type']").attr("content") == "article") || (jQuery("meta[property='og:type']") && jQuery("meta[property='og:type']").attr("content") == "article")) {
		var scoopFragment = chrome.extension.getURL("index.html");
		jQuery.get(scoopFragment, function(data) {
			document.write(data + '<div class="iframe"><iframe src="' + document.location.href + '" width=500px height=100%></iframe></div>');

			jQuery("#signin").click(function() {
				var popup = window.open("http://45ac1b37.ngrok.com/login",
					"Sign In", "height=300,width=550,resizable=1");
			})
			jQuery(document).on("click", ".close", function() {
				jQuery("#scoop").remove();
			});
			jQuery(document).on("click", ".button.left img", function() {
				var favSRC = $(this).attr("src");
				var $fav = $(this);
				if (favSRC.indexOf("-active") > -1)
					var action = "destroy";
				else
					var action = "create";
				jQuery.ajax({
					url: "http://45ac1b37.ngrok.com/favorite?action=" + action + "&id=" + $(this).closest("li").attr("data-id"),
					type: "GET",
					crossDomain: true,
					asyc: false,
					success: function(response) {
						if ((typeof response["errors"] != 'undefined') && (response["errors"][0]["code"] == 139))
							response["favorited"] = true;
						if (!response["favorited"]) {
							$fav.siblings().first().text(response["favorite_count"]);
							$fav.attr("src", "http://glennren.github.io/scoop/sign-in/favorite.svg");
						} else {
							$fav.siblings().first().text(response["favorite_count"]);
							$fav.attr("src", "http://glennren.github.io/scoop/sign-in/favorite-active.svg");
						}

					}
				});
			});

			jQuery(document).on("click", ".button.right img", function() {
				var $tweet = $(this).closest("[data-id]");
				var tweetID = $tweet.attr("data-id");
				$tweet.after("<li><form><input type='text' tweet-id='" + tweetID + "'></form></li>");
				/*Query.ajax({
									url: "https://605f443e.ngrok.com/tweet?id=" + tweetID + "&text=" + $(this).closest("li").attr("data-id"),
									type: "GET",
									crossDomain: true,
									asyc: false,
									success: function(response) {
										if ((typeof response["errors"] != 'undefined') && (response["errors"][0]["code"] == 139))
											response["favorited"] = true;
										if (!response["favorited"]) {
											$fav.siblings().first().text(response["favorite_count"]);
											$fav.attr("src", "http://glennren.github.io/scoop/sign-in/favorite.svg");
										}
										else {
											$fav.siblings().first().text(response["favorite_count"]);
											$fav.attr("src", "http://glennren.github.io/scoop/sign-in/favorite-active.svg");
										}

									}
							});*/
			});
			var scoopFragment = chrome.extension.getURL("tweets.html");
			jQuery.get(scoopFragment, function(data) {
				var $tweets = jQuery(data);
				jQuery("#scoop").html($tweets);
				jQuery.ajax({
					url: "http://45ac1b37.ngrok.com/findTweets?url=" + document.location.href,
					type: "GET",
					crossDomain: true,
					asyc: false,
					success: function(response) {
						console.log(response);
						for (var i = 0; i < response.length; i++) {
							var tweet = response[i];
							var $tweet = $(".template").first().clone().removeClass("template");
							$tweet.attr("data-id", tweet["id"]);
							$tweet.find(".tweet").text(tweet["text"]);
							$tweet.find(".name a").text(tweet["author_name"]);
							$tweet.find(".name a").attr("href", "https://twitter.com/" + tweet["author_username"]);
							$tweet.find(".username").text("@" + tweet["author_username"]);
							$tweet.find(".button.left span").text(tweet["favorites"]);
							$tweet.find(".media-left img").attr("src", tweet["author_image"]);
							if (!tweet["favorited"]) {
								$tweet.find(".button.left img").attr("src", "http://glennren.github.io/scoop/sign-in/favorite.svg");
							} else {
								$tweet.find(".button.left img").attr("src", "http://glennren.github.io/scoop/sign-in/favorite-active.svg");
							}
							console.log($tweet);
							$("ul").append($tweet);
						}
						$("body").append(response[0]["query"]);
						$(".iframe").css("height", $(document).height());
					},
					error: function(xhr, status) {
						console.log(zhr, status);
					}
				});
			});
		});
	}
})