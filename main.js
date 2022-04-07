// Set to the current year in the footer section
function setCurrentYearInFooter() {
  // Get the current year
  const CURRENT_YEAR = new Date().getFullYear();

  // get the <span id="current-year"> element
  let current_year_span = document.getElementById("current-year");

  // set the current year in the <span id="current-year"> element
  current_year_span.innerText = CURRENT_YEAR
} // setCurrentYearInFooter END


// Listen for "DOMContentLoaded" event.
// Check if the document is ready and run some code,
// event is fired when the initial HTML document has
// been fully loaded and parsed, without waiting for
// stylesheets, images, and subframes to finish loading.
document.addEventListener('DOMContentLoaded', (e) => {
  console.log(`Hi! Welcome to my website.`);

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav');


  $(window).on('scroll', function() {

    if ($(this).scrollTop() > 100) {
      $('#navbar').addClass('navbar-scrolled');
    }
    else {
      $('#navbar').removeClass('navbar-scrolled');
    }

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
    }); // nav_sections.each END

  }); // $(window).on('scroll', ...) END

  // Set to the current year in the footer section of the website
  setCurrentYearInFooter();

}); // DOMContentLoaded END
