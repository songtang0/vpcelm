<template>
    <div class="fill-contain">
        <div v-loading="loading" class="table-container">
            <el-table show-header
                      :data="tableData" highlight-current-row style="width: 96%">
                <el-table-column type="index" width="100"></el-table-column>
                <el-table-column prop="username" label="姓名" width="220"></el-table-column>
                <el-table-column prop="avatar" width='150' label="头像">
                    <template slot-scope="scope">
                        <img class="table-item-img" :src="scope.row.avatar" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="注册日期" width="220"></el-table-column>
                <el-table-column prop="resCity" label="注册地址" width="220"></el-table-column>
                <el-table-column  prop="status" label="状态" align='left'>
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === '未开启'" class="not-open span">在线</span>
                        <span v-else-if="scope.row.status === '进行中'" class="process span">离线</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align='center'>
                    <template slot-scope="scope">
                        <el-button @click="handleDeleteAdmin(scope.row.id)" type="danger" size='mini'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-box">
                <el-pagination @size-change="handleChangeSize" @current-change="handChangePage"
                               :page-size="size" :page-sizes="pageSizes"
                               :layout="layout" :total="total" background
                />
            </div>
        </div>
    </div>
</template>

<script>
    import { getAdminList,deleteOneAdmin } from '../../api/index';
    import initData from '../../layout/mixin/initData';
    export default {
        name: "adminList",
        mixins: [initData],
        data () {
            return {
            }
        },
        components: {
        },
        mounted () {
            this.initList();
        },
        methods: {
            beforeInit () {
                this.fn = getAdminList;
                this.params = {
                    page: this.page,
                    size: this.size
                };
                return true
            },

            //删除管理员
            handleDeleteAdmin (id) {
                console.log(id)
                const params = {targetAdminId: id}
                deleteOneAdmin(params).then(res => {
                    if (res.status === 200) {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration: 1000
                        })
                        this.initList();
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/mixin";
    .table-container {
        padding: 20px;
    }
    .table-item-img {
        width: 50px;
    }
    .pagination-box {
        margin: 10px 0 20px 0;
    }
</style>
