/**
 * KO-购物车部分
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
var CartOrderVM = (function($) {
    /**
     * 菜单项model  暂时不用
     * @param {[type]} foodname  [description]
     * @param {[type]} foodprice [description]
     */
    function MenuItem(foodname, foodprice) {
        var self = this;
        self.foodname = foodname;
        self.foodprice = foodprice;
    }
    /**
     * 购物车菜单项model constructor
     * @param {[type]} foodname  [description]
     * @param {[type]} foodnum   [description]
     * @param {[type]} foodprice [description]
     */
    function CartOrderItem(foodname, foodnum, foodprice) {
        var self = this;
        self.foodname = foodname;
        self.foodnum = ko.observable(foodnum);
        //self.foodnum = foodnum;
        self.foodprice = foodprice;
        self.formattedPrice = ko.computed(function() {
            //返回格式化之后的价格
            return foodprice.toFixed(1);
        });

    }
    /**
     * ViewModel-Public Area
     * @return {[type]} [description]
     */
    return function() {
        var self = this;
        //menu_json是全局json数组
        //console.log(menu_json);
        //self.menuitems = ko.observableArray(menu_json);
        //var cart_cookie_Arr = [new CartOrderItem("青椒肉丝盖浇饭", 1, 8)];
        var cart_Arr = [];
        console.log("cookie show here");
        //$.cookie("cart_cookie","")
        console.log($.cookie("cart_cookie"));
        //if ($.cookie()) {
        //
        //构建监视数组
        //console.log("from cookie i get this:");
        //console.log(cart_cookie_Arr);
        //
        if ($.cookie("cart_cookie")) {
            //json对象from cookie
            console.log("run here");
            var cart_cookie_Arr = $.parseJSON($.cookie("cart_cookie"));
            //$.cookie("cart_cookie",JSON.stringify(cart_cookie_Arr));
            for (var cookie_i = 0, cookie_len = cart_cookie_Arr.length; cookie_i < cookie_len; cookie_i++) {
                cart_Arr.push(new CartOrderItem(cart_cookie_Arr[cookie_i].foodname, cart_cookie_Arr[cookie_i].foodnum, cart_cookie_Arr[cookie_i].foodprice));
            }
            //console.log("now this is cookie in this computer");
            //console.log($.parseJSON($.cookie("cart_cookie")));
            //console.log($.cookie("cart_cookie"));

        }
        self.username_disabled = ko.observable(false);
        //用户名 observable 无初始值
        self.username = ko.observable();
        if ($.cookie("username")) {
            self.username($.cookie("username"));
        }
        //食物列表 observableArray 无初始值
        self.foodlists = ko.observableArray(cart_Arr);
        //总价 computed
        self.totalCharge = ko.computed(function() {
            var total = 0;
            for (var i = 0, len = self.foodlists().length; i < len; i++) {
                //console.log("我的价格是：");
                //console.log(parseFloat(self.foodlists()[i].foodprice));
                total += parseFloat(self.foodlists()[i].foodprice) * parseInt(self.foodlists()[i].foodnum(), 10);
            }
            return total.toFixed(1);
        });
        //食品总量 computed
        self.totalNum = ko.computed(function() {
            var totalnum = 0;
            for (var i = 0, len = self.foodlists().length; i < len; i++) {
                var item_num = parseInt(self.foodlists()[i].foodnum(), 10);
                totalnum += item_num;
            }
            return totalnum;
        });
        /**
         * 返回食物列表json数据
         * @return {json} [食物列表json]
         */
        self.getFoodListJson = function() {
            var the_foodlists_json = [];
            for (var j = 0, len = self.foodlists().length; j < len; j++) {
                the_foodlists_json.push({
                    foodname: self.foodlists()[j].foodname,
                    foodnum: self.foodlists()[j].foodnum(),
                    foodprice: self.foodlists()[j].foodprice
                });
            }
            //self.foodlists
            return the_foodlists_json;
        };
        /**
         * 点击发送按钮，发送购物车数据
         * @return {[type]} [description]
         */
        self.sendCartAjax = function() {
            //console.log("获得到的用户名是：");
            //console.log(self.username());
            //后台验证
            // if (self.username() == "") {
            //     alert("请填写姓名");
            //     return;
            // }
            // 增加用户名cookie
            $.cookie("username", self.username());
            if (!self.getFoodListJson().length) {
                //console.log("no length");
                alert("购物车是空的");
                return ;
            }
            // log
            //console.log("json below");
            //console.log(self.getFoodListJson());
            //使购物车中的用户名失效
            self.username_disabled(true);
            $.ajax({
                beforeSubmit: function() {
                    //before submit do some check here
                },
                url: "/orderlist/",
                data: {
                    "username": $.trim(self.username()),
                    "orderlist": self.getFoodListJson(),
                    "total_num": self.totalNum(),
                    "total_charge": self.totalCharge()
                },
                type: 'POST',
                success: viewModel.OrderHistoryVM.addNewHisItem
            });
        };
        /**
         * 用户输入数字有效性检测并修复
         * @param  {[type]} foodlist [description]
         * @return {[type]}          [description]
         */
        self.checkNumValid = function(foodlist) {
            //var this_num = parseInt(foodlist.foodnum(), 10);
            var numReg = /^[1-9]+\d{0,2}$/g;
            var num_str = foodlist.foodnum() + "";
            //限定字符长度为3
            if (numReg.test(num_str) && (num_str.length < 4)) {
                console.log("now the num is" + num_str);
                console.log("  and the num is right");
            } else {
                //未进行alert提示用户直接将错误的输入替换为1
                console.log("the num is not valid");
                foodlist.foodnum("1");
            }


        };
        /**
         * 清空购物车
         * @return {[type]} [description]
         */
        self.clearCart = function() {
            //使用self.foodlists().length=0无效
            self.foodlists([]);
        };
        var state = {
            popup_cart: false
        };
        /**
         * 收起购物车
         * @return {[type]} [description]
         */
        self.downHideCart = function(elem) {
            //使用self.foodlists().length=0无效
            //self.foodlists([]);
            console.log("down run ");
            var $cart_tables = $(elem).parent().next(".cart_tablels");
            //console.log($(elem).html());
            if (!state.popup_cart) {
                $(elem).css("background-image", "url(img/orange_arrow_up3.png)");
                //console.log($(elem).css("background-image"));
                $cart_tables.hide();

                // $cart_tables.animate({
                //     height: "toggle"
                // }, "slow");
                state.popup_cart = true;
            } else {
                $(elem).css("background-image", "url(img/orange_arrow_down2.png)");
                $cart_tables.show();
                state.popup_cart = false;
            }
            //$(elem).parent().next(".cart_tablels").toggle('slow');
        };
        /**
         * 点击 减号- 减少食品数量操作
         * @param  {[type]} foodlist [description]
         * @return {[type]}          [description]
         */
        self.minusFoodnum = function(foodlist) {
            var this_num = parseInt(foodlist.foodnum(), 10);
            //console.log("hah");
            foodlist.foodnum(--this_num);
            //减到0 remove 此项
            if (!this_num) {
                //console.log("now one is be 0");
                self.foodlists.remove(foodlist);
            }
        };
        /**
         * 点击 加号+ 增加食品数量操作
         * @param {[type]} foodlist [description]
         */
        self.addFoodnum = function(foodlist) {
            //self.foodlists.remove(foodlist);
            foodlist.foodnum(parseInt(foodlist.foodnum(), 10) + 1);

        };
        /**
         * 删除当前一整条数据项
         * @param  {[type]} foodlist [description]
         * @return {[type]}          [description]
         */
        self.removeList = function(foodlist) {
            self.foodlists.remove(foodlist);
        };
        /**
         * !!停止使用 保留以作参考
         * 用户点击菜单项，根据不同情况向购物车添加数据项   从没有绑定式标签获得数据：使用event
         * @param  {[type]} menuitem 默认发送自身项中数，在没有绑定监视数据的元素上触发无效
         * @param  {[type]} event    点击事件，用于获取点击事件源
         * @return {[type]}          [description]
         */
        self.userAddInMenu = function(menuitem, event) {
            //$(event.target).html();
            //console.log("userAddInMenu run");

            var target;

            if (event.target) target = event.target;
            else if (event.srcElement) target = event.srcElement;

            if (target.nodeType == 3) // defeat Safari bug
                target = target.parentNode;
            var $target = $(target);
            //console.log("这是我显示的：前一个：");
            //console.log($target.prev().text().trim());
            //点击的菜单项的菜名
            var item_foodname = $target.prev().text().trim();
            //console.log("后一个：");
            //console.log($target.next().text().trim());
            //点击的菜单项的价格
            var item_foodprice = $target.next().text().trim();
            //var add_flag = true;
            var t = self.foodlists().length;
            while (true) {
                if (t == 0) {
                    //console.log($(".cart_icon").attr("src"));
                    console.log("this food need to put");

                    //console.log("还没有这个菜");
                    self.foodlists.unshift(new CartOrderItem(item_foodname, 1, parseFloat(item_foodprice)));
                    t = self.foodlists().length;
                    break;
                }

                if (self.foodlists()[t - 1].foodname == item_foodname) {
                    //add_flag = false;
                    console.log("已经有这个菜了");
                    self.foodlists()[t - 1].foodnum(parseInt(self.foodlists()[t - 1].foodnum(), 10) + 1);
                    break;
                }
                t--;

            }

        };
        /**
         * 用户点击菜单项，根据不同情况向购物车添加数据项:已存在和还未存在
         * @param  {[type]} menuitem 默认发送自身项中数，在没有绑定监视数据的元素上触发无效
         * @param  {[type]} event    点击事件，用于获取点击事件源
         * @return {[type]}          [description]
         */
        self.putIntoCart = function(menuitem) {
            $(".cart_icon").attr("src", "img/drop_goodsin_cart.gif");
            var t = self.foodlists().length;
            while (true) {
                if (t == 0) {
                    //console.log();
                    console.log("还没有这个菜");
                    self.foodlists.unshift(new CartOrderItem(menuitem.foodname, 1, parseFloat(menuitem.foodprice)));
                    t = self.foodlists().length;
                    break;
                }

                if (self.foodlists()[t - 1].foodname == menuitem.foodname) {
                    //add_flag = false;
                    console.log("已经有这个菜了");
                    self.foodlists()[t - 1].foodnum(parseInt(self.foodlists()[t - 1].foodnum(), 10) + 1);
                    break;
                }
                t--;

            }

        };
        //删除数组中每一项的显示效果
        self.hideCartItem = function(elem) {
            // if (elem.nodeType === 1) $(elem).fadeOut(150, function() {
            //     $(elem).remove();
            // });
            // $('#object').hide('slow').queue(function(next){
            //     $(this).appendTo($('#goal'));
            //     next();
            // }).show('slow');

            // $(elem).removeClass('anim_cartitem_show').queue(function(next) {
            //     //;
            //     $(this).addClass('anim_cartitem_hide');
            //     console.log("you run here");
            //     next();
            // });
            $(elem).removeClass('anim_cartitem_show').addClass('anim_cartitem_hide');
            setTimeout(function() {
                $(elem).remove();
            }, 200);
            //console.log($(elem).parent('tbody').html());
            //cart_tablels
            //console.log($(elem).parents('.cart_tablels').className);



            // $(elem).removeClass('anim_cartitem_show').addClass('anim_cartitem_hide');
            // $(elem).remove();

        };
        //增加数组中的每一项的显示效果
        self.showCartItem = function(elem) {
            //elem:foreach中包含的DOM内容,使用可以经过$包装
            //if (elem.nodeType === 1) $(elem).hide().slideDown('slow');
            //先隐藏，后淡入
            //$(elem).hide().fadeIn();
            //$(elem).hide();

            $(elem).addClass('anim_cartitem_show');
            //$(elem).hide();


            // $(elem).css("animation", "cart_item_show 1s infinite");
            // $(elem).css("-webkit-animation", "cart_item_show 1s infinite");


            //console.log("add one item");
        };
    }

})(jQuery);




//购物车KO化
//ko.applyBindings(new CartOrderVM());
/**
 * unload事件委托:
 * @return {[type]} [description]
 */
$(window).unload(function() {
    $.cookie("cart_cookie", JSON.stringify(viewModel.CartOrderVM.getFoodListJson()));
});
