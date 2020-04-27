/**
 * Spectrum Library for Video Game Portable Console
 * http://www.grindsoft.com.br
 *
 * @author		Alexandre Ferreira <contato@grindsoft.com.br>
 * @copyright	2004 - 2014 GrindSoft.
 * @version 	v0.1.1a
 */

/**
 * Note: All Spectrum functions are described in this file. For full compatibility, do not change or add new 
 * properties or functions as it may be overwritten in future versions.
 *
 * @namespace Spectrum
 */
var Spectrum = Spectrum || {};

(function() {
	var root = this;

/**
 * Spectrum Library for Video Game Portable Console
 * http://www.grindsoft.com.br
 *
 * @author		Alexandre Ferreira <contato@grindsoft.com.br>
 * @copyright	2004 - 2014 GrindSoft.
 * @version 	v0.1.1a
 */

/**
 * @constant {string} NAME - The name of the SDK
 * @public
 */
Object.defineProperty(Spectrum, 'NAME', { value: 'SpectrumJS' });

/**
 * @constant {string} VERSION - The version of the SDK
 * @public
 */
Object.defineProperty(Spectrum, 'VERSION', { value: 'v0.1.1a' });

/**
 * @constant {number} BUTTONS - The total of numbers allowed to be assigned to any framework
 * @public
 */
Object.defineProperty(Spectrum, 'BUTTONS', { value: 13 });

/**
 * Spectrum Library for Video Game Portable Console
 * http://www.grindsoft.com.br
 *
 * @author		Alexandre Ferreira <contato@grindsoft.com.br>
 * @copyright	2004 - 2014 GrindSoft.
 * @version 	v0.1.1a
 */

/**
 * @class Spectrum.Gamepad
 * @param {boolean} [async] - Turn on or off the async event methods
 * @constuctor
 */
Spectrum.Gamepad = function(async) {
	'use strict';

	/**
	 * @property {Object} _input - Input reference from the hardware of the console
	 * @private
	 */
	this._input = input;

	/**
	 * @property {Array} _btnBindList - List of references for buttons nicknames
	 * @private
	 */
	this._btnBind = new Array(Spectrum.BUTTONS);

	/**
	 * @property {Array} _btnFlagPress - List of flags to verify if a button was pressed
	 * @private
	 */
	this._btnFlagPress = new Array(Spectrum.BUTTONS);

	/**
	 * @property {Array} _btnFlagRelease - List of flags to verify if a button was released
	 * @private
	 */
	this._btnFlagRelease = new Array(Spectrum.BUTTONS);

	/**
	 * @property {boolean} _isAsync - Confirm if it is in asynchronous state
	 * @private
	 */
	this._isAsync = async || false;

	// Init the events in synchronous mode
	if (!this._isAsync)
		this._init();
};

Spectrum.Gamepad.prototype.constuctor = Spectrum.Gamepad;
Spectrum.Gamepad.prototype = {
	/**
	 * @private
	 */
	_initFlags: function() {
		'use strict';

		for (var i = 0; i < Spectrum.BUTTONS; i++)
			this._btnFlagPress[i] = this._btnFlagRelease[i] = false;
	},

	/**
	 * @private
	 */
	_bindSignals: function() {
		'use strict';

		try {
			this._input.pressed.connect(this, '_pressed');
			this._input.released.connect(this, '_released');
			this._input.pressing.connect(this, '_pressing');
		} catch (err) {
			console.log('[ERROR] Spectrum found an error: ' + err);
		}
	},

	/**
	 * @private
	 */
	_pressed: function(button) {
		'use strict';

		this._btnFlagPress[button] = true;
		this._btnFlagRelease[button] = false;
	},

	/**
	 * @private
	 */
	_released: function(button) {
		'use strict';

		this._btnFlagPress[button] = false;
		this._btnFlagRelease[button] = true;
	},

	/**
	 * @private
	 */
	_pressing: function(button) {
		'use strict';

		if (this._btnFlagPress[button])
			this._pressed(button);
	},

	/**
	 * @private
	 */
	_init: function() {
		'use strict';

		// init the button state flags
		this._initFlags();

		// connect to the hardware signals
		this._bindSignals();
	},

	/**
	 * @public
	 */
	isButtonPressed: function(button) {
		'use strict';

		if (this._btnFlagPress[button] && !this._btnFlagRelease[button]) {
			this._btnFlagPress[button] = false;

			return true;
		}

		return false;
	},

	/**
	 * @public
	 */
	isButtonReleased: function(button) {
		'use strict';

		if (this._btnFlagRelease[button] && !this._btnFlagPress[button]) {
			this._btnFlagRelease[button] = false;

			return true;
		}

		return false;
	},

	/**
	 * @public
	 */
	isButtonPress: function(button) {
		'use strict';

		if (this._btnFlagPress[button])
			return true;

		return false;
	},

	/**
	 * @public
	 */
	isConnected: function(state) {
		var connected = this._input.isConnected(state);
		
		if (connected < 0)
			throw new Error('[ERROR] State not found!');

		return connected;
	},

	/**
	 * @public
	 */
	registerMethod: function(state, func) {
		'use strict';

		if (this._isAsync) {
			try {
				switch (state) {
					case 0:
						this._input.pressed.connect(func);
						break;

					case 1:
						this._input.released.connect(func);
						break;

					case 2:
						this._input.pressing.connect(func);
						break;
				}
			} catch (err) {
				console.log('[ERROR] Spectrum found an error: ' + err);
			}
		} else {
			throw new Error('[ERROR] You can\'t register new functions in synchronous mode!');
		}
	},

	/**
	 * @public
	 */
	releaseMethod: function(state, func) {
		'use strict';

		if (this._isAsync) {
			try {
				switch (state) {
					case 0:
						this._input.pressed.disconnect(func);
						break;

					case 1:
						this._input.released.disconnect(func);
						break;

					case 2:
						this._input.pressing.disconnect(func);
						break;
				}
			} catch (err) {
				console.log('[ERROR] Spectrum found an error: ' + err);
			}
		} else {
			throw new Error('[ERROR] You can\'t release a function in synchronous mode!');
		}
	},

	/**
	 * @public
	 */
	flush: function() {
		'use strict';

		while (this._btnBind.length > 0)
			this._btnBind.pop();
	}
};

/**
 * @constant {number} STATE_PRESSED - Reference to state of the button when pressed
 * @public
 */
Object.defineProperty(Spectrum.Gamepad, 'STATE_PRESSED', { value: 0 });

/**
 * @constant {number} STATE_RELEASED - Reference to state of the button when released
 * @public
 */
Object.defineProperty(Spectrum.Gamepad, 'STATE_RELEASED', { value: 1 });

/**
 * @constant {number} STATE_PRESS - Reference to state of the button when press
 * @public
 */
Object.defineProperty(Spectrum.Gamepad, 'STATE_PRESS', { value: 2 });

/**
 * @constant {number} BUTTON_START - Reference to START button
 * @public
 */
Object.defineProperty(Spectrum.Gamepad, 'BUTTON_START', { value: 1 });

/**
 * @constant {number} BUTTON_SELECT - Reference to SELECT button
 * @public
 */
Object.defineProperty(Spectrum.Gamepad, 'BUTTON_SELECT', { value: 2 });

/**
 * @constant {number} BUTTON_A - Reference to A button
 * @public
 */
Object.defineProperty(Spectrum.Gamepad, 'BUTTON_A', { value: 3 });

/**
 * @constant {number} BUTTON_B - Reference to B button
 * @public
 */
Object.defineProperty(Spectrum.Gamepad, 'BUTTON_B', { value: 4 });

/**
 * @constant {number} BUTTON_X - Reference to X button
 * @public
 */
Object.defineProperty(Spectrum.Gamepad, 'BUTTON_X', { value: 5 });

/**
 * @constant {number} BUTTON_Y - Reference to Y button
 * @public
 */
Object.defineProperty(Spectrum.Gamepad, 'BUTTON_Y', { value: 6 });

/**
 * @constant {number} BUTTON_L - Reference to L button
 * @public
 */
Object.defineProperty(Spectrum.Gamepad, 'BUTTON_L', { value: 7 });

/**
 * @constant {number} BUTTON_R - Reference to R button
 * @public
 */
Object.defineProperty(Spectrum.Gamepad, 'BUTTON_R', { value: 8 });

/**
 * @constant {number} DIR_UP - Reference to directional up button
 * @public
 */
Object.defineProperty(Spectrum.Gamepad, 'DIR_UP', { value: 9 });

/**
 * @constant {number} DIR_DOWN - Reference to directional down button
 * @public
 */
Object.defineProperty(Spectrum.Gamepad, 'DIR_DOWN', { value: 10 });

/**
 * @constant {number} DIR_LEFT - Reference to directional left button
 * @public
 */
Object.defineProperty(Spectrum.Gamepad, 'DIR_LEFT', { value: 11 });

/**
 * @constant {number} DIR_RIGHT - Reference to directional right button
 * @public
 */
Object.defineProperty(Spectrum.Gamepad, 'DIR_RIGHT', { value: 12 });

/**
 * Spectrum Library for Video Game Portable Console
 * http://www.grindsoft.com.br
 *
 * @author		Alexandre Ferreira <contato@grindsoft.com.br>
 * @copyright	2004 - 2014 GrindSoft.
 * @version 	v0.1.1a
 */

 	/**
	 * Add AMD support for require JS and node JS
	 */
	if (typeof define !== 'undefined' && define.amd) {
		define('Spectrum', [], function() {
			return Spectrum;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = Spectrum;
	} else {
		root.Spectrum = Spectrum;
	}
}).call(this);