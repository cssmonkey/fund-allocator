var numeral = require('numeral'),
    numeralGB = require('numeral/languages/en-gb');

// load language
numeral.language('en-gb', numeralGB);
//set the language
numeral.language('en-gb');

var helpers = {
    formatPrice: function(number) {
        var _number = numeral(number);
        return _number.format('$0,0[.]00');
    },
    formatPercent: function(number) {
        var _number = numeral(number);
        return _number.format('0%');
    },
    formatNumber: function(number, format) {
        var _number = numeral(number);
        return _number.format(format);
    }
}

module.exports = helpers;
