jQuery(document).ready(function($) {
	// image galleries with images that link to an image pop up in a fancy box
	var galleries = $('.wp-block-gallery, .gallery');
	for (var i = 0; i < galleries.length; i++) {
		var currentGallery = galleries.eq(i);
		imgLinks = $(currentGallery).children().find('a');
		for (var l=0; l < imgLinks.length; l++) {
			var currentLink = imgLinks.eq(l);
			var currentLinkSrc = currentLink.attr('href');
			var ext = currentLinkSrc.split('.')[currentLinkSrc.split('.').length-1];
			if (ext == 'png' || ext == 'jpeg' || ext == 'jpg' || ext == 'gif' ) {
				$(currentLink).attr( 'data-fancybox', 'gallery_' + i);
			}
		}
	}
	// images in posts that link to an image pop up in a fancy box
	var contentImages = $('.wp-block-image').find('img');
	for (var i = 0; i < contentImages.length; i++) {
		var currentImg = contentImages.eq(i);
		var currentImgPar = currentImg.parent();
		if (currentImgPar.attr('href')) {
			currentImgLinkSrc = String(currentImgPar.attr('href'));
			var ext = currentImgLinkSrc.split('.')[currentImgLinkSrc.split('.').length-1];
			if (ext == 'png' || ext == 'jpeg' || ext == 'jpg' || ext == 'gif' ) {
				$(currentImgPar).attr( 'data-fancybox', 'gallery__' + i);
			}
		}
	}
	// header search
	$('#header-search-btn').on('click', function(e) {
		e.preventDefault();
		$('.header-search-container').addClass('header-search-container--open');
		$('#hd-s').focus();
	});
	$('#header-search-dismiss-btn').on('click', function(e) {
		e.preventDefault();
		$('.header-search-container').removeClass('header-search-container--open');
	});
	// header mobile nav
	$('#hd-mobile-nav-trigger').on('click', function(e) {
		e.preventDefault();
		$('.hd-mobile-nav').toggleClass('hd-mobile-nav--open');
		$('.igg-caret').toggleClass('up');
	});
	// stick the footer to the bottom
	var contentHeight = $('.site-header').outerHeight() + $('.site-main').outerHeight() + $('.site-footer').outerHeight();
  	var viewportHeight = $(window).height();
  	if (viewportHeight > contentHeight) {
		$('.site-footer').css('position','absolute').css('bottom',0).css('left','0').css('right','0');
	}
	// add a placeholder element to the sailthru signup widget
	$('.sailthru_email').attr('placeholder', 'Enter your email address')
	// share popups
	$('.social-pop').on('click', function(e) {
		var popLink = $(this).attr('href');
		var popName = $(this).attr('target');
		var popFeatures = $(this).attr('data-features');
		var windowObjectReference = null;
  		if(windowObjectReference == null || windowObjectReference.closed) {
    		windowObjectReference = window.open(popLink, popName, popFeatures);
    	} else {
    		windowObjectReference.focus();
    	}
    	return false;
	});
});