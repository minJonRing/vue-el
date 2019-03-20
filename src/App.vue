<template>
    <div id="app">
        <div class="head">
            <div class="head-img">
                <img src="" alt="">
            </div>
            <div class="head-user">
                <a href="javascript:" class="login-out" @click="handleLoginOut">退出登录</a>
            </div>
        </div>
        <div class="cont">
            <div class="left">
                <el-col :span="24">
                    <el-menu
                    :unique-opened=true
                    :router=true
                    default-active="1"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#fff"
                    text-color="#333"
                    active-text-color="#ffd04b">
                        <el-menu-item index="/">
                            <i class="el-icon-menu"></i>
                            <span slot="title">首页</span>
                        </el-menu-item>
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-setting"></i>
                                <span>基础</span>
                            </template>
                            <el-menu-item-group title="分组一">
                                <el-menu-item index="1-1">选项1</el-menu-item>
                                <el-menu-item index="1-2">选项2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="分组2">
                                <el-menu-item index="1-3">选项3</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-menu-item index="work">
                            <i class="el-icon-document"></i>
                            <span slot="title">产品</span>
                        </el-menu-item>
                        <el-menu-item index="news">
                            <i class="el-icon-star-off"></i>
                            <span slot="title">新闻</span>
                        </el-menu-item>
                    </el-menu>
                </el-col>
            </div>
            <div class="right">
                <div class="box">
                    <router-view/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'App',
    data(){
        return {

        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        handleLoginOut(){
            this.$axios.get("/app/logout").then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        type: 'success',
                        message: res.data.msg
                    });
                    window.location.href = "/app/admin";
                }
            })
        }
    }
}
</script>

<style>
html,body {
    font-size: 12px;
    font-family: Arial, "微软雅黑", "Microsoft YaHei", "Lucida Grande", Helvetica, sans-serif, "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, 'helvetica neue', tahoma, 'hiragino sans gb', 'wenquanyi micro hei', "宋体";
    height: 100%;
    width: 100%;
}

* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    list-style: none;
    text-decoration: none;
    font-style: normal;
    -webkit-tap-highlight-color: transparent;
}
*::-webkit-scrollbar {
    display: none;
}
#app {
    height: 100%;
}
#app .head {
    display: flex;
    align-items: center;
    list-style: none;
    position: relative;
    background-color: #FFF;
    border-bottom: solid .5px #e6e6e6;
}
#app .head-img {
    width: 201px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #efefef;
}
#app .head-img img {
    display: block;
    height: 80%;
}
#app .head-user {
    flex-grow: 1;
    display: flex;
    flex-direction: row-reverse;
    padding-right: 12px;
}
#app .head-user .login-out {
    display: block;
    padding: 6px 12px;
    border: 1px #e6e6e6 solid;
    border-radius: 4px;
    background-color: #fefefe;
    color: #999;
    transition-duration: 600ms;
}
#app .head-user .login-out:hover {
    background-color: #e76d84;
    color: #fff;
    border-color: #e76d84;
    box-shadow: 2px 2px 12px rgba(0,0,0,.3);
}
#app .cont {
    display: flex;
    align-items: center;
    height: calc(100% - 61px);
    overflow: hidden;
}
#app .cont .left {
    width: 200px;
    height: 100%;
    overflow-x: hidden;
    background-color: #fff;
}
/* 组件样式修改 */
#app .cont .left .el-menu{
    border-right: none;
}
/* 右侧 */
#app .cont .right {
    width: calc(100% - 200px);
    height: 100%;
    padding: 12px;
    border-left: 1px #e6e6e6 solid;
}
#app .cont .right .box {
    width: 100%;
    height: 100%;
}
</style>
