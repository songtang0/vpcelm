<template>
    <div>
        <el-row style="margin-top: 20px">
            <el-col :span="12" :offset="4">
                <el-form :model="formData" ref="addShopForm" label-width="110px" :rules="rules">
                    <el-form-item label="店铺名称" prop="name">
                        <el-input v-model="formData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address">
                        <el-autocomplete
                            v-model="formData.address"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入地址"
                            style="width: 100%"
                            @select="addressSelect">
                        </el-autocomplete>
                        <span>当前城市：{{city.city}}</span>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model.number="formData.phone" maxLength="11"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺简介" prop="description">
                        <el-input v-model="formData.description"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺标语" prop="promotionInfo">
                        <el-input v-model="formData.promotionInfo"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺分类">
                        <el-cascader :options="categoryOptions" v-model="selectedCategory" change>
                        </el-cascader>
                    </el-form-item>
                    <el-form-item class="switch-box" label="店铺特点">
                        <span class="switch-text">品牌保证</span>
                        <el-switch v-model="formData.isPremium"></el-switch>
                        <span class="switch-text">蜂鸟专送</span>
                        <el-switch v-model="formData.deliveryMode"></el-switch>
                        <span class="switch-text">新开店铺</span>
                        <el-switch v-model="formData.deliveryMode"></el-switch>
                    </el-form-item>
                    <el-form-item class="switch-box">
                        <span class="switch-text">外卖保</span>
                        <el-switch v-model="formData.isBao"></el-switch>
                        <span class="switch-text">准时达</span>
                        <el-switch v-model="formData.isZhun"></el-switch>
                        <span class="switch-text">开发票</span>
                        <el-switch v-model="formData.isInvoice"></el-switch>
                    </el-form-item>
                    <el-form-item label="配送费" prop="deliveryFee">
                        <el-input-number v-model="formData.deliveryFee" :min="0" :max="20">
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="起送价" prop="minPostFee">
                        <el-input-number v-model="formData.minPostFee" :min="0" :max="100">
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="营业时间" style="white-space: nowrap;">
                        <el-time-select placeholder="起始时间" v-model="formData.startTime"
                            :picker-options="{start: '05:30', step: '00:30', end: '23:30'}">
                        </el-time-select>
                        <el-time-select placeholder="结束时间" v-model="formData.endTime"
                            :picker-options="{start: '05:30', step: '00:30', end: '23:30',
                            minTime: formData.startTime}">
                        </el-time-select>
                    </el-form-item>
                    <el-form-item label="上传店铺头像">
                        <uploadImg v-model="formData.shopAvatarImg"></uploadImg>
                    </el-form-item>
                    <el-form-item label="上传营业执照">
                        <uploadImg v-model="formData.licenseImg"></uploadImg>
                    </el-form-item>
                    <el-form-item label="上传餐饮服务许可证">
                        <uploadImg v-model="formData.cateringLicenseImg"></uploadImg>
                    </el-form-item>
                    <el-form-item label="优惠活动">
                        <el-select v-model="activityValue" value="activityValue"
                            @change="selectActivity" :placeholder="activityValue">
                            <el-option v-for="item in options" :key="item.value"
                                       :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-table :data="activities" class="activity-table"
                        align="center">
                        <el-table-column prop="icon_name" label="活动标题" align="cneter" width="120">
                        </el-table-column>
                        <el-table-column prop="name" label="活动名称" align="cneter" width="120">
                        </el-table-column>
                        <el-table-column prop="description" label="活动详情" align="cneter">
                        </el-table-column>
                        <el-table-column label="操作" width="120">
                            <template slot-scope="scope">
                                <el-button size="small" type="danger" @click="handleDelete(scope.$index)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-form-item class="button_submit">
                        <el-button type="primary" @click="submitForm('addShopForm')">立即创建</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import uploadImg from "../../components/uploadImg";
    import {guessCity, searchPlace, foodCategory, addShop} from '../../api/index';
    import {baseUrl, baseImgPath} from '../../utils/env';
    import {options} from '../../assets/jsons/static';
    export default {
        name: "addShop",
        components: {uploadImg},
        data () {
            return {
                city: {}, // 当前城市
                formData: {
                    name: '', // 店铺名称
                    address: '', // 地址
                    latitude: '',
                    longitude: '',
                    description: '', // 店铺简介
                    phone: '',
                    promotionInfo: '', // 店铺标语
                    deliveryFee: 5, // 运费
                    minPostFee: 20, // 起送价
                    isPremium: true, // 品牌保证
                    deliveryMode: true, // 蜂鸟专送
                    isNewShow: true, // 是否为新开店铺
                    isBao: true, // 是否为外卖保
                    isZhun: true, // 是否为准时达
                    isInvoice: true, // 是否开发票
                    startTime: '',
                    endTime: '',
                    shopAvatarImg: '', // 店铺头像
                    licenseImg: '', // 营业执照
                    cateringLicenseImg: '' // 餐饮服务许可证
                },
                categoryOptions: [], // 分类列表
                selectedCategory: ['异国料理', '日韩料理'],
                baseUrl,
                baseImgPath,
                activityValue: '满减优惠', // 活动名称
                options,
                activities: [{
                    icon_name: "减",
                    name: "满减优惠",
                    description: "满30减5，满60减8"
                }],
                rules: {
                    name:[{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
                    address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
                    phone: [
                        { required: true, message: '请输入联系电话' },
                        { type: 'number', message: '电话号码必须是数字' }
                    ],
                }
            }
        },
        mounted () {
            this.initData();
        },
        methods: {
            // 初始化数据
            initData () {
                guessCity().then(res => {
                    if (+res.status === 200) {
                        this.city = res.data
                    }
                });
                foodCategory().then(res => {
                    console.log(res.data);
                    if (+res.status === 200) {
                        const categories = res.data;
                        categories.forEach(item => {
                            if (item.sub_categories.length > 0) {
                                const addNew = {
                                    value: item.name,
                                    label: item.name,
                                    children: []
                                }
                                item.sub_categories.forEach(subItem => {
                                    addNew.children.push({
                                        value: subItem.name,
                                        label: subItem.name
                                    })
                                });
                                this.categoryOptions.push(addNew);
                            }
                        })
                    }
                })
            },

            querySearchAsync (queryString, cb) {
                const params = {
                    cityName: this.city.city,
                    keyword: queryString
                };
                if (queryString) {
                    searchPlace(params).then(res => {
                        console.log(res);
                        if (+res.status === 200) {
                            const cityList = res.data;
                            cityList.map(item => {
                                item.value = item.address;
                                return item;
                            });
                            cb(cityList);
                        }
                    })
                }
            },

            addressSelect (address) {
                this.formData.latitude = address.latitude;
                this.formData.longitude = address.longitude;
                console.log(this.formData.latitude, this.formData.longitude)
            },

            handleShopAvatarSuccess (res) {
                if (+res.status === 200) {
                    this.formData.shopAvatarImg = res.data
                }
            },

            beforeAvatarUpload(file) {
                const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
                const isLess2M = file.size/1024/1024 < 2;
                if (!isRightType) {
                    this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
                }
                if (!isLess2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isRightType && isLess2M;
            },

            // 点击选择活动
            selectActivity () {
                this.$prompt('请输入活动详情', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(value => {
                    if (!value) {
                        this.$message({
                            type: 'info',
                            message: '请输入活动详情'
                        });
                        return;
                    }

                })
            },

            // 根据活动产生对应的数据
            productTableByAct (activityValue, value) {
                let activityDetail = {};
                switch (activityValue) {
                    case '满减优惠':
                        activityDetail = {icon_name: '减', name: '满减优惠', description: value};
                        break;
                    case '优惠大酬宾':
                        activityDetail = {icon_name: '特', name: '优惠大酬宾', description: value};
                        break;
                    case '新用户立减':
                        activityDetail = {icon_name: '新', name: '新用户立减', description: value};
                        break;
                }
                return activityDetail
            },
            // 删除活动
            handleDelete(index){
                this.activities.splice(index, 1)
            },
            // 提交
            submitForm (formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        Object.assign(this.formData, {activities: JSON.stringify(this.activities)},
                            {category: this.selectedCategory.join('/')});
                        console.log('数据-------------')
                        console.log(this.formData)
                        console.log('数据-------------')
                        addShop(this.formData).then(res => {
                            console.log(res)
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "../../styles/mixin";
.switch-box {
    white-space: nowrap;
    span {
        margin-right: 8px;
        margin-left: 12px;
        &:nth-child(1) {
            margin-left: 0;
        }
    }
}
</style>
