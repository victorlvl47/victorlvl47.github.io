// change the color of the navbar when the user scrolls down the website
function whenScrolledDownChangeNavbarColor() {
  if ($(this).scrollTop() > 100) {
    $('#navbar').addClass('navbar-scrolled');
  }
  else {
    $('#navbar').removeClass('navbar-scrolled');
  }
}

// highligt the current navbar item, depending of the
// section the user is currently on.
function highlightCurrentSectionInNavbar(nav_sections, main_nav) {

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
  }); // nav_sections.each END

}

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

  // For Navigation active state on scroll
  // Select the website sections
  var nav_sections = $('section');
  // Select the navbar
  var main_nav = $('.nav');


  // Handle click on "Load more" button
  //$('#btn-load-more').on('click', function(){
      // Load more data
      //console.log("Load More button clicked!");
   //});

   $('.projects-grid').btnLoadmore({

                showItem : 6,

                whenClickBtn : 3,

                textBtn : 'Load More',

                classBtn : 'btn btn-show-all'

            });


  // When the user scrolls the website
  $(window).on('scroll', function() {

    // change the color of the navbar when the website is being scrolled down
    whenScrolledDownChangeNavbarColor();

    // highligt the current navbar item, depending of the
    // section the user is currently on.
    highlightCurrentSectionInNavbar(nav_sections, main_nav);

  }); // $(window).on('scroll', ...) END

  // Set to the current year in the footer section of the website
  setCurrentYearInFooter();

}); // DOMContentLoaded END
