/*
* Client-side JS logic goes here
* jQuery is already loaded
* Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/
//"use strict";
//const dataHelpers = require('../server/lib/ddata-helpers.js');

$(document).ready(function() {

});

const parseDate = function(age) {
  let converted = new Date(age);
  //Slices off time zone info from end of date string
  return `Posted ${converted.toString().slice(0, 21)}`;
};

const createTweetElement = function() {
  $.get('/tweets')
    .done(function(database) {
      for (let tweet in database) {
        let $text = $('<p>');
        let $user = $('<p>');
        let $handle = $('<p>');
        let $age = $('<p>');

        //add text and class to each new tag
        $text
          .text(database[tweet].content.text)
          .addClass('tweet-text');
        $user
          .text(database[tweet].user.name)
          .addClass('user');
        $handle
          .text(database[tweet].user.handle)
          .addClass('handle');
        $age
          .text(parseDate(database[tweet].created_at))
          .addClass('date-posted');
        
        //put metadata in div above text box
        let $tweetMeta = $('<div class="metadata">')
        $tweetMeta
          .append($user)
          .append($handle)
          .append($age);

        //put metadata and tweet text in tweet-specific container
        let $tweet = $('<article class="tweet">');
        $tweet
          .prepend($tweetMeta)
          .append($text);

        //append final product to container for ALL tweets
        $('.tweets-container').append($tweet);
      }
    })
    .fail(function() {
      alert("Tweet loading failed!");
    })
    .always(function() {
      console.log("finished tweet loading");
  });
}