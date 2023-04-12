<?php

namespace app\admin\model\jmind;

use think\Model;


class JmindData extends Model
{
    // 表名
    protected $name = 'jmind_data';

    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = false;

    // 追加属性
    protected $append = [];

    //protected $type = ['data' => 'json'];
}
