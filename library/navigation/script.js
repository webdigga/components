Components.navigation = {

	// Adding event listener for when the navicon is clicked
	navicon: function() {
		var navicon = document.querySelector( '.js-main-nav__navicon' ),
			menu = document.querySelector( '.main-nav' );

		navicon.addEventListener('click', function() {
			menu.classList.toggle( 'main-nav--open' );
		}, false);
	},
	init: function() {
		this.navicon();
	}
};

Components.navigation.init();