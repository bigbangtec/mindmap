define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'jmind/jmind/index' + location.search,
                    add_url: 'jmind/jmind/add',
                    edit_url: 'jmind/jmind/edit',
                    del_url: 'jmind/jmind/del',
                    multi_url: 'jmind/jmind/multi',
                    import_url: 'jmind/jmind/import',
                    table: 'jmind',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'pid', title: __('Pid')},
                        {field: 'uuid', title: __('Uuid'), operate: 'LIKE'},
                        {field: 'user.nickname', title: __('User_id')},
                        {field: 'name', title: __('Name'), operate: 'LIKE'},
                        {field: 'type', title: __('Type'), searchList: {"0":__('Type 0'),"1":__('Type 1'),"2":__('Type 2')}, formatter: Table.api.formatter.normal},
                        {field: 'status', title: __('Status'), searchList: {"1":__('Status 1'),"2":__('Status 2'),"11":__('Status 11')}, formatter: Table.api.formatter.status},
                        //{field: 'theme', title: __('Theme'), operate: 'LIKE'},
                        {field: 'share_salt', title: __('Share_salt'), operate: false},
                        {field: 'sharetime', title: __('Sharetime'), addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime, operate: false},
                        {field: 'share_minute', title: __('Share_minute'), operate: false},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});