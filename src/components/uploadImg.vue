<template>
    <el-upload class="avatar-uploader"
               action="http://localhost:3000/v1/uploadImg" :show-file-list="false"
               :on-success="handleShopAvatarSuccess"
               :before-upload="beforeAvatarUpload">
        <img v-if="imgUrl" class="avatar" :src="baseImgPath + imgUrl" alt="">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>

<script>
    import {baseImgPath} from '../utils/env';
    export default {
        name: "uploadImg",
        props:{
            imageUrl:String
        },
        data () {
            return {
                imgUrl: this.imageUrl,
                baseImgPath
            }
        },
        methods: {
            handleShopAvatarSuccess (res) {
                if (+res.status === 200) {
                    this.imgUrl = res.data;
                    this.$emit('input', this.imgUrl);
                }
            },
            beforeAvatarUpload (file) {
                const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
                const isLess2M = file.size/1024/1024 < 2;
                if (!isRightType) {
                    this.$message.error('上传图片只能是 JPG或PNG 格式!')
                }
                if (!isLess2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isRightType && isLess2M;
            }
        },
        watch: {
            imageUrl (val) {
                this.imgUrl = val;
            }
        }
    }
</script>

<style scoped>

</style>
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
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
