/*
 Navicat Premium Data Transfer

 Source Server         : nodeapp
 Source Server Type    : MySQL
 Source Server Version : 80020
 Source Host           : localhost:3306
 Source Schema         : nodeappdata

 Target Server Type    : MySQL
 Target Server Version : 80020
 File Encoding         : 65001

 Date: 25/12/2020 13:57:22
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cate
-- ----------------------------
DROP TABLE IF EXISTS `cate`;
CREATE TABLE `cate`  (
  `id` int(0) NOT NULL,
  `category` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `status` tinyint(0) NULL DEFAULT NULL,
  `create_time` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cate
-- ----------------------------
INSERT INTO `cate` VALUES (1, '脑残', 1, '2020-05-12 15:51:34');
INSERT INTO `cate` VALUES (2, '新人', 0, '2020-05-12 15:59:01');
INSERT INTO `cate` VALUES (3, '萌新', 1, '2020-05-12 15:59:25');

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `menu_id` int(0) NOT NULL AUTO_INCREMENT COMMENT '菜单id',
  `menu_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '菜单名称',
  `menu_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '菜单URL',
  `parent_id` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '菜单父级',
  `menu_icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '菜单图标',
  `level` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '权限等级',
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES (1, '账号管理', 'user', '0', NULL, '0');
INSERT INTO `menu` VALUES (2, '安全管理', 'safety', '0', NULL, '0');
INSERT INTO `menu` VALUES (3, '通知管理', 'notice', '0', NULL, '2');
INSERT INTO `menu` VALUES (4, '菜单管理', 'menu', '0', NULL, '2');
INSERT INTO `menu` VALUES (5, '个人中心', 'self', '0', NULL, '3');
INSERT INTO `menu` VALUES (6, '用户列表', 'userinfo', '1', NULL, '1');
INSERT INTO `menu` VALUES (7, '角色管理', 'purview', '1', NULL, '1');
INSERT INTO `menu` VALUES (8, 'IP白名单', 'ipwhite', '2', NULL, '0');
INSERT INTO `menu` VALUES (9, '日志管理', 'logmanage', '2', NULL, '3');
INSERT INTO `menu` VALUES (10, '通知信息', 'noticemanage', '3', NULL, '3');
INSERT INTO `menu` VALUES (11, '一级菜单', 'firstmenu', '4', NULL, '0');
INSERT INTO `menu` VALUES (12, '二级菜单', 'secondmenu', '4', NULL, '1');
INSERT INTO `menu` VALUES (13, '个人信息', 'selfinfo', '5', NULL, '3');
INSERT INTO `menu` VALUES (14, '权限列表', 'rights', '1', NULL, '3');

-- ----------------------------
-- Table structure for post
-- ----------------------------
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post`  (
  `id` int(0) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `pic` varchar(0) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `desc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `cate_id` int(0) NULL DEFAULT NULL,
  `cate_time` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of post
-- ----------------------------
INSERT INTO `post` VALUES (1, 'express', NULL, 'express搭建', 1, '2020-05-12 16:14:06');
INSERT INTO `post` VALUES (2, 'vue', NULL, 'vue加node实战', 2, '2020-05-12 16:14:47');
INSERT INTO `post` VALUES (3, 'react', NULL, 'react还不会呢', 1, '2020-05-12 16:15:48');

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '角色id',
  `rolesName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `rolesDesc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `weights` int(0) NULL DEFAULT NULL,
  `p_id` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `rolesName`(`rolesName`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, '超级管理员', '超级管理员', 0, NULL);
INSERT INTO `roles` VALUES (2, '总经理', '项目总负责人', 0, NULL);
INSERT INTO `roles` VALUES (3, '技术主管', '技术负责人', 1, 2);
INSERT INTO `roles` VALUES (4, '后端工程师', '后端开发人员', 2, 3);
INSERT INTO `roles` VALUES (5, '前端工程师', '前端开发人员', NULL, 3);
INSERT INTO `roles` VALUES (6, '人事主管', '人事负责人', NULL, 2);
INSERT INTO `roles` VALUES (7, '财务主管', '财务负责人', NULL, 2);
INSERT INTO `roles` VALUES (8, '薪酬专员', '薪酬负责人', NULL, 7);
INSERT INTO `roles` VALUES (9, '商品主管', '商品部负责人', NULL, 2);
INSERT INTO `roles` VALUES (10, '营销主管', '营销部负责人', NULL, 2);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `j_number` int(5) UNSIGNED ZEROFILL NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `roles` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` tinyint(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `r_id`(`roles`) USING BTREE,
  CONSTRAINT `r_id` FOREIGN KEY (`roles`) REFERENCES `roles` (`rolesName`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 00001, '123456', '人事主管', 'song', 1);
INSERT INTO `user` VALUES (2, 00002, 'ygg19960928', '技术主管', 'aubrey', 1);
INSERT INTO `user` VALUES (3, 00003, '123456', '总经理', 'admin', 0);
INSERT INTO `user` VALUES (4, 00004, '123456', '超级管理员', 'administrator', 1);
INSERT INTO `user` VALUES (9, 00005, '123456', '前端工程师', 'aubreyhet', 0);
INSERT INTO `user` VALUES (23, 00009, '123456', NULL, '收藏夹', NULL);
INSERT INTO `user` VALUES (28, 00012, '123456', NULL, 'wubiadf', NULL);
INSERT INTO `user` VALUES (30, NULL, '123456', NULL, NULL, NULL);
INSERT INTO `user` VALUES (31, NULL, '123456', NULL, NULL, NULL);
INSERT INTO `user` VALUES (32, NULL, '123456', NULL, NULL, NULL);

-- ----------------------------
-- Table structure for userinfo
-- ----------------------------
DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `user_id` int(0) NULL DEFAULT NULL,
  `age` int(0) NULL DEFAULT NULL,
  `sex` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `birthday` date NULL DEFAULT NULL,
  `organization` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `nation` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `join` date NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `u_id`(`user_id`) USING BTREE,
  CONSTRAINT `u_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of userinfo
-- ----------------------------
INSERT INTO `userinfo` VALUES (6, 1, 34, '', 'gfd', NULL, NULL, NULL, '18879579942@163.com', '18879579942', '2020-08-21', 'song', NULL);
INSERT INTO `userinfo` VALUES (10, 2, 36, NULL, NULL, NULL, NULL, NULL, '2930603106@qq.com', '13584801060', '2020-08-21', '长', NULL);
INSERT INTO `userinfo` VALUES (12, 30, 36, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'zhang', NULL);
INSERT INTO `userinfo` VALUES (13, 3, NULL, NULL, NULL, NULL, NULL, NULL, 'dfsgsd@sdg.com', '13584801060', NULL, 'gsdgf', 'dfgsdhs');
INSERT INTO `userinfo` VALUES (14, 31, NULL, NULL, NULL, NULL, NULL, NULL, 'dda@dsf.com', '13584801060', NULL, 'liusi', NULL);
INSERT INTO `userinfo` VALUES (15, 32, NULL, NULL, NULL, NULL, NULL, NULL, 'dda@dsf.com', '13584805555', NULL, 'liusi', NULL);
INSERT INTO `userinfo` VALUES (16, 4, 0, NULL, 'address', '2020-08-28', NULL, NULL, 'admin@qq.com', '13584801060', '2020-08-28', 'admin', NULL);

SET FOREIGN_KEY_CHECKS = 1;
