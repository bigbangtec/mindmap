;(function (window, undefined) {
    window.dragFile = function (setting) {
        var defaultSetting = {
            canDrag: true,
            canMultiple: false,
            success: function (fileName) {
                //单个文件上传成功的回调函数
            },
        };

        //判断浏览器是否支持FileReader
        if (!window.FileReader) {
            alert('您的浏览器不支持FileReader，请更换浏览器。');
            return;
        }

        setting = $.extend(true, {}, defaultSetting, setting);

        var _this = $(this),
            fileDrag = $('.drag-box'),
            selFileIpt = $('.drag-box .upload-file'),
            selFileBtn = $('.drag-box .upload');
        //noDragSelFile = $('.file_show .sel_file_btn', _this);

        //是否可以多选
        setting.canMultiple && selFileIpt.attr('multiple', 'multiple');

        //绑定事件
        selFileIpt.off('change');
        selFileIpt.on('change', selectFile);

        //让按钮去触发input的click事件
        selFileBtn.off('click');
        selFileBtn.on('click', function () {
            selFileIpt.click();
        });

        fileDrag.off('dragover');
        fileDrag.off('drop');
        fileDrag.on({
            dragover: dragOver,
            drop: selectFile,
        });

        // 选择文件
        function selectFile(e) {
            e = e || window.event;
            //阻止浏览器的默认行为
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            var files = this.files || event.dataTransfer.files;
            setting.success(files);

            //防止在删除了上次选择的文件后，再次选择相同的文件无效的问题。
            this.value = '';
        }

        //拖拽
        function dragOver(e) {
            var event = e || window.event;
            event.preventDefault();
        }
    }
})(window, 'dragFile');