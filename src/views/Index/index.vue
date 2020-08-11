<template>
    <div>
        <section class="section-container">
            <header class="section-title">数据统计</header>
            <el-row :gutter="20" class="today-data">
                <el-col :span="4">
                    <div class="analyse-list today-head">
                        <span class="analyse-num head">当日数据</span>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="analyse-list">
                        <span class="analyse-num">{{userNum}}</span> 新增用户
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="analyse-list">
                        <span class="analyse-num">{{orderNum}}</span> 新增订单
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="analyse-list">
                        <span class="analyse-num">{{adminNum}}</span> 新增管理员
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">
                    <div class="analyse-list all-head">
                        <span class="analyse-num head">总数据:</span>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="analyse-list">
                        <span class="analyse-num">{{userTotal}}</span> 注册用户
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="analyse-list">
                        <span class="analyse-num">{{orderTotal}}</span> 订单
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="analyse-list">
                        <span class="analyse-num">{{adminTotal}}</span> 管理员
                    </div>
                </el-col>
            </el-row>
        </section>
        <tendency :sevenDay="sevenDay" :sevenDayData="sevenDayData" />
    </div>
</template>

<script>
    import {userCount, orderCount, adminCount, getUserCount, getOrdersCount,
        getAdminCount } from '../../api';
    import {format} from 'date-fns'
    // import headTop from '../components/headTop';
    import tendency from "../../components/tendency";
    export default {
        name: "index",
        data () {
            return {
                userNum: 0, // 当日用户注册数量
                orderNum: 0, // 当日新增订单数量
                adminNum: 0, // 当日新注册管理员数量
                userTotal: 0, // 总用户注册数量
                orderTotal: 0, // 总订单数量
                adminTotal: 0, // 总管理员数量
                sevenDay: [], // 当日开始的一周前日期
                sevenDayData: [[], [], []] // 一周的数据
            }
        },
        components: {
            // headTop,
            tendency
        },
        mounted() {
            this.initData();
            this.getSevenDayOfWeek();
            this.getSevenDayData();
        },
        methods: {
            // 初始化首页数据
            initData () {
                const date = format(new Date(), 'yyyy-MM-dd'); // 当日时间(仅日期)
                const ajaxArr = [
                    userCount(date), orderCount(date), adminCount(date),
                    getUserCount(), getOrdersCount(), getAdminCount()
                ];
                Promise.all(ajaxArr).then(res => {
                    console.log(res);
                    if(res[0].status === 200 && res[1].status === 200 && res[2].status === 200) {
                        this.userNum = res[0].data;
                        this.orderNum = res[1].data;
                        this.adminNum = res[2].data;
                        this.userTotal = res[3].data;
                        this.orderCount = res[4].data;
                        this.adminTotal = res[5].data;
                    }
                })
            },

            // 获取从今天开始的一周前的日期
            getSevenDayOfWeek () {
                for (let i = 6; i > -1; i--) {
                    const date = format(new Date().getTime() - 86400000*i, 'yyyy-MM-dd');
                    this.sevenDay.push(date)
                }
            },

            getSevenDayData () {
                const apiArr = [[], [], []]; // 存放接口的数组
                const resArr = [[], [], []]; // 返回值数据
                this.sevenDay.forEach(item => {
                    apiArr[0].push(userCount(item));
                    apiArr[1].push(orderCount(item));
                    apiArr[2].push(adminCount(item));
                });
                const promiseArr = [...apiArr[0], ...apiArr[1], ...apiArr[2]]; // promise.all的参数
                Promise.all(promiseArr).then(res => {
                    res.forEach((itemRes, index) => {
                        if (itemRes.status === 200) {
                            resArr[Math.floor(index/7)].push(itemRes.data)
                        }
                    });
                });
                this.sevenDayData = resArr;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/mixin";
    .section-container {
        padding: 20px;
        margin-bottom: 40px;
        .section-title {
            text-align: center;
            font-size: 30px;
            margin-bottom: 10px;
        }
        .today-data {
            margin-bottom: 10px;
        }
        .analyse-list {
            text-align: center;
            font-size: 14px;
            color: #666;
            border-radius: 6px;
            background: #E5E9F2;
            .analyse-num {
                color: #333;
                font-size: 26px;
            }
            .head {
                border-radius: 6px;
                font-size: 22px;
                padding: 4px 0;
                color: #fff;
                display: inline-block;
            }
        }
        .today-head{
            background: #FF9800;
        }
        .all-head{
            background: #20A0FF;
        }
    }
</style>
