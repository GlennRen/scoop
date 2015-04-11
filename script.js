if ((jQuery("meta[name='og:type']") && jQuery("meta[name='og:type']").attr("content") == "article") || (jQuery("meta[property='og:type']") && jQuery("meta[property='og:type']").attr("content") == "article"))
    jQuery("body").html("This is an article.");
