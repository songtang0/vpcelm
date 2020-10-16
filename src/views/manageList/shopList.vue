<template>
    <div class="fill-contain">
        <div class="table-container">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="form-expand">
                            <el-form-item label="店铺名称">
                                <span>{{ props.row.name }}</span>
                            </el-form-item>
                            <el-form-item label="店铺地址">
                                <span>{{ props.row.address }}</span>
                            </el-form-item>
                            <el-form-item label="店铺介绍">
                                <span>{{ props.row.description }}</span>
                            </el-form-item>
                            <el-form-item label="店铺 ID">
                                <span>{{ props.row.id }}</span>
                            </el-form-item>
                            <el-form-item label="联系电话">
                                <span>{{ props.row.phone }}</span>
                            </el-form-item>
                            <el-form-item label="评分">
                                <span>{{ props.row.rating }}</span>
                            </el-form-item>
                            <el-form-item label="销售量">
                                <span>{{ props.row.recent_order_num }}</span>
                            </el-form-item>
                            <el-form-item label="分类">
                                <span>{{ props.row.category }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="店铺名称" prop="name"></el-table-column>
                <el-table-column label="店铺地址" prop="address"></el-table-column>
                <el-table-column label="店铺介绍" prop="description"></el-table-column>
                <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope)">编辑</el-button>
                        <el-button size="mini" type="success" @click="handleAdd(scope)">添加</el-button>
                        <el-button size="mini" type="danger" @click="handleRemove(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-box">
                <el-pagination @size-change="handleChangeSize" @current-change="handChangePage"
                               :page-size="size" :page-sizes="pageSizes"
                               :layout="layout" :total="total" background
                />
            </div>
            <el-dialog title="修改店铺信息" v-model="dialogVisible">
                <el-form :mode="itemShop">
                    <el-form-item label="店铺名称" label-width="100px">
                        <el-input v-model="itemShop.name"></el-input>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {guessCity, getRestaurants, foodCategory, updateShop, getRestaurantsCount,
        position} from '../../api/index';
    import initData from '../../layout/mixin/initData';
    export default {
        name: "shopList",
        mixins: [initData],
        components: {},
        data () {
            return {
                city: {}, // 定位城市信息
                count: 0, // 商店总数
                dialogVisible: false,
                itemShop: {}, // 选中的单个店铺
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData () {
                guessCity().then(res => {
                    if (+res.status === 200) {
                        this.city = res.data
                        this.initList();
                    }
                });
                getRestaurantsCount().then(res => {
                    if (+res.status === 200) {
                        this.count = res.data
                    }
                })
            },
            beforeInit () {
                const {latitude, longitude} = this.city;
                this.fn = getRestaurants;
                this.params = {
                    latitude,
                    longitude,
                    page: this.page,
                    size: this.size
                };
                return true
            },
            // 编辑按钮
            handleEdit (scope) {
                console.log(scope)
            },
            // 添加按钮
            handleAdd (scope) {
                console.log(scope)
            },
            // 删除按钮
            handleRemove (scope) {
                console.log(scope)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .form-expand {
        & label {
            width: 90px;
            color: #99a9bf;
        }
        & .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
            width: 50%;
        }
    }
    .pagination-box {
        margin: 20px 0 20px 30px;
    }
</style>
