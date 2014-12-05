/**
 * KO-菜单列表部分
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
var MenuListVM = (function($) {
    /**
     * 函数重载 菜单列表模型
     * 1.foodname,foodnum,foodprice
     * 2.foodname,foodprice
     * @param {[type]} foodname  [description]
     * @param {[type]} foodnum   [description]
     * @param {[type]} foodprice [description]
     */
    function MenuListItem() {
        var self = this;
        var arg_len = arguments.length;
        //三个参数:foodname,foodnum,foodprice
        //foodname总是第一个参数
        self.foodname = arguments[0];
        if (arg_len == 3) {
            self.foodnum = ko.observable(arguments[1]);
            self.foodprice = arguments[2];
        } else {
            //两个参数:foodname,foodprice
            self.foodnum = ko.observable(0);
            self.foodprice = arguments[1];
        }
        // self.foodname = foodname;
        // self.foodnum = ko.observable(foodnum);
        // //self.foodnum = foodnum;
        // self.foodprice = foodprice;
        self.formattedPrice = ko.computed(function() {
            //返回格式化之后的价格
            return self.foodprice.toFixed(1);
        });

    }
    //初始化时从cookie中显示数量小数字
    function showMenuNumFromCookie(itslist) {
        var cart_Arr = [];
        if ($.cookie("cart_cookie")) {
            //json对象from cookie
            console.log("run here");
            var cart_cookie_Arr = $.parseJSON($.cookie("cart_cookie"));
            //$.cookie("cart_cookie",JSON.stringify(cart_cookie_Arr));
            for (var cookie_i = 0, cookie_len = cart_cookie_Arr.length; cookie_i < cookie_len; cookie_i++) {
                cart_Arr.push(new MenuListItem(cart_cookie_Arr[cookie_i].foodname, cart_cookie_Arr[cookie_i].foodnum, cart_cookie_Arr[cookie_i].foodprice));
            }
            //console.log("now this is cookie in this computer");
            //console.log($.parseJSON($.cookie("cart_cookie")));
            //console.log($.cookie("cart_cookie"));

        }
        console.log("cart_Arr is:");
        console.log(cart_Arr);
        return $.extend({}, itslist, cart_Arr);
    }
    /**
     * ViewModel-Public Area
     * @return {[type]} [description]
     */
    return function() {
        var self = this;
        //设置成监视型，以免异步操作造成应用到的数组为空
        self.menulists = ko.observableArray();
        $.getJSON("menulist", function(json_menuls) {
            for (var i = json_menuls.length - 1; i >= 0; i--) {
                self.menulists.unshift(new MenuListItem(json_menuls[i].name, json_menuls[i].price));
                if (!i) {
                    //when it over do the following thing
                    //self.menulists = showMenuNumFromCookie(self.menulists());
                    if ($.cookie("cart_cookie")) {
                        //json对象from cookie
                        console.log("i read cookie");
                        var cart_cookie_Arr = $.parseJSON($.cookie("cart_cookie"));
                        var temp_cart = [];
                        for (var j = cart_cookie_Arr.length - 1; j >= 0; j--) {
                            temp_cart.unshift(new MenuListItem(cart_cookie_Arr[i].foodname, cart_cookie_Arr[i].foodnum, cart_cookie_Arr[i].foodprice));
                        }
                        //此处合并 出现异常
                        //self.menulists = $.extend({}, self.menulists(), temp_cart);
                        //console.log($.extend({}, self.menulists(), temp_cart));

                        //$.cookie("cart_cookie",JSON.stringify(cart_cookie_Arr));
                        //console.log("now this is cookie in this computer");
                        //console.log($.parseJSON($.cookie("cart_cookie")));
                        //console.log($.cookie("cart_cookie"));

                    }
                    //showMenuNumFromCookie(self.menulists;
                    //console.log($.parseJSON(self.menulists);
                }
            };


        });
        //貌似暂时没什么用
        self.addFoodnum = function(menuitem) {
            //self.foodlists.remove(foodlist);
            menuitem.foodnum(parseInt(menuitem.foodnum(), 10) + 1);
            //console.log("run into addFoodnum");
        };
        //动画效果：用户点击加号，直线飞行小方块进入购物车
        self.dropFoodIntoCart = function(menuitem, ele) {
            //var $target = DATH.Event.getJQTarget(event);
            var $ele = $(ele);
            //$(element).offset.top and left 是数值型
            //事件源元素位置
            var element_pos = {
                top: $ele.offset().top,
                left: $ele.offset().left
            };
            //购物车图标位置
            var $cart = $(".cart_icon");
            var cart_pos = {
                top: $cart.offset().top,
                left: $cart.offset().left
            };
            //slope:斜率
            //var slope = (cart_pos.top - element_pos.top) / (cart_pos.left - element_pos.left);
            var foodprice = menuitem.foodprice;

            //var target_top = $ele.offset().top;
            //var target_left = $ele.offset().left;
            //console.log(target_top + target_left);
            console.log("源:");
            console.log(element_pos.top + "  " + element_pos.left);
            console.log("购物车:");
            console.log(cart_pos.top + "  " + cart_pos.left);
            //console.log(slope);



            var testCssAnimation = $("<div></div>");
            testCssAnimation.appendTo(".container").addClass("item_test anim_test");
            //在点击加号的地方显示div
            // testCssAnimation.css({

            // })




            //创建的div元素
            var flying_ball = $("<div>" + foodprice + "</div>");
            //在点击加号的地方显示div
            flying_ball.css({
                "line-height": "1.2em",
                "width": "1.1em",
                "text-align": "center",
                "height": "1.1em",
                "background-color": "#faab80",
                "position": "absolute",
                "font-size": "1.3em",
                "color": "#fff",
                "top": element_pos.top,
                "left": element_pos.left
            }).appendTo('.container').animate({
                "top": cart_pos.top,
                "left": cart_pos.left,
                "opacity": 0
            }, "normal", "linear", function() {
                $(this).remove();
            });
            //$("<div/>").css("border", "solid 1px #FFOOOO").html("动态创建的div").appendTo(testDiv);


            //console.log("you win");
        };
        //貌似暂时没什么用
        self.isNumZero = function(menuitem) {
            //self.foodlists.remove(foodlist);
            console.log("菜单的数字");
            console.log(parseInt(menuitem.foodnum(), 10));
            return parseInt(menuitem.foodnum(), 10);
            //menuitem.foodnum(parseInt(menuitem.foodnum(), 10) + 1);

        };
        var sort_flag = true;
        /**
         * 按价格排序
         * @return {[type]} [description]
         */
        self.sortPrice = function() {
            //self.foodlists.remove(foodlist);
            //console.log("菜单的数字");
            //console.log(parseInt(menuitem.foodnum(), 10));
            //return parseInt(menuitem.foodnum(), 10);
            //var sort_flag = self.menulists[0] - self.menulists[self.menulists().length - 1];
            if (sort_flag) {
                self.menulists.sort(function(a, b) {
                    if (a.foodprice < b.foodprice)
                        return -1;
                    if (a.foodprice > b.foodprice)
                        return 1;
                    return 0;
                });
                sort_flag = false;
            } else {
                self.menulists.reverse();
            }
            //menuitem.foodnum(parseInt(menuitem.foodnum(), 10) + 1);

        };
        /**
         * 按食物排序  暂未实现
         * @return {[type]} [description]
         */
        self.sortPrice2 = function() {
            //self.foodlists.remove(foodlist);
            //console.log("菜单的数字");
            //console.log(parseInt(menuitem.foodnum(), 10));
            //return parseInt(menuitem.foodnum(), 10);
            //var sort_flag = self.menulists[0] - self.menulists[self.menulists().length - 1];
            if (sort_flag) {
                self.menulists.sort(function(a, b) {
                    // if (a.foodprice < b.foodprice)
                    //     return -1;
                    // if (a.foodprice > b.foodprice)
                    //     return 1;
                    // return 0;
                    return a.foodname.localeCompare(b.foodname, ["zh-CN-u-co-pinyin"])
                });
                sort_flag = false;
            } else {
                self.menulists.reverse();
            }
            //menuitem.foodnum(parseInt(menuitem.foodnum(), 10) + 1);

        };
        //self.menulists = [new MenuListItem("青椒肉丝盖浇饭", 8), new MenuListItem("鱼香肉丝盖浇饭", 7), new MenuListItem("西红柿鸡蛋盖浇饭", 8)];


    }

})(jQuery);
//Menulist KO化
//ko.applyBindings(new MenuListVM());
//集中在KO_Manager.js文件运行
