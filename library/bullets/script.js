Components.bullets = {

    params: {
        fadeInInterval: "",
        fadeOutInterval: "",
        bullet: document.querySelector('.bullets'), // bullet element
        bulletOpacity: 0, // Opacity value var
        timeToWait: 5000, // Time to wait before fading back out
        speed: 100, // Speed of the opacity change
        contentArr: ['Campaign Management', '100% ROI Driven', '24/7'], // Content to appear in the bullet
        contentIndex: 0 // Index which we will use to iterate over
    },

    // Self executing function to start things off
    init: function() {

        // Set the bullet opacity to 0
        this.params.bullet.style.opacity = 0;

        // Get the length of our content array
        this.params.contentArrLength = this.params.contentArr.length - 1;

        // Inject our first piece of content
        this.params.bullet.innerHTML = this.params.contentArr[this.params.contentIndex];

        // Trigger bulletCallback to be called at a timed interval
        this.params.fadeInInterval = window.setInterval(function() {
            Components.bullets.fadeInCallback();
        }, this.params.speed);
    },

    // Callback function increasing opacity over time
    fadeInCallback: function() {
        this.params.bulletOpacity += 0.1;
        this.params.bullet.style.opacity = this.params.bulletOpacity;
        if (this.params.bulletOpacity >= 1) {
            clearInterval(this.params.fadeInInterval);

            // Trigger bulletCallback to be called at a timed interval
            pause = window.setTimeout(function() {
                Components.bullets.fadeOutIntervalFunc();
            }, this.params.timeToWait);
        }
    },

    fadeOutIntervalFunc: function() {
        this.params.fadeOutInterval = window.setInterval(function() {
            Components.bullets.fadeOutCallback();
        }, this.params.speed);
    },

    // Callback function increasing opacity over time
    fadeOutCallback: function() {
        this.params.bulletOpacity -= 0.1;
        this.params.bullet.style.opacity = this.params.bulletOpacity;
        if (this.params.bulletOpacity <= 0) {
            clearInterval(this.params.fadeOutInterval);

            // Check here if we have more content to go and increment the index accordingly
            this.params.contentIndex = (this.params.contentIndex < this.params.contentArrLength) ? this.params.contentIndex + 1 : 0;

            // Now we need to initiate the switch again
            this.init();
        }
    }
};

// Start the ball rolling!
Components.bullets.init();
