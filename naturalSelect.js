(function($) {
	$.fn.naturalSelect = function(options) {

		var defaults = {
			dynamicWidth: true,
			dynamicOptions: true,
			color: 'rgba(255, 150, 150, 1.0)',
			hoverColor: 'rgba(255, 200, 200, 1.0)',
			mouseDownColor: 'rgba(255, 200, 200, 1.0)',
			selectedColor: 'rgba(255, 255, 255, 1.0)',
			padding: '0px 5px',
			inline: true,
			arrows: false,
			border: 'none',
			type: 'radio' //radio, checkbox
		}

		var settings = $.extend( {}, defaults, options)

		return this.each(function() {

			var thisID = $(this).attr('id');

			var select = '';

			//CREATE MARKUP
			if (settings.type == 'radio') {
				select += '<input type="hidden" id="inp_' + thisID + '" />'
			}
			else if (settings.type == 'checkbox') {
				for (var i = 0; i < $(this).children().length; i++) {
					select += '<input type="hidden" id="inp_' + thisID + i + '" />'
				}
			}
			select += '<div id="' + thisID + 'Selected">' + $(this).children().eq(0).html() + '</div>'

			select += '<div id="' + thisID + 'Options" class="optionsWrapper">'

			for (var i = 0; i < $(this).children().length; i++) {
				select += '<div class="naturalOption_' + thisID + '" data-num="' + i + '"'

				if ($(this).children().eq(i).attr('value')) {
					select += ' value="' + $(this).children().eq(i).attr('value') + '"'
				}

				select +='><span>' + $(this).children().eq(i).html() + '</span></div>'
			}

			select += '</div>'

			$(this).html(select)

			//STYLE MARKUP
			$(this).css({
				'display': 'inline-block',
				'vertical-align': 'top',
				'position': 'relative'
			})

			$('#' + thisID + 'Selected').css({
				'height': 'auto',
				'background': settings.color,
				'padding': settings.padding,
				'border': settings.border
			})

			$('#' + thisID + 'Options').css({
				'display': 'none',
				'top': '0px',
				'position': 'absolute',
				'white-space': 'nowrap'
			})
			$('.naturalOption_' + thisID).css({
				'padding': settings.padding,
				'background': settings.color
			})
			if (!settings.dynamicOptions) {
				$('#' + thisID + 'Options').css({
					'top': $('#' + thisID + 'Selected').height() + parseInt($('#' + thisID + 'Selected').css('padding-top').replace('px', '')) + parseInt($('#' + thisID + 'Selected').css('padding-bottom').replace('px', ''))
				})
			}
			if (settings.border != 'none') {
				$(this).css({
					'top': 0 - parseInt($('#' + thisID + 'Selected').css('border-width').replace('px', ''))
				})
			}
			/*if (settings.arrows) {
				var padHolder = parseInt($('#' + thisID + 'Selected').css('padding-right').replace('px', '')) + 18
				$('#' + thisID + 'Selected').css({
					'background': 'url(\'criteria_down_arrow.png\') no-repeat right center ' + settings.color//,
					//'padding-right': padHolder + 'px'
				})
				$('.naturalOption_' + thisID).css({
					'padding-right': padHolder + 'px'
				})
			}*/
			var css = '#' + thisID + 'Selected:hover, #' + thisID + 'Options:hover { cursor: default; } .naturalOption_' + thisID + ':hover { background: ' + settings.hoverColor + ' !important; } .naturalOption_' + thisID + ':active { background: ' + settings.mouseDownColor + ' !important; }'
			style=document.createElement('style');
			if (style.styleSheet) {
				style.styleSheet.cssText=css;
			}
			else { 
				style.appendChild(document.createTextNode(css));
			}
			document.getElementsByTagName('head')[0].appendChild(style);

			//set starting width if dynamicWidth is false
			if (!settings.dynamicWidth) {
				$('#' + thisID + 'Selected').css({
					'width': $('#' + thisID + 'Options').width() - parseInt( $('#' + thisID + 'Selected').css('padding-left').replace('px', '') ) - parseInt( $('#' + thisID + 'Selected').css('padding-right').replace('px', '') )
				})
			}

			//SET TRIGGERS
			//click box to show list
			$(this).on('click', function(e) {
				e.stopPropagation()
				var widthHolder = $('#' + thisID + 'Selected').width()
				var checkIfMax = $('#' + thisID + 'Options').width() == ($('#' + thisID + 'Selected').width() + parseInt($('#' + thisID + 'Selected').css('padding-left').replace('px', '')) + parseInt($('#' + thisID + 'Selected').css('padding-right').replace('px', '')))
				console.log($('#' + thisID + 'Options').width())
				console.log(($('#' + thisID + 'Selected').width() + parseInt($('#' + thisID + 'Selected').css('padding-left').replace('px', '')) + parseInt($('#' + thisID + 'Selected').css('padding-right').replace('px', ''))))
				//don't animate its already max width or if dynamicWidth is false
				if (checkIfMax || settings.dynamicWidth == false) {
					var animateDur = 0
				}
				else {
					var animateDur = 400
				}
				$('#' + thisID + 'Selected').animate(
					{
						'width': $('#' + thisID + 'Options').width() - 10
					},
					{
						'duration': animateDur,
						'complete': function() {
							$('#' + thisID + 'Options').fadeIn()
						}
					}
				)
				$('html').bind('click', function() { bodyClickListener(event) })
		
				//function to close menu when clicked elsewhere
				var bodyClickListener = function(e) {
					if($(e.target).closest('.optionsWrapper').length == 0) {
						$('#' + thisID + 'Options').fadeOut(400, function() {
							if (settings.dynamicWidth) {
								$('#' + thisID + 'Selected').animate({
									'width': widthHolder
								}, 400)
							}
						})
					}
					$('html').unbind('click')
				}

			})


			//click option to select it
			$('.naturalOption_' + thisID).on('click', function(e) {
				//stop the click from affecting anything else
				e.stopPropagation()
				//set selected text to this option
				$('#' + thisID + 'Selected').html($(this).html())
				//set input according to html or value (if it is set)
				if ($(this).attr('value')) {
					$('#inp_' + thisID).val($(this).attr('value'))	
				}
				else {
					$('#inp_' + thisID).val($(this).find('span').html())
				}
				//create vars to hold variables for fadeout finish function
				var holdHeight = $(this).height()
				var holdWidth = $(this).find('span').width()
				var holdIndex = $(this).index()
				//fade out all options
				$('#' + thisID + 'Options').fadeOut(400, function () {
					if (settings.staticOptions) {
						//move the menu so that the selected option will be where the button is next time the menu is opened
						$('#' + thisID + 'Options').css({
							'top': 0 - holdHeight * (holdIndex) + 'px'
						})
					}
					//change width if dynamicWidth is false
					if (settings.dynamicWidth) {
						//animate select box to new width
						$('#' + thisID + 'Selected').animate({
							'width': holdWidth + 'px'
						}, 400)
						console.log(holdWidth)
						console.log(thisID)
					}
				})
				$('html').unbind('click')
			})

		})
	}
})(jQuery)