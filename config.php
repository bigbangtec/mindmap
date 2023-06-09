<?php

return [
    [
        'name' => 'share_salt',
        'title' => '分享密码盐',
        'type' => 'string',
        'content' => [],
        'value' => '密码Salt',
        'rule' => 'required',
        'msg' => '',
        'tip' => '设置密码盐，分享更安全！',
        'ok' => '',
        'extend' => '',
    ],
    [
        'name' => 'right_open',
        'title' => '会员等级权益',
        'type' => 'radio',
        'content' => [
            1 => '启用-会员必须达到配置等级才能使用对应功能',
            0 => '关闭-可使用全部功能，无限制',
        ],
        'value' => '0',
        'rule' => 'required',
        'msg' => '',
        'tip' => '开启后会员必须达到相应等级前端个人中心页面才会显示“Jmind脑图”的Tab',
        'ok' => '',
        'extend' => '',
    ],
    [
        'name' => 'right_common',
        'title' => '普通权益等级',
        'type' => 'number',
        'content' => [],
        'value' => '1',
        'rule' => 'required,integer,range(0~)',
        'msg' => '普通权益等级必须为正整数',
        'tip' => '会员达到等级后可使用Jmind普通功能(包括文件夹管理，文档管理等)',
        'ok' => '',
        'extend' => '',
    ],
    [
        'name' => 'right_share',
        'title' => '分享权益等级',
        'type' => 'number',
        'content' => [],
        'value' => '2',
        'rule' => 'required,integer,range(0~)',
        'msg' => '分享权益等级必须为正整数',
        'tip' => '会员达到等级后可使用Jmind分享功能(只包括分享相关Tab和功能)',
        'ok' => '',
        'extend' => '',
    ],
];
