// Executes when the document is ready
jQuery(document).ready(function() {

	// Append analytics params to all indiegogo.com URLs
	appendInboundAnalyticsParamsToUrls();
	clearAnalyticsParamsFromAddressBar();

	/**
	 * Set up Google Analytics tracking events.
	 * The following events are organized by type/group.
	 */

	/**
	 * Header
	 */

	// Header: Logo
	jQuery( '.igg' ).on( 'click', function() {
		ga( 'send', 'event', 'Header', 'click', 'Main IGG Logo' );
	});

	// Header: "Explore" link
	// jQuery( '.site-header .menu #menu-item-7 a' ).on( 'click', function() {
	// 	ga( 'send', 'event', 'Header', 'click', 'Link: Explore' );
	// });

	// Header: "How It Works" link
	// jQuery( '.site-header .menu #menu-item-31 a, .site-header .menu #menu-item-574 a' ).on( 'click', function() {
	// 	ga( 'send', 'event', 'Header', 'click', 'Link: How It Works' );
	// });

	// Header: "Start Your Campaign" link
	// jQuery( '.site-header .menu #menu-item-32 a' ).on( 'click', function() {
	// 	ga( 'send', 'event', 'Header', 'click', 'Link: Start Your Campaign' );
	// });

	// Header: Search form
	jQuery( '.header-search-form' ).on( 'submit', function() {
		var searchTerm = jQuery(this).find( 'input[type="search"]' ).val();
		ga( 'send', 'event', 'Header', 'submit', 'Search Form: ' + searchTerm );
	});

	/**
	 * Forms
	 */

	// Forms: Start your Campaign
	// jQuery( 'form.start-your-campaign' ).on( 'submit', function() {
	// 	var campaignTitle = jQuery(this).find( 'input#campaign\\[title\\]' ).val();
	// 	ga( 'send', 'event', 'Forms', 'submit', 'Start Your Campaign Form: ' + campaignTitle );
	// });

	/**
	 * Layer Slider
	 */

	// Layer Slider: Link
	// jQuery( '.ls-slide a' ).on( 'click', function() {
	// 	var $link = jQuery(this);
	// 	var linkType = ( $link.hasClass( 'button' ) ) ? 'Button' : 'Link';
	// 	var linkText = $link.text();

	// 	ga( 'send', 'event', 'Layer Slider', 'click', linkType + ': ' + linkText );
	// });

	/**
	 * Hero Banner
	 */

	// Layer Slider: Link
	// jQuery( '.hero-banner a' ).on( 'click', function() {
	// 	var $link = jQuery(this);
	// 	var linkType = ( $link.hasClass( 'button' ) ) ? 'Button' : 'Link';
	// 	var linkText = $link.text();

	// 	ga( 'send', 'event', 'Hero Banner', 'click', linkType + ': ' + linkText );
	// });

});

/**
 * Functionality to add Indiegogo.com tracking params to links and forms.
 *
 * @author   Eric Schell
 *
 * @since    1.0.0
 */
function GetURLParameter(sParam) {

	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');

	for (var i = 0; i < sURLVariables.length; i++) {

		var sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}

	}
}

function analyticsParams() {
	return ['r'];
}

function appendInboundAnalyticsParamsToUrls() {
	var analytics_params = analyticsParams();
	// iterate through each analytics param
	jQuery.each(analytics_params, function(index, param) {
		var param_value = GetURLParameter(param);
		if (typeof param_value !== 'undefined' && param_value !== '') {
			var params = {};
			params[param] = param_value;
			appendParamsToIndiegogoUrls(params);
			appendParamsToFormsByClass(params, 'start-your-campaign');
		}
	});

	// attempt to derive romref using utm params from hubspot
	var utm_source = GetURLParameter('utm_source');
	var utm_content = GetURLParameter('utm_content');
	if (typeof utm_source !== 'undefined' && utm_source !== '' && typeof utm_content !== 'undefined' && utm_content !== '') {
		if (utm_source.substring(0, 3) == 'hs_') {
			var params = {};
			params['r'] = 'hub' + utm_content;
			appendParamsToIndiegogoUrls(params);
			appendParamsToFormsByClass(params, 'start-your-campaign');			
		}
	}
}

function appendParamsToIndiegogoUrls(new_params) {
	// iteration through each 'a' element
	jQuery('a').each(function(index, a_object) {
		var href_value = jQuery(a_object).attr('href');
		// update indiegogo.com links only
		if ( typeof href_value !== 'undefined' && ( href_value.indexOf('indiegogo.com') >= 0 || href_value.indexOf('generosity.com') >= 0 || href_value.indexOf('wpengine.com') >= 0 || href_value.indexOf('/') === 0 ) ) {
			jQuery.each(new_params, function(key, value) {
				href_value += appendedParam(href_value, key, value);
			});
			jQuery(a_object).attr('href', href_value);
		}
	});
}

function appendParamsToFormsByClass(new_params, form_class) {
	// iteration through each 'form' element with the given class
	jQuery('form.' + form_class).each(function(index, form_object) {
		jQuery.each(new_params, function(key, value) {
			jQuery('<input>').attr({
				type: 'hidden',
				name: key,
				value: value,
			}).appendTo(form_object);
		});
	});
}

function appendedParam(url, key, value) {
	// append value if it is not blank
	if (typeof value !== 'undefined' && value !== '') {
		var prefix;
		if (url.indexOf('=') >= 0) {
			prefix = '&';
		} else {
			prefix = '?';
		}
		return prefix + key + '=' + value;
	} else {
		return '';
	}
}

function clearAnalyticsParamsFromAddressBar() {
	if (history.pushState) {
		var address_bar_url = window.location.href;

		var analytics_params = analyticsParams();
		// iterate through each analytics param
		jQuery.each(analytics_params, function(index, param) {
			var param_value = GetURLParameter(param);
			// clear value if the param has been passed (even if it's blank)
			if (typeof param_value !== 'undefined') {
				// try to replace using the & as a suffix, but
				// fallback to replacing using the ? or & as a prefix
				// (prevents being left with one param pair and a & instead of ?)
				var param_string_re_s = RegExp(param+'='+param_value+'&');
				address_bar_url = address_bar_url.replace(param_string_re_s, '');

				var param_string_re_p = RegExp('[?&]'+param+'='+param_value);
				address_bar_url = address_bar_url.replace(param_string_re_p, '');
			}
		});

		history.pushState({}, '', address_bar_url);
	}
}