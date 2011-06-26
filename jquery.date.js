/**
 * getDate Plugin v0.4 for jQuery by James Campbell
 */
(function($){
    $.getDate = function(){
        var CurrentDate = new Date();
        return {
            Date: function(Options){
                Options = $.extend({
                    utc: false
                }, Options);
                return (Options.utc) ? CurrentDate.getUTCDate() : CurrentDate.getDate();
            },
            Ordinal: function(Options){
                Options = $.extend({
                    utc: false
                }, Options);
                var Date = this.Date(Options);
                var n = Date % 100;
                var Suffix = ["th", "st", "nd", "rd", "th"];
                return n < 21 ? (n < 4 ? Suffix[n] : Suffix[0]) : (n % 10 > 4 ? Suffix[0] : Suffix[n % 10]);
            },
            Day: function(Options){
                Options = $.extend({
                    utc: false,
                    format: "Number"
                }, Options);
                var Day = (Options.utc) ? CurrentDate.getUTCDay() : CurrentDate.getDay();
                var Days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
                return (Options.format == "Number") ? Day : Days[Day];
            },
            Month: function(Options){
                Options = $.extend({
                    utc: false,
                    format: "Number"
                }, Options);
                var Month = (Options.utc) ? CurrentDate.getUTCMonth() : CurrentDate.getMonth();
                var Months = new Array("January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
                return (Options.format == "Number") ? Month : Months[Month];
            },
            Year: function(Options){
                Options = $.extend({
                    utc: false
                }, Options);
                return (Options.utc) ? CurrentDate.getUTCFullYear() : CurrentDate.getFullYear();
            },
            Hours: function(Options){
                Options = $.extend({
                    utc: false,
                    format: "24-Hour"
                }, Options);
                return (((Options.utc) ? CurrentDate.getUTCHours() : CurrentDate.getHours()) - ((Options.format == "12-Hour") ? 12 : 0));
            },
            Period: function(Options){
                Options = $.extend({
                    utc: false,
                }, Options);
                return (this.Hours({
                    utc: Options.utc,
                    format: "12-Hour"
                }) <
                12) ? "AM" : "PM";
            },
            Minutes: function(Options){
                Options = $.extend({
                    utc: false
                }, Options);
                return (Options.utc) ? CurrentDate.getUTCMinutes() : CurrentDate.getMinutes();
            },
            MilliSeconds: function(Options){
                Options = $.extend({
                    utc: false
                }, Options);
                return (Options.utc) ? CurrentDate.getUTCMilliseconds() : CurrentDate.getMilliseconds();
            },
            Seconds: function(Options){
                Options = $.extend({
                    utc: false
                }, Options);
                return (Options.utc) ? CurrentDate.getUTCSeconds() : CurrentDate.getSeconds();
            }
        };
    };
})(jQuery);

