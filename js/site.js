// make sure document is ready
$(document).ready(function() {
  console.log("Document ready.")

  // Functions

  function main() {
    console.log("Main function started.");
    // the code that makes everything happen

    // Put the canvas in fullscreen mode
    $('#fullscreen').click(function() {
      console.log("Going fullscreen.")
      let fs = fullscreen();
      fullscreen(!fs);
    });

    // Listen for fullscreen change events
    $(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function() {
      if (!fullscreen()) {
        // User has exited fullscreen mode
        $('body').removeClass('is-fullscreen');
      } else {
        // User has entered fullscreen mode
        $('body').addClass('is-fullscreen');
      }
    });
  }


  // let's get this party started
  main();

})
