define([], function () {
    let fileTree = {
        fileData: null,
        fileId: -1,

        $: function (selector, context) {
            /*
             * #id
             * .class
             * 标签
             * "#id li"
             * ".class a"
             * */
            context = context || document;
            if (selector.indexOf(" ") !== -1) {
                return context.querySelectorAll(selector);
            } else if (selector.charAt(0) === "#") {
                return document.getElementById(selector.slice(1));
            } else if (selector.charAt(0) === ".") {
                return context.getElementsByClassName(selector.slice(1));
            } else {
                return context.getElementsByTagName(selector);
            }
        },
        addEvent: function (ele, eventName, eventFn) {
            ele.addEventListener(eventName, eventFn, false);
        },
        removeEvent: function (ele, eventName, eventFn) {
            ele.removeEventListener(eventName, eventFn, false);
        },
        addClass: function (element, clsNames) {
            if (typeof clsNames === "string") {
                if (!this.hasClass(element, clsNames)) {
                    element.className += " " + clsNames;
                }
            }
        },
        removeClass: function (element, clsNames) {
            var classNameArr = element.className.split(" ");
            for (var i = 0; i < classNameArr.length; i++) {
                if (classNameArr[i] === clsNames) {
                    classNameArr.splice(i, 1);
                    i--;
                }
            }
            element.className = classNameArr.join(" ");
        },
        hasClass: function (ele, classNames) {
            let classNameArr = ele.className.split(" ");
            for (let i = 0; i < classNameArr.length; i++) {
                if (classNameArr[i] === classNames) {
                    return true;
                }
            }

            return false;
        },
        toggleClass: function (ele, classNames) {
            if (this.hasClass(ele, classNames)) {
                this.removeClass(ele, classNames);
                return false;
            } else {
                this.addClass(ele, classNames);
                return true;
            }
        },
        parents: function (obj, selector) {
            /*
             * selector
             * id
             * class
             * 标签
             * */
            if (selector.charAt(0) === "#") {
                while (obj.id !== selector.slice(1)) {
                    obj = obj.parentNode;
                }
            } else if (selector.charAt(0) === ".") {
                while ((obj && obj.nodeType !== 9) && !this.hasClass(obj, selector.slice(1))) {
                    obj = obj.parentNode;
                }
            } else {
                while (obj && obj.nodeType !== 9 && obj.nodeName.toLowerCase() !== selector) {
                    obj = obj.parentNode;
                }
            }

            return obj && obj.nodeType === 9 ? null : obj;
        },
        each: function (obj, callBack) {
            for (let i = 0; i < obj.length; i++) {
                callBack(obj[i], i);
            }
        },
        getEleRect: function (obj) {
            return obj.getBoundingClientRect();
        },
        collisionRect: function (obj1, obj2) {
            var obj1Rect = this.getEleRect(obj1);
            var obj2Rect = this.getEleRect(obj2);

            var obj1W = obj1Rect.width;
            var obj1H = obj1Rect.height;
            var obj1L = obj1Rect.left;
            var obj1T = obj1Rect.top;

            var obj2W = obj2Rect.width;
            var obj2H = obj2Rect.height;
            var obj2L = obj2Rect.left;
            var obj2T = obj2Rect.top;
            //碰上返回true 否则返回false
            if (obj1W + obj1L > obj2L && obj1T + obj1H > obj2T && obj1L < obj2L + obj2W && obj1T < obj2T + obj2H) {
                return true;
            } else {
                return false;
            }
        },
        store: function (namespace, data) {
            if (data) {
                return localStorage.setItem(namespace, JSON.stringify(data));
            }

            let store = localStorage.getItem(namespace);
            return (store && JSON.parse(store)) || [];
        },
        extend: function (obj) {
            let newArr = obj.constructor === Array ? [] : {};
            for (let attr in obj) {
                if (typeof obj[attr] === "object") {
                    newArr[attr] = this.extend(obj[attr]);
                } else {
                    newArr[attr] = obj[attr];
                }
            }
            return newArr;
        },
        hide: function (element) {
            return element.style.display = "none";
        },
        show: function (element) {
            return element.style.display = "block";
        },
        getOffset: function (obj) {
            return {
                width: obj.offsetWidth,
                height: obj.offsetHeight,
            }
        },
        insertBefore: function (newElem, parentNode) {
            if (parentNode.firstElementChild) {
                parentNode.insertBefore(newElem, parentNode.firstElementChild);
            } else {
                parentNode.appendChild(newElem);
            }
        },

        getLevelById: function (data, id) {
            return this.getParents(data, id).length;
        },

        hasChilds: function (data, id) {
            return this.getChildById(data, id).length !== 0;
        },
        getChildById: function (arr, pid) {
            var newArr = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].pid == pid) {
                    newArr.push(arr[i]);
                }
            }
            return newArr;
        },

        getParents: function (data, currentId) {
            var arr = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == currentId) {
                    arr.push(data[i]);
                    arr = arr.concat(this.getParents(data, data[i].pid));
                    break;
                }
            }
            return arr;
        },

        treeHtml: function (fileId) {
            var that = this;
            var _html = '';
            var children = that.getChildById(that.fileData, fileId);
            var hideChild = fileId > 0 ? 'none' : '';

            _html += '<ul class="' + hideChild + '">';
            children.forEach(function (item, index) {
                var level = that.getLevelById(that.fileData, item.id);
                var distance = (level - 1) * 20 + 'px';
                var hasChild = that.hasChilds(that.fileData, item.id);
                var className = hasChild ? '' : 'treeNode-empty';
                var treeRoot_cls = fileId === that.fileId ? 'treeNode-cur' : '';
                _html += `
				<li>
				  <div class="treeNode ${className} ${treeRoot_cls}" style="padding-left: ${distance}" data-file-id="${item.id}">
					<i class="icon icon-control icon-add"></i>
					<i class="icon icon-file"></i>
					<span class="title">${item.title}</span>
				  </div>
				  ${that.treeHtml(item.id)}
				</li>`;
            });

            _html += '</ul>';
            return _html;
        },

        filesHandle: function (item) {
            var that = this;
            that.addEvent(item, 'click', function (e) {
                console.log(e, e.target.className.indexOf('icon-control'));
                if (e.target.className.indexOf('icon-control') !== -1) {
                    return;
                }
                var treeNode_cur = that.$('.treeNode-cur')[0];
                that.fileId = item.dataset.fileId;
                var curElem = document.querySelector('.treeNode[data-file-id="' + that.fileId + '"]');
                //var hasChild = that.hasChilds(that.fileData, that.fileId);

                that.removeClass(treeNode_cur, 'treeNode-cur');
                that.addClass(curElem, 'treeNode-cur');
            });

            var icon_control = that.$('.icon-control', item)[0];
            that.addEvent(icon_control, 'click', function () {
                var openStatus = that.toggleClass(item.nextElementSibling, 'none');
                if (openStatus) {
                    icon_control.className = 'icon icon-control icon-add';
                } else {
                    icon_control.className = 'icon icon-control icon-minus';
                }
                return false;
            });
        },

        getFileId: function () {
            return this.fileId;
        },

        init: function (ele, data) {
            var that = this;
            var treeView = that.$(ele);
            that.addClass(treeView, 'tree-view-box');
            that.fileData = data;

            // 初始化
            treeView.innerHTML = that.treeHtml(-1);

            // 事件
            var fileItem = that.$('.treeNode');
            var root_icon = that.$('.icon-control', fileItem[0])[0];

            root_icon.className = 'icon icon-control icon-minus';

            that.each(fileItem, function (item) {
                that.filesHandle(item);
            });
        },
    };

    window.fileTree = fileTree;
    return fileTree;
});

