/**
 * ViewModel Manager集中运行器
 * @type {Object}
 */
var viewModel = {
    /*KO购物车*/
    CartOrderVM: new CartOrderVM(),
    /*KO菜单列表*/
    MenuListVM: new MenuListVM(),
    /*KO订餐历史*/
    OrderHistoryVM: new OrderHistoryVM()
};
/**
 * KO集中绑定
 */
ko.applyBindings(viewModel);
/**
 * 初始化OrderHistoryVM
 */
viewModel.OrderHistoryVM.initOrderHistory();

