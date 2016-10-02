var bulletObj = {
  
  params: {
    fadeInInterval: "",
    fadeOutInterval: "",
    bullet: document.querySelector( '.bullets' ), // bullet element
    bulletOpacity: 0, // Opacity value var
    timeToWait: 5000, // Time to wait before fading back out
    speed: 100, // Speed of the opacity change
    contentArr: ['Campaign Management', '100% ROI Driven', '24/7'], // Content to appear in the bullet
    contentIndex: 0 // Index which we will use to iterate over
  },
  
  // Self executing function to start things off
  initiateSwitch: function() {

    // Set the bullet opacity to 0
    bulletObj.params.bullet.style.opacity = 0;
    
    // Get the length of our content array
    bulletObj.params.contentArrLength = bulletObj.params.contentArr.length - 1;

    // Inject our first piece of content
    bulletObj.params.bullet.innerHTML = bulletObj.params.contentArr[bulletObj.params.contentIndex];

    // Trigger bulletCallback to be called at a timed interval
    bulletObj.params.fadeInInterval = window.setInterval(function() {
      bulletObj.fadeInCallback();
    }, bulletObj.params.speed);
  },

  // Callback function increasing opacity over time
  fadeInCallback: function() {
    bulletObj.params.bulletOpacity += 0.1;
    bulletObj.params.bullet.style.opacity = bulletObj.params.bulletOpacity;
    if( bulletObj.params.bulletOpacity >= 1 ) {
      clearInterval(bulletObj.params.fadeInInterval);
      
      // Trigger bulletCallback to be called at a timed interval
      pause = window.setTimeout(function() {
        bulletObj.fadeOutIntervalFunc();
      }, bulletObj.params.timeToWait);
    }
  },

  fadeOutIntervalFunc: function() {
    bulletObj.params.fadeOutInterval = window.setInterval(function() {
      bulletObj.fadeOutCallback();
    }, bulletObj.params.speed);
  },

  // Callback function increasing opacity over time
  fadeOutCallback: function() {
    bulletObj.params.bulletOpacity -= 0.1;
    bulletObj.params.bullet.style.opacity = bulletObj.params.bulletOpacity;
    if( bulletObj.params.bulletOpacity <= 0 ) {
      clearInterval(bulletObj.params.fadeOutInterval);

      // Check here if we have more content to go and increment the index accordingly
      bulletObj.params.contentIndex = (bulletObj.params.contentIndex < bulletObj.params.contentArrLength) ? bulletObj.params.contentIndex + 1 : 0;

      // Now we need to initiate the switch again
      bulletObj.initiateSwitch();
    }
  }
};

// Start the ball rolling!
bulletObj.initiateSwitch();
