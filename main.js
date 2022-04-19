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


  // Get the data about the projects from a json file.
  $.ajax({
    dataType: "json",
    url: "https://res.cloudinary.com/de9fgkkam/raw/upload/v1650288805/personal_portafolio/projects_data_hdiuhg.json",
    data: {},
    success: function(result, status, xhr) {
      console.log("Success, we got the data about the projects.");
      console.table(result.data[6]);

      // Create a <a></a> element with a link to the current project
      var $project_element_link = $('<a>', {href: result.data[6].link_to_project,
                                            target: "_blank",
                                            class: "project"});

      // create the <div> element that goes inside the <a> element.
      var $portafolio_block_element = $('<div>', {class: "portfolio-block"});
      $project_element_link.append($portafolio_block_element);

      // create the <img> element, the image for the project.
      var $project_image_element = $('<img>', {class: "project-image",
                                               src: result.data[6].image_src,
                                               alt: "project"});
     // Add the image to the <div class='portafolio-block'> element.
     $portafolio_block_element.append($project_image_element);

     // Create the <div class='caption'> element
     var $caption_element = $('<div>', {class: "caption"});
     $portafolio_block_element.append($caption_element);

     // Create the external link icon.
     var $external_link_icon = $('<p class="search-icon"><i class="fa fa-external-link-square-alt"></i></p><h4>Go to Project</h4>');
     $caption_element.append($external_link_icon);

     // Create the project description element <p class="project-description">.
     var $project_description = $('<p>', {class: "project-description", text: result.data[6].project_description});
     $caption_element.append($project_description);

     // Create the <p class="project-title"> for the project title
     var $project_title_element = $('<p>', {class: "project-title"});
     $project_title_element.append('<span class="code">&#91;</span>');
     $project_title_element.append(result.data[6].project_title);
     $project_title_element.append('<span class="code">&#93;</span>');
     // Append to the project link
     $project_element_link.append($project_title_element);

      console.log($project_element_link);

      $('.projects-grid').append($project_element_link);


    },
    error: function(xhr, status, error) {
      console.log("Couldn't get data about the projects.");
      console.log(error);
    }
  });


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
