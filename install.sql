
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- 脑图文档记录表 `__PREFIX__jmind`
--
CREATE TABLE IF NOT EXISTS `__PREFIX__jmind` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `pid` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '上级目录',
  `uuid` varchar(50) DEFAULT '' COMMENT '脑图标识',
  `user_id` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建用户',
  `name` varchar(50) DEFAULT '' COMMENT '名称',
  `type` tinyint DEFAULT '0' COMMENT '文档类型:0=文件夹,1=思维导图,2=逻辑结构图',
  `status` tinyint DEFAULT '1' COMMENT '状态:1=不共享,2=共享,11=删除',
  `theme` varchar(20) DEFAULT '' COMMENT '主题:white=纯洁白,clouds=流云白,asbestos=石棉灰,primary=天空蓝,belizehole=清新蓝,info=温柔蓝,success=脑残绿,greensea=青涩绿,nephrite=文艺绿,wisteria=浪漫紫,warning=警告黄,orange=热情黄,pumpkin=泥土黄,danger=危险红,pomegranate=热情红,asphalt=神秘黑',
  `share_salt` varchar(50) DEFAULT '' COMMENT '共享密码',
  `sharetime` int(10) DEFAULT NULL COMMENT '共享开始时间',
  `share_minute` int(10) DEFAULT '0' COMMENT '共享有效分钟',
  `createtime` int(10) DEFAULT NULL COMMENT '创建时间',
  `updatetime` int(10) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `uuid` (`uuid`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='脑图文档记录表';


--
-- 脑图文档数据表 `__PREFIX__jmind_data`
--
CREATE TABLE IF NOT EXISTS `__PREFIX__jmind_data` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `jmind_id` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '脑图id',
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '脑图数据',
  `createtime` int(10) DEFAULT NULL COMMENT '创建时间',
  `updatetime` int(10) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `jmind_id` (`jmind_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='脑图文档数据表';