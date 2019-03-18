<template>
    <div class="work">
        <div class="work-head">
            <el-button type="primary">新建</el-button>
        </div>
        <el-table
            ref="multipleTable"
            :data="list"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="date"
                label="日期"
                sortable
                width="180">
                <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="120">
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="tag"
                label="标签"
                width="100"
                :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag
                    :type="scope.row.tag === '家' ? 'primary' : 'success'"
                    disable-transitions>{{scope.row.tag}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <!-- <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope)">编辑</el-button> -->
                    <el-button type="primary" icon="el-icon-edit" circle
                    size="mini"
                    @click="handleEdit(scope.$index, scope)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle
                    size="mini"
                    @click="handleDelete(scope.$index, scope.row)"></el-button>
                    <!-- <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="page">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400">
            </el-pagination>
        </div>
        <div class="work-edit">
            <Edit/>
        </div>
    </div>
</template>
<script>
import Edit from './edit';
export default {
    name:"work",
    data(){
        return {
            list: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                tag: '家'
                }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄',
                tag: '公司'
                }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄',
                tag: '家'
                }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄',
                tag: '公司'
                }],
            multipleSelection: [],
            currentPage4: 1
        }
    },
    methods:{
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
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
    .work-head {
        padding-bottom: 12px;
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
    }
}
</style>
