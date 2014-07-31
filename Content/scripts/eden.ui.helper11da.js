var EDEN_UI_HELPER = function () {
    // jquery.validate.js need every element have the unique id, so set the id after bootstrap-datepicker.js confuse the element id.
    var date_picker_id_sequence = 0;
    var table_responsive_id_sequence = 0;
    var cookieObj = {};
    var parseCookie = function () {
        var cookieArray = document.cookie.split(";");
        for (var i = 0; i < cookieArray.length; i++) {
            var arr = cookieArray[i].split("=");
            var key = $.trim(arr[0]);
            var value = unescape(arr[1]);
            cookieObj[key] = value;
        }
    };
    parseCookie();

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    };

    return {
        countDown:function(container, spanTime) {
            var t;
            if (container.length > 0) {
                var clientStartTime = (new Date()).getTime();
                var totalSeconds = parseInt(spanTime);
                t = setInterval(updateContainer, 1000);
            }

            function updateContainer() {
                var clientTime = (new Date()).getTime();
                var gap = Math.round((clientTime - clientStartTime) / 1000);
                var remindSeconds = totalSeconds - gap;
                if (0 >= remindSeconds) {
                    clearInterval(t);
                    window.location.href = window.location.href;
                    return;
                }
                var totalMins = parseInt(remindSeconds / 60);
                var seconds = parseInt(remindSeconds % 60);
                var hours = parseInt(totalMins / 60);
                var mins = parseInt(totalMins % 60);
                container.html(pad(hours, 2) + ":" + pad(mins, 2) + ":" + pad(seconds, 2) +" 后开放投标");
            }
        },

        isAndroid: function (ua) {
            ua = ua || navigator.userAgent;
            return ua.toLowerCase().indexOf('android') > -1;
        },

        isIOS: function (platform) {
          if (navigator && navigator.platform) {
            platform = platform || navigator.platform;
            return /iP(?:hone|od|ad)/.test(platform);
          } else {
            return false;
          }
        },

        isWeixin: function (ua) {
            ua = ua || navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        },

        showAndroidSmartBanner: function () {
                var that = this;
                if (!that.getCookie('android-downloaded')) {
                        var androidSmartBannerTemplate = '<div id="android-smart-banner"><div class="app-info"><img alt="积木盒子安卓客户端" class="icon" src="http://www.jimubox.com/Content/img/icon-120.png" width="40"><span>积木盒子安卓客户端</span><br/><a href="http://app-download.jimubox.com/JimuboxMobile.apk">点击下载</a></div><a class="close" href="#">×</a></div>';
                        androidSmartBannerTemplate = androidSmartBannerTemplate + '<style> body { padding-top: 60px;} #android-smart-banner { background-color: #fff; z-index: 1010; box-sizing: border-box; padding: 10px; position: fixed; top: 0; width: 100%; margin: 0; left: 0; height: 60px; overflow: hidden; border-bottom: 1px solid #ddd; padding-left: 10px; } #android-smart-banner .close { text-decoration: none; color: gray; font-size: 24px; position: absolute; top: 4px; right: 10px; border-radius: 3px; display: inline-block; text-align: center; vertical-align: middle; font-weight: bold; line-height: 1.0; } #android-smart-banner .app-info { box-sizing: border-box; } #android-smart-banner a { color: #2498c4; text-decoration: none; } #android-smart-banner .icon { float: left; margin-right: 10px;} </style>';
            $('body').prepend(androidSmartBannerTemplate);
            var $banner = $('#android-smart-banner');
            $banner.on('click', '.close', function (event) {
                    event.preventDefault();
                    $banner.remove();
                    that.setCookie('android-downloaded', true, 1);
                    $('body').css('padding-top', 0);
            })
                }
        },
        getCookie: function (name) {
            return cookieObj[name];
        },
        setCookie: function (name, value, expiresDays) {
            var date = new Date();
            date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000);
            var str = name + "=" + value + ";expires=" + date.toGMTString() + ";path=/";
            document.cookie = str;
        },
        delCookie: function (name) {
            document.cookie = name + "=;expires=" + (new Date(0)).toGMTString() + ";path=/";
        },

        InitWidgets: function () {

            //start: scrollUp
            $.scrollUp({
                scrollName: 'scrollUp', // Element ID
                scrollDistance: 300, // Distance from top/bottom before showing element (px)
                scrollFrom: 'top', // 'top' or 'bottom'
                scrollSpeed: 300, // Speed back to top (ms)
                easingType: 'linear', // Scroll to top easing (see http://easings.net/)
                animation: 'fade', // Fade, slide, none
                animationInSpeed: 200, // Animation in speed (ms)
                animationOutSpeed: 200, // Animation out speed (ms)
                scrollText: '返回顶部', // Text for element, can contain HTML
                scrollTitle: false, // Set a custom <a> title if required. Defaults to scrollText
                scrollImg: true, // Set true to use image
                activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
                zIndex: 1099 // Z-Index for the overlay
            });

            //start:Calculator Scripts
            $("#Calculator").modal({
                "keyboard": false,
                "backdrop": "static",
                "show": false
            })

            var cal = function () {

                var amount = $("#Cal-Amount").val(),
                    incomeContainer = $("#Cal-Income"),
                    rate = $("#Cal-InterestRate").val() / 100,
                    time = $("#Cal-FinancingMaturity").val(),
                    income;
                income = (amount * rate * time / 365).toFixed(2);

                incomeContainer.html('');

                if (!isNaN(income)) {
                    incomeContainer.html(income);
                }
            }

            $("#cal").on("click", function () {
                cal();
            })

            $(window).on("keydown", function (e) {
                if (e.keyCode == 13 && $("#Calculator").css("display") == "block") {
                    cal();
                }
            })
            //end:Calculator Scripts

        },

        RefreshCaptcha: function () {
            $("#CaptchaImage").on('click', function (e) {
                e.preventDefault();
                $(this).attr('src', '/CaptchaImage?once=' + +new Date());
            });
        },

        MarkCurrentPage: function () {
            if ($(".js-ignore-pagemark").length != 0) return;

            var markNavItem = function (item) {
                item.addClass('active');
            }

            var $nav = $('.nav-collapse .nav')
                , i = 0
                , anchor;

            if ($nav.length != 0) {

                var $subNav = $(".sub-nav");
                if ($subNav.length != 0) {
                    var supNav = $subNav.attr("sup");
                    markNavItem($("#" + supNav));
                    return;
                }

                $nav.find("li").each(function () {
                    anchor = $(this).find("a");
                    if (window.location.href.indexOf(anchor.attr("href")) != -1 && anchor.attr("href") != "/") {
                        markNavItem($(this));
                        i = 1;
                    }
                });

                if (i === 0) {
                    markNavItem($("#Home"));
                }
            }
        },

        FixSubNavToTop: function () {

            var $nav = $('.sub-nav');
            if ($nav.length == 0) return;

            var $navTop = $nav.offset().top;

            var fixSubNav = function () {

                if ($(window).width() < 979) {
                    if ($nav.hasClass("fixed-top")) {
                        $nav.removeClass('fixed-top');
                        $("body").attr("style", "padding-top:0px");
                    }
                    return;
                }

                if ($nav.length == 0) return;

                var scrollTop = $(window).scrollTop();
                if (scrollTop >= $navTop && !$nav.hasClass("fixed-top")) {
                    $nav.addClass('fixed-top');
                    $("body").attr("style", "padding-top:50px");
                } else if (scrollTop < $navTop && $nav.hasClass("fixed-top")) {
                    $nav.removeClass('fixed-top');
                    $("body").attr("style", "padding-top:0px");
                }
            };

            $(window).bind('scroll resize', fixSubNav);

            fixSubNav();
        },

        ChangeFormToAjax: function (form, before, done, fail) {
            if (form == null) {
                form = $('form');
            }
            form.submit(function () {
                if (before != null && !before(form)) {
                    return false;
                }
                $.ajax({
                    type: form.attr('method'),
                    url: form.attr('action'),
                    data: form.serialize()
                }).done(function (data) {
                    if (done != null) {
                        done(form, data);
                    }
                }).fail(function (data) {
                    if (fail != null) {
                        fail(form, data);
                    }
                });
                return false;
            });
        },

        PairRadioOrCheckboxWithTextbox: function (container) {
            container = container || $('.js-radio-checkbox-text');
            container.each(function (i, elem) {
                var radioAndCheckbox = $(elem).find(':radio:last, :checkbox:last'),
                    textbox = $(elem).find(':text');
                radioAndCheckbox.on('click', function () {
                    if (this.checked) {
                        textbox.focus();
                    }
                });
                textbox.on('focus', function () {
                    radioAndCheckbox.attr('checked', 'checked');
                });
            });
        },

        HookResponsiveTable: function (container) {
            var controls = ((container == undefined) ? $(".table-responsive") : container.find(".table-responsive"));

            $.each(controls, function (k, v) {
                var title = $(v).find("th"),
                    style = "",
                    sequenceId = 'table-responsive-' + (++table_responsive_id_sequence)
                $(v).attr('id', sequenceId);

                for (var i = 0; i < title.length; i++) {
                    var thisStyle = "#" + sequenceId + " td:nth-of-type("+(i+1)+"):before{content:'" + title.eq(i).text() + "'}\n";
                    style += thisStyle;
                }

                $("head").append("<style type='text/css'>"+style+"</style>");

            });
        },

        HookDatePicker: function (container) {
            var controls = ((container == undefined) ? $(".js-date-picker") : container.find(".js-date-picker"));
            $.each(controls, function (k, v) {
                $(v).attr('id', 'date-picker-' + (++date_picker_id_sequence))
                //.attr("readonly", "readonly")
                .datepicker({ "format": "yyyy-mm-dd", language: 'zh-CN' })
                .on('changeDate', function (ev) {
                    $(this).blur();
                });
            });
        },

        HookLookup: function (container) {
            var controls = ((container == undefined) ? $(".js-lookup") : container.find(".js-lookup"));
            $.each(controls, function (k, v) {
                var treeID = parseInt($(v).attr("ui-tree-id"), 10);
                EDEN_TREE.BindLookup($(v), treeID);
            });
        },

        HookFlotLookup: function (container) {
            var controls = ((container == undefined) ? $(".js-flat-lookup") : container.find(".js-flat-lookup"));
            $.each(controls, function (k, v) {
                var treeID = parseInt($(v).attr("ui-tree-id"), 10);
                EDEN_TREE.BindFlatLookup($(v), treeID);
            });
        },

        HookAutoComplete: function (container) {
            var controls = ((container == undefined) ? $(".js-auto-complete") : container.find(".js-auto-complete"));
            $.each(controls, function (k, v) {
                var treeID = parseInt($(v).attr("ui-tree-id"), 10);
                EDEN_TREE.BindAutoComplete($(v), treeID);
            });
        }
    };
}();
