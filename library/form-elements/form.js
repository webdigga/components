define([], function() {
	
	var form = {

		// Adding event listener for when the ranage is clicked
		range: function() {
			var range = document.querySelector( '.js-range' ),
				rangeValue = document.querySelector( '.js-range__value' );

			// Set the value on page load
			rangeValue.innerHTML = range.value;

			// Add the listener for change event
			range.addEventListener('input', function() {
				rangeValue.innerHTML = this.value;
			});
		},

		// Get the ball rolling
		init: function() {
			this.range();
		}
	};

	return form;
});
