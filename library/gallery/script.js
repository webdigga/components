(function( $ ) {
	'use strict';

	$.fn.slider = function( options ) {

		// Set default options
		var settings = $.extend({
			smallBreak: 568,
			largeBreak: 768,
			smallItemsCount: 3,
			mediumItemsCount: 5,
			largeItemsCount: 9
		}, options );

		// Set dynamic vars here that need to be available to all methods
		var thumbWidth,
			thumbListItem = $( '[data-hook="thumbs__list-item"]' ),
			numberOfItemsToDisplay,
			sliderWidth,
			sliderImg = $( '[data-hook="slider__img"]' ),
			thumbListItemSelected = 0,
			thumbPosition = 1;

		var methods = {

			// Set static vars that need to be available to all methods
			slider: $( '[data-hook="slider"]' ),
			thumbCount: thumbListItem.length,
			sliderThumbs: $( '[data-hook="slider__thumbs"]' ),
			mainImage: $( '[data-hook="slider__main"]' ),
			mainImageLink: $( '.slider__link--image' ),
			sliderNavigationMain: '.slider__navigation--main',
			sliderNavigationThumb: '.slider__navigation--thumb',

			// initialise the methods
			init: function() {				

				// Add navigation buttons to main image
				this.addNavigation();

				// Add the navigation buttons to the thumbnails
				this.addThumbNavigation();

				// When the user clicks on any of the thumbs
				this.thumbClick();

				// When the user clicks on the navigation for the thumbs
				this.thumbnailNavClick();

				// When the user clicks the main navigation buttons
				this.mainNavClick();				

				// Add the counter of the images to the page
				this.counter.addCounter();

				// When a user clicks on the main image
				this.mainImageClick();

				// Check the width of viewport and set thumb widths accordingly
				this.checkWidth();

				// listen for change of window size and reset configurations as above
				window.addEventListener('resize', function() {
					methods.checkWidth();
				});
			},

			// When a user clicks on a thumbnail,
			// we need to grab the source from a data attribute and then replace the source on the main image
			// and then update the selected class
			// Also make sure anchor tag doesn't use default behaviour
			thumbClick: function() {
				var thumbListAnchor = '[data-hook="thumbs__list-item-anchor"]';
				$( document ).on('click', thumbListAnchor, function() {
					thumbListItem.removeClass( 'selected' );
					var $this = $( this ),
						largeSrc = $this.prop( 'href' ),
						srcSet = $this.find( 'img' ).data( 'srcset' ),
						altText = $this.find( 'img' ).attr( 'alt' );
					methods.replaceSource( largeSrc, srcSet, altText );
					$( this ).parents( '[data-hook="thumbs__list-item"]' ).addClass( 'selected' );
					methods.counter.updateCounter( ( $( '[data-hook="thumbs__list-item"].selected' ).index() + 1 ) );

					// Have we clicked on the last one? Or the first one?
					// Activate the left navigation item if we are last
					// Activate the right navigation if we are first
					// Activate both if we are neither first of last
					if( $( '[data-hook="thumbs__list-item"].selected' ).index() + 1 === methods.thumbCount ) {
						$( methods.sliderNavigationMain + '.right' ).prop( 'disabled', true );
						$( methods.sliderNavigationMain + '.left' ).prop( 'disabled', false );
					} else if ( $( '[data-hook="thumbs__list-item"].selected' ).index() === 0 ) {
						$( methods.sliderNavigationMain + '.left' ).prop( 'disabled', true );
						$( methods.sliderNavigationMain + '.right' ).prop( 'disabled', false );
					} else {
						$( methods.sliderNavigationMain ).prop( 'disabled', false );
					}
				});
				$( '[data-hook="thumbs__list-item-anchor"]' ).click(function( e ) {
					e.preventDefault();
				});
			},

			// When a user clicks on a thumbmnail navigation button,
			// we would expect the slider to move in the required direction by the amount of the width of the thumbnail item
			thumbnailNavClick: function() {

				var animateValue,
					numberOfItemsToRight = 0,
					numberOfItemsToLeft = 0;

				$( document ).on('click', methods.sliderNavigationThumb, function() {

					// Check to see if we are not already animating.
					// If not then work out direction, whether or not the item we are animating to is in view or not,
					// if there are less than the number of items to display left in the next set then animate to that value,
					// otherwise animate a full set
					if( !methods.sliderThumbs.is( ':animated' ) ) {
						var direction = $( this ).data( 'direction' );
						if ( direction === 'right' ) {

							numberOfItemsToRight = ( ( methods.thumbCount - thumbPosition ) - numberOfItemsToDisplay );

							// If the number of thumbs left to the right is more than or equal the number of items to display then we need to animate a full set
							// Update the thumb position to be increased by the number of items to display
							if( numberOfItemsToRight >= numberOfItemsToDisplay ) {
								animateValue = '+=' + Math.abs( ( thumbWidth * numberOfItemsToDisplay ) );
								thumbPosition = thumbPosition + numberOfItemsToDisplay;

								// We have animated a full set, lets make sure the left nav is still disabled
								$( methods.sliderNavigationThumb + '.left' ).prop( 'disabled', false );

							// Otherwise we need to animate to a specific point.
							// Update the thumb position to be the total number of thumbs minus the number if items to display
							} else {
								animateValue = '+=' + Math.abs( ( methods.thumbCount - ( ( thumbPosition - 1 ) + numberOfItemsToDisplay )  ) * thumbWidth );
								thumbPosition = methods.thumbCount - ( numberOfItemsToDisplay - 1 );

								// We must have animated to the end, lets disable the right nav
								$( methods.sliderNavigationThumb + '.right' ).prop( 'disabled', true );
							}

							// We always want to disable the left nav
							$( methods.sliderNavigationThumb + '.left' ).prop( 'disabled', false );
						} else {

							numberOfItemsToLeft = thumbPosition;

							// If the number of thumbs left to the right is more than or equal the number of items to display then we need to animate a full set
							// Update the thumb position to be increased by the number of items to display
							if( numberOfItemsToLeft > ( numberOfItemsToDisplay + 1 ) ) {
								animateValue = '-=' + Math.abs( ( thumbWidth * numberOfItemsToDisplay ) );
								thumbPosition = thumbPosition - numberOfItemsToDisplay;

								// We have animated a full set, lets make sure the right nav is still disabled
								$( methods.sliderNavigationThumb + '.right' ).prop( 'disabled', false );

							// Otherwise we need to animate to a specific point.
							// Update the thumb position to be the total number of thumbs minus the number if items to display
							} else {
								animateValue = 0;
								thumbPosition = 1;

								// We must have animated to the end, lets disable the left nav
								$( methods.sliderNavigationThumb + '.left' ).prop( 'disabled', true );
							}

							// We always want to disable the right nav
							$( methods.sliderNavigationThumb + '.right' ).prop( 'disabled', false );
						}

						// Lets perform the animation
						methods.sliderThumbs.animate({
							right: animateValue
						});
					}
				});
			},

			// When a user clicks on the main navigation buttons,
			// we would expect that the image changes to next/prev image
			// and that the thumbnail that is selected updates
			// The amount at which the thumbs animates varies depending on how many items are left out of view, either before or after
			mainNavClick: function() {
				$( document ).on('click', methods.sliderNavigationMain, function() {
					if( !methods.sliderThumbs.is( ':animated' ) ) {
						var dataDirection = $( this ).data( 'direction' ),
							largeSrc,
							srcSet,
							altText,
							animateValue,
							selectedItemPosition,
							buttonPosition;

						// Get selected item
						thumbListItemSelected = $( '[data-hook="thumbs__list-item"].selected' ).index();

						// Remove selected class from thumbs
						thumbListItem.removeClass( 'selected' );

						// Set vars here based on if user has clicked prev or next
						var direction = dataDirection === 'right' ? 'right' : 'left',
							directionOpposite = dataDirection === 'right' ? 'left' : 'right',
							directionPosNeg = dataDirection === 'right' ? '+' : '-',
							nextThumb = dataDirection === 'right' ? thumbListItemSelected + 1 : thumbListItemSelected - 1,
							firstOrLastItem = dataDirection === 'right' ? methods.thumbCount - 2 : 1;

						// Add the selected class to the next thumb
						thumbListItem.eq( nextThumb ).addClass( 'selected' );

						var numberOfItemsBeforeAfterSelected = dataDirection === 'right' ? $( '[data-hook="thumbs__list-item"].selected' ).nextAll().length : $( '[data-hook="thumbs__list-item"].selected' ).prevAll().length;

						// Get the position of the button thumb and work out where our selected thumb is
						buttonPosition = $( '.slider__navigation--thumb.' + direction ).offset();
						buttonPosition = buttonPosition.left - $( window ).scrollLeft();
						selectedItemPosition = $( '.thumbs__list-item.selected' ).offset();
						selectedItemPosition = selectedItemPosition.left - $( window ).scrollLeft();

						// Work out if the selected item is in view
						var isSelectedItemInView = dataDirection === 'right' ? ( Math.ceil( selectedItemPosition ) > buttonPosition ) && buttonPosition !== 0 : buttonPosition > Math.ceil( selectedItemPosition );

						// Get meta data and run the replace source
						largeSrc = $( '[data-hook="thumbs__list-item"].selected' ).find( 'a' ).prop( 'href' );
						srcSet = $( '[data-hook="thumbs__list-item"].selected' ).find( 'img' ).data( 'srcset' );
						altText = $( '[data-hook="thumbs__list-item"].selected' ).find( 'img' ).attr( 'alt' );
						methods.replaceSource( largeSrc, srcSet, altText );

						if( isSelectedItemInView ) {
							if( numberOfItemsBeforeAfterSelected >= numberOfItemsToDisplay ) {
								animateValue = dataDirection === 'right' ? ( thumbListItemSelected + 1 ) * thumbWidth : ( thumbListItemSelected - numberOfItemsToDisplay ) * thumbWidth;
							} else {
								animateValue = directionPosNeg + '=' + ( ( numberOfItemsBeforeAfterSelected + 1 ) * thumbWidth );
								$( methods.sliderNavigationThumb + '.' + direction ).prop( 'disabled', true );
							}
							$( methods.sliderNavigationThumb + '.' + directionOpposite ).prop( 'disabled', false );

							// Animate the thumb slider
							methods.sliderThumbs.animate({
								right: animateValue + 'px'
							}, function(){
								if ( direction === 'right' ) {
									thumbPosition = thumbPosition + numberOfItemsToDisplay;
								} else {
									thumbPosition = thumbPosition - numberOfItemsToDisplay;
								}
							});
						}
						$( methods.sliderNavigationMain + '.' + directionOpposite ).prop( 'disabled', false );
						if( thumbListItemSelected === firstOrLastItem ) {
							$( methods.sliderNavigationMain + '.' + direction ).prop( 'disabled', true );
						}
					}
					methods.counter.updateCounter( ( $( '[data-hook="thumbs__list-item"].selected' ).index() + 1 ) );
				});
			},

			// Alter the img properties
			replaceSource: function( largeSrc, srcSet, altText ) {
				sliderImg.attr({
					'src': largeSrc,
					'srcset': srcSet,
					'alt': altText
				});

				// If image at the src link show the placeholder image
				sliderImg.error(function(){
				    sliderImg.attr('src', 'http://www.crystalski.co.uk/static/img/global/no-image-available-large.png');
				});
			},

			// Ran on page load and on window resize,
			// Checks what thumbnail items are in view and makes changes based on value
			checkWidth: function() {
				sliderWidth = methods.slider.width();

				// Check to see if the width is 0
				// This might mean that it is inside a hidden accordian so check for this also
				if( ( sliderWidth === 0 ) && ( methods.slider.parents( '.content' ).length === 1 ) ) {
					$( '#overview' ).css( 'display', 'block' );
					sliderWidth = methods.slider.width();
					$( '#overview' ).css( 'display', 'none' );
				}

				if ( sliderWidth <= settings.smallBreak ) {
					numberOfItemsToDisplay = settings.smallItemsCount;
				}
				if ( sliderWidth > settings.smallBreak && sliderWidth < settings.largeBreak ) {
					numberOfItemsToDisplay = settings.mediumItemsCount;
				}
				if ( sliderWidth > settings.largeBreak ) {
					numberOfItemsToDisplay = settings.largeItemsCount;
				}
				if( methods.thumbCount <= numberOfItemsToDisplay ) {
					$( '.slider__navigation--thumb.right' ).prop( 'disabled', true );
				} else {
					$( '.slider__navigation--thumb.right' ).prop( 'disabled', false );
				}
				thumbWidth = sliderWidth / numberOfItemsToDisplay;

				// If the orientation is changed, we need to snap the slider nav back to starting point,
				// Set the thumb position back to start,
				// Reset the width of each thumb,
				// Disable the left nav
				thumbPosition = 1;
				methods.sliderThumbs.css( 'width', Math.ceil( thumbWidth * methods.thumbCount ) ).css( 'right', ( 0 ) );
				thumbListItem.css( 'width', thumbWidth );
				$( '.slider__navigation--thumb.left' ).prop( 'disabled', true );

				// Only disable the right nav if the total thumbs are more than the number of items to display
				if( methods.thumbCount > numberOfItemsToDisplay ) {
					$( '.slider__navigation--thumb.right' ).prop( 'disabled', false );
				}
			},

			// Add the navigation buttons to the main image
			// We only want to display thumbs and navigation if we have more than one item
			addNavigation: function() {
				if ( methods.thumbCount > 1 ) {
					$( '<button />', {
						class: 'slider__navigation--main left',
						'data-direction': 'left',
						'disabled': true
					}).appendTo( methods.mainImage );
					$( '<button />', {
						class: 'slider__navigation--main right',
						'data-direction': 'right'
					}).appendTo( methods.mainImage );
				}
			},

			// Add the thumbnail navigation buttons to the slider
			addThumbNavigation: function() {
				thumbListItem.eq( 0 ).addClass( 'selected' );
				var sliderNav = $( '[data-hook="slider__nav"]' );
				$( '<button />', {
					class: 'slider__navigation--thumb left',
					'data-direction': 'left',
					'disabled': true
				}).appendTo( sliderNav );
				$( '<button />', {
					class: 'slider__navigation--thumb right',
					'data-direction': 'right'
				}).appendTo( sliderNav );
			},

			// Counter
			counter: {
				addCounter: function() {
					$( '<div />', {
						class: 'slider__counter',
						html: '<span class="slider__counter-number" data-hook="slider__counter-number">1</span> of ' + methods.thumbCount
					}).appendTo( methods.mainImage );
				},
				updateCounter: function( selectedSlideNumber ) {
					$( '[data-hook="slider__counter-number"]' ).text( selectedSlideNumber);
				}
			},

			// When a user clicks on the main image
			mainImageClick: function() {
				$( '.slider__link' ).click(function( e ) {
					e.preventDefault();
				});
			}
		};

		// Load in all methods etc we need on page load.
		methods.init();
	};
}( jQuery ));