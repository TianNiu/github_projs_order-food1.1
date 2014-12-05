(function($) {

    //菜名列表缓存列表
    var tepm_foodnamels = [];
    /* option参数说明:
    {
        ul_querystring: "菜单列表父元素(ul)query字符串,eg:".someclass",
        cart_cookiename: "需要将当前购物车数据保存的cookie名",
        cart_submit_qstr: "购物车提交按钮query字符串:".someclass",
        ajaxsubmit_url: "需要Ajax提交到的url:'/cart_order'",
        username_qstr: 用户姓名输入框query字符串:".cart_username",
        //提交成功后的callback
        success_func: function(tips) {
            alert(tips);
        }
    }
    */

    //var options = $.extend(defaults, options);
    //私有函数
    /**
     * 查询获取cookie，并根据数据初始化购物车
     * @return {[type]} [description]
     */
    var initCartItemFromCookie = function(thisBottomCart, cookiename) {
        //console.log("什么情况");
        if ($.cookie()) {
            var new_cart = jQuery.parseJSON($.cookie(cookiename));
            console.log("一开始cookie中的json是：");
            console.log(new_cart);
            for (var len = new_cart.length, i = len - 1; i >= 0; i--) {
                //var item = new_cart[i];
                tepm_foodnamels.push(new_cart[i].foodname);
                var new_order_li = "<li><span class='iteminfo_foodname'>" + new_cart[i].foodname +
                    "</span><a href='#' class='iteminfo_minus'>-</a><span class='iteminfo_num'>" + new_cart[i].foodnum + "</span>" +
                    "<a href='#' class='iteminfo_plus'>+</a><span class='with_moneychar'>￥<span class='iteminfo_foodprice'>" + new_cart[i].foodprice +
                    "</span></span><a href='#' class='remove_thisitem btn btn-link'>x</a></li>";
                thisBottomCart.prepend(new_order_li);
            }
            console.log("起初购物车中的食物是：");
            console.log(tepm_foodnamels);
        }
    };

    /**
     * 用户每一次点击菜名后面的加号触发此函数
     * 将会进行判断：
     * 没有菜就加上一条
     * 有过了就增加数目
     * @param  {[type]} thisBottomCart [description]
     * @param  {[type]} name           [description]
     * @param  {[type]} price          [description]
     * @return {[type]}                [description]
     */
    var putOrderIntoCart = function(thisBottomCart, name, price) {
        //获取该菜名在数组中的位置
        var nameIsIn = $.inArray(name, tepm_foodnamels);
        //console.log("菜名在数组中么");
        //console.log(nameIsIn);
        if (nameIsIn != '-1') {
            //如果菜名已经在数组缓存中
            console.log(name + "  这个菜已经在数组中了");
            /*
            功能区：已经点过的菜，只需要将此菜的数量加+即可
            PS：需要在购物车中获取已经存在的条目，已存在的条目和 nameIsIn+1 这个数字对应
             */
            //var jq_num = $(".cart_iteminfo li").eq(tepm_foodnamels.length - nameIsIn - 1).find(".iteminfo_num");
            var jq_num = thisBottomCart.find("li").eq(tepm_foodnamels.length - nameIsIn - 1).find(".iteminfo_num");
            var now_foodnum = jq_num.text();
            now_foodnum = parseInt(now_foodnum);
            now_foodnum = now_foodnum + 1;
            jq_num.text(now_foodnum); //暂时不操作数字
            console.log("通过插件使数字加了1！");
            //console.log(tepm_foodnamels.length);
            //console.log(nameIsIn);
            //console.log("食物增加了一项之后现在是");
            //console.log(now_foodnum);
        } else {
            //如果用户点击的是新菜
            tepm_foodnamels.push(name);
            console.log("新菜  " + name + "  加入数组");
            /*
            功能区：将新菜构造成新的p段落挂到原先的菜名条目段落集合中


var new_order_li = "<li><span class='iteminfo_foodname'>" + new_cart[i].foodname +
    "</span><a href='#' class='iteminfo_minus'>-</a><span class='iteminfo_num'>" + new_cart[i].foodnum + "</span>" +
    "<a href='#' class='iteminfo_plus'>+</a><span class='with_moneychar'>￥<span class='iteminfo_foodprice'>" + new_cart[i].foodprice +
    "</span></span><a href='#' class='remove_thisitem btn btn-link'>x</a></li>";


             */
            // var name = 'fsafasf';
            // var price = 'fdsfasf';
            // var template = 'fdsfdasf';
            // tempate = tempate()
            var new_order_li = "<li><span class='iteminfo_foodname'>" + name +
                "</span><a href='#' class='iteminfo_minus'>-</a><span class='iteminfo_num'>1</span>" +
                "<a href='#' class='iteminfo_plus'>+</a><span class='with_moneychar'>￥<span class='iteminfo_foodprice'>" + price +
                "</span></span><a href='#' class='remove_thisitem btn btn-link'>x</a></li>";
            //new_order_li="<li>加入了</li>";
            thisBottomCart.prepend(new_order_li);

        }
        console.log("现在的菜名数组是");
        console.log(tepm_foodnamels);
    };
    //公有方法，插件对象可调用方法
    var methods = {
        /*

                                    ##
        ###         #        #####   #                #
         #              #     #   #  #
         #  ####   ##  ###    #   #  #  ## ##   #### ##  ####
         #   #  #   #   #     ####   #   #  #  #  #   #   #  #
         #   #  #   #   #     #      #   #  #  # ##   #   #  #
         #   #  #   #   #     #      #   #  #   #     #   #  #
        ### ### ## ###   ##  ###    ###   ####  #### ### ### ##
                                               #   #
                                                ###
         */
        /**
         * 插件初始化
         * @param  {[type]} options [description]
         * @return {[type]}         [description]
         */
        init: function(options) {
            var that = this;
            // 在每个元素上执行方法
            return this.each(function() {
                //换名保存
                var $this = $(this);
                //如果用户没有传递query字符串，直接返回
                if (options.ul_querystring === "") {
                    console.log("至少需要一个ul的query字符串");
                    return;
                }
                /**
                 *
                 ##                    ##  ##
                  #                     #   #                            #
                  #                     #   #                  #    #
                  ###   ###  ####    ####   #   ##    ##  ##  ###  ###  ##  ####    ####
                  #  #  #  #  #  #  #   #   #  #  #  #   #  #  #    #    #   #  #  #  #
                  #  #   ###  #  #  #   #   #  ####   #  ####  #    #    #   #  #  # ##
                  #  #  #  #  #  #  #  ##   #  #       # #     #    #    #   #  #   #
                 ### ## #### ### ##  ## ## ###  ###  ##   ###   ##   ## ### ### ##  ####
                                                                                   #   #
                                                                                    ###
                 */
                // 尝试去获取settings，如果不存在，则返回“undefined”
                var settings = $this.data("bottomCart");

                // 如果获取settings失败，则根据options和default创建它
                if (typeof settings === "undefined") {

                    // var defaults = {
                    //     propertyName: "value",
                    //     onSomeEvent: function() {}
                    // };

                    var defaults = {
                        /*
                        默认ul的query string为空，如果用户不传query string，插件无法运行
                         */
                        ul_querystring: "",
                        cart_cookiename: "",
                        cart_submit_qstr: ""

                    };

                    settings = $.extend({}, defaults, options);

                    // 保存我们新创建的settings
                    $this.data("bottomCart", settings);
                } else {
                    // 如果获取了settings，则将它和options进行合并
                    settings = $.extend({}, settings, options);

                    // 如果想每次都保存settings，可以添加下面代码
                    // $this.data("bottomCart", settings);
                }
                /*

                   ##       ##                                                                                                  ##           ##
                    #        #                                                                #                                  #   #        #
                    #        #                   #                                                #                              #            #
                 ####   ##   #   ##   #### ###  ###   ##        #### ##    ##  ####   ## ##  ##  ###   ##  #### ##          ###  #  ##   ###  #  #
                #   #  #  #  #  #  # #  #  #  #  #   #  #        #  #  #  #  #  #  #   #  #   #   #   #  #  #  #  #        #  #  #   #  #  #  # #
                #   #  ####  #  #### # ##   ###  #   #### #####  #  #  #  ####  #  #   #  #   #   #   ####  #  #  #  ##### #     #   #  #     ##
                #  ##  #     #  #     #    #  #  #   #           #  #  #  #     #  #   #  #   #   #   #     #  #  #        #     #   #  #     # #
                 ## ##  ### ###  ###  #### ####   ##  ###       ### ## ##  ### ### ##   #### ###   ##  ### ### ## ##        ### ### ###  ### ##  #
                                     #   #
                                      ###
                 */
                //当前购物车
                //var thisBottomCart = $(this);
                //获取ul对象
                //委托点击事件到.item img
                $(settings.ul_querystring).on('click', '.item img', function(event) {
                    event.preventDefault();
                    var self = $(this);
                    var name = self.parent().find('.name').html().trim();
                    var price = self.parent().find('.price').html().trim();
                    //alert("enter me");
                    //alert(name);
                    //在上方点菜区域中显示
                    //$('#cm').val(name);
                    //console.log($('#cm')[0]);
                    //$('#jg').val(price);
                    //console.log("购物车插件获得的菜名是:" + name);
                    //console.log("购物车插件获得的价格是:" + price);
                    putOrderIntoCart($this, name, price);
                });
                //
                //methods.getCartJson($this,callback);   this_cart:$this,
                //console.log("你说这个url对吗：");
                //console.log(settings.success_func);
                /*

                   ##       ##                                                                       ##
                    #        #                                                                        #                #
                    #        #                   #                              #                     #                    #
                 ####   ##   #   ##   #### ###  ###   ##         ### ###  ## # ###         ## ## ##   # ##  #### ##   ##  ###
                #   #  #  #  #  #  # #  #  #  #  #   #  #       #  # #  #  ##   #         #    #  #   ##  #  #  #  #   #   #
                #   #  ####  #  #### # ##   ###  #   #### ##### #     ###  #    #   #####  #   #  #   #   #  #  #  #   #   #
                #  ##  #     #  #     #    #  #  #   #          #    #  #  #    #           #  #  #   #   #  #  #  #   #   #
                 ## ##  ### ###  ###  #### ####   ##  ###        ### #### ###    ##       ##    ####  ####  ### ## ## ###   ##
                                     #   #
                                      ###
                 */
                /**
                 * 委托事件：用户点击买单，ajax提交购物车数据
                 * @param  {[type]} event [description]
                 * @return {[type]}       [description]
                 */
                $(settings.cart_submit_qstr).click(function(event) {
                    var username = $(settings.username_qstr).val();
                    //settings.username_qstr
                    console.log("username is" + username);
                    methods.getCartJson({
                        _this: $this,
                        callback: function(orderlist) {

                            console.log("我的回调的结果就是：");
                            console.log(orderlist);
                            //发送请求
                            $.ajax({
                                beforeSubmit: function() {
                                    //before submit do some check here
                                },
                                url: settings.ajaxsubmit_url,
                                data: {
                                    "username": username,
                                    "orderlist": orderlist
                                },
                                type: 'POST',
                                success: settings.success_func
                            });
                        }
                    });

                });
                /*

                   ##       ##                                                ##                ##
                    #        #                                                 #                 #
                    #        #                   #                             #                 #                                #
                 ####   ##   #   ##   #### ###  ###   ##        ## ##  ####    #   ###  ###   ####         ##  ## ##  ##  ####   ###
                #   #  #  #  #  #  # #  #  #  #  #   #  #        #  #   #  #   #  #   # #  # #   #        #  #  # #  #  #  #  #   #
                #   #  ####  #  #### # ##   ###  #   #### #####  #  #   #  #   #  #   #  ### #   #  ##### ####  # #  ####  #  #   #
                #  ##  #     #  #     #    #  #  #   #           #  #   #  #   #  #   # #  # #  ##        #      #   #     #  #   #
                 ## ##  ### ###  ###  #### ####   ##  ###         #### ### ## ###  ###  ####  ## ##        ###   #    ### ### ##   ##
                                     #   #
                                      ###
                 */
                /**
                 * 委托unload事件:用户关闭网页或者刷新，保存用户购物车数据到cookie中
                 * @return {[type]} [description]
                 */
                $(window).unload(function() {
                    methods.getCartJson({
                        _this: $this,
                        callback: function(orderlist){
                            $.cookie(settings.cart_cookiename, JSON.stringify(orderlist));
                        }
                    });

                });
                //console.log("出来吧");
                //console.log("这是settings里面的"+settings.cart_cookiename);
                /**
                 *
                                       ##                    ##          ##
                                      # #                     #           #
                                      #                       #           #
                 ## # ## ##  ####    ###  ## ##  ####    ##   # ##   ##   #   ###  ## # ##
                  ##   #  #   #  #    #    #  #   #  #  #     ##  # #  #  #  #   #  # # #
                  #    #  #   #  #    #    #  #   #  #   #    #   # ####  #  #   #  # # #
                  #    #  #   #  #    #    #  #   #  #    #   #   # #     #  #   #   # #
                 ###    #### ### ##  ###    #### ### ## ##    ####   ### ###  ###    # #


                 */
                // 运行函数从cookie中初始化购物车
                initCartItemFromCookie($this, settings.cart_cookiename);
                //methods.val();
                //委托删除本条目的事件
                methods.deleteSelfItem($this);
                //委托点击减号较少食物数目事件
                methods.minusFoodNum($this);
                //委托点击加号增加食物数目事件
                methods.addFoodNum($this);
                //


            });
        },
        /*

                     ##
        #####         #                  ###
         #   #        #        #          #   #
         #    #  ##   #   ##  ###   ##    #  ###   ##  #### ##
         #    # #  #  #  #  #  #   #  #   #   #   #  #  #  #  #
         #    # ####  #  ####  #   ####   #   #   ####  #  #  #
         #   #  #     #  #     #   #      #   #   #     #  #  #
        #####    ### ###  ###   ##  ###  ###   ##  ### ### ## ##


         */
        /**
         * 委托删除本条目的事件
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        deleteSelfItem: function(thisBottomCart) {
            thisBottomCart.on('click', '.remove_thisitem', function(event) {

                /**
                 * 委托删除本条目事件
                 */
                event.preventDefault();
                //console.log("run here");
                var parent_li = $(this).parent();
                //删除自身
                console.log();
                //$(this).
                //当前条目的菜名
                var now_foodname = parent_li.find(".iteminfo_foodname").text();
                console.log("删除的菜名是：");
                console.log(now_foodname);
                tepm_foodnamels.splice($.inArray(now_foodname, tepm_foodnamels), 1);
                console.log("在数组中删除了该菜名后的数组是:");
                console.log(tepm_foodnamels);
                //最后删除自身条目
                parent_li.remove();
                //parent_li.find(".iteminfo_foodname").text();
                /* Act on the event */
            });
        },
        /*


          ####               ####                  ###
         #   #        #     #   #            #      #
        #        ##  ###   #      ###  ## # ###     #   ##  ###  ####
        #       #  #  #    #      #  #  ##   #      #  #   #   #  #  #
        #   ### ####  #    #       ###  #    #      #   #  #   #  #  #
         #   #  #     #     #   # #  #  #    #      #    # #   #  #  #
          ####   ###   ##    ###  #### ###    ##    #  ##   ###  ### ##
                                                    #
                                                  ##
         */
        /**
         * [getCartJson description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        getCartJson: function(options) {
            //填充 异化处理
            /*cart_options_now的格式
                            {
                                _this: $this,
                                callback: function() {
                                    console.log("do nothing");
                                }
                            }
             */
            var cart_options_now = $.extend({}, {
                _this: this
            }, options);
            //console.log("这是我处理后的this对象：");
            //console.log(cart_options_now._this);
            var orderlist = [];
            //var counter_loop = $(".cart_iteminfo li").length;
            //var counter_loop = $(".cart_iteminfo li").length;
            var counter_loop = cart_options_now._this.find('li').length;
            //console.log("计数器现在是："+counter_loop);
            cart_options_now._this.find('li').each(function() {
                //console.log($(this).find('.iteminfo_foodname').text());
                var this_foodname = $(this).find('.iteminfo_foodname').text();
                var this_foodnum = $(this).find('.iteminfo_num').text();
                var this_foodprice = $(this).find('.iteminfo_foodprice').text();
                //压入对象数组
                orderlist.push({
                    "foodname": this_foodname,
                    "foodnum": this_foodnum,
                    "foodprice": this_foodprice
                });
                counter_loop--;
                if (counter_loop === 0) {
                    options.callback(orderlist);
                }

            });
        },
        /*

                                                              ##
        ##     ##  #                     #####                 #
         ##   ##                          #  #                 #
         ##   ##  ##  ####   ## ##   ##   #     ###   ###   ####
         # # # #   #   #  #   #  #  #     ###  #   # #   # #   #
         # # # #   #   #  #   #  #   #    #    #   # #   # #   #
         #  #  #   #   #  #   #  #    #   #    #   # #   # #  ##
        ### # ### ### ### ##   #### ##   ###    ###   ###   ## ##


         */
        /**
         * 委托事件： 减号使食物数目减少
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        minusFoodNum: function(thisBottomCart) {
            thisBottomCart.on('click', '.iteminfo_minus', function(event) {
                event.preventDefault();
                //console.log("run here");
                var parent_li = $(this).parent();
                var jq_num = $(this).parent().find('.iteminfo_num');
                var now_foodname = parent_li.find(".iteminfo_foodname").text();

                var now_foodnum = jq_num.text();
                now_foodnum = parseInt(now_foodnum, 10);
                if (now_foodnum !== 0) {
                    jq_num.text(--now_foodnum);
                }
                if (now_foodnum === 0) {
                    tepm_foodnamels.splice($.inArray(now_foodname, tepm_foodnamels), 1);
                    parent_li.remove();
                }
                console.log("现在食物数量是");
                console.log(now_foodnum);
                console.log("食物数量减少了一份，现在的菜名数组是:");
                console.log(tepm_foodnamels);
                //console.log("获取的减号内容是：");
                //console.log($(this).text());

                //var now_foodnum = jq_num.text();

                //if()
                /* Act on the event */
            });
        },
        /*

                   ##     ##                        ##
           #        #      #   #####                 #
           #        #      #    #  #                 #
          # #    ####   ####    #     ###   ###   ####
          ###   #   #  #   #    ###  #   # #   # #   #
         #   #  #   #  #   #    #    #   # #   # #   #
         #   #  #  ##  #  ##    #    #   # #   # #  ##
        ### ###  ## ##  ## ##  ###    ###   ###   ## ##


         */
        /**
         * 委托事件： 减号使食物数目减少
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        addFoodNum: function(thisBottomCart) {
            thisBottomCart.on('click', '.iteminfo_plus', function(event) {
                event.preventDefault();
                //console.log("run here");
                var jq_num = $(this).parent().find('.iteminfo_num');

                var now_foodnum = jq_num.text();
                now_foodnum = parseInt(now_foodnum);
                jq_num.text(++now_foodnum);
                console.log("现在食物数量是");
                console.log(now_foodnum);
                console.log("食物数量增加了一份，现在的菜名数组是:");
                console.log(tepm_foodnamels);
                /* Act on the event */
            });
        },
        /**
         * 暂时不实现！！
         * @param  {[type]} options [description]
         * @return {[type]}         [description]
         */
        destroy: function(options) {
            // 在每个元素中执行代码
            return $(this).each(function() {
                var $this = $(this);

                // 执行代码

                // 删除元素对应的数据
                $this.removeData("bottomCart");
            });
        },
        /**
         * 暂时不实现！！
         * @param  {[type]} options [description]
         * @return {[type]}         [description]
         */
        val: function(options) {
            // 自定义返回值
            //var someValue = this.eq(0).html();

            // 返回值
            //return someValue;
            console.log("i am the value");
        }
    };
    /*

      #                                       ##
     ###   #####         #####   #             #   #
    #  #    #  #          #   #                #
    ##      #    ####     #   # ##  ####    ####  ##  ####    ####
     ##     ###   #  #    ####   #   #  #  #   #   #   #  #  #  #
      ##    #     #  #    #   #  #   #  #  #   #   #   #  #  # ##
    #  #    #     #  #    #   #  #   #  #  #  ##   #   #  #   #
    ###  # ###   ### ##  #####  ### ### ##  ## ## ### ### ##  ####
     #                                                       #   #
                                                              ###
     */
    /**
     * 绑定到$  核心步骤
     * @return {[type]} [description]
     */
    $.fn.bottomCart = function() {
        var method = arguments[0];

        if (methods[method]) {
            //method成为函数引用
            method = methods[method];
            //在参数集合中剔除方法名，获得传入的该方法的参数
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof method === "object" || !method) {
            //如果不存在指定的方法
            method = methods.init;
        } else {
            //err
            $.error("Method" + method + "does not exist on jQuery.bottomCart");
            return this;
        }
        //以此方法和获得的参数调用当前对象
        return method.apply(this, arguments);

    };

})(jQuery);
