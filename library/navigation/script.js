// This function adds a class to the main nav when the menu is clicked,
// so we can animate in CSS
function naviconClick() {
	var menu = document.querySelector('.main-nav') // Using a class instead, see note below.
	menu.classList.toggle('main-nav--open');
}