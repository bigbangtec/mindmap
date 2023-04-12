define(['jquery', 'bootstrap', 'frontend', 'form', 'template', '/assets/js/frontend/jmind/js/filetree/filetree.min.js'], function ($, undefined, Frontend, Form, Template, fileTree) {
    var Controller = {
        index: function () {
            require(['table'], function (Table) {
                // 初始化表格参数配置
                Table.api.init({
                    extend: {
                        'index_url': window.location.href,
                        "del_url": "jmind.jmind/del",
                    }
                });

                var table = $("#table");
                $.fn.bootstrapTable.defaults.extend.table = table;
                // 初始化表格
                table.bootstrapTable({
                    url: $.fn.bootstrapTable.defaults.extend.index_url,
                    sortName: 'id',
                    showToggle: false,
                    showExport: false,
                    commonsearch: false,
                    showSearch: false,
                    showColumns: false,
                    columns: [
                        [
                            {field: 'state', checkbox: true, operate: false},
                            // {field: 'id', title: __('Id'), visible: false, operate: false},
                            {
                                field: 'name',
                                title: __('名称'),
                                formatter: function (value, row, index) {
                                    var target = 'target="_blank" ';
                                    var title = 'title="点击编辑脑图"';
                                    if (row.type == 0) {
                                        target = ' ';
                                        title = 'title="打开目录"';
                                    }
                                    return '<a href="' + row.edit_url + '" ' + target + title + ' >' + __(value) + '</a>';
                                },
                                operate: false,
                            },
                            {
                                field: 'type',
                                title: __('文档类型'),
                                searchList: {
                                    "0": __('文件夹'),
                                    "1": __('思维导图'),
                                    "2": __('组织结构图'),
                                    "3": __('目录组织图'),
                                    "4": __('逻辑结构图'),
                                    "5": __('鱼骨头图'),
                                    "6": __('天盘图')
                                },
                                icon: function (row) {
                                    console.log(row);
                                },//fa fa-file
                                formatter: Controller.api.formatter.type,
                                operate: false,
                            },
                            {
                                field: 'updatetime',
                                title: __('修改时间'),
                                formatter: Table.api.formatter.datetime,
                                operate: false,
                            },
                            {
                                field: 'operate',
                                title: __('Operate'),
                                events: {
                                    'click .btn-rename': Controller.api.rename,
                                    'click .btn-share': Controller.api.sharedialog,
                                },
                                formatter: function (value, row, index) {
                                    var html = '<a href="javascript:;" class="btn btn-success btn-xs btn-rename" >' + __('重命名') + '</a>';
                                    if (row.type.toString() !== '0') {
                                        html += '<a href="javascript:;" class="btn btn-success btn-xs btn-share" style="margin:0 0 0 6px">' + __('分享设置') + '</a>';
                                        html += '<a href="' + row.edit_url + '" target="_blank" class="btn btn-success btn-xs" style="margin:0 0 0 6px">' + __('打开') + '</a>';
                                    }
                                    return html;
                                }
                            }
                        ]
                    ]
                });

                $(document).on('click', ".btn-create-file", function () {
                    Controller.api.createfile(table);
                });

                $(document).on('click', ".btn-create-folder", function () {
                    Controller.api.createfolder(table);
                });

                $(document).on('click', ".btn-copy", function () {
                    var ids = Table.api.selectedids(table);
                    ids = ($.isArray(ids) ? ids.join(",") : ids);
                    Controller.api.copy(table, ids);
                });

                $(document).on('click', ".btn-move", function () {
                    var ids = Table.api.selectedids(table);
                    ids = ($.isArray(ids) ? ids.join(",") : ids);
                    Controller.api.move(table, ids);
                });

                $(document).on('click', ".btn-refresh", function () {
                    table.bootstrapTable('refresh');
                });

                var clipboard = new ClipboardJS('.copy', {
                    text: function () {
                        if ($('#share-set-dialog .switch').hasClass('fa-toggle-on')) {
                            Layer.msg('复制成功，快去分享给小伙伴吧！')
                            return $('#share-set-dialog .link').html();
                        }
                        return '';
                    }
                });
                clipboard.on('error', function (e) {
                    console.error('Action:', e.action);
                    console.error('Trigger:', e.trigger);
                    Layer.msg('拷贝失败，可以点击链接在新窗口打开哦！')
                });

                // 为表格绑定事件
                Table.api.bindevent(table);
            });
        },

        recycle: function () {
            require(['table'], function (Table) {
                // 初始化表格参数配置
                Table.api.init({
                    extend: {
                        'index_url': 'jmind.jmind/recycle',
                        "del_url": "jmind.jmind/delete",
                        "recover_url": "jmind.jmind/recover",
                    }
                });

                var table = $("#table");
                // 初始化表格
                table.bootstrapTable({
                    url: $.fn.bootstrapTable.defaults.extend.index_url,
                    sortName: 'id',
                    showToggle: false,
                    showExport: false,
                    commonsearch: false,
                    showSearch: false,
                    showColumns: false,
                    columns: [
                        [
                            {field: 'state', checkbox: true, operate: false},
                            {field: 'id', title: __('Id'), visible: false, operate: false},
                            {
                                field: 'name',
                                title: __('名称'),
                                formatter: function (value, row, index) {
                                    return '<a href="' + row.edit_url + '" target="_blank" title="点击编辑脑图">' + __(value) + '</a>';
                                },
                                operate: false,
                            },
                            {
                                field: 'type',
                                title: __('文档类型'),
                                searchList: {
                                    "0": __('文件夹'),
                                    "1": __('思维导图'),
                                    "2": __('组织结构图'),
                                    "3": __('目录组织图'),
                                    "4": __('逻辑结构图'),
                                    "5": __('鱼骨头图'),
                                    "6": __('天盘图')
                                },
                                icon: function (row) {
                                    console.log(row)
                                },//fa fa-file
                                formatter: Controller.api.formatter.type,
                                operate: false,
                            },
                            {
                                field: 'updatetime',
                                title: __('修改时间'),
                                formatter: Table.api.formatter.datetime,
                                operate: false,
                            },
                        ]
                    ]
                });

                $(document).on('click', '.btn-recover', function () {
                    var ids = Table.api.selectedids(table);
                    ids = ($.isArray(ids) ? ids.join(",") : ids);
                    Fast.api.ajax({
                        url: $.fn.bootstrapTable.defaults.extend.recover_url,
                        data: {ids: ids}
                    }, function () {
                        table.trigger("uncheckbox");
                        table.bootstrapTable('refresh');
                    });
                    return false;
                });

                $(document).on('click', ".btn-refresh", function () {
                    table.bootstrapTable('refresh');
                });

                // 为表格绑定事件
                Table.api.bindevent(table);
            });
        },

        share: function () {
            require(['table'], function (Table) {
                // 初始化表格参数配置
                Table.api.init({
                    extend: {
                        'index_url': 'jmind.jmind/share',
                        "del_url": "jmind.jmind/del",
                    }
                });

                var table = $("#table");
                // 初始化表格
                table.bootstrapTable({
                    url: $.fn.bootstrapTable.defaults.extend.index_url,
                    sortName: 'id',
                    showToggle: false,
                    showExport: false,
                    commonsearch: false,
                    showSearch: false,
                    showColumns: false,
                    columns: [
                        [
                            {field: 'state', checkbox: true, operate: false},
                            // {field: 'id', title: __('Id'), visible: false, operate: false},
                            {
                                field: 'name',
                                title: __('名称'),
                                formatter: function (value, row, index) {
                                    return '<a href="' + row.edit_url + '" target="_blank" title="点击编辑脑图">' + __(value) + '</a>';
                                },
                                operate: false,
                            },
                            {
                                field: 'type',
                                title: __('文档类型'),
                                searchList: {
                                    "0": __('文件夹'),
                                    "1": __('思维导图'),
                                    "2": __('组织结构图'),
                                    "3": __('目录组织图'),
                                    "4": __('逻辑结构图'),
                                    "5": __('鱼骨头图'),
                                    "6": __('天盘图')
                                },
                                icon: function (row) {
                                    console.log(row)
                                },//fa fa-file
                                formatter: Controller.api.formatter.type,
                                operate: false,
                            },
                            {
                                field: 'updatetime',
                                title: __('修改时间'),
                                formatter: Table.api.formatter.datetime,
                                operate: false,
                            },
                            {
                                field: 'operate',
                                title: __('Operate'),
                                events: {
                                    'click .btn-rename': Controller.api.rename,
                                    'click .btn-share': Controller.api.sharedialog,
                                },
                                formatter: function (value, row, index) {
                                    var html = '<a href="javascript:;" class="btn btn-success btn-xs btn-rename" >' + __('重命名') + '</a>';
                                    if (row.type.toString() !== '0') {
                                        html += '<a href="javascript:;" class="btn btn-success btn-xs btn-share" style="margin:0 0 0 6px">' + __('分享设置') + '</a>';
                                        html += '<a href="' + row.edit_url + '" target="_blank" class="btn btn-success btn-xs" style="margin:0 0 0 6px">' + __('打开') + '</a>';
                                    }
                                    return html;
                                }
                            }
                        ]
                    ]
                });

                $(document).on('click', ".btn-refresh", function () {
                    table.bootstrapTable('refresh');
                });

                var clipboard = new ClipboardJS('.copy', {
                    text: function () {
                        if ($('#share-set-dialog .switch').hasClass('fa-toggle-on')) {
                            Layer.msg('复制成功，快去分享给小伙伴吧！')
                            return $('#share-set-dialog .link').html();
                        }
                        return '';
                    }
                });
                clipboard.on('error', function (e) {
                    console.error('Action:', e.action);
                    console.error('Trigger:', e.trigger);
                    Layer.msg('拷贝失败，可以点击链接在新窗口打开哦！')
                });

                // 为表格绑定事件
                Table.api.bindevent(table);
            });
        },

        api: {
            formatter: {
                type: function (value, row, index) {
                    value = value === null ? '' : value.toString();
                    var keys = typeof this.searchList === 'object' ? Object.keys(this.searchList) : [];
                    var index = keys.indexOf(value);
                    var display = index > -1 ? this.searchList[value] : null;
                    var icon = 'fa fa-file';
                    var color = 'success';
                    if (value === '0') {
                        icon = 'fa fa-folder-open';
                        color = 'maroon';
                    }
                    var html = '<span class="text-' + color + '">' + (icon ? '<i class="' + icon + '"></i> ' : '') + display + '</span>';
                    return html;
                },
            },
            bindevent: function () {

            },

            rename: function (e, value, row, index) {
                Layer.prompt({
                    formType: 0,
                    title: '',
                    area: ['500px', '150px'],
                    btnAlign: 'r',
                    value: row.name,
                    closeBtn: '',
                }, function (val, index) {
                    Fast.api.ajax({
                        url: '/index/jmind/jmind/rename',
                        data: {
                            id: row.uuid,
                            name: val,
                        },
                    }, function (res, ret) {
                        Layer.closeAll();
                        $.fn.bootstrapTable.defaults.extend.table.bootstrapTable('refresh');
                    });
                });
            },

            sharedialog: function (e, value, row, index) {
                //获取分享信息
                Fast.api.ajax({
                    url: '/index/jmind/jmind/getshareinfo',
                    data: {
                        id: row.uuid,
                    },
                }, function (res, ret) {
                    if (ret.code != 1) {
                        return true;
                    }
                    Layer.open({
                        type: 1,
                        title: '分享设置',
                        skin: 'layui-layer', //样式类名
                        area: ['420px', '200px'], //宽高
                        closeBtn: 1, //不显示关闭按钮
                        anim: 2,
                        //shadeClose: true, //开启遮罩关闭
                        content: $('#share-set-dialog'),
                        success: function () {
                            console.log(res)
                            if (res.status != 2) {
                                $('#share-set-dialog').addClass('share-off')
                                $('#share-set-dialog .switch').removeClass('fa-toggle-on')
                                $('#share-set-dialog .switch').addClass('fa-toggle-off')
                            } else {
                                $('#share-set-dialog').removeClass('share-off')
                                $('#share-set-dialog .switch').addClass('fa-toggle-on')
                                $('#share-set-dialog .switch').removeClass('fa-toggle-off')
                            }
                            $('#share-set-dialog input[name=time]').val(res.share_minute)
                            $('#share-set-dialog input[name=pass]').val(res.share_salt)
                            $('#share-set-dialog .link').html(res.share_url)
                            $('#share-set-dialog .link').attr('title', res.share_url)
                            $('#share-set-dialog .link').unbind('click')
                            $('#share-set-dialog .link').click(function () {
                                if (!$('#share-set-dialog .switch').hasClass('fa-toggle-on')) {
                                    return false;
                                }
                                window.open(res.share_url);
                            })

                            $('#share-set-dialog .switch').unbind('click')
                            $('#share-set-dialog .switch').click(function (e) {
                                var that = $(this)
                                if (that.hasClass('fa-toggle-off')) {
                                    var status = 2
                                } else {
                                    var status = 1
                                }

                                var data = {
                                    'status': status,
                                }
                                Controller.api.shareset(row.uuid, data, function () {
                                    if (status == 2) {
                                        $('#share-set-dialog').removeClass('share-off')
                                        that.addClass('fa-toggle-on')
                                        that.removeClass('fa-toggle-off')
                                    } else {
                                        $('#share-set-dialog').addClass('share-off')
                                        that.addClass('fa-toggle-off')
                                        that.removeClass('fa-toggle-on')
                                    }
                                })
                            })

                            $('#share-set-dialog input[name=time]').unbind('blur')
                            $('#share-set-dialog input[name=time]').blur(function () {
                                if ($(this).val().length > 6) {
                                    Layer.msg('最大6位数字')
                                    return
                                }
                                var data = {
                                    'share_minute': $(this).val(),
                                }
                                Controller.api.shareset(row.uuid, data)
                            })

                            $('#share-set-dialog input[name=pass]').unbind('blur')
                            $('#share-set-dialog input[name=pass]').blur(function () {
                                if ($(this).val().length != 4) {
                                    Layer.msg('请输入4位字符')
                                    return
                                }
                                var data = {
                                    'share_salt': $(this).val(),
                                }
                                Controller.api.shareset(row.uuid, data)
                            })
                        }
                    });
                    return false
                })
            },

            createfile: function (table) {
                Layer.prompt({
                    formType: 0,
                    title: '',
                    area: ['500px', '150px'],
                    btnAlign: 'r',
                    value: '我的Jmind脑图',
                    closeBtn: '',
                }, function (val, index) {
                    var pid = Fast.api.query('pid')
                    pid ? '' : pid = ''
                    pid = pid.replace('.html', '')
                    Fast.api.ajax({
                        url: '/index/jmind/jmind/createfile',
                        data: {
                            type: 1,
                            name: val,
                            pid: pid,
                        },
                    }, function (res, ret) {
                        Layer.closeAll();
                        table.bootstrapTable('refresh');
                    })
                })
            },

            createfolder: function (table) {
                Layer.prompt({
                    formType: 0,
                    title: '',
                    area: ['500px', '150px'],
                    btnAlign: 'r',
                    value: '文件夹',
                    closeBtn: '',
                }, function (val, index) {
                    var pid = Fast.api.query('pid')
                    pid ? '' : pid = ''
                    pid = pid.replace('.html', '')
                    Fast.api.ajax({
                        url: '/index/jmind/jmind/createfolder',
                        data: {
                            type: 0,
                            name: val,
                            pid: pid,
                        },
                    }, function (res, ret) {
                        Layer.closeAll();
                        table.bootstrapTable('refresh');
                    })
                })
            },


            copy: function (table, ids) {
                //获取目录信息
                Fast.api.ajax({
                    url: '/index/jmind/jmind/get_dirs',
                    data: {},
                }, function (res, ret) {
                    if (ret.code != 1) {
                        return true;
                    }
                    Layer.open({
                        type: 1,
                        title: '请选择复制文档到哪个目录',
                        skin: 'layui-layer', //样式类名
                        area: ['500px', '300px'], //宽高
                        // closeBtn: 1, //不显示关闭按钮
                        anim: 2,
                        //shadeClose: true, //开启遮罩关闭
                        content: $('#folder-select-dialog'),
                        zIndex: 1000,
                        btn: [__('确定'), __('关闭')],
                        success: function () {
                            $('#file-tree-box').html('')
                            fileTree.init('#file-tree-box', res)
                        },
                        yes: function () {
                            var pid = fileTree.getFileId()
                            Fast.api.ajax({
                                url: '/index/jmind/jmind/copy',
                                data: {
                                    ids: ids,
                                    pid: pid,
                                },
                            }, function (res, ret) {
                                Layer.closeAll();
                                table.bootstrapTable('refresh');
                            })
                        }
                    });
                    return false
                })
            },

            move: function (table, ids) {
                //获取目录信息
                Fast.api.ajax({
                    url: '/index/jmind/jmind/get_dirs',
                    data: {},
                }, function (res, ret) {
                    if (ret.code != 1) {
                        return true;
                    }
                    Layer.open({
                        type: 1,
                        title: '请选择移动到的目录',
                        skin: 'layui-layer', //样式类名
                        area: ['500px', '300px'], //宽高
                        // closeBtn: 1, //不显示关闭按钮
                        anim: 2,
                        //shadeClose: true, //开启遮罩关闭
                        content: $('#folder-select-dialog'),
                        zIndex: 1000,
                        btn: [__('确定'), __('关闭')],
                        success: function () {
                            $('#file-tree-box').html('')
                            fileTree.init('#file-tree-box', res)
                        },
                        yes: function () {
                            var pid = fileTree.getFileId()
                            var cur_pid = Fast.api.query('pid')
                            cur_pid ? '' : cur_pid = '0'
                            cur_pid = cur_pid.replace('.html', '')
                            Fast.api.ajax({
                                url: '/index/jmind/jmind/move',
                                data: {
                                    ids: ids,
                                    pid: pid,
                                    cur_pid: cur_pid,
                                },
                            }, function (res, ret) {
                                Layer.closeAll();
                                table.bootstrapTable('refresh');
                            })
                        }
                    });
                    return false
                })
            },

            /**
             * 共享数据设置
             * 进行后台数据设置
             * @param data
             */
            shareset: function (id, data, success = null) {
                data.id = id
                Fast.api.ajax({
                    url: '/index/jmind/jmind/shareset',
                    data: data,
                }, function (res, ret) {
                    //return false
                    if (ret.code != 1) {
                        return;
                    }

                    if (success) {
                        success()
                    }
                })
            }
        },
    };
    return Controller;
});
