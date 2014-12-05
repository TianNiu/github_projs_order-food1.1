/**
 * KO-订餐历史部分
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
var OrderHistoryVM = (function($) {

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
    //返回JQ事件源
    // function getJQTarget(event) {
    //     var target;

    //     if (event.target) target = event.target;
    //     else if (event.srcElement) target = event.srcElement;

    //     if (target.nodeType == 3) // defeat Safari bug
    //         target = target.parentNode;
    //     return $(target);
    // }
    /**
     * ViewModel-Public Area
     * @return {[type]} [description]
     */
    return function() {
        var self = this;
        //只定义一个监视数组,负责接收从后台传送来的数据
        self.OrderHisItems = ko.observableArray();
        //!!!!!!!获得用户名后修改(从cookie或者实现身份认证逻辑)
        //var username = "111";

        self.username = ko.observable();
        if ($.cookie("username")) {
            self.username($.cookie("username"));
        }
        //表格内容是否折叠监控量
        //self.content_hidden = ko.observable(false);
        //viewModel.CartOrderVM.username
        //初始化
        //页面加载时初始化订餐历史
        self.initOrderHistory = function() {
            //self.username(viewModel.CartOrderVM.username());
            console.log("now i get the cart username:" + self.username());
            $.ajax({
                beforeSubmit: function() {
                    //before submit do some check here
                },
                url: "/orderlist/" + self.username(),
                type: 'GET',
                success: function(data) {
                    //console.log(data);
                    self.OrderHisItems(data);
                }
            });
        };
        //self.initOrderHistory();
        //self.OrderHisItems.unshift(test_it);
        /**
         * 用户提交成功后调用，加入到当天订餐记录中
         * @param {[type]} new_item_json [description]
         */
        self.addNewHisItem = function(data) {
            //self.OrderHisItems.unshift(new_item_json);
            console.log(data.response_char);
            if (data.response_char == "saveit") {
                alert("已收到您的订餐请求，谢谢惠顾！");
                self.OrderHisItems.unshift(data.content);
                //console.log("is just save it");
            }
            if (data.response_char == "noname") {
                alert("请填写姓名");
            }
        };

        self.toggleDetailInfo = function(itself, event) {
            //self.OrderHisItems.unshift(new_item_json);
            var $target = DATH.Event.getJQTarget(event);
            //var $hidden_title=$target.parents(".today_order_title")||$target;
            var $hidden_title = ("today_order_title" == $target.attr('class')) ? $target : $target.parents(".today_order_title");
            // if ("today_order_title" == $target.attr('class')) {
            //     //console.log("the right classname");
            //     $hidden_title = $target;
            // }else{

            // }
            //console.log($hidden_title.attr('class'));
            //$hidden_title.next().toggle();
            console.log("here is backgroud-image");
            console.log($hidden_title.css("backgroundImage"));
            var its_display = $hidden_title.next().css("display");
            if ("none" == its_display) {
                $hidden_title.css("backgroundImage", "url('../img/orange_arrow_down.png')");
            } else {
                $hidden_title.css("backgroundImage", "url('../img/orange_arrow_toright.png')");
            }

            //console.log($hidden_title.next().css("display"));

            //$hidden_title.addClass("today_order_title_toggle");
            $hidden_title.next().animate({
                height: 'toggle',
                opacity: 'toggle'
            }, 200);
            //$hidden_title.next().next().toggle();
        };
    }

})(jQuery);
//OrderHistory KO化
//ko.applyBindings(new OrderHistoryVM());
//集中在KO_Manager.js文件运行
