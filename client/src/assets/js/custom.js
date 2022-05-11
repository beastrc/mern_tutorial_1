$(document).ready(function () {
    updateContainer();
    $(window).resize(function() {
        updateContainer();
    });
});

function updateContainer(){

	// append padding to body as per footer height
	var $footerHeight = $('footer').outerHeight();
	if($('.large-footer:visible').length === 0) {
		$('body').css({'padding-bottom': $footerHeight + "px"});
	} else {
		$('body').css({'padding-bottom': 0});
	}

	$(".select-simple").select2({
		theme: "bootstrap",
		minimumResultsForSearch: Infinity,
	});

	$('.titleHidden').removeAttr('title'); // for preventing tooltip

}// updateContainer


function updateScroll(){
	var element = document.getElementByClass("Select-multi-value-wrapper");
	element.scrollTop = element.scrollHeight;
}

