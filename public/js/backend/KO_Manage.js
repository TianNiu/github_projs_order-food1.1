/**
 * ViewModel Manager集中运行器
 * @type {Object}
 */
var viewModel = {
    /**/
    OrderListVM: new OrderListVM()

};
/**
 * KO集中绑定
 */
ko.applyBindings(viewModel);
/**
 * 初始化OrderHistoryVM
 */
//viewModel.OrderHistoryVM.initOrderHistory();
/**
 * VM KO运行之后绑定一些DomReady需要触发的事件
 * @return {[type]} [description]
 */
$(document).ready(function() {

    $(document).on("mousemove", ".copy_order_info", function() {
        $(".copy_order_info").zclip({
            path: 'js/lib/jquery_zclip/ZeroClipboard.swf',
            copy: function() {
                var orderjson_after_statistic = viewModel.OrderListVM.getStaticJson();
                //return JSON.stringify(viewModel.OrderListVM.getStaticJson());
                //var final_output_string = "";
                var output_string = {
                    food_temp: "",
                    all_total_num: "共" + orderjson_after_statistic.all_total_num + "份，",
                    all_total_charge: "总计:" + orderjson_after_statistic.all_total_charge + "元。"
                };
                var OS = output_string;
                var all_total_num = orderjson_after_statistic.all_total_num;
                var all_total_charge = orderjson_after_statistic.all_total_charge;
                for (var i = orderjson_after_statistic.menuls_arr.length - 1; i >= 0; i--) {
                    //self.staticdata.soga1[i];
                    //console.log(self.staticdata.menuls_arr[i] + self.staticdata.menu_count[i]);
                    //构造 self.staticdata json，菜名和对应数量的组合
                    // self.orderStaticsArr.unshift({
                    //     foodname: orderjson_after_statistic.menuls_arr[i],
                    //     foodnum: orderjson_after_statistic.menu_count[i]
                    // });
                    if (orderjson_after_statistic.menu_count[i]) {
                        var punctuation = (i > 0 ? "，" : "。");
                        output_string.food_temp += (orderjson_after_statistic.menuls_arr[i] + orderjson_after_statistic.menu_count[i] + "份" + punctuation);
                    }
                }
                //console.log(orderjson_after_statistic);
                //return output_string.food_temp + ;
                return OS.food_temp+OS.all_total_num+OS.all_total_charge;
                //return JSON.stringify(output_string);
                //return "hah";
            }
        });
    });
});
