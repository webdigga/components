define(['library/form-elements/form'], function( form ) {
	describe('Form elements', function() {
		var fixture,
			rangeValue;

		beforeEach(function() {

			// Create our HTML fixture
			fixture = '<div class="range"><input type="range" value="200" max="500" class="range__input js-range" /><div class="range__value js-range__value"></div></div>';
			
			// Add it into the DOM
			document.body.insertAdjacentHTML( 'afterbegin', fixture );
		});

		it('Should update the HTML with new value', function() {

			// Set the valiue of the input field to be a value
			document.querySelector( '.js-range' ).value = 10;

			// Run the range method
			form.range();

			// Check that the HTML has been updated
			expect(document.querySelector( '.js-range__value' ).innerHTML).toEqual('10');
		});
	});
});
