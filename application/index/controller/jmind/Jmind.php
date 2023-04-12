<?php

namespace app\index\controller\jmind;

use app\common\controller\Frontend;
use fast\Tree;
use think\Db;
use think\Exception;

require_once APP_PATH . 'admin/common.php';

/**
 * Jmind 脑图个人中心
 * Class Jmind
 * @package app\index\controller\jmind
 * @author dublog
 * @date 2021/1/21
 */
class Jmind extends Frontend
{
    protected $layout = 'default';
    protected $noNeedLogin = ['mind_share'];
    protected $noNeedRight = ['*'];
    //分享权益
    protected $shareRight = ['share', 'shareset'];
    protected $allowUserFields = ['level'];

    /**
     * @var \app\admin\model\jmind\Jmind
     */
    protected $model = null;

    protected $share_salt = '请设置您的密码盐，安全香香的';

    protected $theme_list = [
        'white' => '纯洁白',
        'clouds' => '流云白',
        'asbestos' => '石棉灰',
        'primary' => '天空蓝',
        'belizehole' => '清新蓝',
        'info' => '温柔蓝',
        'success' => '脑残绿',
        'greensea' => '青涩绿',
        'nephrite' => '文艺绿',
        'wisteria' => '浪漫紫',
        'warning' => '警告黄',
        'orange' => '热情黄',
        'pumpkin' => '泥土黄',
        'danger' => '危险红',
        'pomegranate' => '激情红',
        'asphalt' => '神秘黑',
    ];

    //思维导图数据类型对应的显示模式
    protected $modes = [
        1 => 'full',//'思维导图',
        2 => 'side',//'逻辑结构图',
    ];

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\jmind\Jmind;

        $this->checkRight();

        $addon_config = get_addon_config('jmind');
        $this->share_salt = $addon_config['share_salt'];
    }

    //等级权益检查
    protected function checkRight()
    {
        //检查配置是否开启权益等级
        $addon_config = get_addon_config('jmind');
        if (!$addon_config['right_open']) {
            //未打开，拥有全部权益
            return true;
        }

        //检查用户等级权益
        $actionname = strtolower($this->request->action());
        $this->auth->setAllowFields(array_merge($this->auth->getAllowFields(), $this->allowUserFields));
        $userinfo = $this->auth->getUserinfo();
        if (in_array($actionname, $this->shareRight)) {
            //分享权益
            if ($userinfo['level'] < $addon_config['right_share']) {
                $this->error("{$addon_config['right_share']}级后开启分享权益");
            }
        }
        else if (!in_array($actionname, $this->noNeedLogin)) {
            //普通权益
            if ($userinfo['level'] < $addon_config['right_common']) {
                $this->error("{$addon_config['right_common']}级后开启Jmind权益");
            }
        }
        return true;
    }

    /**
     * 我的文档
     * @return string
     * @throws \think\Exception
     * @author dublog
     * @date 2021/1/21
     */
    public function index()
    {
        //设置过滤方法
        $this->request->filter(['strip_tags']);
        $pid = (int)$this->request->param('pid', 0);

        if ($this->request->isAjax()) {
            $offset = $this->request->get("offset", 0);
            $limit = $this->request->get("limit", 0);
            $search = $this->request->get("search", '');
            $search = str_replace('\'', '', $search);

            $where = "pid='{$pid}' and status!=11";
            $search ? $where .= " and name like '%{$search}%'" : '';
            $total = $this->model
                ->where('user_id', $this->auth->id)
                ->where($where)
                //->order("id", "DESC")
                ->count();

            $list = $this->model
                ->where('user_id', $this->auth->id)
                ->where($where)
                ->order("updatetime", "DESC")
                ->limit($offset, $limit)
                ->select();
            foreach ($list as &$item) {
                $item['edit_url'] = url("index/jmind.jmind/mind_edit", ['id' => $item['uuid']]);
                if ($item['type'] == 0) {
                    //文件夹
                    $item['edit_url'] = url("index/jmind.jmind/index", ['pid' => $item['id']]);
                }
                $item['icon'] = $item['type'] == '0' ? 'folder-open' : 'file';
            }
            unset($item);
            $result = ["total" => $total, "rows" => $list];

            return json($result);
        }

        $this->view->assign('title', '我的文档');
        $folders = $this->getAllFolders();
        //$this->view->assign('folders', $this->getFolderTree($folders));
        $this->view->assign('folder_paths', $this->getFolderPath($folders, $pid));
        $this->view->assign('pid', $pid);

        return $this->view->fetch();
    }


    /**
     * 我的分享
     * @return string
     * @throws \think\Exception
     * @author dublog
     * @date 2021/1/21
     */
    public function share()
    {
        //设置过滤方法
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax()) {
            $offset = $this->request->get("offset", 0);
            $limit = $this->request->get("limit", 0);
            $search = $this->request->get("search", '');
            $search = str_replace('\'', '', $search);
            //$pid = (int)$this->request->request('pid', 0);

            $where = "status=2";
            $search ? $where .= " and name like '%{$search}%'" : '';
            $total = $this->model
                ->where('user_id', $this->auth->id)
                ->where($where)
                //->order("id", "DESC")
                ->count();

            $list = $this->model
                ->where('user_id', $this->auth->id)
                ->where($where)
                ->order("updatetime", "DESC")
                ->limit($offset, $limit)
                ->select();
            foreach ($list as &$item) {
                $item['edit_url'] = url("index/jmind.jmind/mind_edit", ['id' => $item['uuid']]);
                $item['icon'] = $item['type'] == '0' ? 'folder-open' : 'file';
            }
            $result = ["total" => $total, "rows" => $list];

            return json($result);
        }
        $this->view->assign('title', '我分享的文档');
        return $this->view->fetch();
    }

    /**
     * 回收站
     * @return string
     * @throws \think\Exception
     * @author dublog
     * @date 2021/1/21
     */
    public function recycle()
    {
        //设置过滤方法
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax()) {
            $offset = $this->request->get("offset", 0);
            $limit = $this->request->get("limit", 0);
            $search = $this->request->get("search", '');
            $search = str_replace('\'', '', $search);
            //$pid = (int)$this->request->request('pid', 0);

            $where = "status=11";
            $search ? $where .= " and name like '%{$search}%'" : '';
            $total = $this->model
                ->where('user_id', $this->auth->id)
                ->where($where)
                //->order("id", "DESC")
                ->count();

            $list = $this->model
                ->where('user_id', $this->auth->id)
                ->where($where)
                ->order("updatetime", "DESC")
                ->limit($offset, $limit)
                ->select();
            foreach ($list as &$item) {
                $item['edit_url'] = addon_url("index/jmind.jmind/mind_edit", ['id' => $item['uuid']]);
                $item['icon'] = $item['type'] == '0' ? 'folder-open' : 'file';
            }
            $result = ["total" => $total, "rows" => $list];

            return json($result);
        }
        $this->view->assign('title', '我的文档回收站');
        return $this->view->fetch();
    }

    /**
     * 新建文档
     * @return string
     * @throws \think\Exception
     * @author dublog
     * @date 2021/1/21
     */
    public function createfile()
    {
        if (!$this->request->isAjax()) {
            return $this->error(' 不支持的请求');
        }
        $name = $this->request->param("name", '');
        $type = $this->request->param("type", '1');
        $pid = intval($this->request->param("pid", 0));
        if (!in_array($type, [1, 2, 3, 4, 5, 6])) {
            return $this->error(' 不支持的文档类型');
        }

        $res = $this->model->save([
            'uuid' => strtoupper(\fast\Random::alnum(32)),
            'user_id' => $this->auth->id,
            'pid' => $pid,
            'name' => $name,
            'type' => $type,
        ]);
        if (!$res) {
            return $this->error('新建文档失败');
        }

        return $this->success('新建文档成功');
    }

    /**
     * 新建文件夹
     * @return string
     * @throws \think\Exception
     * @author dublog
     * @date 2021/1/21
     */
    public function createfolder()
    {
        if (!$this->request->isAjax()) {
            return $this->error(' 不支持的请求');
        }
        $name = $this->request->param("name", '');
        $type = 0;
        $pid = intval($this->request->param("pid", 0));

        $res = $this->model->save([
            'uuid' => strtoupper(\fast\Random::alnum(32)),
            'user_id' => $this->auth->id,
            'pid' => $pid,
            'name' => $name,
            'type' => $type,
        ]);
        if (!$res) {
            return $this->error('新建文件夹失败');
        }

        return $this->success('新建文件夹成功');
    }

    /**
     * 文档重命名
     * @return string
     * @throws \think\Exception
     * @author dublog
     * @date 2021/1/21
     */
    public function rename()
    {
        if (!$this->request->isAjax()) {
            return $this->error(' 不支持的请求');
        }

        $uuid = $this->request->param("id", '');
        $name = $this->request->param("name", '');

        $res = $this->model->save([
            'name' => $name,
        ], [
            'uuid' => $uuid,
            'user_id' => $this->auth->id,
        ]);
        if (!$res) {
            return $this->error('重命名失败');
        }

        return $this->success('重命名成功');
    }

    /**
     * 获取分享信息
     * @return string
     * @throws \think\Exception
     * @author dublog
     * @date 2021/1/21
     */
    public function getshareinfo()
    {
        if (!$this->request->isAjax()) {
            return $this->error('不支持的请求');
        }
        $uuid = $this->request->param("id", '');
        $info = $this->model->where('uuid', $uuid)
            ->where('user_id', $this->auth->id)
            ->whereIn('status', [1, 2])
            ->find();
        if (!$info) {
            return $this->error('获取信息失败');
        }

        $tmp = [
            'id' => $info['uuid'],
            'jmind_token' => $this->getShareToken($info['id'], $info['uuid']),
        ];
        $info['share_url'] = url('index/jmind.jmind/mind_share', $tmp, true, true);

        return $this->success('ok', '', $info);
    }

    /**
     * 分享设置
     * @return string
     * @throws \think\Exception
     * @author dublog
     * @date 2021/1/21
     */
    public function shareset()
    {
        if (!$this->request->isAjax()) {
            return $this->error('不支持的请求');
        }
        $uuid = $this->request->param("id", '');
        $status = $this->request->param("status", '');
        $share_salt = $this->request->param("share_salt", '');
        $share_minute = $this->request->param("share_minute", '');

        $params = [];
        if ($status) {
            $params['status'] = $status;
        }
        if ($share_salt) {
            $params['share_salt'] = $share_salt;
        }
        if ($share_minute) {
            if (!is_numeric($share_minute)) {
                return $this->error('请设置正确的生效时间');
            }
            $params['sharetime'] = time();//共享开始时间
            $params['share_minute'] = $share_minute;
        }

        $res = $this->model->save($params, [
            'uuid' => $uuid,
            'user_id' => $this->auth->id,
        ]);
        if (!$res) {
            return $this->error('分享设置失败');
        }

        return $this->success('分享设置成功');
    }

    /**
     * 删除文档
     * @return string
     * @throws \think\Exception
     * @author dublog
     * @date 2021/1/21
     */
    public function del()
    {
        if (!$this->request->isAjax()) {
            return $this->error('不支持的请求');
        }
        $ids = $this->request->param("ids", '');
        if (!$ids) {
            return $this->error('请选择要删除的记录');
        }

        $res = $this->model->save(['status' => 11], [
            'id' => ['in', $ids],
            'user_id' => $this->auth->id,
        ]);
        if (!$res) {
            return $this->error('删除失败');
        }

        return $this->success('删除成功');
    }

    /**
     * 彻底删除文档
     * @return string
     * @throws \think\Exception
     * @author dublog
     * @date 2021/1/21
     */
    public function delete()
    {
        if (!$this->request->isAjax()) {
            return $this->error('不支持的请求');
        }
        $ids = $this->request->param("ids", '');
        if (!$ids) {
            return $this->error('请选择要删除的记录');
        }

        $res = $this->model->where('user_id', $this->auth->id)
            ->where('status', 11)
            ->whereIn('id', $ids)
            ->delete();
        if (!$res) {
            return $this->error('删除失败');
        }

        return $this->success('删除成功');
    }

    /**
     * 恢复删除文档
     * @return string
     * @throws \think\Exception
     * @author dublog
     * @date 2021/1/21
     */
    public function recover()
    {
        if (!$this->request->isAjax()) {
            return $this->error('不支持的请求');
        }
        $ids = $this->request->param("ids", '');
        if (!$ids) {
            return $this->error('请选择要恢复的记录');
        }

        $res = $this->model->save(['status' => 1], [
            'id' => ['in', $ids],
            'user_id' => $this->auth->id,
            'status' => 11,
        ]);
        if (!$res) {
            return $this->error('恢复失败');
        }

        return $this->success('恢复成功');
    }

    /**
     * 获取登录用户信息
     * @return string
     * @throws \think\Exception
     * @author dublog
     * @date 2021/1/21
     */
    public function get_user_info()
    {
        if (!$this->request->isAjax()) {
            return $this->error('不支持的请求');
        }

        $user_info = $this->auth->getUserinfo();
        if ($user_info) {
            $this->success('ok', '', $user_info);
        }
        return $this->error('恢复失败');
    }


    /**
     * jsmind 开源脑图编辑页面
     * @author dublog
     * @date 2021/1/27
     */
    public function mind_edit()
    {
        $uuid = $this->request->param('id', '');
        $mind_info = $this->model->where('uuid', $uuid)
            ->where('user_id', $this->auth->id)
            ->where('type!=0')
            ->where('status!=11')
            ->find()->toArray();
        if (!$mind_info) {
            $this->error('没有这个脑图');
        }
        $mind_info['data'] = '';

        $modelData = new \app\admin\model\jmind\JmindData;
        $mind_data_info = $modelData->where('jmind_id', $mind_info['id'])->find();
        if ($mind_data_info) {
            $mind_info['data'] = html_entity_decode(trim($mind_data_info['data'], '"'));
        }
        $mind_info['theme'] ?: $mind_info['theme'] = 'white';
        @$mind_info['mode'] ?: $mind_info['mode'] = $this->modes[$mind_info['type']];

        $this->view->engine->layout(false);
        $this->view->assign('title', "编辑我的脑图-{$mind_info['name']}");
        $this->view->assign('mind_info', $mind_info);
        $this->view->assign('theme_list', $this->theme_list);
        return $this->view->fetch();
    }

    /**
     * 保存Mind文档
     * @return string
     * @throws \think\Exception
     * @author dublog
     * @date 2021/1/21
     */
    public function mind_save()
    {
        if (!$this->request->isAjax()) {
            return $this->error('不支持的请求');
        }
        $uuid = $this->request->param('id', '');
        $theme = $this->request->param('theme', 'white');
        $type = $this->request->param('type', '1');
        $data = $this->request->param("data", '');
        if (!$uuid) {
            return $this->error('参数错误');
        }
        if (!$data) {
            return $this->error('没有内容');
        }

        $mind_info = $this->model->where('uuid', $uuid)
            ->where('user_id', $this->auth->id)
            ->where('type!=0')
            ->where('status!=11')
            ->find();
        if (!$mind_info) {
            $this->error('没有这个脑图');
        }

        $tmp = [];
        $tmp['type'] = $type ?: '1';
        $tmp['theme'] = $theme;
        $res = $this->model->save($tmp, ['id' => $mind_info['id']]);
        if (!$res) {
            return $this->error('保存失败');
        }

        $modelData = new \app\admin\model\jmind\JmindData;
        $mind_data_info = $modelData->where('jmind_id', $mind_info['id'])->find();
        if (!$mind_data_info) {
            $mind_data_info['jmind_id'] = $mind_info['id'];
            $mind_data_info['data'] = $data;
            $res = $modelData->save($mind_data_info);
        }
        else {
            $tmp = [];
            $tmp['data'] = $data;
            $res = $modelData->save($tmp, ['jmind_id' => $mind_info['id']]);
        }

        if (!$res) {
            return $this->error('保存失败');
        }

        return $this->success('保存成功');
    }


    /**
     * 脑图分享查看页面
     * @author dublog
     * @date 2021/1/27
     */
    public function mind_share()
    {
        $uuid = $this->request->param('id', '');
        $mind_token = $this->request->param('jmind_token', '');
        $share_salt = $this->request->param('share_salt', '');
        $index_url = url('/');
        if (!$mind_token) {
            $this->error('您没有权限访问', $index_url);
        }

        try {
            $mind_info = $this->checkShareToken($uuid, $mind_token, $share_salt);
        }
        catch (\Exception $e) {
            $this->error($e->getMessage(), $index_url);
        }
        $mind_info['jmind_token'] = $mind_token;
        $mind_info['share_salt'] = '';
        $mind_info['theme'] ?: $mind_info['theme'] = 'white';
        @$mind_info['mode'] ?: $mind_info['mode'] = $this->modes[$mind_info['type']];

        if ($this->request->isAjax()) {
            $modelData = new \app\admin\model\jmind\JmindData;
            $mind_data_info = $modelData->where('jmind_id', $mind_info['id'])->find();
            if ($mind_data_info) {
                $mind_info['data'] = html_entity_decode(trim($mind_data_info['data'], '"'));
            }

            $this->success('ok', '', $mind_info);
        }

        $this->view->engine->layout(false);
        $this->view->assign('title', "查看脑图-{$mind_info['name']}");
        $this->view->assign('mind_info', $mind_info);
        return $this->view->fetch();
    }

    /**
     * 脑图目录
     * @author dublog
     * @date 2021/2/2
     */
    public function get_dirs()
    {
        if (!$this->request->isAjax()) {
            return $this->error(' 不支持的请求');
        }

        $list = $this->getAllFolders();
        $list[] = [
            'id' => 0,
            'pid' => -1,
            'title' => '根目录',
        ];

        return $this->success('ok', '', $list);
    }

    /**
     * 文档拷贝
     * @author dublog
     * @date 2021/2/4
     */
    public function copy()
    {
        if (!$this->request->isAjax()) {
            return $this->error(' 不支持的请求');
        }

        $pid = $this->request->param("pid", '-1');
        $ids = $this->request->param("ids", '');
        if (!$ids) {
            return $this->error('请选择要移动的文档');
        }
        $pid = $pid == '-1' ? 0 : $pid;
        if ($pid) {
            $info = $this->model->where('id', $pid)
                ->where('user_id', $this->auth->id)
                ->where('type', 0)
                ->where('status', 1)
                ->find();
            if (!$info) {
                return $this->error('没有找到文档复制到的目录');
            }
        }

        $tmp = $this->model
            ->field('*')
            ->where('user_id', $this->auth->id)
            ->where('type', '<>', 0)
            ->where('status', 1)
            ->whereIn('id', $ids)
            ->select();
        $list = collection($tmp)->toArray();
        if (!$list) {
            return $this->error('目前只支持对文档的复制哦！');
        }
        foreach ($list as $item) {
            Db::startTrans();
            try {
                $model = new \app\admin\model\jmind\Jmind;
                $res = $model->save([
                    'uuid' => strtoupper(\fast\Random::alnum(32)),
                    'user_id' => $this->auth->id,
                    'pid' => $pid,
                    'name' => '复制' . preg_replace('/^复制/', '', $item['name']),
                    'type' => $item['type'],
                ]);
                if (!$res) {
                    throw new Exception('文档复制失败');
                }
                $mind_info = $model->getData();

                $modelData = new \app\admin\model\jmind\JmindData;
                $mind_data_info = $modelData->where('jmind_id', $item['id'])->find();
                if ($mind_data_info) {
                    $params = [];
                    $params['jmind_id'] = $mind_info['id'];
                    $params['data'] = $mind_data_info['data'];
                    $res = $modelData->save($params);
                    if (!$res) {
                        throw new Exception('文档复制失败');
                    }
                }

                Db::commit();
            }
            catch (Exception $e) {
                Db::rollback();
                return $this->error('文档复制失败' . $e->getMessage());
            }
        }

        return $this->success('文档复制成功');
    }

    /**
     * 文档移动
     * @return string
     * @throws \think\Exception
     * @author dublog
     * @date 2021/1/21
     */
    public function move()
    {
        if (!$this->request->isAjax()) {
            return $this->error(' 不支持的请求');
        }

        $cur_pid = $this->request->param("cur_pid", '0');
        $pid = $this->request->param("pid", '-1');
        $ids = $this->request->param("ids", '');
        if (!$ids) {
            return $this->error('请选择要移动的文件');
        }
        $pid = $pid == '-1' ? 0 : $pid;
        $cur_pid ?: $cur_pid = 0;
        if ($pid == $cur_pid) {
            return $this->error('已经在目录中');
        }
        if ($pid > 0) {
            $info = $this->model->where('id', $pid)
                ->where('user_id', $this->auth->id)
                ->where('type', 0)
                ->where('status', 1)
                ->find();
            if (!$info) {
                return $this->error('没有找到要移动到的目录');
            }


            /**
             * 下面程序控制不能把分类移动该分类的子分类下
             * 如果不控制可能会出现：a->b;b->a;导致没有父级能查询到他们
             * 文档能随便移动到别的文件夹
             */
            //所有文件夹
            $t_folders = $this->getAllFolders();
            //生成所有文件夹的路径
            $folders = [];
            foreach ($t_folders as $item) {
                $folders[$item['id']] = $item;
            }
            unset($t_folders);
            foreach ($folders as &$item) {
                $i = 100;
                $item['path'] = "{$item['id']}";
                $tpid = $item['pid'];
                while ($i-- > 0) {
                    if ($tpid <= 0) {
                        break;
                    }
                    $item['path'] = "{$tpid}->" . $item['path'];
                    $tpid = @$folders[$tpid]['pid'] ?: 0;
                }
                $item['path'] = '0->' . $item['path'];
            }
            unset($item);

            $ids_arr = explode(',', $ids);
            foreach ($ids_arr as $k => $v) {
                //文档不用判断
                if (!isset($folders[$v])) {
                    continue;
                }
                //判断被移动的文件夹路径是目标文件夹路径的前缀匹配子级
                //说明被移动的文件夹是目标文件夹上级目录
                if (strpos($folders[$pid]['path'], $folders[$v]['path']) !== false) {
                    unset($ids_arr[$k]);
                }
            }
            $ids = implode(',', $ids_arr);
            if (!$ids) {
                return $this->error('请不要将目录移动到子目录中');
            }
        }

        $sql = "update {$this->model->getTable('jmind')}
        set pid='{$pid}'
        where user_id='{$this->auth->id}'
            and id in({$ids})
            and id!='{$pid}'
            and pid='{$cur_pid}'
        ";

        $res = $this->model->execute($sql);
        if (!$res) {
            return $this->error('移动失败');
        }

        return $this->success('移动成功');
    }

    /**
     * 获取文件夹列表
     * @author dublog
     * @date 2021/1/26
     */
    protected function getAllFolders()
    {
        // 必须将结果集转换为数组
        $tmp = $this->model
            ->field('id,pid,name,name as title')
            ->where('user_id', $this->auth->id)
            ->where('type', 0)
            ->where('status', 1)
            ->order("updatetime", "DESC")
            ->select();
        $list = collection($tmp)->toArray();
        return $list;
    }

    /**
     * 获取文件夹树形列表，键值对
     * @param $list
     * @return array
     * @author dublog
     * @date 2021/1/26
     */
    protected function getFolderTree($list)
    {
        Tree::instance()->init($list);
        $list = Tree::instance()->getTreeList(Tree::instance()->getTreeArray(0), 'name');
        $folders = [0 => __('根目录')];
        foreach ($list as $k => $v) {
            $folders[$v['id']] = $v['name'];
        }
        return $folders;
    }

    /**
     * 获取当前文件夹的路径
     * @param $folders
     * @param $pid
     * @author dublog
     * @date 2021/1/26
     */
    protected function getFolderPath($folders, $pid)
    {
        $paths = [];
        if (!$pid || !$folders) {
            return $paths;
        }

        //从子目录往根目录查找
        foreach ($folders as $item) {
            foreach ($folders as $item2) {
                if ($pid != $item2['id']) {
                    continue;
                }
                $paths[] = [
                    'id' => $pid,
                    'name' => $item2['name'],
                ];
                $pid = $item2['pid'];
                if (!$pid) {
                    //找到根目录
                    $paths[] = [
                        'id' => 0,
                        'name' => '根目录',
                    ];

                    krsort($paths);
                    return $paths;
                }
            }
        }
        krsort($paths);
        return $paths;
    }


    /**
     * 获取分享token
     * @param $id
     * @param $uuid
     * @return string
     * @author:qhyan
     * @datetime:2021/5/28 18:34
     */
    protected function getShareToken($id, $uuid)
    {
        return md5(md5("{$uuid}{$this->share_salt}{$id}"));
    }

    /**
     * 分享访问token检查校验
     * @param $uuid
     * @param $mind_token
     * @return mixed
     * @author:qhyan
     * @datetime:2021/5/28 18:46
     */
    protected function checkShareToken($uuid, $mind_token, $share_salt)
    {
        $mind_obj = $this->model->where('uuid', $uuid)
            //->where('user_id', $this->auth->id)
            ->where('type!=0')
            ->where('status!=11')
            ->find();
        if (!$mind_obj) {
            throw new \Exception('没有分享这个脑图');
        }

        $mind_info = $mind_obj->toArray();
        $mind_info['data'] = '';
        $mind_info['share_salt_type'] = 1;//按有效期访问

        if ($mind_token != $this->getShareToken($mind_info['id'], $mind_info['uuid'])) {
            throw new \Exception('您没有权限访问');
        }
        if ($mind_info['status'] != 2) {
            throw new \Exception('分享已关闭');
        }
        if ($mind_info['sharetime'] > 0 && $mind_info['share_minute'] > 0) {
            if (($mind_info['sharetime'] + 60 * $mind_info['share_minute']) < time()) {
                throw new \Exception('该文档分享已过期');
            }
        }

        if ($mind_info['share_salt']) {
            $mind_info['share_salt_type'] = 2;//按密码访问，需要输入密码后访问脑图内容
            if (!$share_salt) {
                $mind_info['share_salt'] = '';
                return $mind_info;
            }

            if ($mind_info['share_salt'] != $share_salt) {
                throw new \Exception('密码错误');
            }
        }

        if ($mind_info['status'] != 2) {
            throw new \Exception('该文档已关闭分享');
        }

        return $mind_info;
    }

}