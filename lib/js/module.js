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
(function ($) {
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
})(jQuery);

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
 *  Dropzone Version 5.9.3
 *  Copyright (c) 2021 Matias Meno <m@tias.me>
 *  Licensed under the MIT license.
 *  www.dropzone.dev/js
 */
!function(e, t) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = t();
    else if ("function" == typeof define && define.amd) define([], t);
    else {
        var n = t();
        for (var r in n)("object" == typeof exports ? exports : e)[r] = n[r]
    }
}(self, (function() {
    return function() {
        var e = {
                3099: function(e) {
                    e.exports = function(e) {
                        if ("function" != typeof e) throw TypeError(String(e) + " is not a function");
                        return e
                    }
                },
                6077: function(e, t, n) {
                    var r = n(111);
                    e.exports = function(e) {
                        if (!r(e) && null !== e) throw TypeError("Can't set " + String(e) + " as a prototype");
                        return e
                    }
                },
                1223: function(e, t, n) {
                    var r = n(5112),
                        i = n(30),
                        o = n(3070),
                        a = r("unscopables"),
                        u = Array.prototype;
                    null == u[a] && o.f(u, a, {
                        configurable: !0,
                        value: i(null)
                    }), e.exports = function(e) {
                        u[a][e] = !0
                    }
                },
                1530: function(e, t, n) {
                    "use strict";
                    var r = n(8710).charAt;
                    e.exports = function(e, t, n) {
                        return t + (n ? r(e, t).length : 1)
                    }
                },
                5787: function(e) {
                    e.exports = function(e, t, n) {
                        if (!(e instanceof t)) throw TypeError("Incorrect " + (n ? n + " " : "") + "invocation");
                        return e
                    }
                },
                9670: function(e, t, n) {
                    var r = n(111);
                    e.exports = function(e) {
                        if (!r(e)) throw TypeError(String(e) + " is not an object");
                        return e
                    }
                },
                4019: function(e) {
                    e.exports = "undefined" != typeof ArrayBuffer && "undefined" != typeof DataView
                },
                260: function(e, t, n) {
                    "use strict";
                    var r, i = n(4019),
                        o = n(9781),
                        a = n(7854),
                        u = n(111),
                        s = n(6656),
                        l = n(648),
                        c = n(8880),
                        f = n(1320),
                        p = n(3070).f,
                        h = n(9518),
                        d = n(7674),
                        v = n(5112),
                        y = n(9711),
                        g = a.Int8Array,
                        m = g && g.prototype,
                        b = a.Uint8ClampedArray,
                        x = b && b.prototype,
                        w = g && h(g),
                        E = m && h(m),
                        k = Object.prototype,
                        A = k.isPrototypeOf,
                        S = v("toStringTag"),
                        F = y("TYPED_ARRAY_TAG"),
                        T = i && !!d && "Opera" !== l(a.opera),
                        C = !1,
                        L = {
                            Int8Array: 1,
                            Uint8Array: 1,
                            Uint8ClampedArray: 1,
                            Int16Array: 2,
                            Uint16Array: 2,
                            Int32Array: 4,
                            Uint32Array: 4,
                            Float32Array: 4,
                            Float64Array: 8
                        },
                        R = {
                            BigInt64Array: 8,
                            BigUint64Array: 8
                        },
                        I = function(e) {
                            if (!u(e)) return !1;
                            var t = l(e);
                            return s(L, t) || s(R, t)
                        };
                    for (r in L) a[r] || (T = !1);
                    if ((!T || "function" != typeof w || w === Function.prototype) && (w = function() {
                            throw TypeError("Incorrect invocation")
                        }, T))
                        for (r in L) a[r] && d(a[r], w);
                    if ((!T || !E || E === k) && (E = w.prototype, T))
                        for (r in L) a[r] && d(a[r].prototype, E);
                    if (T && h(x) !== E && d(x, E), o && !s(E, S))
                        for (r in C = !0, p(E, S, {
                                get: function() {
                                    return u(this) ? this[F] : void 0
                                }
                            }), L) a[r] && c(a[r], F, r);
                    e.exports = {
                        NATIVE_ARRAY_BUFFER_VIEWS: T,
                        TYPED_ARRAY_TAG: C && F,
                        aTypedArray: function(e) {
                            if (I(e)) return e;
                            throw TypeError("Target is not a typed array")
                        },
                        aTypedArrayConstructor: function(e) {
                            if (d) {
                                if (A.call(w, e)) return e
                            } else
                                for (var t in L)
                                    if (s(L, r)) {
                                        var n = a[t];
                                        if (n && (e === n || A.call(n, e))) return e
                                    } throw TypeError("Target is not a typed array constructor")
                        },
                        exportTypedArrayMethod: function(e, t, n) {
                            if (o) {
                                if (n)
                                    for (var r in L) {
                                        var i = a[r];
                                        i && s(i.prototype, e) && delete i.prototype[e]
                                    }
                                E[e] && !n || f(E, e, n ? t : T && m[e] || t)
                            }
                        },
                        exportTypedArrayStaticMethod: function(e, t, n) {
                            var r, i;
                            if (o) {
                                if (d) {
                                    if (n)
                                        for (r in L)(i = a[r]) && s(i, e) && delete i[e];
                                    if (w[e] && !n) return;
                                    try {
                                        return f(w, e, n ? t : T && g[e] || t)
                                    } catch (e) {}
                                }
                                for (r in L) !(i = a[r]) || i[e] && !n || f(i, e, t)
                            }
                        },
                        isView: function(e) {
                            if (!u(e)) return !1;
                            var t = l(e);
                            return "DataView" === t || s(L, t) || s(R, t)
                        },
                        isTypedArray: I,
                        TypedArray: w,
                        TypedArrayPrototype: E
                    }
                },
                3331: function(e, t, n) {
                    "use strict";
                    var r = n(7854),
                        i = n(9781),
                        o = n(4019),
                        a = n(8880),
                        u = n(2248),
                        s = n(7293),
                        l = n(5787),
                        c = n(9958),
                        f = n(7466),
                        p = n(7067),
                        h = n(1179),
                        d = n(9518),
                        v = n(7674),
                        y = n(8006).f,
                        g = n(3070).f,
                        m = n(1285),
                        b = n(8003),
                        x = n(9909),
                        w = x.get,
                        E = x.set,
                        k = "ArrayBuffer",
                        A = "DataView",
                        S = "Wrong index",
                        F = r.ArrayBuffer,
                        T = F,
                        C = r.DataView,
                        L = C && C.prototype,
                        R = Object.prototype,
                        I = r.RangeError,
                        U = h.pack,
                        O = h.unpack,
                        _ = function(e) {
                            return [255 & e]
                        },
                        M = function(e) {
                            return [255 & e, e >> 8 & 255]
                        },
                        z = function(e) {
                            return [255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255]
                        },
                        P = function(e) {
                            return e[3] << 24 | e[2] << 16 | e[1] << 8 | e[0]
                        },
                        j = function(e) {
                            return U(e, 23, 4)
                        },
                        D = function(e) {
                            return U(e, 52, 8)
                        },
                        N = function(e, t) {
                            g(e.prototype, t, {
                                get: function() {
                                    return w(this)[t]
                                }
                            })
                        },
                        B = function(e, t, n, r) {
                            var i = p(n),
                                o = w(e);
                            if (i + t > o.byteLength) throw I(S);
                            var a = w(o.buffer).bytes,
                                u = i + o.byteOffset,
                                s = a.slice(u, u + t);
                            return r ? s : s.reverse()
                        },
                        q = function(e, t, n, r, i, o) {
                            var a = p(n),
                                u = w(e);
                            if (a + t > u.byteLength) throw I(S);
                            for (var s = w(u.buffer).bytes, l = a + u.byteOffset, c = r(+i), f = 0; f < t; f++) s[l + f] = c[o ? f : t - f - 1]
                        };
                    if (o) {
                        if (!s((function() {
                                F(1)
                            })) || !s((function() {
                                new F(-1)
                            })) || s((function() {
                                return new F, new F(1.5), new F(NaN), F.name != k
                            }))) {
                            for (var W, H = (T = function(e) {
                                    return l(this, T), new F(p(e))
                                }).prototype = F.prototype, Y = y(F), G = 0; Y.length > G;)(W = Y[G++]) in T || a(T, W, F[W]);
                            H.constructor = T
                        }
                        v && d(L) !== R && v(L, R);
                        var Q = new C(new T(2)),
                            $ = L.setInt8;
                        Q.setInt8(0, 2147483648), Q.setInt8(1, 2147483649), !Q.getInt8(0) && Q.getInt8(1) || u(L, {
                            setInt8: function(e, t) {
                                $.call(this, e, t << 24 >> 24)
                            },
                            setUint8: function(e, t) {
                                $.call(this, e, t << 24 >> 24)
                            }
                        }, {
                            unsafe: !0
                        })
                    } else T = function(e) {
                        l(this, T, k);
                        var t = p(e);
                        E(this, {
                            bytes: m.call(new Array(t), 0),
                            byteLength: t
                        }), i || (this.byteLength = t)
                    }, C = function(e, t, n) {
                        l(this, C, A), l(e, T, A);
                        var r = w(e).byteLength,
                            o = c(t);
                        if (o < 0 || o > r) throw I("Wrong offset");
                        if (o + (n = void 0 === n ? r - o : f(n)) > r) throw I("Wrong length");
                        E(this, {
                            buffer: e,
                            byteLength: n,
                            byteOffset: o
                        }), i || (this.buffer = e, this.byteLength = n, this.byteOffset = o)
                    }, i && (N(T, "byteLength"), N(C, "buffer"), N(C, "byteLength"), N(C, "byteOffset")), u(C.prototype, {
                        getInt8: function(e) {
                            return B(this, 1, e)[0] << 24 >> 24
                        },
                        getUint8: function(e) {
                            return B(this, 1, e)[0]
                        },
                        getInt16: function(e) {
                            var t = B(this, 2, e, arguments.length > 1 ? arguments[1] : void 0);
                            return (t[1] << 8 | t[0]) << 16 >> 16
                        },
                        getUint16: function(e) {
                            var t = B(this, 2, e, arguments.length > 1 ? arguments[1] : void 0);
                            return t[1] << 8 | t[0]
                        },
                        getInt32: function(e) {
                            return P(B(this, 4, e, arguments.length > 1 ? arguments[1] : void 0))
                        },
                        getUint32: function(e) {
                            return P(B(this, 4, e, arguments.length > 1 ? arguments[1] : void 0)) >>> 0
                        },
                        getFloat32: function(e) {
                            return O(B(this, 4, e, arguments.length > 1 ? arguments[1] : void 0), 23)
                        },
                        getFloat64: function(e) {
                            return O(B(this, 8, e, arguments.length > 1 ? arguments[1] : void 0), 52)
                        },
                        setInt8: function(e, t) {
                            q(this, 1, e, _, t)
                        },
                        setUint8: function(e, t) {
                            q(this, 1, e, _, t)
                        },
                        setInt16: function(e, t) {
                            q(this, 2, e, M, t, arguments.length > 2 ? arguments[2] : void 0)
                        },
                        setUint16: function(e, t) {
                            q(this, 2, e, M, t, arguments.length > 2 ? arguments[2] : void 0)
                        },
                        setInt32: function(e, t) {
                            q(this, 4, e, z, t, arguments.length > 2 ? arguments[2] : void 0)
                        },
                        setUint32: function(e, t) {
                            q(this, 4, e, z, t, arguments.length > 2 ? arguments[2] : void 0)
                        },
                        setFloat32: function(e, t) {
                            q(this, 4, e, j, t, arguments.length > 2 ? arguments[2] : void 0)
                        },
                        setFloat64: function(e, t) {
                            q(this, 8, e, D, t, arguments.length > 2 ? arguments[2] : void 0)
                        }
                    });
                    b(T, k), b(C, A), e.exports = {
                        ArrayBuffer: T,
                        DataView: C
                    }
                },
                1048: function(e, t, n) {
                    "use strict";
                    var r = n(7908),
                        i = n(1400),
                        o = n(7466),
                        a = Math.min;
                    e.exports = [].copyWithin || function(e, t) {
                        var n = r(this),
                            u = o(n.length),
                            s = i(e, u),
                            l = i(t, u),
                            c = arguments.length > 2 ? arguments[2] : void 0,
                            f = a((void 0 === c ? u : i(c, u)) - l, u - s),
                            p = 1;
                        for (l < s && s < l + f && (p = -1, l += f - 1, s += f - 1); f-- > 0;) l in n ? n[s] = n[l] : delete n[s], s += p, l += p;
                        return n
                    }
                },
                1285: function(e, t, n) {
                    "use strict";
                    var r = n(7908),
                        i = n(1400),
                        o = n(7466);
                    e.exports = function(e) {
                        for (var t = r(this), n = o(t.length), a = arguments.length, u = i(a > 1 ? arguments[1] : void 0, n), s = a > 2 ? arguments[2] : void 0, l = void 0 === s ? n : i(s, n); l > u;) t[u++] = e;
                        return t
                    }
                },
                8533: function(e, t, n) {
                    "use strict";
                    var r = n(2092).forEach,
                        i = n(9341)("forEach");
                    e.exports = i ? [].forEach : function(e) {
                        return r(this, e, arguments.length > 1 ? arguments[1] : void 0)
                    }
                },
                8457: function(e, t, n) {
                    "use strict";
                    var r = n(9974),
                        i = n(7908),
                        o = n(3411),
                        a = n(7659),
                        u = n(7466),
                        s = n(6135),
                        l = n(1246);
                    e.exports = function(e) {
                        var t, n, c, f, p, h, d = i(e),
                            v = "function" == typeof this ? this : Array,
                            y = arguments.length,
                            g = y > 1 ? arguments[1] : void 0,
                            m = void 0 !== g,
                            b = l(d),
                            x = 0;
                        if (m && (g = r(g, y > 2 ? arguments[2] : void 0, 2)), null == b || v == Array && a(b))
                            for (n = new v(t = u(d.length)); t > x; x++) h = m ? g(d[x], x) : d[x], s(n, x, h);
                        else
                            for (p = (f = b.call(d)).next, n = new v; !(c = p.call(f)).done; x++) h = m ? o(f, g, [c.value, x], !0) : c.value, s(n, x, h);
                        return n.length = x, n
                    }
                },
                1318: function(e, t, n) {
                    var r = n(5656),
                        i = n(7466),
                        o = n(1400),
                        a = function(e) {
                            return function(t, n, a) {
                                var u, s = r(t),
                                    l = i(s.length),
                                    c = o(a, l);
                                if (e && n != n) {
                                    for (; l > c;)
                                        if ((u = s[c++]) != u) return !0
                                } else
                                    for (; l > c; c++)
                                        if ((e || c in s) && s[c] === n) return e || c || 0;
                                return !e && -1
                            }
                        };
                    e.exports = {
                        includes: a(!0),
                        indexOf: a(!1)
                    }
                },
                2092: function(e, t, n) {
                    var r = n(9974),
                        i = n(8361),
                        o = n(7908),
                        a = n(7466),
                        u = n(5417),
                        s = [].push,
                        l = function(e) {
                            var t = 1 == e,
                                n = 2 == e,
                                l = 3 == e,
                                c = 4 == e,
                                f = 6 == e,
                                p = 7 == e,
                                h = 5 == e || f;
                            return function(d, v, y, g) {
                                for (var m, b, x = o(d), w = i(x), E = r(v, y, 3), k = a(w.length), A = 0, S = g || u, F = t ? S(d, k) : n || p ? S(d, 0) : void 0; k > A; A++)
                                    if ((h || A in w) && (b = E(m = w[A], A, x), e))
                                        if (t) F[A] = b;
                                        else if (b) switch (e) {
                                    case 3:
                                        return !0;
                                    case 5:
                                        return m;
                                    case 6:
                                        return A;
                                    case 2:
                                        s.call(F, m)
                                } else switch (e) {
                                    case 4:
                                        return !1;
                                    case 7:
                                        s.call(F, m)
                                }
                                return f ? -1 : l || c ? c : F
                            }
                        };
                    e.exports = {
                        forEach: l(0),
                        map: l(1),
                        filter: l(2),
                        some: l(3),
                        every: l(4),
                        find: l(5),
                        findIndex: l(6),
                        filterOut: l(7)
                    }
                },
                6583: function(e, t, n) {
                    "use strict";
                    var r = n(5656),
                        i = n(9958),
                        o = n(7466),
                        a = n(9341),
                        u = Math.min,
                        s = [].lastIndexOf,
                        l = !!s && 1 / [1].lastIndexOf(1, -0) < 0,
                        c = a("lastIndexOf"),
                        f = l || !c;
                    e.exports = f ? function(e) {
                        if (l) return s.apply(this, arguments) || 0;
                        var t = r(this),
                            n = o(t.length),
                            a = n - 1;
                        for (arguments.length > 1 && (a = u(a, i(arguments[1]))), a < 0 && (a = n + a); a >= 0; a--)
                            if (a in t && t[a] === e) return a || 0;
                        return -1
                    } : s
                },
                1194: function(e, t, n) {
                    var r = n(7293),
                        i = n(5112),
                        o = n(7392),
                        a = i("species");
                    e.exports = function(e) {
                        return o >= 51 || !r((function() {
                            var t = [];
                            return (t.constructor = {})[a] = function() {
                                return {
                                    foo: 1
                                }
                            }, 1 !== t[e](Boolean).foo
                        }))
                    }
                },
                9341: function(e, t, n) {
                    "use strict";
                    var r = n(7293);
                    e.exports = function(e, t) {
                        var n = [][e];
                        return !!n && r((function() {
                            n.call(null, t || function() {
                                throw 1
                            }, 1)
                        }))
                    }
                },
                3671: function(e, t, n) {
                    var r = n(3099),
                        i = n(7908),
                        o = n(8361),
                        a = n(7466),
                        u = function(e) {
                            return function(t, n, u, s) {
                                r(n);
                                var l = i(t),
                                    c = o(l),
                                    f = a(l.length),
                                    p = e ? f - 1 : 0,
                                    h = e ? -1 : 1;
                                if (u < 2)
                                    for (;;) {
                                        if (p in c) {
                                            s = c[p], p += h;
                                            break
                                        }
                                        if (p += h, e ? p < 0 : f <= p) throw TypeError("Reduce of empty array with no initial value")
                                    }
                                for (; e ? p >= 0 : f > p; p += h) p in c && (s = n(s, c[p], p, l));
                                return s
                            }
                        };
                    e.exports = {
                        left: u(!1),
                        right: u(!0)
                    }
                },
                5417: function(e, t, n) {
                    var r = n(111),
                        i = n(3157),
                        o = n(5112)("species");
                    e.exports = function(e, t) {
                        var n;
                        return i(e) && ("function" != typeof(n = e.constructor) || n !== Array && !i(n.prototype) ? r(n) && null === (n = n[o]) && (n = void 0) : n = void 0), new(void 0 === n ? Array : n)(0 === t ? 0 : t)
                    }
                },
                3411: function(e, t, n) {
                    var r = n(9670),
                        i = n(9212);
                    e.exports = function(e, t, n, o) {
                        try {
                            return o ? t(r(n)[0], n[1]) : t(n)
                        } catch (t) {
                            throw i(e), t
                        }
                    }
                },
                7072: function(e, t, n) {
                    var r = n(5112)("iterator"),
                        i = !1;
                    try {
                        var o = 0,
                            a = {
                                next: function() {
                                    return {
                                        done: !!o++
                                    }
                                },
                                return: function() {
                                    i = !0
                                }
                            };
                        a[r] = function() {
                            return this
                        }, Array.from(a, (function() {
                            throw 2
                        }))
                    } catch (e) {}
                    e.exports = function(e, t) {
                        if (!t && !i) return !1;
                        var n = !1;
                        try {
                            var o = {};
                            o[r] = function() {
                                return {
                                    next: function() {
                                        return {
                                            done: n = !0
                                        }
                                    }
                                }
                            }, e(o)
                        } catch (e) {}
                        return n
                    }
                },
                4326: function(e) {
                    var t = {}.toString;
                    e.exports = function(e) {
                        return t.call(e).slice(8, -1)
                    }
                },
                648: function(e, t, n) {
                    var r = n(1694),
                        i = n(4326),
                        o = n(5112)("toStringTag"),
                        a = "Arguments" == i(function() {
                            return arguments
                        }());
                    e.exports = r ? i : function(e) {
                        var t, n, r;
                        return void 0 === e ? "Undefined" : null === e ? "Null" : "string" == typeof(n = function(e, t) {
                            try {
                                return e[t]
                            } catch (e) {}
                        }(t = Object(e), o)) ? n : a ? i(t) : "Object" == (r = i(t)) && "function" == typeof t.callee ? "Arguments" : r
                    }
                },
                9920: function(e, t, n) {
                    var r = n(6656),
                        i = n(3887),
                        o = n(1236),
                        a = n(3070);
                    e.exports = function(e, t) {
                        for (var n = i(t), u = a.f, s = o.f, l = 0; l < n.length; l++) {
                            var c = n[l];
                            r(e, c) || u(e, c, s(t, c))
                        }
                    }
                },
                8544: function(e, t, n) {
                    var r = n(7293);
                    e.exports = !r((function() {
                        function e() {}
                        return e.prototype.constructor = null, Object.getPrototypeOf(new e) !== e.prototype
                    }))
                },
                4994: function(e, t, n) {
                    "use strict";
                    var r = n(3383).IteratorPrototype,
                        i = n(30),
                        o = n(9114),
                        a = n(8003),
                        u = n(7497),
                        s = function() {
                            return this
                        };
                    e.exports = function(e, t, n) {
                        var l = t + " Iterator";
                        return e.prototype = i(r, {
                            next: o(1, n)
                        }), a(e, l, !1, !0), u[l] = s, e
                    }
                },
                8880: function(e, t, n) {
                    var r = n(9781),
                        i = n(3070),
                        o = n(9114);
                    e.exports = r ? function(e, t, n) {
                        return i.f(e, t, o(1, n))
                    } : function(e, t, n) {
                        return e[t] = n, e
                    }
                },
                9114: function(e) {
                    e.exports = function(e, t) {
                        return {
                            enumerable: !(1 & e),
                            configurable: !(2 & e),
                            writable: !(4 & e),
                            value: t
                        }
                    }
                },
                6135: function(e, t, n) {
                    "use strict";
                    var r = n(7593),
                        i = n(3070),
                        o = n(9114);
                    e.exports = function(e, t, n) {
                        var a = r(t);
                        a in e ? i.f(e, a, o(0, n)) : e[a] = n
                    }
                },
                654: function(e, t, n) {
                    "use strict";
                    var r = n(2109),
                        i = n(4994),
                        o = n(9518),
                        a = n(7674),
                        u = n(8003),
                        s = n(8880),
                        l = n(1320),
                        c = n(5112),
                        f = n(1913),
                        p = n(7497),
                        h = n(3383),
                        d = h.IteratorPrototype,
                        v = h.BUGGY_SAFARI_ITERATORS,
                        y = c("iterator"),
                        g = "keys",
                        m = "values",
                        b = "entries",
                        x = function() {
                            return this
                        };
                    e.exports = function(e, t, n, c, h, w, E) {
                        i(n, t, c);
                        var k, A, S, F = function(e) {
                                if (e === h && I) return I;
                                if (!v && e in L) return L[e];
                                switch (e) {
                                    case g:
                                    case m:
                                    case b:
                                        return function() {
                                            return new n(this, e)
                                        }
                                }
                                return function() {
                                    return new n(this)
                                }
                            },
                            T = t + " Iterator",
                            C = !1,
                            L = e.prototype,
                            R = L[y] || L["@@iterator"] || h && L[h],
                            I = !v && R || F(h),
                            U = "Array" == t && L.entries || R;
                        if (U && (k = o(U.call(new e)), d !== Object.prototype && k.next && (f || o(k) === d || (a ? a(k, d) : "function" != typeof k[y] && s(k, y, x)), u(k, T, !0, !0), f && (p[T] = x))), h == m && R && R.name !== m && (C = !0, I = function() {
                                return R.call(this)
                            }), f && !E || L[y] === I || s(L, y, I), p[t] = I, h)
                            if (A = {
                                    values: F(m),
                                    keys: w ? I : F(g),
                                    entries: F(b)
                                }, E)
                                for (S in A)(v || C || !(S in L)) && l(L, S, A[S]);
                            else r({
                                target: t,
                                proto: !0,
                                forced: v || C
                            }, A);
                        return A
                    }
                },
                9781: function(e, t, n) {
                    var r = n(7293);
                    e.exports = !r((function() {
                        return 7 != Object.defineProperty({}, 1, {
                            get: function() {
                                return 7
                            }
                        })[1]
                    }))
                },
                317: function(e, t, n) {
                    var r = n(7854),
                        i = n(111),
                        o = r.document,
                        a = i(o) && i(o.createElement);
                    e.exports = function(e) {
                        return a ? o.createElement(e) : {}
                    }
                },
                8324: function(e) {
                    e.exports = {
                        CSSRuleList: 0,
                        CSSStyleDeclaration: 0,
                        CSSValueList: 0,
                        ClientRectList: 0,
                        DOMRectList: 0,
                        DOMStringList: 0,
                        DOMTokenList: 1,
                        DataTransferItemList: 0,
                        FileList: 0,
                        HTMLAllCollection: 0,
                        HTMLCollection: 0,
                        HTMLFormElement: 0,
                        HTMLSelectElement: 0,
                        MediaList: 0,
                        MimeTypeArray: 0,
                        NamedNodeMap: 0,
                        NodeList: 1,
                        PaintRequestList: 0,
                        Plugin: 0,
                        PluginArray: 0,
                        SVGLengthList: 0,
                        SVGNumberList: 0,
                        SVGPathSegList: 0,
                        SVGPointList: 0,
                        SVGStringList: 0,
                        SVGTransformList: 0,
                        SourceBufferList: 0,
                        StyleSheetList: 0,
                        TextTrackCueList: 0,
                        TextTrackList: 0,
                        TouchList: 0
                    }
                },
                8113: function(e, t, n) {
                    var r = n(5005);
                    e.exports = r("navigator", "userAgent") || ""
                },
                7392: function(e, t, n) {
                    var r, i, o = n(7854),
                        a = n(8113),
                        u = o.process,
                        s = u && u.versions,
                        l = s && s.v8;
                    l ? i = (r = l.split("."))[0] + r[1] : a && (!(r = a.match(/Edge\/(\d+)/)) || r[1] >= 74) && (r = a.match(/Chrome\/(\d+)/)) && (i = r[1]), e.exports = i && +i
                },
                748: function(e) {
                    e.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"]
                },
                2109: function(e, t, n) {
                    var r = n(7854),
                        i = n(1236).f,
                        o = n(8880),
                        a = n(1320),
                        u = n(3505),
                        s = n(9920),
                        l = n(4705);
                    e.exports = function(e, t) {
                        var n, c, f, p, h, d = e.target,
                            v = e.global,
                            y = e.stat;
                        if (n = v ? r : y ? r[d] || u(d, {}) : (r[d] || {}).prototype)
                            for (c in t) {
                                if (p = t[c], f = e.noTargetGet ? (h = i(n, c)) && h.value : n[c], !l(v ? c : d + (y ? "." : "#") + c, e.forced) && void 0 !== f) {
                                    if (typeof p == typeof f) continue;
                                    s(p, f)
                                }(e.sham || f && f.sham) && o(p, "sham", !0), a(n, c, p, e)
                            }
                    }
                },
                7293: function(e) {
                    e.exports = function(e) {
                        try {
                            return !!e()
                        } catch (e) {
                            return !0
                        }
                    }
                },
                7007: function(e, t, n) {
                    "use strict";
                    n(4916);
                    var r = n(1320),
                        i = n(7293),
                        o = n(5112),
                        a = n(2261),
                        u = n(8880),
                        s = o("species"),
                        l = !i((function() {
                            var e = /./;
                            return e.exec = function() {
                                var e = [];
                                return e.groups = {
                                    a: "7"
                                }, e
                            }, "7" !== "".replace(e, "$<a>")
                        })),
                        c = "$0" === "a".replace(/./, "$0"),
                        f = o("replace"),
                        p = !!/./ [f] && "" === /./ [f]("a", "$0"),
                        h = !i((function() {
                            var e = /(?:)/,
                                t = e.exec;
                            e.exec = function() {
                                return t.apply(this, arguments)
                            };
                            var n = "ab".split(e);
                            return 2 !== n.length || "a" !== n[0] || "b" !== n[1]
                        }));
                    e.exports = function(e, t, n, f) {
                        var d = o(e),
                            v = !i((function() {
                                var t = {};
                                return t[d] = function() {
                                    return 7
                                }, 7 != "" [e](t)
                            })),
                            y = v && !i((function() {
                                var t = !1,
                                    n = /a/;
                                return "split" === e && ((n = {}).constructor = {}, n.constructor[s] = function() {
                                    return n
                                }, n.flags = "", n[d] = /./ [d]), n.exec = function() {
                                    return t = !0, null
                                }, n[d](""), !t
                            }));
                        if (!v || !y || "replace" === e && (!l || !c || p) || "split" === e && !h) {
                            var g = /./ [d],
                                m = n(d, "" [e], (function(e, t, n, r, i) {
                                    return t.exec === a ? v && !i ? {
                                        done: !0,
                                        value: g.call(t, n, r)
                                    } : {
                                        done: !0,
                                        value: e.call(n, t, r)
                                    } : {
                                        done: !1
                                    }
                                }), {
                                    REPLACE_KEEPS_$0: c,
                                    REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: p
                                }),
                                b = m[0],
                                x = m[1];
                            r(String.prototype, e, b), r(RegExp.prototype, d, 2 == t ? function(e, t) {
                                return x.call(e, this, t)
                            } : function(e) {
                                return x.call(e, this)
                            })
                        }
                        f && u(RegExp.prototype[d], "sham", !0)
                    }
                },
                9974: function(e, t, n) {
                    var r = n(3099);
                    e.exports = function(e, t, n) {
                        if (r(e), void 0 === t) return e;
                        switch (n) {
                            case 0:
                                return function() {
                                    return e.call(t)
                                };
                            case 1:
                                return function(n) {
                                    return e.call(t, n)
                                };
                            case 2:
                                return function(n, r) {
                                    return e.call(t, n, r)
                                };
                            case 3:
                                return function(n, r, i) {
                                    return e.call(t, n, r, i)
                                }
                        }
                        return function() {
                            return e.apply(t, arguments)
                        }
                    }
                },
                5005: function(e, t, n) {
                    var r = n(857),
                        i = n(7854),
                        o = function(e) {
                            return "function" == typeof e ? e : void 0
                        };
                    e.exports = function(e, t) {
                        return arguments.length < 2 ? o(r[e]) || o(i[e]) : r[e] && r[e][t] || i[e] && i[e][t]
                    }
                },
                1246: function(e, t, n) {
                    var r = n(648),
                        i = n(7497),
                        o = n(5112)("iterator");
                    e.exports = function(e) {
                        if (null != e) return e[o] || e["@@iterator"] || i[r(e)]
                    }
                },
                8554: function(e, t, n) {
                    var r = n(9670),
                        i = n(1246);
                    e.exports = function(e) {
                        var t = i(e);
                        if ("function" != typeof t) throw TypeError(String(e) + " is not iterable");
                        return r(t.call(e))
                    }
                },
                647: function(e, t, n) {
                    var r = n(7908),
                        i = Math.floor,
                        o = "".replace,
                        a = /\$([$&'`]|\d\d?|<[^>]*>)/g,
                        u = /\$([$&'`]|\d\d?)/g;
                    e.exports = function(e, t, n, s, l, c) {
                        var f = n + e.length,
                            p = s.length,
                            h = u;
                        return void 0 !== l && (l = r(l), h = a), o.call(c, h, (function(r, o) {
                            var a;
                            switch (o.charAt(0)) {
                                case "$":
                                    return "$";
                                case "&":
                                    return e;
                                case "`":
                                    return t.slice(0, n);
                                case "'":
                                    return t.slice(f);
                                case "<":
                                    a = l[o.slice(1, -1)];
                                    break;
                                default:
                                    var u = +o;
                                    if (0 === u) return r;
                                    if (u > p) {
                                        var c = i(u / 10);
                                        return 0 === c ? r : c <= p ? void 0 === s[c - 1] ? o.charAt(1) : s[c - 1] + o.charAt(1) : r
                                    }
                                    a = s[u - 1]
                            }
                            return void 0 === a ? "" : a
                        }))
                    }
                },
                7854: function(e, t, n) {
                    var r = function(e) {
                        return e && e.Math == Math && e
                    };
                    e.exports = r("object" == typeof globalThis && globalThis) || r("object" == typeof window && window) || r("object" == typeof self && self) || r("object" == typeof n.g && n.g) || function() {
                        return this
                    }() || Function("return this")()
                },
                6656: function(e) {
                    var t = {}.hasOwnProperty;
                    e.exports = function(e, n) {
                        return t.call(e, n)
                    }
                },
                3501: function(e) {
                    e.exports = {}
                },
                490: function(e, t, n) {
                    var r = n(5005);
                    e.exports = r("document", "documentElement")
                },
                4664: function(e, t, n) {
                    var r = n(9781),
                        i = n(7293),
                        o = n(317);
                    e.exports = !r && !i((function() {
                        return 7 != Object.defineProperty(o("div"), "a", {
                            get: function() {
                                return 7
                            }
                        }).a
                    }))
                },
                1179: function(e) {
                    var t = Math.abs,
                        n = Math.pow,
                        r = Math.floor,
                        i = Math.log,
                        o = Math.LN2;
                    e.exports = {
                        pack: function(e, a, u) {
                            var s, l, c, f = new Array(u),
                                p = 8 * u - a - 1,
                                h = (1 << p) - 1,
                                d = h >> 1,
                                v = 23 === a ? n(2, -24) - n(2, -77) : 0,
                                y = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0,
                                g = 0;
                            for ((e = t(e)) != e || e === 1 / 0 ? (l = e != e ? 1 : 0, s = h) : (s = r(i(e) / o), e * (c = n(2, -s)) < 1 && (s--, c *= 2), (e += s + d >= 1 ? v / c : v * n(2, 1 - d)) * c >= 2 && (s++, c /= 2), s + d >= h ? (l = 0, s = h) : s + d >= 1 ? (l = (e * c - 1) * n(2, a), s += d) : (l = e * n(2, d - 1) * n(2, a), s = 0)); a >= 8; f[g++] = 255 & l, l /= 256, a -= 8);
                            for (s = s << a | l, p += a; p > 0; f[g++] = 255 & s, s /= 256, p -= 8);
                            return f[--g] |= 128 * y, f
                        },
                        unpack: function(e, t) {
                            var r, i = e.length,
                                o = 8 * i - t - 1,
                                a = (1 << o) - 1,
                                u = a >> 1,
                                s = o - 7,
                                l = i - 1,
                                c = e[l--],
                                f = 127 & c;
                            for (c >>= 7; s > 0; f = 256 * f + e[l], l--, s -= 8);
                            for (r = f & (1 << -s) - 1, f >>= -s, s += t; s > 0; r = 256 * r + e[l], l--, s -= 8);
                            if (0 === f) f = 1 - u;
                            else {
                                if (f === a) return r ? NaN : c ? -1 / 0 : 1 / 0;
                                r += n(2, t), f -= u
                            }
                            return (c ? -1 : 1) * r * n(2, f - t)
                        }
                    }
                },
                8361: function(e, t, n) {
                    var r = n(7293),
                        i = n(4326),
                        o = "".split;
                    e.exports = r((function() {
                        return !Object("z").propertyIsEnumerable(0)
                    })) ? function(e) {
                        return "String" == i(e) ? o.call(e, "") : Object(e)
                    } : Object
                },
                9587: function(e, t, n) {
                    var r = n(111),
                        i = n(7674);
                    e.exports = function(e, t, n) {
                        var o, a;
                        return i && "function" == typeof(o = t.constructor) && o !== n && r(a = o.prototype) && a !== n.prototype && i(e, a), e
                    }
                },
                2788: function(e, t, n) {
                    var r = n(5465),
                        i = Function.toString;
                    "function" != typeof r.inspectSource && (r.inspectSource = function(e) {
                        return i.call(e)
                    }), e.exports = r.inspectSource
                },
                9909: function(e, t, n) {
                    var r, i, o, a = n(8536),
                        u = n(7854),
                        s = n(111),
                        l = n(8880),
                        c = n(6656),
                        f = n(5465),
                        p = n(6200),
                        h = n(3501),
                        d = u.WeakMap;
                    if (a) {
                        var v = f.state || (f.state = new d),
                            y = v.get,
                            g = v.has,
                            m = v.set;
                        r = function(e, t) {
                            return t.facade = e, m.call(v, e, t), t
                        }, i = function(e) {
                            return y.call(v, e) || {}
                        }, o = function(e) {
                            return g.call(v, e)
                        }
                    } else {
                        var b = p("state");
                        h[b] = !0, r = function(e, t) {
                            return t.facade = e, l(e, b, t), t
                        }, i = function(e) {
                            return c(e, b) ? e[b] : {}
                        }, o = function(e) {
                            return c(e, b)
                        }
                    }
                    e.exports = {
                        set: r,
                        get: i,
                        has: o,
                        enforce: function(e) {
                            return o(e) ? i(e) : r(e, {})
                        },
                        getterFor: function(e) {
                            return function(t) {
                                var n;
                                if (!s(t) || (n = i(t)).type !== e) throw TypeError("Incompatible receiver, " + e + " required");
                                return n
                            }
                        }
                    }
                },
                7659: function(e, t, n) {
                    var r = n(5112),
                        i = n(7497),
                        o = r("iterator"),
                        a = Array.prototype;
                    e.exports = function(e) {
                        return void 0 !== e && (i.Array === e || a[o] === e)
                    }
                },
                3157: function(e, t, n) {
                    var r = n(4326);
                    e.exports = Array.isArray || function(e) {
                        return "Array" == r(e)
                    }
                },
                4705: function(e, t, n) {
                    var r = n(7293),
                        i = /#|\.prototype\./,
                        o = function(e, t) {
                            var n = u[a(e)];
                            return n == l || n != s && ("function" == typeof t ? r(t) : !!t)
                        },
                        a = o.normalize = function(e) {
                            return String(e).replace(i, ".").toLowerCase()
                        },
                        u = o.data = {},
                        s = o.NATIVE = "N",
                        l = o.POLYFILL = "P";
                    e.exports = o
                },
                111: function(e) {
                    e.exports = function(e) {
                        return "object" == typeof e ? null !== e : "function" == typeof e
                    }
                },
                1913: function(e) {
                    e.exports = !1
                },
                7850: function(e, t, n) {
                    var r = n(111),
                        i = n(4326),
                        o = n(5112)("match");
                    e.exports = function(e) {
                        var t;
                        return r(e) && (void 0 !== (t = e[o]) ? !!t : "RegExp" == i(e))
                    }
                },
                9212: function(e, t, n) {
                    var r = n(9670);
                    e.exports = function(e) {
                        var t = e.return;
                        if (void 0 !== t) return r(t.call(e)).value
                    }
                },
                3383: function(e, t, n) {
                    "use strict";
                    var r, i, o, a = n(7293),
                        u = n(9518),
                        s = n(8880),
                        l = n(6656),
                        c = n(5112),
                        f = n(1913),
                        p = c("iterator"),
                        h = !1;
                    [].keys && ("next" in (o = [].keys()) ? (i = u(u(o))) !== Object.prototype && (r = i) : h = !0);
                    var d = null == r || a((function() {
                        var e = {};
                        return r[p].call(e) !== e
                    }));
                    d && (r = {}), f && !d || l(r, p) || s(r, p, (function() {
                        return this
                    })), e.exports = {
                        IteratorPrototype: r,
                        BUGGY_SAFARI_ITERATORS: h
                    }
                },
                7497: function(e) {
                    e.exports = {}
                },
                133: function(e, t, n) {
                    var r = n(7293);
                    e.exports = !!Object.getOwnPropertySymbols && !r((function() {
                        return !String(Symbol())
                    }))
                },
                590: function(e, t, n) {
                    var r = n(7293),
                        i = n(5112),
                        o = n(1913),
                        a = i("iterator");
                    e.exports = !r((function() {
                        var e = new URL("b?a=1&b=2&c=3", "http://a"),
                            t = e.searchParams,
                            n = "";
                        return e.pathname = "c%20d", t.forEach((function(e, r) {
                            t.delete("b"), n += r + e
                        })), o && !e.toJSON || !t.sort || "http://a/c%20d?a=1&c=3" !== e.href || "3" !== t.get("c") || "a=1" !== String(new URLSearchParams("?a=1")) || !t[a] || "a" !== new URL("https://a@b").username || "b" !== new URLSearchParams(new URLSearchParams("a=b")).get("a") || "xn--e1aybc" !== new URL("http://тест").host || "#%D0%B1" !== new URL("http://a#б").hash || "a1c3" !== n || "x" !== new URL("http://x", void 0).host
                    }))
                },
                8536: function(e, t, n) {
                    var r = n(7854),
                        i = n(2788),
                        o = r.WeakMap;
                    e.exports = "function" == typeof o && /native code/.test(i(o))
                },
                1574: function(e, t, n) {
                    "use strict";
                    var r = n(9781),
                        i = n(7293),
                        o = n(1956),
                        a = n(5181),
                        u = n(5296),
                        s = n(7908),
                        l = n(8361),
                        c = Object.assign,
                        f = Object.defineProperty;
                    e.exports = !c || i((function() {
                        if (r && 1 !== c({
                                b: 1
                            }, c(f({}, "a", {
                                enumerable: !0,
                                get: function() {
                                    f(this, "b", {
                                        value: 3,
                                        enumerable: !1
                                    })
                                }
                            }), {
                                b: 2
                            })).b) return !0;
                        var e = {},
                            t = {},
                            n = Symbol(),
                            i = "abcdefghijklmnopqrst";
                        return e[n] = 7, i.split("").forEach((function(e) {
                            t[e] = e
                        })), 7 != c({}, e)[n] || o(c({}, t)).join("") != i
                    })) ? function(e, t) {
                        for (var n = s(e), i = arguments.length, c = 1, f = a.f, p = u.f; i > c;)
                            for (var h, d = l(arguments[c++]), v = f ? o(d).concat(f(d)) : o(d), y = v.length, g = 0; y > g;) h = v[g++], r && !p.call(d, h) || (n[h] = d[h]);
                        return n
                    } : c
                },
                30: function(e, t, n) {
                    var r, i = n(9670),
                        o = n(6048),
                        a = n(748),
                        u = n(3501),
                        s = n(490),
                        l = n(317),
                        c = n(6200)("IE_PROTO"),
                        f = function() {},
                        p = function(e) {
                            return "<script>" + e + "<\/script>"
                        },
                        h = function() {
                            try {
                                r = document.domain && new ActiveXObject("htmlfile")
                            } catch (e) {}
                            var e, t;
                            h = r ? function(e) {
                                e.write(p("")), e.close();
                                var t = e.parentWindow.Object;
                                return e = null, t
                            }(r) : ((t = l("iframe")).style.display = "none", s.appendChild(t), t.src = String("javascript:"), (e = t.contentWindow.document).open(), e.write(p("document.F=Object")), e.close(), e.F);
                            for (var n = a.length; n--;) delete h.prototype[a[n]];
                            return h()
                        };
                    u[c] = !0, e.exports = Object.create || function(e, t) {
                        var n;
                        return null !== e ? (f.prototype = i(e), n = new f, f.prototype = null, n[c] = e) : n = h(), void 0 === t ? n : o(n, t)
                    }
                },
                6048: function(e, t, n) {
                    var r = n(9781),
                        i = n(3070),
                        o = n(9670),
                        a = n(1956);
                    e.exports = r ? Object.defineProperties : function(e, t) {
                        o(e);
                        for (var n, r = a(t), u = r.length, s = 0; u > s;) i.f(e, n = r[s++], t[n]);
                        return e
                    }
                },
                3070: function(e, t, n) {
                    var r = n(9781),
                        i = n(4664),
                        o = n(9670),
                        a = n(7593),
                        u = Object.defineProperty;
                    t.f = r ? u : function(e, t, n) {
                        if (o(e), t = a(t, !0), o(n), i) try {
                            return u(e, t, n)
                        } catch (e) {}
                        if ("get" in n || "set" in n) throw TypeError("Accessors not supported");
                        return "value" in n && (e[t] = n.value), e
                    }
                },
                1236: function(e, t, n) {
                    var r = n(9781),
                        i = n(5296),
                        o = n(9114),
                        a = n(5656),
                        u = n(7593),
                        s = n(6656),
                        l = n(4664),
                        c = Object.getOwnPropertyDescriptor;
                    t.f = r ? c : function(e, t) {
                        if (e = a(e), t = u(t, !0), l) try {
                            return c(e, t)
                        } catch (e) {}
                        if (s(e, t)) return o(!i.f.call(e, t), e[t])
                    }
                },
                8006: function(e, t, n) {
                    var r = n(6324),
                        i = n(748).concat("length", "prototype");
                    t.f = Object.getOwnPropertyNames || function(e) {
                        return r(e, i)
                    }
                },
                5181: function(e, t) {
                    t.f = Object.getOwnPropertySymbols
                },
                9518: function(e, t, n) {
                    var r = n(6656),
                        i = n(7908),
                        o = n(6200),
                        a = n(8544),
                        u = o("IE_PROTO"),
                        s = Object.prototype;
                    e.exports = a ? Object.getPrototypeOf : function(e) {
                        return e = i(e), r(e, u) ? e[u] : "function" == typeof e.constructor && e instanceof e.constructor ? e.constructor.prototype : e instanceof Object ? s : null
                    }
                },
                6324: function(e, t, n) {
                    var r = n(6656),
                        i = n(5656),
                        o = n(1318).indexOf,
                        a = n(3501);
                    e.exports = function(e, t) {
                        var n, u = i(e),
                            s = 0,
                            l = [];
                        for (n in u) !r(a, n) && r(u, n) && l.push(n);
                        for (; t.length > s;) r(u, n = t[s++]) && (~o(l, n) || l.push(n));
                        return l
                    }
                },
                1956: function(e, t, n) {
                    var r = n(6324),
                        i = n(748);
                    e.exports = Object.keys || function(e) {
                        return r(e, i)
                    }
                },
                5296: function(e, t) {
                    "use strict";
                    var n = {}.propertyIsEnumerable,
                        r = Object.getOwnPropertyDescriptor,
                        i = r && !n.call({
                            1: 2
                        }, 1);
                    t.f = i ? function(e) {
                        var t = r(this, e);
                        return !!t && t.enumerable
                    } : n
                },
                7674: function(e, t, n) {
                    var r = n(9670),
                        i = n(6077);
                    e.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
                        var e, t = !1,
                            n = {};
                        try {
                            (e = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set).call(n, []), t = n instanceof Array
                        } catch (e) {}
                        return function(n, o) {
                            return r(n), i(o), t ? e.call(n, o) : n.__proto__ = o, n
                        }
                    }() : void 0)
                },
                288: function(e, t, n) {
                    "use strict";
                    var r = n(1694),
                        i = n(648);
                    e.exports = r ? {}.toString : function() {
                        return "[object " + i(this) + "]"
                    }
                },
                3887: function(e, t, n) {
                    var r = n(5005),
                        i = n(8006),
                        o = n(5181),
                        a = n(9670);
                    e.exports = r("Reflect", "ownKeys") || function(e) {
                        var t = i.f(a(e)),
                            n = o.f;
                        return n ? t.concat(n(e)) : t
                    }
                },
                857: function(e, t, n) {
                    var r = n(7854);
                    e.exports = r
                },
                2248: function(e, t, n) {
                    var r = n(1320);
                    e.exports = function(e, t, n) {
                        for (var i in t) r(e, i, t[i], n);
                        return e
                    }
                },
                1320: function(e, t, n) {
                    var r = n(7854),
                        i = n(8880),
                        o = n(6656),
                        a = n(3505),
                        u = n(2788),
                        s = n(9909),
                        l = s.get,
                        c = s.enforce,
                        f = String(String).split("String");
                    (e.exports = function(e, t, n, u) {
                        var s, l = !!u && !!u.unsafe,
                            p = !!u && !!u.enumerable,
                            h = !!u && !!u.noTargetGet;
                        "function" == typeof n && ("string" != typeof t || o(n, "name") || i(n, "name", t), (s = c(n)).source || (s.source = f.join("string" == typeof t ? t : ""))), e !== r ? (l ? !h && e[t] && (p = !0) : delete e[t], p ? e[t] = n : i(e, t, n)) : p ? e[t] = n : a(t, n)
                    })(Function.prototype, "toString", (function() {
                        return "function" == typeof this && l(this).source || u(this)
                    }))
                },
                7651: function(e, t, n) {
                    var r = n(4326),
                        i = n(2261);
                    e.exports = function(e, t) {
                        var n = e.exec;
                        if ("function" == typeof n) {
                            var o = n.call(e, t);
                            if ("object" != typeof o) throw TypeError("RegExp exec method returned something other than an Object or null");
                            return o
                        }
                        if ("RegExp" !== r(e)) throw TypeError("RegExp#exec called on incompatible receiver");
                        return i.call(e, t)
                    }
                },
                2261: function(e, t, n) {
                    "use strict";
                    var r, i, o = n(7066),
                        a = n(2999),
                        u = RegExp.prototype.exec,
                        s = String.prototype.replace,
                        l = u,
                        c = (r = /a/, i = /b*/g, u.call(r, "a"), u.call(i, "a"), 0 !== r.lastIndex || 0 !== i.lastIndex),
                        f = a.UNSUPPORTED_Y || a.BROKEN_CARET,
                        p = void 0 !== /()??/.exec("")[1];
                    (c || p || f) && (l = function(e) {
                        var t, n, r, i, a = this,
                            l = f && a.sticky,
                            h = o.call(a),
                            d = a.source,
                            v = 0,
                            y = e;
                        return l && (-1 === (h = h.replace("y", "")).indexOf("g") && (h += "g"), y = String(e).slice(a.lastIndex), a.lastIndex > 0 && (!a.multiline || a.multiline && "\n" !== e[a.lastIndex - 1]) && (d = "(?: " + d + ")", y = " " + y, v++), n = new RegExp("^(?:" + d + ")", h)), p && (n = new RegExp("^" + d + "$(?!\\s)", h)), c && (t = a.lastIndex), r = u.call(l ? n : a, y), l ? r ? (r.input = r.input.slice(v), r[0] = r[0].slice(v), r.index = a.lastIndex, a.lastIndex += r[0].length) : a.lastIndex = 0 : c && r && (a.lastIndex = a.global ? r.index + r[0].length : t), p && r && r.length > 1 && s.call(r[0], n, (function() {
                            for (i = 1; i < arguments.length - 2; i++) void 0 === arguments[i] && (r[i] = void 0)
                        })), r
                    }), e.exports = l
                },
                7066: function(e, t, n) {
                    "use strict";
                    var r = n(9670);
                    e.exports = function() {
                        var e = r(this),
                            t = "";
                        return e.global && (t += "g"), e.ignoreCase && (t += "i"), e.multiline && (t += "m"), e.dotAll && (t += "s"), e.unicode && (t += "u"), e.sticky && (t += "y"), t
                    }
                },
                2999: function(e, t, n) {
                    "use strict";
                    var r = n(7293);

                    function i(e, t) {
                        return RegExp(e, t)
                    }
                    t.UNSUPPORTED_Y = r((function() {
                        var e = i("a", "y");
                        return e.lastIndex = 2, null != e.exec("abcd")
                    })), t.BROKEN_CARET = r((function() {
                        var e = i("^r", "gy");
                        return e.lastIndex = 2, null != e.exec("str")
                    }))
                },
                4488: function(e) {
                    e.exports = function(e) {
                        if (null == e) throw TypeError("Can't call method on " + e);
                        return e
                    }
                },
                3505: function(e, t, n) {
                    var r = n(7854),
                        i = n(8880);
                    e.exports = function(e, t) {
                        try {
                            i(r, e, t)
                        } catch (n) {
                            r[e] = t
                        }
                        return t
                    }
                },
                6340: function(e, t, n) {
                    "use strict";
                    var r = n(5005),
                        i = n(3070),
                        o = n(5112),
                        a = n(9781),
                        u = o("species");
                    e.exports = function(e) {
                        var t = r(e),
                            n = i.f;
                        a && t && !t[u] && n(t, u, {
                            configurable: !0,
                            get: function() {
                                return this
                            }
                        })
                    }
                },
                8003: function(e, t, n) {
                    var r = n(3070).f,
                        i = n(6656),
                        o = n(5112)("toStringTag");
                    e.exports = function(e, t, n) {
                        e && !i(e = n ? e : e.prototype, o) && r(e, o, {
                            configurable: !0,
                            value: t
                        })
                    }
                },
                6200: function(e, t, n) {
                    var r = n(2309),
                        i = n(9711),
                        o = r("keys");
                    e.exports = function(e) {
                        return o[e] || (o[e] = i(e))
                    }
                },
                5465: function(e, t, n) {
                    var r = n(7854),
                        i = n(3505),
                        o = "__core-js_shared__",
                        a = r[o] || i(o, {});
                    e.exports = a
                },
                2309: function(e, t, n) {
                    var r = n(1913),
                        i = n(5465);
                    (e.exports = function(e, t) {
                        return i[e] || (i[e] = void 0 !== t ? t : {})
                    })("versions", []).push({
                        version: "3.9.0",
                        mode: r ? "pure" : "global",
                        copyright: "© 2021 Denis Pushkarev (zloirock.ru)"
                    })
                },
                6707: function(e, t, n) {
                    var r = n(9670),
                        i = n(3099),
                        o = n(5112)("species");
                    e.exports = function(e, t) {
                        var n, a = r(e).constructor;
                        return void 0 === a || null == (n = r(a)[o]) ? t : i(n)
                    }
                },
                8710: function(e, t, n) {
                    var r = n(9958),
                        i = n(4488),
                        o = function(e) {
                            return function(t, n) {
                                var o, a, u = String(i(t)),
                                    s = r(n),
                                    l = u.length;
                                return s < 0 || s >= l ? e ? "" : void 0 : (o = u.charCodeAt(s)) < 55296 || o > 56319 || s + 1 === l || (a = u.charCodeAt(s + 1)) < 56320 || a > 57343 ? e ? u.charAt(s) : o : e ? u.slice(s, s + 2) : a - 56320 + (o - 55296 << 10) + 65536
                            }
                        };
                    e.exports = {
                        codeAt: o(!1),
                        charAt: o(!0)
                    }
                },
                3197: function(e) {
                    "use strict";
                    var t = 2147483647,
                        n = /[^\0-\u007E]/,
                        r = /[.\u3002\uFF0E\uFF61]/g,
                        i = "Overflow: input needs wider integers to process",
                        o = Math.floor,
                        a = String.fromCharCode,
                        u = function(e) {
                            return e + 22 + 75 * (e < 26)
                        },
                        s = function(e, t, n) {
                            var r = 0;
                            for (e = n ? o(e / 700) : e >> 1, e += o(e / t); e > 455; r += 36) e = o(e / 35);
                            return o(r + 36 * e / (e + 38))
                        },
                        l = function(e) {
                            var n, r, l = [],
                                c = (e = function(e) {
                                    for (var t = [], n = 0, r = e.length; n < r;) {
                                        var i = e.charCodeAt(n++);
                                        if (i >= 55296 && i <= 56319 && n < r) {
                                            var o = e.charCodeAt(n++);
                                            56320 == (64512 & o) ? t.push(((1023 & i) << 10) + (1023 & o) + 65536) : (t.push(i), n--)
                                        } else t.push(i)
                                    }
                                    return t
                                }(e)).length,
                                f = 128,
                                p = 0,
                                h = 72;
                            for (n = 0; n < e.length; n++)(r = e[n]) < 128 && l.push(a(r));
                            var d = l.length,
                                v = d;
                            for (d && l.push("-"); v < c;) {
                                var y = t;
                                for (n = 0; n < e.length; n++)(r = e[n]) >= f && r < y && (y = r);
                                var g = v + 1;
                                if (y - f > o((t - p) / g)) throw RangeError(i);
                                for (p += (y - f) * g, f = y, n = 0; n < e.length; n++) {
                                    if ((r = e[n]) < f && ++p > t) throw RangeError(i);
                                    if (r == f) {
                                        for (var m = p, b = 36;; b += 36) {
                                            var x = b <= h ? 1 : b >= h + 26 ? 26 : b - h;
                                            if (m < x) break;
                                            var w = m - x,
                                                E = 36 - x;
                                            l.push(a(u(x + w % E))), m = o(w / E)
                                        }
                                        l.push(a(u(m))), h = s(p, g, v == d), p = 0, ++v
                                    }
                                }++p, ++f
                            }
                            return l.join("")
                        };
                    e.exports = function(e) {
                        var t, i, o = [],
                            a = e.toLowerCase().replace(r, ".").split(".");
                        for (t = 0; t < a.length; t++) i = a[t], o.push(n.test(i) ? "xn--" + l(i) : i);
                        return o.join(".")
                    }
                },
                6091: function(e, t, n) {
                    var r = n(7293),
                        i = n(1361);
                    e.exports = function(e) {
                        return r((function() {
                            return !!i[e]() || "​᠎" != "​᠎" [e]() || i[e].name !== e
                        }))
                    }
                },
                3111: function(e, t, n) {
                    var r = n(4488),
                        i = "[" + n(1361) + "]",
                        o = RegExp("^" + i + i + "*"),
                        a = RegExp(i + i + "*$"),
                        u = function(e) {
                            return function(t) {
                                var n = String(r(t));
                                return 1 & e && (n = n.replace(o, "")), 2 & e && (n = n.replace(a, "")), n
                            }
                        };
                    e.exports = {
                        start: u(1),
                        end: u(2),
                        trim: u(3)
                    }
                },
                1400: function(e, t, n) {
                    var r = n(9958),
                        i = Math.max,
                        o = Math.min;
                    e.exports = function(e, t) {
                        var n = r(e);
                        return n < 0 ? i(n + t, 0) : o(n, t)
                    }
                },
                7067: function(e, t, n) {
                    var r = n(9958),
                        i = n(7466);
                    e.exports = function(e) {
                        if (void 0 === e) return 0;
                        var t = r(e),
                            n = i(t);
                        if (t !== n) throw RangeError("Wrong length or index");
                        return n
                    }
                },
                5656: function(e, t, n) {
                    var r = n(8361),
                        i = n(4488);
                    e.exports = function(e) {
                        return r(i(e))
                    }
                },
                9958: function(e) {
                    var t = Math.ceil,
                        n = Math.floor;
                    e.exports = function(e) {
                        return isNaN(e = +e) ? 0 : (e > 0 ? n : t)(e)
                    }
                },
                7466: function(e, t, n) {
                    var r = n(9958),
                        i = Math.min;
                    e.exports = function(e) {
                        return e > 0 ? i(r(e), 9007199254740991) : 0
                    }
                },
                7908: function(e, t, n) {
                    var r = n(4488);
                    e.exports = function(e) {
                        return Object(r(e))
                    }
                },
                4590: function(e, t, n) {
                    var r = n(3002);
                    e.exports = function(e, t) {
                        var n = r(e);
                        if (n % t) throw RangeError("Wrong offset");
                        return n
                    }
                },
                3002: function(e, t, n) {
                    var r = n(9958);
                    e.exports = function(e) {
                        var t = r(e);
                        if (t < 0) throw RangeError("The argument can't be less than 0");
                        return t
                    }
                },
                7593: function(e, t, n) {
                    var r = n(111);
                    e.exports = function(e, t) {
                        if (!r(e)) return e;
                        var n, i;
                        if (t && "function" == typeof(n = e.toString) && !r(i = n.call(e))) return i;
                        if ("function" == typeof(n = e.valueOf) && !r(i = n.call(e))) return i;
                        if (!t && "function" == typeof(n = e.toString) && !r(i = n.call(e))) return i;
                        throw TypeError("Can't convert object to primitive value")
                    }
                },
                1694: function(e, t, n) {
                    var r = {};
                    r[n(5112)("toStringTag")] = "z", e.exports = "[object z]" === String(r)
                },
                9843: function(e, t, n) {
                    "use strict";
                    var r = n(2109),
                        i = n(7854),
                        o = n(9781),
                        a = n(3832),
                        u = n(260),
                        s = n(3331),
                        l = n(5787),
                        c = n(9114),
                        f = n(8880),
                        p = n(7466),
                        h = n(7067),
                        d = n(4590),
                        v = n(7593),
                        y = n(6656),
                        g = n(648),
                        m = n(111),
                        b = n(30),
                        x = n(7674),
                        w = n(8006).f,
                        E = n(7321),
                        k = n(2092).forEach,
                        A = n(6340),
                        S = n(3070),
                        F = n(1236),
                        T = n(9909),
                        C = n(9587),
                        L = T.get,
                        R = T.set,
                        I = S.f,
                        U = F.f,
                        O = Math.round,
                        _ = i.RangeError,
                        M = s.ArrayBuffer,
                        z = s.DataView,
                        P = u.NATIVE_ARRAY_BUFFER_VIEWS,
                        j = u.TYPED_ARRAY_TAG,
                        D = u.TypedArray,
                        N = u.TypedArrayPrototype,
                        B = u.aTypedArrayConstructor,
                        q = u.isTypedArray,
                        W = "BYTES_PER_ELEMENT",
                        H = "Wrong length",
                        Y = function(e, t) {
                            for (var n = 0, r = t.length, i = new(B(e))(r); r > n;) i[n] = t[n++];
                            return i
                        },
                        G = function(e, t) {
                            I(e, t, {
                                get: function() {
                                    return L(this)[t]
                                }
                            })
                        },
                        Q = function(e) {
                            var t;
                            return e instanceof M || "ArrayBuffer" == (t = g(e)) || "SharedArrayBuffer" == t
                        },
                        $ = function(e, t) {
                            return q(e) && "symbol" != typeof t && t in e && String(+t) == String(t)
                        },
                        V = function(e, t) {
                            return $(e, t = v(t, !0)) ? c(2, e[t]) : U(e, t)
                        },
                        X = function(e, t, n) {
                            return !($(e, t = v(t, !0)) && m(n) && y(n, "value")) || y(n, "get") || y(n, "set") || n.configurable || y(n, "writable") && !n.writable || y(n, "enumerable") && !n.enumerable ? I(e, t, n) : (e[t] = n.value, e)
                        };
                    o ? (P || (F.f = V, S.f = X, G(N, "buffer"), G(N, "byteOffset"), G(N, "byteLength"), G(N, "length")), r({
                        target: "Object",
                        stat: !0,
                        forced: !P
                    }, {
                        getOwnPropertyDescriptor: V,
                        defineProperty: X
                    }), e.exports = function(e, t, n) {
                        var o = e.match(/\d+$/)[0] / 8,
                            u = e + (n ? "Clamped" : "") + "Array",
                            s = "get" + e,
                            c = "set" + e,
                            v = i[u],
                            y = v,
                            g = y && y.prototype,
                            S = {},
                            F = function(e, t) {
                                I(e, t, {
                                    get: function() {
                                        return function(e, t) {
                                            var n = L(e);
                                            return n.view[s](t * o + n.byteOffset, !0)
                                        }(this, t)
                                    },
                                    set: function(e) {
                                        return function(e, t, r) {
                                            var i = L(e);
                                            n && (r = (r = O(r)) < 0 ? 0 : r > 255 ? 255 : 255 & r), i.view[c](t * o + i.byteOffset, r, !0)
                                        }(this, t, e)
                                    },
                                    enumerable: !0
                                })
                            };
                        P ? a && (y = t((function(e, t, n, r) {
                            return l(e, y, u), C(m(t) ? Q(t) ? void 0 !== r ? new v(t, d(n, o), r) : void 0 !== n ? new v(t, d(n, o)) : new v(t) : q(t) ? Y(y, t) : E.call(y, t) : new v(h(t)), e, y)
                        })), x && x(y, D), k(w(v), (function(e) {
                            e in y || f(y, e, v[e])
                        })), y.prototype = g) : (y = t((function(e, t, n, r) {
                            l(e, y, u);
                            var i, a, s, c = 0,
                                f = 0;
                            if (m(t)) {
                                if (!Q(t)) return q(t) ? Y(y, t) : E.call(y, t);
                                i = t, f = d(n, o);
                                var v = t.byteLength;
                                if (void 0 === r) {
                                    if (v % o) throw _(H);
                                    if ((a = v - f) < 0) throw _(H)
                                } else if ((a = p(r) * o) + f > v) throw _(H);
                                s = a / o
                            } else s = h(t), i = new M(a = s * o);
                            for (R(e, {
                                    buffer: i,
                                    byteOffset: f,
                                    byteLength: a,
                                    length: s,
                                    view: new z(i)
                                }); c < s;) F(e, c++)
                        })), x && x(y, D), g = y.prototype = b(N)), g.constructor !== y && f(g, "constructor", y), j && f(g, j, u), S[u] = y, r({
                            global: !0,
                            forced: y != v,
                            sham: !P
                        }, S), W in y || f(y, W, o), W in g || f(g, W, o), A(u)
                    }) : e.exports = function() {}
                },
                3832: function(e, t, n) {
                    var r = n(7854),
                        i = n(7293),
                        o = n(7072),
                        a = n(260).NATIVE_ARRAY_BUFFER_VIEWS,
                        u = r.ArrayBuffer,
                        s = r.Int8Array;
                    e.exports = !a || !i((function() {
                        s(1)
                    })) || !i((function() {
                        new s(-1)
                    })) || !o((function(e) {
                        new s, new s(null), new s(1.5), new s(e)
                    }), !0) || i((function() {
                        return 1 !== new s(new u(2), 1, void 0).length
                    }))
                },
                3074: function(e, t, n) {
                    var r = n(260).aTypedArrayConstructor,
                        i = n(6707);
                    e.exports = function(e, t) {
                        for (var n = i(e, e.constructor), o = 0, a = t.length, u = new(r(n))(a); a > o;) u[o] = t[o++];
                        return u
                    }
                },
                7321: function(e, t, n) {
                    var r = n(7908),
                        i = n(7466),
                        o = n(1246),
                        a = n(7659),
                        u = n(9974),
                        s = n(260).aTypedArrayConstructor;
                    e.exports = function(e) {
                        var t, n, l, c, f, p, h = r(e),
                            d = arguments.length,
                            v = d > 1 ? arguments[1] : void 0,
                            y = void 0 !== v,
                            g = o(h);
                        if (null != g && !a(g))
                            for (p = (f = g.call(h)).next, h = []; !(c = p.call(f)).done;) h.push(c.value);
                        for (y && d > 2 && (v = u(v, arguments[2], 2)), n = i(h.length), l = new(s(this))(n), t = 0; n > t; t++) l[t] = y ? v(h[t], t) : h[t];
                        return l
                    }
                },
                9711: function(e) {
                    var t = 0,
                        n = Math.random();
                    e.exports = function(e) {
                        return "Symbol(" + String(void 0 === e ? "" : e) + ")_" + (++t + n).toString(36)
                    }
                },
                3307: function(e, t, n) {
                    var r = n(133);
                    e.exports = r && !Symbol.sham && "symbol" == typeof Symbol.iterator
                },
                5112: function(e, t, n) {
                    var r = n(7854),
                        i = n(2309),
                        o = n(6656),
                        a = n(9711),
                        u = n(133),
                        s = n(3307),
                        l = i("wks"),
                        c = r.Symbol,
                        f = s ? c : c && c.withoutSetter || a;
                    e.exports = function(e) {
                        return o(l, e) || (u && o(c, e) ? l[e] = c[e] : l[e] = f("Symbol." + e)), l[e]
                    }
                },
                1361: function(e) {
                    e.exports = "\t\n\v\f\r                　\u2028\u2029\ufeff"
                },
                8264: function(e, t, n) {
                    "use strict";
                    var r = n(2109),
                        i = n(7854),
                        o = n(3331),
                        a = n(6340),
                        u = o.ArrayBuffer;
                    r({
                        global: !0,
                        forced: i.ArrayBuffer !== u
                    }, {
                        ArrayBuffer: u
                    }), a("ArrayBuffer")
                },
                2222: function(e, t, n) {
                    "use strict";
                    var r = n(2109),
                        i = n(7293),
                        o = n(3157),
                        a = n(111),
                        u = n(7908),
                        s = n(7466),
                        l = n(6135),
                        c = n(5417),
                        f = n(1194),
                        p = n(5112),
                        h = n(7392),
                        d = p("isConcatSpreadable"),
                        v = 9007199254740991,
                        y = "Maximum allowed index exceeded",
                        g = h >= 51 || !i((function() {
                            var e = [];
                            return e[d] = !1, e.concat()[0] !== e
                        })),
                        m = f("concat"),
                        b = function(e) {
                            if (!a(e)) return !1;
                            var t = e[d];
                            return void 0 !== t ? !!t : o(e)
                        };
                    r({
                        target: "Array",
                        proto: !0,
                        forced: !g || !m
                    }, {
                        concat: function(e) {
                            var t, n, r, i, o, a = u(this),
                                f = c(a, 0),
                                p = 0;
                            for (t = -1, r = arguments.length; t < r; t++)
                                if (b(o = -1 === t ? a : arguments[t])) {
                                    if (p + (i = s(o.length)) > v) throw TypeError(y);
                                    for (n = 0; n < i; n++, p++) n in o && l(f, p, o[n])
                                } else {
                                    if (p >= v) throw TypeError(y);
                                    l(f, p++, o)
                                } return f.length = p, f
                        }
                    })
                },
                7327: function(e, t, n) {
                    "use strict";
                    var r = n(2109),
                        i = n(2092).filter;
                    r({
                        target: "Array",
                        proto: !0,
                        forced: !n(1194)("filter")
                    }, {
                        filter: function(e) {
                            return i(this, e, arguments.length > 1 ? arguments[1] : void 0)
                        }
                    })
                },
                2772: function(e, t, n) {
                    "use strict";
                    var r = n(2109),
                        i = n(1318).indexOf,
                        o = n(9341),
                        a = [].indexOf,
                        u = !!a && 1 / [1].indexOf(1, -0) < 0,
                        s = o("indexOf");
                    r({
                        target: "Array",
                        proto: !0,
                        forced: u || !s
                    }, {
                        indexOf: function(e) {
                            return u ? a.apply(this, arguments) || 0 : i(this, e, arguments.length > 1 ? arguments[1] : void 0)
                        }
                    })
                },
                6992: function(e, t, n) {
                    "use strict";
                    var r = n(5656),
                        i = n(1223),
                        o = n(7497),
                        a = n(9909),
                        u = n(654),
                        s = "Array Iterator",
                        l = a.set,
                        c = a.getterFor(s);
                    e.exports = u(Array, "Array", (function(e, t) {
                        l(this, {
                            type: s,
                            target: r(e),
                            index: 0,
                            kind: t
                        })
                    }), (function() {
                        var e = c(this),
                            t = e.target,
                            n = e.kind,
                            r = e.index++;
                        return !t || r >= t.length ? (e.target = void 0, {
                            value: void 0,
                            done: !0
                        }) : "keys" == n ? {
                            value: r,
                            done: !1
                        } : "values" == n ? {
                            value: t[r],
                            done: !1
                        } : {
                            value: [r, t[r]],
                            done: !1
                        }
                    }), "values"), o.Arguments = o.Array, i("keys"), i("values"), i("entries")
                },
                1249: function(e, t, n) {
                    "use strict";
                    var r = n(2109),
                        i = n(2092).map;
                    r({
                        target: "Array",
                        proto: !0,
                        forced: !n(1194)("map")
                    }, {
                        map: function(e) {
                            return i(this, e, arguments.length > 1 ? arguments[1] : void 0)
                        }
                    })
                },
                7042: function(e, t, n) {
                    "use strict";
                    var r = n(2109),
                        i = n(111),
                        o = n(3157),
                        a = n(1400),
                        u = n(7466),
                        s = n(5656),
                        l = n(6135),
                        c = n(5112),
                        f = n(1194)("slice"),
                        p = c("species"),
                        h = [].slice,
                        d = Math.max;
                    r({
                        target: "Array",
                        proto: !0,
                        forced: !f
                    }, {
                        slice: function(e, t) {
                            var n, r, c, f = s(this),
                                v = u(f.length),
                                y = a(e, v),
                                g = a(void 0 === t ? v : t, v);
                            if (o(f) && ("function" != typeof(n = f.constructor) || n !== Array && !o(n.prototype) ? i(n) && null === (n = n[p]) && (n = void 0) : n = void 0, n === Array || void 0 === n)) return h.call(f, y, g);
                            for (r = new(void 0 === n ? Array : n)(d(g - y, 0)), c = 0; y < g; y++, c++) y in f && l(r, c, f[y]);
                            return r.length = c, r
                        }
                    })
                },
                561: function(e, t, n) {
                    "use strict";
                    var r = n(2109),
                        i = n(1400),
                        o = n(9958),
                        a = n(7466),
                        u = n(7908),
                        s = n(5417),
                        l = n(6135),
                        c = n(1194)("splice"),
                        f = Math.max,
                        p = Math.min,
                        h = 9007199254740991,
                        d = "Maximum allowed length exceeded";
                    r({
                        target: "Array",
                        proto: !0,
                        forced: !c
                    }, {
                        splice: function(e, t) {
                            var n, r, c, v, y, g, m = u(this),
                                b = a(m.length),
                                x = i(e, b),
                                w = arguments.length;
                            if (0 === w ? n = r = 0 : 1 === w ? (n = 0, r = b - x) : (n = w - 2, r = p(f(o(t), 0), b - x)), b + n - r > h) throw TypeError(d);
                            for (c = s(m, r), v = 0; v < r; v++)(y = x + v) in m && l(c, v, m[y]);
                            if (c.length = r, n < r) {
                                for (v = x; v < b - r; v++) g = v + n, (y = v + r) in m ? m[g] = m[y] : delete m[g];
                                for (v = b; v > b - r + n; v--) delete m[v - 1]
                            } else if (n > r)
                                for (v = b - r; v > x; v--) g = v + n - 1, (y = v + r - 1) in m ? m[g] = m[y] : delete m[g];
                            for (v = 0; v < n; v++) m[v + x] = arguments[v + 2];
                            return m.length = b - r + n, c
                        }
                    })
                },
                8309: function(e, t, n) {
                    var r = n(9781),
                        i = n(3070).f,
                        o = Function.prototype,
                        a = o.toString,
                        u = /^\s*function ([^ (]*)/,
                        s = "name";
                    r && !(s in o) && i(o, s, {
                        configurable: !0,
                        get: function() {
                            try {
                                return a.call(this).match(u)[1]
                            } catch (e) {
                                return ""
                            }
                        }
                    })
                },
                489: function(e, t, n) {
                    var r = n(2109),
                        i = n(7293),
                        o = n(7908),
                        a = n(9518),
                        u = n(8544);
                    r({
                        target: "Object",
                        stat: !0,
                        forced: i((function() {
                            a(1)
                        })),
                        sham: !u
                    }, {
                        getPrototypeOf: function(e) {
                            return a(o(e))
                        }
                    })
                },
                1539: function(e, t, n) {
                    var r = n(1694),
                        i = n(1320),
                        o = n(288);
                    r || i(Object.prototype, "toString", o, {
                        unsafe: !0
                    })
                },
                4916: function(e, t, n) {
                    "use strict";
                    var r = n(2109),
                        i = n(2261);
                    r({
                        target: "RegExp",
                        proto: !0,
                        forced: /./.exec !== i
                    }, {
                        exec: i
                    })
                },
                9714: function(e, t, n) {
                    "use strict";
                    var r = n(1320),
                        i = n(9670),
                        o = n(7293),
                        a = n(7066),
                        u = "toString",
                        s = RegExp.prototype,
                        l = s.toString,
                        c = o((function() {
                            return "/a/b" != l.call({
                                source: "a",
                                flags: "b"
                            })
                        })),
                        f = l.name != u;
                    (c || f) && r(RegExp.prototype, u, (function() {
                        var e = i(this),
                            t = String(e.source),
                            n = e.flags;
                        return "/" + t + "/" + String(void 0 === n && e instanceof RegExp && !("flags" in s) ? a.call(e) : n)
                    }), {
                        unsafe: !0
                    })
                },
                8783: function(e, t, n) {
                    "use strict";
                    var r = n(8710).charAt,
                        i = n(9909),
                        o = n(654),
                        a = "String Iterator",
                        u = i.set,
                        s = i.getterFor(a);
                    o(String, "String", (function(e) {
                        u(this, {
                            type: a,
                            string: String(e),
                            index: 0
                        })
                    }), (function() {
                        var e, t = s(this),
                            n = t.string,
                            i = t.index;
                        return i >= n.length ? {
                            value: void 0,
                            done: !0
                        } : (e = r(n, i), t.index += e.length, {
                            value: e,
                            done: !1
                        })
                    }))
                },
                4723: function(e, t, n) {
                    "use strict";
                    var r = n(7007),
                        i = n(9670),
                        o = n(7466),
                        a = n(4488),
                        u = n(1530),
                        s = n(7651);
                    r("match", 1, (function(e, t, n) {
                        return [function(t) {
                            var n = a(this),
                                r = null == t ? void 0 : t[e];
                            return void 0 !== r ? r.call(t, n) : new RegExp(t)[e](String(n))
                        }, function(e) {
                            var r = n(t, e, this);
                            if (r.done) return r.value;
                            var a = i(e),
                                l = String(this);
                            if (!a.global) return s(a, l);
                            var c = a.unicode;
                            a.lastIndex = 0;
                            for (var f, p = [], h = 0; null !== (f = s(a, l));) {
                                var d = String(f[0]);
                                p[h] = d, "" === d && (a.lastIndex = u(l, o(a.lastIndex), c)), h++
                            }
                            return 0 === h ? null : p
                        }]
                    }))
                },
                5306: function(e, t, n) {
                    "use strict";
                    var r = n(7007),
                        i = n(9670),
                        o = n(7466),
                        a = n(9958),
                        u = n(4488),
                        s = n(1530),
                        l = n(647),
                        c = n(7651),
                        f = Math.max,
                        p = Math.min;
                    r("replace", 2, (function(e, t, n, r) {
                        var h = r.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE,
                            d = r.REPLACE_KEEPS_$0,
                            v = h ? "$" : "$0";
                        return [function(n, r) {
                            var i = u(this),
                                o = null == n ? void 0 : n[e];
                            return void 0 !== o ? o.call(n, i, r) : t.call(String(i), n, r)
                        }, function(e, r) {
                            if (!h && d || "string" == typeof r && -1 === r.indexOf(v)) {
                                var u = n(t, e, this, r);
                                if (u.done) return u.value
                            }
                            var y = i(e),
                                g = String(this),
                                m = "function" == typeof r;
                            m || (r = String(r));
                            var b = y.global;
                            if (b) {
                                var x = y.unicode;
                                y.lastIndex = 0
                            }
                            for (var w = [];;) {
                                var E = c(y, g);
                                if (null === E) break;
                                if (w.push(E), !b) break;
                                "" === String(E[0]) && (y.lastIndex = s(g, o(y.lastIndex), x))
                            }
                            for (var k, A = "", S = 0, F = 0; F < w.length; F++) {
                                E = w[F];
                                for (var T = String(E[0]), C = f(p(a(E.index), g.length), 0), L = [], R = 1; R < E.length; R++) L.push(void 0 === (k = E[R]) ? k : String(k));
                                var I = E.groups;
                                if (m) {
                                    var U = [T].concat(L, C, g);
                                    void 0 !== I && U.push(I);
                                    var O = String(r.apply(void 0, U))
                                } else O = l(T, g, C, L, I, r);
                                C >= S && (A += g.slice(S, C) + O, S = C + T.length)
                            }
                            return A + g.slice(S)
                        }]
                    }))
                },
                3123: function(e, t, n) {
                    "use strict";
                    var r = n(7007),
                        i = n(7850),
                        o = n(9670),
                        a = n(4488),
                        u = n(6707),
                        s = n(1530),
                        l = n(7466),
                        c = n(7651),
                        f = n(2261),
                        p = n(7293),
                        h = [].push,
                        d = Math.min,
                        v = 4294967295,
                        y = !p((function() {
                            return !RegExp(v, "y")
                        }));
                    r("split", 2, (function(e, t, n) {
                        var r;
                        return r = "c" == "abbc".split(/(b)*/)[1] || 4 != "test".split(/(?:)/, -1).length || 2 != "ab".split(/(?:ab)*/).length || 4 != ".".split(/(.?)(.?)/).length || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(e, n) {
                            var r = String(a(this)),
                                o = void 0 === n ? v : n >>> 0;
                            if (0 === o) return [];
                            if (void 0 === e) return [r];
                            if (!i(e)) return t.call(r, e, o);
                            for (var u, s, l, c = [], p = (e.ignoreCase ? "i" : "") + (e.multiline ? "m" : "") + (e.unicode ? "u" : "") + (e.sticky ? "y" : ""), d = 0, y = new RegExp(e.source, p + "g");
                                (u = f.call(y, r)) && !((s = y.lastIndex) > d && (c.push(r.slice(d, u.index)), u.length > 1 && u.index < r.length && h.apply(c, u.slice(1)), l = u[0].length, d = s, c.length >= o));) y.lastIndex === u.index && y.lastIndex++;
                            return d === r.length ? !l && y.test("") || c.push("") : c.push(r.slice(d)), c.length > o ? c.slice(0, o) : c
                        } : "0".split(void 0, 0).length ? function(e, n) {
                            return void 0 === e && 0 === n ? [] : t.call(this, e, n)
                        } : t, [function(t, n) {
                            var i = a(this),
                                o = null == t ? void 0 : t[e];
                            return void 0 !== o ? o.call(t, i, n) : r.call(String(i), t, n)
                        }, function(e, i) {
                            var a = n(r, e, this, i, r !== t);
                            if (a.done) return a.value;
                            var f = o(e),
                                p = String(this),
                                h = u(f, RegExp),
                                g = f.unicode,
                                m = (f.ignoreCase ? "i" : "") + (f.multiline ? "m" : "") + (f.unicode ? "u" : "") + (y ? "y" : "g"),
                                b = new h(y ? f : "^(?:" + f.source + ")", m),
                                x = void 0 === i ? v : i >>> 0;
                            if (0 === x) return [];
                            if (0 === p.length) return null === c(b, p) ? [p] : [];
                            for (var w = 0, E = 0, k = []; E < p.length;) {
                                b.lastIndex = y ? E : 0;
                                var A, S = c(b, y ? p : p.slice(E));
                                if (null === S || (A = d(l(b.lastIndex + (y ? 0 : E)), p.length)) === w) E = s(p, E, g);
                                else {
                                    if (k.push(p.slice(w, E)), k.length === x) return k;
                                    for (var F = 1; F <= S.length - 1; F++)
                                        if (k.push(S[F]), k.length === x) return k;
                                    E = w = A
                                }
                            }
                            return k.push(p.slice(w)), k
                        }]
                    }), !y)
                },
                3210: function(e, t, n) {
                    "use strict";
                    var r = n(2109),
                        i = n(3111).trim;
                    r({
                        target: "String",
                        proto: !0,
                        forced: n(6091)("trim")
                    }, {
                        trim: function() {
                            return i(this)
                        }
                    })
                },
                2990: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(1048),
                        o = r.aTypedArray;
                    (0, r.exportTypedArrayMethod)("copyWithin", (function(e, t) {
                        return i.call(o(this), e, t, arguments.length > 2 ? arguments[2] : void 0)
                    }))
                },
                8927: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(2092).every,
                        o = r.aTypedArray;
                    (0, r.exportTypedArrayMethod)("every", (function(e) {
                        return i(o(this), e, arguments.length > 1 ? arguments[1] : void 0)
                    }))
                },
                3105: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(1285),
                        o = r.aTypedArray;
                    (0, r.exportTypedArrayMethod)("fill", (function(e) {
                        return i.apply(o(this), arguments)
                    }))
                },
                5035: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(2092).filter,
                        o = n(3074),
                        a = r.aTypedArray;
                    (0, r.exportTypedArrayMethod)("filter", (function(e) {
                        var t = i(a(this), e, arguments.length > 1 ? arguments[1] : void 0);
                        return o(this, t)
                    }))
                },
                7174: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(2092).findIndex,
                        o = r.aTypedArray;
                    (0, r.exportTypedArrayMethod)("findIndex", (function(e) {
                        return i(o(this), e, arguments.length > 1 ? arguments[1] : void 0)
                    }))
                },
                4345: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(2092).find,
                        o = r.aTypedArray;
                    (0, r.exportTypedArrayMethod)("find", (function(e) {
                        return i(o(this), e, arguments.length > 1 ? arguments[1] : void 0)
                    }))
                },
                2846: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(2092).forEach,
                        o = r.aTypedArray;
                    (0, r.exportTypedArrayMethod)("forEach", (function(e) {
                        i(o(this), e, arguments.length > 1 ? arguments[1] : void 0)
                    }))
                },
                4731: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(1318).includes,
                        o = r.aTypedArray;
                    (0, r.exportTypedArrayMethod)("includes", (function(e) {
                        return i(o(this), e, arguments.length > 1 ? arguments[1] : void 0)
                    }))
                },
                7209: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(1318).indexOf,
                        o = r.aTypedArray;
                    (0, r.exportTypedArrayMethod)("indexOf", (function(e) {
                        return i(o(this), e, arguments.length > 1 ? arguments[1] : void 0)
                    }))
                },
                6319: function(e, t, n) {
                    "use strict";
                    var r = n(7854),
                        i = n(260),
                        o = n(6992),
                        a = n(5112)("iterator"),
                        u = r.Uint8Array,
                        s = o.values,
                        l = o.keys,
                        c = o.entries,
                        f = i.aTypedArray,
                        p = i.exportTypedArrayMethod,
                        h = u && u.prototype[a],
                        d = !!h && ("values" == h.name || null == h.name),
                        v = function() {
                            return s.call(f(this))
                        };
                    p("entries", (function() {
                        return c.call(f(this))
                    })), p("keys", (function() {
                        return l.call(f(this))
                    })), p("values", v, !d), p(a, v, !d)
                },
                8867: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = r.aTypedArray,
                        o = r.exportTypedArrayMethod,
                        a = [].join;
                    o("join", (function(e) {
                        return a.apply(i(this), arguments)
                    }))
                },
                7789: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(6583),
                        o = r.aTypedArray;
                    (0, r.exportTypedArrayMethod)("lastIndexOf", (function(e) {
                        return i.apply(o(this), arguments)
                    }))
                },
                3739: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(2092).map,
                        o = n(6707),
                        a = r.aTypedArray,
                        u = r.aTypedArrayConstructor;
                    (0, r.exportTypedArrayMethod)("map", (function(e) {
                        return i(a(this), e, arguments.length > 1 ? arguments[1] : void 0, (function(e, t) {
                            return new(u(o(e, e.constructor)))(t)
                        }))
                    }))
                },
                4483: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(3671).right,
                        o = r.aTypedArray;
                    (0, r.exportTypedArrayMethod)("reduceRight", (function(e) {
                        return i(o(this), e, arguments.length, arguments.length > 1 ? arguments[1] : void 0)
                    }))
                },
                9368: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(3671).left,
                        o = r.aTypedArray;
                    (0, r.exportTypedArrayMethod)("reduce", (function(e) {
                        return i(o(this), e, arguments.length, arguments.length > 1 ? arguments[1] : void 0)
                    }))
                },
                2056: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = r.aTypedArray,
                        o = r.exportTypedArrayMethod,
                        a = Math.floor;
                    o("reverse", (function() {
                        for (var e, t = this, n = i(t).length, r = a(n / 2), o = 0; o < r;) e = t[o], t[o++] = t[--n], t[n] = e;
                        return t
                    }))
                },
                3462: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(7466),
                        o = n(4590),
                        a = n(7908),
                        u = n(7293),
                        s = r.aTypedArray;
                    (0, r.exportTypedArrayMethod)("set", (function(e) {
                        s(this);
                        var t = o(arguments.length > 1 ? arguments[1] : void 0, 1),
                            n = this.length,
                            r = a(e),
                            u = i(r.length),
                            l = 0;
                        if (u + t > n) throw RangeError("Wrong length");
                        for (; l < u;) this[t + l] = r[l++]
                    }), u((function() {
                        new Int8Array(1).set({})
                    })))
                },
                678: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(6707),
                        o = n(7293),
                        a = r.aTypedArray,
                        u = r.aTypedArrayConstructor,
                        s = r.exportTypedArrayMethod,
                        l = [].slice;
                    s("slice", (function(e, t) {
                        for (var n = l.call(a(this), e, t), r = i(this, this.constructor), o = 0, s = n.length, c = new(u(r))(s); s > o;) c[o] = n[o++];
                        return c
                    }), o((function() {
                        new Int8Array(1).slice()
                    })))
                },
                7462: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(2092).some,
                        o = r.aTypedArray;
                    (0, r.exportTypedArrayMethod)("some", (function(e) {
                        return i(o(this), e, arguments.length > 1 ? arguments[1] : void 0)
                    }))
                },
                3824: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = r.aTypedArray,
                        o = r.exportTypedArrayMethod,
                        a = [].sort;
                    o("sort", (function(e) {
                        return a.call(i(this), e)
                    }))
                },
                5021: function(e, t, n) {
                    "use strict";
                    var r = n(260),
                        i = n(7466),
                        o = n(1400),
                        a = n(6707),
                        u = r.aTypedArray;
                    (0, r.exportTypedArrayMethod)("subarray", (function(e, t) {
                        var n = u(this),
                            r = n.length,
                            s = o(e, r);
                        return new(a(n, n.constructor))(n.buffer, n.byteOffset + s * n.BYTES_PER_ELEMENT, i((void 0 === t ? r : o(t, r)) - s))
                    }))
                },
                2974: function(e, t, n) {
                    "use strict";
                    var r = n(7854),
                        i = n(260),
                        o = n(7293),
                        a = r.Int8Array,
                        u = i.aTypedArray,
                        s = i.exportTypedArrayMethod,
                        l = [].toLocaleString,
                        c = [].slice,
                        f = !!a && o((function() {
                            l.call(new a(1))
                        }));
                    s("toLocaleString", (function() {
                        return l.apply(f ? c.call(u(this)) : u(this), arguments)
                    }), o((function() {
                        return [1, 2].toLocaleString() != new a([1, 2]).toLocaleString()
                    })) || !o((function() {
                        a.prototype.toLocaleString.call([1, 2])
                    })))
                },
                5016: function(e, t, n) {
                    "use strict";
                    var r = n(260).exportTypedArrayMethod,
                        i = n(7293),
                        o = n(7854).Uint8Array,
                        a = o && o.prototype || {},
                        u = [].toString,
                        s = [].join;
                    i((function() {
                        u.call({})
                    })) && (u = function() {
                        return s.call(this)
                    });
                    var l = a.toString != u;
                    r("toString", u, l)
                },
                2472: function(e, t, n) {
                    n(9843)("Uint8", (function(e) {
                        return function(t, n, r) {
                            return e(this, t, n, r)
                        }
                    }))
                },
                4747: function(e, t, n) {
                    var r = n(7854),
                        i = n(8324),
                        o = n(8533),
                        a = n(8880);
                    for (var u in i) {
                        var s = r[u],
                            l = s && s.prototype;
                        if (l && l.forEach !== o) try {
                            a(l, "forEach", o)
                        } catch (e) {
                            l.forEach = o
                        }
                    }
                },
                3948: function(e, t, n) {
                    var r = n(7854),
                        i = n(8324),
                        o = n(6992),
                        a = n(8880),
                        u = n(5112),
                        s = u("iterator"),
                        l = u("toStringTag"),
                        c = o.values;
                    for (var f in i) {
                        var p = r[f],
                            h = p && p.prototype;
                        if (h) {
                            if (h[s] !== c) try {
                                a(h, s, c)
                            } catch (e) {
                                h[s] = c
                            }
                            if (h[l] || a(h, l, f), i[f])
                                for (var d in o)
                                    if (h[d] !== o[d]) try {
                                        a(h, d, o[d])
                                    } catch (e) {
                                        h[d] = o[d]
                                    }
                        }
                    }
                },
                1637: function(e, t, n) {
                    "use strict";
                    n(6992);
                    var r = n(2109),
                        i = n(5005),
                        o = n(590),
                        a = n(1320),
                        u = n(2248),
                        s = n(8003),
                        l = n(4994),
                        c = n(9909),
                        f = n(5787),
                        p = n(6656),
                        h = n(9974),
                        d = n(648),
                        v = n(9670),
                        y = n(111),
                        g = n(30),
                        m = n(9114),
                        b = n(8554),
                        x = n(1246),
                        w = n(5112),
                        E = i("fetch"),
                        k = i("Headers"),
                        A = w("iterator"),
                        S = "URLSearchParams",
                        F = "URLSearchParamsIterator",
                        T = c.set,
                        C = c.getterFor(S),
                        L = c.getterFor(F),
                        R = /\+/g,
                        I = Array(4),
                        U = function(e) {
                            return I[e - 1] || (I[e - 1] = RegExp("((?:%[\\da-f]{2}){" + e + "})", "gi"))
                        },
                        O = function(e) {
                            try {
                                return decodeURIComponent(e)
                            } catch (t) {
                                return e
                            }
                        },
                        _ = function(e) {
                            var t = e.replace(R, " "),
                                n = 4;
                            try {
                                return decodeURIComponent(t)
                            } catch (e) {
                                for (; n;) t = t.replace(U(n--), O);
                                return t
                            }
                        },
                        M = /[!'()~]|%20/g,
                        z = {
                            "!": "%21",
                            "'": "%27",
                            "(": "%28",
                            ")": "%29",
                            "~": "%7E",
                            "%20": "+"
                        },
                        P = function(e) {
                            return z[e]
                        },
                        j = function(e) {
                            return encodeURIComponent(e).replace(M, P)
                        },
                        D = function(e, t) {
                            if (t)
                                for (var n, r, i = t.split("&"), o = 0; o < i.length;)(n = i[o++]).length && (r = n.split("="), e.push({
                                    key: _(r.shift()),
                                    value: _(r.join("="))
                                }))
                        },
                        N = function(e) {
                            this.entries.length = 0, D(this.entries, e)
                        },
                        B = function(e, t) {
                            if (e < t) throw TypeError("Not enough arguments")
                        },
                        q = l((function(e, t) {
                            T(this, {
                                type: F,
                                iterator: b(C(e).entries),
                                kind: t
                            })
                        }), "Iterator", (function() {
                            var e = L(this),
                                t = e.kind,
                                n = e.iterator.next(),
                                r = n.value;
                            return n.done || (n.value = "keys" === t ? r.key : "values" === t ? r.value : [r.key, r.value]), n
                        })),
                        W = function() {
                            f(this, W, S);
                            var e, t, n, r, i, o, a, u, s, l = arguments.length > 0 ? arguments[0] : void 0,
                                c = this,
                                h = [];
                            if (T(c, {
                                    type: S,
                                    entries: h,
                                    updateURL: function() {},
                                    updateSearchParams: N
                                }), void 0 !== l)
                                if (y(l))
                                    if ("function" == typeof(e = x(l)))
                                        for (n = (t = e.call(l)).next; !(r = n.call(t)).done;) {
                                            if ((a = (o = (i = b(v(r.value))).next).call(i)).done || (u = o.call(i)).done || !o.call(i).done) throw TypeError("Expected sequence with length 2");
                                            h.push({
                                                key: a.value + "",
                                                value: u.value + ""
                                            })
                                        } else
                                            for (s in l) p(l, s) && h.push({
                                                key: s,
                                                value: l[s] + ""
                                            });
                                    else D(h, "string" == typeof l ? "?" === l.charAt(0) ? l.slice(1) : l : l + "")
                        },
                        H = W.prototype;
                    u(H, {
                        append: function(e, t) {
                            B(arguments.length, 2);
                            var n = C(this);
                            n.entries.push({
                                key: e + "",
                                value: t + ""
                            }), n.updateURL()
                        },
                        delete: function(e) {
                            B(arguments.length, 1);
                            for (var t = C(this), n = t.entries, r = e + "", i = 0; i < n.length;) n[i].key === r ? n.splice(i, 1) : i++;
                            t.updateURL()
                        },
                        get: function(e) {
                            B(arguments.length, 1);
                            for (var t = C(this).entries, n = e + "", r = 0; r < t.length; r++)
                                if (t[r].key === n) return t[r].value;
                            return null
                        },
                        getAll: function(e) {
                            B(arguments.length, 1);
                            for (var t = C(this).entries, n = e + "", r = [], i = 0; i < t.length; i++) t[i].key === n && r.push(t[i].value);
                            return r
                        },
                        has: function(e) {
                            B(arguments.length, 1);
                            for (var t = C(this).entries, n = e + "", r = 0; r < t.length;)
                                if (t[r++].key === n) return !0;
                            return !1
                        },
                        set: function(e, t) {
                            B(arguments.length, 1);
                            for (var n, r = C(this), i = r.entries, o = !1, a = e + "", u = t + "", s = 0; s < i.length; s++)(n = i[s]).key === a && (o ? i.splice(s--, 1) : (o = !0, n.value = u));
                            o || i.push({
                                key: a,
                                value: u
                            }), r.updateURL()
                        },
                        sort: function() {
                            var e, t, n, r = C(this),
                                i = r.entries,
                                o = i.slice();
                            for (i.length = 0, n = 0; n < o.length; n++) {
                                for (e = o[n], t = 0; t < n; t++)
                                    if (i[t].key > e.key) {
                                        i.splice(t, 0, e);
                                        break
                                    } t === n && i.push(e)
                            }
                            r.updateURL()
                        },
                        forEach: function(e) {
                            for (var t, n = C(this).entries, r = h(e, arguments.length > 1 ? arguments[1] : void 0, 3), i = 0; i < n.length;) r((t = n[i++]).value, t.key, this)
                        },
                        keys: function() {
                            return new q(this, "keys")
                        },
                        values: function() {
                            return new q(this, "values")
                        },
                        entries: function() {
                            return new q(this, "entries")
                        }
                    }, {
                        enumerable: !0
                    }), a(H, A, H.entries), a(H, "toString", (function() {
                        for (var e, t = C(this).entries, n = [], r = 0; r < t.length;) e = t[r++], n.push(j(e.key) + "=" + j(e.value));
                        return n.join("&")
                    }), {
                        enumerable: !0
                    }), s(W, S), r({
                        global: !0,
                        forced: !o
                    }, {
                        URLSearchParams: W
                    }), o || "function" != typeof E || "function" != typeof k || r({
                        global: !0,
                        enumerable: !0,
                        forced: !0
                    }, {
                        fetch: function(e) {
                            var t, n, r, i = [e];
                            return arguments.length > 1 && (y(t = arguments[1]) && (n = t.body, d(n) === S && ((r = t.headers ? new k(t.headers) : new k).has("content-type") || r.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"), t = g(t, {
                                body: m(0, String(n)),
                                headers: m(0, r)
                            }))), i.push(t)), E.apply(this, i)
                        }
                    }), e.exports = {
                        URLSearchParams: W,
                        getState: C
                    }
                },
                285: function(e, t, n) {
                    "use strict";
                    n(8783);
                    var r, i = n(2109),
                        o = n(9781),
                        a = n(590),
                        u = n(7854),
                        s = n(6048),
                        l = n(1320),
                        c = n(5787),
                        f = n(6656),
                        p = n(1574),
                        h = n(8457),
                        d = n(8710).codeAt,
                        v = n(3197),
                        y = n(8003),
                        g = n(1637),
                        m = n(9909),
                        b = u.URL,
                        x = g.URLSearchParams,
                        w = g.getState,
                        E = m.set,
                        k = m.getterFor("URL"),
                        A = Math.floor,
                        S = Math.pow,
                        F = "Invalid scheme",
                        T = "Invalid host",
                        C = "Invalid port",
                        L = /[A-Za-z]/,
                        R = /[\d+-.A-Za-z]/,
                        I = /\d/,
                        U = /^(0x|0X)/,
                        O = /^[0-7]+$/,
                        _ = /^\d+$/,
                        M = /^[\dA-Fa-f]+$/,
                        z = /[\u0000\t\u000A\u000D #%/:?@[\\]]/,
                        P = /[\u0000\t\u000A\u000D #/:?@[\\]]/,
                        j = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g,
                        D = /[\t\u000A\u000D]/g,
                        N = function(e, t) {
                            var n, r, i;
                            if ("[" == t.charAt(0)) {
                                if ("]" != t.charAt(t.length - 1)) return T;
                                if (!(n = q(t.slice(1, -1)))) return T;
                                e.host = n
                            } else if (X(e)) {
                                if (t = v(t), z.test(t)) return T;
                                if (null === (n = B(t))) return T;
                                e.host = n
                            } else {
                                if (P.test(t)) return T;
                                for (n = "", r = h(t), i = 0; i < r.length; i++) n += $(r[i], H);
                                e.host = n
                            }
                        },
                        B = function(e) {
                            var t, n, r, i, o, a, u, s = e.split(".");
                            if (s.length && "" == s[s.length - 1] && s.pop(), (t = s.length) > 4) return e;
                            for (n = [], r = 0; r < t; r++) {
                                if ("" == (i = s[r])) return e;
                                if (o = 10, i.length > 1 && "0" == i.charAt(0) && (o = U.test(i) ? 16 : 8, i = i.slice(8 == o ? 1 : 2)), "" === i) a = 0;
                                else {
                                    if (!(10 == o ? _ : 8 == o ? O : M).test(i)) return e;
                                    a = parseInt(i, o)
                                }
                                n.push(a)
                            }
                            for (r = 0; r < t; r++)
                                if (a = n[r], r == t - 1) {
                                    if (a >= S(256, 5 - t)) return null
                                } else if (a > 255) return null;
                            for (u = n.pop(), r = 0; r < n.length; r++) u += n[r] * S(256, 3 - r);
                            return u
                        },
                        q = function(e) {
                            var t, n, r, i, o, a, u, s = [0, 0, 0, 0, 0, 0, 0, 0],
                                l = 0,
                                c = null,
                                f = 0,
                                p = function() {
                                    return e.charAt(f)
                                };
                            if (":" == p()) {
                                if (":" != e.charAt(1)) return;
                                f += 2, c = ++l
                            }
                            for (; p();) {
                                if (8 == l) return;
                                if (":" != p()) {
                                    for (t = n = 0; n < 4 && M.test(p());) t = 16 * t + parseInt(p(), 16), f++, n++;
                                    if ("." == p()) {
                                        if (0 == n) return;
                                        if (f -= n, l > 6) return;
                                        for (r = 0; p();) {
                                            if (i = null, r > 0) {
                                                if (!("." == p() && r < 4)) return;
                                                f++
                                            }
                                            if (!I.test(p())) return;
                                            for (; I.test(p());) {
                                                if (o = parseInt(p(), 10), null === i) i = o;
                                                else {
                                                    if (0 == i) return;
                                                    i = 10 * i + o
                                                }
                                                if (i > 255) return;
                                                f++
                                            }
                                            s[l] = 256 * s[l] + i, 2 != ++r && 4 != r || l++
                                        }
                                        if (4 != r) return;
                                        break
                                    }
                                    if (":" == p()) {
                                        if (f++, !p()) return
                                    } else if (p()) return;
                                    s[l++] = t
                                } else {
                                    if (null !== c) return;
                                    f++, c = ++l
                                }
                            }
                            if (null !== c)
                                for (a = l - c, l = 7; 0 != l && a > 0;) u = s[l], s[l--] = s[c + a - 1], s[c + --a] = u;
                            else if (8 != l) return;
                            return s
                        },
                        W = function(e) {
                            var t, n, r, i;
                            if ("number" == typeof e) {
                                for (t = [], n = 0; n < 4; n++) t.unshift(e % 256), e = A(e / 256);
                                return t.join(".")
                            }
                            if ("object" == typeof e) {
                                for (t = "", r = function(e) {
                                        for (var t = null, n = 1, r = null, i = 0, o = 0; o < 8; o++) 0 !== e[o] ? (i > n && (t = r, n = i), r = null, i = 0) : (null === r && (r = o), ++i);
                                        return i > n && (t = r, n = i), t
                                    }(e), n = 0; n < 8; n++) i && 0 === e[n] || (i && (i = !1), r === n ? (t += n ? ":" : "::", i = !0) : (t += e[n].toString(16), n < 7 && (t += ":")));
                                return "[" + t + "]"
                            }
                            return e
                        },
                        H = {},
                        Y = p({}, H, {
                            " ": 1,
                            '"': 1,
                            "<": 1,
                            ">": 1,
                            "`": 1
                        }),
                        G = p({}, Y, {
                            "#": 1,
                            "?": 1,
                            "{": 1,
                            "}": 1
                        }),
                        Q = p({}, G, {
                            "/": 1,
                            ":": 1,
                            ";": 1,
                            "=": 1,
                            "@": 1,
                            "[": 1,
                            "\\": 1,
                            "]": 1,
                            "^": 1,
                            "|": 1
                        }),
                        $ = function(e, t) {
                            var n = d(e, 0);
                            return n > 32 && n < 127 && !f(t, e) ? e : encodeURIComponent(e)
                        },
                        V = {
                            ftp: 21,
                            file: null,
                            http: 80,
                            https: 443,
                            ws: 80,
                            wss: 443
                        },
                        X = function(e) {
                            return f(V, e.scheme)
                        },
                        K = function(e) {
                            return "" != e.username || "" != e.password
                        },
                        Z = function(e) {
                            return !e.host || e.cannotBeABaseURL || "file" == e.scheme
                        },
                        J = function(e, t) {
                            var n;
                            return 2 == e.length && L.test(e.charAt(0)) && (":" == (n = e.charAt(1)) || !t && "|" == n)
                        },
                        ee = function(e) {
                            var t;
                            return e.length > 1 && J(e.slice(0, 2)) && (2 == e.length || "/" === (t = e.charAt(2)) || "\\" === t || "?" === t || "#" === t)
                        },
                        te = function(e) {
                            var t = e.path,
                                n = t.length;
                            !n || "file" == e.scheme && 1 == n && J(t[0], !0) || t.pop()
                        },
                        ne = function(e) {
                            return "." === e || "%2e" === e.toLowerCase()
                        },
                        re = {},
                        ie = {},
                        oe = {},
                        ae = {},
                        ue = {},
                        se = {},
                        le = {},
                        ce = {},
                        fe = {},
                        pe = {},
                        he = {},
                        de = {},
                        ve = {},
                        ye = {},
                        ge = {},
                        me = {},
                        be = {},
                        xe = {},
                        we = {},
                        Ee = {},
                        ke = {},
                        Ae = function(e, t, n, i) {
                            var o, a, u, s, l, c = n || re,
                                p = 0,
                                d = "",
                                v = !1,
                                y = !1,
                                g = !1;
                            for (n || (e.scheme = "", e.username = "", e.password = "", e.host = null, e.port = null, e.path = [], e.query = null, e.fragment = null, e.cannotBeABaseURL = !1, t = t.replace(j, "")), t = t.replace(D, ""), o = h(t); p <= o.length;) {
                                switch (a = o[p], c) {
                                    case re:
                                        if (!a || !L.test(a)) {
                                            if (n) return F;
                                            c = oe;
                                            continue
                                        }
                                        d += a.toLowerCase(), c = ie;
                                        break;
                                    case ie:
                                        if (a && (R.test(a) || "+" == a || "-" == a || "." == a)) d += a.toLowerCase();
                                        else {
                                            if (":" != a) {
                                                if (n) return F;
                                                d = "", c = oe, p = 0;
                                                continue
                                            }
                                            if (n && (X(e) != f(V, d) || "file" == d && (K(e) || null !== e.port) || "file" == e.scheme && !e.host)) return;
                                            if (e.scheme = d, n) return void(X(e) && V[e.scheme] == e.port && (e.port = null));
                                            d = "", "file" == e.scheme ? c = ye : X(e) && i && i.scheme == e.scheme ? c = ae : X(e) ? c = ce : "/" == o[p + 1] ? (c = ue, p++) : (e.cannotBeABaseURL = !0, e.path.push(""), c = we)
                                        }
                                        break;
                                    case oe:
                                        if (!i || i.cannotBeABaseURL && "#" != a) return F;
                                        if (i.cannotBeABaseURL && "#" == a) {
                                            e.scheme = i.scheme, e.path = i.path.slice(), e.query = i.query, e.fragment = "", e.cannotBeABaseURL = !0, c = ke;
                                            break
                                        }
                                        c = "file" == i.scheme ? ye : se;
                                        continue;
                                    case ae:
                                        if ("/" != a || "/" != o[p + 1]) {
                                            c = se;
                                            continue
                                        }
                                        c = fe, p++;
                                        break;
                                    case ue:
                                        if ("/" == a) {
                                            c = pe;
                                            break
                                        }
                                        c = xe;
                                        continue;
                                    case se:
                                        if (e.scheme = i.scheme, a == r) e.username = i.username, e.password = i.password, e.host = i.host, e.port = i.port, e.path = i.path.slice(), e.query = i.query;
                                        else if ("/" == a || "\\" == a && X(e)) c = le;
                                        else if ("?" == a) e.username = i.username, e.password = i.password, e.host = i.host, e.port = i.port, e.path = i.path.slice(), e.query = "", c = Ee;
                                        else {
                                            if ("#" != a) {
                                                e.username = i.username, e.password = i.password, e.host = i.host, e.port = i.port, e.path = i.path.slice(), e.path.pop(), c = xe;
                                                continue
                                            }
                                            e.username = i.username, e.password = i.password, e.host = i.host, e.port = i.port, e.path = i.path.slice(), e.query = i.query, e.fragment = "", c = ke
                                        }
                                        break;
                                    case le:
                                        if (!X(e) || "/" != a && "\\" != a) {
                                            if ("/" != a) {
                                                e.username = i.username, e.password = i.password, e.host = i.host, e.port = i.port, c = xe;
                                                continue
                                            }
                                            c = pe
                                        } else c = fe;
                                        break;
                                    case ce:
                                        if (c = fe, "/" != a || "/" != d.charAt(p + 1)) continue;
                                        p++;
                                        break;
                                    case fe:
                                        if ("/" != a && "\\" != a) {
                                            c = pe;
                                            continue
                                        }
                                        break;
                                    case pe:
                                        if ("@" == a) {
                                            v && (d = "%40" + d), v = !0, u = h(d);
                                            for (var m = 0; m < u.length; m++) {
                                                var b = u[m];
                                                if (":" != b || g) {
                                                    var x = $(b, Q);
                                                    g ? e.password += x : e.username += x
                                                } else g = !0
                                            }
                                            d = ""
                                        } else if (a == r || "/" == a || "?" == a || "#" == a || "\\" == a && X(e)) {
                                            if (v && "" == d) return "Invalid authority";
                                            p -= h(d).length + 1, d = "", c = he
                                        } else d += a;
                                        break;
                                    case he:
                                    case de:
                                        if (n && "file" == e.scheme) {
                                            c = me;
                                            continue
                                        }
                                        if (":" != a || y) {
                                            if (a == r || "/" == a || "?" == a || "#" == a || "\\" == a && X(e)) {
                                                if (X(e) && "" == d) return T;
                                                if (n && "" == d && (K(e) || null !== e.port)) return;
                                                if (s = N(e, d)) return s;
                                                if (d = "", c = be, n) return;
                                                continue
                                            }
                                            "[" == a ? y = !0 : "]" == a && (y = !1), d += a
                                        } else {
                                            if ("" == d) return T;
                                            if (s = N(e, d)) return s;
                                            if (d = "", c = ve, n == de) return
                                        }
                                        break;
                                    case ve:
                                        if (!I.test(a)) {
                                            if (a == r || "/" == a || "?" == a || "#" == a || "\\" == a && X(e) || n) {
                                                if ("" != d) {
                                                    var w = parseInt(d, 10);
                                                    if (w > 65535) return C;
                                                    e.port = X(e) && w === V[e.scheme] ? null : w, d = ""
                                                }
                                                if (n) return;
                                                c = be;
                                                continue
                                            }
                                            return C
                                        }
                                        d += a;
                                        break;
                                    case ye:
                                        if (e.scheme = "file", "/" == a || "\\" == a) c = ge;
                                        else {
                                            if (!i || "file" != i.scheme) {
                                                c = xe;
                                                continue
                                            }
                                            if (a == r) e.host = i.host, e.path = i.path.slice(), e.query = i.query;
                                            else if ("?" == a) e.host = i.host, e.path = i.path.slice(), e.query = "", c = Ee;
                                            else {
                                                if ("#" != a) {
                                                    ee(o.slice(p).join("")) || (e.host = i.host, e.path = i.path.slice(), te(e)), c = xe;
                                                    continue
                                                }
                                                e.host = i.host, e.path = i.path.slice(), e.query = i.query, e.fragment = "", c = ke
                                            }
                                        }
                                        break;
                                    case ge:
                                        if ("/" == a || "\\" == a) {
                                            c = me;
                                            break
                                        }
                                        i && "file" == i.scheme && !ee(o.slice(p).join("")) && (J(i.path[0], !0) ? e.path.push(i.path[0]) : e.host = i.host), c = xe;
                                        continue;
                                    case me:
                                        if (a == r || "/" == a || "\\" == a || "?" == a || "#" == a) {
                                            if (!n && J(d)) c = xe;
                                            else if ("" == d) {
                                                if (e.host = "", n) return;
                                                c = be
                                            } else {
                                                if (s = N(e, d)) return s;
                                                if ("localhost" == e.host && (e.host = ""), n) return;
                                                d = "", c = be
                                            }
                                            continue
                                        }
                                        d += a;
                                        break;
                                    case be:
                                        if (X(e)) {
                                            if (c = xe, "/" != a && "\\" != a) continue
                                        } else if (n || "?" != a)
                                            if (n || "#" != a) {
                                                if (a != r && (c = xe, "/" != a)) continue
                                            } else e.fragment = "", c = ke;
                                        else e.query = "", c = Ee;
                                        break;
                                    case xe:
                                        if (a == r || "/" == a || "\\" == a && X(e) || !n && ("?" == a || "#" == a)) {
                                            if (".." === (l = (l = d).toLowerCase()) || "%2e." === l || ".%2e" === l || "%2e%2e" === l ? (te(e), "/" == a || "\\" == a && X(e) || e.path.push("")) : ne(d) ? "/" == a || "\\" == a && X(e) || e.path.push("") : ("file" == e.scheme && !e.path.length && J(d) && (e.host && (e.host = ""), d = d.charAt(0) + ":"), e.path.push(d)), d = "", "file" == e.scheme && (a == r || "?" == a || "#" == a))
                                                for (; e.path.length > 1 && "" === e.path[0];) e.path.shift();
                                            "?" == a ? (e.query = "", c = Ee) : "#" == a && (e.fragment = "", c = ke)
                                        } else d += $(a, G);
                                        break;
                                    case we:
                                        "?" == a ? (e.query = "", c = Ee) : "#" == a ? (e.fragment = "", c = ke) : a != r && (e.path[0] += $(a, H));
                                        break;
                                    case Ee:
                                        n || "#" != a ? a != r && ("'" == a && X(e) ? e.query += "%27" : e.query += "#" == a ? "%23" : $(a, H)) : (e.fragment = "", c = ke);
                                        break;
                                    case ke:
                                        a != r && (e.fragment += $(a, Y))
                                }
                                p++
                            }
                        },
                        Se = function(e) {
                            var t, n, r = c(this, Se, "URL"),
                                i = arguments.length > 1 ? arguments[1] : void 0,
                                a = String(e),
                                u = E(r, {
                                    type: "URL"
                                });
                            if (void 0 !== i)
                                if (i instanceof Se) t = k(i);
                                else if (n = Ae(t = {}, String(i))) throw TypeError(n);
                            if (n = Ae(u, a, null, t)) throw TypeError(n);
                            var s = u.searchParams = new x,
                                l = w(s);
                            l.updateSearchParams(u.query), l.updateURL = function() {
                                u.query = String(s) || null
                            }, o || (r.href = Te.call(r), r.origin = Ce.call(r), r.protocol = Le.call(r), r.username = Re.call(r), r.password = Ie.call(r), r.host = Ue.call(r), r.hostname = Oe.call(r), r.port = _e.call(r), r.pathname = Me.call(r), r.search = ze.call(r), r.searchParams = Pe.call(r), r.hash = je.call(r))
                        },
                        Fe = Se.prototype,
                        Te = function() {
                            var e = k(this),
                                t = e.scheme,
                                n = e.username,
                                r = e.password,
                                i = e.host,
                                o = e.port,
                                a = e.path,
                                u = e.query,
                                s = e.fragment,
                                l = t + ":";
                            return null !== i ? (l += "//", K(e) && (l += n + (r ? ":" + r : "") + "@"), l += W(i), null !== o && (l += ":" + o)) : "file" == t && (l += "//"), l += e.cannotBeABaseURL ? a[0] : a.length ? "/" + a.join("/") : "", null !== u && (l += "?" + u), null !== s && (l += "#" + s), l
                        },
                        Ce = function() {
                            var e = k(this),
                                t = e.scheme,
                                n = e.port;
                            if ("blob" == t) try {
                                return new URL(t.path[0]).origin
                            } catch (e) {
                                return "null"
                            }
                            return "file" != t && X(e) ? t + "://" + W(e.host) + (null !== n ? ":" + n : "") : "null"
                        },
                        Le = function() {
                            return k(this).scheme + ":"
                        },
                        Re = function() {
                            return k(this).username
                        },
                        Ie = function() {
                            return k(this).password
                        },
                        Ue = function() {
                            var e = k(this),
                                t = e.host,
                                n = e.port;
                            return null === t ? "" : null === n ? W(t) : W(t) + ":" + n
                        },
                        Oe = function() {
                            var e = k(this).host;
                            return null === e ? "" : W(e)
                        },
                        _e = function() {
                            var e = k(this).port;
                            return null === e ? "" : String(e)
                        },
                        Me = function() {
                            var e = k(this),
                                t = e.path;
                            return e.cannotBeABaseURL ? t[0] : t.length ? "/" + t.join("/") : ""
                        },
                        ze = function() {
                            var e = k(this).query;
                            return e ? "?" + e : ""
                        },
                        Pe = function() {
                            return k(this).searchParams
                        },
                        je = function() {
                            var e = k(this).fragment;
                            return e ? "#" + e : ""
                        },
                        De = function(e, t) {
                            return {
                                get: e,
                                set: t,
                                configurable: !0,
                                enumerable: !0
                            }
                        };
                    if (o && s(Fe, {
                            href: De(Te, (function(e) {
                                var t = k(this),
                                    n = String(e),
                                    r = Ae(t, n);
                                if (r) throw TypeError(r);
                                w(t.searchParams).updateSearchParams(t.query)
                            })),
                            origin: De(Ce),
                            protocol: De(Le, (function(e) {
                                var t = k(this);
                                Ae(t, String(e) + ":", re)
                            })),
                            username: De(Re, (function(e) {
                                var t = k(this),
                                    n = h(String(e));
                                if (!Z(t)) {
                                    t.username = "";
                                    for (var r = 0; r < n.length; r++) t.username += $(n[r], Q)
                                }
                            })),
                            password: De(Ie, (function(e) {
                                var t = k(this),
                                    n = h(String(e));
                                if (!Z(t)) {
                                    t.password = "";
                                    for (var r = 0; r < n.length; r++) t.password += $(n[r], Q)
                                }
                            })),
                            host: De(Ue, (function(e) {
                                var t = k(this);
                                t.cannotBeABaseURL || Ae(t, String(e), he)
                            })),
                            hostname: De(Oe, (function(e) {
                                var t = k(this);
                                t.cannotBeABaseURL || Ae(t, String(e), de)
                            })),
                            port: De(_e, (function(e) {
                                var t = k(this);
                                Z(t) || ("" == (e = String(e)) ? t.port = null : Ae(t, e, ve))
                            })),
                            pathname: De(Me, (function(e) {
                                var t = k(this);
                                t.cannotBeABaseURL || (t.path = [], Ae(t, e + "", be))
                            })),
                            search: De(ze, (function(e) {
                                var t = k(this);
                                "" == (e = String(e)) ? t.query = null: ("?" == e.charAt(0) && (e = e.slice(1)), t.query = "", Ae(t, e, Ee)), w(t.searchParams).updateSearchParams(t.query)
                            })),
                            searchParams: De(Pe),
                            hash: De(je, (function(e) {
                                var t = k(this);
                                "" != (e = String(e)) ? ("#" == e.charAt(0) && (e = e.slice(1)), t.fragment = "", Ae(t, e, ke)) : t.fragment = null
                            }))
                        }), l(Fe, "toJSON", (function() {
                            return Te.call(this)
                        }), {
                            enumerable: !0
                        }), l(Fe, "toString", (function() {
                            return Te.call(this)
                        }), {
                            enumerable: !0
                        }), b) {
                        var Ne = b.createObjectURL,
                            Be = b.revokeObjectURL;
                        Ne && l(Se, "createObjectURL", (function(e) {
                            return Ne.apply(b, arguments)
                        })), Be && l(Se, "revokeObjectURL", (function(e) {
                            return Be.apply(b, arguments)
                        }))
                    }
                    y(Se, "URL"), i({
                        global: !0,
                        forced: !a,
                        sham: !o
                    }, {
                        URL: Se
                    })
                }
            },
            t = {};

        function n(r) {
            if (t[r]) return t[r].exports;
            var i = t[r] = {
                exports: {}
            };
            return e[r](i, i.exports, n), i.exports
        }
        n.d = function(e, t) {
            for (var r in t) n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, {
                enumerable: !0,
                get: t[r]
            })
        }, n.g = function() {
            if ("object" == typeof globalThis) return globalThis;
            try {
                return this || new Function("return this")()
            } catch (e) {
                if ("object" == typeof window) return window
            }
        }(), n.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, n.r = function(e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(e, "__esModule", {
                value: !0
            })
        };
        var r = {};
        return function() {
            "use strict";

            function e(e, n) {
                var r;
                if ("undefined" == typeof Symbol || null == e[Symbol.iterator]) {
                    if (Array.isArray(e) || (r = function(e, n) {
                            if (e) {
                                if ("string" == typeof e) return t(e, n);
                                var r = Object.prototype.toString.call(e).slice(8, -1);
                                return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? t(e, n) : void 0
                            }
                        }(e)) || n && e && "number" == typeof e.length) {
                        r && (e = r);
                        var i = 0,
                            o = function() {};
                        return {
                            s: o,
                            n: function() {
                                return i >= e.length ? {
                                    done: !0
                                } : {
                                    done: !1,
                                    value: e[i++]
                                }
                            },
                            e: function(e) {
                                throw e
                            },
                            f: o
                        }
                    }
                    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }
                var a, u = !0,
                    s = !1;
                return {
                    s: function() {
                        r = e[Symbol.iterator]()
                    },
                    n: function() {
                        var e = r.next();
                        return u = e.done, e
                    },
                    e: function(e) {
                        s = !0, a = e
                    },
                    f: function() {
                        try {
                            u || null == r.return || r.return()
                        } finally {
                            if (s) throw a
                        }
                    }
                }
            }

            function t(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r
            }

            function i(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }
            n.r(r), n.d(r, {
                Dropzone: function() {
                    return b
                },
                default: function() {
                    return A
                }
            }), n(2222), n(7327), n(2772), n(6992), n(1249), n(7042), n(561), n(8264), n(8309), n(489), n(1539), n(4916), n(9714), n(8783), n(4723), n(5306), n(3123), n(3210), n(2472), n(2990), n(8927), n(3105), n(5035), n(4345), n(7174), n(2846), n(4731), n(7209), n(6319), n(8867), n(7789), n(3739), n(9368), n(4483), n(2056), n(3462), n(678), n(7462), n(3824), n(5021), n(2974), n(5016), n(4747), n(3948), n(285);
            var o = function() {
                function t() {
                    ! function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, t)
                }
                var n, r;
                return n = t, (r = [{
                    key: "on",
                    value: function(e, t) {
                        return this._callbacks = this._callbacks || {}, this._callbacks[e] || (this._callbacks[e] = []), this._callbacks[e].push(t), this
                    }
                }, {
                    key: "emit",
                    value: function(t) {
                        this._callbacks = this._callbacks || {};
                        for (var n = this._callbacks[t], r = arguments.length, i = new Array(r > 1 ? r - 1 : 0), o = 1; o < r; o++) i[o - 1] = arguments[o];
                        if (n) {
                            var a, u = e(n, !0);
                            try {
                                for (u.s(); !(a = u.n()).done;) {
                                    var s = a.value;
                                    s.apply(this, i)
                                }
                            } catch (e) {
                                u.e(e)
                            } finally {
                                u.f()
                            }
                        }
                        return this.element && this.element.dispatchEvent(this.makeEvent("dropzone:" + t, {
                            args: i
                        })), this
                    }
                }, {
                    key: "makeEvent",
                    value: function(e, t) {
                        var n = {
                            bubbles: !0,
                            cancelable: !0,
                            detail: t
                        };
                        if ("function" == typeof window.CustomEvent) return new CustomEvent(e, n);
                        var r = document.createEvent("CustomEvent");
                        return r.initCustomEvent(e, n.bubbles, n.cancelable, n.detail), r
                    }
                }, {
                    key: "off",
                    value: function(e, t) {
                        if (!this._callbacks || 0 === arguments.length) return this._callbacks = {}, this;
                        var n = this._callbacks[e];
                        if (!n) return this;
                        if (1 === arguments.length) return delete this._callbacks[e], this;
                        for (var r = 0; r < n.length; r++) {
                            var i = n[r];
                            if (i === t) {
                                n.splice(r, 1);
                                break
                            }
                        }
                        return this
                    }
                }]) && i(n.prototype, r), t
            }();

            function a(e, t) {
                var n;
                if ("undefined" == typeof Symbol || null == e[Symbol.iterator]) {
                    if (Array.isArray(e) || (n = function(e, t) {
                            if (e) {
                                if ("string" == typeof e) return u(e, t);
                                var n = Object.prototype.toString.call(e).slice(8, -1);
                                return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? u(e, t) : void 0
                            }
                        }(e)) || t && e && "number" == typeof e.length) {
                        n && (e = n);
                        var r = 0,
                            i = function() {};
                        return {
                            s: i,
                            n: function() {
                                return r >= e.length ? {
                                    done: !0
                                } : {
                                    done: !1,
                                    value: e[r++]
                                }
                            },
                            e: function(e) {
                                throw e
                            },
                            f: i
                        }
                    }
                    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }
                var o, a = !0,
                    s = !1;
                return {
                    s: function() {
                        n = e[Symbol.iterator]()
                    },
                    n: function() {
                        var e = n.next();
                        return a = e.done, e
                    },
                    e: function(e) {
                        s = !0, o = e
                    },
                    f: function() {
                        try {
                            a || null == n.return || n.return()
                        } finally {
                            if (s) throw o
                        }
                    }
                }
            }

            function u(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r
            }
            var s = {
                url: null,
                method: "post",
                withCredentials: !1,
                timeout: null,
                parallelUploads: 2,
                uploadMultiple: !1,
                chunking: !1,
                forceChunking: !1,
                chunkSize: 2e6,
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
                resizeQuality: .8,
                resizeMethod: "contain",
                filesizeBase: 1e3,
                maxFiles: null,
                headers: null,
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
                params: function(e, t, n) {
                    if (n) return {
                        dzuuid: n.file.upload.uuid,
                        dzchunkindex: n.index,
                        dztotalfilesize: n.file.size,
                        dzchunksize: this.options.chunkSize,
                        dztotalchunkcount: n.file.upload.totalChunkCount,
                        dzchunkbyteoffset: n.index * this.options.chunkSize
                    }
                },
                accept: function(e, t) {
                    return t()
                },
                chunksUploaded: function(e, t) {
                    t()
                },
                fallback: function() {
                    var e;
                    this.element.className = "".concat(this.element.className, " dz-browser-not-supported");
                    var t, n = a(this.element.getElementsByTagName("div"), !0);
                    try {
                        for (n.s(); !(t = n.n()).done;) {
                            var r = t.value;
                            if (/(^| )dz-message($| )/.test(r.className)) {
                                e = r, r.className = "dz-message";
                                break
                            }
                        }
                    } catch (e) {
                        n.e(e)
                    } finally {
                        n.f()
                    }
                    e || (e = b.createElement('<div class="dz-message"><span></span></div>'), this.element.appendChild(e));
                    var i = e.getElementsByTagName("span")[0];
                    return i && (null != i.textContent ? i.textContent = this.options.dictFallbackMessage : null != i.innerText && (i.innerText = this.options.dictFallbackMessage)), this.element.appendChild(this.getFallbackForm())
                },
                resize: function(e, t, n, r) {
                    var i = {
                            srcX: 0,
                            srcY: 0,
                            srcWidth: e.width,
                            srcHeight: e.height
                        },
                        o = e.width / e.height;
                    null == t && null == n ? (t = i.srcWidth, n = i.srcHeight) : null == t ? t = n * o : null == n && (n = t / o);
                    var a = (t = Math.min(t, i.srcWidth)) / (n = Math.min(n, i.srcHeight));
                    if (i.srcWidth > t || i.srcHeight > n)
                        if ("crop" === r) o > a ? (i.srcHeight = e.height, i.srcWidth = i.srcHeight * a) : (i.srcWidth = e.width, i.srcHeight = i.srcWidth / a);
                        else {
                            if ("contain" !== r) throw new Error("Unknown resizeMethod '".concat(r, "'"));
                            o > a ? n = t / o : t = n * o
                        } return i.srcX = (e.width - i.srcWidth) / 2, i.srcY = (e.height - i.srcHeight) / 2, i.trgWidth = t, i.trgHeight = n, i
                },
                transformFile: function(e, t) {
                    return (this.options.resizeWidth || this.options.resizeHeight) && e.type.match(/image.*/) ? this.resizeImage(e, this.options.resizeWidth, this.options.resizeHeight, this.options.resizeMethod, t) : t(e)
                },
                previewTemplate: '<div class="dz-preview dz-file-preview"> <div class="dz-image"><img data-dz-thumbnail/></div> <div class="dz-details"> <div class="dz-size"><span data-dz-size></span></div> <div class="dz-filename"><span data-dz-name></span></div> </div> <div class="dz-progress"> <span class="dz-upload" data-dz-uploadprogress></span> </div> <div class="dz-error-message"><span data-dz-errormessage></span></div> <div class="dz-success-mark"> <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <title>Check</title> <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF"></path> </g> </svg> </div> <div class="dz-error-mark"> <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <title>Error</title> <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475"> <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z"></path> </g> </g> </svg> </div> </div> ',
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
                    var t = this;
                    if (this.element === this.previewsContainer && this.element.classList.add("dz-started"), this.previewsContainer && !this.options.disablePreviews) {
                        e.previewElement = b.createElement(this.options.previewTemplate.trim()), e.previewTemplate = e.previewElement, this.previewsContainer.appendChild(e.previewElement);
                        var n, r = a(e.previewElement.querySelectorAll("[data-dz-name]"), !0);
                        try {
                            for (r.s(); !(n = r.n()).done;) {
                                var i = n.value;
                                i.textContent = e.name
                            }
                        } catch (e) {
                            r.e(e)
                        } finally {
                            r.f()
                        }
                        var o, u = a(e.previewElement.querySelectorAll("[data-dz-size]"), !0);
                        try {
                            for (u.s(); !(o = u.n()).done;)(i = o.value).innerHTML = this.filesize(e.size)
                        } catch (e) {
                            u.e(e)
                        } finally {
                            u.f()
                        }
                        this.options.addRemoveLinks && (e._removeLink = b.createElement('<a class="dz-remove" href="javascript:undefined;" data-dz-remove>'.concat(this.options.dictRemoveFile, "</a>")), e.previewElement.appendChild(e._removeLink));
                        var s, l = function(n) {
                                return n.preventDefault(), n.stopPropagation(), e.status === b.UPLOADING ? b.confirm(t.options.dictCancelUploadConfirmation, (function() {
                                    return t.removeFile(e)
                                })) : t.options.dictRemoveFileConfirmation ? b.confirm(t.options.dictRemoveFileConfirmation, (function() {
                                    return t.removeFile(e)
                                })) : t.removeFile(e)
                            },
                            c = a(e.previewElement.querySelectorAll("[data-dz-remove]"), !0);
                        try {
                            for (c.s(); !(s = c.n()).done;) s.value.addEventListener("click", l)
                        } catch (e) {
                            c.e(e)
                        } finally {
                            c.f()
                        }
                    }
                },
                removedfile: function(e) {
                    return null != e.previewElement && null != e.previewElement.parentNode && e.previewElement.parentNode.removeChild(e.previewElement), this._updateMaxFilesReachedClass()
                },
                thumbnail: function(e, t) {
                    if (e.previewElement) {
                        e.previewElement.classList.remove("dz-file-preview");
                        var n, r = a(e.previewElement.querySelectorAll("[data-dz-thumbnail]"), !0);
                        try {
                            for (r.s(); !(n = r.n()).done;) {
                                var i = n.value;
                                i.alt = e.name, i.src = t
                            }
                        } catch (e) {
                            r.e(e)
                        } finally {
                            r.f()
                        }
                        return setTimeout((function() {
                            return e.previewElement.classList.add("dz-image-preview")
                        }), 1)
                    }
                },
                error: function(e, t) {
                    if (e.previewElement) {
                        e.previewElement.classList.add("dz-error"), "string" != typeof t && t.error && (t = t.error);
                        var n, r = a(e.previewElement.querySelectorAll("[data-dz-errormessage]"), !0);
                        try {
                            for (r.s(); !(n = r.n()).done;) n.value.textContent = t
                        } catch (e) {
                            r.e(e)
                        } finally {
                            r.f()
                        }
                    }
                },
                errormultiple: function() {},
                processing: function(e) {
                    if (e.previewElement && (e.previewElement.classList.add("dz-processing"), e._removeLink)) return e._removeLink.innerHTML = this.options.dictCancelUpload
                },
                processingmultiple: function() {},
                uploadprogress: function(e, t, n) {
                    if (e.previewElement) {
                        var r, i = a(e.previewElement.querySelectorAll("[data-dz-uploadprogress]"), !0);
                        try {
                            for (i.s(); !(r = i.n()).done;) {
                                var o = r.value;
                                "PROGRESS" === o.nodeName ? o.value = t : o.style.width = "".concat(t, "%")
                            }
                        } catch (e) {
                            i.e(e)
                        } finally {
                            i.f()
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
            };

            function l(e) {
                return (l = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
            }

            function c(e, t) {
                var n;
                if ("undefined" == typeof Symbol || null == e[Symbol.iterator]) {
                    if (Array.isArray(e) || (n = function(e, t) {
                            if (e) {
                                if ("string" == typeof e) return f(e, t);
                                var n = Object.prototype.toString.call(e).slice(8, -1);
                                return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? f(e, t) : void 0
                            }
                        }(e)) || t && e && "number" == typeof e.length) {
                        n && (e = n);
                        var r = 0,
                            i = function() {};
                        return {
                            s: i,
                            n: function() {
                                return r >= e.length ? {
                                    done: !0
                                } : {
                                    done: !1,
                                    value: e[r++]
                                }
                            },
                            e: function(e) {
                                throw e
                            },
                            f: i
                        }
                    }
                    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }
                var o, a = !0,
                    u = !1;
                return {
                    s: function() {
                        n = e[Symbol.iterator]()
                    },
                    n: function() {
                        var e = n.next();
                        return a = e.done, e
                    },
                    e: function(e) {
                        u = !0, o = e
                    },
                    f: function() {
                        try {
                            a || null == n.return || n.return()
                        } finally {
                            if (u) throw o
                        }
                    }
                }
            }

            function f(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r
            }

            function p(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function h(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }

            function d(e, t, n) {
                return t && h(e.prototype, t), n && h(e, n), e
            }

            function v(e, t) {
                return (v = Object.setPrototypeOf || function(e, t) {
                    return e.__proto__ = t, e
                })(e, t)
            }

            function y(e, t) {
                return !t || "object" !== l(t) && "function" != typeof t ? g(e) : t
            }

            function g(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }

            function m(e) {
                return (m = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                    return e.__proto__ || Object.getPrototypeOf(e)
                })(e)
            }
            var b = function(e) {
                ! function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && v(e, t)
                }(i, e);
                var t, n, r = (t = i, n = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}))), !0
                    } catch (e) {
                        return !1
                    }
                }(), function() {
                    var e, r = m(t);
                    if (n) {
                        var i = m(this).constructor;
                        e = Reflect.construct(r, arguments, i)
                    } else e = r.apply(this, arguments);
                    return y(this, e)
                });

                function i(e, t) {
                    var n, o, a;
                    if (p(this, i), (n = r.call(this)).element = e, n.version = i.version, n.clickableElements = [], n.listeners = [], n.files = [], "string" == typeof n.element && (n.element = document.querySelector(n.element)), !n.element || null == n.element.nodeType) throw new Error("Invalid dropzone element.");
                    if (n.element.dropzone) throw new Error("Dropzone already attached.");
                    i.instances.push(g(n)), n.element.dropzone = g(n);
                    var u = null != (a = i.optionsForElement(n.element)) ? a : {};
                    if (n.options = i.extend({}, s, u, null != t ? t : {}), n.options.previewTemplate = n.options.previewTemplate.replace(/\n*/g, ""), n.options.forceFallback || !i.isBrowserSupported()) return y(n, n.options.fallback.call(g(n)));
                    if (null == n.options.url && (n.options.url = n.element.getAttribute("action")), !n.options.url) throw new Error("No URL provided.");
                    if (n.options.acceptedFiles && n.options.acceptedMimeTypes) throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
                    if (n.options.uploadMultiple && n.options.chunking) throw new Error("You cannot set both: uploadMultiple and chunking.");
                    return n.options.acceptedMimeTypes && (n.options.acceptedFiles = n.options.acceptedMimeTypes, delete n.options.acceptedMimeTypes), null != n.options.renameFilename && (n.options.renameFile = function(e) {
                        return n.options.renameFilename.call(g(n), e.name, e)
                    }), "string" == typeof n.options.method && (n.options.method = n.options.method.toUpperCase()), (o = n.getExistingFallback()) && o.parentNode && o.parentNode.removeChild(o), !1 !== n.options.previewsContainer && (n.options.previewsContainer ? n.previewsContainer = i.getElement(n.options.previewsContainer, "previewsContainer") : n.previewsContainer = n.element), n.options.clickable && (!0 === n.options.clickable ? n.clickableElements = [n.element] : n.clickableElements = i.getElements(n.options.clickable, "clickable")), n.init(), n
                }
                return d(i, [{
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
                        return this.getFilesWithStatus(i.QUEUED)
                    }
                }, {
                    key: "getUploadingFiles",
                    value: function() {
                        return this.getFilesWithStatus(i.UPLOADING)
                    }
                }, {
                    key: "getAddedFiles",
                    value: function() {
                        return this.getFilesWithStatus(i.ADDED)
                    }
                }, {
                    key: "getActiveFiles",
                    value: function() {
                        return this.files.filter((function(e) {
                            return e.status === i.UPLOADING || e.status === i.QUEUED
                        })).map((function(e) {
                            return e
                        }))
                    }
                }, {
                    key: "init",
                    value: function() {
                        var e = this;
                        "form" === this.element.tagName && this.element.setAttribute("enctype", "multipart/form-data"), this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message") && this.element.appendChild(i.createElement('<div class="dz-default dz-message"><button class="dz-button" type="button">'.concat(this.options.dictDefaultMessage, "</button></div>"))), this.clickableElements.length && function t() {
                            e.hiddenFileInput && e.hiddenFileInput.parentNode.removeChild(e.hiddenFileInput), e.hiddenFileInput = document.createElement("input"), e.hiddenFileInput.setAttribute("type", "file"), (null === e.options.maxFiles || e.options.maxFiles > 1) && e.hiddenFileInput.setAttribute("multiple", "multiple"), e.hiddenFileInput.className = "dz-hidden-input", null !== e.options.acceptedFiles && e.hiddenFileInput.setAttribute("accept", e.options.acceptedFiles), null !== e.options.capture && e.hiddenFileInput.setAttribute("capture", e.options.capture), e.hiddenFileInput.setAttribute("tabindex", "-1"), e.hiddenFileInput.style.visibility = "hidden", e.hiddenFileInput.style.position = "absolute", e.hiddenFileInput.style.top = "0", e.hiddenFileInput.style.left = "0", e.hiddenFileInput.style.height = "0", e.hiddenFileInput.style.width = "0", i.getElement(e.options.hiddenInputContainer, "hiddenInputContainer").appendChild(e.hiddenFileInput), e.hiddenFileInput.addEventListener("change", (function() {
                                var n = e.hiddenFileInput.files;
                                if (n.length) {
                                    var r, i = c(n, !0);
                                    try {
                                        for (i.s(); !(r = i.n()).done;) {
                                            var o = r.value;
                                            e.addFile(o)
                                        }
                                    } catch (e) {
                                        i.e(e)
                                    } finally {
                                        i.f()
                                    }
                                }
                                e.emit("addedfiles", n), t()
                            }))
                        }(), this.URL = null !== window.URL ? window.URL : window.webkitURL;
                        var t, n = c(this.events, !0);
                        try {
                            for (n.s(); !(t = n.n()).done;) {
                                var r = t.value;
                                this.on(r, this.options[r])
                            }
                        } catch (e) {
                            n.e(e)
                        } finally {
                            n.f()
                        }
                        this.on("uploadprogress", (function() {
                            return e.updateTotalUploadProgress()
                        })), this.on("removedfile", (function() {
                            return e.updateTotalUploadProgress()
                        })), this.on("canceled", (function(t) {
                            return e.emit("complete", t)
                        })), this.on("complete", (function(t) {
                            if (0 === e.getAddedFiles().length && 0 === e.getUploadingFiles().length && 0 === e.getQueuedFiles().length) return setTimeout((function() {
                                return e.emit("queuecomplete")
                            }), 0)
                        }));
                        var o = function(e) {
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
                                dragstart: function(t) {
                                    return e.emit("dragstart", t)
                                },
                                dragenter: function(t) {
                                    return o(t), e.emit("dragenter", t)
                                },
                                dragover: function(t) {
                                    var n;
                                    try {
                                        n = t.dataTransfer.effectAllowed
                                    } catch (e) {}
                                    return t.dataTransfer.dropEffect = "move" === n || "linkMove" === n ? "move" : "copy", o(t), e.emit("dragover", t)
                                },
                                dragleave: function(t) {
                                    return e.emit("dragleave", t)
                                },
                                drop: function(t) {
                                    return o(t), e.drop(t)
                                },
                                dragend: function(t) {
                                    return e.emit("dragend", t)
                                }
                            }
                        }], this.clickableElements.forEach((function(t) {
                            return e.listeners.push({
                                element: t,
                                events: {
                                    click: function(n) {
                                        return (t !== e.element || n.target === e.element || i.elementInside(n.target, e.element.querySelector(".dz-message"))) && e.hiddenFileInput.click(), !0
                                    }
                                }
                            })
                        })), this.enable(), this.options.init.call(this)
                    }
                }, {
                    key: "destroy",
                    value: function() {
                        return this.disable(), this.removeAllFiles(!0), (null != this.hiddenFileInput ? this.hiddenFileInput.parentNode : void 0) && (this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput), this.hiddenFileInput = null), delete this.element.dropzone, i.instances.splice(i.instances.indexOf(this), 1)
                    }
                }, {
                    key: "updateTotalUploadProgress",
                    value: function() {
                        var e, t = 0,
                            n = 0;
                        if (this.getActiveFiles().length) {
                            var r, i = c(this.getActiveFiles(), !0);
                            try {
                                for (i.s(); !(r = i.n()).done;) {
                                    var o = r.value;
                                    t += o.upload.bytesSent, n += o.upload.total
                                }
                            } catch (e) {
                                i.e(e)
                            } finally {
                                i.f()
                            }
                            e = 100 * t / n
                        } else e = 100;
                        return this.emit("totaluploadprogress", e, n, t)
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
                        var n = '<div class="dz-fallback">';
                        this.options.dictFallbackText && (n += "<p>".concat(this.options.dictFallbackText, "</p>")), n += '<input type="file" name="'.concat(this._getParamName(0), '" ').concat(this.options.uploadMultiple ? 'multiple="multiple"' : void 0, ' /><input type="submit" value="Upload!"></div>');
                        var r = i.createElement(n);
                        return "FORM" !== this.element.tagName ? (t = i.createElement('<form action="'.concat(this.options.url, '" enctype="multipart/form-data" method="').concat(this.options.method, '"></form>'))).appendChild(r) : (this.element.setAttribute("enctype", "multipart/form-data"), this.element.setAttribute("method", this.options.method)), null != t ? t : r
                    }
                }, {
                    key: "getExistingFallback",
                    value: function() {
                        for (var e = function(e) {
                                var t, n = c(e, !0);
                                try {
                                    for (n.s(); !(t = n.n()).done;) {
                                        var r = t.value;
                                        if (/(^| )fallback($| )/.test(r.className)) return r
                                    }
                                } catch (e) {
                                    n.e(e)
                                } finally {
                                    n.f()
                                }
                            }, t = 0, n = ["div", "form"]; t < n.length; t++) {
                            var r, i = n[t];
                            if (r = e(this.element.getElementsByTagName(i))) return r
                        }
                    }
                }, {
                    key: "setupEventListeners",
                    value: function() {
                        return this.listeners.map((function(e) {
                            return function() {
                                var t = [];
                                for (var n in e.events) {
                                    var r = e.events[n];
                                    t.push(e.element.addEventListener(n, r, !1))
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
                                for (var n in e.events) {
                                    var r = e.events[n];
                                    t.push(e.element.removeEventListener(n, r, !1))
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
                            n = "b";
                        if (e > 0) {
                            for (var r = ["tb", "gb", "mb", "kb", "b"], i = 0; i < r.length; i++) {
                                var o = r[i];
                                if (e >= Math.pow(this.options.filesizeBase, 4 - i) / 10) {
                                    t = e / Math.pow(this.options.filesizeBase, 4 - i), n = o;
                                    break
                                }
                            }
                            t = Math.round(10 * t) / 10
                        }
                        return "<strong>".concat(t, "</strong> ").concat(this.options.dictFileSizeUnits[n])
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
                            for (var t = [], n = 0; n < e.dataTransfer.files.length; n++) t[n] = e.dataTransfer.files[n];
                            if (t.length) {
                                var r = e.dataTransfer.items;
                                r && r.length && null != r[0].webkitGetAsEntry ? this._addFilesFromItems(r) : this.handleFiles(t)
                            }
                            this.emit("addedfiles", t)
                        }
                    }
                }, {
                    key: "paste",
                    value: function(e) {
                        if (null != (null != (t = null != e ? e.clipboardData : void 0) ? function(e) {
                                return e.items
                            }(t) : void 0)) {
                            var t;
                            this.emit("paste", e);
                            var n = e.clipboardData.items;
                            return n.length ? this._addFilesFromItems(n) : void 0
                        }
                    }
                }, {
                    key: "handleFiles",
                    value: function(e) {
                        var t, n = c(e, !0);
                        try {
                            for (n.s(); !(t = n.n()).done;) {
                                var r = t.value;
                                this.addFile(r)
                            }
                        } catch (e) {
                            n.e(e)
                        } finally {
                            n.f()
                        }
                    }
                }, {
                    key: "_addFilesFromItems",
                    value: function(e) {
                        var t = this;
                        return function() {
                            var n, r = [],
                                i = c(e, !0);
                            try {
                                for (i.s(); !(n = i.n()).done;) {
                                    var o, a = n.value;
                                    null != a.webkitGetAsEntry && (o = a.webkitGetAsEntry()) ? o.isFile ? r.push(t.addFile(a.getAsFile())) : o.isDirectory ? r.push(t._addFilesFromDirectory(o, o.name)) : r.push(void 0) : null == a.getAsFile || null != a.kind && "file" !== a.kind ? r.push(void 0) : r.push(t.addFile(a.getAsFile()))
                                }
                            } catch (e) {
                                i.e(e)
                            } finally {
                                i.f()
                            }
                            return r
                        }()
                    }
                }, {
                    key: "_addFilesFromDirectory",
                    value: function(e, t) {
                        var n = this,
                            r = e.createReader(),
                            i = function(e) {
                                return "log", n = function(t) {
                                    return t.log(e)
                                }, null != (t = console) && "function" == typeof t.log ? n(t) : void 0;
                                var t, n
                            };
                        return function e() {
                            return r.readEntries((function(r) {
                                if (r.length > 0) {
                                    var i, o = c(r, !0);
                                    try {
                                        for (o.s(); !(i = o.n()).done;) {
                                            var a = i.value;
                                            a.isFile ? a.file((function(e) {
                                                if (!n.options.ignoreHiddenFiles || "." !== e.name.substring(0, 1)) return e.fullPath = "".concat(t, "/").concat(e.name), n.addFile(e)
                                            })) : a.isDirectory && n._addFilesFromDirectory(a, "".concat(t, "/").concat(a.name))
                                        }
                                    } catch (e) {
                                        o.e(e)
                                    } finally {
                                        o.f()
                                    }
                                    e()
                                }
                                return null
                            }), i)
                        }()
                    }
                }, {
                    key: "accept",
                    value: function(e, t) {
                        this.options.maxFilesize && e.size > 1024 * this.options.maxFilesize * 1024 ? t(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(e.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize)) : i.isValidFile(e, this.options.acceptedFiles) ? null != this.options.maxFiles && this.getAcceptedFiles().length >= this.options.maxFiles ? (t(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles)), this.emit("maxfilesexceeded", e)) : this.options.accept.call(this, e, t) : t(this.options.dictInvalidFileType)
                    }
                }, {
                    key: "addFile",
                    value: function(e) {
                        var t = this;
                        e.upload = {
                            uuid: i.uuidv4(),
                            progress: 0,
                            total: e.size,
                            bytesSent: 0,
                            filename: this._renameFile(e)
                        }, this.files.push(e), e.status = i.ADDED, this.emit("addedfile", e), this._enqueueThumbnail(e), this.accept(e, (function(n) {
                            n ? (e.accepted = !1, t._errorProcessing([e], n)) : (e.accepted = !0, t.options.autoQueue && t.enqueueFile(e)), t._updateMaxFilesReachedClass()
                        }))
                    }
                }, {
                    key: "enqueueFiles",
                    value: function(e) {
                        var t, n = c(e, !0);
                        try {
                            for (n.s(); !(t = n.n()).done;) {
                                var r = t.value;
                                this.enqueueFile(r)
                            }
                        } catch (e) {
                            n.e(e)
                        } finally {
                            n.f()
                        }
                        return null
                    }
                }, {
                    key: "enqueueFile",
                    value: function(e) {
                        var t = this;
                        if (e.status !== i.ADDED || !0 !== e.accepted) throw new Error("This file can't be queued because it has already been processed or was rejected.");
                        if (e.status = i.QUEUED, this.options.autoProcessQueue) return setTimeout((function() {
                            return t.processQueue()
                        }), 0)
                    }
                }, {
                    key: "_enqueueThumbnail",
                    value: function(e) {
                        var t = this;
                        if (this.options.createImageThumbnails && e.type.match(/image.*/) && e.size <= 1024 * this.options.maxThumbnailFilesize * 1024) return this._thumbnailQueue.push(e), setTimeout((function() {
                            return t._processThumbnailQueue()
                        }), 0)
                    }
                }, {
                    key: "_processThumbnailQueue",
                    value: function() {
                        var e = this;
                        if (!this._processingThumbnail && 0 !== this._thumbnailQueue.length) {
                            this._processingThumbnail = !0;
                            var t = this._thumbnailQueue.shift();
                            return this.createThumbnail(t, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.thumbnailMethod, !0, (function(n) {
                                return e.emit("thumbnail", t, n), e._processingThumbnail = !1, e._processThumbnailQueue()
                            }))
                        }
                    }
                }, {
                    key: "removeFile",
                    value: function(e) {
                        if (e.status === i.UPLOADING && this.cancelUpload(e), this.files = x(this.files, e), this.emit("removedfile", e), 0 === this.files.length) return this.emit("reset")
                    }
                }, {
                    key: "removeAllFiles",
                    value: function(e) {
                        null == e && (e = !1);
                        var t, n = c(this.files.slice(), !0);
                        try {
                            for (n.s(); !(t = n.n()).done;) {
                                var r = t.value;
                                (r.status !== i.UPLOADING || e) && this.removeFile(r)
                            }
                        } catch (e) {
                            n.e(e)
                        } finally {
                            n.f()
                        }
                        return null
                    }
                }, {
                    key: "resizeImage",
                    value: function(e, t, n, r, o) {
                        var a = this;
                        return this.createThumbnail(e, t, n, r, !0, (function(t, n) {
                            if (null == n) return o(e);
                            var r = a.options.resizeMimeType;
                            null == r && (r = e.type);
                            var u = n.toDataURL(r, a.options.resizeQuality);
                            return "image/jpeg" !== r && "image/jpg" !== r || (u = k.restore(e.dataURL, u)), o(i.dataURItoBlob(u))
                        }))
                    }
                }, {
                    key: "createThumbnail",
                    value: function(e, t, n, r, i, o) {
                        var a = this,
                            u = new FileReader;
                        u.onload = function() {
                            e.dataURL = u.result, "image/svg+xml" !== e.type ? a.createThumbnailFromUrl(e, t, n, r, i, o) : null != o && o(u.result)
                        }, u.readAsDataURL(e)
                    }
                }, {
                    key: "displayExistingFile",
                    value: function(e, t, n, r) {
                        var i = this,
                            o = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4];
                        if (this.emit("addedfile", e), this.emit("complete", e), o) {
                            var a = function(t) {
                                i.emit("thumbnail", e, t), n && n()
                            };
                            e.dataURL = t, this.createThumbnailFromUrl(e, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.thumbnailMethod, this.options.fixOrientation, a, r)
                        } else this.emit("thumbnail", e, t), n && n()
                    }
                }, {
                    key: "createThumbnailFromUrl",
                    value: function(e, t, n, r, i, o, a) {
                        var u = this,
                            s = document.createElement("img");
                        return a && (s.crossOrigin = a), i = "from-image" != getComputedStyle(document.body).imageOrientation && i, s.onload = function() {
                            var a = function(e) {
                                return e(1)
                            };
                            return "undefined" != typeof EXIF && null !== EXIF && i && (a = function(e) {
                                return EXIF.getData(s, (function() {
                                    return e(EXIF.getTag(this, "Orientation"))
                                }))
                            }), a((function(i) {
                                e.width = s.width, e.height = s.height;
                                var a = u.options.resize.call(u, e, t, n, r),
                                    l = document.createElement("canvas"),
                                    c = l.getContext("2d");
                                switch (l.width = a.trgWidth, l.height = a.trgHeight, i > 4 && (l.width = a.trgHeight, l.height = a.trgWidth), i) {
                                    case 2:
                                        c.translate(l.width, 0), c.scale(-1, 1);
                                        break;
                                    case 3:
                                        c.translate(l.width, l.height), c.rotate(Math.PI);
                                        break;
                                    case 4:
                                        c.translate(0, l.height), c.scale(1, -1);
                                        break;
                                    case 5:
                                        c.rotate(.5 * Math.PI), c.scale(1, -1);
                                        break;
                                    case 6:
                                        c.rotate(.5 * Math.PI), c.translate(0, -l.width);
                                        break;
                                    case 7:
                                        c.rotate(.5 * Math.PI), c.translate(l.height, -l.width), c.scale(-1, 1);
                                        break;
                                    case 8:
                                        c.rotate(-.5 * Math.PI), c.translate(-l.height, 0)
                                }
                                E(c, s, null != a.srcX ? a.srcX : 0, null != a.srcY ? a.srcY : 0, a.srcWidth, a.srcHeight, null != a.trgX ? a.trgX : 0, null != a.trgY ? a.trgY : 0, a.trgWidth, a.trgHeight);
                                var f = l.toDataURL("image/png");
                                if (null != o) return o(f, l)
                            }))
                        }, null != o && (s.onerror = o), s.src = e.dataURL
                    }
                }, {
                    key: "processQueue",
                    value: function() {
                        var e = this.options.parallelUploads,
                            t = this.getUploadingFiles().length,
                            n = t;
                        if (!(t >= e)) {
                            var r = this.getQueuedFiles();
                            if (r.length > 0) {
                                if (this.options.uploadMultiple) return this.processFiles(r.slice(0, e - t));
                                for (; n < e;) {
                                    if (!r.length) return;
                                    this.processFile(r.shift()), n++
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
                        var t, n = c(e, !0);
                        try {
                            for (n.s(); !(t = n.n()).done;) {
                                var r = t.value;
                                r.processing = !0, r.status = i.UPLOADING, this.emit("processing", r)
                            }
                        } catch (e) {
                            n.e(e)
                        } finally {
                            n.f()
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
                        if (e.status === i.UPLOADING) {
                            var t, n = this._getFilesWithXhr(e.xhr),
                                r = c(n, !0);
                            try {
                                for (r.s(); !(t = r.n()).done;) t.value.status = i.CANCELED
                            } catch (e) {
                                r.e(e)
                            } finally {
                                r.f()
                            }
                            void 0 !== e.xhr && e.xhr.abort();
                            var o, a = c(n, !0);
                            try {
                                for (a.s(); !(o = a.n()).done;) {
                                    var u = o.value;
                                    this.emit("canceled", u)
                                }
                            } catch (e) {
                                a.e(e)
                            } finally {
                                a.f()
                            }
                            this.options.uploadMultiple && this.emit("canceledmultiple", n)
                        } else e.status !== i.ADDED && e.status !== i.QUEUED || (e.status = i.CANCELED, this.emit("canceled", e), this.options.uploadMultiple && this.emit("canceledmultiple", [e]));
                        if (this.options.autoProcessQueue) return this.processQueue()
                    }
                }, {
                    key: "resolveOption",
                    value: function(e) {
                        if ("function" == typeof e) {
                            for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) n[r - 1] = arguments[r];
                            return e.apply(this, n)
                        }
                        return e
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
                        this._transformFiles(e, (function(n) {
                            if (t.options.chunking) {
                                var r = n[0];
                                e[0].upload.chunked = t.options.chunking && (t.options.forceChunking || r.size > t.options.chunkSize), e[0].upload.totalChunkCount = Math.ceil(r.size / t.options.chunkSize)
                            }
                            if (e[0].upload.chunked) {
                                var o = e[0],
                                    a = n[0];
                                o.upload.chunks = [];
                                var u = function() {
                                    for (var n = 0; void 0 !== o.upload.chunks[n];) n++;
                                    if (!(n >= o.upload.totalChunkCount)) {
                                        var r = n * t.options.chunkSize,
                                            u = Math.min(r + t.options.chunkSize, a.size),
                                            s = {
                                                name: t._getParamName(0),
                                                data: a.webkitSlice ? a.webkitSlice(r, u) : a.slice(r, u),
                                                filename: o.upload.filename,
                                                chunkIndex: n
                                            };
                                        o.upload.chunks[n] = {
                                            file: o,
                                            index: n,
                                            dataBlock: s,
                                            status: i.UPLOADING,
                                            progress: 0,
                                            retries: 0
                                        }, t._uploadData(e, [s])
                                    }
                                };
                                if (o.upload.finishedChunkUpload = function(n, r) {
                                        var a = !0;
                                        n.status = i.SUCCESS, n.dataBlock = null, n.xhr = null;
                                        for (var s = 0; s < o.upload.totalChunkCount; s++) {
                                            if (void 0 === o.upload.chunks[s]) return u();
                                            o.upload.chunks[s].status !== i.SUCCESS && (a = !1)
                                        }
                                        a && t.options.chunksUploaded(o, (function() {
                                            t._finished(e, r, null)
                                        }))
                                    }, t.options.parallelChunkUploads)
                                    for (var s = 0; s < o.upload.totalChunkCount; s++) u();
                                else u()
                            } else {
                                for (var l = [], c = 0; c < e.length; c++) l[c] = {
                                    name: t._getParamName(c),
                                    data: n[c],
                                    filename: e[c].upload.filename
                                };
                                t._uploadData(e, l)
                            }
                        }))
                    }
                }, {
                    key: "_getChunk",
                    value: function(e, t) {
                        for (var n = 0; n < e.upload.totalChunkCount; n++)
                            if (void 0 !== e.upload.chunks[n] && e.upload.chunks[n].xhr === t) return e.upload.chunks[n]
                    }
                }, {
                    key: "_uploadData",
                    value: function(e, t) {
                        var n, r = this,
                            o = new XMLHttpRequest,
                            a = c(e, !0);
                        try {
                            for (a.s(); !(n = a.n()).done;) n.value.xhr = o
                        } catch (e) {
                            a.e(e)
                        } finally {
                            a.f()
                        }
                        e[0].upload.chunked && (e[0].upload.chunks[t[0].chunkIndex].xhr = o);
                        var u = this.resolveOption(this.options.method, e),
                            s = this.resolveOption(this.options.url, e);
                        o.open(u, s, !0), this.resolveOption(this.options.timeout, e) && (o.timeout = this.resolveOption(this.options.timeout, e)), o.withCredentials = !!this.options.withCredentials, o.onload = function(t) {
                            r._finishedUploading(e, o, t)
                        }, o.ontimeout = function() {
                            r._handleUploadError(e, o, "Request timedout after ".concat(r.options.timeout / 1e3, " seconds"))
                        }, o.onerror = function() {
                            r._handleUploadError(e, o)
                        }, (null != o.upload ? o.upload : o).onprogress = function(t) {
                            return r._updateFilesUploadProgress(e, o, t)
                        };
                        var l = {
                            Accept: "application/json",
                            "Cache-Control": "no-cache",
                            "X-Requested-With": "XMLHttpRequest"
                        };
                        for (var f in this.options.headers && i.extend(l, this.options.headers), l) {
                            var p = l[f];
                            p && o.setRequestHeader(f, p)
                        }
                        var h = new FormData;
                        if (this.options.params) {
                            var d = this.options.params;
                            for (var v in "function" == typeof d && (d = d.call(this, e, o, e[0].upload.chunked ? this._getChunk(e[0], o) : null)), d) {
                                var y = d[v];
                                if (Array.isArray(y))
                                    for (var g = 0; g < y.length; g++) h.append(v, y[g]);
                                else h.append(v, y)
                            }
                        }
                        var m, b = c(e, !0);
                        try {
                            for (b.s(); !(m = b.n()).done;) {
                                var x = m.value;
                                this.emit("sending", x, o, h)
                            }
                        } catch (e) {
                            b.e(e)
                        } finally {
                            b.f()
                        }
                        this.options.uploadMultiple && this.emit("sendingmultiple", e, o, h), this._addFormElementData(h);
                        for (var w = 0; w < t.length; w++) {
                            var E = t[w];
                            h.append(E.name, E.data, E.filename)
                        }
                        this.submitRequest(o, h, e)
                    }
                }, {
                    key: "_transformFiles",
                    value: function(e, t) {
                        for (var n = this, r = [], i = 0, o = function(o) {
                                n.options.transformFile.call(n, e[o], (function(n) {
                                    r[o] = n, ++i === e.length && t(r)
                                }))
                            }, a = 0; a < e.length; a++) o(a)
                    }
                }, {
                    key: "_addFormElementData",
                    value: function(e) {
                        if ("FORM" === this.element.tagName) {
                            var t, n = c(this.element.querySelectorAll("input, textarea, select, button"), !0);
                            try {
                                for (n.s(); !(t = n.n()).done;) {
                                    var r = t.value,
                                        i = r.getAttribute("name"),
                                        o = r.getAttribute("type");
                                    if (o && (o = o.toLowerCase()), null != i)
                                        if ("SELECT" === r.tagName && r.hasAttribute("multiple")) {
                                            var a, u = c(r.options, !0);
                                            try {
                                                for (u.s(); !(a = u.n()).done;) {
                                                    var s = a.value;
                                                    s.selected && e.append(i, s.value)
                                                }
                                            } catch (e) {
                                                u.e(e)
                                            } finally {
                                                u.f()
                                            }
                                        } else(!o || "checkbox" !== o && "radio" !== o || r.checked) && e.append(i, r.value)
                                }
                            } catch (e) {
                                n.e(e)
                            } finally {
                                n.f()
                            }
                        }
                    }
                }, {
                    key: "_updateFilesUploadProgress",
                    value: function(e, t, n) {
                        if (e[0].upload.chunked) {
                            var r = e[0],
                                i = this._getChunk(r, t);
                            n ? (i.progress = 100 * n.loaded / n.total, i.total = n.total, i.bytesSent = n.loaded) : (i.progress = 100, i.bytesSent = i.total), r.upload.progress = 0, r.upload.total = 0, r.upload.bytesSent = 0;
                            for (var o = 0; o < r.upload.totalChunkCount; o++) r.upload.chunks[o] && void 0 !== r.upload.chunks[o].progress && (r.upload.progress += r.upload.chunks[o].progress, r.upload.total += r.upload.chunks[o].total, r.upload.bytesSent += r.upload.chunks[o].bytesSent);
                            r.upload.progress = r.upload.progress / r.upload.totalChunkCount, this.emit("uploadprogress", r, r.upload.progress, r.upload.bytesSent)
                        } else {
                            var a, u = c(e, !0);
                            try {
                                for (u.s(); !(a = u.n()).done;) {
                                    var s = a.value;
                                    s.upload.total && s.upload.bytesSent && s.upload.bytesSent == s.upload.total || (n ? (s.upload.progress = 100 * n.loaded / n.total, s.upload.total = n.total, s.upload.bytesSent = n.loaded) : (s.upload.progress = 100, s.upload.bytesSent = s.upload.total), this.emit("uploadprogress", s, s.upload.progress, s.upload.bytesSent))
                                }
                            } catch (e) {
                                u.e(e)
                            } finally {
                                u.f()
                            }
                        }
                    }
                }, {
                    key: "_finishedUploading",
                    value: function(e, t, n) {
                        var r;
                        if (e[0].status !== i.CANCELED && 4 === t.readyState) {
                            if ("arraybuffer" !== t.responseType && "blob" !== t.responseType && (r = t.responseText, t.getResponseHeader("content-type") && ~t.getResponseHeader("content-type").indexOf("application/json"))) try {
                                r = JSON.parse(r)
                            } catch (e) {
                                n = e, r = "Invalid JSON response from server."
                            }
                            this._updateFilesUploadProgress(e, t), 200 <= t.status && t.status < 300 ? e[0].upload.chunked ? e[0].upload.finishedChunkUpload(this._getChunk(e[0], t), r) : this._finished(e, r, n) : this._handleUploadError(e, t, r)
                        }
                    }
                }, {
                    key: "_handleUploadError",
                    value: function(e, t, n) {
                        if (e[0].status !== i.CANCELED) {
                            if (e[0].upload.chunked && this.options.retryChunks) {
                                var r = this._getChunk(e[0], t);
                                if (r.retries++ < this.options.retryChunksLimit) return void this._uploadData(e, [r.dataBlock]);
                                console.warn("Retried this chunk too often. Giving up.")
                            }
                            this._errorProcessing(e, n || this.options.dictResponseError.replace("{{statusCode}}", t.status), t)
                        }
                    }
                }, {
                    key: "submitRequest",
                    value: function(e, t, n) {
                        1 == e.readyState ? e.send(t) : console.warn("Cannot send this request because the XMLHttpRequest.readyState is not OPENED.")
                    }
                }, {
                    key: "_finished",
                    value: function(e, t, n) {
                        var r, o = c(e, !0);
                        try {
                            for (o.s(); !(r = o.n()).done;) {
                                var a = r.value;
                                a.status = i.SUCCESS, this.emit("success", a, t, n), this.emit("complete", a)
                            }
                        } catch (e) {
                            o.e(e)
                        } finally {
                            o.f()
                        }
                        if (this.options.uploadMultiple && (this.emit("successmultiple", e, t, n), this.emit("completemultiple", e)), this.options.autoProcessQueue) return this.processQueue()
                    }
                }, {
                    key: "_errorProcessing",
                    value: function(e, t, n) {
                        var r, o = c(e, !0);
                        try {
                            for (o.s(); !(r = o.n()).done;) {
                                var a = r.value;
                                a.status = i.ERROR, this.emit("error", a, t, n), this.emit("complete", a)
                            }
                        } catch (e) {
                            o.e(e)
                        } finally {
                            o.f()
                        }
                        if (this.options.uploadMultiple && (this.emit("errormultiple", e, t, n), this.emit("completemultiple", e)), this.options.autoProcessQueue) return this.processQueue()
                    }
                }], [{
                    key: "initClass",
                    value: function() {
                        this.prototype.Emitter = o, this.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "addedfiles", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached", "queuecomplete"], this.prototype._thumbnailQueue = [], this.prototype._processingThumbnail = !1
                    }
                }, {
                    key: "extend",
                    value: function(e) {
                        for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) n[r - 1] = arguments[r];
                        for (var i = 0, o = n; i < o.length; i++) {
                            var a = o[i];
                            for (var u in a) {
                                var s = a[u];
                                e[u] = s
                            }
                        }
                        return e
                    }
                }, {
                    key: "uuidv4",
                    value: function() {
                        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(e) {
                            var t = 16 * Math.random() | 0;
                            return ("x" === e ? t : 3 & t | 8).toString(16)
                        }))
                    }
                }]), i
            }(o);
            b.initClass(), b.version = "5.9.3", b.options = {}, b.optionsForElement = function(e) {
                return e.getAttribute("id") ? b.options[w(e.getAttribute("id"))] : void 0
            }, b.instances = [], b.forElement = function(e) {
                if ("string" == typeof e && (e = document.querySelector(e)), null == (null != e ? e.dropzone : void 0)) throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
                return e.dropzone
            }, b.autoDiscover = !0, b.discover = function() {
                var e;
                if (document.querySelectorAll) e = document.querySelectorAll(".dropzone");
                else {
                    e = [];
                    var t = function(t) {
                        return function() {
                            var n, r = [],
                                i = c(t, !0);
                            try {
                                for (i.s(); !(n = i.n()).done;) {
                                    var o = n.value;
                                    /(^| )dropzone($| )/.test(o.className) ? r.push(e.push(o)) : r.push(void 0)
                                }
                            } catch (e) {
                                i.e(e)
                            } finally {
                                i.f()
                            }
                            return r
                        }()
                    };
                    t(document.getElementsByTagName("div")), t(document.getElementsByTagName("form"))
                }
                return function() {
                    var t, n = [],
                        r = c(e, !0);
                    try {
                        for (r.s(); !(t = r.n()).done;) {
                            var i = t.value;
                            !1 !== b.optionsForElement(i) ? n.push(new b(i)) : n.push(void 0)
                        }
                    } catch (e) {
                        r.e(e)
                    } finally {
                        r.f()
                    }
                    return n
                }()
            }, b.blockedBrowsers = [/opera.*(Macintosh|Windows Phone).*version\/12/i], b.isBrowserSupported = function() {
                var e = !0;
                if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector)
                    if ("classList" in document.createElement("a")) {
                        void 0 !== b.blacklistedBrowsers && (b.blockedBrowsers = b.blacklistedBrowsers);
                        var t, n = c(b.blockedBrowsers, !0);
                        try {
                            for (n.s(); !(t = n.n()).done;) t.value.test(navigator.userAgent) && (e = !1)
                        } catch (e) {
                            n.e(e)
                        } finally {
                            n.f()
                        }
                    } else e = !1;
                else e = !1;
                return e
            }, b.dataURItoBlob = function(e) {
                for (var t = atob(e.split(",")[1]), n = e.split(",")[0].split(":")[1].split(";")[0], r = new ArrayBuffer(t.length), i = new Uint8Array(r), o = 0, a = t.length, u = 0 <= a; u ? o <= a : o >= a; u ? o++ : o--) i[o] = t.charCodeAt(o);
                return new Blob([r], {
                    type: n
                })
            };
            var x = function(e, t) {
                    return e.filter((function(e) {
                        return e !== t
                    })).map((function(e) {
                        return e
                    }))
                },
                w = function(e) {
                    return e.replace(/[\-_](\w)/g, (function(e) {
                        return e.charAt(1).toUpperCase()
                    }))
                };
            b.createElement = function(e) {
                var t = document.createElement("div");
                return t.innerHTML = e, t.childNodes[0]
            }, b.elementInside = function(e, t) {
                if (e === t) return !0;
                for (; e = e.parentNode;)
                    if (e === t) return !0;
                return !1
            }, b.getElement = function(e, t) {
                var n;
                if ("string" == typeof e ? n = document.querySelector(e) : null != e.nodeType && (n = e), null == n) throw new Error("Invalid `".concat(t, "` option provided. Please provide a CSS selector or a plain HTML element."));
                return n
            }, b.getElements = function(e, t) {
                var n, r;
                if (e instanceof Array) {
                    r = [];
                    try {
                        var i, o = c(e, !0);
                        try {
                            for (o.s(); !(i = o.n()).done;) n = i.value, r.push(this.getElement(n, t))
                        } catch (e) {
                            o.e(e)
                        } finally {
                            o.f()
                        }
                    } catch (e) {
                        r = null
                    }
                } else if ("string" == typeof e) {
                    r = [];
                    var a, u = c(document.querySelectorAll(e), !0);
                    try {
                        for (u.s(); !(a = u.n()).done;) n = a.value, r.push(n)
                    } catch (e) {
                        u.e(e)
                    } finally {
                        u.f()
                    }
                } else null != e.nodeType && (r = [e]);
                if (null == r || !r.length) throw new Error("Invalid `".concat(t, "` option provided. Please provide a CSS selector, a plain HTML element or a list of those."));
                return r
            }, b.confirm = function(e, t, n) {
                return window.confirm(e) ? t() : null != n ? n() : void 0
            }, b.isValidFile = function(e, t) {
                if (!t) return !0;
                t = t.split(",");
                var n, r = e.type,
                    i = r.replace(/\/.*$/, ""),
                    o = c(t, !0);
                try {
                    for (o.s(); !(n = o.n()).done;) {
                        var a = n.value;
                        if ("." === (a = a.trim()).charAt(0)) {
                            if (-1 !== e.name.toLowerCase().indexOf(a.toLowerCase(), e.name.length - a.length)) return !0
                        } else if (/\/\*$/.test(a)) {
                            if (i === a.replace(/\/.*$/, "")) return !0
                        } else if (r === a) return !0
                    }
                } catch (e) {
                    o.e(e)
                } finally {
                    o.f()
                }
                return !1
            }, "undefined" != typeof jQuery && null !== jQuery && (jQuery.fn.dropzone = function(e) {
                return this.each((function() {
                    return new b(this, e)
                }))
            }), b.ADDED = "added", b.QUEUED = "queued", b.ACCEPTED = b.QUEUED, b.UPLOADING = "uploading", b.PROCESSING = b.UPLOADING, b.CANCELED = "canceled", b.ERROR = "error", b.SUCCESS = "success";
            var E = function(e, t, n, r, i, o, a, u, s, l) {
                    var c = function(e) {
                        e.naturalWidth;
                        var t = e.naturalHeight,
                            n = document.createElement("canvas");
                        n.width = 1, n.height = t;
                        var r = n.getContext("2d");
                        r.drawImage(e, 0, 0);
                        for (var i = r.getImageData(1, 0, 1, t).data, o = 0, a = t, u = t; u > o;) 0 === i[4 * (u - 1) + 3] ? a = u : o = u, u = a + o >> 1;
                        var s = u / t;
                        return 0 === s ? 1 : s
                    }(t);
                    return e.drawImage(t, n, r, i, o, a, u, s, l / c)
                },
                k = function() {
                    function e() {
                        p(this, e)
                    }
                    return d(e, null, [{
                        key: "initClass",
                        value: function() {
                            this.KEY_STR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
                        }
                    }, {
                        key: "encode64",
                        value: function(e) {
                            for (var t = "", n = void 0, r = void 0, i = "", o = void 0, a = void 0, u = void 0, s = "", l = 0; o = (n = e[l++]) >> 2, a = (3 & n) << 4 | (r = e[l++]) >> 4, u = (15 & r) << 2 | (i = e[l++]) >> 6, s = 63 & i, isNaN(r) ? u = s = 64 : isNaN(i) && (s = 64), t = t + this.KEY_STR.charAt(o) + this.KEY_STR.charAt(a) + this.KEY_STR.charAt(u) + this.KEY_STR.charAt(s), n = r = i = "", o = a = u = s = "", l < e.length;);
                            return t
                        }
                    }, {
                        key: "restore",
                        value: function(e, t) {
                            if (!e.match("data:image/jpeg;base64,")) return t;
                            var n = this.decode64(e.replace("data:image/jpeg;base64,", "")),
                                r = this.slice2Segments(n),
                                i = this.exifManipulation(t, r);
                            return "data:image/jpeg;base64,".concat(this.encode64(i))
                        }
                    }, {
                        key: "exifManipulation",
                        value: function(e, t) {
                            var n = this.getExifArray(t),
                                r = this.insertExif(e, n);
                            return new Uint8Array(r)
                        }
                    }, {
                        key: "getExifArray",
                        value: function(e) {
                            for (var t = void 0, n = 0; n < e.length;) {
                                if (255 === (t = e[n])[0] & 225 === t[1]) return t;
                                n++
                            }
                            return []
                        }
                    }, {
                        key: "insertExif",
                        value: function(e, t) {
                            var n = e.replace("data:image/jpeg;base64,", ""),
                                r = this.decode64(n),
                                i = r.indexOf(255, 3),
                                o = r.slice(0, i),
                                a = r.slice(i),
                                u = o;
                            return (u = u.concat(t)).concat(a)
                        }
                    }, {
                        key: "slice2Segments",
                        value: function(e) {
                            for (var t = 0, n = []; !(255 === e[t] & 218 === e[t + 1]);) {
                                if (255 === e[t] & 216 === e[t + 1]) t += 2;
                                else {
                                    var r = t + (256 * e[t + 2] + e[t + 3]) + 2,
                                        i = e.slice(t, r);
                                    n.push(i), t = r
                                }
                                if (t > e.length) break
                            }
                            return n
                        }
                    }, {
                        key: "decode64",
                        value: function(e) {
                            var t = void 0,
                                n = void 0,
                                r = "",
                                i = void 0,
                                o = void 0,
                                a = "",
                                u = 0,
                                s = [];
                            for (/[^A-Za-z0-9\+\/\=]/g.exec(e) && console.warn("There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\nExpect errors in decoding."), e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); t = this.KEY_STR.indexOf(e.charAt(u++)) << 2 | (i = this.KEY_STR.indexOf(e.charAt(u++))) >> 4, n = (15 & i) << 4 | (o = this.KEY_STR.indexOf(e.charAt(u++))) >> 2, r = (3 & o) << 6 | (a = this.KEY_STR.indexOf(e.charAt(u++))), s.push(t), 64 !== o && s.push(n), 64 !== a && s.push(r), t = n = r = "", i = o = a = "", u < e.length;);
                            return s
                        }
                    }]), e
                }();
            k.initClass(), b._autoDiscoverFunction = function() {
                    if (b.autoDiscover) return b.discover()
                },
                function(e, t) {
                    var n = !1,
                        r = !0,
                        i = e.document,
                        o = i.documentElement,
                        a = i.addEventListener ? "addEventListener" : "attachEvent",
                        u = i.addEventListener ? "removeEventListener" : "detachEvent",
                        s = i.addEventListener ? "" : "on",
                        l = function r(o) {
                            if ("readystatechange" !== o.type || "complete" === i.readyState) return ("load" === o.type ? e : i)[u](s + o.type, r, !1), !n && (n = !0) ? t.call(e, o.type || o) : void 0
                        };
                    if ("complete" !== i.readyState) {
                        if (i.createEventObject && o.doScroll) {
                            try {
                                r = !e.frameElement
                            } catch (e) {}
                            r && function e() {
                                try {
                                    o.doScroll("left")
                                } catch (t) {
                                    return void setTimeout(e, 50)
                                }
                                return l("poll")
                            }()
                        }
                        i[a](s + "DOMContentLoaded", l, !1), i[a](s + "readystatechange", l, !1), e[a](s + "load", l, !1)
                    }
                }(window, b._autoDiscoverFunction), window.Dropzone = b;
            var A = b
        }(), r
    }()
}));

$(function() {

    // do smooth scrolling for all .smooth-scroll links
/* TODO fixes needed
    $("a.smooth-scroll").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var offset = 0;
            var hash = this.hash;
BAD         var newUrl = window.location.protocol + "//" + window.location.host +
                            window.location.pathname + hash;
BAD         var headerHeight = $('header.sticky-top').height();
            $('html, body').animate({scrollTop: $(hash).offset().top - headerHeight - offset}, 800);
//          history.pushState({}, '', newUrl);
       }
    });
*/

    // ecb_file_selector
    $(document).on('change', '.ecb_file_selector_select select', function (e) {
        var file_name = $(this).val(),
            file_extension = file_name.substr((file_name.lastIndexOf('.') + 1)),
            $file_selector_thumb = $(this).parent().next('.ecb_file_selector_preview'),
            // file_dir = $file_selector_thumb.data('uploadsurl'),
            supported_extensions = $file_selector_thumb.data('supported-extensions').split(',');
        if ($(this).val() === '' || !supported_extensions || supported_extensions.indexOf(file_extension) === -1 ) {
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
