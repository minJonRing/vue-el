<template>
    <div class="work">
        <div class="work-head">
            <el-button type="primary" @click="handleNewAndEdit">新建</el-button>
        </div>
        <div class="table-box">
            <el-table
                ref="multipleTable"
                :data="nowList"
                border
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                @filter-change="handleReFilter">
                <el-table-column
                    type="selection"
                    width="55"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="日期"
                    sortable
                    align="center"
                    width="180">
                    <template slot-scope="scope">{{ handleReturnTime(scope.row.createtime) }}</template>
                </el-table-column>
                <el-table-column
                    prop="cover"
                    label="封面"
                    align="center"
                    width="200"
                    >
                    <template slot-scope="scope">
                        <img class="list-cover" :src="'http://localhost:3000'+scope.row.cover" />
                    </template>
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="标题"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="type"
                    label="标签"
                    width="160"
                    column-key="tag"
                    :filters="typeArr"
                    :filter-method="handleFilterTag"
                    filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag
                        :type="handleTagFilter(scope.row.type)"
                        disable-transitions>{{typeArr[scope.row.type-1].text || '暂无'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="120">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle size="mini"
                        @click="handleEdit(scope.$index, scope)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle size="mini"
                        @click="handleDelete(scope.$index, scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <div :class="['work-edit',{active:isEdit || editId}]">
            <Edit :id="editId" @handleReturnHome="handleReturnList" />
        </div>
    </div>
</template>
<script>
import config from "../../config";
import Edit from './edit';
export default {
    name:"work",
    data(){
        return {
            init:[],
            list:[],
            list:[],
            nowList: [],
            listType:0,
            // 类型标签
            typeArr:[],
            // 多选数据
            multipleSelection: [],
            // 分页器
            currentPage: 1,
            total:1,
            nowPage:10,
            // 编辑页面
            isEdit:false,
            editId:0,
        }
    },
    mounted(){
        this.typeArr  =config.workType;
        this.handleAjaxList();
    },
    methods:{
        // 获取数据 
        handleAjaxList(){
            this.$axios.post("/app/getWork").then(res=>{
                if(res.data.code == 200){
                    this.init = [...res.data.data,...res.data.data,...res.data.data,...res.data.data,...res.data.data];
                    this.total = this.init.length;
                    this.handleInit(this.init);
                }
            })
        },
        // 初始化数据
        handleInit(db){
            let arr = [];
            arr[0] = db;
            for(let i in this.typeArr){
                let ind = this.typeArr[i].value;
                if(!arr[ind]){
                    arr[ind] = [];
                }
            }
            for(let i in db){
                let ind = db[i].type;
                arr[ind].push(db[i])
            }
            this.list = arr;
            this.handleFilterList();
        },
        // 数据分类
        handleFilterList(){
            let page = this.currentPage - 1;
            this.nowList = this.list[this.listType].slice(page*this.nowPage,this.currentPage*this.nowPage);
        },
        // 多选数据
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 时间
        handleReturnTime(date){
            return date.replace(/(T).+/g,"");
        },
        // 单个编辑
        handleEdit(index, row) {
            this.editId = row.row._id;
        },
        // 单个删除
        handleDelete(index, row) {
            console.log(index, row);
        },
        // 数据标签分类
        handleTagFilter(db){
            let a = db - 0,i;
            switch(a){
                case 1:
                    i = "primary";
                break;
                case 2:
                    i = "success";
                break;
                case 3:
                    i = "info";
                break;
                case 4:
                    i = "warning";
                break;
                default:
                    i = "danger";
            }
            return i;
        },
        handleFilterTag(value, row) {
            this.listType = value;
            return row.type === value+'';
        },
        handleReFilter(filters){
            if(!filters.tag.length){
                this.listType = 0;
            }
            this.nowList = this.list[this.listType].slice(0,this.nowPage);
            this.total = this.list[this.listType].length;
            if(!this.nowList.length){
                setTimeout(() => {
                    this.nowList = this.list[0].slice(0,this.nowPage);
                    this.total = 1;
                }, 600);
            }
            this.currentPage = 1;
        },
        // 分页
        handleCurrentChange(val) {
            this.currentPage = val;
            this.handleFilterList();
        },
        // 新建编辑
        handleNewAndEdit(){
            this.isEdit = true;
        },
        // 返回列表
        handleReturnList(){
            this.isEdit = false;
            this.editId = 0;
        }
    },
    components:{
        Edit
    }
}
</script>
<style lang="scss" scoped>
.work {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: hidden;
    .work-head {
        padding: 12px;
        margin-bottom: 12px;
        box-shadow: 0 1px 12px rgba(0,0,0,.1);
    }
    .table-box {
        height: calc(100% - 64px);
        overflow-y: scroll;
    }
    .list-cover {
        height: 40px;
    }
    .page {
        padding: 24px 0;
        text-align: center;
    }
    .work-edit {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        z-index: 1;
        opacity: 0;
        pointer-events: none;
        left: 20px;
        transition-duration: 300ms;
        overflow-y: scroll;
        &.active {
            opacity: 1;
            pointer-events: auto;
            left: 0;
        }
    }
}
</style>
