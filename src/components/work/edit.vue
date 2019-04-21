<template>
    <div class="edit">
        <div class="edit-head">
            <p>新增/编辑</p><el-button @click="handleReturn">返回</el-button>
        </div>
        <div class="edit-form">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="类型">
                    <el-select class="w360" v-model="form.type" placeholder="请选择类型">
                        <el-option :label="item.text" :value="item.value" v-for="(item,index) in form.typeArr" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input class="w360" v-model="form.title" suffix-icon="el-icon-edit" :span="12" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="前言">
                    <el-input class="w360" type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item label="首页排序">
                    <el-input class="w360" v-model="form.sort"></el-input>
                </el-form-item>
                <el-form-item label="封面">
                    <el-upload
                        class="avatar-uploader"
                        action="/app/upload/cover"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="cover" :src="cover" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="封面是否是长图">
                    <el-switch
                        v-model="form.isLong" >
                    </el-switch>
                </el-form-item>
                <el-form-item label="使用外部视频">
                    <el-switch
                        v-model="form.isSwitch" >
                    </el-switch>
                </el-form-item>
                <el-form-item label="外部视频" v-if="form.isSwitch">
                    <div>
                        <el-input class="w360" v-model="form.outVideo" placeholder="请输入正确的外部链接"></el-input>
                        <el-button type="primary" @click="handleConfirmOutVideo">确定使用</el-button>
                    </div>
                    <div class="out-video-list">
                        <div class="out-video-item" v-for="(item,index) in form.outVideoArr" :key="index" >
                            <el-tooltip class="remove-video" effect="dark" content="删除视频" placement="left">
                                <el-button class="" type="danger" icon="el-icon-delete" circle @click="handleRemoveOutVideo($event,index)"></el-button>
                            </el-tooltip>
                            <div class="out-video-item-el" v-html="item"></div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="视频上传" v-if="!form.isSwitch">
                    <div class="video-upload">
                        <div class="video-upload-box">
                            <div class="video-upload-btn">
                                <input type="file" placeholder="*视频" @change="handleVideoLoader($event)" accept="video/mp4">
                                <el-button>上传视频</el-button>
                            </div>
                            <el-progress class="video-upload-bar" :text-inside="true" :stroke-width="18" :percentage="form.percentage"></el-progress>
                        </div>
                        <div class="videos" v-if="form.video.length">
                            <div class="video-box" v-for="(item,index) in form.video" :key="index">
                                <el-tooltip class="remove-video" effect="dark" content="删除视频" placement="left">
                                    <el-button class="" type="danger" icon="el-icon-delete" circle @click="handleRemoveVideo($event,index)"></el-button>
                                </el-tooltip>
                                <video width="360" height="240" controls autoplay :src="item"></video>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="内容正文">
                    <div ref="editor"></div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="hanleOnSubmit">提交保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import E from 'wangeditor';
import config from "../../config";
export default {
    name:"edit",
    props:['id'],
    data() {
        return {
            form: {
                title: '',
                desc: '',
                sort:99,
                type:'',
                typeArr:'',
                cover:'',
                isLong:false,
                isSwitch:false,
                percentage:0,
                video:[],
                outVideo:"",
                outVideoArr:[]
            },
            cover:'',
            editor:''
        }
    },
    mounted(){
        this.form.typeArr = config.workType;
        this.handleEditorInit();
    },
    watch:{
        id(db){
            if(db){
                this.handleAjaxEdit();
            }
        }
    },
    methods: {
        // 富文本
        handleEditorInit(){
            this.editor = new E(this.$refs.editor)
            this.editor.customConfig.uploadImgServer = '/app/upload/img'; //上传地址路由
            this.editor.customConfig.uploadFileName = 'imgs' //后端后去的name名称
            // editor.config.uploadTimeout = 100000000;
            // 内容改变时触发
            this.editor.customConfig.onchange = (html) => {
                this.editorContent = html
            }
            this.editor.create();
        },
        // 获取数据
        handleAjaxEdit(){
            this.$axios.get("/app/project/edit",{
                params:{ id:this.id }
            }).then((res)=>{
                let db = res.data.data;
                this.form.title = db.title || '';
                this.form.desc = db.desc || '';
                this.form.sort = db.sort || 99;
                this.form.type = db.type?db.type-0:'';
                this.form.cover = db.cover || '';
                this.cover = db.cover || '';
                this.form.isLong = db.isLong || false;
                this.form.isSwitch = db.isSwitch || false;
                this.form.video = db.video?db.video.split(',') : [];
                this.form.outVideoArr = db.outVideo?db.outVideo.split(',') : [];
                this.editor.txt.html(db.cont);
            })
            
        },
        // 提交
        hanleOnSubmit() {
            let data = {
                type:this.form.type,
                title:this.form.title,
                desc:this.form.desc,
                sort:this.form.sort,
                cover:this.form.cover,
                isLong:this.form.isLong,
                isSwitch:this.form.isSwitch,
                video:this.form.video.join(","),
                outVideo:this.form.outVideoArr.join(","),
                cont:this.editor.txt.html()
            };
            if(this.id){
                data.id = this.id;
            }
            this.$axios.post("/app/project/create",data).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        type: 'success',
                        message: res.data.msg
                    });
                    this.handleReturn();
                }
            })
        },
        // 封面上传
        handleAvatarSuccess(res, file) {
            if(res.code == 200){
                this.form.cover = res.data[0];
                this.cover = URL.createObjectURL(file.raw);
                this.$message.success(res.msg);
            }
        },
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isLt2M;
        },
        // 视频上传
        handleVideoLoader(e){
            this.form.percentage = 0;
            let file = e.target.files;
            if(file.length){
                let formData = new FormData();
                formData.append("video", file[0]);
                let config = {
                    onUploadProgress: progressEvent => {
                        var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
                        this.form.percentage = complete;
                    }
                }
                this.$axios.post("/app/video",formData,config).then((res)=>{
                    let data = res.data;
                    if(res.data.code == 200){
                        this.$message.success(data.msg);
                        this.form.video.push(data.url);
                    }
                }).catch((err)=>{
                    this.$message.error("上传出错,请重新上传/或使用外部视频");
                })
            }
        },
        // 删除视频
        handleRemoveVideo(e,i){
            this.form.video.splice(i,1);
        },
        // 添加外部视频
        handleConfirmOutVideo(){
            let str = this.form.outVideo;
            if(str){
                let a = str.replace(/(width="480")/,'width="360"').replace(/(height="400")/,'height="240"');
                this.form.outVideoArr.push(a);
                this.form.outVideo = "";
            }else{
                this.$message.error("外部视频内容不能为空!");
            }
        },
        // 删除外部视频
        handleRemoveOutVideo(e,i){
            this.form.outVideoArr.splice(i,1);
        },
        // 返回
        handleReturn(){
            this.$emit("handleReturnHome");
            this.form.title = '';
            this.form.desc = '';
            this.form.type = '';
            this.form.cover = '';
            this.form.isLong = false;
            this.form.isSwitch = false;
            this.form.percentage = 0;
            this.form.video = [];
            this.form.outVideo = '';
            this.form.outVideoArr = [];
            this.cover = '';
            this.editor.txt.clear()
        }
    }
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 360px;
    height: 40px;
    line-height: 46px;
    text-align: center;
}
.avatar {
    max-width: 240px;
    display: block;
}
.out-video-item-el iframe {
    width: 100%;
    height: 100%;
}
</style>
<style lang="scss" scoped>
.edit {
    height: 100%;
    .w360 {
        width: 360px;
    }
    .edit-head {
        display: flex;
        align-items: center;
        padding: 12px;
        margin-bottom: 12px;
        box-shadow: 0 1px 12px rgba(0,0,0,.1);
        p{
            font-size: 16px;
            width: 120px;
            padding-left: 12px;
        }
    }
    .edit-form {
        height: calc(100% - 64px);
        overflow-y: scroll;
        .out-video-list {
            .out-video-item {
                position: relative;
                display: inline-block;
                vertical-align: middle;
                width: 360px;
                height: 240px;
                margin: 12px 24px 12px 0;
                overflow: hidden;
                .remove-video {
                    position: absolute;
                    top: 0px;
                    right: 0px;
                    box-shadow: 1px 1px 6px rgba(0,0,0,.3);
                    opacity: 0;
                    z-index: 1;
                    transition-duration: 600ms;
                }
                .out-video-item-el {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                }
                &:hover {
                    .remove-video{
                        opacity: 1;
                    }
                }
            }
        }
        .video-upload {
            position: relative;
            .video-upload-box{
                .video-upload-btn {
                    position: relative;
                    display: inline-block;
                    input {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        opacity: 0;
                        cursor: pointer;
                        z-index: 1;
                    }
                }
                .video-upload-bar {
                    display: inline-block;
                    width: 200px;
                    margin-left: 12px;
                }
            }
            .videos {
                display: flex;
                flex-wrap: wrap;
                padding-top: 12px;
                .video-box {
                    position: relative;
                    width: 360px;
                    height: 240px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                    box-shadow: 3px 3px 12px rgba(0,0,0,.1);
                    border-radius: 4px;
                    .remove-video {
                        position: absolute;
                        top: 0px;
                        right: 0px;
                        box-shadow: 1px 1px 6px rgba(0,0,0,.3);
                        z-index: 1;
                    }
                }
                
            }
        }
    }
    
}
</style>
