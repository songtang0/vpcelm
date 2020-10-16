<template>
    <div class="fill-contain">
        <div class="table-container">
            <el-table show-header v-loading="loading"
                :data="tableData" highlight-current-row style="width: 100%">
                <el-table-column type="index" width="100"></el-table-column>
                <el-table-column prop="username" label="姓名" width="220"></el-table-column>
                <el-table-column prop="avatar" width='150' label="用户头像">
                    <template slot-scope="scope">
                        <img class="table-item-img" :src="scope.row.avatar" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="注册日期" width="220"></el-table-column>
                <el-table-column prop="city" label="注册地址" width="220"></el-table-column>
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
    import {getUserList} from '../../api/index';
    import initData from '../../layout/mixin/initData';
    export default {
        name: "userList",
        mixins: [initData],
        data () {
          return {
          }
        },
        components: {
        },
        created () {
            this.initList();
        },
        mounted () {
        },
        methods: {
            beforeInit () {
                this.fn = getUserList;
                this.params = {
                    page: this.page,
                    size: this.size
                };
                return true
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
