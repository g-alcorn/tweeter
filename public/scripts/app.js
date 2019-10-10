/*
* Client-side JS logic goes here
* jQuery is already loaded
* Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/
//"use strict";
//const dataHelpers = require('../server/lib/ddata-helpers.js');
$(document).ready(function() {
  const parseDate = function(age) {
    let converted = new Date(age);
    //Slices off time zone info from end of date string
    return `Posted ${converted.toString().slice(0, 21)}`;
  };

  const renderTweets = function() {
    $.ajax('/tweets', { method: 'GET' })
      .done(function(database) {
        for (let post in database) {
          let newElement = createTweetElement(database[post]);
          //createTweetElement returns array
          //0:text, 1:user, 2:handle. 3:age

          appendToContainer(newElement);
        }
      })
      .fail(function() {
        alert("Tweet loading failed!");
      })
      .always(function() {
        console.log("finished tweet loading");
    });
  };

  const createTweetElement = function(tweet) {        
    let $text = $('<p>');
    let $user = $('<p>');
    let $handle = $('<p>');
    let $age = $('<p>');
    console.log(tweet);
    //add text and class to each new tag
    $text
      .text(tweet.content.text)
      .addClass('tweet-text');
    $user
      .text(tweet.user.name)
      .addClass('user');
    $handle
      .text(tweet.user.handle)
      .addClass('handle');
    $age
      .text(parseDate(tweet.created_at))
      .addClass('date-posted');

    //return-value is consistently formatted
    return [$text, $user, $handle, $age];
  };

  const renderNewTweet = function() {
    //follows format of renderTweets, but will only render
    //most recent tweet in the database
    $.ajax('/tweets', { method: 'GET' })
      .done(function(database) {
        const newIndex = database.length - 1;
        appendToContainer(createTweetElement(database[newIndex]));
      });
  };

  const appendToContainer = function(newElement) {
    //newElement is array created by createTweetElement
    //0:text, 1:user, 2:handle. 3:age
    //put metadata in div above text box
    let $tweetMeta = $('<div class="metadata">')
    $tweetMeta
      .append(newElement[1])
      .append(newElement[2])
      .append(newElement[3]);

    //put metadata and tweet text in tweet-specific container
    let $newTweet = $('<article class="tweet">');
    $newTweet
      .prepend($tweetMeta)
      .append(newElement[0]);

    //append final product to container for ALL tweets
    $('.tweets-container').append($newTweet);
  };

  renderTweets();

  //Stops form submission from default process
  //Uses AJAX to render the new tweet
  $( '.new-tweet-submit' ).click(function( event ) {
    event.preventDefault();
    //serialize form data
    const serialized = $( '.new-tweet-text' ).serialize();
    console.log(serialized);
    $.post('./tweets', serialized);
    renderNewTweet();
    console.log("posted");
  });
});