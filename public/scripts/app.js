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
    let $avatar = $(`<img class="tweet-icon" src="${tweet.user.avatars}">`);
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
    return [$text, $user, $handle, $age, $avatar];
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
    //0:text, 1:user, 2:handle. 3:age, 4: avatar
    //put metadata in div above text box
    let $tweetMeta = $('<div class="metadata">');
    $tweetMeta
      .append(newElement[4])
      .append(newElement[1])
      .append(newElement[2])
      .append(newElement[3]);

    let $tweetFoot = $('<div class="tweet-footer">')
    let $likeButton = $('<img class="like-button" src="/images/heart-icon.png">');
    let $retweetButton = $('<img class="retweet-button" src="/images/retweet-icon.png">');
    let $flagButton = $('<img class="flag-button" src="/images/flag-icon.png">');
    $tweetFoot
      .append($likeButton)
      .append($retweetButton)
      .append($flagButton);

    //put metadata and tweet text in tweet-specific container
    let $newTweet = $('<article class="tweet">');
    $newTweet
      .prepend($tweetMeta)
      .append(newElement[0])
      .append($tweetFoot);

    //append final product to container for ALL tweets
    $('.tweets-container').append($newTweet);
  };

  const verifyMessage = function(serialized) {
    const length = serialized.length;
    //serialized always begins with 'true=' (5chars)
    //gives a numeric code response to differentiate empty and too-long tweets
    if (length === 5) {
      return 1;
    } else if (length > 5 && length <= 145) {
      return 0;
    } else if (length > 145) {
      return 2;
    }
  }

  //load page
  renderTweets();
  $( '#new-tweet' ).hide();

  //make navbar sticky
  $( window ).scroll(function() {
    const sticky = $( '.sticky' );
    const scroll = $( window ).scrollTop();

    if (scroll >= 100) {
      sticky.addClass('fixed');
    } else {
      sticky.removeClass('fixed');
    }
  });

  //site title is button to reload page
  $( '.siteTitle' ).click(function( event ) {
    event.preventDefault();
    location.reload();
  });

  //show tweet composer
  $( '.compose-tweet-button' ).click(function( event ) {
    event.preventDefault();
    const newTweet = $( '#new-tweet' );
    newTweet.slideToggle(1000);
  });

  //Stops form submission from default process
  //Uses AJAX to render the new tweet
  $( '.new-tweet-submit' ).click(function( event ) {
    event.preventDefault();
    //serialize form data & verify length
    const serialized = $( '.new-tweet-text' ).serialize();
    const verify = verifyMessage(serialized);
    
    //post tweet or alert depending on verification value
    if (verify === 0) {
      //AJAX posting form data to database
      $.post('./tweets', serialized)
        .success(function() {
          renderNewTweet();        
        });

      //reset form submission
      $( '.composer' ).each(function() {
        this.reset();
      });
      $( '.counter' ).text('140');
      console.log("posted");      
    } else if (verify === 1) {
      alert('cannot post empty tweet!');
    } else if (verify === 2) {

      alert('cannot post tweet over 140 characters!');
    }

  });
});