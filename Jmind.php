<?php

namespace addons\jmind;

use app\common\library\Menu;
use think\Addons;
use think\Request;

/**
 * 插件
 */
class Jmind extends Addons
{

    /**
     * 插件安装方法
     * @return bool
     */
    public function install()
    {
        $menu = [
            [
                'name' => 'jmind',
                'title' => 'Jmind脑图管理',
                'sublist' => [
                    [
                        'name' => 'jmind/jmind',
                        'title' => '脑图文档管理',
                        'icon' => 'fa fa-object-group',
                        'sublist' => [
                            [
                                'name' => 'jmind/jmind/index',
                                'title' => '查看'
                            ],
                            [
                                'name' => 'jmind/jmind/edit',
                                'title' => '修改'
                            ],
                            [
                                'name' => 'jmind/jmind/del',
                                'title' => '删除'
                            ]
                        ]
                    ],
                ]
            ]
        ];
        Menu::create($menu);
        return true;
    }

    /**
     * 插件卸载方法
     * @return bool
     */
    public function uninstall()
    {
        Menu::delete("jmind");
        return true;
    }

    /**
     * 插件启用方法
     * @return bool
     */
    public function enable()
    {
        Menu::enable("jmind");
        return true;
    }

    /**
     * 插件禁用方法
     * @return bool
     */
    public function disable()
    {
        Menu::disable("jmind");
        return true;
    }

    /**
     * 会员中心边栏后
     * @return mixed
     * @throws \Exception
     * @author dublog
     * @date 2021/1/21
     */
    public function userSidenavAfter()
    {
        $request = Request::instance();
        $actionname = strtolower($request->action());
        $data = [
            'actionname' => $actionname
        ];
        return $this->fetch('view/hook/user_sidenav_after', $data);
    }

}
