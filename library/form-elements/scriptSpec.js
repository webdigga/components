define(['library/form-elements/form'], function( form ) {
	describe('Form elements', function() {
		var fixture,
			rangeValue;

		beforeEach(function() {
			fixture = '<div class="range"><input type="range" value="200" max="500" class="range__input js-range" /><div class="range__value js-range__value"></div></div>';
			document.body.insertAdjacentHTML( 'afterbegin', fixture );
		});

		it('Should update the HTML with new value', function() {
			document.querySelector( '.js-range' ).value = 10;
			form.range();
			expect(document.querySelector( '.js-range__value' ).innerHTML).toEqual('10');
		});
	});
});
