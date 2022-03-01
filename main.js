// Set the current year in the footer section
function setCurrentYearInFooter() {
  // Get the current year
  const CURRENT_YEAR = new Date().getFullYear();

  // get the <span id="current-year"> element
  let current_year_span = document.getElementById("current-year");

  // set the current year in the <span id="current-year"> element
  current_year_span.innerText = CURRENT_YEAR
} // setCurrentYearInFooter END


$(window).scroll(function() {
  if ($(this).scrollTop() > 100) {
      $('#navbar')
        .addClass('navbar-scrolled');
  }
  else {
    $('#navbar')
      .removeClass(
        'navbar-scrolled');
    }
});

// Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav');

  $(window).on('scroll', function() {
    var cur_pos = $(this).scrollTop() + 200;

    nav_sections.each(function() {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
      if (cur_pos < 300) {
        $(".nav ul:first li:first").addClass('active');
      }
    });
  });

setCurrentYearInFooter();
