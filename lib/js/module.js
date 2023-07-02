/*
 * module.js - v1.4 - 22Jun22

 *     - v1.4 - 22Jun22 - bring colpick & jQuery timepicker addon into this file
 *     - v1.3 - 20Jun22 - bug fix - test if 'colpick' method exists before calling it!
 *     - v1.2 - 16Feb19 - ecb_repeater added
 *                      - began consolidating all js into this file
 *     - v1.1 - 11Jul17 - updated for max_number & required_number & updateECB2Placeholder()
 *     - v1.0 - 18Apr17 - initial js file
 *
 *    enables drag-n-drop selection of list items, requires jquery ui sortable
 */
/*!
module.js v1.4
(C) various
licence: various
*/

/*
colpick Color Picker v.2.0.2
Copyright 2013 Jose Vargas. Licensed under GPL license. Based on Stefan Petre's Color Picker www.eyecon.ro, dual licensed under the MIT and GPL licenses

See https://github.com/josedvq/colpick-jQuery-Color-Picker
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var colpick = function () {
        var
            tpl = '<div class="colpick"><div class="colpick_color"><div class="colpick_color_overlay1"><div class="colpick_color_overlay2"><div class="colpick_selector_outer"><div class="colpick_selector_inner"></div></div></div></div></div><div class="colpick_hue"><div class="colpick_hue_arrs"><div class="colpick_hue_larr"></div><div class="colpick_hue_rarr"></div></div></div><div class="colpick_new_color"></div><div class="colpick_current_color"></div><div class="colpick_hex_field"><div class="colpick_field_letter">#</div><input type="text" maxlength="6" size="6" /></div><div class="colpick_rgb_r colpick_field"><div class="colpick_field_letter">R</div><input type="text" maxlength="3" size="3" /><div class="colpick_field_arrs"><div class="colpick_field_uarr"></div><div class="colpick_field_darr"></div></div></div><div class="colpick_rgb_g colpick_field"><div class="colpick_field_letter">G</div><input type="text" maxlength="3" size="3" /><div class="colpick_field_arrs"><div class="colpick_field_uarr"></div><div class="colpick_field_darr"></div></div></div><div class="colpick_rgb_b colpick_field"><div class="colpick_field_letter">B</div><input type="text" maxlength="3" size="3" /><div class="colpick_field_arrs"><div class="colpick_field_uarr"></div><div class="colpick_field_darr"></div></div></div><div class="colpick_hsb_h colpick_field"><div class="colpick_field_letter">H</div><input type="text" maxlength="3" size="3" /><div class="colpick_field_arrs"><div class="colpick_field_uarr"></div><div class="colpick_field_darr"></div></div></div><div class="colpick_hsb_s colpick_field"><div class="colpick_field_letter">S</div><input type="text" maxlength="3" size="3" /><div class="colpick_field_arrs"><div class="colpick_field_uarr"></div><div class="colpick_field_darr"></div></div></div><div class="colpick_hsb_b colpick_field"><div class="colpick_field_letter">B</div><input type="text" maxlength="3" size="3" /><div class="colpick_field_arrs"><div class="colpick_field_uarr"></div><div class="colpick_field_darr"></div></div></div><div class="colpick_submit"></div></div>',
            defaults = {
                showEvent: 'click',
                onShow: function () {},
                onBeforeShow: function(){},
                onHide: function () {},
                onChange: function () {},
                onSubmit: function () {},
                colorScheme: 'light',
                color: '3289c7',
                livePreview: true,
                flat: false,
                layout: 'full',
                submit: 1,
                submitText: 'OK',
                height: 156,
                polyfill: false
            },
            //Fill the inputs of the plugin
            fillRGBFields = function  (hsb, cal) {
                var rgb = hsbToRgb(hsb);
                $(cal).data('colpick').fields
                    .eq(1).val(rgb.r).end()
                    .eq(2).val(rgb.g).end()
                    .eq(3).val(rgb.b).end();
            },
            fillHSBFields = function  (hsb, cal) {
                $(cal).data('colpick').fields
                    .eq(4).val(Math.round(hsb.h)).end()
                    .eq(5).val(Math.round(hsb.s)).end()
                    .eq(6).val(Math.round(hsb.b)).end();
            },
            fillHexFields = function (hsb, cal) {
                $(cal).data('colpick').fields.eq(0).val(hsbToHex(hsb));
            },
            //Set the round selector position
            setSelector = function (hsb, cal) {
                $(cal).data('colpick').selector.css('backgroundColor', '#' + hsbToHex({h: hsb.h, s: 100, b: 100}));
                $(cal).data('colpick').selectorIndic.css({
                    left: parseInt($(cal).data('colpick').height * hsb.s/100, 10),
                    top: parseInt($(cal).data('colpick').height * (100-hsb.b)/100, 10)
                });
            },
            //Set the hue selector position
            setHue = function (hsb, cal) {
                $(cal).data('colpick').hue.css('top', parseInt($(cal).data('colpick').height - $(cal).data('colpick').height * hsb.h/360, 10));
            },
            //Set current and new colors
            setCurrentColor = function (hsb, cal) {
                $(cal).data('colpick').currentColor.css('backgroundColor', '#' + hsbToHex(hsb));
            },
            setNewColor = function (hsb, cal) {
                $(cal).data('colpick').newColor.css('backgroundColor', '#' + hsbToHex(hsb));
            },
            //Called when the new color is changed
            change = function (ev) {
                var cal = $(this).parent().parent(), col;
                if (this.parentNode.className.indexOf('_hex') > 0) {
                    cal.data('colpick').color = col = hexToHsb(fixHex(this.value));
                    fillRGBFields(col, cal.get(0));
                    fillHSBFields(col, cal.get(0));
                } else if (this.parentNode.className.indexOf('_hsb') > 0) {
                    cal.data('colpick').color = col = fixHSB({
                        h: parseInt(cal.data('colpick').fields.eq(4).val(), 10),
                        s: parseInt(cal.data('colpick').fields.eq(5).val(), 10),
                        b: parseInt(cal.data('colpick').fields.eq(6).val(), 10)
                    });
                    fillRGBFields(col, cal.get(0));
                    fillHexFields(col, cal.get(0));
                } else {
                    cal.data('colpick').color = col = rgbToHsb(fixRGB({
                        r: parseInt(cal.data('colpick').fields.eq(1).val(), 10),
                        g: parseInt(cal.data('colpick').fields.eq(2).val(), 10),
                        b: parseInt(cal.data('colpick').fields.eq(3).val(), 10)
                    }));
                    fillHexFields(col, cal.get(0));
                    fillHSBFields(col, cal.get(0));
                }
                setSelector(col, cal.get(0));
                setHue(col, cal.get(0));
                setNewColor(col, cal.get(0));
                cal.data('colpick').onChange.apply(cal.parent(), [col, hsbToHex(col), hsbToRgb(col), cal.data('colpick').el, 0]);
            },
            //Change style on blur and on focus of inputs
            blur = function (ev) {
                $(this).parent().removeClass('colpick_focus');
            },
            focus = function () {
                $(this).parent().parent().data('colpick').fields.parent().removeClass('colpick_focus');
                $(this).parent().addClass('colpick_focus');
            },
            //Increment/decrement arrows functions
            downIncrement = function (ev) {
                ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
                var field = $(this).parent().find('input').focus();
                var current = {
                    el: $(this).parent().addClass('colpick_slider'),
                    max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : 255),
                    y: ev.pageY,
                    field: field,
                    val: parseInt(field.val(), 10),
                    preview: $(this).parent().parent().data('colpick').livePreview
                };
                $(document).mouseup(current, upIncrement);
                $(document).mousemove(current, moveIncrement);
            },
            moveIncrement = function (ev) {
                ev.data.field.val(Math.max(0, Math.min(ev.data.max, parseInt(ev.data.val - ev.pageY + ev.data.y, 10))));
                if (ev.data.preview) {
                    change.apply(ev.data.field.get(0), [true]);
                }
                return false;
            },
            upIncrement = function (ev) {
                change.apply(ev.data.field.get(0), [true]);
                ev.data.el.removeClass('colpick_slider').find('input').focus();
                $(document).off('mouseup', upIncrement);
                $(document).off('mousemove', moveIncrement);
                return false;
            },
            //Hue slider functions
            downHue = function (ev) {
                ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
                var current = {
                    cal: $(this).parent(),
                    y: $(this).offset().top
                };
                $(document).on('mouseup touchend',current,upHue);
                $(document).on('mousemove touchmove',current,moveHue);

                var pageY = ((ev.type == 'touchstart') ? ev.originalEvent.changedTouches[0].pageY : ev.pageY );
                change.apply(
                    current.cal.data('colpick')
                    .fields.eq(4).val(parseInt(360*(current.cal.data('colpick').height - (pageY - current.y))/current.cal.data('colpick').height, 10))
                        .get(0),
                    [current.cal.data('colpick').livePreview]
                );
                return false;
            },
            moveHue = function (ev) {
                var pageY = ((ev.type == 'touchmove') ? ev.originalEvent.changedTouches[0].pageY : ev.pageY );
                change.apply(
                    ev.data.cal.data('colpick')
                    .fields.eq(4).val(parseInt(360*(ev.data.cal.data('colpick').height - Math.max(0,Math.min(ev.data.cal.data('colpick').height,(pageY - ev.data.y))))/ev.data.cal.data('colpick').height, 10))
                        .get(0),
                    [ev.data.preview]
                );
                return false;
            },
            upHue = function (ev) {
                fillRGBFields(ev.data.cal.data('colpick').color, ev.data.cal.get(0));
                fillHexFields(ev.data.cal.data('colpick').color, ev.data.cal.get(0));
                $(document).off('mouseup touchend',upHue);
                $(document).off('mousemove touchmove',moveHue);
                return false;
            },
            //Color selector functions
            downSelector = function (ev) {
                ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
                var current = {
                    cal: $(this).parent(),
                    pos: $(this).offset()
                };
                current.preview = current.cal.data('colpick').livePreview;

                $(document).on('mouseup touchend',current,upSelector);
                $(document).on('mousemove touchmove',current,moveSelector);

                var pageX,pageY;
                if(ev.type == 'touchstart') {
                    pageX = ev.originalEvent.changedTouches[0].pageX;
                    pageY = ev.originalEvent.changedTouches[0].pageY;
                } else {
                    pageX = ev.pageX;
                    pageY = ev.pageY;
                }

                change.apply(
                    current.cal.data('colpick').fields
                    .eq(6).val(parseInt(100*(current.cal.data('colpick').height - (pageY - current.pos.top))/current.cal.data('colpick').height, 10)).end()
                    .eq(5).val(parseInt(100*(pageX - current.pos.left)/current.cal.data('colpick').height, 10))
                    .get(0),
                    [current.preview]
                );
                return false;
            },
            moveSelector = function (ev) {
                var pageX,pageY;
                if(ev.type == 'touchmove') {
                    pageX = ev.originalEvent.changedTouches[0].pageX;
                    pageY = ev.originalEvent.changedTouches[0].pageY;
                } else {
                    pageX = ev.pageX;
                    pageY = ev.pageY;
                }

                change.apply(
                    ev.data.cal.data('colpick').fields
                    .eq(6).val(parseInt(100*(ev.data.cal.data('colpick').height - Math.max(0,Math.min(ev.data.cal.data('colpick').height,(pageY - ev.data.pos.top))))/ev.data.cal.data('colpick').height, 10)).end()
                    .eq(5).val(parseInt(100*(Math.max(0,Math.min(ev.data.cal.data('colpick').height,(pageX - ev.data.pos.left))))/ev.data.cal.data('colpick').height, 10))
                    .get(0),
                    [ev.data.preview]
                );
                return false;
            },
            upSelector = function (ev) {
                fillRGBFields(ev.data.cal.data('colpick').color, ev.data.cal.get(0));
                fillHexFields(ev.data.cal.data('colpick').color, ev.data.cal.get(0));
                $(document).off('mouseup touchend',upSelector);
                $(document).off('mousemove touchmove',moveSelector);
                return false;
            },
            //Submit button
            clickSubmit = function (ev) {
                var cal = $(this).parent();
                var col = cal.data('colpick').color;
                cal.data('colpick').origColor = col;
                setCurrentColor(col, cal.get(0));
                cal.data('colpick').onSubmit(col, hsbToHex(col), hsbToRgb(col), cal.data('colpick').el);
            },
            //Show/hide the color picker
            show = function (ev) {
                if(ev) {
                     // Prevent the trigger of any direct parent
                    ev.stopPropagation();
                }
                var cal = $('#' + $(this).data('colpickId'));
                if (ev && !cal.data('colpick').polyfill) {
                    ev.preventDefault();
                }
                cal.data('colpick').onBeforeShow.apply(this, [cal.get(0)]);
                var pos = $(this).offset();
                var top = pos.top + this.offsetHeight;
                var left = pos.left;
                var viewPort = getViewport();
                var calW = cal.width();
                if (left + calW > viewPort.l + viewPort.w) {
                    left -= calW;
                }
                cal.css({left: left + 'px', top: top + 'px'});
                if (cal.data('colpick').onShow.apply(this, [cal.get(0)]) != false) {
                    cal.show();
                }
                //Hide when user clicks outside
                $('html').mousedown({cal:cal}, hide);
                cal.mousedown(function(ev){ev.stopPropagation();});
            },
            hide = function (ev) {
                var cal = $('#' + $(this).data('colpickId'));
                if (ev) {
                    cal = ev.data.cal;
                }
                if (cal.data('colpick').onHide.apply(this, [cal.get(0)]) != false) {
                    cal.hide();
                }
                $('html').off('mousedown', hide);
            },
            getViewport = function () {
                var m = document.compatMode == 'CSS1Compat';
                return {
                    l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
                    w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth)
                };
            },
            //Fix the values if the user enters a negative or high value
            fixHSB = function (hsb) {
                return {
                    h: Math.min(360, Math.max(0, hsb.h)),
                    s: Math.min(100, Math.max(0, hsb.s)),
                    b: Math.min(100, Math.max(0, hsb.b))
                };
            },
            fixRGB = function (rgb) {
                return {
                    r: Math.min(255, Math.max(0, rgb.r)),
                    g: Math.min(255, Math.max(0, rgb.g)),
                    b: Math.min(255, Math.max(0, rgb.b))
                };
            },
            fixHex = function (hex) {
                var len = 6 - hex.length;
                if (len == 3) {
                    var e = [];
                    for (var j = 0; j < len; j++) {
                        e.push(hex[j]);
                        e.push(hex[j]);
                    }
                    hex = e.join('');
                } else {
                    if (len > 0) {
                        var o = [];
                        for (var i = 0; i < len; i++) {
                            o.push('0');
                        }
                        o.push(hex);
                        hex = o.join('');
                    }
                }
                return hex;
            },
            getUniqueID = (function () {
                var cnt = 0;
                return function () {
                    cnt += 1;
                    return cnt;
                };
            })(),
            restoreOriginal = function () {
                var cal = $(this).parent();
                var col = cal.data('colpick').origColor;
                cal.data('colpick').color = col;
                fillRGBFields(col, cal.get(0));
                fillHexFields(col, cal.get(0));
                fillHSBFields(col, cal.get(0));
                setSelector(col, cal.get(0));
                setHue(col, cal.get(0));
                setNewColor(col, cal.get(0));
            };
        return {
            init: function (opt) {
                opt = $.extend({}, defaults, opt||{});
                //Set color
                if (typeof opt.color == 'string') {
                    opt.color = hexToHsb(opt.color);
                } else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {
                    opt.color = rgbToHsb(opt.color);
                } else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {
                    opt.color = fixHSB(opt.color);
                } else {
                    return this;
                }

                //For each selected DOM element
                return this.each(function () {
                    //If the element does not have an ID
                    if (!$(this).data('colpickId')) {
                        var options = $.extend({}, opt);
                        options.origColor = opt.color;

                        // Set polyfill
                        if (typeof opt.polyfill == 'function') {
                            options.polyfill = opt.polyfill(this);
                        }

                        //Input field operations
                        options.input = $(this).is('input');

                        //Polyfill fixes
                        if (options.polyfill && options.input && this.type === "color") {
                            return;
                        }

                        //Generate and assign a random ID
                        var id = 'colorpicker_' + getUniqueID();
                        $(this).data('colpickId', id);
                        //Set the tpl's ID and get the HTML
                        var cal = $(tpl).attr('id', id);
                        //Add class according to layout
                        cal.addClass('colpick_'+options.layout+(options.submit?'':' colpick_'+options.layout+'_ns'));
                        //Add class if the color scheme is not default
                        if(options.colorScheme != 'light') {
                            cal.addClass('colpick_'+options.colorScheme);
                        }
                        //Setup submit button
                        cal.find('div.colpick_submit').html(options.submitText).click(clickSubmit);
                        //Setup input fields
                        options.fields = cal.find('input').change(change).blur(blur).focus(focus);
                        cal.find('div.colpick_field_arrs').mousedown(downIncrement).end().find('div.colpick_current_color').click(restoreOriginal);
                        //Setup hue selector
                        options.selector = cal.find('div.colpick_color').on('mousedown touchstart',downSelector);
                        options.selectorIndic = options.selector.find('div.colpick_selector_outer');
                        //Store parts of the plugin
                        options.el = this;
                        options.hue = cal.find('div.colpick_hue_arrs');
                        var huebar = options.hue.parent();
                        //Paint the hue bar
                        var UA = navigator.userAgent.toLowerCase();
                        var isIE = navigator.appName === 'Microsoft Internet Explorer';
                        var IEver = isIE ? parseFloat( UA.match( /msie ([0-9]{1,}[\.0-9]{0,})/ )[1] ) : 0;
                        var ngIE = ( isIE && IEver < 10 );
                        var stops = ['#ff0000','#ff0080','#ff00ff','#8000ff','#0000ff','#0080ff','#00ffff','#00ff80','#00ff00','#80ff00','#ffff00','#ff8000','#ff0000'];
                        if(ngIE) {
                            var i, div;
                            for(i=0; i<=11; i++) {
                                div = $('<div></div>').attr('style','height:8.333333%; filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='+stops[i]+', endColorstr='+stops[i+1]+'); -ms-filter: "progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='+stops[i]+', endColorstr='+stops[i+1]+')";');
                                huebar.append(div);
                            }
                        } else {
                            var stopList = stops.join(',');
                            huebar.attr('style','background:-webkit-linear-gradient(top,'+stopList+'); background: -o-linear-gradient(top,'+stopList+'); background: -ms-linear-gradient(top,'+stopList+'); background:-moz-linear-gradient(top,'+stopList+'); -webkit-linear-gradient(top,'+stopList+'); background:linear-gradient(to bottom,'+stopList+'); ');
                        }
                        cal.find('div.colpick_hue').on('mousedown touchstart',downHue);
                        options.newColor = cal.find('div.colpick_new_color');
                        options.currentColor = cal.find('div.colpick_current_color');
                        //Store options and fill with default color
                        cal.data('colpick', options);
                        fillRGBFields(options.color, cal.get(0));
                        fillHSBFields(options.color, cal.get(0));
                        fillHexFields(options.color, cal.get(0));
                        setHue(options.color, cal.get(0));
                        setSelector(options.color, cal.get(0));
                        setCurrentColor(options.color, cal.get(0));
                        setNewColor(options.color, cal.get(0));
                        //Append to body if flat=false, else show in place
                        if (options.flat) {
                            cal.appendTo(this).show();
                            cal.css({
                                position: 'relative',
                                display: 'block'
                            });
                        } else {
                            cal.appendTo($(this).parent());
                            $(this).on(options.showEvent, show);
                            cal.css({
                                position:'absolute'
                            });
                        }
                    }
                });
            },
            //Shows the picker
            showPicker: function() {
                return this.each( function () {
                    if ($(this).data('colpickId')) {
                        show.apply(this);
                    }
                });
            },
            //Hides the picker
            hidePicker: function() {
                return this.each( function () {
                    if ($(this).data('colpickId')) {
                        hide.apply(this);
                    }
                });
            },
            //Sets a color as new and current (default)
            setColor: function(col, setCurrent) {
                if (col != undefined) {
                    setCurrent = (typeof setCurrent === "undefined") ? 1 : setCurrent;
                    if (typeof col == 'string') {
                        col = hexToHsb(col);
                    } else if (col.r != undefined && col.g != undefined && col.b != undefined) {
                        col = rgbToHsb(col);
                    } else if (col.h != undefined && col.s != undefined && col.b != undefined) {
                        col = fixHSB(col);
                    } else {
                        return this;
                    }
                    return this.each(function(){
                        if ($(this).data('colpickId')) {
                            var cal = $('#' + $(this).data('colpickId'));
                            cal.data('colpick').color = col;
                            cal.data('colpick').origColor = col;
                            fillRGBFields(col, cal.get(0));
                            fillHSBFields(col, cal.get(0));
                            fillHexFields(col, cal.get(0));
                            setHue(col, cal.get(0));
                            setSelector(col, cal.get(0));
                            setNewColor(col, cal.get(0));
                            cal.data('colpick').onChange.apply(cal.parent(), [col, hsbToHex(col), hsbToRgb(col), cal.data('colpick').el, 1]);
                            if(setCurrent) {
                                setCurrentColor(col, cal.get(0));
                            }
                        }
                    });
                }
            },
            destroy: function(col, setCurrent) {
                $('#' + $(this).data('colpickId')).remove();
            }
        };
    }();
    //Color space convertions
    var hexToRgb = function (hex) {
        hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
        return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
    };
    var hexToHsb = function (hex) {
        return rgbToHsb(hexToRgb(hex));
    };
    var rgbToHsb = function (rgb) {
        var hsb = {h: 0, s: 0, b: 0};
        var min = Math.min(rgb.r, rgb.g, rgb.b);
        var max = Math.max(rgb.r, rgb.g, rgb.b);
        var delta = max - min;
        hsb.b = max;
        hsb.s = max != 0 ? 255 * delta / max : 0;
        if (hsb.s != 0) {
            if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta;
            else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta;
            else hsb.h = 4 + (rgb.r - rgb.g) / delta;
        } else hsb.h = -1;
        hsb.h *= 60;
        if (hsb.h < 0) hsb.h += 360;
        hsb.s *= 100/255;
        hsb.b *= 100/255;
        return hsb;
    };
    var hsbToRgb = function (hsb) {
        var rgb = {};
        var h = hsb.h;
        var s = hsb.s*255/100;
        var v = hsb.b*255/100;
        if(s == 0) {
            rgb.r = rgb.g = rgb.b = v;
        } else {
            var t1 = v;
            var t2 = (255-s)*v/255;
            var t3 = (t1-t2)*(h%60)/60;
            if(h==360) h = 0;
            if(h<60) {rgb.r=t1; rgb.b=t2; rgb.g=t2+t3;}
            else if(h<120) {rgb.g=t1; rgb.b=t2; rgb.r=t1-t3;}
            else if(h<180) {rgb.g=t1; rgb.r=t2; rgb.b=t2+t3;}
            else if(h<240) {rgb.b=t1; rgb.r=t2; rgb.g=t1-t3;}
            else if(h<300) {rgb.b=t1; rgb.g=t2; rgb.r=t2+t3;}
            else if(h<360) {rgb.r=t1; rgb.g=t2; rgb.b=t1-t3;}
            else {rgb.r=0; rgb.g=0; rgb.b=0;}
        }
        return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
    };
    var rgbToHex = function (rgb) {
        var hex = [
            rgb.r.toString(16),
            rgb.g.toString(16),
            rgb.b.toString(16)
        ];
        $.each(hex, function (nr, val) {
            if (val.length == 1) {
                hex[nr] = '0' + val;
            }
        });
        return hex.join('');
    };
    var hsbToHex = function (hsb) {
        return rgbToHex(hsbToRgb(hsb));
    };
    $.fn.extend({
        colpick: colpick.init,
        colpickHide: colpick.hidePicker,
        colpickShow: colpick.showPicker,
        colpickSetColor: colpick.setColor,
        colpickDestroy: colpick.destroy
    });
    $.extend({
        colpick:{
            rgbToHex: rgbToHex,
            rgbToHsb: rgbToHsb,
            hsbToHex: hsbToHex,
            hsbToRgb: hsbToRgb,
            hexToHsb: hexToHsb,
            hexToRgb: hexToRgb
        }
    });
}));

/*
 * jQuery timepicker addon
 * By: Trent Richardson [http://trentrichardson.com]
 * Version 1.1.1
 * Last Modified: 11/07/2012
 *
 * Copyright 2012 Trent Richardson
 * You may use this project under MIT or GPL licenses.
 * http://trentrichardson.com/Impromptu/GPL-LICENSE.txt
 * http://trentrichardson.com/Impromptu/MIT-LICENSE.txt
 */
(function($) {
    if ($.ui.timepicker = $.ui.timepicker || {}, !$.ui.timepicker.version) {
        $.extend($.ui, {
            timepicker: {
                version: "1.1.1"
            }
        }), $.extend(Timepicker.prototype, {
            $input: null,
            $altInput: null,
            $timeObj: null,
            inst: null,
            hour_slider: null,
            minute_slider: null,
            second_slider: null,
            millisec_slider: null,
            timezone_select: null,
            hour: 0,
            minute: 0,
            second: 0,
            millisec: 0,
            timezone: null,
            defaultTimezone: "+0000",
            hourMinOriginal: null,
            minuteMinOriginal: null,
            secondMinOriginal: null,
            millisecMinOriginal: null,
            hourMaxOriginal: null,
            minuteMaxOriginal: null,
            secondMaxOriginal: null,
            millisecMaxOriginal: null,
            ampm: "",
            formattedDate: "",
            formattedTime: "",
            formattedDateTime: "",
            timezoneList: null,
            units: ["hour", "minute", "second", "millisec"],
            control: null,
            setDefaults: function(e) {
                return extendRemove(this._defaults, e || {}), this
            },
            _newInst: function($input, o) {
                var tp_inst = new Timepicker(),
                    inlineSettings = {},
                    fns = {},
                    overrides, i;
                for (var attrName in this._defaults)
                    if (this._defaults.hasOwnProperty(attrName)) {
                        var attrValue = $input.attr("time:" + attrName);
                        if (attrValue) try {
                            inlineSettings[attrName] = eval(attrValue);
                        } catch (e) {
                            inlineSettings[attrName] = attrValue;
                        }
                    } for (i in overrides = {
                        beforeShow: function(e, t) {
                            if ($.isFunction(tp_inst._defaults.evnts.beforeShow)) return tp_inst._defaults.evnts.beforeShow.call($input[0], e, t, tp_inst)
                        },
                        onChangeMonthYear: function(e, t, i) {
                            tp_inst._updateDateTime(i), $.isFunction(tp_inst._defaults.evnts.onChangeMonthYear) && tp_inst._defaults.evnts.onChangeMonthYear.call($input[0], e, t, i, tp_inst)
                        },
                        onClose: function(e, t) {
                            !0 === tp_inst.timeDefined && "" !== $input.val() && tp_inst._updateDateTime(t), $.isFunction(tp_inst._defaults.evnts.onClose) && tp_inst._defaults.evnts.onClose.call($input[0], e, t, tp_inst)
                        }
                    }, overrides) overrides.hasOwnProperty(i) && (fns[i] = o[i] || null);
                if (tp_inst._defaults = $.extend({}, this._defaults, inlineSettings, o, overrides, {
                        evnts: fns,
                        timepicker: tp_inst
                    }), tp_inst.amNames = $.map(tp_inst._defaults.amNames, (function(e) {
                        return e.toUpperCase()
                    })), tp_inst.pmNames = $.map(tp_inst._defaults.pmNames, (function(e) {
                        return e.toUpperCase()
                    })), "string" == typeof tp_inst._defaults.controlType ? (void 0 === $.fn[tp_inst._defaults.controlType] && (tp_inst._defaults.controlType = "select"), tp_inst.control = tp_inst._controls[tp_inst._defaults.controlType]) : tp_inst.control = tp_inst._defaults.controlType, null === tp_inst._defaults.timezoneList) {
                    var timezoneList = ["-1200", "-1100", "-1000", "-0930", "-0900", "-0800", "-0700", "-0600", "-0500", "-0430", "-0400", "-0330", "-0300", "-0200", "-0100", "+0000", "+0100", "+0200", "+0300", "+0330", "+0400", "+0430", "+0500", "+0530", "+0545", "+0600", "+0630", "+0700", "+0800", "+0845", "+0900", "+0930", "+1000", "+1030", "+1100", "+1130", "+1200", "+1245", "+1300", "+1400"];
                    tp_inst._defaults.timezoneIso8601 && (timezoneList = $.map(timezoneList, (function(e) {
                        return "+0000" == e ? "Z" : e.substring(0, 3) + ":" + e.substring(3)
                    }))), tp_inst._defaults.timezoneList = timezoneList
                }
                return tp_inst.timezone = tp_inst._defaults.timezone, tp_inst.hour = tp_inst._defaults.hour, tp_inst.minute = tp_inst._defaults.minute, tp_inst.second = tp_inst._defaults.second, tp_inst.millisec = tp_inst._defaults.millisec, tp_inst.ampm = "", tp_inst.$input = $input, o.altField && (tp_inst.$altInput = $(o.altField).css({
                    cursor: "pointer"
                }).focus((function() {
                    $input.trigger("focus")
                }))), 0 !== tp_inst._defaults.minDate && 0 !== tp_inst._defaults.minDateTime || (tp_inst._defaults.minDate = new Date), 0 !== tp_inst._defaults.maxDate && 0 !== tp_inst._defaults.maxDateTime || (tp_inst._defaults.maxDate = new Date), void 0 !== tp_inst._defaults.minDate && tp_inst._defaults.minDate instanceof Date && (tp_inst._defaults.minDateTime = new Date(tp_inst._defaults.minDate.getTime())), void 0 !== tp_inst._defaults.minDateTime && tp_inst._defaults.minDateTime instanceof Date && (tp_inst._defaults.minDate = new Date(tp_inst._defaults.minDateTime.getTime())), void 0 !== tp_inst._defaults.maxDate && tp_inst._defaults.maxDate instanceof Date && (tp_inst._defaults.maxDateTime = new Date(tp_inst._defaults.maxDate.getTime())), void 0 !== tp_inst._defaults.maxDateTime && tp_inst._defaults.maxDateTime instanceof Date && (tp_inst._defaults.maxDate = new Date(tp_inst._defaults.maxDateTime.getTime())), tp_inst.$input.bind("focus", (function() {
                    tp_inst._onFocus()
                })), tp_inst
            },
            _addTimePicker: function(e) {
                var t = this.$altInput && this._defaults.altFieldTimeOnly ? this.$input.val() + " " + this.$altInput.val() : this.$input.val();
                this.timeDefined = this._parseTime(t), this._limitMinMaxDateTime(e, !1), this._injectTimePicker()
            },
            _parseTime: function(e, t) {
                if (this.inst || (this.inst = $.datepicker._getInst(this.$input[0])), t || !this._defaults.timeOnly) {
                    var i = $.datepicker._get(this.inst, "dateFormat");
                    try {
                        var s = parseDateTimeInternal(i, this._defaults.timeFormat, e, $.datepicker._getFormatConfig(this.inst), this._defaults);
                        if (!s.timeObj) return !1;
                        $.extend(this, s.timeObj)
                    } catch (t) {
                        return $.datepicker.log("Error parsing the date/time string: " + t + "\ndate/time string = " + e + "\ntimeFormat = " + this._defaults.timeFormat + "\ndateFormat = " + i), !1
                    }
                    return !0
                }
                var a = $.datepicker.parseTime(this._defaults.timeFormat, e, this._defaults);
                return !!a && ($.extend(this, a), !0)
            },
            _injectTimePicker: function() {
                var e = this.inst.dpDiv,
                    t = this.inst.settings,
                    i = this,
                    s = "",
                    a = "",
                    n = {},
                    r = {},
                    l = null;
                if (0 === e.find("div.ui-timepicker-div").length && t.showTimepicker) {
                    for (var o = ' style="display:none;"', u = '<div class="ui-timepicker-div' + (t.isRTL ? " ui-timepicker-rtl" : "") + '"><dl><dt class="ui_tpicker_time_label"' + (t.showTime ? "" : o) + ">" + t.timeText + '</dt><dd class="ui_tpicker_time"' + (t.showTime ? "" : o) + "></dd>", d = 0, m = this.units.length; d < m; d++) {
                        if (a = (s = this.units[d]).substr(0, 1).toUpperCase() + s.substr(1), n[s] = parseInt(t[s + "Max"] - (t[s + "Max"] - t[s + "Min"]) % t["step" + a], 10), r[s] = 0, u += '<dt class="ui_tpicker_' + s + '_label"' + (t["show" + a] ? "" : o) + ">" + t[s + "Text"] + '</dt><dd class="ui_tpicker_' + s + '"><div class="ui_tpicker_' + s + '_slider"' + (t["show" + a] ? "" : o) + "></div>", t["show" + a] && t[s + "Grid"] > 0) {
                            if (u += '<div style="padding-left: 1px"><table class="ui-tpicker-grid-label"><tr>', "hour" == s)
                                for (var c = t[s + "Min"]; c <= n[s]; c += parseInt(t[s + "Grid"], 10)) {
                                    r[s]++;
                                    var h = $.datepicker.formatTime(useAmpm(t.pickerTimeFormat || t.timeFormat) ? "hht" : "HH", {
                                        hour: c
                                    }, t);
                                    u += '<td data-for="' + s + '">' + h + "</td>"
                                } else
                                    for (var p = t[s + "Min"]; p <= n[s]; p += parseInt(t[s + "Grid"], 10)) r[s]++, u += '<td data-for="' + s + '">' + (p < 10 ? "0" : "") + p + "</td>";
                            u += "</tr></table></div>"
                        }
                        u += "</dd>"
                    }
                    u += '<dt class="ui_tpicker_timezone_label"' + (t.showTimezone ? "" : o) + ">" + t.timezoneText + "</dt>", u += '<dd class="ui_tpicker_timezone" ' + (t.showTimezone ? "" : o) + "></dd>";
                    var f = $(u += "</dl></div>");
                    !0 === t.timeOnly && (f.prepend('<div class="ui-widget-header ui-helper-clearfix ui-corner-all"><div class="ui-datepicker-title">' + t.timeOnlyTitle + "</div></div>"), e.find(".ui-datepicker-header, .ui-datepicker-calendar").hide());
                    for (d = 0, m = i.units.length; d < m; d++) a = (s = i.units[d]).substr(0, 1).toUpperCase() + s.substr(1), i[s + "_slider"] = i.control.create(i, f.find(".ui_tpicker_" + s + "_slider"), s, i[s], t[s + "Min"], n[s], t["step" + a]), t["show" + a] && t[s + "Grid"] > 0 && (l = 100 * r[s] * t[s + "Grid"] / (n[s] - t[s + "Min"]), f.find(".ui_tpicker_" + s + " table").css({
                        width: l + "%",
                        marginLeft: t.isRTL ? "0" : l / (-2 * r[s]) + "%",
                        marginRight: t.isRTL ? l / (-2 * r[s]) + "%" : "0",
                        borderCollapse: "collapse"
                    }).find("td").click((function(e) {
                        var t = $(this),
                            a = t.html(),
                            n = parseInt(a.replace(/[^0-9]/g), 10),
                            r = a.replace(/[^apm]/gi),
                            l = t.data("for");
                        "hour" == l && (-1 !== r.indexOf("p") && n < 12 ? n += 12 : -1 !== r.indexOf("a") && 12 === n && (n = 0)), i.control.value(i, i[l + "_slider"], s, n), i._onTimeChange(), i._onSelectHandler()
                    })).css({
                        cursor: "pointer",
                        width: 100 / r[s] + "%",
                        textAlign: "center",
                        overflow: "hidden"
                    }));
                    if (this.timezone_select = f.find(".ui_tpicker_timezone").append("<select></select>").find("select"), $.fn.append.apply(this.timezone_select, $.map(t.timezoneList, (function(e, t) {
                            return $("<option />").val("object" == typeof e ? e.value : e).text("object" == typeof e ? e.label : e)
                        }))), void 0 !== this.timezone && null !== this.timezone && "" !== this.timezone) {
                        var _ = new Date(this.inst.selectedYear, this.inst.selectedMonth, this.inst.selectedDay, 12);
                        $.timepicker.timeZoneOffsetString(_) == this.timezone ? selectLocalTimeZone(i) : this.timezone_select.val(this.timezone)
                    } else void 0 !== this.hour && null !== this.hour && "" !== this.hour ? this.timezone_select.val(t.defaultTimezone) : selectLocalTimeZone(i);
                    this.timezone_select.change((function() {
                        i._defaults.useLocalTimezone = !1, i._onTimeChange()
                    }));
                    var g = e.find(".ui-datepicker-buttonpane");
                    if (g.length ? g.before(f) : e.append(f), this.$timeObj = f.find(".ui_tpicker_time"), null !== this.inst) {
                        var v = this.timeDefined;
                        this._onTimeChange(), this.timeDefined = v
                    }
                    if (this._defaults.addSliderAccess) {
                        var k = this._defaults.sliderAccessArgs,
                            T = this._defaults.isRTL;
                        k.isRTL = T, setTimeout((function() {
                            if (0 === f.find(".ui-slider-access").length) {
                                f.find(".ui-slider:visible").sliderAccess(k);
                                var e = f.find(".ui-slider-access:eq(0)").outerWidth(!0);
                                e && f.find("table:visible").each((function() {
                                    var t = $(this),
                                        i = t.outerWidth(),
                                        s = t.css(T ? "marginRight" : "marginLeft").toString().replace("%", ""),
                                        a = i - e,
                                        n = s * a / i + "%",
                                        r = {
                                            width: a,
                                            marginRight: 0,
                                            marginLeft: 0
                                        };
                                    r[T ? "marginRight" : "marginLeft"] = n, t.css(r)
                                }))
                            }
                        }), 10)
                    }
                }
            },
            _limitMinMaxDateTime: function(e, t) {
                var i = this._defaults,
                    s = new Date(e.selectedYear, e.selectedMonth, e.selectedDay);
                if (this._defaults.showTimepicker) {
                    if (null !== $.datepicker._get(e, "minDateTime") && void 0 !== $.datepicker._get(e, "minDateTime") && s) {
                        var a = $.datepicker._get(e, "minDateTime"),
                            n = new Date(a.getFullYear(), a.getMonth(), a.getDate(), 0, 0, 0, 0);
                        null !== this.hourMinOriginal && null !== this.minuteMinOriginal && null !== this.secondMinOriginal && null !== this.millisecMinOriginal || (this.hourMinOriginal = i.hourMin, this.minuteMinOriginal = i.minuteMin, this.secondMinOriginal = i.secondMin, this.millisecMinOriginal = i.millisecMin), e.settings.timeOnly || n.getTime() == s.getTime() ? (this._defaults.hourMin = a.getHours(), this.hour <= this._defaults.hourMin ? (this.hour = this._defaults.hourMin, this._defaults.minuteMin = a.getMinutes(), this.minute <= this._defaults.minuteMin ? (this.minute = this._defaults.minuteMin, this._defaults.secondMin = a.getSeconds(), this.second <= this._defaults.secondMin ? (this.second = this._defaults.secondMin, this._defaults.millisecMin = a.getMilliseconds()) : (this.millisec < this._defaults.millisecMin && (this.millisec = this._defaults.millisecMin), this._defaults.millisecMin = this.millisecMinOriginal)) : (this._defaults.secondMin = this.secondMinOriginal, this._defaults.millisecMin = this.millisecMinOriginal)) : (this._defaults.minuteMin = this.minuteMinOriginal, this._defaults.secondMin = this.secondMinOriginal, this._defaults.millisecMin = this.millisecMinOriginal)) : (this._defaults.hourMin = this.hourMinOriginal, this._defaults.minuteMin = this.minuteMinOriginal, this._defaults.secondMin = this.secondMinOriginal, this._defaults.millisecMin = this.millisecMinOriginal)
                    }
                    if (null !== $.datepicker._get(e, "maxDateTime") && void 0 !== $.datepicker._get(e, "maxDateTime") && s) {
                        var r = $.datepicker._get(e, "maxDateTime"),
                            l = new Date(r.getFullYear(), r.getMonth(), r.getDate(), 0, 0, 0, 0);
                        null !== this.hourMaxOriginal && null !== this.minuteMaxOriginal && null !== this.secondMaxOriginal || (this.hourMaxOriginal = i.hourMax, this.minuteMaxOriginal = i.minuteMax, this.secondMaxOriginal = i.secondMax, this.millisecMaxOriginal = i.millisecMax), e.settings.timeOnly || l.getTime() == s.getTime() ? (this._defaults.hourMax = r.getHours(), this.hour >= this._defaults.hourMax ? (this.hour = this._defaults.hourMax, this._defaults.minuteMax = r.getMinutes(), this.minute >= this._defaults.minuteMax ? (this.minute = this._defaults.minuteMax, this._defaults.secondMax = r.getSeconds()) : this.second >= this._defaults.secondMax ? (this.second = this._defaults.secondMax, this._defaults.millisecMax = r.getMilliseconds()) : (this.millisec > this._defaults.millisecMax && (this.millisec = this._defaults.millisecMax), this._defaults.millisecMax = this.millisecMaxOriginal)) : (this._defaults.minuteMax = this.minuteMaxOriginal, this._defaults.secondMax = this.secondMaxOriginal, this._defaults.millisecMax = this.millisecMaxOriginal)) : (this._defaults.hourMax = this.hourMaxOriginal, this._defaults.minuteMax = this.minuteMaxOriginal, this._defaults.secondMax = this.secondMaxOriginal, this._defaults.millisecMax = this.millisecMaxOriginal)
                    }
                    if (void 0 !== t && !0 === t) {
                        var o = parseInt(this._defaults.hourMax - (this._defaults.hourMax - this._defaults.hourMin) % this._defaults.stepHour, 10),
                            u = parseInt(this._defaults.minuteMax - (this._defaults.minuteMax - this._defaults.minuteMin) % this._defaults.stepMinute, 10),
                            d = parseInt(this._defaults.secondMax - (this._defaults.secondMax - this._defaults.secondMin) % this._defaults.stepSecond, 10),
                            m = parseInt(this._defaults.millisecMax - (this._defaults.millisecMax - this._defaults.millisecMin) % this._defaults.stepMillisec, 10);
                        this.hour_slider && (this.control.options(this, this.hour_slider, "hour", {
                            min: this._defaults.hourMin,
                            max: o
                        }), this.control.value(this, this.hour_slider, "hour", this.hour)), this.minute_slider && (this.control.options(this, this.minute_slider, "minute", {
                            min: this._defaults.minuteMin,
                            max: u
                        }), this.control.value(this, this.minute_slider, "minute", this.minute)), this.second_slider && (this.control.options(this, this.second_slider, "second", {
                            min: this._defaults.secondMin,
                            max: d
                        }), this.control.value(this, this.second_slider, "second", this.second)), this.millisec_slider && (this.control.options(this, this.millisec_slider, "millisec", {
                            min: this._defaults.millisecMin,
                            max: m
                        }), this.control.value(this, this.millisec_slider, "millisec", this.millisec))
                    }
                }
            },
            _onTimeChange: function() {
                var e = !!this.hour_slider && this.control.value(this, this.hour_slider, "hour"),
                    t = !!this.minute_slider && this.control.value(this, this.minute_slider, "minute"),
                    i = !!this.second_slider && this.control.value(this, this.second_slider, "second"),
                    s = !!this.millisec_slider && this.control.value(this, this.millisec_slider, "millisec"),
                    a = !!this.timezone_select && this.timezone_select.val(),
                    n = this._defaults,
                    r = n.pickerTimeFormat || n.timeFormat,
                    l = n.pickerTimeSuffix || n.timeSuffix;
                "object" == typeof e && (e = !1), "object" == typeof t && (t = !1), "object" == typeof i && (i = !1), "object" == typeof s && (s = !1), "object" == typeof a && (a = !1), !1 !== e && (e = parseInt(e, 10)), !1 !== t && (t = parseInt(t, 10)), !1 !== i && (i = parseInt(i, 10)), !1 !== s && (s = parseInt(s, 10));
                var o = n[e < 12 ? "amNames" : "pmNames"][0],
                    u = e != this.hour || t != this.minute || i != this.second || s != this.millisec || this.ampm.length > 0 && e < 12 != (-1 !== $.inArray(this.ampm.toUpperCase(), this.amNames)) || null === this.timezone && a != this.defaultTimezone || null !== this.timezone && a != this.timezone;
                u && (!1 !== e && (this.hour = e), !1 !== t && (this.minute = t), !1 !== i && (this.second = i), !1 !== s && (this.millisec = s), !1 !== a && (this.timezone = a), this.inst || (this.inst = $.datepicker._getInst(this.$input[0])), this._limitMinMaxDateTime(this.inst, !0)), useAmpm(n.timeFormat) && (this.ampm = o), this.formattedTime = $.datepicker.formatTime(n.timeFormat, this, n), this.$timeObj && (r === n.timeFormat ? this.$timeObj.text(this.formattedTime + l) : this.$timeObj.text($.datepicker.formatTime(r, this, n) + l)), this.timeDefined = !0, u && this._updateDateTime()
            },
            _onSelectHandler: function() {
                var e = this._defaults.onSelect || this.inst.settings.onSelect,
                    t = this.$input ? this.$input[0] : null;
                e && t && e.apply(t, [this.formattedDateTime, this])
            },
            _updateDateTime: function(e) {
                e = this.inst || e;
                var t = $.datepicker._daylightSavingAdjust(new Date(e.selectedYear, e.selectedMonth, e.selectedDay)),
                    i = $.datepicker._get(e, "dateFormat"),
                    s = $.datepicker._getFormatConfig(e),
                    a = null !== t && this.timeDefined;
                this.formattedDate = $.datepicker.formatDate(i, null === t ? new Date : t, s);
                var n = this.formattedDate;
                if (!0 === this._defaults.timeOnly ? n = this.formattedTime : !0 !== this._defaults.timeOnly && (this._defaults.alwaysSetTime || a) && (n += this._defaults.separator + this.formattedTime + this._defaults.timeSuffix), this.formattedDateTime = n, this._defaults.showTimepicker)
                    if (this.$altInput && !0 === this._defaults.altFieldTimeOnly) this.$altInput.val(this.formattedTime), this.$input.val(this.formattedDate);
                    else if (this.$altInput) {
                    this.$input.val(n);
                    var r = "",
                        l = this._defaults.altSeparator ? this._defaults.altSeparator : this._defaults.separator,
                        o = this._defaults.altTimeSuffix ? this._defaults.altTimeSuffix : this._defaults.timeSuffix;
                    (r = this._defaults.altFormat ? $.datepicker.formatDate(this._defaults.altFormat, null === t ? new Date : t, s) : this.formattedDate) && (r += l), this._defaults.altTimeFormat ? r += $.datepicker.formatTime(this._defaults.altTimeFormat, this, this._defaults) + o : r += this.formattedTime + o, this.$altInput.val(r)
                } else this.$input.val(n);
                else this.$input.val(this.formattedDate);
                this.$input.trigger("change")
            },
            _onFocus: function() {
                if (!this.$input.val() && this._defaults.defaultValue) {
                    this.$input.val(this._defaults.defaultValue);
                    var e = $.datepicker._getInst(this.$input.get(0)),
                        t = $.datepicker._get(e, "timepicker");
                    if (t && t._defaults.timeOnly && e.input.val() != e.lastVal) try {
                        $.datepicker._updateDatepicker(e)
                    } catch (e) {
                        $.datepicker.log(e)
                    }
                }
            },
            _controls: {
                slider: {
                    create: function(e, t, i, s, a, n, r) {
                        var l = e._defaults.isRTL;
                        return t.prop("slide", null).slider({
                            orientation: "horizontal",
                            value: l ? -1 * s : s,
                            min: l ? -1 * n : a,
                            max: l ? -1 * a : n,
                            step: r,
                            slide: function(t, s) {
                                e.control.value(e, $(this), i, l ? -1 * s.value : s.value), e._onTimeChange()
                            },
                            stop: function(t, i) {
                                e._onSelectHandler()
                            }
                        })
                    },
                    options: function(e, t, i, s, a) {
                        if (e._defaults.isRTL) {
                            if ("string" == typeof s) return "min" == s || "max" == s ? void 0 !== a ? t.slider(s, -1 * a) : Math.abs(t.slider(s)) : t.slider(s);
                            var n = s.min,
                                r = s.max;
                            return s.min = s.max = null, void 0 !== n && (s.max = -1 * n), void 0 !== r && (s.min = -1 * r), t.slider(s)
                        }
                        return "string" == typeof s && void 0 !== a ? t.slider(s, a) : t.slider(s)
                    },
                    value: function(e, t, i, s) {
                        return e._defaults.isRTL ? void 0 !== s ? t.slider("value", -1 * s) : Math.abs(t.slider("value")) : void 0 !== s ? t.slider("value", s) : t.slider("value")
                    }
                },
                select: {
                    create: function(e, t, i, s, a, n, r) {
                        for (var l = '<select class="ui-timepicker-select" data-unit="' + i + '" data-min="' + a + '" data-max="' + n + '" data-step="' + r + '">', o = (e._defaults.timeFormat.indexOf("t"), a); o <= n; o += r) l += '<option value="' + o + '"' + (o == s ? " selected" : "") + ">", "hour" == i && useAmpm(e._defaults.pickerTimeFormat || e._defaults.timeFormat) ? l += $.datepicker.formatTime("hh TT", {
                            hour: o
                        }, e._defaults) : l += "millisec" == i || o >= 10 ? o : "0" + o.toString(), l += "</option>";
                        return l += "</select>", t.children("select").remove(), $(l).appendTo(t).change((function(t) {
                            e._onTimeChange(), e._onSelectHandler()
                        })), t
                    },
                    options: function(e, t, i, s, a) {
                        var n = {},
                            r = t.children("select");
                        if ("string" == typeof s) {
                            if (void 0 === a) return r.data(s);
                            n[s] = a
                        } else n = s;
                        return e.control.create(e, t, r.data("unit"), r.val(), n.min || r.data("min"), n.max || r.data("max"), n.step || r.data("step"))
                    },
                    value: function(e, t, i, s) {
                        var a = t.children("select");
                        return void 0 !== s ? a.val(s) : a.val()
                    }
                }
            }
        }), $.fn.extend({
            timepicker: function(e) {
                e = e || {};
                var t = Array.prototype.slice.call(arguments);
                return "object" == typeof e && (t[0] = $.extend(e, {
                    timeOnly: !0
                })), $(this).each((function() {
                    $.fn.datetimepicker.apply($(this), t)
                }))
            },
            datetimepicker: function(e) {
                var t = arguments;
                return "string" == typeof(e = e || {}) ? "getDate" == e ? $.fn.datepicker.apply($(this[0]), t) : this.each((function() {
                    var e = $(this);
                    e.datepicker.apply(e, t)
                })) : this.each((function() {
                    var t = $(this);
                    t.datepicker($.timepicker._newInst(t, e)._defaults)
                }))
            }
        }), $.datepicker.parseDateTime = function(e, t, i, s, a) {
            var n = parseDateTimeInternal(e, t, i, s, a);
            if (n.timeObj) {
                var r = n.timeObj;
                n.date.setHours(r.hour, r.minute, r.second, r.millisec)
            }
            return n.date
        }, $.datepicker.parseTime = function(e, t, i) {
            var s = extendRemove(extendRemove({}, $.timepicker._defaults), i || {}),
                a = function(e, t, i) {
                    var s, a = "^" + e.toString().replace(/([hH]{1,2}|mm?|ss?|[tT]{1,2}|[lz]|'.*?')/g, (function(e) {
                            switch (e.charAt(0).toLowerCase()) {
                                case "h":
                                case "m":
                                case "s":
                                    return "(\\d?\\d)";
                                case "l":
                                    return "(\\d?\\d?\\d)";
                                case "z":
                                    return "(z|[-+]\\d\\d:?\\d\\d|\\S+)?";
                                case "t":
                                    return t = i.amNames, s = i.pmNames, a = [], t && $.merge(a, t), s && $.merge(a, s), "(" + (a = $.map(a, (function(e) {
                                        return e.replace(/[.*+?|()\[\]{}\\]/g, "\\$&")
                                    }))).join("|") + ")?";
                                default:
                                    return "(" + e.replace(/\'/g, "").replace(/(\.|\$|\^|\\|\/|\(|\)|\[|\]|\?|\+|\*)/g, (function(e) {
                                        return "\\" + e
                                    })) + ")?"
                            }
                            var t, s, a
                        })).replace(/\s/g, "\\s?") + i.timeSuffix + "$",
                        n = function(e) {
                            var t = e.toLowerCase().match(/(h{1,2}|m{1,2}|s{1,2}|l{1}|t{1,2}|z|'.*?')/g),
                                i = {
                                    h: -1,
                                    m: -1,
                                    s: -1,
                                    l: -1,
                                    t: -1,
                                    z: -1
                                };
                            if (t)
                                for (var s = 0; s < t.length; s++) - 1 == i[t[s].toString().charAt(0)] && (i[t[s].toString().charAt(0)] = s + 1);
                            return i
                        }(e),
                        r = "",
                        l = {
                            hour: 0,
                            minute: 0,
                            second: 0,
                            millisec: 0
                        };
                    if (s = t.match(new RegExp(a, "i"))) {
                        if (-1 !== n.t && (void 0 === s[n.t] || 0 === s[n.t].length ? (r = "", l.ampm = "") : (r = -1 !== $.inArray(s[n.t].toUpperCase(), i.amNames) ? "AM" : "PM", l.ampm = i["AM" == r ? "amNames" : "pmNames"][0])), -1 !== n.h && ("AM" == r && "12" == s[n.h] ? l.hour = 0 : "PM" == r && "12" != s[n.h] ? l.hour = parseInt(s[n.h], 10) + 12 : l.hour = Number(s[n.h])), -1 !== n.m && (l.minute = Number(s[n.m])), -1 !== n.s && (l.second = Number(s[n.s])), -1 !== n.l && (l.millisec = Number(s[n.l])), -1 !== n.z && void 0 !== s[n.z]) {
                            var o = s[n.z].toUpperCase();
                            switch (o.length) {
                                case 1:
                                    o = i.timezoneIso8601 ? "Z" : "+0000";
                                    break;
                                case 5:
                                    i.timezoneIso8601 && (o = "0000" == o.substring(1) ? "Z" : o.substring(0, 3) + ":" + o.substring(3));
                                    break;
                                case 6:
                                    i.timezoneIso8601 ? "00:00" == o.substring(1) && (o = "Z") : o = "Z" == o || "00:00" == o.substring(1) ? "+0000" : o.replace(/:/, "")
                            }
                            l.timezone = o
                        }
                        return l
                    }
                    return !1
                };
            return "function" == typeof s.parse ? s.parse(e, t, s) : "loose" === s.parse ? function(e, t, i) {
                try {
                    var s = new Date("2012-01-01 " + t);
                    return {
                        hour: s.getHours(),
                        minutes: s.getMinutes(),
                        seconds: s.getSeconds(),
                        millisec: s.getMilliseconds(),
                        timezone: $.timepicker.timeZoneOffsetString(s)
                    }
                } catch (s) {
                    try {
                        return a(e, t, i)
                    } catch (i) {
                        $.datepicker.log("Unable to parse \ntimeString: " + t + "\ntimeFormat: " + e)
                    }
                }
                return !1
            }(e, t, s) : a(e, t, s)
        }, $.datepicker.formatTime = function(e, t, i) {
            i = i || {}, i = $.extend({}, $.timepicker._defaults, i), t = $.extend({
                hour: 0,
                minute: 0,
                second: 0,
                millisec: 0,
                timezone: "+0000"
            }, t);
            var s = e,
                a = i.amNames[0],
                n = parseInt(t.hour, 10);
            return n > 11 && (a = i.pmNames[0]), s = s.replace(/(?:HH?|hh?|mm?|ss?|[tT]{1,2}|[lz]|('.*?'|".*?"))/g, (function(e) {
                switch (e) {
                    case "HH":
                        return ("0" + n).slice(-2);
                    case "H":
                        return n;
                    case "hh":
                        return ("0" + convert24to12(n)).slice(-2);
                    case "h":
                        return convert24to12(n);
                    case "mm":
                        return ("0" + t.minute).slice(-2);
                    case "m":
                        return t.minute;
                    case "ss":
                        return ("0" + t.second).slice(-2);
                    case "s":
                        return t.second;
                    case "l":
                        return ("00" + t.millisec).slice(-3);
                    case "z":
                        return null === t.timezone ? i.defaultTimezone : t.timezone;
                    case "T":
                        return a.charAt(0).toUpperCase();
                    case "TT":
                        return a.toUpperCase();
                    case "t":
                        return a.charAt(0).toLowerCase();
                    case "tt":
                        return a.toLowerCase();
                    default:
                        return e.replace(/\'/g, "") || "'"
                }
            })), s = $.trim(s)
        }, $.datepicker._base_selectDate = $.datepicker._selectDate, $.datepicker._selectDate = function(e, t) {
            var i = this._getInst($(e)[0]),
                s = this._get(i, "timepicker");
            s ? (s._limitMinMaxDateTime(i, !0), i.inline = i.stay_open = !0, this._base_selectDate(e, t), i.inline = i.stay_open = !1, this._notifyChange(i), this._updateDatepicker(i)) : this._base_selectDate(e, t)
        }, $.datepicker._base_updateDatepicker = $.datepicker._updateDatepicker, $.datepicker._updateDatepicker = function(e) {
            var t = e.input[0];
            if (!($.datepicker._curInst && $.datepicker._curInst != e && $.datepicker._datepickerShowing && $.datepicker._lastInput != t || "boolean" == typeof e.stay_open && !1 !== e.stay_open)) {
                this._base_updateDatepicker(e);
                var i = this._get(e, "timepicker");
                if (i && (i._addTimePicker(e), i._defaults.useLocalTimezone)) {
                    var s = new Date(e.selectedYear, e.selectedMonth, e.selectedDay, 12);
                    selectLocalTimeZone(i, s), i._onTimeChange()
                }
            }
        }, $.datepicker._base_doKeyPress = $.datepicker._doKeyPress, $.datepicker._doKeyPress = function(e) {
            var t = $.datepicker._getInst(e.target),
                i = $.datepicker._get(t, "timepicker");
            if (i && $.datepicker._get(t, "constrainInput")) {
                var s = useAmpm(i._defaults.timeFormat),
                    a = $.datepicker._possibleChars($.datepicker._get(t, "dateFormat")),
                    n = i._defaults.timeFormat.toString().replace(/[hms]/g, "").replace(/TT/g, s ? "APM" : "").replace(/Tt/g, s ? "AaPpMm" : "").replace(/tT/g, s ? "AaPpMm" : "").replace(/T/g, s ? "AP" : "").replace(/tt/g, s ? "apm" : "").replace(/t/g, s ? "ap" : "") + " " + i._defaults.separator + i._defaults.timeSuffix + (i._defaults.showTimezone ? i._defaults.timezoneList.join("") : "") + i._defaults.amNames.join("") + i._defaults.pmNames.join("") + a,
                    r = String.fromCharCode(void 0 === e.charCode ? e.keyCode : e.charCode);
                return e.ctrlKey || r < " " || !a || n.indexOf(r) > -1
            }
            return $.datepicker._base_doKeyPress(e)
        }, $.datepicker._base_updateAlternate = $.datepicker._updateAlternate, $.datepicker._updateAlternate = function(e) {
            var t = this._get(e, "timepicker");
            if (t) {
                var i = t._defaults.altField;
                if (i) {
                    t._defaults.altFormat || t._defaults.dateFormat;
                    var s = this._getDate(e),
                        a = $.datepicker._getFormatConfig(e),
                        n = "",
                        r = t._defaults.altSeparator ? t._defaults.altSeparator : t._defaults.separator,
                        l = t._defaults.altTimeSuffix ? t._defaults.altTimeSuffix : t._defaults.timeSuffix,
                        o = null !== t._defaults.altTimeFormat ? t._defaults.altTimeFormat : t._defaults.timeFormat;
                    n += $.datepicker.formatTime(o, t, t._defaults) + l, t._defaults.timeOnly || t._defaults.altFieldTimeOnly || (n = t._defaults.altFormat ? $.datepicker.formatDate(t._defaults.altFormat, null === s ? new Date : s, a) + r + n : t.formattedDate + r + n), $(i).val(n)
                }
            } else $.datepicker._base_updateAlternate(e)
        }, $.datepicker._base_doKeyUp = $.datepicker._doKeyUp, $.datepicker._doKeyUp = function(e) {
            var t = $.datepicker._getInst(e.target),
                i = $.datepicker._get(t, "timepicker");
            if (i && i._defaults.timeOnly && t.input.val() != t.lastVal) try {
                $.datepicker._updateDatepicker(t)
            } catch (e) {
                $.datepicker.log(e)
            }
            return $.datepicker._base_doKeyUp(e)
        }, $.datepicker._base_gotoToday = $.datepicker._gotoToday, $.datepicker._gotoToday = function(e) {
            var t = this._getInst($(e)[0]),
                i = t.dpDiv;
            this._base_gotoToday(e);
            var s = this._get(t, "timepicker");
            selectLocalTimeZone(s);
            var a = new Date;
            this._setTime(t, a), $(".ui-datepicker-today", i).click()
        }, $.datepicker._disableTimepickerDatepicker = function(e) {
            var t = this._getInst(e);
            if (t) {
                var i = this._get(t, "timepicker");
                $(e).datepicker("getDate"), i && (i._defaults.showTimepicker = !1, i._updateDateTime(t))
            }
        }, $.datepicker._enableTimepickerDatepicker = function(e) {
            var t = this._getInst(e);
            if (t) {
                var i = this._get(t, "timepicker");
                $(e).datepicker("getDate"), i && (i._defaults.showTimepicker = !0, i._addTimePicker(t), i._updateDateTime(t))
            }
        }, $.datepicker._setTime = function(e, t) {
            var i = this._get(e, "timepicker");
            if (i) {
                var s = i._defaults;
                i.hour = t ? t.getHours() : s.hour, i.minute = t ? t.getMinutes() : s.minute, i.second = t ? t.getSeconds() : s.second, i.millisec = t ? t.getMilliseconds() : s.millisec, i._limitMinMaxDateTime(e, !0), i._onTimeChange(), i._updateDateTime(e)
            }
        }, $.datepicker._setTimeDatepicker = function(e, t, i) {
            var s = this._getInst(e);
            if (s) {
                var a, n = this._get(s, "timepicker");
                if (n) this._setDateFromField(s), t && ("string" == typeof t ? (n._parseTime(t, i), (a = new Date).setHours(n.hour, n.minute, n.second, n.millisec)) : a = new Date(t.getTime()), "Invalid Date" == a.toString() && (a = void 0), this._setTime(s, a))
            }
        }, $.datepicker._base_setDateDatepicker = $.datepicker._setDateDatepicker, $.datepicker._setDateDatepicker = function(e, t) {
            var i = this._getInst(e);
            if (i) {
                var s = t instanceof Date ? new Date(t.getTime()) : t;
                this._updateDatepicker(i), this._base_setDateDatepicker.apply(this, arguments), this._setTimeDatepicker(e, s, !0)
            }
        }, $.datepicker._base_getDateDatepicker = $.datepicker._getDateDatepicker, $.datepicker._getDateDatepicker = function(e, t) {
            var i = this._getInst(e);
            if (i) {
                var s = this._get(i, "timepicker");
                if (s) {
                    void 0 === i.lastVal && this._setDateFromField(i, t);
                    var a = this._getDate(i);
                    return a && s._parseTime($(e).val(), s.timeOnly) && a.setHours(s.hour, s.minute, s.second, s.millisec), a
                }
                return this._base_getDateDatepicker(e, t)
            }
        }, $.datepicker._base_parseDate = $.datepicker.parseDate, $.datepicker.parseDate = function(e, t, i) {
            var s;
            try {
                s = this._base_parseDate(e, t, i)
            } catch (a) {
                s = this._base_parseDate(e, t.substring(0, t.length - (a.length - a.indexOf(":") - 2)), i), $.datepicker.log("Error parsing the date string: " + a + "\ndate string = " + t + "\ndate format = " + e)
            }
            return s
        }, $.datepicker._base_formatDate = $.datepicker._formatDate, $.datepicker._formatDate = function(e, t, i, s) {
            var a = this._get(e, "timepicker");
            return a ? (a._updateDateTime(e), a.$input.val()) : this._base_formatDate(e)
        }, $.datepicker._base_optionDatepicker = $.datepicker._optionDatepicker, $.datepicker._optionDatepicker = function(e, t, i) {
            var s, a = this._getInst(e);
            if (!a) return null;
            var n = this._get(a, "timepicker");
            if (n) {
                var r, l = null,
                    o = null,
                    u = null,
                    d = n._defaults.evnts,
                    m = {};
                if ("string" == typeof t) {
                    if ("minDate" === t || "minDateTime" === t) l = i;
                    else if ("maxDate" === t || "maxDateTime" === t) o = i;
                    else if ("onSelect" === t) u = i;
                    else if (d.hasOwnProperty(t)) {
                        if (void 0 === i) return d[t];
                        m[t] = i, s = {}
                    }
                } else if ("object" == typeof t)
                    for (r in t.minDate ? l = t.minDate : t.minDateTime ? l = t.minDateTime : t.maxDate ? o = t.maxDate : t.maxDateTime && (o = t.maxDateTime), d) d.hasOwnProperty(r) && t[r] && (m[r] = t[r]);
                for (r in m) m.hasOwnProperty(r) && (d[r] = m[r], s || (s = $.extend({}, t)), delete s[r]);
                if (s && isEmptyObject(s)) return;
                l ? (l = 0 === l ? new Date : new Date(l), n._defaults.minDate = l, n._defaults.minDateTime = l) : o ? (o = 0 === o ? new Date : new Date(o), n._defaults.maxDate = o, n._defaults.maxDateTime = o) : u && (n._defaults.onSelect = u)
            }
            return void 0 === i ? this._base_optionDatepicker.call($.datepicker, e, t) : this._base_optionDatepicker.call($.datepicker, e, s || t, i)
        };
        var isEmptyObject = function(e) {
                var t;
                for (t in e)
                    if (e.hasOwnProperty(e)) return !1;
                return !0
            },
            extendRemove = function(e, t) {
                for (var i in $.extend(e, t), t) null !== t[i] && void 0 !== t[i] || (e[i] = t[i]);
                return e
            },
            useAmpm = function(e) {
                return -1 !== e.indexOf("t") && -1 !== e.indexOf("h")
            },
            convert24to12 = function(e) {
                return e > 12 && (e -= 12), 0 == e && (e = 12), String(e)
            },
            splitDateTime = function(e, t, i, s) {
                try {
                    var a = s && s.separator ? s.separator : $.timepicker._defaults.separator,
                        n = (s && s.timeFormat ? s.timeFormat : $.timepicker._defaults.timeFormat).split(a).length,
                        r = t.split(a),
                        l = r.length;
                    if (l > 1) return [r.splice(0, l - n).join(a), r.splice(0, n).join(a)]
                } catch (i) {
                    if ($.datepicker.log("Could not split the date from the time. Please check the following datetimepicker options\nthrown error: " + i + "\ndateTimeString" + t + "\ndateFormat = " + e + "\nseparator = " + s.separator + "\ntimeFormat = " + s.timeFormat), i.indexOf(":") >= 0) {
                        var o = t.length - (i.length - i.indexOf(":") - 2);
                        t.substring(o);
                        return [$.trim(t.substring(0, o)), $.trim(t.substring(o))]
                    }
                    throw i
                }
                return [t, ""]
            },
            parseDateTimeInternal = function(e, t, i, s, a) {
                var n, r = splitDateTime(e, i, s, a);
                if (n = $.datepicker._base_parseDate(e, r[0], s), "" !== r[1]) {
                    var l = r[1],
                        o = $.datepicker.parseTime(t, l, a);
                    if (null === o) throw "Wrong time format";
                    return {
                        date: n,
                        timeObj: o
                    }
                }
                return {
                    date: n
                }
            },
            selectLocalTimeZone = function(e, t) {
                if (e && e.timezone_select) {
                    e._defaults.useLocalTimezone = !0;
                    var i = void 0 !== t ? t : new Date,
                        s = $.timepicker.timeZoneOffsetString(i);
                    e._defaults.timezoneIso8601 && (s = s.substring(0, 3) + ":" + s.substring(3)), e.timezone_select.val(s)
                }
            };
        $.timepicker = new Timepicker, $.timepicker.timeZoneOffsetString = function(e) {
            var t = -1 * e.getTimezoneOffset(),
                i = t % 60;
            return (t >= 0 ? "+" : "-") + ("0" + (101 * ((t - i) / 60)).toString()).substr(-2) + ("0" + (101 * i).toString()).substr(-2)
        }, $.timepicker.timeRange = function(e, t, i) {
            return $.timepicker.handleRange("timepicker", e, t, i)
        }, $.timepicker.dateTimeRange = function(e, t, i) {
            $.timepicker.dateRange(e, t, i, "datetimepicker")
        }, $.timepicker.dateRange = function(e, t, i, s) {
            s = s || "datepicker", $.timepicker.handleRange(s, e, t, i)
        }, $.timepicker.handleRange = function(e, t, i, s) {
            function a(e, s, a) {
                s.val() && new Date(t.val()) > new Date(i.val()) && s.val(a)
            }

            function n(t, i, s) {
                if ($(t).val()) {
                    var a = $(t)[e].call($(t), "getDate");
                    a.getTime && $(i)[e].call($(i), "option", s, a)
                }
            }
            return $.fn[e].call(t, $.extend({
                onClose: function(e, t) {
                    a(this, i, e)
                },
                onSelect: function(e) {
                    n(this, i, "minDate")
                }
            }, s, s.start)), $.fn[e].call(i, $.extend({
                onClose: function(e, i) {
                    a(this, t, e)
                },
                onSelect: function(e) {
                    n(this, t, "maxDate")
                }
            }, s, s.end)), "timepicker" != e && s.reformat && $([t, i]).each((function() {
                var t = $(this)[e].call($(this), "option", "dateFormat"),
                    i = new Date($(this).val());
                $(this).val() && i && $(this).val($.datepicker.formatDate(t, i))
            })), a(t, i, t.val()), n(t, i, "minDate"), n(i, t, "maxDate"), $([t.get(0), i.get(0)])
        }, $.timepicker.version = "1.1.1"
    }

    function Timepicker() {
        this.regional = [], this.regional[""] = {
            currentText: "Now",
            closeText: "Done",
            amNames: ["AM", "A"],
            pmNames: ["PM", "P"],
            timeFormat: "HH:mm",
            timeSuffix: "",
            timeOnlyTitle: "Choose Time",
            timeText: "Time",
            hourText: "Hour",
            minuteText: "Minute",
            secondText: "Second",
            millisecText: "Millisecond",
            timezoneText: "Time Zone",
            isRTL: !1
        }, this._defaults = {
            showButtonPanel: !0,
            timeOnly: !1,
            showHour: !0,
            showMinute: !0,
            showSecond: !1,
            showMillisec: !1,
            showTimezone: !1,
            showTime: !0,
            stepHour: 1,
            stepMinute: 1,
            stepSecond: 1,
            stepMillisec: 1,
            hour: 0,
            minute: 0,
            second: 0,
            millisec: 0,
            timezone: null,
            useLocalTimezone: !1,
            defaultTimezone: "+0000",
            hourMin: 0,
            minuteMin: 0,
            secondMin: 0,
            millisecMin: 0,
            hourMax: 23,
            minuteMax: 59,
            secondMax: 59,
            millisecMax: 999,
            minDateTime: null,
            maxDateTime: null,
            onSelect: null,
            hourGrid: 0,
            minuteGrid: 0,
            secondGrid: 0,
            millisecGrid: 0,
            alwaysSetTime: !0,
            separator: " ",
            altFieldTimeOnly: !0,
            altTimeFormat: null,
            altSeparator: null,
            altTimeSuffix: null,
            pickerTimeFormat: null,
            pickerTimeSuffix: null,
            showTimepicker: !0,
            timezoneIso8601: !1,
            timezoneList: null,
            addSliderAccess: !1,
            sliderAccessArgs: null,
            controlType: "slider",
            defaultValue: null,
            parse: "strict"
        }, $.extend(this._defaults, this.regional[""])
    }
})(jQuery);

/*
 *  Dropzone - copyright (c) 2021 Matias Meno <m@tias.me>  Licensed under the MIT license.
 *  www.dropzone.dev/js
 */
!function() {
    function e(e) {
        return e && e.__esModule ? e.default : e
    }

    function t(e) {
        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e
    }

    function i(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function n(e, t) {
        for (var i = 0; i < t.length; i++) {
            var n = t[i];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
        }
    }

    function r(e, t, i) {
        return t && n(e.prototype, t), i && n(e, i), e
    }

    function a(e) {
        return a = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
            return e.__proto__ || Object.getPrototypeOf(e)
        }, a(e)
    }

    function o(e, t) {
        return o = Object.setPrototypeOf || function(e, t) {
            return e.__proto__ = t, e
        }, o(e, t)
    }

    function l(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                writable: !0,
                configurable: !0
            }
        }), t && o(e, t)
    }

    function s(e, i) {
        return !i || "object" != ((n = i) && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof i ? t(e) : i;
        var n
    }
    var u;

    function c(e) {
        return Array.isArray(e) || "[object Object]" == {}.toString.call(e)
    }

    function d(e) {
        return !e || "object" != typeof e && "function" != typeof e
    }
    u = function e() {
        var t = [].slice.call(arguments),
            i = !1;
        "boolean" == typeof t[0] && (i = t.shift());
        var n = t[0];
        if (d(n)) throw new Error("extendee must be an object");
        for (var r = t.slice(1), a = r.length, o = 0; o < a; o++) {
            var l = r[o];
            for (var s in l)
                if (Object.prototype.hasOwnProperty.call(l, s)) {
                    var u = l[s];
                    if (i && c(u)) {
                        var h = Array.isArray(u) ? [] : {};
                        n[s] = e(!0, Object.prototype.hasOwnProperty.call(n, s) && !d(n[s]) ? n[s] : h, u)
                    } else n[s] = u
                }
        }
        return n
    };
    var h = function() {
        "use strict";

        function e() {
            i(this, e)
        }
        return r(e, [{
            key: "on",
            value: function(e, t) {
                return this._callbacks = this._callbacks || {}, this._callbacks[e] || (this._callbacks[e] = []), this._callbacks[e].push(t), this
            }
        }, {
            key: "emit",
            value: function(e) {
                for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) i[n - 1] = arguments[n];
                this._callbacks = this._callbacks || {};
                var r = this._callbacks[e],
                    a = !0,
                    o = !1,
                    l = void 0;
                if (r) try {
                    for (var s, u = r[Symbol.iterator](); !(a = (s = u.next()).done); a = !0) {
                        var c = s.value;
                        c.apply(this, i)
                    }
                } catch (e) {
                    o = !0, l = e
                } finally {
                    try {
                        a || null == u.return || u.return()
                    } finally {
                        if (o) throw l
                    }
                }
                return this.element && this.element.dispatchEvent(this.makeEvent("dropzone:" + e, {
                    args: i
                })), this
            }
        }, {
            key: "makeEvent",
            value: function(e, t) {
                var i = {
                    bubbles: !0,
                    cancelable: !0,
                    detail: t
                };
                if ("function" == typeof window.CustomEvent) return new CustomEvent(e, i);
                var n = document.createEvent("CustomEvent");
                return n.initCustomEvent(e, i.bubbles, i.cancelable, i.detail), n
            }
        }, {
            key: "off",
            value: function(e, t) {
                if (!this._callbacks || 0 === arguments.length) return this._callbacks = {}, this;
                var i = this._callbacks[e];
                if (!i) return this;
                if (1 === arguments.length) return delete this._callbacks[e], this;
                for (var n = 0; n < i.length; n++) {
                    var r = i[n];
                    if (r === t) {
                        i.splice(n, 1);
                        break
                    }
                }
                return this
            }
        }]), e
    }();
    var p = {
            url: null,
            method: "post",
            withCredentials: !1,
            timeout: null,
            parallelUploads: 2,
            uploadMultiple: !1,
            chunking: !1,
            forceChunking: !1,
            chunkSize: 2097152,
            parallelChunkUploads: !1,
            retryChunks: !1,
            retryChunksLimit: 3,
            maxFilesize: 256,
            paramName: "file",
            createImageThumbnails: !0,
            maxThumbnailFilesize: 10,
            thumbnailWidth: 120,
            thumbnailHeight: 120,
            thumbnailMethod: "crop",
            resizeWidth: null,
            resizeHeight: null,
            resizeMimeType: null,
            resizeQuality: 0.8,
            resizeMethod: "contain",
            filesizeBase: 1e3,
            maxFiles: null,
            headers: null,
            defaultHeaders: !0,
            clickable: !0,
            ignoreHiddenFiles: !0,
            acceptedFiles: null,
            acceptedMimeTypes: null,
            autoProcessQueue: !0,
            autoQueue: !0,
            addRemoveLinks: !1,
            previewsContainer: null,
            disablePreviews: !1,
            hiddenInputContainer: "body",
            capture: null,
            renameFilename: null,
            renameFile: null,
            forceFallback: !1,
            dictDefaultMessage: "Drop files here to upload",
            dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
            dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
            dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
            dictInvalidFileType: "You can't upload files of this type.",
            dictResponseError: "Server responded with {{statusCode}} code.",
            dictCancelUpload: "Cancel upload",
            dictUploadCanceled: "Upload canceled.",
            dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
            dictRemoveFile: "Remove file",
            dictRemoveFileConfirmation: null,
            dictMaxFilesExceeded: "You can not upload any more files.",
            dictFileSizeUnits: {
                tb: "TB",
                gb: "GB",
                mb: "MB",
                kb: "KB",
                b: "b"
            },
            init: function() {},
            params: function(e, t, i) {
                if (i) return {
                    dzuuid: i.file.upload.uuid,
                    dzchunkindex: i.index,
                    dztotalfilesize: i.file.size,
                    dzchunksize: this.options.chunkSize,
                    dztotalchunkcount: i.file.upload.totalChunkCount,
                    dzchunkbyteoffset: i.index * this.options.chunkSize
                }
            },
            accept: function(e, t) {
                return t()
            },
            chunksUploaded: function(e, t) {
                t()
            },
            binaryBody: !1,
            fallback: function() {
                var e;
                this.element.className = "".concat(this.element.className, " dz-browser-not-supported");
                var t = !0,
                    i = !1,
                    n = void 0;
                try {
                    for (var r, a = this.element.getElementsByTagName("div")[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                        var o = r.value;
                        if (/(^| )dz-message($| )/.test(o.className)) {
                            e = o, o.className = "dz-message";
                            break
                        }
                    }
                } catch (e) {
                    i = !0, n = e
                } finally {
                    try {
                        t || null == a.return || a.return()
                    } finally {
                        if (i) throw n
                    }
                }
                e || (e = f.createElement('<div class="dz-message"><span></span></div>'), this.element.appendChild(e));
                var l = e.getElementsByTagName("span")[0];
                return l && (null != l.textContent ? l.textContent = this.options.dictFallbackMessage : null != l.innerText && (l.innerText = this.options.dictFallbackMessage)), this.element.appendChild(this.getFallbackForm())
            },
            resize: function(e, t, i, n) {
                var r = {
                        srcX: 0,
                        srcY: 0,
                        srcWidth: e.width,
                        srcHeight: e.height
                    },
                    a = e.width / e.height;
                null == t && null == i ? (t = r.srcWidth, i = r.srcHeight) : null == t ? t = i * a : null == i && (i = t / a);
                var o = (t = Math.min(t, r.srcWidth)) / (i = Math.min(i, r.srcHeight));
                if (r.srcWidth > t || r.srcHeight > i)
                    if ("crop" === n) a > o ? (r.srcHeight = e.height, r.srcWidth = r.srcHeight * o) : (r.srcWidth = e.width, r.srcHeight = r.srcWidth / o);
                    else {
                        if ("contain" !== n) throw new Error("Unknown resizeMethod '".concat(n, "'"));
                        a > o ? i = t / a : t = i * a
                    } return r.srcX = (e.width - r.srcWidth) / 2, r.srcY = (e.height - r.srcHeight) / 2, r.trgWidth = t, r.trgHeight = i, r
            },
            transformFile: function(e, t) {
                return (this.options.resizeWidth || this.options.resizeHeight) && e.type.match(/image.*/) ? this.resizeImage(e, this.options.resizeWidth, this.options.resizeHeight, this.options.resizeMethod, t) : t(e)
            },
            previewTemplate: e('<div class="dz-file-preview dz-preview"> <div class="dz-image"><img data-dz-thumbnail=""></div> <div class="dz-details"> <div class="dz-size"><span data-dz-size=""></span></div> <div class="dz-filename"><span data-dz-name=""></span></div> </div> <div class="dz-progress"> <span class="dz-upload" data-dz-uploadprogress=""></span> </div> <div class="dz-error-message"><span data-dz-errormessage=""></span></div> <div class="dz-success-mark"> <svg width="54" height="54" fill="#fff"><path d="m10.207 29.793 4.086-4.086a1 1 0 0 1 1.414 0l5.586 5.586a1 1 0 0 0 1.414 0l15.586-15.586a1 1 0 0 1 1.414 0l4.086 4.086a1 1 0 0 1 0 1.414L22.707 42.293a1 1 0 0 1-1.414 0L10.207 31.207a1 1 0 0 1 0-1.414Z"/></svg> </div> <div class="dz-error-mark"> <svg width="54" height="54" fill="#fff"><path d="m26.293 20.293-7.086-7.086a1 1 0 0 0-1.414 0l-4.586 4.586a1 1 0 0 0 0 1.414l7.086 7.086a1 1 0 0 1 0 1.414l-7.086 7.086a1 1 0 0 0 0 1.414l4.586 4.586a1 1 0 0 0 1.414 0l7.086-7.086a1 1 0 0 1 1.414 0l7.086 7.086a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7.086-7.086a1 1 0 0 1 0-1.414l7.086-7.086a1 1 0 0 0 0-1.414l-4.586-4.586a1 1 0 0 0-1.414 0l-7.086 7.086a1 1 0 0 1-1.414 0Z"/></svg> </div> </div>'),
            drop: function(e) {
                return this.element.classList.remove("dz-drag-hover")
            },
            dragstart: function(e) {},
            dragend: function(e) {
                return this.element.classList.remove("dz-drag-hover")
            },
            dragenter: function(e) {
                return this.element.classList.add("dz-drag-hover")
            },
            dragover: function(e) {
                return this.element.classList.add("dz-drag-hover")
            },
            dragleave: function(e) {
                return this.element.classList.remove("dz-drag-hover")
            },
            paste: function(e) {},
            reset: function() {
                return this.element.classList.remove("dz-started")
            },
            addedfile: function(e) {
                if (this.element === this.previewsContainer && this.element.classList.add("dz-started"), this.previewsContainer && !this.options.disablePreviews) {
                    var t = this;
                    e.previewElement = f.createElement(this.options.previewTemplate.trim()), e.previewTemplate = e.previewElement, this.previewsContainer.appendChild(e.previewElement);
                    var i = !0,
                        n = !1,
                        r = void 0;
                    try {
                        for (var a, o = e.previewElement.querySelectorAll("[data-dz-name]")[Symbol.iterator](); !(i = (a = o.next()).done); i = !0) {
                            var l = a.value;
                            l.textContent = e.name
                        }
                    } catch (e) {
                        n = !0, r = e
                    } finally {
                        try {
                            i || null == o.return || o.return()
                        } finally {
                            if (n) throw r
                        }
                    }
                    var s = !0,
                        u = !1,
                        c = void 0;
                    try {
                        for (var d, h = e.previewElement.querySelectorAll("[data-dz-size]")[Symbol.iterator](); !(s = (d = h.next()).done); s = !0)(l = d.value).innerHTML = this.filesize(e.size)
                    } catch (e) {
                        u = !0, c = e
                    } finally {
                        try {
                            s || null == h.return || h.return()
                        } finally {
                            if (u) throw c
                        }
                    }
                    this.options.addRemoveLinks && (e._removeLink = f.createElement('<a class="dz-remove" href="javascript:undefined;" data-dz-remove>'.concat(this.options.dictRemoveFile, "</a>")), e.previewElement.appendChild(e._removeLink));
                    var p = function(i) {
                            var n = t;
                            if (i.preventDefault(), i.stopPropagation(), e.status === f.UPLOADING) return f.confirm(t.options.dictCancelUploadConfirmation, (function() {
                                return n.removeFile(e)
                            }));
                            var r = t;
                            return t.options.dictRemoveFileConfirmation ? f.confirm(t.options.dictRemoveFileConfirmation, (function() {
                                return r.removeFile(e)
                            })) : t.removeFile(e)
                        },
                        m = !0,
                        v = !1,
                        y = void 0;
                    try {
                        for (var g, b = e.previewElement.querySelectorAll("[data-dz-remove]")[Symbol.iterator](); !(m = (g = b.next()).done); m = !0) {
                            g.value.addEventListener("click", p)
                        }
                    } catch (e) {
                        v = !0, y = e
                    } finally {
                        try {
                            m || null == b.return || b.return()
                        } finally {
                            if (v) throw y
                        }
                    }
                }
            },
            removedfile: function(e) {
                return null != e.previewElement && null != e.previewElement.parentNode && e.previewElement.parentNode.removeChild(e.previewElement), this._updateMaxFilesReachedClass()
            },
            thumbnail: function(e, t) {
                if (e.previewElement) {
                    e.previewElement.classList.remove("dz-file-preview");
                    var i = !0,
                        n = !1,
                        r = void 0;
                    try {
                        for (var a, o = e.previewElement.querySelectorAll("[data-dz-thumbnail]")[Symbol.iterator](); !(i = (a = o.next()).done); i = !0) {
                            var l = a.value;
                            l.alt = e.name, l.src = t
                        }
                    } catch (e) {
                        n = !0, r = e
                    } finally {
                        try {
                            i || null == o.return || o.return()
                        } finally {
                            if (n) throw r
                        }
                    }
                    return setTimeout((function() {
                        return e.previewElement.classList.add("dz-image-preview")
                    }), 1)
                }
            },
            error: function(e, t) {
                if (e.previewElement) {
                    e.previewElement.classList.add("dz-error"), "string" != typeof t && t.error && (t = t.error);
                    var i = !0,
                        n = !1,
                        r = void 0;
                    try {
                        for (var a, o = e.previewElement.querySelectorAll("[data-dz-errormessage]")[Symbol.iterator](); !(i = (a = o.next()).done); i = !0) {
                            a.value.textContent = t
                        }
                    } catch (e) {
                        n = !0, r = e
                    } finally {
                        try {
                            i || null == o.return || o.return()
                        } finally {
                            if (n) throw r
                        }
                    }
                }
            },
            errormultiple: function() {},
            processing: function(e) {
                if (e.previewElement && (e.previewElement.classList.add("dz-processing"), e._removeLink)) return e._removeLink.innerHTML = this.options.dictCancelUpload
            },
            processingmultiple: function() {},
            uploadprogress: function(e, t, i) {
                var n = !0,
                    r = !1,
                    a = void 0;
                if (e.previewElement) try {
                    for (var o, l = e.previewElement.querySelectorAll("[data-dz-uploadprogress]")[Symbol.iterator](); !(n = (o = l.next()).done); n = !0) {
                        var s = o.value;
                        "PROGRESS" === s.nodeName ? s.value = t : s.style.width = "".concat(t, "%")
                    }
                } catch (e) {
                    r = !0, a = e
                } finally {
                    try {
                        n || null == l.return || l.return()
                    } finally {
                        if (r) throw a
                    }
                }
            },
            totaluploadprogress: function() {},
            sending: function() {},
            sendingmultiple: function() {},
            success: function(e) {
                if (e.previewElement) return e.previewElement.classList.add("dz-success")
            },
            successmultiple: function() {},
            canceled: function(e) {
                return this.emit("error", e, this.options.dictUploadCanceled)
            },
            canceledmultiple: function() {},
            complete: function(e) {
                if (e._removeLink && (e._removeLink.innerHTML = this.options.dictRemoveFile), e.previewElement) return e.previewElement.classList.add("dz-complete")
            },
            completemultiple: function() {},
            maxfilesexceeded: function() {},
            maxfilesreached: function() {},
            queuecomplete: function() {},
            addedfiles: function() {}
        },
        f = function(n) {
            "use strict";

            function o(n, r) {
                var l, c, d, h;
                if (i(this, o), (l = s(this, (c = o, a(c)).call(this))).element = n, l.clickableElements = [], l.listeners = [], l.files = [], "string" == typeof l.element && (l.element = document.querySelector(l.element)), !l.element || null == l.element.nodeType) throw new Error("Invalid dropzone element.");
                if (l.element.dropzone) throw new Error("Dropzone already attached.");
                o.instances.push(t(l)), l.element.dropzone = t(l);
                var f = null != (h = o.optionsForElement(l.element)) ? h : {};
                if (l.options = e(u)(!0, {}, p, f, null != r ? r : {}), l.options.previewTemplate = l.options.previewTemplate.replace(/\n*/g, ""), l.options.forceFallback || !o.isBrowserSupported()) return s(l, l.options.fallback.call(t(l)));
                if (null == l.options.url && (l.options.url = l.element.getAttribute("action")), !l.options.url) throw new Error("No URL provided.");
                if (l.options.acceptedFiles && l.options.acceptedMimeTypes) throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
                if (l.options.uploadMultiple && l.options.chunking) throw new Error("You cannot set both: uploadMultiple and chunking.");
                if (l.options.binaryBody && l.options.uploadMultiple) throw new Error("You cannot set both: binaryBody and uploadMultiple.");
                return l.options.acceptedMimeTypes && (l.options.acceptedFiles = l.options.acceptedMimeTypes, delete l.options.acceptedMimeTypes), null != l.options.renameFilename && (l.options.renameFile = function(e) {
                    return l.options.renameFilename.call(t(l), e.name, e)
                }), "string" == typeof l.options.method && (l.options.method = l.options.method.toUpperCase()), (d = l.getExistingFallback()) && d.parentNode && d.parentNode.removeChild(d), !1 !== l.options.previewsContainer && (l.options.previewsContainer ? l.previewsContainer = o.getElement(l.options.previewsContainer, "previewsContainer") : l.previewsContainer = l.element), l.options.clickable && (!0 === l.options.clickable ? l.clickableElements = [l.element] : l.clickableElements = o.getElements(l.options.clickable, "clickable")), l.init(), l
            }
            return l(o, n), r(o, [{
                key: "getAcceptedFiles",
                value: function() {
                    return this.files.filter((function(e) {
                        return e.accepted
                    })).map((function(e) {
                        return e
                    }))
                }
            }, {
                key: "getRejectedFiles",
                value: function() {
                    return this.files.filter((function(e) {
                        return !e.accepted
                    })).map((function(e) {
                        return e
                    }))
                }
            }, {
                key: "getFilesWithStatus",
                value: function(e) {
                    return this.files.filter((function(t) {
                        return t.status === e
                    })).map((function(e) {
                        return e
                    }))
                }
            }, {
                key: "getQueuedFiles",
                value: function() {
                    return this.getFilesWithStatus(o.QUEUED)
                }
            }, {
                key: "getUploadingFiles",
                value: function() {
                    return this.getFilesWithStatus(o.UPLOADING)
                }
            }, {
                key: "getAddedFiles",
                value: function() {
                    return this.getFilesWithStatus(o.ADDED)
                }
            }, {
                key: "getActiveFiles",
                value: function() {
                    return this.files.filter((function(e) {
                        return e.status === o.UPLOADING || e.status === o.QUEUED
                    })).map((function(e) {
                        return e
                    }))
                }
            }, {
                key: "init",
                value: function() {
                    var e = this,
                        t = this,
                        i = this,
                        n = this,
                        r = this,
                        a = this,
                        l = this,
                        s = this,
                        u = this,
                        c = this,
                        d = this;
                    if ("form" === this.element.tagName && this.element.setAttribute("enctype", "multipart/form-data"), this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message") && this.element.appendChild(o.createElement('<div class="dz-default dz-message"><button class="dz-button" type="button">'.concat(this.options.dictDefaultMessage, "</button></div>"))), this.clickableElements.length) {
                        var h = this,
                            p = function() {
                                var e = h;
                                h.hiddenFileInput && h.hiddenFileInput.parentNode.removeChild(h.hiddenFileInput), h.hiddenFileInput = document.createElement("input"), h.hiddenFileInput.setAttribute("type", "file"), (null === h.options.maxFiles || h.options.maxFiles > 1) && h.hiddenFileInput.setAttribute("multiple", "multiple"), h.hiddenFileInput.className = "dz-hidden-input", null !== h.options.acceptedFiles && h.hiddenFileInput.setAttribute("accept", h.options.acceptedFiles), null !== h.options.capture && h.hiddenFileInput.setAttribute("capture", h.options.capture), h.hiddenFileInput.setAttribute("tabindex", "-1"), h.hiddenFileInput.style.visibility = "hidden", h.hiddenFileInput.style.position = "absolute", h.hiddenFileInput.style.top = "0", h.hiddenFileInput.style.left = "0", h.hiddenFileInput.style.height = "0", h.hiddenFileInput.style.width = "0", o.getElement(h.options.hiddenInputContainer, "hiddenInputContainer").appendChild(h.hiddenFileInput), h.hiddenFileInput.addEventListener("change", (function() {
                                    var t = e.hiddenFileInput.files,
                                        i = !0,
                                        n = !1,
                                        r = void 0;
                                    if (t.length) try {
                                        for (var a, o = t[Symbol.iterator](); !(i = (a = o.next()).done); i = !0) {
                                            var l = a.value;
                                            e.addFile(l)
                                        }
                                    } catch (e) {
                                        n = !0, r = e
                                    } finally {
                                        try {
                                            i || null == o.return || o.return()
                                        } finally {
                                            if (n) throw r
                                        }
                                    }
                                    e.emit("addedfiles", t), p()
                                }))
                            };
                        p()
                    }
                    this.URL = null !== window.URL ? window.URL : window.webkitURL;
                    var f = !0,
                        m = !1,
                        v = void 0;
                    try {
                        for (var y, g = this.events[Symbol.iterator](); !(f = (y = g.next()).done); f = !0) {
                            var b = y.value;
                            this.on(b, this.options[b])
                        }
                    } catch (e) {
                        m = !0, v = e
                    } finally {
                        try {
                            f || null == g.return || g.return()
                        } finally {
                            if (m) throw v
                        }
                    }
                    this.on("uploadprogress", (function() {
                        return e.updateTotalUploadProgress()
                    })), this.on("removedfile", (function() {
                        return t.updateTotalUploadProgress()
                    })), this.on("canceled", (function(e) {
                        return i.emit("complete", e)
                    })), this.on("complete", (function(e) {
                        var t = n;
                        if (0 === n.getAddedFiles().length && 0 === n.getUploadingFiles().length && 0 === n.getQueuedFiles().length) return setTimeout((function() {
                            return t.emit("queuecomplete")
                        }), 0)
                    }));
                    var k = function(e) {
                        if (function(e) {
                                if (e.dataTransfer.types)
                                    for (var t = 0; t < e.dataTransfer.types.length; t++)
                                        if ("Files" === e.dataTransfer.types[t]) return !0;
                                return !1
                            }(e)) return e.stopPropagation(), e.preventDefault ? e.preventDefault() : e.returnValue = !1
                    };
                    return this.listeners = [{
                        element: this.element,
                        events: {
                            dragstart: function(e) {
                                return r.emit("dragstart", e)
                            },
                            dragenter: function(e) {
                                return k(e), a.emit("dragenter", e)
                            },
                            dragover: function(e) {
                                var t;
                                try {
                                    t = e.dataTransfer.effectAllowed
                                } catch (e) {}
                                return e.dataTransfer.dropEffect = "move" === t || "linkMove" === t ? "move" : "copy", k(e), l.emit("dragover", e)
                            },
                            dragleave: function(e) {
                                return s.emit("dragleave", e)
                            },
                            drop: function(e) {
                                return k(e), u.drop(e)
                            },
                            dragend: function(e) {
                                return c.emit("dragend", e)
                            }
                        }
                    }], this.clickableElements.forEach((function(e) {
                        var t = d;
                        return d.listeners.push({
                            element: e,
                            events: {
                                click: function(i) {
                                    return (e !== t.element || i.target === t.element || o.elementInside(i.target, t.element.querySelector(".dz-message"))) && t.hiddenFileInput.click(), !0
                                }
                            }
                        })
                    })), this.enable(), this.options.init.call(this)
                }
            }, {
                key: "destroy",
                value: function() {
                    return this.disable(), this.removeAllFiles(!0), (null != this.hiddenFileInput ? this.hiddenFileInput.parentNode : void 0) && (this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput), this.hiddenFileInput = null), delete this.element.dropzone, o.instances.splice(o.instances.indexOf(this), 1)
                }
            }, {
                key: "updateTotalUploadProgress",
                value: function() {
                    var e, t = 0,
                        i = 0;
                    if (this.getActiveFiles().length) {
                        var n = !0,
                            r = !1,
                            a = void 0;
                        try {
                            for (var o, l = this.getActiveFiles()[Symbol.iterator](); !(n = (o = l.next()).done); n = !0) {
                                var s = o.value;
                                t += s.upload.bytesSent, i += s.upload.total
                            }
                        } catch (e) {
                            r = !0, a = e
                        } finally {
                            try {
                                n || null == l.return || l.return()
                            } finally {
                                if (r) throw a
                            }
                        }
                        e = 100 * t / i
                    } else e = 100;
                    return this.emit("totaluploadprogress", e, i, t)
                }
            }, {
                key: "_getParamName",
                value: function(e) {
                    return "function" == typeof this.options.paramName ? this.options.paramName(e) : "".concat(this.options.paramName).concat(this.options.uploadMultiple ? "[".concat(e, "]") : "")
                }
            }, {
                key: "_renameFile",
                value: function(e) {
                    return "function" != typeof this.options.renameFile ? e.name : this.options.renameFile(e)
                }
            }, {
                key: "getFallbackForm",
                value: function() {
                    var e, t;
                    if (e = this.getExistingFallback()) return e;
                    var i = '<div class="dz-fallback">';
                    this.options.dictFallbackText && (i += "<p>".concat(this.options.dictFallbackText, "</p>")), i += '<input type="file" name="'.concat(this._getParamName(0), '" ').concat(this.options.uploadMultiple ? 'multiple="multiple"' : void 0, ' /><input type="submit" value="Upload!"></div>');
                    var n = o.createElement(i);
                    return "FORM" !== this.element.tagName ? (t = o.createElement('<form action="'.concat(this.options.url, '" enctype="multipart/form-data" method="').concat(this.options.method, '"></form>'))).appendChild(n) : (this.element.setAttribute("enctype", "multipart/form-data"), this.element.setAttribute("method", this.options.method)), null != t ? t : n
                }
            }, {
                key: "getExistingFallback",
                value: function() {
                    var e = function(e) {
                            var t = !0,
                                i = !1,
                                n = void 0;
                            try {
                                for (var r, a = e[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                                    var o = r.value;
                                    if (/(^| )fallback($| )/.test(o.className)) return o
                                }
                            } catch (e) {
                                i = !0, n = e
                            } finally {
                                try {
                                    t || null == a.return || a.return()
                                } finally {
                                    if (i) throw n
                                }
                            }
                        },
                        t = !0,
                        i = !1,
                        n = void 0;
                    try {
                        for (var r, a = ["div", "form"][Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                            var o, l = r.value;
                            if (o = e(this.element.getElementsByTagName(l))) return o
                        }
                    } catch (e) {
                        i = !0, n = e
                    } finally {
                        try {
                            t || null == a.return || a.return()
                        } finally {
                            if (i) throw n
                        }
                    }
                }
            }, {
                key: "setupEventListeners",
                value: function() {
                    return this.listeners.map((function(e) {
                        return function() {
                            var t = [];
                            for (var i in e.events) {
                                var n = e.events[i];
                                t.push(e.element.addEventListener(i, n, !1))
                            }
                            return t
                        }()
                    }))
                }
            }, {
                key: "removeEventListeners",
                value: function() {
                    return this.listeners.map((function(e) {
                        return function() {
                            var t = [];
                            for (var i in e.events) {
                                var n = e.events[i];
                                t.push(e.element.removeEventListener(i, n, !1))
                            }
                            return t
                        }()
                    }))
                }
            }, {
                key: "disable",
                value: function() {
                    var e = this;
                    return this.clickableElements.forEach((function(e) {
                        return e.classList.remove("dz-clickable")
                    })), this.removeEventListeners(), this.disabled = !0, this.files.map((function(t) {
                        return e.cancelUpload(t)
                    }))
                }
            }, {
                key: "enable",
                value: function() {
                    return delete this.disabled, this.clickableElements.forEach((function(e) {
                        return e.classList.add("dz-clickable")
                    })), this.setupEventListeners()
                }
            }, {
                key: "filesize",
                value: function(e) {
                    var t = 0,
                        i = "b";
                    if (e > 0) {
                        for (var n = ["tb", "gb", "mb", "kb", "b"], r = 0; r < n.length; r++) {
                            var a = n[r];
                            if (e >= Math.pow(this.options.filesizeBase, 4 - r) / 10) {
                                t = e / Math.pow(this.options.filesizeBase, 4 - r), i = a;
                                break
                            }
                        }
                        t = Math.round(10 * t) / 10
                    }
                    return "<strong>".concat(t, "</strong> ").concat(this.options.dictFileSizeUnits[i])
                }
            }, {
                key: "_updateMaxFilesReachedClass",
                value: function() {
                    return null != this.options.maxFiles && this.getAcceptedFiles().length >= this.options.maxFiles ? (this.getAcceptedFiles().length === this.options.maxFiles && this.emit("maxfilesreached", this.files), this.element.classList.add("dz-max-files-reached")) : this.element.classList.remove("dz-max-files-reached")
                }
            }, {
                key: "drop",
                value: function(e) {
                    if (e.dataTransfer) {
                        this.emit("drop", e);
                        for (var t = [], i = 0; i < e.dataTransfer.files.length; i++) t[i] = e.dataTransfer.files[i];
                        if (t.length) {
                            var n = e.dataTransfer.items;
                            n && n.length && null != n[0].webkitGetAsEntry ? this._addFilesFromItems(n) : this.handleFiles(t)
                        }
                        this.emit("addedfiles", t)
                    }
                }
            }, {
                key: "paste",
                value: function(e) {
                    if (null != (t = null != e ? e.clipboardData : void 0, i = function(e) {
                            return e.items
                        }, null != t ? i(t) : void 0)) {
                        var t, i;
                        this.emit("paste", e);
                        var n = e.clipboardData.items;
                        return n.length ? this._addFilesFromItems(n) : void 0
                    }
                }
            }, {
                key: "handleFiles",
                value: function(e) {
                    var t = !0,
                        i = !1,
                        n = void 0;
                    try {
                        for (var r, a = e[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                            var o = r.value;
                            this.addFile(o)
                        }
                    } catch (e) {
                        i = !0, n = e
                    } finally {
                        try {
                            t || null == a.return || a.return()
                        } finally {
                            if (i) throw n
                        }
                    }
                }
            }, {
                key: "_addFilesFromItems",
                value: function(e) {
                    var t = this;
                    return function() {
                        var i = [],
                            n = !0,
                            r = !1,
                            a = void 0;
                        try {
                            for (var o, l = e[Symbol.iterator](); !(n = (o = l.next()).done); n = !0) {
                                var s, u = o.value;
                                null != u.webkitGetAsEntry && (s = u.webkitGetAsEntry()) ? s.isFile ? i.push(t.addFile(u.getAsFile())) : s.isDirectory ? i.push(t._addFilesFromDirectory(s, s.name)) : i.push(void 0) : null != u.getAsFile && (null == u.kind || "file" === u.kind) ? i.push(t.addFile(u.getAsFile())) : i.push(void 0)
                            }
                        } catch (e) {
                            r = !0, a = e
                        } finally {
                            try {
                                n || null == l.return || l.return()
                            } finally {
                                if (r) throw a
                            }
                        }
                        return i
                    }()
                }
            }, {
                key: "_addFilesFromDirectory",
                value: function(e, t) {
                    var i = this,
                        n = e.createReader(),
                        r = function(e) {
                            return t = console, i = "log", n = function(t) {
                                return t.log(e)
                            }, null != t && "function" == typeof t[i] ? n(t, i) : void 0;
                            var t, i, n
                        },
                        a = function() {
                            var e = i;
                            return n.readEntries((function(i) {
                                if (i.length > 0) {
                                    var n = !0,
                                        r = !1,
                                        o = void 0;
                                    try {
                                        for (var l, s = i[Symbol.iterator](); !(n = (l = s.next()).done); n = !0) {
                                            var u = l.value,
                                                c = e;
                                            u.isFile ? u.file((function(e) {
                                                if (!c.options.ignoreHiddenFiles || "." !== e.name.substring(0, 1)) return e.fullPath = "".concat(t, "/").concat(e.name), c.addFile(e)
                                            })) : u.isDirectory && e._addFilesFromDirectory(u, "".concat(t, "/").concat(u.name))
                                        }
                                    } catch (e) {
                                        r = !0, o = e
                                    } finally {
                                        try {
                                            n || null == s.return || s.return()
                                        } finally {
                                            if (r) throw o
                                        }
                                    }
                                    a()
                                }
                                return null
                            }), r)
                        };
                    return a()
                }
            }, {
                key: "accept",
                value: function(e, t) {
                    this.options.maxFilesize && e.size > 1048576 * this.options.maxFilesize ? t(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(e.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize)) : o.isValidFile(e, this.options.acceptedFiles) ? null != this.options.maxFiles && this.getAcceptedFiles().length >= this.options.maxFiles ? (t(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles)), this.emit("maxfilesexceeded", e)) : this.options.accept.call(this, e, t) : t(this.options.dictInvalidFileType)
                }
            }, {
                key: "addFile",
                value: function(e) {
                    var t = this;
                    e.upload = {
                        uuid: o.uuidv4(),
                        progress: 0,
                        total: e.size,
                        bytesSent: 0,
                        filename: this._renameFile(e)
                    }, this.files.push(e), e.status = o.ADDED, this.emit("addedfile", e), this._enqueueThumbnail(e), this.accept(e, (function(i) {
                        i ? (e.accepted = !1, t._errorProcessing([e], i)) : (e.accepted = !0, t.options.autoQueue && t.enqueueFile(e)), t._updateMaxFilesReachedClass()
                    }))
                }
            }, {
                key: "enqueueFiles",
                value: function(e) {
                    var t = !0,
                        i = !1,
                        n = void 0;
                    try {
                        for (var r, a = e[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                            var o = r.value;
                            this.enqueueFile(o)
                        }
                    } catch (e) {
                        i = !0, n = e
                    } finally {
                        try {
                            t || null == a.return || a.return()
                        } finally {
                            if (i) throw n
                        }
                    }
                    return null
                }
            }, {
                key: "enqueueFile",
                value: function(e) {
                    if (e.status !== o.ADDED || !0 !== e.accepted) throw new Error("This file can't be queued because it has already been processed or was rejected.");
                    var t = this;
                    if (e.status = o.QUEUED, this.options.autoProcessQueue) return setTimeout((function() {
                        return t.processQueue()
                    }), 0)
                }
            }, {
                key: "_enqueueThumbnail",
                value: function(e) {
                    if (this.options.createImageThumbnails && e.type.match(/image.*/) && e.size <= 1048576 * this.options.maxThumbnailFilesize) {
                        var t = this;
                        return this._thumbnailQueue.push(e), setTimeout((function() {
                            return t._processThumbnailQueue()
                        }), 0)
                    }
                }
            }, {
                key: "_processThumbnailQueue",
                value: function() {
                    var e = this;
                    if (!this._processingThumbnail && 0 !== this._thumbnailQueue.length) {
                        this._processingThumbnail = !0;
                        var t = this._thumbnailQueue.shift();
                        return this.createThumbnail(t, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.thumbnailMethod, !0, (function(i) {
                            return e.emit("thumbnail", t, i), e._processingThumbnail = !1, e._processThumbnailQueue()
                        }))
                    }
                }
            }, {
                key: "removeFile",
                value: function(e) {
                    if (e.status === o.UPLOADING && this.cancelUpload(e), this.files = m(this.files, e), this.emit("removedfile", e), 0 === this.files.length) return this.emit("reset")
                }
            }, {
                key: "removeAllFiles",
                value: function(e) {
                    null == e && (e = !1);
                    var t = !0,
                        i = !1,
                        n = void 0,
                        a;
                    try {
                        for (var r, a = this.files.slice()[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                            var l = r.value;
                            (l.status !== o.UPLOADING || e) && this.removeFile(l)
                        }
                    } catch (e) {
                        i = !0, n = e
                    } finally {
                        try {
                            t || null == a.return || a.return()
                        } finally {
                            if (i) throw n
                        }
                    }
                    return null
                }
            }, {
                key: "resizeImage",
                value: function(e, t, i, n, r) {
                    var a = this;
                    return this.createThumbnail(e, t, i, n, !0, (function(t, i) {
                        if (null == i) return r(e);
                        var n = a.options.resizeMimeType;
                        null == n && (n = e.type);
                        var l = i.toDataURL(n, a.options.resizeQuality);
                        return "image/jpeg" !== n && "image/jpg" !== n || (l = g.restore(e.dataURL, l)), r(o.dataURItoBlob(l))
                    }))
                }
            }, {
                key: "createThumbnail",
                value: function(e, t, i, n, r, a) {
                    var o = this,
                        l = new FileReader;
                    l.onload = function() {
                        e.dataURL = l.result, "image/svg+xml" !== e.type ? o.createThumbnailFromUrl(e, t, i, n, r, a) : null != a && a(l.result)
                    }, l.readAsDataURL(e)
                }
            }, {
                key: "displayExistingFile",
                value: function(e, t, i, n, r) {
                    var a = void 0 === r || r;
                    if (this.emit("addedfile", e), this.emit("complete", e), a) {
                        var o = this;
                        e.dataURL = t, this.createThumbnailFromUrl(e, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.thumbnailMethod, this.options.fixOrientation, (function(t) {
                            o.emit("thumbnail", e, t), i && i()
                        }), n)
                    } else this.emit("thumbnail", e, t), i && i()
                }
            }, {
                key: "createThumbnailFromUrl",
                value: function(e, t, i, n, r, a, o) {
                    var l = this,
                        s = document.createElement("img");
                    return o && (s.crossOrigin = o), r = "from-image" != getComputedStyle(document.body).imageOrientation && r, s.onload = function() {
                        var o = l,
                            u = function(e) {
                                return e(1)
                            };
                        return "undefined" != typeof EXIF && null !== EXIF && r && (u = function(e) {
                            return EXIF.getData(s, (function() {
                                return e(EXIF.getTag(this, "Orientation"))
                            }))
                        }), u((function(r) {
                            e.width = s.width, e.height = s.height;
                            var l = o.options.resize.call(o, e, t, i, n),
                                u = document.createElement("canvas"),
                                c = u.getContext("2d");
                            switch (u.width = l.trgWidth, u.height = l.trgHeight, r > 4 && (u.width = l.trgHeight, u.height = l.trgWidth), r) {
                                case 2:
                                    c.translate(u.width, 0), c.scale(-1, 1);
                                    break;
                                case 3:
                                    c.translate(u.width, u.height), c.rotate(Math.PI);
                                    break;
                                case 4:
                                    c.translate(0, u.height), c.scale(1, -1);
                                    break;
                                case 5:
                                    c.rotate(0.5 * Math.PI), c.scale(1, -1);
                                    break;
                                case 6:
                                    c.rotate(0.5 * Math.PI), c.translate(0, -u.width);
                                    break;
                                case 7:
                                    c.rotate(0.5 * Math.PI), c.translate(u.height, -u.width), c.scale(-1, 1);
                                    break;
                                case 8:
                                    c.rotate(-0.5 * Math.PI), c.translate(-u.height, 0)
                            }
                            y(c, s, null != l.srcX ? l.srcX : 0, null != l.srcY ? l.srcY : 0, l.srcWidth, l.srcHeight, null != l.trgX ? l.trgX : 0, null != l.trgY ? l.trgY : 0, l.trgWidth, l.trgHeight);
                            var d = u.toDataURL("image/png");
                            if (null != a) return a(d, u)
                        }))
                    }, null != a && (s.onerror = a), s.src = e.dataURL
                }
            }, {
                key: "processQueue",
                value: function() {
                    var e = this.options.parallelUploads,
                        t = this.getUploadingFiles().length,
                        i = t;
                    if (!(t >= e)) {
                        var n = this.getQueuedFiles();
                        if (n.length > 0) {
                            if (this.options.uploadMultiple) return this.processFiles(n.slice(0, e - t));
                            for (; i < e;) {
                                if (!n.length) return;
                                this.processFile(n.shift()), i++
                            }
                        }
                    }
                }
            }, {
                key: "processFile",
                value: function(e) {
                    return this.processFiles([e])
                }
            }, {
                key: "processFiles",
                value: function(e) {
                    var t = !0,
                        i = !1,
                        n = void 0;
                    try {
                        for (var r, a = e[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                            var l = r.value;
                            l.processing = !0, l.status = o.UPLOADING, this.emit("processing", l)
                        }
                    } catch (e) {
                        i = !0, n = e
                    } finally {
                        try {
                            t || null == a.return || a.return()
                        } finally {
                            if (i) throw n
                        }
                    }
                    return this.options.uploadMultiple && this.emit("processingmultiple", e), this.uploadFiles(e)
                }
            }, {
                key: "_getFilesWithXhr",
                value: function(e) {
                    return this.files.filter((function(t) {
                        return t.xhr === e
                    })).map((function(e) {
                        return e
                    }))
                }
            }, {
                key: "cancelUpload",
                value: function(e) {
                    if (e.status === o.UPLOADING) {
                        var t = this._getFilesWithXhr(e.xhr),
                            i = !0,
                            n = !1,
                            r = void 0;
                        try {
                            for (var a, l = t[Symbol.iterator](); !(i = (a = l.next()).done); i = !0) {
                                (p = a.value).status = o.CANCELED
                            }
                        } catch (e) {
                            n = !0, r = e
                        } finally {
                            try {
                                i || null == l.return || l.return()
                            } finally {
                                if (n) throw r
                            }
                        }
                        void 0 !== e.xhr && e.xhr.abort();
                        var s = !0,
                            u = !1,
                            c = void 0;
                        try {
                            for (var d, h = t[Symbol.iterator](); !(s = (d = h.next()).done); s = !0) {
                                var p = d.value;
                                this.emit("canceled", p)
                            }
                        } catch (e) {
                            u = !0, c = e
                        } finally {
                            try {
                                s || null == h.return || h.return()
                            } finally {
                                if (u) throw c
                            }
                        }
                        this.options.uploadMultiple && this.emit("canceledmultiple", t)
                    } else e.status !== o.ADDED && e.status !== o.QUEUED || (e.status = o.CANCELED, this.emit("canceled", e), this.options.uploadMultiple && this.emit("canceledmultiple", [e]));
                    if (this.options.autoProcessQueue) return this.processQueue()
                }
            }, {
                key: "resolveOption",
                value: function(e) {
                    for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) i[n - 1] = arguments[n];
                    return "function" == typeof e ? e.apply(this, i) : e
                }
            }, {
                key: "uploadFile",
                value: function(e) {
                    return this.uploadFiles([e])
                }
            }, {
                key: "uploadFiles",
                value: function(e) {
                    var t = this;
                    this._transformFiles(e, (function(i) {
                        if (t.options.chunking) {
                            var n = i[0];
                            e[0].upload.chunked = t.options.chunking && (t.options.forceChunking || n.size > t.options.chunkSize), e[0].upload.totalChunkCount = Math.ceil(n.size / t.options.chunkSize)
                        }
                        if (e[0].upload.chunked) {
                            var r = t,
                                a = t,
                                l = e[0],
                                n = i[0];
                            l.upload.chunks = [];
                            var s = function() {
                                for (var t = 0; void 0 !== l.upload.chunks[t];) t++;
                                if (!(t >= l.upload.totalChunkCount)) {
                                    0;
                                    var i = t * r.options.chunkSize,
                                        a = Math.min(i + r.options.chunkSize, n.size),
                                        s = {
                                            name: r._getParamName(0),
                                            data: n.webkitSlice ? n.webkitSlice(i, a) : n.slice(i, a),
                                            filename: l.upload.filename,
                                            chunkIndex: t
                                        };
                                    l.upload.chunks[t] = {
                                        file: l,
                                        index: t,
                                        dataBlock: s,
                                        status: o.UPLOADING,
                                        progress: 0,
                                        retries: 0
                                    }, r._uploadData(e, [s])
                                }
                            };
                            if (l.upload.finishedChunkUpload = function(t, i) {
                                    var n = a,
                                        r = !0;
                                    t.status = o.SUCCESS, t.dataBlock = null, t.response = t.xhr.responseText, t.responseHeaders = t.xhr.getAllResponseHeaders(), t.xhr = null;
                                    for (var u = 0; u < l.upload.totalChunkCount; u++) {
                                        if (void 0 === l.upload.chunks[u]) return s();
                                        l.upload.chunks[u].status !== o.SUCCESS && (r = !1)
                                    }
                                    r && a.options.chunksUploaded(l, (function() {
                                        n._finished(e, i, null)
                                    }))
                                }, t.options.parallelChunkUploads)
                                for (var u = 0; u < l.upload.totalChunkCount; u++) s();
                            else s()
                        } else {
                            var c = [];
                            for (var u = 0; u < e.length; u++) c[u] = {
                                name: t._getParamName(u),
                                data: i[u],
                                filename: e[u].upload.filename
                            };
                            t._uploadData(e, c)
                        }
                    }))
                }
            }, {
                key: "_getChunk",
                value: function(e, t) {
                    for (var i = 0; i < e.upload.totalChunkCount; i++)
                        if (void 0 !== e.upload.chunks[i] && e.upload.chunks[i].xhr === t) return e.upload.chunks[i]
                }
            }, {
                key: "_uploadData",
                value: function(t, i) {
                    var n = this,
                        r = this,
                        a = this,
                        o = this,
                        l = new XMLHttpRequest(),
                        s = !0,
                        c = !1,
                        d = void 0,
                        x, g, h;
                    try {
                        for (var h = t[Symbol.iterator](); !(s = (x = h.next()).done); s = !0) {
                            (g = x.value).xhr = l
                        }
                    } catch (e) {
                        c = !0, d = e
                    } finally {
                        try {
                            s || null == h.return || h.return()
                        } finally {
                            if (c) throw d
                        }
                    }
                    t[0].upload.chunked && (t[0].upload.chunks[i[0].chunkIndex].xhr = l);
                    var p = this.resolveOption(this.options.method, t, i),
                        f = this.resolveOption(this.options.url, t, i);
                    l.open(p, f, !0), this.resolveOption(this.options.timeout, t) && (l.timeout = this.resolveOption(this.options.timeout, t)), l.withCredentials = !!this.options.withCredentials, l.onload = function(e) {
                        n._finishedUploading(t, l, e)
                    }, l.ontimeout = function() {
                        r._handleUploadError(t, l, "Request timedout after ".concat(r.options.timeout / 1e3, " seconds"))
                    }, l.onerror = function() {
                        a._handleUploadError(t, l)
                    }, (null != l.upload ? l.upload : l).onprogress = function(e) {
                        return o._updateFilesUploadProgress(t, l, e)
                    };
                    var m = this.options.defaultHeaders ? {
                        Accept: "application/json",
                        "Cache-Control": "no-cache",
                        "X-Requested-With": "XMLHttpRequest"
                    } : {};
                    for (var v in this.options.binaryBody && (m["Content-Type"] = t[0].type), this.options.headers && e(u)(m, this.options.headers), m) {
                        var y = m[v];
                        y && l.setRequestHeader(v, y)
                    }
                    if (this.options.binaryBody) {
                        s = !0, c = !1, d = void 0;
                        try {
                            for (h = t[Symbol.iterator](); !(s = (x = h.next()).done); s = !0) {
                                var g = x.value;
                                this.emit("sending", g, l)
                            }
                        } catch (e) {
                            c = !0, d = e
                        } finally {
                            try {
                                s || null == h.return || h.return()
                            } finally {
                                if (c) throw d
                            }
                        }
                        this.options.uploadMultiple && this.emit("sendingmultiple", t, l), this.submitRequest(l, null, t)
                    } else {
                        var b = new FormData();
                        if (this.options.params) {
                            var k = this.options.params;
                            for (var w in "function" == typeof k && (k = k.call(this, t, l, t[0].upload.chunked ? this._getChunk(t[0], l) : null)), k) {
                                var F = k[w];
                                if (Array.isArray(F))
                                    for (var E = 0; E < F.length; E++) b.append(w, F[E]);
                                else b.append(w, F)
                            }
                        }
                        s = !0, c = !1, d = void 0;
                        try {
                            var x;
                            for (h = t[Symbol.iterator](); !(s = (x = h.next()).done); s = !0) {
                                g = x.value;
                                this.emit("sending", g, l, b)
                            }
                        } catch (e) {
                            c = !0, d = e
                        } finally {
                            try {
                                s || null == h.return || h.return()
                            } finally {
                                if (c) throw d
                            }
                        }
                        this.options.uploadMultiple && this.emit("sendingmultiple", t, l, b), this._addFormElementData(b);
                        for (var E = 0; E < i.length; E++) {
                            var z = i[E];
                            b.append(z.name, z.data, z.filename)
                        }
                        this.submitRequest(l, b, t)
                    }
                }
            }, {
                key: "_transformFiles",
                value: function(e, t) {
                    for (var i = this, n = function(n) {
                            i.options.transformFile.call(i, e[n], (function(i) {
                                r[n] = i, ++a === e.length && t(r)
                            }))
                        }, r = [], a = 0, o = 0; o < e.length; o++) n(o)
                }
            }, {
                key: "_addFormElementData",
                value: function(e) {
                    var t = !0,
                        i = !1,
                        n = void 0,
                        r, s;
                    if ("FORM" === this.element.tagName) try {
                        for (r = this.element.querySelectorAll("input, textarea, select, button")[Symbol.iterator](); !(t = (s = r.next()).done); t = !0) {
                            var a = s.value,
                                o = a.getAttribute("name"),
                                l = a.getAttribute("type");
                            if (l && (l = l.toLowerCase()), null != o)
                                if ("SELECT" === a.tagName && a.hasAttribute("multiple")) {
                                    t = !0, i = !1, n = void 0;
                                    try {
                                        var s;
                                        for (r = a.options[Symbol.iterator](); !(t = (s = r.next()).done); t = !0) {
                                            var u = s.value;
                                            u.selected && e.append(o, u.value)
                                        }
                                    } catch (e) {
                                        i = !0, n = e
                                    } finally {
                                        try {
                                            t || null == r.return || r.return()
                                        } finally {
                                            if (i) throw n
                                        }
                                    }
                                } else(!l || "checkbox" !== l && "radio" !== l || a.checked) && e.append(o, a.value)
                        }
                    } catch (e) {
                        i = !0, n = e
                    } finally {
                        try {
                            t || null == r.return || r.return()
                        } finally {
                            if (i) throw n
                        }
                    }
                }
            }, {
                key: "_updateFilesUploadProgress",
                value: function(e, t, i) {
                    var n = !0,
                        r = !1,
                        a = void 0,
                        c, u;
                    if (e[0].upload.chunked) {
                        c = e[0];
                        var o = this._getChunk(c, t);
                        i ? (o.progress = 100 * i.loaded / i.total, o.total = i.total, o.bytesSent = i.loaded) : (o.progress = 100, o.bytesSent = o.total), c.upload.progress = 0, c.upload.total = 0, c.upload.bytesSent = 0;
                        for (var l = 0; l < c.upload.totalChunkCount; l++) c.upload.chunks[l] && void 0 !== c.upload.chunks[l].progress && (c.upload.progress += c.upload.chunks[l].progress, c.upload.total += c.upload.chunks[l].total, c.upload.bytesSent += c.upload.chunks[l].bytesSent);
                        c.upload.progress = c.upload.progress / c.upload.totalChunkCount, this.emit("uploadprogress", c, c.upload.progress, c.upload.bytesSent)
                    } else try {
                        for (var s, u = e[Symbol.iterator](); !(n = (s = u.next()).done); n = !0) {
                            var c;
                            (c = s.value).upload.total && c.upload.bytesSent && c.upload.bytesSent == c.upload.total || (i ? (c.upload.progress = 100 * i.loaded / i.total, c.upload.total = i.total, c.upload.bytesSent = i.loaded) : (c.upload.progress = 100, c.upload.bytesSent = c.upload.total), this.emit("uploadprogress", c, c.upload.progress, c.upload.bytesSent))
                        }
                    } catch (e) {
                        r = !0, a = e
                    } finally {
                        try {
                            n || null == u.return || u.return()
                        } finally {
                            if (r) throw a
                        }
                    }
                }
            }, {
                key: "_finishedUploading",
                value: function(e, t, i) {
                    var n;
                    if (e[0].status !== o.CANCELED && 4 === t.readyState) {
                        if ("arraybuffer" !== t.responseType && "blob" !== t.responseType && (n = t.responseText, t.getResponseHeader("content-type") && ~t.getResponseHeader("content-type").indexOf("application/json"))) try {
                            n = JSON.parse(n)
                        } catch (e) {
                            i = e, n = "Invalid JSON response from server."
                        }
                        this._updateFilesUploadProgress(e, t), 200 <= t.status && t.status < 300 ? e[0].upload.chunked ? e[0].upload.finishedChunkUpload(this._getChunk(e[0], t), n) : this._finished(e, n, i) : this._handleUploadError(e, t, n)
                    }
                }
            }, {
                key: "_handleUploadError",
                value: function(e, t, i) {
                    if (e[0].status !== o.CANCELED) {
                        if (e[0].upload.chunked && this.options.retryChunks) {
                            var n = this._getChunk(e[0], t);
                            if (n.retries++ < this.options.retryChunksLimit) return void this._uploadData(e, [n.dataBlock]);
                            console.warn("Retried this chunk too often. Giving up.")
                        }
                        this._errorProcessing(e, i || this.options.dictResponseError.replace("{{statusCode}}", t.status), t)
                    }
                }
            }, {
                key: "submitRequest",
                value: function(e, t, i) {
                    if (1 == e.readyState)
                        if (this.options.binaryBody)
                            if (i[0].upload.chunked) {
                                var n = this._getChunk(i[0], e);
                                e.send(n.dataBlock.data)
                            } else e.send(i[0]);
                    else e.send(t);
                    else console.warn("Cannot send this request because the XMLHttpRequest.readyState is not OPENED.")
                }
            }, {
                key: "_finished",
                value: function(e, t, i) {
                    var n = !0,
                        r = !1,
                        a = void 0;
                    try {
                        for (var l, s = e[Symbol.iterator](); !(n = (l = s.next()).done); n = !0) {
                            var u = l.value;
                            u.status = o.SUCCESS, this.emit("success", u, t, i), this.emit("complete", u)
                        }
                    } catch (e) {
                        r = !0, a = e
                    } finally {
                        try {
                            n || null == s.return || s.return()
                        } finally {
                            if (r) throw a
                        }
                    }
                    if (this.options.uploadMultiple && (this.emit("successmultiple", e, t, i), this.emit("completemultiple", e)), this.options.autoProcessQueue) return this.processQueue()
                }
            }, {
                key: "_errorProcessing",
                value: function(e, t, i) {
                    var n = !0,
                        r = !1,
                        a = void 0;
                    try {
                        for (var l, s = e[Symbol.iterator](); !(n = (l = s.next()).done); n = !0) {
                            var u = l.value;
                            u.status = o.ERROR, this.emit("error", u, t, i), this.emit("complete", u)
                        }
                    } catch (e) {
                        r = !0, a = e
                    } finally {
                        try {
                            n || null == s.return || s.return()
                        } finally {
                            if (r) throw a
                        }
                    }
                    if (this.options.uploadMultiple && (this.emit("errormultiple", e, t, i), this.emit("completemultiple", e)), this.options.autoProcessQueue) return this.processQueue()
                }
            }], [{
                key: "initClass",
                value: function() {
                    this.prototype.Emitter = h, this.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "addedfiles", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached", "queuecomplete"], this.prototype._thumbnailQueue = [], this.prototype._processingThumbnail = !1
                }
            }, {
                key: "uuidv4",
                value: function() {
                    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(e) {
                        var t = 16 * Math.random() | 0;
                        return ("x" === e ? t : 3 & t | 8).toString(16)
                    }))
                }
            }]), o
        }(h);
    f.initClass(), f.options = {}, f.optionsForElement = function(e) {
        return e.getAttribute("id") ? f.options[v(e.getAttribute("id"))] : void 0
    }, f.instances = [], f.forElement = function(e) {
        if ("string" == typeof e && (e = document.querySelector(e)), null == (null != e ? e.dropzone : void 0)) throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
        return e.dropzone
    }, f.discover = function() {
        var e;
        if (document.querySelectorAll) e = document.querySelectorAll(".dropzone");
        else {
            e = [];
            var t = function(t) {
                return function() {
                    var i = [],
                        n = !0,
                        r = !1,
                        a = void 0;
                    try {
                        for (var o, l = t[Symbol.iterator](); !(n = (o = l.next()).done); n = !0) {
                            var s = o.value;
                            /(^| )dropzone($| )/.test(s.className) ? i.push(e.push(s)) : i.push(void 0)
                        }
                    } catch (e) {
                        r = !0, a = e
                    } finally {
                        try {
                            n || null == l.return || l.return()
                        } finally {
                            if (r) throw a
                        }
                    }
                    return i
                }()
            };
            t(document.getElementsByTagName("div")), t(document.getElementsByTagName("form"))
        }
        return function() {
            var t = [],
                i = !0,
                n = !1,
                r = void 0;
            try {
                for (var a, o = e[Symbol.iterator](); !(i = (a = o.next()).done); i = !0) {
                    var l = a.value;
                    !1 !== f.optionsForElement(l) ? t.push(new f(l)) : t.push(void 0)
                }
            } catch (e) {
                n = !0, r = e
            } finally {
                try {
                    i || null == o.return || o.return()
                } finally {
                    if (n) throw r
                }
            }
            return t
        }()
    }, f.blockedBrowsers = [/opera.*(Macintosh|Windows Phone).*version\/12/i], f.isBrowserSupported = function() {
        var e = !0;
        if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector)
            if ("classList" in document.createElement("a")) {
                void 0 !== f.blacklistedBrowsers && (f.blockedBrowsers = f.blacklistedBrowsers);
                var t = !0,
                    i = !1,
                    n = void 0,
                    a;
                try {
                    for (var r, a = f.blockedBrowsers[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                        r.value.test(navigator.userAgent) && (e = !1)
                    }
                } catch (e) {
                    i = !0, n = e
                } finally {
                    try {
                        t || null == a.return || a.return()
                    } finally {
                        if (i) throw n
                    }
                }
            } else e = !1;
        else e = !1;
        return e
    }, f.dataURItoBlob = function(e) {
        for (var t = atob(e.split(",")[1]), i = e.split(",")[0].split(":")[1].split(";")[0], n = new ArrayBuffer(t.length), r = new Uint8Array(n), a = 0, o = t.length, l = 0 <= o; l ? a <= o : a >= o; l ? a++ : a--) r[a] = t.charCodeAt(a);
        return new Blob([n], {
            type: i
        })
    };
    var m = function(e, t) {
            return e.filter((function(e) {
                return e !== t
            })).map((function(e) {
                return e
            }))
        },
        v = function(e) {
            return e.replace(/[\-_](\w)/g, (function(e) {
                return e.charAt(1).toUpperCase()
            }))
        };
    f.createElement = function(e) {
        var t = document.createElement("div");
        return t.innerHTML = e, t.childNodes[0]
    }, f.elementInside = function(e, t) {
        if (e === t) return !0;
        for (; e = e.parentNode;)
            if (e === t) return !0;
        return !1
    }, f.getElement = function(e, t) {
        var i;
        if ("string" == typeof e ? i = document.querySelector(e) : null != e.nodeType && (i = e), null == i) throw new Error("Invalid `".concat(t, "` option provided. Please provide a CSS selector or a plain HTML element."));
        return i
    }, f.getElements = function(e, t) {
        var i, n, l, r, s;
        if (e instanceof Array) {
            n = [];
            try {
                var r = !0,
                    a = !1,
                    o = void 0;
                try {
                    for (var l = e[Symbol.iterator](); !(r = (s = l.next()).done); r = !0) i = s.value, n.push(this.getElement(i, t))
                } catch (e) {
                    a = !0, o = e
                } finally {
                    try {
                        r || null == l.return || l.return()
                    } finally {
                        if (a) throw o
                    }
                }
            } catch (e) {
                n = null
            }
        } else if ("string" == typeof e) {
            n = [];
            r = !0, a = !1, o = void 0;
            try {
                var s;
                for (l = document.querySelectorAll(e)[Symbol.iterator](); !(r = (s = l.next()).done); r = !0) i = s.value, n.push(i)
            } catch (e) {
                a = !0, o = e
            } finally {
                try {
                    r || null == l.return || l.return()
                } finally {
                    if (a) throw o
                }
            }
        } else null != e.nodeType && (n = [e]);
        if (null == n || !n.length) throw new Error("Invalid `".concat(t, "` option provided. Please provide a CSS selector, a plain HTML element or a list of those."));
        return n
    }, f.confirm = function(e, t, i) {
        return window.confirm(e) ? t() : null != i ? i() : void 0
    }, f.isValidFile = function(e, t) {
        if (!t) return !0;
        t = t.split(",");
        var i = e.type,
            n = i.replace(/\/.*$/, ""),
            r = !0,
            a = !1,
            o = void 0,
            s;
        try {
            for (var l, s = t[Symbol.iterator](); !(r = (l = s.next()).done); r = !0) {
                var u = l.value;
                if ("." === (u = u.trim()).charAt(0)) {
                    if (-1 !== e.name.toLowerCase().indexOf(u.toLowerCase(), e.name.length - u.length)) return !0
                } else if (/\/\*$/.test(u)) {
                    if (n === u.replace(/\/.*$/, "")) return !0
                } else if (i === u) return !0
            }
        } catch (e) {
            a = !0, o = e
        } finally {
            try {
                r || null == s.return || s.return()
            } finally {
                if (a) throw o
            }
        }
        return !1
    }, "undefined" != typeof jQuery && null !== jQuery && (jQuery.fn.dropzone = function(e) {
        return this.each((function() {
            return new f(this, e)
        }))
    }), f.ADDED = "added", f.QUEUED = "queued", f.ACCEPTED = f.QUEUED, f.UPLOADING = "uploading", f.PROCESSING = f.UPLOADING, f.CANCELED = "canceled", f.ERROR = "error", f.SUCCESS = "success";
    var y = function(e, t, i, n, r, a, o, l, s, u) {
            var c = function(e) {
                e.naturalWidth;
                var t = e.naturalHeight,
                    i = document.createElement("canvas");
                i.width = 1, i.height = t;
                var n = i.getContext("2d");
                n.drawImage(e, 0, 0);
                for (var r = n.getImageData(1, 0, 1, t).data, a = 0, o = t, l = t; l > a;) 0 === r[4 * (l - 1) + 3] ? o = l : a = l, l = o + a >> 1;
                var s = l / t;
                return 0 === s ? 1 : s
            }(t);
            return e.drawImage(t, i, n, r, a, o, l, s, u / c)
        },
        g = function() {
            "use strict";

            function e() {
                i(this, e) //TODO if a strict mode function is executed using function invocation, its 'this' value will be undefined
            }
            return r(e, null, [{
                key: "initClass",
                value: function() {
                    this.KEY_STR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
                }
            }, {
                key: "encode64",
                value: function(e) {
                    for (var t = "", i = void 0, n = void 0, r = "", a = void 0, o = void 0, l = void 0, s = "", u = 0; a = (i = e[u++]) >> 2, o = (3 & i) << 4 | (n = e[u++]) >> 4, l = (15 & n) << 2 | (r = e[u++]) >> 6, s = 63 & r, isNaN(n) ? l = s = 64 : isNaN(r) && (s = 64), t = t + this.KEY_STR.charAt(a) + this.KEY_STR.charAt(o) + this.KEY_STR.charAt(l) + this.KEY_STR.charAt(s), i = n = r = "", a = o = l = s = "", u < e.length;);
                    return t
                }
            }, {
                key: "restore",
                value: function(e, t) {
                    if (!e.match("data:image/jpeg;base64,")) return t;
                    var i = this.decode64(e.replace("data:image/jpeg;base64,", "")),
                        n = this.slice2Segments(i),
                        r = this.exifManipulation(t, n);
                    return "data:image/jpeg;base64,".concat(this.encode64(r))
                }
            }, {
                key: "exifManipulation",
                value: function(e, t) {
                    var i = this.getExifArray(t),
                        n = this.insertExif(e, i);
                    return new Uint8Array(n)
                }
            }, {
                key: "getExifArray",
                value: function(e) {
                    for (var t = void 0, i = 0; i < e.length;) {
                        if (255 === (t = e[i])[0] & 225 === t[1]) return t;
                        i++
                    }
                    return []
                }
            }, {
                key: "insertExif",
                value: function(e, t) {
                    var i = e.replace("data:image/jpeg;base64,", ""),
                        n = this.decode64(i),
                        r = n.indexOf(255, 3),
                        a = n.slice(0, r),
                        o = n.slice(r),
                        l = a;
                    return l = (l = l.concat(t)).concat(o)
                }
            }, {
                key: "slice2Segments",
                value: function(e) {
                    for (var t = 0, i = [];;) {
                        if (255 === e[t] & 218 === e[t + 1]) break;
                        if (255 === e[t] & 216 === e[t + 1]) t += 2;
                        else {
                            var n = t + (256 * e[t + 2] + e[t + 3]) + 2,
                                r = e.slice(t, n);
                            i.push(r), t = n
                        }
                        if (t > e.length) break
                    }
                    return i
                }
            }, {
                key: "decode64",
                value: function(e) {
                    var t = void 0,
                        i = void 0,
                        n = "",
                        r = void 0,
                        a = void 0,
                        o = "",
                        l = 0,
                        s = [];
                    for (/[^A-Za-z0-9\+\/\=]/g.exec(e) && console.warn("There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\nExpect errors in decoding."), e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); t = this.KEY_STR.indexOf(e.charAt(l++)) << 2 | (r = this.KEY_STR.indexOf(e.charAt(l++))) >> 4, i = (15 & r) << 4 | (a = this.KEY_STR.indexOf(e.charAt(l++))) >> 2, n = (3 & a) << 6 | (o = this.KEY_STR.indexOf(e.charAt(l++))), s.push(t), 64 !== a && s.push(i), 64 !== o && s.push(n), t = i = n = "", r = a = o = "", l < e.length;);
                    return s
                }
            }]), e
        }();
    g.initClass();
    window.Dropzone = f
}();

$(function() {

    // *** Add smooth scrolling to all .smooth-scroll links
    $("a.smooth-scroll").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var offset = 0;
            var hash = this.hash;
//TODO fix these
//BAD       var newUrl = window.location.protocol + "//" + window.location.host +
//                            window.location.pathname + hash;
//BAD      var headerHeight = $('header.sticky-top').height();
            var headerHeight = 100; //placeholder pending fix
            $('html, body').animate({scrollTop: $(hash).offset().top - headerHeight - offset}, 800);
//          history.pushState({}, '', newUrl);
        }
    });


    // ecb_file_selector
    $(document).on('change', '.ecb_file_selector_select select', function (e) {
        var file_name = $(this).val(),
            file_extension = file_name.substr((file_name.lastIndexOf('.') + 1)),
            $file_selector_thumb = $(this).parent().next('.ecb_file_selector_preview'),
            // file_dir = $file_selector_thumb.data('uploadsurl'),
            supported_extensions = $file_selector_thumb.data('supported-extensions').split(',');
        if ($(this).val()=='' ||  jQuery.inArray( file_extension, supported_extensions )===-1 ) {
            $file_selector_thumb.attr('src', '').removeClass('show');
        } else {
            $file_selector_thumb.attr('src', $file_selector_thumb.data('uploadsurl')+'/'+$(this).val())
                .addClass('show');
        }
    });
    $(document).on('error', '.ecb_file_selector_preview', function () {
        $(this).removeClass('show');
    });


    // ecb_file_picker & ecb_file_picker_preview
    $(document).on('change', '.ecb_file_picker .cmsfp_elem', function (e) {
        e.preventDefault();
        var file_name = $(this).val(),
            $file_thumb = $(this).closest('.ecb_file_picker').find('.ecb_file_picker_preview');
        if (file_name=='') {
            $file_thumb.attr('src', '').removeClass('show');
        } else {
            // retrieve thumbnail (create if necessary)
            $file_thumb.attr('src', '');
            $.ajax({
                url: $file_thumb.data('ajax-url')+'&showtemplate=false',
                method: 'POST',
                data: {
                    'file_name': file_name,
                    'top_dir': $file_thumb.data('top-dir'),
                    'thumbnail_width': $file_thumb.data('thumbnail-width'),
                    'thumbnail_height': $file_thumb.data('thumbnail-height')
                }
               }).done( function(thumb_url) {
                if (thumb_url) {
                    $file_thumb.attr('src', thumb_url+'?'+Date.now()).addClass('show');
                }
                });
        }
    });



    // ecb_multiple_select
    $(document).on('change', '.ecb_multiple_select select', function (e) {
        var selectedValues = $(this).val() ? $(this).val().join(',') : '';
        $(this).siblings('.ecb_select_input').val( selectedValues );
        // then update summary text - if it exists
        var $selectSummary = $(this).siblings('.ecb_select_summary');
        if ( $selectSummary.length>0 ) {
            var selectedText = $(this).children('option:selected').map(function() {
                return $(this).text();
                }).get().join(', ');
            $(this).siblings('.ecb_select_summary').val( selectedText );
            var $summaryText = $(this).siblings('.ecb_select_summary').children('.ecb_select_text');
            if ( selectedText=='' ) {
                $selectSummary.children('.ecb_select_text').html( $summaryText.data('empty') );
            } else {
                $selectSummary.children('.ecb_select_text').html( selectedText );
            }
        }
    });

    // ecb_compact - show & hide the full select & update summary text
    $('.ecb_compact .ecb_select_edit').click( function(e) {
        e.preventDefault();
        $(this).closest('.ecb_compact').toggleClass('show');
    });



    // ecb2-hide-label functionality
    $('.ecb2-hide-label').parent().siblings('.pagetext').hide();


    //  ██████╗ ███████╗██████╗ ███████╗ █████╗ ████████╗███████╗██████╗
    //  ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝██╔══██╗
    //  ██████╔╝█████╗  ██████╔╝█████╗  ███████║   ██║   █████╗  ██████╔╝
    //  ██╔══██╗██╔══╝  ██╔═══╝ ██╔══╝  ██╔══██║   ██║   ██╔══╝  ██╔══██╗
    //  ██║  ██║███████╗██║     ███████╗██║  ██║   ██║   ███████╗██║  ██║
    //  ╚═╝  ╚═╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
    //
    //  ecb_repeater functions
    $('.ecb_repeater.sortable').sortable({
        items: '> *:not(.unsortable)',
        placeholder: 'repeater-placeholder',
        handle: '.handle',
        forcePlaceholderSize: true,
        opacity: 0.8,
        start: function(e, ui) {
            if (typeof tinyMCE!=='undefined') {
                tinyMCE.triggerSave();
            }
        },
        stop: function(e,ui) {
            $(this).find('textarea.wysiwyg').each(function() {
                if (typeof tinyMCE!=='undefined') {
                    tinyMCE.execCommand( 'mceRemoveEditor', false, $(this).attr('id') );
                    tinyMCE.execCommand( 'mceAddEditor', false, $(this).attr('id') );
                    tinymce.activeEditor.show();
                }
            });
        },
        create: function(e,ui) {    // set width of heading columns
            if ( $(this).hasClass('table-layout') ) ECB2UpdateHeaderColumns( $(this) );
            var timerId = setInterval( function() {    // set heading column width after wysiwyg created
                $('.ecb_repeater.table-layout').each(function() {
                    ECB2UpdateHeaderColumns( $(this) );
                });
            }, 1000);   // every 1 second
            setTimeout(function() { clearInterval(timerId); }, 8500);    // after 8 seconds stop
            $(window).on('resize', function() { // and set heading column width after window resize
                $('.ecb_repeater.table-layout').each(function() {
                        ECB2UpdateHeaderColumns( $(this) );
                });
            });
        }
    });
    // repeater add
    $(document).on('click', '.ecb2-repeater-add', function(e) {
        e.preventDefault();
        var $repeater = $(this).closest('.ecb_repeater'),
            $newRepeaterWrapper = $repeater.find('.repeater-wrapper-template').clone(),
            highestRow = $repeater.data('highest-row')+1,
            blockName = $repeater.data('block-name'),
            fieldName = '';     // required for sub_fields
        $newRepeaterWrapper.removeClass('repeater-wrapper-template')
            .addClass('repeater-wrapper')
            .css('display', '');
        ECB2InitialiseSubFields( $newRepeaterWrapper, blockName, highestRow );

        $repeater.data('highest-row', highestRow); // adds 1
        if ( $newRepeaterWrapper.find('textarea.wysiwyg').length ) {
            ECB2RepeaterEditorAdd ($repeater, $newRepeaterWrapper);
        } else { // everything other than a WYSIWYG
            $repeater.append($newRepeaterWrapper);
        }
        updateECB2RepeaterMaxBlocks($repeater);
    });
    // repeater remove
    $(document).on('click', '.ecb2-repeater-remove', function(e) {
        e.preventDefault();
        var $repeater = $(this).closest('.ecb_repeater'),
            $repeaterWrapper = $(this).closest('.repeater-wrapper'),
            repeaterWrapperCount = $repeater.find('.repeater-wrapper').length;
        if ( $repeaterWrapper.find('textarea.wysiwyg').length ) {   // has Editor
            ECB2RepeaterEditorRemove ($repeater, $repeaterWrapper, repeaterWrapperCount);
        } else if (repeaterWrapperCount > 1) {
            $repeaterWrapper.remove();
        } else {
            $repeaterWrapper.find('.repeater-field').val('');   // just clear contents if last field
            // handle page_picker sub_fields no class .repeater-field
            $pagePickerSubFields = $repeaterWrapper.find('.sub-field-page_picker').find('input:hidden');
            $pagePickerSubFields.hierselector({value: -1,allowcurrent: false,allow_all: false,use_perms: false,for_child: false,is_manager: 1});    // & reset hierselector
            $repeaterWrapper.find('.cms_checkbox').prop( 'checked', false );
        }
        updateECB2RepeaterMaxBlocks($repeater);
    });
    // Editor functions support MicroTiny or TinyMCE wysiwyg
    function ECB2RepeaterEditorAdd ($repeater, $newRepeaterWrapper) {
        $repeater.append($newRepeaterWrapper);
        $newRepeaterWrapper.find('textarea.wysiwyg').each(function() {
            tinymce.EditorManager.execCommand('mceAddEditor', true, $(this).attr('id'));
            tinymce.activeEditor.show();
        });
    }
    function ECB2RepeaterEditorRemove ($repeater, $repeaterWrapper, repeaterWrapperCount) {
        $repeaterWrapper.find('textarea.wysiwyg').each(function() {
            if ( repeaterWrapperCount > 1 ) { // delete repeater editor
                tinymce.get( $(this).attr('id') ).remove();
                $repeaterWrapper.remove();
            } else { // only 1 repeater - so just clear editor contents
                editor = tinymce.get( $(this).attr('id') );
                editor.setContent('');
            }
        });
    }
    function updateECB2RepeaterMaxBlocks($repeater) {
        if ( $repeater.data('max-blocks') ) {
            var maxBlocks = $repeater.data('max-blocks'),
                blockCount = $repeater.children('.repeater-wrapper').length;
            if ( blockCount>=maxBlocks ) {
                $repeater.find('.ecb2-repeater-add').prop('disabled', true);
            } else {
                $repeater.find('.ecb2-repeater-add').prop('disabled', false);
            }
        }
    }
    function ECB2UpdateHeaderColumns( $repeater ) {
        $repeater.find('.sub-field-heading').each(function() {
            var $colField = $(this).data('heading-for');
            var colWidth = $repeater.find('.sub-field'+$colField).first().outerWidth(); // row1
            // set width of heading + all rows, except row1
            $repeater.find($colField+':not(.row1)').outerWidth(colWidth);
        });
    }
    // Initialise sub fields - when first added to page
    function ECB2InitialiseSubFields( $wrapper, blockName, row ) {
        $wrapper.find('.repeater-field').each( function() {
            var fieldName = $(this).data('field-name');
            // set id and name attributes for new input/s
            if (fieldName) {    // sub_fields
                $(this).attr('name', blockName+'[r_'+row+']['+fieldName+']')
                    .attr('id', blockName+'_r_'+row+'_'+fieldName);    // set unique id
            } else {    // repeater field
                $(this).attr('name', blockName+'[r_'+row+']')
                .attr('id', blockName+'_r_'+row);    // set unique id
            }
            if ( $(this).hasClass('cms_checkbox') ) {   // set label 'for'
                $(this).siblings('label').attr('for', $(this).attr('id'));
            }
            if ( $(this).hasClass('colorpicker-template') ) {   // setup
                $(this).removeClass('colorpicker-template').addClass('colorpicker');
                initailiseColorPicker( $(this) );
            }
            if ( $(this).hasClass('datetimepicker-template') ) {   // setup
                $(this).removeClass('datetimepicker-template').addClass('datetimepicker');
                initailiseDateTimePicker( $(this) );
            }
            if ( $(this).hasClass('datepicker-template') ) {   // setup
                $(this).removeClass('datepicker-template').addClass('datepicker');
                initailiseDatePicker( $(this) );
            }
            if ( $(this).hasClass('timepicker-template') ) {   // setup
                $(this).removeClass('timepicker-template').addClass('timepicker');
                initailiseTimePicker( $(this) );
            }
            if ( $(this).hasClass('timepicker-template') ) {   // setup
                $(this).removeClass('timepicker-template').addClass('timepicker');
                initailiseTimePicker( $(this) );
            }
            if ( $(this).parent('.sub-field-page_picker').length ) {   // setup
                $(this).hierselector({value: -1,allowcurrent: false,allow_all: false,use_perms: false,for_child: false,is_manager: 1});
            }
        });
    }
    // active sub fields - when first visible on page
    function ECB2ActivateSubFields( $wrapper ) {
        // ...
        $wrapper.find('.repeater-field').each( function() {
            if ( $(this).hasClass('wysiwyg') ) {
                tinymce.EditorManager.execCommand('mceAddEditor', true, $(this).attr('id'));
                tinymce.activeEditor.show();
            }
        });

    }
    // deactive sub fields - when hidden on page
    function ECB2DeactivateSubFields( $wrapper ) {
        $wrapper.find('.repeater-field').each( function() {
            if ( $(this).hasClass('wysiwyg') ) {
                editor = tinymce.get( $(this).attr('id') );
                if (editor!=null) {
                    editor.save();
                    editor.remove();
                }
            }
        });
    }



   // ███████╗ ██████╗ ██████╗ ████████╗ █████╗ ██████╗ ██╗     ███████╗    ██╗     ██╗███████╗████████╗███████╗
   // ██╔════╝██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔════╝    ██║     ██║██╔════╝╚══██╔══╝██╔════╝
   // ███████╗██║   ██║██████╔╝   ██║   ███████║██████╔╝██║     █████╗      ██║     ██║███████╗   ██║   ███████╗
   // ╚════██║██║   ██║██╔══██╗   ██║   ██╔══██║██╔══██╗██║     ██╔══╝      ██║     ██║╚════██║   ██║   ╚════██║
   // ███████║╚██████╔╝██║  ██║   ██║   ██║  ██║██████╔╝███████╗███████╗    ███████╗██║███████║   ██║   ███████║
   // ╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝    ╚══════╝╚═╝╚══════╝   ╚═╝   ╚══════╝
   //
   //
   $('ul.sortable-ecb2-list').each(function() {
        var $parent = $(this).closest('.ecb2-cb');
        var $selected = $parent.find('ul.selected-items');
        $(this).sortable({
            connectWith: $selected,
            delay: 150,
            revert: 300,
            placeholder: 'ui-state-highlight',
            items: 'li:not(.no-sort)',
            helper: function(event, ui) {
                if (!ui.hasClass('selected')) {
                    ui.addClass('selected')
                        .siblings()
                        .removeClass('selected');
                }
                var elements = ui.parent()
                    .children('.selected')
                    .clone(),
                    helper = $('<li/>');
                ui.data('multidrag', elements).siblings('.selected').remove();
                return helper.append(elements);
            },
            stop: function(event, ui) {
                var elements = ui.item.data('multidrag');
                var $ulSelected = $(ui.item).parent();
                ui.item.after(elements).remove();
                updateECB2CBInput($ulSelected);
            },
            receive: function(event, ui) {
                var elements = ui.item.data('multidrag');
                if ($(this).data('max-number') && $(this).children().length - 1 > $(this).data('max-number')) {
                    $(ui.sender).sortable('cancel');
                } else {
                    updateECB2Placeholder($(this));
                    $(elements).removeClass('selected ui-state-hover')
                        .find('.sortable-remove').removeClass('hidden');
                }
            }
        });
    });

    // remove from selected list - by dragging back to available
    $('ul.selected-items').each(function() {
        var $parent = $(this).closest('.ecb2-cb');
        var $available = $parent.find('ul.available-items');
        $(this).sortable({
            connectWith: $available,
            delay: 150,
            revert: 300,
            placeholder: 'ui-state-highlight',
            stop: function(event, ui) {
                var $ulSelected = $(ui.item).closest('.ecb2-cb').find('.selected-items');
                $(ui.item).removeClass('selected');
                $(ui.item).children('.sortable-remove').addClass('hidden');
                updateECB2CBInput($ulSelected);
                updateECB2Placeholder($ulSelected);
            }
        });
    });

    // remove from selected list - by clicking remove icon
    $(document).on('click', '#selected-items .sortable-remove', function(e) {
        e.preventDefault();
        var $ulSelected = $(this).closest('ul.selected-items');
        var $ulAvailable = $(this).closest('.ecb2-cb').find('.available-items');
        $(this).addClass('hidden')
            .parent('li').removeClass('no-sort')
            .appendTo($ulAvailable);
        updateECB2CBInput($ulSelected);
        updateECB2Placeholder($ulSelected);
    });

    function updateECB2CBInput($ulSelected) {
        var $allSelected = $ulSelected.children('li:not(.placeholder)');
        var $targetInput = $('#' + $ulSelected.data('cmsms-cb-input'));
        var selectedStr = '';
        var requiredNumber = $ulSelected.data('required-number');
        if (requiredNumber && $allSelected.length != requiredNumber) {
            $targetInput.val(''); // set to empty

        } else {
            $allSelected.each(function() {
                if (selectedStr == '') {
                    selectedStr = $(this).data('cmsms-item-id');
                } else {
                    selectedStr = selectedStr + ',' + $(this).data('cmsms-item-id');
                }
            });
            $targetInput.val(selectedStr);
        }
    }

    function updateECB2Placeholder($ulSelected) {
        var requiredNumber = $ulSelected.data('required-number');
        var numberSelected = $ulSelected.children().length - 1; // exclude placeholder
        if ((!requiredNumber && numberSelected > 0) || (requiredNumber > 0 && numberSelected == requiredNumber)) {
            $ulSelected.children('.placeholder').addClass('hidden');
        } else {
            $ulSelected.children('.placeholder').removeClass('hidden');
        }


    }



    //  ██████╗ ██╗ ██████╗██╗  ██╗███████╗██████╗ ███████╗
    //  ██╔══██╗██║██╔════╝██║ ██╔╝██╔════╝██╔══██╗██╔════╝
    //  ██████╔╝██║██║     █████╔╝ █████╗  ██████╔╝███████╗
    //  ██╔═══╝ ██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗╚════██║
    //  ██║     ██║╚██████╗██║  ██╗███████╗██║  ██║███████║
    //  ╚═╝     ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
    //
    // datepicker & timepicker functions
    initailiseTimePicker( $('.timepicker') );
    function initailiseTimePicker ($timepicker) {
        $timepicker.timepicker( {
            timeFormat: $(this).data('time-format')
        });
    }
    initailiseDatePicker( $('.datepicker') );
    function initailiseDatePicker ($datepicker) {
        $datepicker.datepicker( {
            showOtherMonths: true,
            selectOtherMonths: true,
            dateFormat: $(this).data('date-format'),
            changeMonth: $(this).data('change-month'),
            changeYear: $(this).data('change-year'),
            yearRange: $(this).data('year-range')
        });
    }
    initailiseDateTimePicker( $('.datetimepicker') );
    function initailiseDateTimePicker ($datetimepicker) {
        $datetimepicker.datetimepicker( {
            showOtherMonths: true,
            selectOtherMonths: true,
            dateFormat: $(this).data('date-format'),
            timeFormat: $(this).data('time-format'),
            changeMonth: $(this).data('change-month'),
            changeYear: $(this).data('change-year'),
            yearRange: $(this).data('year-range')
        });
    }

    /* color picker - colpick */
    initailiseColorPicker( $('.colorpicker') );
    function initailiseColorPicker ($colorpicker) {
        $colorpicker.colpick({
            colorScheme: 'dark',
            submit : false,
            onChange:function(hsb,hex,rgb,el) {
                var hash = $(el).data('no-hash') ? '' : '#';
                $(el).val(hash+hex).css('border-right', '30px solid #'+hex);
            },
            onBeforeShow: function() {
                if (this.value=='') {
                    $(this).css('border-right', '30px solid transparent');
                } else {
                    $(this).colpickSetColor(this.value);
                }
            }
        })
        .on('keyup', function() {
            if (this.value=='') {
                $(this).css('border-right', '30px solid transparent');
            } else {
                $(this).colpickSetColor(this.value);
            }
        })
        .each(function() {
            if (this.value=='') {
                $(this).css('border-right', '30px solid transparent');
            } else {
                $(this).css('border-right', '30px solid #'+this.value.replaceAll('#', ''));
            }
        });
    }



    //  ██████╗ ██████╗  ██████╗ ██████╗ ███████╗ ██████╗ ███╗   ██╗███████╗
    //  ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗╚══███╔╝██╔═══██╗████╗  ██║██╔════╝
    //  ██║  ██║██████╔╝██║   ██║██████╔╝  ███╔╝ ██║   ██║██╔██╗ ██║█████╗
    //  ██║  ██║██╔══██╗██║   ██║██╔═══╝  ███╔╝  ██║   ██║██║╚██╗██║██╔══╝
    //  ██████╔╝██║  ██║╚██████╔╝██║     ███████╗╚██████╔╝██║ ╚████║███████╗
    //  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
    //
    $('.ecb2-dropzone.sortable').sortable({
        items: '> *:not(.unsortable)',
        placeholder: 'dz-sortable-placeholder',
        handle: '.dz-handle',
        forcePlaceholderSize: true,
        opacity: 0.8,
        start: function(e, ui) {
            ui.item.siblings('.dz-upload-prompt').hide();
        },
        stop: function(e,ui) {
            ui.item.siblings('.dz-upload-prompt').show();
        }
    });

    // Dropzone functionality
    $(".ecb2-dropzone").each( function(i) {
        var action_url = $(this).data('dropzone-url'),
            json_values = $(this).data('dropzone-values'),
            resize_width = $(this).data('dropzone-resize-width'),
            resize_height = $(this).data('dropzone-resize-height'),
            resize_method = $(this).data('dropzone-resize-method'),
            thumbnail_width = $(this).data('dropzone-thumbnail-width'),
            thumbnail_height = $(this).data('dropzone-thumbnail-height'),
            thumbnail_prefix = $(this).data('dropzone-thumbnail-prefix'),
            max_files = $(this).data('dropzone-max-files'),
            max_files_text = $(this).data('dropzone-max-files-text'),
            dzTemplate = $(this).find('.dropzone-preview-template').clone(),
            location = $(this).data('location');
        dzTemplate.find('.dz-preview').css('display', '');
        resize_width = (resize_width===undefined || resize_width==0 ) ? null : resize_width;
        resize_height = (resize_height===undefined || resize_height==0 ) ? null : resize_height;
        resize_method = (resize_method===undefined) ? 'contain' : resize_method;
        thumbnail_width = (thumbnail_width===undefined || thumbnail_width==0 ) ? null : thumbnail_width;
        thumbnail_height = (thumbnail_height===undefined || thumbnail_height==0 ) ? null : thumbnail_height;
        max_new_files = (max_files===undefined || max_files==0 ) ? null : max_files - json_values.length;
        $(this).dropzone({
            url: action_url,
            uploadMultiple: true,
            parallelUploads: 5,
            previewTemplate: dzTemplate.html(),
            clickable: '#'+$(this).data('block-name')+'-upload-prompt',
            resizeWidth: resize_width,
            resizeHeight: resize_height,
            resizeMethod: resize_method,
            thumbnailWidth: thumbnail_width,
            thumbnailHeight: thumbnail_height,
            maxFiles: max_new_files,
            dictMaxFilesExceeded: max_files_text,
            init: function() {
                var this_dz = this;
                $dz = $(this.element);
                this.on("addedfiles", function(files) {
                    $(this.element).children('.dz-upload-prompt').hide();
                });
                this.on('successmultiple', function(file, responseText) {
                    var $dz = $(this.element);
                    file.forEach(function(file, i) {
                        var blockName = $dz.data('block-name'),
                            row = $dz.data('highest-row')+1,
                            $dzSubFields = $('#'+blockName+'-sub-fields');
                        if (responseText[i].success) {
                            $(file.previewElement).find('.dz-input-filename').val(file.name)
                                .attr('name', blockName+'[r_'+row+'][filename]');
                            $(file.previewElement).data('row', row);
                            setTimeout(function() {
                                $(file.previewElement).removeClass('dz-success');
                                }, '3000'
                            );
                            // add sub_fields
                            $newSubFields = $dzSubFields.find('.dz-sub-fields-template').clone();
                            $newSubFields.attr('id', blockName+'_r_'+row+'_sub_fields');
                            $newSubFields.removeClass('dz-sub-fields-template').addClass('dz-sub-field');
                            // set name & id for each input

                            ECB2InitialiseSubFields( $newSubFields, blockName, row );


                            $dzSubFields.append($newSubFields);
                            $dz.data('highest-row', row);   // adds 1

                        } else {
                            $(file.previewElement).addClass('dz-error').removeClass('dz-success');
                        }
                    });
                    if ( $dz.hasClass('sortable') ) $dz.sortable('enable');

                    refreshECB2DropzonePrompts(this);
                });
                this.on('maxfilesexceeded', function() {
                    refreshECB2DropzonePrompts(this);
                });
                this.on("removedfile", function(file) {
                    var removed_row = $(file.previewElement).data('row');
                    if ( removed_row ) {    // remove sub_fields
                        $( '#'+$dz.data('block-name')+'_r_'+removed_row+'_sub_fields' ).remove();
                    }
                    refreshECB2DropzonePrompts(this);
                });
                // create dropzone previews for each saved gallery item, on page load/refresh
                json_values.forEach(function(saved_filename, i) {
                    if (saved_filename!='') {
                        this.displayExistingFile(
                            { name:saved_filename, size:12345 },
                            location+thumbnail_prefix+saved_filename,   // thumb/file url
                            null,     // callback - optional callback when it's done
                            null,     // crossOrigin - Added to the `img` tag for crossOrigin handling
                            false     // should Dropzone resize the image first
                        );
                    }
                });
                // fill any empty dz-input-filename with filename
                $dz.children('.dz-preview').each( function(i) {
                    var $input_filename = $(this).find('.dz-input-filename'),
                        row = i+1,
                        blockName = $dz.data('block-name');
                    if ( $input_filename.val()=='' ) {
                        $input_filename.val( $(this).find('.dz-filename span').html() );
                    }
                    if ( $input_filename.attr('name')=='' ) {
                        $input_filename.attr('name', blockName+'[r_'+row+'][filename]');
                        $input_filename.attr('id', blockName+'_r_'+row+'_filename');
                    }
                    if ( $(this).data('row')=='' ) $(this).data('row', row);
                });
                refreshECB2DropzonePrompts(this);
            }
        });
    });
    function refreshECB2DropzonePrompts(this_dz) {
        var $dz = $(this_dz.element),
            max_files = $dz.data('dropzone-max-files'),
            uploaded_files = $dz.children('.dz-preview').length,    // .dz-complete
            $dz_upload_prompt = $dz.children('.dz-upload-prompt'),
            max_new_files = Math.max(0, max_files - uploaded_files);
        if (max_files>0) this_dz.options.maxFiles = max_new_files; // max new files
        if (uploaded_files==0) {
            $dz_upload_prompt.show();
        } else if (uploaded_files>0) { // move prompt to last position
            $dz_upload_prompt.remove().insertAfter( $dz.children('.dz-preview:last') ).show();
        }
        if (max_files > 0 && uploaded_files >= max_files) { // hide prompt
            $dz_upload_prompt.hide();
        }
    }
    // edit Dropzone sub-fields
    $(document).on('click', '.dz-edit', function(e) {
        e.preventDefault();
        var blockName = $(this).closest('.ecb2-dropzone').data('blockName'),
            row = $(this).closest('.dz-preview').data('row'),
            $subFields = $('#'+blockName+'_r_'+row+'_sub_fields');
        $subFields.dialog({
            modal: true,
            width: 600,
            title: 'Edit details',
            buttons: {
                Ok: function() {
                    $( this ).dialog( "close" );
                }
            },
            create: function( event, ui ) {
                ECB2DeactivateSubFields( $(event.target) ); // kill any active editors
            },
            open: function( event, ui ) {
                ECB2ActivateSubFields( $(event.target) );
            },
            close: function( event, ui ) {
                $(event.target).dialog('destroy');
                ECB2DeactivateSubFields( $(event.target) );
                $(event.target).appendTo('#'+$(this).data('sub-field-parent'));
            }
        });
    });


});
