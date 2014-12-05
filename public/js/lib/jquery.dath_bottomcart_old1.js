(function($) {
    $.fn.bottomCart = function(options) {
        //菜名列表缓存列表
        var tepm_foodnamels = [];
        var defaults = {
            /*
            默认ul的query string为空，如果用户不传query string，插件无法运行
             */
            ul_querystring: "",
            cart_cookiename: ""

        };
        var options = $.extend(defaults, options);
        //如果ul_querystring为空 直接返回
        if (options.ul_querystring === "") {
            console.log("no necessary param:ul_querystring");
            return;
        }
        //使用this.each  但是此时只操作一个购物车对象
        this.each(function() {
            //当前购物车
            var thisBottomCart = $(this);
            //获取ul对象
            var menu_ul = $(options.ul_querystring);
            //委托点击事件到.item img
            menu_ul.on('click', '.item img', function(event) {
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
                console.log("购物车插件获得的菜名是:" + name);
                console.log("购物车插件获得的价格是:" + price);
                putOrderIntoCart(thisBottomCart, name, price);
            });

            /**
             * 委托事件： 删除本条目的事件
             * @param  {[type]} event [description]
             * @return {[type]}       [description]
             */
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
            /**
             * 委托事件： 减号使食物数目减少
             * @param  {[type]} event [description]
             * @return {[type]}       [description]
             */
            thisBottomCart.on('click', '.iteminfo_minus', function(event) {
                event.preventDefault();
                //console.log("run here");
                var parent_li = $(this).parent();
                var jq_num = $(this).parent().find('.iteminfo_num');
                var now_foodname = parent_li.find(".iteminfo_foodname").text();

                var now_foodnum = jq_num.text();
                now_foodnum = parseInt(now_foodnum);
                if (now_foodnum != 0) {
                    jq_num.text(--now_foodnum);
                }
                if (now_foodnum == 0) {
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
            /**
             * 委托事件： 加号使食物数目增多
             * @param  {[type]} event [description]
             * @return {[type]}       [description]
             */
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
            /**
             * 自动运行，查询获取cookie，并根据数据初始化购物车
             * @return {[type]} [description]
             */
            (function() {
                //console.log("什么情况");
                if ($.cookie()) {
                    var new_cart = jQuery.parseJSON($.cookie('my_ordercart'));
                    console.log("一开始cookie中的json是：");
                    console.log(new_cart);
                    for (var len = new_cart.length,i=len-1 ; i >=0; i--) {
                        //var item = new_cart[i];
                        tepm_foodnamels.push(new_cart[i].foodname);
                        var new_order_li = "<li><span class='iteminfo_foodname'>" + new_cart[i].foodname +
                            "</span><a href='#' class='iteminfo_minus'>-</a><span class='iteminfo_num'>" + new_cart[i].foodnum + "</span>" +
                            "<a href='#' class='iteminfo_plus'>+</a>￥<span class='iteminfo_foodprice'>" + new_cart[i].foodprice +
                            "</span><a href='#' class='remove_thisitem'>删除</a></li>";
                        thisBottomCart.prepend(new_order_li);
                    }
                    console.log("起初购物车中的食物是：");
                    console.log(tepm_foodnamels);
                    /*
                    $.each(new_cart, function(index, val) {

                        tepm_foodnamels.push(new_cart.foodname);
                        var new_order_li = "<li><span class='iteminfo_foodname'>" + new_cart.foodname +
                            "</span><a href='#' class='iteminfo_minus'>-</a><span class='iteminfo_num'>" + new_cart.foodnum + "</span>" +
                            "<a href='#' class='iteminfo_plus'>+</a>￥<span class='iteminfo_foodprice'>" + new_cart.foodprice +
                            "</span><a href='#' class='remove_thisitem'>删除</a></li>";
                        thisBottomCart.prepend(new_order_li);
                    });
                    */


                }
            })();

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
            function putOrderIntoCart(thisBottomCart, name, price) {
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
                     */
                    var new_order_li = "<li><span class='iteminfo_foodname'>" + name +
                        "</span><a href='#' class='iteminfo_minus'>-</a><span class='iteminfo_num'>1</span>" +
                        "<a href='#' class='iteminfo_plus'>+</a>￥<span class='iteminfo_foodprice'>" + price +
                        "</span><a href='#' class='remove_thisitem'>删除</a></li>";
                    //new_order_li="<li>加入了</li>";
                    thisBottomCart.prepend(new_order_li);

                }
                console.log("现在的菜名数组是");
                console.log(tepm_foodnamels);
            }
        });
    };
})(jQuery);
