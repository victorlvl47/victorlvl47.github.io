// change the color of the navbar when the user scrolls down the website
function whenScrolledDownChangeNavbarColor() {
  if ($(this).scrollTop() > 100) {
    $('#navbar').addClass('navbar-scrolled');
  }
  else {
    $('#navbar').removeClass('navbar-scrolled');
  }
} // END whenScrolledDownChangeNavbarColor




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

} // END highlightCurrentSectionInNavbar




// Set to the current year in the footer section
function setCurrentYearInFooter() {
  // Get the current year
  const CURRENT_YEAR = new Date().getFullYear();

  // get the <span id="current-year"> element
  let current_year_span = document.getElementById("current-year");

  // set the current year in the <span id="current-year"> element
  current_year_span.innerText = CURRENT_YEAR
} // setCurrentYearInFooter END




// Create the project item and add it to the website
// projectData: an object with the data of the current project
function createProjectTile(projectData) {

  // Create a <a></a> element with a link to the current project
  var $project_element_link = $('<a>', {href: projectData.link_to_project,
                                        target: "_blank",
                                        class: "project project-tile"});

  // create the <div> element that goes inside the <a> element.
  var $portafolio_block_element = $('<div>', {class: "portfolio-block"});
  $project_element_link.append($portafolio_block_element);

  // create the <img> element, the image for the project.
  var $project_image_element = $('<img>', {class: "project-image",
                                           src: projectData.image_src,
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
  var $project_description = $('<p>', {class: "project-description",
                                       text: projectData.project_description});
  $caption_element.append($project_description);

  // Create the <p class="project-title"> for the project title
  var $project_title_element = $('<p>', {class: "project-title"});
  $project_title_element.append('<span class="code">&#91;</span>');
  $project_title_element.append(projectData.project_title);
  $project_title_element.append('<span class="code">&#93;</span>');
  // Append to the project link
  $project_element_link.append($project_title_element);

  // console.log($project_element_link);

  // Append the project-tile to the projects-grid container
  $('.projects-grid').append($project_element_link);
} // END createProjectItem




// Create the project tiles
// projectsArrayInfo: an array, a list of objects with the information about the projects.
// indexStart: an integer, from what index we start counting from.
// indexEnd: an integer, the index where we are going to stop at.
function createProjectTiles(projectsArrayInfo, indexStart, indexEnd) {

  for (var i = indexStart; i <= indexEnd; i++) {
    createProjectTile(projectsArrayInfo[i]);
  }
}




// Create the "Load More" button, to display more project items
// when clicked.
function createTheLoadMoreButton() {
  // Call the btnloadmore plugin on the .projects-grid container
  // to create the "Load More" button in the site.
  $('.projects-grid').btnLoadmore({
    // How many project items to display on the start.
    showItem : 6,
    // How many project items to show when clicked.
    whenClickBtn : 3,
    // The text for the load more items button.
    textBtn : 'Load More',
    // Apply aditional CSS classes to the load more button.
    classBtn : 'btn btn-show-all'
  });
} // END createTheLoadMoreButton




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
      // console.table(result.data[6]);

      // Create all the project tiles from the json file
      var indexStart = 9;
      var indexEnd = result.data.length - 1;
      createProjectTiles(result.data, indexStart, indexEnd);

      // Create the "Load More" button, to display more project items
      // when clicked.
      createTheLoadMoreButton();

    },
    error: function(xhr, status, error) {
      console.log("Couldn't get data about the projects.");
      console.log(error);
    }
  }); // END Request to the projects data JSON file


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
