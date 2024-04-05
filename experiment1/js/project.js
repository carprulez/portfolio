// project.js - Fantasy Trail Name Generator
// Author: Carter Gruebel
// Date: 4/4/24

// NOTE: This is how we might start a basic JavaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {
    adjective: ["gloomy", "daunting", "peaceful", "beautiful", "dull", "drab", "charming", "popular"],
    first: ["Hell's", "Trail of", "Angel's", "Terraced", "Smiling", "Destiny's", "Giant's", "Winding",],
    second: ["Steps", "Path", "Climb", "Road", "Walk", "Avenue", "Drag", "Stroll", "Byway", "Plateau"],
    warning: ["careful", "cautious", "afraid", "scared", "frightened", "warned", "excited", "happy", "nervous"]
  };
  
  const template = `You approach the $adjective view of the $first $second trail, be $warning!`;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();
  
}

// let's get this party started - uncomment me
main();