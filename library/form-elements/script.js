dcbObj = {

	// Adding event listener for when the ranage is clicked
	range: function() {
		var range = document.querySelector( '.js-range' ),
			rangeValue = document.querySelector( '.js-range__value' );

		// Set the value on page load
		rangeValue.innerHTML = range.value;

		// Add the listener for change event
		range.addEventListener('change', function() {
			rangeValue.innerHTML = this.value;
		});
	},
	init: function() {
		this.range();
	}
};

dcbObj.init();