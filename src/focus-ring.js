/* https://github.com/WICG/focusring */
document.addEventListener('DOMContentLoaded', function() {
    var hadKeyboardEvent = false,
        keyboardModalityWhitelist = [ 'input:not([type])',
                                      'input[type=text]',
                                      'input[type=number]',
                                      'input[type=date]',
                                      'input[type=time]',
                                      'input[type=datetime]',
                                      'textarea',
                                      '[role=textbox]' ].join(','),
        isHandlingKeyboardThrottle,
        matcher = (function () {
			var el = document.body;
			if (el.matchesSelector)
				return el.matchesSelector;
			if (el.webkitMatchesSelector)
				return el.webkitMatchesSelector;
			if (el.mozMatchesSelector)
				return el.mozMatchesSelector;
			if (el.msMatchesSelector)
				return el.msMatchesSelector;
			console.error('Couldn\'t find any matchesSelector method on document.body.');
		}()),
		focusTriggersKeyboardModality = function (el) {
			var triggers = false;
			if (matcher) {
				triggers = matcher.call(el, keyboardModalityWhitelist) && matcher.call(el, ':not([readonly]');
			}
		        return triggers;
		};

    document.body.addEventListener('keydown', function() {
        hadKeyboardEvent = true;
        if (document.activeElement.matches(':focus'))
            document.activeElement.classList.add('focus-ring');
        if (isHandlingKeyboardThrottle) {
            clearTimeout(isHandlingKeyboardThrottle);
        }
        isHandlingKeyboardThrottle = setTimeout(function() {
            hadKeyboardEvent = false;
        }, 100);
    }, true);

    document.body.addEventListener('focus', function(e) {
        if (!hadKeyboardEvent && !focusTriggersKeyboardModality(e.target))
            return;
        if (e.target.classList.contains('focus-ring'))
            return;
        e.target.classList.add('focus-ring');
      e.target.setAttribute('data-focus-ring-added', '');
    }, true);

    document.body.addEventListener('blur', function(e) {
        if (!e.target.hasAttribute('data-focus-ring-added'))
            return;
        e.target.classList.remove('focus-ring');
        e.target.removeAttribute('data-focus-ring-added')
    }, true);
});
