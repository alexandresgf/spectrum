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