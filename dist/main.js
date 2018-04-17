/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/sprintf-js/src/sprintf.js":
/*!************************************************!*\
  !*** ./node_modules/sprintf-js/src/sprintf.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("(function(window) {\n    var re = {\n        not_string: /[^s]/,\n        number: /[diefg]/,\n        json: /[j]/,\n        not_json: /[^j]/,\n        text: /^[^\\x25]+/,\n        modulo: /^\\x25{2}/,\n        placeholder: /^\\x25(?:([1-9]\\d*)\\$|\\(([^\\)]+)\\))?(\\+)?(0|'[^$])?(-)?(\\d+)?(?:\\.(\\d+))?([b-gijosuxX])/,\n        key: /^([a-z_][a-z_\\d]*)/i,\n        key_access: /^\\.([a-z_][a-z_\\d]*)/i,\n        index_access: /^\\[(\\d+)\\]/,\n        sign: /^[\\+\\-]/\n    }\n\n    function sprintf() {\n        var key = arguments[0], cache = sprintf.cache\n        if (!(cache[key] && cache.hasOwnProperty(key))) {\n            cache[key] = sprintf.parse(key)\n        }\n        return sprintf.format.call(null, cache[key], arguments)\n    }\n\n    sprintf.format = function(parse_tree, argv) {\n        var cursor = 1, tree_length = parse_tree.length, node_type = \"\", arg, output = [], i, k, match, pad, pad_character, pad_length, is_positive = true, sign = \"\"\n        for (i = 0; i < tree_length; i++) {\n            node_type = get_type(parse_tree[i])\n            if (node_type === \"string\") {\n                output[output.length] = parse_tree[i]\n            }\n            else if (node_type === \"array\") {\n                match = parse_tree[i] // convenience purposes only\n                if (match[2]) { // keyword argument\n                    arg = argv[cursor]\n                    for (k = 0; k < match[2].length; k++) {\n                        if (!arg.hasOwnProperty(match[2][k])) {\n                            throw new Error(sprintf(\"[sprintf] property '%s' does not exist\", match[2][k]))\n                        }\n                        arg = arg[match[2][k]]\n                    }\n                }\n                else if (match[1]) { // positional argument (explicit)\n                    arg = argv[match[1]]\n                }\n                else { // positional argument (implicit)\n                    arg = argv[cursor++]\n                }\n\n                if (get_type(arg) == \"function\") {\n                    arg = arg()\n                }\n\n                if (re.not_string.test(match[8]) && re.not_json.test(match[8]) && (get_type(arg) != \"number\" && isNaN(arg))) {\n                    throw new TypeError(sprintf(\"[sprintf] expecting number but found %s\", get_type(arg)))\n                }\n\n                if (re.number.test(match[8])) {\n                    is_positive = arg >= 0\n                }\n\n                switch (match[8]) {\n                    case \"b\":\n                        arg = arg.toString(2)\n                    break\n                    case \"c\":\n                        arg = String.fromCharCode(arg)\n                    break\n                    case \"d\":\n                    case \"i\":\n                        arg = parseInt(arg, 10)\n                    break\n                    case \"j\":\n                        arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0)\n                    break\n                    case \"e\":\n                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential()\n                    break\n                    case \"f\":\n                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg)\n                    break\n                    case \"g\":\n                        arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg)\n                    break\n                    case \"o\":\n                        arg = arg.toString(8)\n                    break\n                    case \"s\":\n                        arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg)\n                    break\n                    case \"u\":\n                        arg = arg >>> 0\n                    break\n                    case \"x\":\n                        arg = arg.toString(16)\n                    break\n                    case \"X\":\n                        arg = arg.toString(16).toUpperCase()\n                    break\n                }\n                if (re.json.test(match[8])) {\n                    output[output.length] = arg\n                }\n                else {\n                    if (re.number.test(match[8]) && (!is_positive || match[3])) {\n                        sign = is_positive ? \"+\" : \"-\"\n                        arg = arg.toString().replace(re.sign, \"\")\n                    }\n                    else {\n                        sign = \"\"\n                    }\n                    pad_character = match[4] ? match[4] === \"0\" ? \"0\" : match[4].charAt(1) : \" \"\n                    pad_length = match[6] - (sign + arg).length\n                    pad = match[6] ? (pad_length > 0 ? str_repeat(pad_character, pad_length) : \"\") : \"\"\n                    output[output.length] = match[5] ? sign + arg + pad : (pad_character === \"0\" ? sign + pad + arg : pad + sign + arg)\n                }\n            }\n        }\n        return output.join(\"\")\n    }\n\n    sprintf.cache = {}\n\n    sprintf.parse = function(fmt) {\n        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0\n        while (_fmt) {\n            if ((match = re.text.exec(_fmt)) !== null) {\n                parse_tree[parse_tree.length] = match[0]\n            }\n            else if ((match = re.modulo.exec(_fmt)) !== null) {\n                parse_tree[parse_tree.length] = \"%\"\n            }\n            else if ((match = re.placeholder.exec(_fmt)) !== null) {\n                if (match[2]) {\n                    arg_names |= 1\n                    var field_list = [], replacement_field = match[2], field_match = []\n                    if ((field_match = re.key.exec(replacement_field)) !== null) {\n                        field_list[field_list.length] = field_match[1]\n                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== \"\") {\n                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {\n                                field_list[field_list.length] = field_match[1]\n                            }\n                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {\n                                field_list[field_list.length] = field_match[1]\n                            }\n                            else {\n                                throw new SyntaxError(\"[sprintf] failed to parse named argument key\")\n                            }\n                        }\n                    }\n                    else {\n                        throw new SyntaxError(\"[sprintf] failed to parse named argument key\")\n                    }\n                    match[2] = field_list\n                }\n                else {\n                    arg_names |= 2\n                }\n                if (arg_names === 3) {\n                    throw new Error(\"[sprintf] mixing positional and named placeholders is not (yet) supported\")\n                }\n                parse_tree[parse_tree.length] = match\n            }\n            else {\n                throw new SyntaxError(\"[sprintf] unexpected placeholder\")\n            }\n            _fmt = _fmt.substring(match[0].length)\n        }\n        return parse_tree\n    }\n\n    var vsprintf = function(fmt, argv, _argv) {\n        _argv = (argv || []).slice(0)\n        _argv.splice(0, 0, fmt)\n        return sprintf.apply(null, _argv)\n    }\n\n    /**\n     * helpers\n     */\n    function get_type(variable) {\n        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase()\n    }\n\n    function str_repeat(input, multiplier) {\n        return Array(multiplier + 1).join(input)\n    }\n\n    /**\n     * export to either browser or node.js\n     */\n    if (true) {\n        exports.sprintf = sprintf\n        exports.vsprintf = vsprintf\n    }\n    else {}\n})(typeof window === \"undefined\" ? this : window);\n\n\n//# sourceURL=webpack:///./node_modules/sprintf-js/src/sprintf.js?");

/***/ }),

/***/ "./src/checkContent.js":
/*!*****************************!*\
  !*** ./src/checkContent.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var sprintf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sprintf-js */ \"./node_modules/sprintf-js/src/sprintf.js\");\n/* harmony import */ var sprintf_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sprintf_js__WEBPACK_IMPORTED_MODULE_0__);\n\n\nconst $ = jQuery;\n\nconst checkContent = event => {\n\tconst $visualEditorWrap = $(document.getElementById('wp-content-wrap'));\n\n\tlet insecure = 0;\n\tlet $elements;\n\tlet insecureElementURLs = [];\n\n\tif ($visualEditorWrap.hasClass('tmce-active') || $visualEditorWrap.hasClass('tinymce-active')) {\n\t\t$elements = $('#content_ifr').contents().find('*');\n\t} else {\n\t\t$elements = $('<div>').append($.parseHTML($('#content').val())).find('*');\n\t}\n\n\t$elements.each((index, el) => {\n\t\tif (el.src && el.src.substr(0, 8) !== 'https://') {\n\t\t\tinsecure += 1;\n\t\t\t// remove query paramaters for display.\n\t\t\tconst url = el.src.split('?')[0];\n\t\t\tinsecureElementURLs.push(url);\n\t\t}\n\n\t\tif (el.srcset && el.srcset.substr(0, 8) !== 'https://') {\n\t\t\tinsecure += 1;\n\t\t\t// remove query paramaters for display.\n\t\t\tconst url = el.srcset.split('?')[0];\n\t\t\tinsecureElementURLs.push(url);\n\t\t}\n\t});\n\n\tconst $hr = $('#major-publishing-actions');\n\n\tif (insecure > 0) {\n\t\tevent.preventDefault();\n\n\t\t$hr.next().remove();\n\t\tlet html;\n\t\tlet element = insecure > 1 ? insecureContentAdmin.elements : insecureContentAdmin.element;\n\n\t\tlet $errorContainer = $('<div>', {\n\t\t\t'class': 'error js-icw-error',\n\t\t\t'html': Object(sprintf_js__WEBPACK_IMPORTED_MODULE_0__[\"sprintf\"])(insecureContentAdmin.error, parseInt(insecure), element)\n\t\t});\n\n\t\thtml = '<ol>';\n\t\tfor (let i = 0, length = insecureElementURLs.length; i < length; i++) {\n\t\t\thtml += `\n\t\t\t<li>\n\t\t\t\t${insecureElementURLs[i]} \n\t\t\t\t<br>\n\t\t\t\t<a href=\"\" class=\"js-icw-check\" data-check=\"${insecureElementURLs[i]}\">${insecureContentAdmin.checkHttps}</a>\n\t\t\t\t<img src=\"${insecureContentAdmin.spinner}\" class=\"js-icw-spinner\" style=\"display: none\" >\n\t\t\t\t<span class=\"js-icw-fixed\" style=\"display: none; color: forestgreen; font-weight: bolder\">Success!</span>\n\t\t\t\t<span class=\"js-icw-error\" style=\"display: none; color: #950e0d; font-weight: bolder\">${insecureContentAdmin.imageNotFound}</a>\n\t\t\t\t\n\t\t\t</li>\n\t\t\t`;\n\t\t}\n\t\thtml += '</ol>';\n\t\thtml += `\n\t\t\t<p>\n\t\t\t\t<strong>${insecureContentAdmin.moreInformation}:</strong>\n\t\t\t</p>\n\t\t\t<ol>\n\t\t\t\t<li>\n\t\t\t\t\t<a target=\"_blank\" href=\"https://en.support.wordpress.com/add-media/\">${insecureContentAdmin.howToAddMedia}</a>\n\t\t\t\t</li>\n\t\t\t\t<li>\n\t\t\t\t\t<a target=\"_blank\" href=\"https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content\">${insecureContentAdmin.mixedContent}</a>\n\t\t\t\t</li>\n\t\t\t</ol>\n\t\t\t<p>\n\t\t\t\t<label for=\"icw-force-checkbox\">\n\t\t\t\t\t<input type=\"checkbox\" id=\"icw-force-checkbox\" class=\"js-icw-force-checkbox\">\n\t\t\t\t\t${insecureContentAdmin.disclaimer}\n\t\t\t\t</label>\n\t\t\t</p>`;\n\n\t\t$errorContainer.css({\n\t\t\t'padding': '16px',\n\t\t\t'margin': '0'\n\t\t});\n\n\t\t$(html).appendTo($errorContainer);\n\n\t\t$hr.after($errorContainer);\n\t} else {\n\t\t$('.js-icw-error').remove();\n\t\tevent.preventDefault();\n\t}\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (checkContent);\n\n//# sourceURL=webpack:///./src/checkContent.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _checkContent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./checkContent */ \"./src/checkContent.js\");\n/* harmony import */ var _replace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./replace */ \"./src/replace.js\");\n// import replaceContent from './replace.js';\n\n\n\nconst $ = jQuery;\n\n$(document).on('click', '#publish', event => {\n\tif ($('.js-icw-force-checkbox').attr('checked') !== 'checked') {\n\t\tObject(_checkContent__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(event);\n\t}\n});\n\nlet delay = time => result => new Promise(resolve => setTimeout(() => resolve(result), time));\n\n$(document).on('click', '.js-icw-check', function (e) {\n\te.preventDefault();\n\tconst spinner = $(this).next('.js-icw-spinner');\n\tspinner.show();\n\tconst url = $(this).data('check');\n\tfetch(`http://localhost/wp-json/icw/v1/check?url=${url}`).then(data => data.json()).then(data => {\n\t\tspinner.hide();\n\t\t// Attempt to replace if https equivalent found.\n\t\tif (data === true) {\n\t\t\t$(this).nextAll('.js-icw-fixed').show();\n\t\t\tObject(_replace__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(url);\n\t\t} else {\n\t\t\t// show the error and the\n\t\t\t$(this).nextAll('.js-icw-error').show();\n\t\t\tthrow 'No https equivalent found.';\n\t\t}\n\t}).then(delay(1000)).then(() => {\n\t\tObject(_checkContent__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(e);\n\t}, err => {\n\t\t// Don't recheck if replace unsuccessful.\n\t\treturn err;\n\t});\n});\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/replace.js":
/*!************************!*\
  !*** ./src/replace.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst $ = jQuery;\n\n/**\n * Replace the urls in post content\n *\n * @param url\n */\nconst replaceContent = (url = '') => {\n\n\tlet replace = url.replace('http://', 'https://');\n\n\tif ($('#wp-content-wrap').hasClass('html-active')) {\n\n\t\tconst editor = document.getElementById('content');\n\t\tconst content = editor.value;\n\n\t\t// update the textarea value\n\t\teditor.value = content.replace(url, replace);\n\t} else if (typeof tinyMCE === 'object') {\n\n\t\tconst content = tinyMCE.activeEditor.getContent();\n\t\tconst newContent = content.replace(url, replace);\n\n\t\t// Update tinyMCE's content\n\t\ttinyMCE.activeEditor.setContent(newContent);\n\t}\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (replaceContent);\n\n//# sourceURL=webpack:///./src/replace.js?");

/***/ })

/******/ });