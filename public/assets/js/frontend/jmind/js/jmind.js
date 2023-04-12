$(function () {
    $('.person .username').click(function () {
        if ($('.person').hasClass('on')) {
            $('.person').removeClass('on');
        } else {
            $('.person').addClass('on');
        }
    });
    var options = {
        container: JM.jmContainer,// [必选] 容器的ID
        editable: JM.editable,       // 是否启用编辑
        theme: JM.theme,           // 主题
        mode: JM.mode,           // 显示模式
        support_html: true,    // 是否支持节点里的HTML元素
        //节点选中事件回调
        select_node_callback: function (node) {
            console.log('select_node_callback', node);
            setToolboxEnable(node);
        },
        //节点取消选中事件回调
        select_clear_callback: function () {
            console.log('select_clear_callback');
            setToolboxEnable(null);
        },
        view: {
            engine: 'canvas',   // 思维导图各节点之间线条的绘制引擎
            hmargin: 100,        // 思维导图距容器外框的最小水平距离
            vmargin: 50,         // 思维导图距容器外框的最小垂直距离
            line_width: 2,       // 思维导图线条的粗细
            line_color: '#555'   // 思维导图线条的颜色
        },
        layout: {
            hspace: 30,          // 节点之间的水平间距
            vspace: 20,          // 节点之间的垂直间距
            pspace: 13           // 节点与连接线之间的水平间距（用于容纳节点收缩/展开控制器）
        },
        shortcut: {
            enable: true,        // 是否启用快捷键
            handles: {
                // 命名的快捷键事件处理器
                'addChild': function () {
                    addChild();
                },
                'addBrother': function () {
                    addBrother();
                },
                'addParent': function () {
                    addParent();
                },
                'upNode': function () {
                    upNode();
                },
                'downNode': function () {
                    downNode();
                },
                'delNode': function () {
                    delNode();
                },
                'editNode': function () {
                    editNode();
                },
                'copyNode': function () {
                    copyNode();
                },
                'pasteNode': function () {
                    pasteNode();
                },
                'jmSave': function () {
                    jmSave();
                },
                'expandNodeAll': function () {
                    expandNode('all');
                },
                'expandNode1': function () {
                    expandNode('1');
                },
                'expandNode2': function () {
                    expandNode('2');
                },
                'expandNode3': function () {
                    expandNode('3');
                },
                'expandNode4': function () {
                    expandNode('4');
                },
                'expandNode5': function () {
                    expandNode('5');
                },
                'expandNode6': function () {
                    expandNode('6');
                },
                'expandNodeAllNum': function () {
                    expandNode('all');
                },
                'expandNode1Num': function () {
                    expandNode('1');
                },
                'expandNode2Num': function () {
                    expandNode('2');
                },
                'expandNode3Num': function () {
                    expandNode('3');
                },
                'expandNode4Num': function () {
                    expandNode('4');
                },
                'expandNode5Num': function () {
                    expandNode('5');
                },
                'expandNode6Num': function () {
                    expandNode('6');
                },
            },
            mapping: {           // 快捷键映射
                //addchild: 45,    // <Insert>
                //addbrother: 13,    // <Enter>
                //editnode: 113,   // <F2>
                //delnode: 46,    // <Delete>
                //toggle: 32,    // <Space>
                //left: 37,    // <Left>
                //up: 38,    // <Up>
                //right: 39,    // <Right>
                //down: 40,    // <Down>
                delNode: 46,    // <Delete>
                editNode: 45,   // <Insert>
                addChild: 9,    // <Tab>
                addBrother: 13,    // <Enter>
                addParent: jsMind.key.shift + 9,    // Shift+Tab 插入父级节点

                upNode: jsMind.key.ctrl + 38,//Ctrl+↑ 上移
                downNode: jsMind.key.ctrl + 40,//Ctrl+↓下移
                copyNode: jsMind.key.ctrl + 67,//Ctrl+C 复制
                pasteNode: jsMind.key.ctrl + 86,//Ctrl+V 粘贴
                jmSave: jsMind.key.ctrl + 83, //Ctrl+S 保存
                expandNodeAll: jsMind.key.ctrl + 48, //Ctrl+0 展开全部节点
                expandNode1: jsMind.key.ctrl + 49, //Ctrl+1 展开一级节点
                expandNode2: jsMind.key.ctrl + 50, //Ctrl+2 展开二级节点
                expandNode3: jsMind.key.ctrl + 51, //Ctrl+3 展开三级节点
                expandNode4: jsMind.key.ctrl + 52, //Ctrl+4 展开四级节点
                expandNode5: jsMind.key.ctrl + 53, //Ctrl+5 展开五级节点
                expandNode6: jsMind.key.ctrl + 54, //Ctrl+6 展开六级节点
                expandNodeAllNum: jsMind.key.ctrl + 96, //Ctrl+0 展开全部节点
                expandNode1Num: jsMind.key.ctrl + 97, //Ctrl+1 展开一级节点
                expandNode2Num: jsMind.key.ctrl + 98, //Ctrl+2 展开二级节点
                expandNode3Num: jsMind.key.ctrl + 99, //Ctrl+3 展开三级节点
                expandNode4Num: jsMind.key.ctrl + 100, //Ctrl+4 展开四级节点
                expandNode5Num: jsMind.key.ctrl + 101, //Ctrl+5 展开五级节点
                expandNode6Num: jsMind.key.ctrl + 102, //Ctrl+6 展开六级节点
            }
        },
        menuOpts: {
            // 这里加入一个专门配置menu的对象
            //showMenu 为 true 则打开右键功能 ，反之关闭
            showMenu: false,
            // 这是完整的功能列表
            //'edit', 'addChild', 'addBrother', 'delete','showAll','hideAll', 'screenshot', 'showNode', 'hideNode'
            injectionList: [
                {target: 'edit', text: '编辑节点'},
                {target: 'addChild', text: '添加下级节点'},
                {target: 'addBrother', text: '添加同级节点'},
            ],
        }
    };
    var colorpickerConf = {
        color: "#333",
        selector: "#fontcolorpicker",
        showprecolor: true,//显示预制颜色
        prevcolors: null,//预制颜色,不填为默认
        showhistorycolor: false,//显示历史
        historycolornum: 16,//历史条数
        format: 'hex',//rgba hex hsla,初始颜色类型
        showPalette: true,//显示色盘
        show: false, //初始化显示
        lang: 'cn',// 中英文 cn en
        colorTypeOption: 'single',//,linear-gradient,radial-gradient颜色选择器可选类型，纯色，线性渐变，径向渐变
        canMove: false,//默认为true
        autoConfirm: false,//改变颜色时自动确认
        onError: function (e) {
        },
        onCancel: function (color) {
        },
        onChange: function (color) {
        },
        onConfirm: function (color) {
        }
    };
    var fontcolorpickerConf = Object.assign({}, colorpickerConf);
    var bgcolorpickerConf = Object.assign({}, colorpickerConf);
    var linecolorpickerConf = Object.assign({}, colorpickerConf);

    function getUserInfo() {
        $.ajax({
            type: "GET",
            url: Fast.api.fixurl('/index/jmind.jmind/get_user_info'),
            dataType: "json",
            success: function (data) {
                console.log(data)
                if (data.code != 1) {
                    // Layer.msg('登录异常，请重新登录', function () {
                    //     window.location.href = Fast.api.fixurl('/index/user/login')
                    // })
                    return
                }
                $('#username').html(data.data.nickname)
            }
        });
    }

    var timer = setInterval(function () {
        if (typeof Fast == 'undefined') {
            return;
        }
        getUserInfo();
        clearInterval(timer);


        if (JM.share_salt_type) {
            //分享页面，重新获取脑图数据并加载
            loadJmData();

        } else {
            fontcolorpickerConf.selector = '#fontcolorpicker';
            fontcolorpickerConf.onChange = function (color) {
                //console.log("change", color);
                $('#toolbox .edit-fontcolor .pre-color').css({'background': color.color.hex});
            };
            fontcolorpickerConf.onConfirm = function (color) {
                //console.log("confirm", color);
                var selected_node = JM.jm.get_selected_node();
                if (!selected_node) {
                    Layer.msg('请选择一个节点');
                    return;
                }

                JM.jm.set_node_color(selected_node.id, null, color.color.hex);
            };
            bgcolorpickerConf.selector = '#bgcolorpicker';
            bgcolorpickerConf.onChange = function (color) {
                //console.log("change", color)
                $('#toolbox .edit-bgcolor .pre-color').css({'background': color.color.hex});
            };
            bgcolorpickerConf.onConfirm = function (color) {
                //console.log("confirm", color)
                var selected_node = JM.jm.get_selected_node();
                if (!selected_node) {
                    Layer.msg('请选择一个节点');
                    return;
                }

                JM.jm.set_node_color(selected_node.id, color.color.hex);
            };

            linecolorpickerConf.selector = '#linecolorpicker';
            linecolorpickerConf.onChange = function (color) {
                //console.log("change", color)
                $('#toolbox .edit-line-color .pre-color').css({'background': color.color.hex});
            };
            linecolorpickerConf.onConfirm = function (color) {
                JM.jm.set_line(color.color.hex, null);
            };

            initFontStyle();
            jmLoad(JM.data);
        }

        //滑轮 放大/缩小
        add_mouse_scroll_event();
    }, 1000);


    function loadJmData() {
        if (JM.share_salt_type == '2') {
            if (!JM.share_salt) {
                //输入密码访问
                Layer.prompt({
                    formType: 1,
                    title: '请输入访问口令',
                    area: ['500px', '150px'],
                    btnAlign: 'c',
                    value: '',
                    closeBtn: '',
                    btn2: function () {
                        //取消回调
                        window.location.href = Fast.api.fixurl('/');
                        return true;
                    }
                }, function (val, index) {
                    JM.share_salt = val;
                    loadJmData();
                });
                return;
            }
        }

        Fast.api.ajax({
            url: Fast.api.fixurl("/index/jmind.jmind/mind_share"),
            data: {
                id: JM.id,
                jmind_token: JM.jmind_token,
                share_salt: JM.share_salt,
            },
        }, function (res, ret) {
            jmLoad(ret.data.data);
            layer.closeAll();
            return false
        }, function (res, ret) {
            if (ret.msg == '密码错误') {
                layer.msg('密码错误，请重新输入')
                //弹出输入密码
                JM.share_salt = '';
                //loadJmData();
                return false;
            }
            layer.closeAll();

            layer.msg(ret.msg)
            setTimeout(function () {
                //报错，去首页
                window.location.href = Fast.api.fixurl('/');
            }, 2000)

            return false
        });
    }

    function jmLoad(content) {
        var json = null;
        if (content) {
            json = jsMind.util.json.string2json(content);
        }
        console.log(json);
        if (json && 'line_color' in json.meta) {
            options.view.line_color = json.meta.line_color;
            options.view.line_width = json.meta.line_width;
        }

        if (json) {
            JM.jm = jsMind.show(options, json);
        } else {
            JM.jm = jsMind.show(options);
        }
        JM.jm.mind.name = JM.name;
        JM.jm.mind.author = 'dublog.cn';
    }

    function jmSave() {
        if (JM.share_salt_type) {
            //进入的分享页面，不能保存
            return;
        }

        var mind_data = JM.jm.get_data();
        mind_data.meta.line_color = JM.jm.options.view.line_color;
        mind_data.meta.line_width = JM.jm.options.view.line_width;
        console.log(mind_data);
        var content = jsMind.util.json.json2string(mind_data);
        console.log('jmSave', content);
        Fast.api.ajax({
            url: Fast.api.fixurl("/index/jmind.jmind/mind_save"),
            data: {
                id: JM.id,
                theme: JM.theme,
                type: JM.mode == 'side' ? '2' : '1',
                data: content,
            },
        }, function (res, ret) {
            console.log(res, ret);
            if (ret.data.code != 1) {
                $('#jm-status').html('保存失败');
                return;
            }

            $('#jm-status').html('保存成功');
        });
        return;
    }

    /**
     * 设置工具栏功能按钮的可用状态
     */
    function setToolboxEnable(node) {
        var selecters = {
            addBrotherNode: '#toolbox .add-brother-node',
            addChildNode: '#toolbox .add-child-node',
            addParentNode: '#toolbox .add-parent-node',
            btnUpNode: '#toolbox .btn-up-node',
            btnDownNode: '#toolbox .btn-down-node',
            btnEditNode: '#toolbox .btn-edit-node',
            btnDelNode: '#toolbox .btn-del-node',
            editFontfamily: '#toolbox .edit-fontfamily',
            editFontsize: '#toolbox .edit-fontsize',
            editFontweight: '#toolbox .edit-fontweight',
            editFontstyle: '#toolbox .edit-fontstyle',
            editFontcolor: '#toolbox .edit-fontcolor',
            editBgcolor: '#toolbox .edit-bgcolor',
        };
        if (node) {
            if (node.isroot) {
                //选中根节点
                $(selecters.addBrotherNode).addClass('disabled');
                $(selecters.addParentNode).addClass('disabled');
                $(selecters.btnUpNode).addClass('disabled');
                $(selecters.btnDownNode).addClass('disabled');
            } else {
                //选中其他节点
                $(selecters.addBrotherNode).removeClass('disabled');
                $(selecters.addParentNode).removeClass('disabled');
                $(selecters.btnUpNode).removeClass('disabled');
                $(selecters.btnDownNode).removeClass('disabled');
            }
            $(selecters.addChildNode).removeClass('disabled');
            $(selecters.btnEditNode).removeClass('disabled');
            $(selecters.btnDelNode).removeClass('disabled');
            $(selecters.editFontfamily).removeClass('disabled');
            $(selecters.editFontsize).removeClass('disabled');
            $(selecters.editFontweight).removeClass('disabled');
            $(selecters.editFontstyle).removeClass('disabled');
            $(selecters.editFontcolor).removeClass('disabled');
            $(selecters.editBgcolor).removeClass('disabled');

            var fontColor = '#333';
            var bgColor = '#fff';
            if (JM.jm.options.theme == 'primary') {
                fontColor = '#fff';
                bgColor = '#428bca';
            } else if (JM.jm.options.theme == 'warning') {
                fontColor = '#fff';
                bgColor = '#f0ad4e';
            } else if (JM.jm.options.theme == 'danger') {
                fontColor = '#fff';
                bgColor = '#d9534f';
            } else if (JM.jm.options.theme == 'success') {
                fontColor = '#fff';
                bgColor = '#5cb85c';
            } else if (JM.jm.options.theme == 'info') {
                fontColor = '#fff';
                bgColor = '#5dc0de';
            } else if (JM.jm.options.theme == 'greensea') {
                fontColor = '#fff';
                bgColor = '#1abc9c';
            } else if (JM.jm.options.theme == 'nephrite') {
                fontColor = '#fff';
                bgColor = '#2ecc71';
            } else if (JM.jm.options.theme == 'belizehole') {
                fontColor = '#fff';
                bgColor = '#3498db';
            } else if (JM.jm.options.theme == 'wisteria') {
                fontColor = '#fff';
                bgColor = '#9b59b6';
            } else if (JM.jm.options.theme == 'asphalt') {
                fontColor = '#fff';
                bgColor = '#34495e';
            } else if (JM.jm.options.theme == 'orange') {
                fontColor = '#fff';
                bgColor = '#f1c40f';
            } else if (JM.jm.options.theme == 'pumpkin') {
                fontColor = '#fff';
                bgColor = '#e67e22';
            } else if (JM.jm.options.theme == 'pomegranate') {
                fontColor = '#fff';
                bgColor = '#e74c3c';
            } else if (JM.jm.options.theme == 'clouds') {
                fontColor = '#333';
                bgColor = '#ecf0f1';
            } else if (JM.jm.options.theme == 'asbestos') {
                fontColor = '#fff';
                bgColor = '#95a5a6';
            }

            if (node.data['foreground-color'] != undefined) {
                fontColor = node.data['foreground-color'];
            }
            $('#toolbox .edit-fontcolor .pre-color').css({'background': fontColor});
            $('#toolbox .edit-fontcolor .pre-color').attr('color', fontColor);

            if (node.data['background-color'] != undefined) {
                bgColor = node.data['background-color'];
            }
            $('#toolbox .edit-bgcolor .pre-color').css({'background': bgColor});
            $('#toolbox .edit-bgcolor .pre-color').attr('color', bgColor);

        } else {
            //没有选中的节点
            $(selecters.addBrotherNode).addClass('disabled');
            $(selecters.addChildNode).addClass('disabled');
            $(selecters.addParentNode).addClass('disabled');
            $(selecters.btnEditNode).addClass('disabled');
            $(selecters.btnDelNode).addClass('disabled');
            $(selecters.editFontfamily).addClass('disabled');
            $(selecters.editFontsize).addClass('disabled');
            $(selecters.editFontweight).addClass('disabled');
            $(selecters.editFontstyle).addClass('disabled');
            $(selecters.editFontcolor).addClass('disabled');
            $(selecters.editBgcolor).addClass('disabled');

            $('#toolbox .edit-font .toggle-box .toggle-list').removeClass('show');
        }
    }


    /**
     * 初始化字体设置
     */
    function initFontStyle() {
        var fonts = getSupportFonts();
        //console.log(fonts);
        fonts.forEach(function (v, k) {
            var html = '<li data-type="' + v.en + '">' + v.ch + '</li>';
            $('.edit-font .edit-fontfamily .toggle-list').append(html);
        });

        var sizes = [10, 12, 14, 16, 18, 20, 24, 28, 32, 48];
        sizes.forEach(function (v, k) {
            var html = '<li data-type="' + v + '" style="font-size: ' + v + 'px;">' + v + '</li>';
            $('.edit-font .edit-fontsize .toggle-list').append(html);
        });


        window.fontcolorpicker = new XNColorPicker(fontcolorpickerConf);
        window.bgcolorpicker = new XNColorPicker(bgcolorpickerConf);
        linecolorpickerConf.color = options.view.line_color;
        window.linecolorpicker = new XNColorPicker(linecolorpickerConf);
    }

    function addChild() {
        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //layer.msg('请选择一个节点');
            return;
        }

        var nodeid = jsMind.util.uuid.newid();
        var node = JM.jm.add_node(selected_node, nodeid, '新节点');
        JM.jm.select_node(node);
        JM.jm.begin_edit(node);
    }

    function addParent() {
        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //layer.msg('请选择一个节点');
            return;
        }
        if (selected_node.isroot) {
            return;
        }

        var nodeid = jsMind.util.uuid.newid();
        var new_node = JM.jm.insert_node_after(selected_node, nodeid, '新节点');

        //移动节点到新节点下
        _mapAddNode(new_node, selected_node);
        JM.jm.move_node(new_node.id, selected_node.id, new_node.parent.id, selected_node.direction);
        JM.jm.remove_node(selected_node);

        JM.jm.select_node(new_node);
        JM.jm.begin_edit(new_node);
    }

    function addBrother() {
        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //layer.msg('请选择一个节点');
            return;
        }

        var nodeid = jsMind.util.uuid.newid();
        var new_node = JM.jm.insert_node_after(selected_node, nodeid, '新节点');
        JM.jm.move_node(new_node.id, new_node.id, new_node.parent.id, selected_node.direction);

        JM.jm.select_node(new_node);
        JM.jm.begin_edit(new_node);
    }

    function delNode() {
        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //layer.msg('请选择一个节点');
            return;
        }
        if (selected_node.isroot) {
            //根节点删除所有节点
            if (selected_node.children) {
                while (selected_node.children.length > 0) {
                    JM.jm.remove_node(selected_node.children[selected_node.children.length - 1]);
                }
            }
            return;
        }

        JM.jm.remove_node(selected_node);
    }

    function editNode() {
        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //layer.msg('请选择一个节点');
            return;
        }

        JM.jm.begin_edit(selected_node);
    }

    function upNode() {
        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //layer.msg('请选择一个节点');
            return;
        }

        var pre_node = JM.jm.find_node_before(selected_node);
        if (pre_node) {
            JM.jm.move_node(selected_node, pre_node.id, selected_node.parent.id, selected_node.direction);
        } else {
            JM.jm.move_node(selected_node, '_first_', selected_node.parent.id, selected_node.direction);
        }
    }

    function downNode() {
        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //layer.msg('请选择一个节点');
            return;
        }

        var next_node = JM.jm.find_node_after(selected_node);
        if (next_node) {
            next_node = JM.jm.find_node_after(next_node);
        }

        if (next_node) {
            JM.jm.move_node(selected_node, next_node.id, selected_node.parent.id, selected_node.direction);
        } else {
            JM.jm.move_node(selected_node, '_last_', selected_node.parent.id, selected_node.direction);
        }
    }

    function copyNode() {
        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //layer.msg('请选择一个节点');
            return;
        }
        if (selected_node.isroot) return;
        window.jsMindCopyNode = selected_node;
    }

    function pasteNode() {
        var selected_node = JM.jm.get_selected_node();
        if (!!selected_node) {//jsMind会查找三次 select节点所以用 !!
            _mapAddNode(selected_node, window.jsMindCopyNode);
            delete window.jsMindCopyNode;
        }
    }

    //展开节点
    function expandNode(level) {
        if (level == 'all') {
            JM.jm.expand_all();
            return;
        }
        JM.jm.expand_to_depth(level);
    }

    //递归插入
    function _mapAddNode(parentNode, insertNode) {
        var nodeid = jsMind.util.uuid.newid();
        if (!jsMind.util.is_node(insertNode)) return;
        var newNode = JM.jm.add_node(parentNode, nodeid, insertNode.topic, {});
        if (insertNode.children) {
            insertNode.children.forEach(node => {
                _mapAddNode(newNode, node);
            });
        }
    }

    function add_mouse_scroll_event() {
        if (document.addEventListener) {
            document.addEventListener('DOMMouseScroll', mouse_scroll, false);
        } else {
            window.onmousewheel = document.onmousewheel = mouse_scroll;
        }
    }


    function mouse_scroll(event) {
        var event = event || window.event;
        //event.wheelDelta:IE/Opera/Chrome;event.detail：Firefox
        var val = event.wheelDelta || event.detail

        if (val > 0) {
            zoomOut();
        } else {
            zoomIn();
        }
    }

    function zoomIn() {
        var ele_in = $('#jsmind-zoom-box .zoom-in');
        var ele_out = $('#jsmind-zoom-box .zoom-out');
        if (ele_in.hasClass('disabled')) {
            return;
        }

        ele_out.removeClass('disabled');
        if (JM.jm.view.zoomIn()) {
            ele_in.removeClass('disabled');
        } else {
            ele_in.addClass('disabled');
        }
    }

    function zoomOut() {
        var ele_in = $('#jsmind-zoom-box .zoom-in');
        var ele_out = $('#jsmind-zoom-box .zoom-out');
        if (ele_out.hasClass('disabled')) {
            return;
        }

        ele_in.removeClass('disabled');
        if (JM.jm.view.zoomOut()) {
            ele_out.removeClass('disabled');
        } else {
            ele_out.addClass('disabled');
        }
    }


    // 保存导出
    $(document).on('click', '.btn-save', function (event) {
        event.preventDefault();
        jmSave();
        return false;
    });


    $('#jsmind-zoom-box .root-center').click(function () {
        //设置偏移位置
        JM.jm.view.translate = {x: 0, y: 0};
        JM.jm.view.setZoom(JM.jm.view.actualZoom, 0, 0);
        JM.jm.select_node(JM.jm.get_root());
        JM.jm.resize();
    });

    $('#jsmind-zoom-box .zoom-in').click(function () {
        zoomIn();
    });

    $('#jsmind-zoom-box .zoom-out').click(function () {
        zoomOut();
    });


    $('#toolbox .add-brother-node').click(function () {
        addBrother();
    });

    $('#toolbox .add-child-node').click(function () {
        addChild();
    });

    $('#toolbox .add-parent-node').click(function () {
        addParent();
    });

    $('#toolbox .expand-node').click(function () {
        $('#toolbox .expand-list').toggleClass('show');
    });

    $('#toolbox .expand-list li').click(function () {
        var level = $(this)[0].dataset.level;
        expandNode(level);
    });

    $('#toolbox .btn-del-node').click(function () {
        delNode();
    });

    $('#toolbox .btn-edit-node').click(function () {
        editNode();
    });

    $('#toolbox .btn-up-node').click(function () {
        upNode();
    });

    $('#toolbox .btn-down-node').click(function () {
        downNode();
    });

    $('#toolbox .btn-select-theme').click(function () {
        $('#toolbox .theme-list').toggleClass('show');
    });

    $('#toolbox .theme-list li').click(function () {
        $('#toolbox .theme-list').toggleClass('show');
        console.log($(this));
        JM.theme = $(this)[0].dataset.theme;
        JM.jm.set_theme(JM.theme);
        $('#toolbox .btn-select-theme').attr('class', 'btn-select-theme ' + JM.theme);
        $('#toolbox .btn-select-theme').html($(this).html());

        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //Layer.msg('请选择一个节点');
            return;
        }
        setToolboxEnable(selected_node);
    });

    $('#toolbox .mode-list li').click(function () {
        $('#toolbox .mode-list li').removeClass('selected');
        $(this).addClass('selected');

        JM.mode = $(this)[0].dataset.mode;
        JM.jm.set_mode(JM.mode);
    });

    $('#toolbox .btn-outport').click(function () {
        Layer.open({
            type: 1,
            title: '选择导出类型',
            skin: 'layui-layer', //样式类名
            area: ['490px', '170px'], //宽高
            closeBtn: 1, //不显示关闭按钮
            anim: 2,
            //shadeClose: true, //开启遮罩关闭
            content: $('#jsmind-outport-box'),
            success: function () {
                $('#jsmind-outport-box .li').click(function (e) {
                    //console.log(e);
                    if (e.currentTarget.dataset.type == 'jm') {
                        var mind_data = JM.jm.get_data();
                        var mind_name = mind_data.meta.name || 'jmind';
                        var mind_str = jsMind.util.json.json2string(mind_data);
                        jsMind.util.file.save(mind_str, 'text/jm', mind_name + '.jm');
                    } else if (e.currentTarget.dataset.type == 'mm') {
                        var mind_data = JM.jm.get_data('freemind');
                        var mind_name = mind_data.meta.name || 'freemind';
                        var mind_str = mind_data.data;
                        jsMind.util.file.save(mind_str, 'text/mm', mind_name + '.mm');
                    } else if (e.currentTarget.dataset.type == 'png') {
                        JM.jm.screenshot.shootDownload();
                    }

                    Layer.closeAll();
                });
            }
        });
    });

    $('#toolbox .btn-import').click(function () {
        Layer.open({
            type: 1,
            title: '导入脑图',
            skin: 'layui-layer', //样式类名
            area: ['240px', '200px'], //宽高
            closeBtn: 1, //不显示关闭按钮
            anim: 2,
            //shadeClose: true, //开启遮罩关闭
            content: $('#jsmind-import-box'),
            success: function () {
                dragFile({
                    success: function (files) {
                        console.log(files)
                        if (files.length <= 0) {
                            Layer.msg('请选择导入文件');
                            return;
                        }
                        Layer.closeAll();
                        var file_data = files[0];
                        jsMind.util.file.read(file_data, function (mind_data, mind_name) {
                            console.log(mind_data, mind_name)
                            if (!mind_data) {
                                Layer.msg('文件加载失败，请检查格式是否正确');
                                return;
                            }

                            if (/.*\.mm$/.test(mind_name)) {
                                mind_name = mind_name.substring(0, mind_name.length - 3);
                                var mind = {
                                    "meta": {
                                        "name": mind_name,
                                        "author": "dublog.cn",
                                        //"version": "1.0.1"
                                    },
                                    "format": "freemind",
                                    "data": mind_data
                                };
                                JM.jm.show(mind);
                                JM.jm.mind.name = JM.name;
                                JM.jm.mind.author = 'dublog.cn';
                                Layer.msg('导入成功');
                                return;
                            }
                            if (/.*\.jm$/.test(mind_name)) {
                                var mind = jsMind.util.json.string2json(mind_data);
                                if (!!mind) {
                                    JM.jm.show(mind);
                                    JM.jm.mind.name = JM.name;
                                    JM.jm.mind.author = 'dublog.cn';
                                    Layer.msg('导入成功');
                                } else {
                                    Layer.msg('文件加载失败，请检查格式是否正确');
                                }
                                return;
                            }

                            Layer.msg('不支持的文件');
                        });
                    },
                });
            }
        });
    });

    $('#toolbox .edit-font .toggle-box').click(function () {
        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //Layer.msg('请选择一个节点');
            return;
        }
        if ($(this).find('.toggle-list').hasClass('show')) {
            $('#toolbox .toggle-box .toggle-list').removeClass('show');
        } else {
            $('#toolbox .toggle-box .toggle-list').removeClass('show');
            $(this).find('.toggle-list').addClass('show');
        }
    });

    $('#toolbox .edit-fontfamily .toggle-list li').click(function () {
        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //Layer.msg('请选择一个节点');
            return;
        }

        var fontstyle = $(this)[0].dataset.type;
        JM.jm.set_node_font_style(selected_node.id, null, null, null, fontstyle);
    });

    $('#toolbox .edit-fontsize .toggle-list li').click(function () {
        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //Layer.msg('请选择一个节点');
            return;
        }

        var fontsize = $(this)[0].dataset.type;
        JM.jm.set_node_font_style(selected_node.id, fontsize);
    });

    $('#toolbox .edit-fontweight').click(function () {
        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //Layer.msg('请选择一个节点');
            return;
        }

        if (selected_node._data.view.element.style.fontWeight == 'bold') {
            JM.jm.set_node_font_style(selected_node.id, null, 'normal');
        } else {
            JM.jm.set_node_font_style(selected_node.id, null, 'bold');
        }
    });

    $('#toolbox .edit-fontstyle').click(function () {
        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //Layer.msg('请选择一个节点');
            return;
        }

        if (selected_node._data.view.element.style.fontStyle == 'italic') {
            JM.jm.set_node_font_style(selected_node.id, null, null, 'normal');
        } else {
            JM.jm.set_node_font_style(selected_node.id, null, null, 'italic');
        }
    });

    $('#toolbox .edit-fontcolor').click(function () {
        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //Layer.msg('请选择一个节点');
            return;
        }

        if ($(this).hasClass('disabled')) {
            fontcolorpicker.changeShow(false);
        } else {
            var color = $(this).find('.pre-color').attr('color');
            fontcolorpicker.destroy();
            fontcolorpickerConf.color = color;
            fontcolorpicker = new XNColorPicker(fontcolorpickerConf);
            fontcolorpicker.changeShow();
        }
    });

    $('#toolbox .edit-bgcolor').click(function () {
        var selected_node = JM.jm.get_selected_node();
        if (!selected_node) {
            //Layer.msg('请选择一个节点');
            return;
        }

        if ($(this).hasClass('disabled')) {
            bgcolorpicker.changeShow(false);
        } else {
            var color = $(this).find('.pre-color').attr('color');
            console.log('bgcolorpicker', color)
            bgcolorpicker.destroy();
            bgcolorpickerConf.color = color;
            bgcolorpicker = new XNColorPicker(bgcolorpickerConf);
            bgcolorpicker.changeShow();
        }
    });

    $('#toolbox .edit-line-color').click(function () {
        linecolorpicker.changeShow();
    });

    $('#toolbox .edit-line-width.toggle-box').click(function () {
        if ($(this).find('.toggle-list').hasClass('show')) {
            $('#toolbox .toggle-box .toggle-list').removeClass('show');
        } else {
            $('#toolbox .toggle-box .toggle-list').removeClass('show');
            $(this).find('.toggle-list').addClass('show');
        }
    });
    $('#toolbox .edit-line-width .toggle-list li').click(function () {
        var w = $(this)[0].dataset.w;
        JM.jm.set_line(null, w);
    });
});