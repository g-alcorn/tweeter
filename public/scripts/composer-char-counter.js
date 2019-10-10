$(document).ready(function() {
  // --- our code goes here ---
  $( ".new-tweet-text" ).on("keyup", function() {
    let charCount = 140;
    charCount -= this.value.length;
    let counter = this.nextElementSibling.nextElementSibling;
    counter.innerText = (charCount);

    if (charCount < 0) {
      $(counter).css("color", "red");
    } else if (charCount >= 0) {
      $(counter).css("color", "#545149");
    }

  });

});
