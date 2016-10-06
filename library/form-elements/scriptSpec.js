describe('Form elements', function() {
    var Form = require(['script'], 'script'),
        range;

    beforeEach(function() {
        //range = new Form();
        rangeValue = 10;
    });

    if('Should update the HTML with new value', function() {
        Components.form.range();
        expect(rangeValue.innerHTML).toEqual(10);
    });
});
