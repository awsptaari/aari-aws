

var pages = ["graphs", "records", "reports", "about", "pi"];
var pageName = "";
// If this page we're on now is listed as a subpage, use ".." to get to the relative root
function get_relative_url() {
    var sPath = window.location.pathname.replace(/\/$/, "");
    pageName = sPath.substring(sPath.lastIndexOf('/') + 1);
    if (pages.includes(pageName)) {
        var relative_url = "..";
    } else {
        var relative_url = ".";
    }
    belchertown_debug("URL: Relative URL is: " + relative_url);

    return relative_url;
}

// Determine if debug is on via URL var or config setting
if (getURLvar("debug") && (getURLvar("debug") == "true" || getURLvar("debug") == "1")) {
    var belchertown_debug_config = true;
    belchertown_debug("Debug: URL debug variable enabled");
} else {
    var belchertown_debug_config = 0;
    belchertown_debug("Debug: skin.conf belchertown_debug enabled");
}

var moment_locale = "en-US";
moment.locale(moment_locale);

var graphgroups_raw = {"homepage": ["chart1", "chart2", "chart3", "chart4"], "day": ["chart1", "chart2", "chart3", "chart4"], "week": ["chart1", "chart2", "chart3", "chart4"], "month": ["chart1", "chart2", "chart3", "chart4"], "year": ["chart1", "chart2", "chart3", "chart4"]};
var graphgroups_titles = {"homepage": "Homepage", "day": "Today", "week": "This Week", "month": "This Month", "year": "This Year"};
var graphpage_content = {};

//  declare icon_dict as global variable
var icon_dict = {};

function belchertown_debug(message) {
    if (belchertown_debug_config > 0) {
        console.log(message);
    }
}

jQuery(document).ready(function() {

    // Bootstrap hover tooltips
    jQuery(function() {
        jQuery('[data-toggle="tooltip"]').tooltip()
    })

    // If the visitor has overridden the theme, keep that theme going throughout the full site and their visit.
    if (sessionStorage.getItem('theme') == "toggleOverride") {
        belchertown_debug("Theme: sessionStorage override in place.");
        changeTheme(sessionStorage.getItem('currentTheme'));
    }

    // Change theme if a URL variable is set
    if (window.location.search.indexOf('theme')) {
        if (window.location.search.indexOf('?theme=dark') === 0) {
            belchertown_debug("Theme: Setting dark theme because of URL override");
            changeTheme("dark", true);
        } else if (window.location.search.indexOf('?theme=light') === 0) {
            belchertown_debug("Theme: Setting light theme because of URL override");
            changeTheme("light", true);
        } else if (window.location.search.indexOf('?theme=auto') === 0) {
            belchertown_debug("Theme: Setting auto theme because of URL override");
            sessionStorage.setItem('theme', 'auto')
            autoTheme(02, 07, 11, 22)
        }
    }

    // Dark mode checkbox toggle switcher
    try {
        document.getElementById('themeSwitch').addEventListener('change', function(event) {
            belchertown_debug("Theme: Toggle button changed");
            (event.target.checked) ? changeTheme("dark", true) : changeTheme("light", true);
        });
    } catch (err) {
        // Silently exit
    }

    // After charts are loaded, if an anchor tag is in the URL, let's scroll to it
    jQuery(window).on('load', function() {
        var anchor_tag = location.hash.replace('#', '');
        if (anchor_tag != '') {
            // Scroll the webpage to the chart. The timeout is to let jQuery finish appending the outer div so the height of the page is completed.
            setTimeout(function() {
                jQuery('html, body').animate({scrollTop: jQuery('#' + anchor_tag).offset().top}, 500);
            }, 500);
        }
    });


});


// Disable AJAX caching
jQuery.ajaxSetup({
    cache: false
});

// Get the URL variables. Source: https://stackoverflow.com/a/26744533/1177153
function getURLvar(k) {
    var p = {};
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(s, k, v) {p[k] = v});
    return k ? p[k] : p;
}

// http://stackoverflow.com/a/14887961/1177153
var weatherdirection = { 0: "N", 90: "E", 180: "S", 270: "W", 360: "N" };

// Change the color of the outTemp_F variable
function get_outTemp_color(unit, outTemp, returnColor = false) {
    outTemp = parseFloat(outTemp).toFixed(0); // Convert back to decimal literal
    if (unit == "degree_F") {
        if (outTemp <= 0) {
            var outTemp_color = "#1278c8";
        } else if (outTemp <= 25) {
            var outTemp_color = "#30bfef";
        } else if (outTemp <= 32) {
            var outTemp_color = "#1fafdd";
        } else if (outTemp <= 40) {
            var outTemp_color = "rgba(0,172,223,1)";
        } else if (outTemp <= 50) {
            var outTemp_color = "#71bc3c";
        } else if (outTemp <= 55) {
            var outTemp_color = "rgba(90,179,41,0.8)";
        } else if (outTemp <= 65) {
            var outTemp_color = "rgba(131,173,45,1)";
        } else if (outTemp <= 70) {
            var outTemp_color = "rgba(206,184,98,1)";
        } else if (outTemp <= 75) {
            var outTemp_color = "rgba(255,174,0,0.9)";
        } else if (outTemp <= 80) {
            var outTemp_color = "rgba(255,153,0,0.9)";
        } else if (outTemp <= 85) {
            var outTemp_color = "rgba(255,127,0,1)";
        } else if (outTemp <= 90) {
            var outTemp_color = "rgba(255,79,0,0.9)";
        } else if (outTemp <= 95) {
            var outTemp_color = "rgba(255,69,69,1)";
        } else if (outTemp <= 110) {
            var outTemp_color = "rgba(255,104,104,1)";
        } else if (outTemp >= 111) {
            var outTemp_color = "rgba(218,113,113,1)";
        }
    } else if (unit == "degree_C") {
        if (outTemp <= 0) {
            var outTemp_color = "#1278c8";
        } else if (outTemp <= -3.8) {
            var outTemp_color = "#30bfef";
        } else if (outTemp <= 0) {
            var outTemp_color = "#1fafdd";
        } else if (outTemp <= 4.4) {
            var outTemp_color = "rgba(0,172,223,1)";
        } else if (outTemp <= 10) {
            var outTemp_color = "#71bc3c";
        } else if (outTemp <= 12.7) {
            var outTemp_color = "rgba(90,179,41,0.8)";
        } else if (outTemp <= 18.3) {
            var outTemp_color = "rgba(131,173,45,1)";
        } else if (outTemp <= 21.1) {
            var outTemp_color = "rgba(206,184,98,1)";
        } else if (outTemp <= 23.8) {
            var outTemp_color = "rgba(255,174,0,0.9)";
        } else if (outTemp <= 26.6) {
            var outTemp_color = "rgba(255,153,0,0.9)";
        } else if (outTemp <= 29.4) {
            var outTemp_color = "rgba(255,127,0,1)";
        } else if (outTemp <= 32.2) {
            var outTemp_color = "rgba(255,79,0,0.9)";
        } else if (outTemp <= 35) {
            var outTemp_color = "rgba(255,69,69,1)";
        } else if (outTemp <= 43.3) {
            var outTemp_color = "rgba(255,104,104,1)";
        } else if (outTemp >= 43.4) {
            var outTemp_color = "rgba(218,113,113,1)";
        }
    }

    // Return the color value if requested, otherwise just set the div color
    if (returnColor) {
        return outTemp_color;
    } else {
        jQuery(".outtemp_outer").css("color", outTemp_color);
    }
}

// Change the color of the aqi variable according to US-EPA standards
// (adjusted to match skin colors better)
function get_aqi_color(aqi, returnColor = false) {
    if (aqi >= 301) {
        var aqi_color = "#cc241d";
    } else if (aqi >= 201) {
        var aqi_color = "#b16286";
    } else if (aqi >= 151) {
        var aqi_color = "rgba(255,69,69,1)";
    } else if (aqi >= 101) {
        var aqi_color = "rgba(255,127,0,1)";
    } else if (aqi >= 51) {
        var aqi_color = "rgba(255,174,0,0.9)";
    } else if (aqi < 51) {
        var aqi_color = "#71bc3c";
    }

    // Return the color value if requested, otherwise just set the div color
    if (returnColor) {
        return aqi_color;
    } else {
        jQuery(".aqi_outer").css("color", aqi_color);
    }
}

function get_gauge_color(value, options) {
    if (options.color1) {
        // Failsafe in case value drops below the lowest color position user has set.
        // Otherwise color is undefined when the value is below color1_position
        var color = options.color1
    }
    if (options.color2) {
        if (value >= options.color2_position) {
            var color = options.color2
        }
    }
    if (options.color3) {
        if (value >= options.color3_position) {
            var color = options.color3
        }
    }
    if (options.color4) {
        if (value >= options.color4_position) {
            var color = options.color4
        }
    }
    if (options.color5) {
        if (value >= options.color5_position) {
            var color = options.color5
        }
    }
    if (options.color6) {
        if (value >= options.color6_position) {
            var color = options.color6
        }
    }
    if (options.color7) {
        if (value >= options.color7_position) {
            var color = options.color7
        }
    }
    return color
}

function get_gauge_label(value, options) {
    if (options.color1) {
        if (options.color1_label) {
            var label = options.color1_label
        }
    }
    if (options.color2) {
        if (value >= options.color2_position) {
            var label = null
            if (options.color2_label) {
                var label = options.color2_label
            }
        }
    }
    if (options.color3) {
        if (value >= options.color3_position) {
            var label = null
            if (options.color3_label) {
                var label = options.color3_label
            }
        }
    }
    if (options.color4) {
        if (value >= options.color4_position) {
            var label = null
            if (options.color4_label) {
                var label = options.color4_label
            }
        }
    }
    if (options.color5) {
        if (value >= options.color5_position) {
            var label = null
            if (options.color5_label) {
                var label = options.color5_label
            }
        }
    }
    if (options.color6) {
        if (value >= options.color6_position) {
            var label = null
            if (options.color6_label) {
                var label = options.color6_label
            }
        }
    }
    if (options.color7) {
        if (value >= options.color7_position) {
            var label = null
            if (options.color7_label) {
                var label = options.color7_label
            }
        }
    }
    return label
}

function kts_to_beaufort(windspeed) {
    // Given windspeed in knots, converts to Beaufort scale
    if (windspeed <= 1) {
        return 0
    } else if (windspeed <= 3) {
        return 1
    } else if (windspeed <= 6) {
        return 2
    } else if (windspeed <= 10) {
        return 3
    } else if (windspeed <= 15) {
        return 4
    } else if (windspeed <= 21) {
        return 5
    } else if (windspeed <= 27) {
        return 6
    } else if (windspeed <= 33) {
        return 7
    } else if (windspeed <= 40) {
        return 8
    } else if (windspeed <= 47) {
        return 9
    } else if (windspeed <= 55) {
        return 10
    } else if (windspeed <= 63) {
        return 11
    } else if (windspeed > 63) {
        return 12
    }
}

function beaufort_cat(beaufort) {
    // Given Beaufort number, returns category description
    switch (beaufort) {
        case 0:
            return "calm"
        case 1:
            return "light air"
        case 2:
            return "light breeze"
        case 3:
            return "gentle breeze"
        case 4:
            return "moderate breeze"
        case 5:
            return "fresh breeze"
        case 6:
            return "strong breeze"
        case 7:
            return "near gale"
        case 8:
            return "gale"
        case 9:
            return "strong gale"
        case 10:
            return "storm"
        case 11:
            return "violent storm"
        case 12:
            return "hurricane force"
    }
}

function highcharts_tooltip_factory(obsvalue, point_obsType, highchartsReturn = false, rounding, mirrored = false, numberFormat) {
    // Mirrored values have the negative sign removed
    if (mirrored) {
        obsvalue = Math.abs(obsvalue);
    }

    if (point_obsType == "windDir") {
        if (obsvalue >= 0 && obsvalue <= 11.25) {
            ordinal = "N"; // N
        } else if (obsvalue >= 11.26 && obsvalue <= 33.75) {
            ordinal = "NNE"; // NNE
        } else if (obsvalue >= 33.76 && obsvalue <= 56.25) {
            ordinal = "NE"; // NE
        } else if (obsvalue >= 56.26 && obsvalue <= 78.75) {
            ordinal = "ENE"; // ENE
        } else if (obsvalue >= 78.76 && obsvalue <= 101.25) {
            ordinal = "E"; // E
        } else if (obsvalue >= 101.26 && obsvalue <= 123.75) {
            ordinal = "ESE"; // ESE
        } else if (obsvalue >= 123.76 && obsvalue <= 146.25) {
            ordinal = "SE"; // SE
        } else if (obsvalue >= 146.26 && obsvalue <= 168.75) {
            ordinal = "SSE"; // SSE
        } else if (obsvalue >= 168.76 && obsvalue <= 191.25) {
            ordinal = "S"; // S
        } else if (obsvalue >= 191.26 && obsvalue <= 213.75) {
            ordinal = "SSW"; // SSW
        } else if (obsvalue >= 213.76 && obsvalue <= 236.25) {
            ordinal = "SW"; // SW
        } else if (obsvalue >= 236.26 && obsvalue <= 258.75) {
            ordinal = "WSW"; // WSW
        } else if (obsvalue >= 258.76 && obsvalue <= 281.25) {
            ordinal = "W"; // W
        } else if (obsvalue >= 281.26 && obsvalue <= 303.75) {
            ordinal = "WNW"; // WNW
        } else if (obsvalue >= 303.76 && obsvalue <= 326.25) {
            ordinal = "NW"; // NW
        } else if (obsvalue >= 326.26 && obsvalue <= 348.75) {
            ordinal = "NNW"; // NNW
        } else if (obsvalue >= 348.76 && obsvalue <= 360) {
            ordinal = "N"; // N
        }

        // highchartsReturn returns the full wind direction string for highcharts tooltips. e.g "NNW (337)"
        if (highchartsReturn) {
            output = ordinal + " (" + Math.round(obsvalue) + "\xBA)";
        } else {
            output = ordinal;
        }
    } else {
        try {
            // Setup any graphs.conf overrides on formatting
            var {decimals, decimalPoint, thousandsSep} = numberFormat;

            // Try to apply the highcharts numberFormat for locale awareness. Use rounding from weewx.conf StringFormats.
            // -1 is set from Python to notate no rounding data available and decimals from graphs.conf is undefined.
            if (rounding == "-1" && typeof decimals === "undefined") {
                output = Highcharts.numberFormat(obsvalue);
            } else {
                // If the amount of decimal is defined, use that instead since rounding is provided to the function.
                if (typeof decimals !== "undefined") {
                    rounding = decimals;
                }
                // If decimalPoint is undefined, use the auto detect from the skin since this comes from the skin.
                if (typeof decimalPoint === "undefined") {
                    decimalPoint = ".";
                }
                // If thousandsSep is undefined, use the auto detect from the skin since this comes from the skin.
                if (typeof thousandsSep === "undefined") {
                    thousandsSep = ",";
                }

                output = Highcharts.numberFormat(obsvalue, rounding, decimalPoint, thousandsSep);
            }
        } catch (err) {
            // Fall back to just returning the highcharts point number value, which is a best guess.
            output = Highcharts.numberFormat(obsvalue);
        }
    }

    return output;
}

// Handle wind arrow rotation with the ability to "rollover" past 0 
// without spinning back around. e.g 350 to 3 would normally spin back around
// https://stackoverflow.com/a/19872672/1177153
function rotateThis(newRotation) {
    if (newRotation == "N/A") {return;}
    belchertown_debug("rotateThis: rotating to " + newRotation);
    var currentRotation;
    finalRotation = finalRotation || 0; // if finalRotation undefined or 0, make 0, else finalRotation
    currentRotation = finalRotation % 360;
    if (currentRotation < 0) {currentRotation += 360;}
    if (currentRotation < 180 && (newRotation > (currentRotation + 180))) {finalRotation -= 360;}
    if (currentRotation >= 180 && (newRotation <= (currentRotation - 180))) {finalRotation += 360;}
    finalRotation += (newRotation - currentRotation);
    jQuery(".wind-arrow").css("transform", "rotate(" + finalRotation + "deg)");
    jQuery(".arrow").css("transform", "rotate(" + finalRotation + "deg)");
}

// Title case strings. https://stackoverflow.com/a/45253072/1177153
function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}

function autoTheme(sunset_hour, sunset_min, sunrise_hour, sunrise_min) {
    // First check if ?theme= is in URL. If so, bail out and do not change anything. 
    if (getURLvar("theme") && getURLvar("theme") != "auto") {
        belchertown_debug("Auto theme: theme override detected in URL. Skipping auto theme");
        return true;
    }
    belchertown_debug("Auto theme: checking to see if theme needs to be switched");

    var d = new Date();
    var nowHour = d.getHours();
    var nowMinutes = d.getMinutes();
    nowHour = nowHour;
    sunrise_hour = sunrise_hour;
    sunset_hour = sunset_hour;

    // Determine if it's day time. https://stackoverflow.com/a/14718577/1177153
    if (sunrise_hour <= nowHour && nowHour < sunset_hour) {
        dayTime = true;
    } else {
        dayTime = false;
    }

    belchertown_debug("Auto theme: sunrise: " + sunrise_hour);
    belchertown_debug("Auto theme: now: " + nowHour);
    belchertown_debug("Auto theme: sunset: " + sunset_hour);
    belchertown_debug("Auto theme: are we in daylight hours: " + dayTime);
    belchertown_debug("Auto theme: sessionStorage.getItem('theme') = " + sessionStorage.getItem('theme'));

    if (dayTime == true) {
        // Day time, set light if needed
        // Only change theme if user has not overridden the auto option with the toggle
        if (sessionStorage.getItem('theme') == "auto") {
            belchertown_debug("Auto theme: setting light theme since dayTime variable is true (day)");
            changeTheme("light");
        } else {
            belchertown_debug("Auto theme: cannot set light theme since visitor used toggle to override theme. Refresh to reset the override.");
        }
    } else {
        // Night time, set dark if needed
        // Only change theme if user has not overridden the auto option with the toggle
        if (sessionStorage.getItem('theme') == "auto") {
            belchertown_debug("Auto theme: setting dark theme since dayTime variable is false (night)");
            changeTheme("dark");
        } else {
            belchertown_debug("Auto theme: cannot set dark theme since visitor used toggle to override theme. Refresh to reset the override.");
        }
    }
}

function changeTheme(themeName, toggleOverride = false) {
    belchertown_debug("Theme: Changing to " + themeName);
    // If the configured theme is auto, but the user toggles light/dark, remove the auto option.
    if (toggleOverride) {
        belchertown_debug("Theme: toggle override clicked.");
        belchertown_debug("Theme: sessionStorage.getItem('theme') was previously: " + sessionStorage.getItem('theme'));
        // This was applied only to auto theme config, but now it's applied to all themes so visitor has full control on light/dark mode
        //if ( sessionStorage.getItem('theme') == "auto" ) { }
        sessionStorage.setItem('theme', 'toggleOverride');
        belchertown_debug("Theme: sessionStorage.getItem('theme') is now: " + sessionStorage.getItem('theme'));
    }
    if (themeName == "dark") {
        // Apply dark theme
        jQuery('body').addClass("dark");
        jQuery('body').removeClass("light");
        jQuery("#themeSwitch").prop("checked", true);
        sessionStorage.setItem('currentTheme', 'dark');
    } else if (themeName == "light") {
        // Apply light theme
        jQuery('body').addClass("light");
        jQuery('body').removeClass("dark");
        jQuery("#themeSwitch").prop("checked", false);
        sessionStorage.setItem('currentTheme', 'light');
    }
}

async function ajaxweewx() {
    resp = await fetch(get_relative_url() + "/json/weewx_data.json");
    if (!resp.ok) {
        throw new Error("HTTP error! Unable to load weewx_data.json");
    } else {
        return await resp.json();
    }
}

// Update weewx data elements
//var station_obs_array = "";
var unit_rounding_array = "";
var unit_label_array = "";
var weewx_data = "";
function update_weewx_data(data) {
    belchertown_debug("Updating weewx data");
    weewx_data = data;
    

    //station_obs_array = data["station_observations"];
    unit_rounding_array = data["unit_rounding"];
    unit_label_array = data["unit_label"];

    // Daily High Low
    high = data["day"]["outTemp"]["max"];
    low = data["day"]["outTemp"]["min"];
    jQuery(".high").html(high);
    jQuery(".low").html(low);

    try {
        // Barometer trending by finding a negative number
        count = (data["current"]["barometer_trend"].match(/-/g) || []).length
    } catch (err) {
        // Returned "current" data does not have this value
    }

    if (count >= 1) {
        jQuery(".pressure-trend").html('<i class="fa fa-arrow-down barometer-down"></i>');
    } else {
        jQuery(".pressure-trend").html('<i class="fa fa-arrow-up barometer-up"></i>');
    }

    // Daily max gust span
    jQuery(".dailymaxgust").html(parseFloat(data["day"]["wind"]["max"]).toFixed(1));

    // Daily Snapshot Stats Section
    try {
        jQuery(".snapshot-records-today-header").html(tzAdjustedMoment(data["current"]["epoch"]).format('dddd, LL'));
        jQuery(".snapshot-records-month-header").html(tzAdjustedMoment(data["current"]["epoch"]).format('MMMM YYYY'));
    } catch (err) {
        // Returned "current" data does not have this value
    }


    jQuery(".dailystatshigh").html(data["day"]["outTemp"]["max"]);
    jQuery(".dailystatslow").html(data["day"]["outTemp"]["min"]);
    jQuery(".dailystatswindavg").html(data["day"]["wind"]["average"]);
    jQuery(".dailystatswindmax").html(data["day"]["wind"]["max"]);
    jQuery(".dailystatsrain").html(data["day"]["rain"]["sum"]);
    jQuery(".dailystatsrainrate").html(data["day"]["rain"]["max"]);
    jQuery(".dailywindrun").html(data["day"]["wind"]["windrun"]);

    // Month Snapshot Stats Section
    jQuery(".monthstatshigh").html(data["month"]["outTemp"]["max"]);
    jQuery(".monthstatslow").html(data["month"]["outTemp"]["min"]);
    jQuery(".monthstatswindavg").html(data["month"]["wind"]["average"]);
    jQuery(".monthstatswindmax").html(data["month"]["wind"]["max"]);
    jQuery(".monthstatsrain").html(data["month"]["rain"]["sum"]);
    jQuery(".monthstatsrainrate").html(data["month"]["rain"]["max"]);

    // Sunrise and Sunset            
    jQuery(".sunrise-value").html(tzAdjustedMoment(parseFloat(data["almanac"]["sunrise_epoch"]).toFixed(0)).format("LT"));
    jQuery(".sunset-value").html(tzAdjustedMoment(parseFloat(data["almanac"]["sunset_epoch"]).toFixed(0)).format("LT"));
    jQuery(".moonrise-value").html(tzAdjustedMoment(parseFloat(data["almanac"]["moon"]["moon_rise_epoch"]).toFixed(0)).format("LT"));
    jQuery(".moonset-value").html(tzAdjustedMoment(parseFloat(data["almanac"]["moon"]["moon_set_epoch"]).toFixed(0)).format("LT"));

    // Moon icon, phase and illumination percent
    jQuery(".moon-icon").html(moon_icon(data["almanac"]["moon"]["moon_index"]));        
    jQuery(".moon-phase").html(titleCase(data["almanac"]["moon"]["moon_phase"])); // Javascript function above
    jQuery(".moon-visible").html("<strong>" + data["almanac"]["moon"]["moon_fullness"] + "%</strong> visible");
    // Close current modal if open
    jQuery('#almanac').modal('hide');
    jQuery(".almanac-extras-modal-body").html(data["almanac"]["almanac_extras_modal_html"]);
    try {
        almanac_updated = "Last Updated " + tzAdjustedMoment(data["current"]["datetime_raw"]).format("LL, LTS");
        jQuery(".almanac_last_updated").html(almanac_updated);
    } catch (err) {
        // Returned "current" data does not have this value
    }
}

//  function returns html for moon-icon according to moonphase value and currentTheme setting
function moon_icon(moonphase){
    
    var moon_icon_dict = {
        "0": "<div class='wi wi-moon-new'></div>",
        "1": "<div class='wi wi-moon-waxing-crescent-3 northern-hemisphere'></div>",
        "2": "<div class='wi wi-moon-first-quarter northern-hemisphere'></div>",
        "3": "<div class='wi wi-moon-waxing-gibbous-3 northern-hemisphere'></div>",
        "4": "<div class='wi wi-moon-full'></div>",
        "5": "<div class='wi wi-moon-waning-gibbous-3 northern-hemisphere'></div>",
        "6": "<div class='wi wi-moon-third-quarter northern-hemisphere'></div>",
        "7": "<div class='wi wi-moon-waning-crescent-4 northern-hemisphere'></div>",
    }
    
    var output = moon_icon_dict[moonphase];
    if (sessionStorage.getItem('currentTheme') === 'dark') {
        return output;
    } else {
        return output.replace('-moon-','-moon-alt-');
    }
}

//  function to display selected forecast according to value of interval (1, 3 or 24); 0 hides all forecasts
function forecast_select(interval) {
        if (interval == 0) {
            jQuery(".forecastrow").hide();
        } else {
            oldinterval = sessionStorage.getItem("forecastInterval");
            if (interval != oldinterval) {
                //  hide the old forecast
                var forecast = document.getElementById((oldinterval + "hour-selected-forecast"));
                var button = document.getElementById(("button" + oldinterval));
                if (forecast != null) forecast.style.display = "none";
                if (button != null) button.style.borderStyle = "hidden";
                //  display the new forecast and store its interval value
                forecast = document.getElementById((interval + "hour-selected-forecast"));
                button = document.getElementById(("button" + interval));
                if (forecast != null) forecast.style.display = "block";
                if (button != null) button.style.borderStyle = "solid";
                sessionStorage.setItem("forecastInterval", interval);
            }
        }
    }

function forecast_default(interval) {
        sessionStorage.setItem("defaultInterval", interval);
    }

//  function adjusts daytime format for forecast_1hr & _3hr; assumes "ddd LT" format for daytime
function forecast_time(i, interval, daytime) {
    if ((daytime.indexOf(" ") == -1) || (interval == "forecast_24hr")) return daytime;
    var output = daytime
    var strday = daytime.substr(0, daytime.indexOf(" "));
    var strtime = daytime.substr(daytime.indexOf(" ") + 1);
    if (interval == "forecast_1hr") {
        if ((i == 0) || (strtime == "00:00") || (strtime == "12:00 AM")) {
            output = strtime + "<br>" + strday;
        } else {
            output = strtime + "<br>";
        }
    } else if (interval == "forecast_3hr") {
        if ((i != 0) && ((strtime > "02:59") || (strtime > "02:59 AM"))) {
            output = strtime;
        }
    }
    return output;
}

//============================================//
// Live website using MQTT Websockets enabled //
//============================================//

var mqttConnected = false;

function ajaximages(section = false, reload_timer_interval_seconds = false) {
    // This function only runs if the elements have an img src.
    // Update images within the specific section
    if (!section || section == "radar") {
        belchertown_debug("Updating radar image");
    // Reload images
        if (document.querySelectorAll(".radar-map img").length > 0) {
            var radar_img = document.querySelectorAll(".radar-map img")[0].src;
            var new_radar_img = radar_img + "&t=" + Math.floor(Math.random() * 999999999);
            document.querySelectorAll(".radar-map img")[0].src = new_radar_img;
            //var radar_html = jQuery('.radar-map').children('img').attr('src').split('?')[0] // Get the img src and remove everything after "?" so we don't stack ?'s onto the image during updates
            //jQuery('.radar-map').children('img').attr('src', radar_html + "?" + Math.floor(Math.random() * 999999999));
        }
        // Reload iframe - https://stackoverflow.com/a/4249946/1177153
        if (document.querySelectorAll(".radar-map iframe").length > 0) {
            jQuery(".radar-map iframe").each(function() {
                jQuery(this).attr('src', function(i, val) {return val;});
            });
        }
        } else if (!section || section != "radar") {
        belchertown_debug("Updating " + section + " images");
        // Reload images
        jQuery('.' + section + ' img').each(function() {
            new_image_url = jQuery(this).attr('src').split('?')[0] + "?" + Math.floor(Math.random() * 999999999);
            jQuery(this).attr('src', new_image_url);
        });
        // Reload iframes
        jQuery('.' + section + ' iframe').each(function() {
            jQuery(this).attr('src', function(i, val) {return val;});
        });
    }
    // Set the new timer
    if (reload_timer_interval_seconds) {
        var reload_timer_ms = reload_timer_interval_seconds * 1000; // convert to millis
        setTimeout(function() {ajaximages(section, reload_timer_interval_seconds);}, reload_timer_ms);
    }
}

var reconnect_using_inactive_timestamp = false;
var inactive_timestamp = "";

// MQTT connect
function connect() {
    if (reconnect_using_inactive_timestamp) {
            updated = tzAdjustedMoment(inactive_timestamp).format("LL, LTS");
        } else {
            updated = tzAdjustedMoment("1696590960").format("LL, LTS");
        }
    reported = "Connecting to weather station real time data. Last Updated " + updated;
    jQuery(".updated").html(reported);
    jQuery(".onlineMarker").hide();
    jQuery(".offlineMarker").hide();
    jQuery(".loadingMarker").show();

    belchertown_debug("MQTT: Connecting to MQTT Websockets: localhost 9001 (SSL Disabled)");
    var useSSL = false;
    client = new Paho.Client("localhost", 9001, mqttclient);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    var options = {
        useSSL: useSSL,
        userName:"anasudin",
        password:"qwerty123",
        // mqttVersion: 4 is spec MQTTv3.1.1 - mqttVersion: 3 is spec MQTTv3.1
        mqttVersion: 4,
        // If mqttVersionExplicit is true, it will force the connection to use the selected MQTT Version or will fail to connect.
        // If mqttVersionExplicit is false and mqttVersion is 4, it will try mqttVersion: 4 and if it fails it will fallback to mqttVersion: 3
        // Here's the relevant code: https://github.com/eclipse/paho.mqtt.javascript/blob/f5859463aba9a9b7c19f99ab7c4849a723f8d832/src/paho-mqtt.js#L1610
        mqttVersionExplicit: false,
        reconnect: true,
        onSuccess: onConnect,
        onFailure: onFailure
    }
    client.connect(options);
}

// MQTT connect callback
function onConnect() {
    mqttConnected = true;
    belchertown_debug("MQTT: MQTT Connected. Subscribing.");
    if (reconnect_using_inactive_timestamp) {
        updated = tzAdjustedMoment(inactive_timestamp).format("LL, LTS");
    } else {
        updated = tzAdjustedMoment("1696590960").format("LL, LTS");
    }
    if (pageName == "pi") {
        reported = "Connecting. Last Updated " + updated;
    } else {
        reported = "Connected. Waiting for data. Last Updated " + updated;
    }
    jQuery(".updated").html(reported);
    jQuery(".onlineMarker").hide();
    jQuery(".offlineMarker").hide();
    jQuery(".loadingMarker").show();
    client.subscribe("weather");
    if (getURLvar("stayconnected") && (getURLvar("stayconnected") == "true" || getURLvar("stayconnected") == "1")) {
        belchertown_debug("MQTT: stayconnected URL var found: ignoring disconnect_live_website_visitor value");
    } else {
        if  (pageName == "pi" || pageName == "kiosk.html") {
            belchertown_debug("MQTT: ignoring disconnect_live_website_visitor value for page: " + pageName);
        }
        else {
            var activityTimeout = setTimeout(inactive, 1800000); // Stop automatic ajax refresh
        }
    }
}

// MQTT Failure
function onFailure() {
    mqttConnected = false;
    jQuery(".onlineMarker").hide();
    jQuery(".offlineMarker").show();
    jQuery(".loadingMarker").hide();
    var d = new Date();
    epoch = parseFloat((d / 1000)).toFixed(0); // Convert millis to seconds
    if (client.isConnected()) {
        updated = tzAdjustedMoment(epoch).format("LL, LTS");
    } else {
        updated = tzAdjustedMoment("1696590960").format("LL, LTS");
    }
    jQuery(".updated").html("Failed connecting to the weather station. Please try again later! Last Updated " + updated);
    console.log("MQTT: " + tzAdjustedMoment(epoch).format() + ": Cannot connect to MQTT broker");
}

// MQTT connection lost
function onConnectionLost(responseObject) {
    mqttConnected = false;
    jQuery(".onlineMarker").hide();
    jQuery(".offlineMarker").show();
    jQuery(".loadingMarker").hide();
    var d = new Date();
    epoch = parseFloat((d / 1000)).toFixed(0);  // Convert millis to seconds
    if (client.isConnected()) {
        updated = tzAdjustedMoment(epoch).format("LL, LTS");
    } else {
        updated = tzAdjustedMoment("1696590960").format("LL, LTS");
    }
    jQuery(".updated").html("Lost connection to the weather station. Please try again later! Last Updated " + updated);
    if (responseObject.errorCode !== 0) {
        console.log("MQTT: " + tzAdjustedMoment(epoch).format() + ": mqtt Connection Lost: " + responseObject.errorMessage);
    }
}

function inactive() {
    client.disconnect(); // Disconnect mqtt
    belchertown_debug("MQTT: Inactive timer expired. MQTT Disconnected");
    jQuery(".onlineMarker").hide(); // Hide online beacon
    jQuery(".offlineMarker").show(); // Show offline beacon
    jQuery(".loadingMarker").hide(); // Hide loading beacon
    var d = new Date();
    epoch = parseFloat((d / 1000)).toFixed(0);  // Convert millis to seconds
    updated = tzAdjustedMoment(epoch).format("LL, LTS");
    jQuery(".updated").html("Live updates have stopped. Last Updated " + updated + " <button type='button' class='btn btn-primary restart-interval'>Continue live updates</button>");
    reconnect_using_inactive_timestamp = true; // Set a flag to use the inactive timestamp in case we reconnect we have the latest last updated time
    inactive_timestamp = epoch; // Store this timestamp in case we reconnect
}

var mqtt_payload = "";
// New message from mqtt, process it
function onMessageArrived(message) {
    belchertown_debug("MQTT: " + message.payloadString);
    update_current_wx(message.payloadString);
    mqtt_payload = jQuery.parseJSON(message.payloadString);
}

function refreshHooks() {
    // Empty function for hooks to extend/re-use
    //belchertown_debug(mqtt_payload);
}

// Handle MQTT message
function update_current_wx(data) {
    data = jQuery.parseJSON(data);

    try {
        refreshHooks();
    } catch (e) {
    }
    

    // This message is a weewx archive update. Update weewx data, forecast data and highcharts graphs
    if (data.hasOwnProperty("interval_minute")) {
        // Delays are recommended to allow the other skins to complete processing
        belchertown_debug("MQTT: MQTT message indicates this is an archive interval.");
        if (pageName == "pi" || pageName == "kiosk.html") {
            belchertown_debug("Skipping chart update for page " + pageName + ", no charts to be updated.");
        }
        else {
            setTimeout(showChart, 30000, homepage_graphgroup); // Load updated charts.
        }
        ajaxweewx().then(function(weewx_data) { // This call will make sure json/weewx_data.json is loaded before anything else
            setTimeout(update_weewx_data.bind(null, weewx_data), 10000); // Initial call to update (date, daily high, low, etc)
            setTimeout(belchertown_debug.bind(null, weewx_data), 10000); // Make weewx_data.json available in debugging console
        }).catch(function(e) {
            console.log(e);
        });
    } else {
        // Only show the updated time on non-archive packets
        epoch = parseFloat(data["dateTime"]).toFixed(0);
        updated = tzAdjustedMoment(epoch).format("LL, LTS");
        if (pageName == "pi") {
            updated_text = "Connected. Received " + updated;
        } else {
            updated_text = "Connected to weather station live. Data received " + updated;
        }
        jQuery(".updated").html(updated_text);
    }
    // If we're in this function, show the online beacon and hide the others
    jQuery(".onlineMarker").show(); // Show the online beacon
    jQuery(".offlineMarker").hide();
    jQuery(".loadingMarker").hide();

    // Update the station observation box elements
    station_mqtt_data = Object.keys(data); // Turn data (mqtt message) into an object we can forEach
    // Get all span elements within the table. This is setup by Python initially
    jQuery('.station-observations').find("span").each(function() {
        // The class name is the same as the Extras.station_observations name (weewx schema)
        thisElementClass = jQuery(this).attr("class")
        // Loop through each MQTT payload item
        station_mqtt_data.forEach(mqttdata => {
            if (thisElementClass == "rainWithRainRate") {
                // Force dayRain since that's the MQTT payload name
                thisElementClass = "dayRain";
            }
            if (thisElementClass == "barometer" || thisElementClass == "pressure" || thisElementClass == "altimeter" || thisElementClass == "cloudbase") {
                // Do not group number into thousands,hundreds format
                localeStringUseGrouping = false;
            } else {
                localeStringUseGrouping = true;
            }
            // If this MQTT payload key begins with the name of the span class name, update the info. Can also use mqttdata.includes(thisElementClass) if weewx-mqtt changes in future
            if (mqttdata.startsWith(thisElementClass)) {
                html_output = parseFloat(parseFloat(data[mqttdata])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array[thisElementClass], maximumFractionDigits: unit_rounding_array[thisElementClass], useGrouping: localeStringUseGrouping}) + unit_label_array[thisElementClass];

                // Finally update the element class
                jQuery("." + thisElementClass).html(html_output);
            }
        });
    });
    // End dynamic station observation box

    // Temperature F
    if (data.hasOwnProperty("outTemp_F")) {
        // Inside parseFloat converts str to int. Outside parseFloat processes the locale string
        // Help from: https://stackoverflow.com/a/40152286/1177153 and https://stackoverflow.com/a/31581206/1177153
        outTemp = parseFloat(parseFloat(data["outTemp_F"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["outTemp"], maximumFractionDigits: unit_rounding_array["outTemp"]});
        get_outTemp_color("degree_F", outTemp);
        jQuery(".outtemp").html(outTemp);

        // Feels like temp as defined by NOAA's "Apparent Temperature" at: http://www.nws.noaa.gov/ndfd/definitions.htm
        //if ( data["outTemp_F"] <= 50 ) {
        //    jQuery(".feelslike").html( "Feels like: " + parseFloat(parseFloat(data["windchill_F"])).toLocaleString("en-US", {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "  &#176;C" );
        //} else if ( data["outTemp_F"] >= 80 ) {
        //    jQuery(".feelslike").html( "Feels like: " + parseFloat(parseFloat(data["heatindex_F"])).toLocaleString("en-US", {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "  &#176;C" );
        //} else {
        //    jQuery(".feelslike").html( "Feels like: " + parseFloat(parseFloat(data["outTemp_F"])).toLocaleString("en-US", {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "  &#176;C" );
        //}
    }

    // Temperature C
    if (data.hasOwnProperty("outTemp_C")) {
        outTemp = parseFloat(parseFloat(data["outTemp_C"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["outTemp"], maximumFractionDigits: unit_rounding_array["outTemp"]});
        get_outTemp_color("degree_C", outTemp);
        jQuery(".outtemp").html(outTemp);
    }

    // Apparent Temperature US
    if (data.hasOwnProperty("appTemp_F")) {
        jQuery(".feelslike").html("Feels like: " + parseFloat(parseFloat(data["appTemp_F"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["outTemp"], maximumFractionDigits: unit_rounding_array["outTemp"]}) + "  &#176;C");
    }

    // Apparent Temperature Metric
    if (data.hasOwnProperty("appTemp_C")) {
        jQuery(".feelslike").html("Feels like: " + parseFloat(parseFloat(data["appTemp_C"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["outTemp"], maximumFractionDigits: unit_rounding_array["outTemp"]}) + "  &#176;C");
    }

    // Wind
    if (data.hasOwnProperty("windDir")) {
        // No toLocaleString() here since there is no float decimal needed.
        rotateThis(data["windDir"]);
        //jQuery(".wind-arrow").css( "transform", "rotate(" + data["windDir"] + "deg)" );
        jQuery(".curwinddeg").html(parseFloat(data["windDir"]).toFixed(0) + "&deg;");
        jQuery(".curwinddir").html(highcharts_tooltip_factory(parseFloat(data["windDir"]).toFixed(0), "windDir"));
    }

    // Windspeed US
    if (data.hasOwnProperty("windSpeed_mph")) {
        jQuery(".curwindspeed").html(parseFloat(parseFloat(data["windSpeed_mph"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windSpeed"], maximumFractionDigits: unit_rounding_array["windSpeed"]}));
    }
    // Windspeed Metric
    if (data.hasOwnProperty("windSpeed_kph")) {
        jQuery(".curwindspeed").html(parseFloat(parseFloat(data["windSpeed_kph"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windSpeed"], maximumFractionDigits: unit_rounding_array["windSpeed"]}));
    }
    // Windspeed METRICWX
    if (data.hasOwnProperty("windSpeed_mps")) {
        jQuery(".curwindspeed").html(parseFloat(parseFloat(data["windSpeed_mps"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windSpeed"], maximumFractionDigits: unit_rounding_array["windSpeed"]}));
    }
    // Windspeed Beaufort
    if (data.hasOwnProperty("windSpeed_beaufort")) {
        jQuery(".curwindspeed").html(parseFloat(parseFloat(data["windSpeed_beaufort"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windSpeed"], maximumFractionDigits: unit_rounding_array["windSpeed"]}));
    }
    // Windspeed knots
    if (data.hasOwnProperty("windSpeed_knot")) {
        jQuery(".curwindspeed").html(parseFloat(parseFloat(data["windSpeed_knot"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windSpeed"], maximumFractionDigits: unit_rounding_array["windSpeed"]}));
    }

    // Beaufort

    // Wind Gust US
    // May not be provided in mqtt, but just in case.
    if (data.hasOwnProperty("windGust_mph")) {
        jQuery(".curwindgust").html(parseFloat(parseFloat(data["windGust_mph"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windGust"], maximumFractionDigits: unit_rounding_array["windGust"]}));
    }
    // Wind Gust Metric
    if (data.hasOwnProperty("windGust_kph")) {
        jQuery(".curwindgust").html(parseFloat(parseFloat(data["windGust_kph"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windGust"], maximumFractionDigits: unit_rounding_array["windGust"]}));
    }
    // Wind Gust METRICWX
    if (data.hasOwnProperty("windGust_mps")) {
        jQuery(".curwindgust").html(parseFloat(parseFloat(data["windGust_mps"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windGust"], maximumFractionDigits: unit_rounding_array["windGust"]}));
    }
    // Wind Gust Beaufort
    if (data.hasOwnProperty("windGust_beaufort")) {
        jQuery(".curwindgust").html(parseFloat(parseFloat(data["windGust_beaufort"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windSpeed"], maximumFractionDigits: unit_rounding_array["windSpeed"]}));
    }
    // Windspeed knots
    if (data.hasOwnProperty("windGust_knot")) {
        jQuery(".curwindgust").html(parseFloat(parseFloat(data["windGust_knot"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windSpeed"], maximumFractionDigits: unit_rounding_array["windSpeed"]}));
    }

    // Windchill US
    if (data.hasOwnProperty("windchill")) {
        jQuery(".curwindchill").html(parseFloat(parseFloat(data["windchill"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windchill"], maximumFractionDigits: unit_rounding_array["windchill"]}) + " &#176;C");
    }
    // Windchill Metric
    if (data.hasOwnProperty("windchill_C")) {
        jQuery(".curwindchill").html(parseFloat(parseFloat(data["windchill_C"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windchill"], maximumFractionDigits: unit_rounding_array["windchill"]}) + " &#176;C");
    }
};


Highcharts.setOptions({
    global: {
        //useUTC: false
        timezoneOffset: -420.0
    },
    lang: {
        months: moment.months(),
        shortMonths: moment.monthsShort(),
        weekdays: moment.weekdays(),
        shortWeekdays: moment.weekdaysShort(),
        decimalPoint: ".",
        thousandsSep: ","
    }
});

function showChart(json_file, prepend_renderTo = false) {

    // Relative URL by finding what page we're on currently.
    jQuery.getJSON(get_relative_url() + '/json/' + json_file + '.json', function(data) {

        // Loop through each chart name (e.g. chart1, chart2, chart3)
        jQuery.each(data, function(plotname, obsname) {
            var observation_type = undefined;

            // Ignore the Belchertown Version since this "plot" has no other options
            if (plotname == "belchertown_version") {
                return true;
            }

            // Ignore the generated timestamp since this "plot" has no other options
            if (plotname == "generated_timestamp") {
                return true;
            }

            // Ignore the chartgroup_title since this "plot" has no other options
            if (plotname == "chartgroup_title") {
                return true;
            }

            // Set the chart's tooltip date time format, then return since this "plot" has no other options
            if (plotname == "tooltip_date_format") {
                tooltip_date_format = obsname;
                return true;
            }

            // Set the chart colors, then return right away since this "plot" has no other options
            if (plotname == "colors") {
                colors = obsname.split(",");
                return true;
            }

            // Set the chart credits, then return right away since this "plot" has no other options
            if (plotname == "credits") {
                credits = obsname.split(",")[0];
                return true;
            }

            // Set the chart credits url, then return right away since this "plot" has no other options
            if (plotname == "credits_url") {
                credits_url = obsname.split(",")[0];
                return true;
            }

            // Set the chart credits position, then return right away since this "plot" has no other options
            if (plotname == "credits_position") {
                credits_position = obsname;
                return true;
            }

            // Loop through each chart options
            jQuery.each(data[plotname]["options"], function(optionName, optionVal) {
                switch (optionName) {
                    case "type":
                        type = optionVal;
                        break;
                    case "renderTo":
                        renderTo = optionVal;
                        break;
                    case "title":
                        title = optionVal;
                        break;
                    case "subtitle":
                        subtitle = optionVal;
                        break;
                    case "yAxis_label":
                        yAxis_label = optionVal;
                        break;
                    case "chart_group":
                        chart_group = optionVal;
                        break;
                    case "gapsize":
                        gapsize = optionVal;
                        break;
                    case "connectNulls":
                        connectNulls = optionVal;
                        break;
                    case "rounding":
                        rounding = optionVal;
                        break;
                    case "xAxis_categories":
                        xAxis_categories = optionVal;
                        break;
                    case "plot_tooltip_date_format":
                        plot_tooltip_date_format = optionVal;
                        break;
                    case "css_class":
                        css_class = optionVal;
                        break;
                    case "css_height":
                        css_height = optionVal;
                        break;
                    case "css_width":
                        css_width = optionVal;
                        break;
                    case "legend":
                        legend_enabled = optionVal;
                        break;
                    case "exporting":
                        exporting_enabled = optionVal;
                        break;
                }
            });

            // Handle any per-chart date time format override
            if (typeof plot_tooltip_date_format !== "undefined") {
                var tooltip_date_format = plot_tooltip_date_format;
            }

            var options = {
                chart: {
                    renderTo: '',
                    spacing: [5, 10, 10, 0],
                    type: '',
                    zoomType: 'x'
                },

                exporting: {
                    chartOptions: {
                        chart: {
                            events: {
                                load: function() {
                                    this.title.update({style: {color: '#e5554e'}});

                                    if (sessionStorage.getItem('currentTheme') === 'dark') {
                                        var darktheme_textcolor = '#fff';
                                        for (var i = this.yAxis.length - 1; i >= 0; i--) {
                                            this.yAxis[i].update({
                                                title: {style: {color: darktheme_textcolor}},
                                                labels: {style: {color: darktheme_textcolor}},
                                                gridLineColor: '#707073',
                                                tickColor: '#707073'
                                            });
                                        }

                                        for (var i = this.xAxis.length - 1; i >= 0; i--) {
                                            this.xAxis[i].update({
                                                title: {style: {color: darktheme_textcolor}},
                                                labels: {style: {color: darktheme_textcolor}},
                                                gridLineColor: '#707073',
                                                tickColor: '#707073'
                                            });
                                        }

                                        this.legend.update({itemStyle: {color: darktheme_textcolor}});

                                        //this.credits.update({style:{color: darktheme_textcolor}});

                                        this.subtitle.update({style: {color: darktheme_textcolor}});

                                        this.chartBackground.attr({fill: jQuery(".highcharts-background").css("fill")});
                                    } else {
                                        var lighttheme_textcolor = '#666666';
                                        for (var i = this.yAxis.length - 1; i >= 0; i--) {
                                            this.yAxis[i].update({
                                                title: {style: {color: lighttheme_textcolor}},
                                                labels: {style: {color: lighttheme_textcolor}},
                                            });
                                        }

                                        for (var i = this.xAxis.length - 1; i >= 0; i--) {
                                            this.xAxis[i].update({
                                                title: {style: {color: lighttheme_textcolor}},
                                                labels: {style: {color: lighttheme_textcolor}},
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    },
                    // scale: 1,
                    // width: 1000,
                    // sourceWidth: 1000,
                    enabled: JSON.parse(String(exporting_enabled)) // Convert string to bool
                },

                title: {
                    useHTML: true,
                    text: ''
                },

                subtitle: {
                    text: ''
                },

                legend: {
                    enabled: JSON.parse(String(legend_enabled)) // Convert string to bool
                },

                xAxis: {
                    dateTimeLabelFormats: {
                        day: '%e %b',
                        week: '%e %b',
                        month: '%b %y',
                    },
                    lineColor: '#555',
                    minRange: 900000,
                    minTickInterval: 900000,
                    title: {
                        style: {
                            font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                        }
                    },
                    ordinal: false,
                    type: 'datetime'
                },

                yAxis: [{
                    endOnTick: true,
                    lineColor: '#555',
                    minorGridLineWidth: 0,
                    startOnTick: true,
                    showLastLabel: true,
                    title: {
                    },
                    opposite: false
                }],

                plotOptions: {
                    area: {
                        lineWidth: 2,
                        gapSize: '',
                        gapUnit: 'value',
                        marker: {
                            enabled: false,
                            radius: 2
                        },
                        threshold: null,
                        softThreshold: true
                    },
                    line: {
                        lineWidth: 2,
                        gapSize: '',
                        gapUnit: 'value',
                        marker: {
                            enabled: false,
                            radius: 2
                        },
                    },
                    spline: {
                        lineWidth: 2,
                        gapSize: '',
                        gapUnit: 'value',
                        marker: {
                            enabled: false,
                            radius: 2
                        },
                    },
                    areaspline: {
                        lineWidth: 2,
                        gapSize: '',
                        gapUnit: 'value',
                        marker: {
                            enabled: false,
                            radius: 2
                        },
                        threshold: null,
                        softThreshold: true
                    },
                    scatter: {
                        gapSize: '',
                        gapUnit: 'value',
                        marker: {
                            radius: 2
                        },
                    },
                },

                // Highstock is needed for gapsize. Disable these 3 to make it look like standard Highcharts
                scrollbar: {
                    enabled: false
                },
                navigator: {
                    enabled: false
                },
                rangeSelector: {
                    enabled: false
                },

                tooltip: {
                    enabled: true,
                    crosshairs: true,
                    dateTimeLabelFormats: {
                        hour: '%e %b %H:%M'
                    },
                    // For locale control with moment.js
                    formatter: function(tooltip) {
                        try {
                            // The first returned item is the header, subsequent items are the points.
                            // Mostly applies to line style charts (line, spline, area)
                            return [tzAdjustedMoment(this.x / 1000).format(tooltip_date_format)].concat(
                                this.points.map(function(point) {
                                    // If observation_type is in the series array, use that otherwise use the obsType
                                    var point_obsType = point.series.userOptions.observation_type ? point.series.userOptions.observation_type : point.series.userOptions.obsType;
                                    var rounding = point.series.userOptions.rounding;
                                    var mirrored = point.series.userOptions.mirrored_value;
                                    var numberFormat = point.series.userOptions.numberFormat ? point.series.userOptions.numberFormat : "";
                                    return "<span style='color:" + point.series.color + "'>\u25CF</span> " + point.series.name + ': ' + highcharts_tooltip_factory(point.y, point_obsType, true, rounding, mirrored, numberFormat);
                                })
                            );
                        } catch (e) {
                            // There's an error so check if it's windDir to apply wind direction label, or if it's a scatter. If none of those revert back to default tooltip.
                            if (this.series.userOptions.obsType == "windDir" || this.series.userOptions.observation_type == "windDir") {
                                // If observation_type is in the series array, use that otherwise use the obsType
                                var point_obsType = this.series.userOptions.observation_type ? this.series.userOptions.observation_type : this.series.userOptions.obsType;
                                var rounding = this.series.userOptions.rounding;
                                var mirrored = this.series.userOptions.mirrored_value;
                                return tzAdjustedMoment(this.x / 1000).format(tooltip_date_format) + '<br><b>' + highcharts_tooltip_factory(this.point.y, point_obsType, true, rounding, mirrored);
                            } else if (this.series.userOptions.type == "scatter") {
                                // Catch anything else that might be a scatter plot. Scatter plots will just show x,y coordinates without this.
                                return "<span style='color:" + this.series.color + "'>\u25CF</span> " + this.series.name + ': ' + Highcharts.numberFormat(this.y);
                            } else {
                                return tooltip.defaultFormatter.call(this, tooltip);
                            }
                        }
                    },
                    split: true,
                },

                credits: {},

                series: [{}]

            };

            // Default options completed, build overrides from JSON and graphs.conf

            // Set the chart render div and title
            if (prepend_renderTo) {
                options.chart.renderTo = json_file + "_" + renderTo;
            } else {
                options.chart.renderTo = renderTo;
            }

            belchertown_debug(options.chart.renderTo + ": building a " + type + " chart");

            if (css_class) {
                jQuery("#" + options.chart.renderTo).addClass(css_class);
                belchertown_debug(options.chart.renderTo + ": div id is " + options.chart.renderTo + " and adding CSS class: " + css_class);
            }

            options.chart.type = type;
            options.title.text = "<a href='#" + options.chart.renderTo + "'>" + title + "</a>"; // Anchor link to chart for direct linking
            options.subtitle.text = subtitle;
            options.plotOptions.area.gapSize = gapsize;
            options.plotOptions.line.gapSize = gapsize;
            options.plotOptions.spline.gapSize = gapsize;
            options.plotOptions.scatter.gapSize = gapsize;
            if (connectNulls == "true") {
                options.plotOptions.series = {connectNulls: connectNulls};
            }
            options.colors = colors;

            // If we have xAxis categories, reset xAxis and populate it from these options. Also need to reset tooltip since there's no datetime for moment.js to use.
            if (xAxis_categories.length >= 1) {
                belchertown_debug(options.chart.renderTo + ": has " + xAxis_categories.length + " xAxis categories. Resetting xAxis and tooltips for grouping");
                options.xAxis = {}
                options.xAxis.categories = xAxis_categories;
                options.tooltip = {}
                options.tooltip = {
                    enabled: true,
                    crosshairs: true,
                    split: true,
                    formatter: function() {
                        // The first returned item is the header, subsequent items are the points
                        return [this.x].concat(
                            this.points.map(function(point) {
                                // If observation_type is in the series array, use that otherwise use the obsType
                                var point_obsType = point.series.userOptions.observation_type ? point.series.userOptions.observation_type : point.series.userOptions.obsType;
                                var rounding = point.series.userOptions.rounding;
                                var mirrored = point.series.userOptions.mirrored_value;
                                var numberFormat = point.series.userOptions.numberFormat ? point.series.userOptions.numberFormat : "";
                                return "<span style='color:" + point.series.color + "'>\u25CF</span> " + point.series.name + ': ' + highcharts_tooltip_factory(point.y, point_obsType, true, rounding, mirrored, numberFormat);
                            })
                        );
                    },
                }
            }

            // Reset the series everytime we loop.
            options.series = [];

            // Build the series
            var i = 0;
            jQuery.each(data[plotname]["series"], function(seriesName, seriesVal) {
                observation_type = data[plotname]["series"][seriesName]["obsType"];
                options.series[i] = data[plotname]["series"][seriesName];
                i++;
            });

            /* yAxis customization handler and label handling
            Take the following example. 
            yAxis is in observation 0 (rainTotal), so that label is caught and set by yAxis1_active. 
            If you move yAxis to observation 1 (rainRate), then the label is caught and set by yAxis_index.
            There may be a more efficient way to do this. If so, please submit a pull request :)
            [[[chart3]]]
                title = Rain
                [[[[rainTotal]]]]
                    name = Rain Total
                    yAxis = 1
                [[[[rainRate]]]]
            */

            var yAxis1_active = undefined;

            // Find if any series have yAxis = 1. If so, save the array number so we can set labels correctly.
            // We really care if yAxis is in array 1+, so we can go back and set yAxis 0 to the right label.
            var yAxis_index = options.series.findIndex(function(item) {return item.yAxis == 1})

            // Handle series specific data, overrides and non-Highcharts options that we passed through
            options.series.forEach(s => {
                if (s.yAxis == "1") {
                    // If yAxis = 1 is set for the observation, add a new yAxis and associate that observation to the right side of the chart
                    yAxis1_active = true;
                    options.yAxis.push({ // Secondary yAxis
                        opposite: true,
                        title: {
                            text: s.yAxis_label,
                        },
                    }),
                        // Associate this series to the new yAxis 1
                        s.yAxis = 1

                    // We may have already passed through array 0 in the series without setting the "multi axis label", go back and explicitly define it.
                    if (yAxis_index >= 1) {
                        options.yAxis[0].title.text = options.series[0].yAxis_label;
                    }
                } else {
                    if (yAxis1_active) {
                        // This yAxis is first in the data series, so we can set labels without needing to double back
                        options.yAxis[0].title.text = s.yAxis_label;
                    } else {
                        // Apply the normal yAxis 0's label without observation name
                        options.yAxis[0].title.text = s.yAxis_label;
                    }
                    // Associate this series to yAxis 1
                    s.yAxis = 0;
                }

                // Run yAxis customizations
                this_yAxis = s.yAxis;

                belchertown_debug(options.chart.renderTo + ": " + s.obsType + " is on yAxis " + this_yAxis);

                // Some charts may require a defined min/max on the yAxis
                options.yAxis[this_yAxis].min = s.yAxis_min !== "undefined" ? s.yAxis_min : null;
                options.yAxis[this_yAxis].max = s.yAxis_max !== "undefined" ? s.yAxis_max : null;

                // Some charts may require a defined soft min/max on the yAxis
                options.yAxis[this_yAxis].softMin = s.yAxis_softMin !== "undefined" ? parseInt(s.yAxis_softMin) : null;
                options.yAxis[this_yAxis].softMax = s.yAxis_softMax !== "undefined" ? parseInt(s.yAxis_softMax) : null;

                // Set the yAxis tick interval. Mostly used for barometer. 
                if (s.yAxis_tickInterval) {
                    options.yAxis[this_yAxis].tickInterval = s.yAxis_tickInterval;
                }

                // Set yAxis minorTicks. This is a graph-wide setting so setting it for any of the yAxis will set it for the graph itself
                if (s.yAxis_minorTicks) {
                    options.yAxis[this_yAxis].minorTicks = true;
                }

                // Barometer chart plots get a higher precision yAxis tick
                if (s.obsType == "barometer") {
                    // Define yAxis label float format if rounding is defined. Default to 2 decimals if nothing defined
                    if (typeof s.rounding !== "undefined") {
                        options.yAxis[this_yAxis].labels = {format: '{value:.' + s.rounding + 'f}'}
                    } else {
                        options.yAxis[this_yAxis].labels = {format: '{value:.2f}'}
                    }
                }

                // Rain, RainRate and rainTotal (special Belchertown skin observation) get yAxis precision
                if (s.obsType == "rain" || s.obsType == "rainRate" || s.obsType == "rainTotal") {
                    options.yAxis[this_yAxis].min = 0;
                    options.yAxis[this_yAxis].minRange = 0.01;
                    options.yAxis[this_yAxis].minorGridLineWidth = 1;
                }

                if (s.obsType == "windDir") {
                    options.yAxis[this_yAxis].tickInterval = 90;
                    options.yAxis[this_yAxis].labels = {
                        useHTML: true,
                        formatter: function() {var value = weatherdirection[this.value]; return value !== 'undefined' ? value : this.value;}
                    }
                }

                // Check if this series has a gapsize override
                if (s.gapsize) {
                    options.plotOptions.area.gapSize = s.gapsize;
                    options.plotOptions.line.gapSize = s.gapsize;
                    options.plotOptions.spline.gapSize = s.gapsize;
                    options.plotOptions.scatter.gapSize = s.gapsize;
                }

                // If this chart is a mirrored chart, make the yAxis labels non-negative
                if (s.mirrored_value) {
                    belchertown_debug(options.chart.renderTo + ": mirrored chart due to mirrored_value = true");
                    options.yAxis[s.yAxis].labels = {formatter: function() {return Math.abs(this.value);}}
                }

                // Lastly, apply any numberFormat label overrides
                if (typeof s.numberFormat !== "undefined" && Object.keys(s.numberFormat).length >= 1) {
                    var {decimals, decimalPoint, thousandsSep} = s.numberFormat
                    options.yAxis[this_yAxis].labels = {formatter: function() {return Highcharts.numberFormat(this.value, decimals, decimalPoint, thousandsSep);}}
                }

            });

            // If windRose is present, configure a special chart to show that data
            if (observation_type == "windRose") {
                var categories = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N/A'];
                options.chart.className = "highcharts-windRose"; // Used for dark mode
                options.chart.type = "column";
                options.chart.polar = true;
                options.chart.alignTicks = false;
                options.pane = {size: '80%'}
                // Reset xAxis and rebuild
                options.xAxis = {}
                options.xAxis.min = 0;
                options.xAxis.max = 16;
                options.xAxis.crosshair = true;
                options.xAxis.categories = categories;
                options.xAxis.tickmarkPlacement = 'on';
                options.xAxis.labels = {useHTML: true}
                //options.legend.align = "right";
                options.legend.verticalAlign = "top";
                options.legend.x = 210;
                options.legend.y = 119;
                options.legend.layout = "vertical";
                options.legend.floating = true;
                options.yAxis[0].min = 0;
                options.yAxis[0].endOnTick = false;
                options.yAxis[0].reversedStacks = false;
                options.yAxis[0].title.text = "Frequency (%)";
                options.yAxis[0].gridLineWidth = 0;
                options.yAxis[0].labels = {enabled: false}
                options.yAxis[0].zIndex = 800;
                options.plotOptions = {
                    column: {
                        stacking: 'normal',
                        shadow: false,
                        groupPadding: 0,
                        pointPlacement: 'on',
                    }
                }
                // Reset the tooltip
                options.tooltip = {}
                options.tooltip.shared = true;
                options.tooltip.valueSuffix = '%';
                options.tooltip.followPointer = true;
                options.tooltip.useHTML = true;

                // Since wind rose is a special observation, I did not re-do the JSON arrays to accomodate it as a separate array.
                // So we need to grab the data array within the series and save it to a temporary array, delete the entire chart series, 
                // and reapply the windrose data back to the series.
                var newSeries = options.series[0].data;
                options.series = [];
                newSeries.forEach(ns => {
                    options.series.push(ns);
                });
            }

            // Configure gauge chart formatting
            if (options.chart.type == "gauge") {
                // Highcharts does not allow the guage background to have rounded ends. To get around
                // this, define a "dummy" series that fills the gauge with the appropriate color.
                // This way, the ends are rounded if the user specifies.
                //
                // Gauge chart works best with only one data point, so the most recent (last) data point
                // is used
                options.series[0].data = [{
                    y: 9999999,
                    color: '#e6e6e6',
                    className: 'highcharts-pane',
                    zIndex: 0,
                    dataLabels: {enabled: false}
                }, {
                    y: options.series[0].data.pop()[1],
                    color: options.series[0].color,
                }]
                options.chart.type = "solidgauge"
                options.pane = {
                    startAngle: -140,
                    endAngle: 140,
                    background: [{
                        outerRadius: 0,
                        innerRadius: 0,
                    }]
                }
                // If user has set colors_enabled, change the color according to the value
                if (options.series[0].colors_enabled) {
                    options.series[0].data[1].color = get_gauge_color(options.series[0].data[1]["y"], options.series[0])
                }
                options.plotOptions = {
                    solidgauge: {
                        dataLabels: {
                            useHTML: true,
                            enabled: true,
                            borderWidth: 0,
                            style: {
                                fontWeight: 'bold',
                                lineHeight: '0.5em',
                                textAlign: 'center',
                                fontSize: '50px',
                                // Match color if set by user
                                color: options.series[0].data[1].color,
                                textOutline: 'none'
                            }
                        },
                    }
                }
                if (get_gauge_label(options.series[0].data[1]["y"], options.series[0])) {
                    options.plotOptions.solidgauge.dataLabels.format = "<span style='text-align:center'>{y:.#f}</span><br><span style='font-size:14px;text-align:center'>" + get_gauge_label(options.series[0].data[1]["y"], options.series[0]) + '</span>'
                    options.plotOptions.solidgauge.dataLabels.y = -25
                } else if (unit_label_array[observation_type] == null) {
                    options.plotOptions.solidgauge.dataLabels.format = "<span style='text-align:center'>{y:.#f}</span>"
                } else {
                    options.plotOptions.solidgauge.dataLabels.format = "<span style='text-align:center'>{y:.#f}</span><br><span style='font-size:20px;text-align:center'>" + unit_label_array[observation_type] + '</span>'
                    options.plotOptions.solidgauge.dataLabels.y = -25
                }
                options.yAxis = {
                    min: 0,
                    max: 100,
                    lineColor: null,
                    tickPositions: []
                }
                // Override default max and min if user has specified
                if (options.series[0].yAxis_max) {
                    options.yAxis.max = options.series[0].yAxis_max;
                }
                if (options.series[0].yAxis_min) {
                    options.yAxis.min = options.series[0].yAxis_min;
                }
                options.tooltip.enabled = false
                options.xAxis.crosshair = false
            }

            // If AQI chart is present, configure a special chart
            if (observation_type == "aqiChart") {
                // Highcharts does not allow the guage background to have rounded ends. To get around
                // this, define a "dummy" series that fills the gauge with the appropriate color.
                // This way, the ends are rounded if the user specifies.
                options.series[0].data = [{
                    y: 500,
                    color: '#e6e6e6',
                    className: 'highcharts-pane',
                    zIndex: 0,
                    dataLabels: {enabled: false}
                }, {
                    y: options.series[0].data[0]['y'],
                    color: get_aqi_color(options.series[0].data[0]['y'], true),
                    category: options.series[0].data[0]['category']
                }]
                options.chart.type = "solidgauge"
                options.pane = {
                    startAngle: -140,
                    endAngle: 140,
                    background: [{
                        outerRadius: 0,
                        innerRadius: 0,
                    }]
                }
                options.plotOptions = {
                    solidgauge: {
                        dataLabels: {
                            useHTML: true,
                            enabled: true,
                            y: -30,
                            borderWidth: 0,
                            format: '<span style="text-align:center">{y}</span><br><span style="font-size:14px;text-align:center">' + options.series[0].data[1]['category'] + '</span>',
                            style: {
                                fontWeight: 'bold',
                                lineHeight: '0.5em',
                                textAlign: 'center',
                                fontSize: '50px',
                                color: options.series[0].data[1].color,
                                textOutline: 'none'
                            }
                        },
                        linecap: 'round',
                        rounded: true
                    }
                }
                options.yAxis = {
                    min: 0,
                    max: 500,
                    lineColor: null,
                    tickPositions: []
                }
                options.tooltip.enabled = false
                options.xAxis.crosshair = false
            }

            // If Hays chart is present, configure a special chart to show that data
            if (observation_type == "haysChart") {
                options.chart.type = "arearange"
                options.chart.polar = true;
                options.plotOptions = {
                    turboThreshold: 0,
                    series: {
                        marker: {
                            enabled: false
                        }
                    }
                };
                // Find min and max of the series data for the yAxis min and max
                var maximum_flattened = [];
                options.series[0].data.forEach(seriesData => {
                    maximum_flattened.push(seriesData[2]);
                });
                var range_max = Math.max(...maximum_flattened);
                if (options.series[0].yAxis_softMax) {
                    var range_max = options.series[0].yAxis_softMax;
                }
                options.legend = {"enabled": false}
                options.yAxis = {
                    showFirstLabel: false,
                    tickInterval: 2,
                    tickmarkPlacement: 'on',
                    min: -1,
                    softMax: range_max,
                    title: {
                        text: options.series[0].yAxis_label,
                    },
                    labels: {
                        align: 'center',
                        x: 0,
                        y: 0
                    },
                }
                options.tooltip = {
                    split: false,
                    shared: true,
                    followPointer: true,
                    useHTML: true,
                    formatter: function(tooltip) {
                        return this.points.map(function(point) {
                            var rounding = point.series.userOptions.rounding;
                            var mirrored = point.series.userOptions.mirrored_value;
                            var numberFormat = point.series.userOptions.numberFormat ? point.series.userOptions.numberFormat : "";
                            return "<strong>" + tzAdjustedMoment(point.x / 1000).format(tooltip_date_format) + "</strong><br><span style='color:" + options.series[0].color + "'>\u25CF</span> High: " + highcharts_tooltip_factory(point.point.high, observation_type, true, rounding, mirrored, numberFormat) + "<br><span style='color:" + options.series[0].color + "'>\u25CF</span> Low: " + highcharts_tooltip_factory(point.point.low, observation_type, true, rounding, mirrored, numberFormat);
                        });
                    }
                }
                var currentSeries = options.series;
                var currentSeriesData = options.series[0].data;
                var range_unit = options.series[0].range_unit;
                var rounding = options.series[0].rounding;
                var newSeriesData = [];
                var currentSeriesColor = options.series[0].color;
                currentSeriesData.forEach(seriesData => {
                    newSeriesData.push({
                        x: seriesData[0],
                        low: seriesData[1],
                        high: seriesData[2],
                    });
                });
                options.series = [];
                options.series.push({
                    data: newSeriesData,
                    obsType: "haysChart",
                    obsUnit: range_unit,
                    rounding: rounding,
                    color: currentSeriesColor,
                    fillColor: currentSeriesColor,
                    connectEnds: false,
                });
            }

            // If weather range is present, configure a special chart to show that data
            // https://www.highcharts.com/blog/tutorials/209-the-art-of-the-chart-weather-radials/
            if (observation_type == "weatherRange") {
                if (options.series[0].area_display) {
                    options.chart.type = "arearange";
                } else {
                    options.chart.type = "columnrange";
                }

                // If polar is defined, use it and add a special dark mode CSS class
                if (JSON.parse(String(options.series[0].polar.toLowerCase()))) {
                    options.chart.polar = true; // Make sure the option is a string, then convert to bool
                    options.chart.className = "highcharts-weatherRange belchertown-polar"; // Used for dark mode
                } else {
                    options.chart.className = "highcharts-weatherRange"; // Used for dark mode
                }

                options.legend = {"enabled": false}

                // Find min and max of the series data for the yAxis min and max
                var minimum_flattened = [];
                var maximum_flattened = [];
                options.series[0].data.forEach(seriesData => {
                    minimum_flattened.push(seriesData[1]);
                    maximum_flattened.push(seriesData[2]);
                });
                var range_min = Math.min(...minimum_flattened);
                var range_max = Math.max(...maximum_flattened);

                var yAxis_tickInterval = Math.ceil(Math.round(range_max / 5) / 5) * 5; // Divide max outTemp by 5 and round it, then round that value up to the nearest 5th multiple. This gives clean yAxis tick lines. 

                options.yAxis = {
                    showFirstLabel: true,
                    tickInterval: yAxis_tickInterval,
                    min: range_min,
                    max: range_max,
                    title: {
                        text: options.series[0].yAxis_label,
                    },
                }

                options.xAxis = {
                    dateTimeLabelFormats: {
                        day: '%e %b',
                        week: '%e %b',
                        month: '%b %y',
                    },
                    showLastLabel: true,
                    crosshair: true,
                    type: "datetime"
                }

                options.plotOptions = {}
                options.plotOptions = {
                    series: {
                        turboThreshold: 0,
                        showInLegend: false,
                        borderWidth: 0,
                        marker: {
                            enabled: false,
                        },
                    }
                }

                if (options.series[0].area_display) {
                    if (options.series[0].range_unit == "degree_F") {
                        options.plotOptions.series.zones = [
                            {value: 0, color: "#1278c8"},
                            {value: 25, color: "#30bfef"},
                            {value: 32, color: "#1fafdd"},
                            {value: 40, color: "rgba(0,172,223,1)"},
                            {value: 50, color: "#71bc3c"},
                            {value: 55, color: "rgba(90,179,41,0.8)"},
                            {value: 65, color: "rgba(131,173,45,1)"},
                            {value: 70, color: "rgba(206,184,98,1)"},
                            {value: 75, color: "rgba(255,174,0,0.9)"},
                            {value: 80, color: "rgba(255,153,0,0.9)"},
                            {value: 85, color: "rgba(255,127,0,1)"},
                            {value: 90, color: "rgba(255,79,0,0.9)"},
                            {value: 95, color: "rgba(255,69,69,1)"},
                            {value: 110, color: "rgba(255,104,104,1)"},
                            {color: "rgba(218,113,113,1)"},
                        ]
                    } else {
                        options.plotOptions.series.zones = [
                            {value: -5, color: "#1278c8"},
                            {value: -3.8, color: "#30bfef"},
                            {value: 0, color: "#1fafdd"},
                            {value: 4.4, color: "rgba(0,172,223,1)"},
                            {value: 10, color: "#71bc3c"},
                            {value: 12.7, color: "rgba(90,179,41,0.8)"},
                            {value: 18.3, color: "rgba(131,173,45,1)"},
                            {value: 21.1, color: "rgba(206,184,98,1)"},
                            {value: 23.8, color: "rgba(255,174,0,0.9)"},
                            {value: 26.6, color: "rgba(255,153,0,0.9)"},
                            {value: 29.4, color: "rgba(255,127,0,1)"},
                            {value: 32.2, color: "rgba(255,79,0,0.9)"},
                            {value: 35, color: "rgba(255,69,69,1)"},
                            {value: 43.3, color: "rgba(255,104,104,1)"},
                            {color: "rgba(218,113,113,1)"},
                        ]
                    }
                } else {
                    options.plotOptions.series.stacking = "normal"
                }

                options.tooltip = {
                    split: false,
                    shared: true,
                    followPointer: true,
                    useHTML: true,
                    formatter: function(tooltip) {
                        return this.points.map(function(point) {
                            var rounding = point.series.userOptions.rounding;
                            var mirrored = point.series.userOptions.mirrored_value;
                            var numberFormat = point.series.userOptions.numberFormat ? point.series.userOptions.numberFormat : "";
                            return "<strong>" + tzAdjustedMoment(point.x / 1000).format(tooltip_date_format) + "</strong><br><span style='color:" + get_outTemp_color(point.series.userOptions.obsUnit, point.point.high, true) + "'>\u25CF</span> High: " + highcharts_tooltip_factory(point.point.high, observation_type, true, rounding, mirrored, numberFormat) + "<br><span style='color:" + get_outTemp_color(point.series.userOptions.obsUnit, point.point.low, true) + "'>\u25CF</span> Low: " + highcharts_tooltip_factory(point.point.low, observation_type, true, rounding, mirrored, numberFormat) + "<br><span style='color:" + get_outTemp_color(point.series.userOptions.obsUnit, point.point.average, true) + "'>\u25CF</span> Average: " + highcharts_tooltip_factory(point.point.average, observation_type, true, rounding, mirrored, numberFormat);
                        });
                    }
                }

                // Update data
                var currentSeries = options.series;
                var currentSeriesData = options.series[0].data;
                var range_unit = options.series[0].range_unit;
                var rounding = options.series[0].rounding;
                var newSeriesData = [];
                currentSeriesData.forEach(seriesData => {
                    if (options.series[0].color) {
                        var color = options.series[0].color;
                    } else {
                        // Set color of the column based on the average temperature, or return default if not temperature
                        var color = get_outTemp_color(range_unit, seriesData[3], true);
                    }
                    newSeriesData.push({
                        x: seriesData[0],
                        low: seriesData[1],
                        high: seriesData[2],
                        average: seriesData[3],
                        color: color
                    });
                });
                options.series = [];
                options.series.push({
                    data: newSeriesData,
                    obsType: "weatherRange",
                    obsUnit: range_unit,
                    rounding: rounding
                });
            }

            // Apply any width, height CSS overrides to the parent div of the chart
            if (css_height != "") {
                jQuery("#" + options.chart.renderTo).parent().css({
                    'height': css_height,
                    'padding': '0px 15px',
                    'margin-bottom': '20px'
                });
            }
            if (css_width != "") {
                jQuery("#" + options.chart.renderTo).parent().css('width', css_width);
            }

            if (credits != "highcharts_default") {
                options.credits.text = credits;
            }

            if (credits_url != "highcharts_default") {
                options.credits.href = credits_url;
            }

            if (credits_position != "highcharts_default") {
                options.credits.position = JSON.parse(credits_position);
            }

            // Finally all options are done, now show the chart
            var chart = new Highcharts.chart(options);

            // If using debug, show a copy paste debug for use with jsfiddle
            belchertown_debug(options);
            belchertown_debug("Highcharts.chart('container', " + JSON.stringify(options) + ");");

        });

    });

};

function tzAdjustedMoment(input) {
    let tz = "Asian/Jakarta";
    if (!tz) {
        return moment.unix(input).utcOffset(420.0);
    } else {
        return moment.unix(input).tz(tz);
    }
}
