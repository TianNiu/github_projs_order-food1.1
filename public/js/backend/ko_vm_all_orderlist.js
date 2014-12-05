/**
 * KO-订餐历史部分
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
var OrderListVM = (function($) {

    function OrderHistoryItem() {
        var self = this;

        self.foodnum = ko.observable(0);
        self.foodprice = arguments[1];

        // self.foodname = foodname;
        // self.foodnum = ko.observable(foodnum);
        // //self.foodnum = foodnum;
        // self.foodprice = foodprice;
        self.formattedPrice = ko.computed(function() {
            //返回格式化之后的价格
            return self.foodprice.toFixed(1);
        });

    }
    //
    function getStatisticsFromJson(json_menuls, json_data) {
        console.log("json_menuls:  " + JSON.stringify(json_menuls));
        console.log("json_data  " + JSON.stringify(json_data));
        var menuls_arr = [];
        var menu_count = [];
        var all_total_num = 0;
        var all_total_charge = 0;
        //var hehe = json_menuls.length - 1;
        //使用for使数组和menuls保持顺序一致
        //for (var t = hehe; t > = 0; t--) {};
        // var new_orders = json_menuls.forEach(function(element) {
        //     //return something;
        //     menuls_arr.push(element.name);

        // });
        for (var i = json_menuls.length - 1; i >= 0; i--) {
            menuls_arr.unshift(json_menuls[i].name);
            menu_count.unshift(0);
        };
        console.log("here is i get the menuls_arr:");
        console.log(menuls_arr);
        json_data.forEach(function(element) {
            //var num_tp = parseInt(element.foodnum);
            all_total_num += parseInt(element.total_num);
            all_total_charge += parseInt(element.total_charge);
            //return something;
            //menuls_arr.push(element.name);
            //建立两个数组的对应关系
            var ele_list_arr = element.orderlist;
            for (var g = (ele_list_arr.length - 1); g >= 0; g--) {
                //获得在数组中的索引
                var pos_index = $.inArray(ele_list_arr[g].foodname, menuls_arr);
                var num_tp = parseInt(ele_list_arr[g].foodnum);
                //对应位置上的数据加成
                menu_count[pos_index] += num_tp;
            }

        });
        return {
            menuls_arr: menuls_arr,
            menu_count: menu_count,
            all_total_num: all_total_num,
            all_total_charge: all_total_charge
        };
    }

    /**
     * ViewModel-Public Area
     * @return {[type]} [description]
     */
    return function() {

        var self = this;
        var now_menuls = [];
        //定义一个监视数组,负责接收从后台传送来的数据
        self.OrderListItems = ko.observableArray();
        //!!!!!!!获得用户名后修改(从cookie或者实现身份认证逻辑)
        //var username = "111";
        self.ispaid_disabled = ko.observable(false);
        self.username = ko.observable();
        if ($.cookie("username")) {
            self.username($.cookie("username"));
        }
        /**
         * 统计数据
         * @type {Object}
         */
        //存储对JSON中的订餐数据进行处理后的对象
        self.staticdata = {};
        self.all_total_num = ko.observable();
        self.all_total_charge = ko.observable();
        self.orderStaticsArr = ko.observableArray();
        //viewModel.CartOrderVM.username
        //初始化
        //页面加载时初始化订餐历史
        self.initOrderHistory = function(cb) {
            //self.username(viewModel.CartOrderVM.username());
            //console.log("now i get the cart username:" + self.username());
            //获得当前菜单数据
            $.ajax({
                beforeSubmit: function() {
                    //before submit do some check here
                },
                url: "/menulist",
                type: 'GET',
                success: function(menulist_json) {
                    //console.log(data);
                    //貌似只能读不能写

                    //self.OrderListItems(data);
                    //复制到局部变量中
                    //获得用户订单数据
                    $.ajax({
                        beforeSubmit: function() {
                            //before submit do some check here
                        },
                        url: "/orderlist",
                        type: 'GET',
                        success: function(orderlis_json) {
                            //console.log(data);
                            //貌似只能读不能写

                            //self.OrderListItems(data);
                            cb(menulist_json, orderlis_json);
                        }
                    });
                    //now_menuls = menulist;
                }
            });

        };
        //getter: self.staticdata
        self.getStaticJson = function() {
            return self.staticdata;
        };
        //调用初始化函数
        self.initOrderHistory(function(menulist_json, orderlis_json) {
            //深复制 暂停使用
            // var newdata = jQuery.extend(true, {}, data);
            // data.forEach(function(index, element) {
            //     element.ispaid_disabled = false;
            // });
            // data:订单数据 json
            self.OrderListItems(orderlis_json);
            //对data json进行统计处理
            //希望的参数：data   返回值改造之后的json对象，不必绑定监视
            //!!!!!!here
            self.staticdata = getStatisticsFromJson(menulist_json, orderlis_json);
            for (var i = self.staticdata.menuls_arr.length - 1; i >= 0; i--) {
                //self.staticdata.soga1[i];
                //console.log(self.staticdata.menuls_arr[i] + self.staticdata.menu_count[i]);
                //构造 self.staticdata json，菜名和对应数量的组合
                self.orderStaticsArr.unshift({
                    foodname: self.staticdata.menuls_arr[i],
                    foodnum: self.staticdata.menu_count[i]
                });
            }
            self.all_total_num(self.staticdata.all_total_num);
            self.all_total_charge(self.staticdata.all_total_charge);

            //console.log(data);
        });
        //self.OrderListItems.unshift(test_it);
        /**
         * 用户提交成功后调用，加入到当天订餐记录中
         * @param {[type]} new_item_json [description]
         */
        self.changeIspaidText = function(listitem, event) {
            //self.OrderListItems.unshift(new_item_json);
            //listitem.ispaid("确认付款");
            //listitem.ispaid="asd";
            //console.log(listitem.ispaid);
            // var target;

            // if (event.target) target = event.target;
            // else if (event.srcElement) target = event.srcElement;

            // if (target.nodeType == 3) // defeat Safari bug
            //     target = target.parentNode;
            // var $target = $(target);
            var $target = DATH.Event.getJQTarget(event);
            //console.log("这是我显示的：前一个：");
            //console.log($target.prev().text().trim());
            if ("未付款" == $target.text()) { /*主要针对鼠标mouseenter事件*/
                $target.text("点击付款");
                return;
            }
            if ("点击付款" == $target.text()) { /*主要针对鼠标mouseleave事件*/
                $target.text("未付款");
            } else { /*针对已付款的接触一切事件绑定*/
                $target.unbind();
            }


        };
        //根据ispaid的值决定应用的类 变量类型
        // self.paid_class = ko.computed(function(listitem) {
        //     //return 'grey';
        //     //console.log("付款了没");
        //     //console.log(listitem.ispaid);
        //     if ('未付款' == listitem.ispaid) {

        //         return 'red';
        //     } else {
        //         return 'grey';
        //     }
        // });
        self.paid_class = function(listitem) {
            //return 'grey';
            //console.log("付款了没");
            //console.log(listitem.ispaid);
            if ('未付款' == listitem.ispaid) {

                return 'red';
            } else {
                return 'grey';
            }
        };
        self.payTheBill = function(listitem, event) {
            //self.ispaid_disabled(true);
            // var target;

            // if (event.target) target = event.target;
            // else if (event.srcElement) target = event.srcElement;

            // if (target.nodeType == 3) // defeat Safari bug
            //     target = target.parentNode;
            // var $target = $(target);
            var $target = DATH.Event.getJQTarget(event);
            console.log("you click on me");
            $target.text("已付款");
            //console.log(listitem.username);
            //console.log(listitem.ispaid);
            //listitem.ordertime
            //event.stopPropagation();
            //event.cancelBubble = true;
            //当点击后此元素解绑任何事件

            $target.unbind();
            //原来的
            // $.ajax({
            //     beforeSubmit: function() {
            //         //before submit do some check here
            //     },
            //     url: "/orderlist/" + listitem.username + "&" + listitem.ordertime,
            //     type: 'PUT',
            //     success: function(data) {
            //         //console.log(data);
            //         //貌似只能读不能写

            //         //self.OrderListItems(data);
            //         //cb(data);
            //         if ("updateOK" == data) {
            //             //alert(data);
            //             $target.css("color", "grey");
            //         }

            //     }
            // });

            $.ajax({
                beforeSubmit: function() {
                    //before submit do some check here
                },
                url: "/orderlist/" + listitem.order_number,
                type: 'PUT',
                success: function(data) {
                    //console.log(data);
                    //貌似只能读不能写

                    //self.OrderListItems(data);
                    //cb(data);
                    if ("updateOK" == data) {
                        //alert(data);
                        $target.css("color", "grey");
                    }

                }
            });
        };
        //toggle
        self.toggleDetailInfo = function(itself, event) {
            //self.OrderHisItems.unshift(new_item_json);
            var $target = DATH.Event.getJQTarget(event);
            //var $hidden_title=$target.parents(".today_order_title")||$target;
            var $hidden_title = ("order_item_title" == $target.attr('class')) ? $target : $target.parents(".order_item_title");
            // if ("today_order_title" == $target.attr('class')) {
            //     //console.log("the right classname");
            //     $hidden_title = $target;
            // }else{

            // }
            //console.log($hidden_title.attr('class'));
            console.log("run here");
            //获取下面内容元素的存在display属性
            var its_display = $hidden_title.next().css("display");
            if ("none" == its_display) {
                $hidden_title.css("backgroundImage", "url('../img/orange_arrow_down.png')");
            } else {
                $hidden_title.css("backgroundImage", "url('../img/orange_arrow_toright.png')");
            }
            //$hidden_title.next().toggle();
            $hidden_title.next().animate({
                height: 'toggle',
                opacity: 'toggle'
            }, 200);
            //$hidden_title.next().next().toggle();
            // $hidden_title.next().next().animate({
            //     height: 'toggle',
            //     opacity: 'toggle'
            // }, "fast");
        };
    };

})(jQuery);
//OrderHistory KO化
//ko.applyBindings(new OrderHistoryVM());
//集中在KO_Manager.js文件运行
