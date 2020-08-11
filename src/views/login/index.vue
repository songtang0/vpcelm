<template>
  <div class="login fill-contain">
    <transition name="form-fade" mode="in-out">
      <section class="form-container">
        <div class="manage-tip">
<!--          <p>elm后台管理系统</p>-->
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginFormDom">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password"
                      placeholder="请输入密码">
            </el-input>
          </el-form-item>
          <el-form-item class="captcha-container" prop="captcha">
            <el-input v-model="loginForm.captcha" placeholder="请输入验证码"
                      class="captcha" size="small">
            </el-input>
            <img class="captcha-img" src="http://localhost:3000/v1/captcha" alt=""
                 ref="captcha" @click="changeImg">
          </el-form-item>
          <el-form-item>
            <el-button @click="submitLogin('loginFormDom')" type="primary" class="submit-btn">登录</el-button>
          </el-form-item>
        </el-form>
        <div class="tip-container">
          <p class="tip">温馨提示：</p>
          <p class="tip">未登录过的新用户，自动注册</p>
          <p class="tip">注册过的用户可凭账号密码登录</p>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import { login } from '../../api/index'
import { mapActions, mapState } from 'vuex'
import Cookies from 'js-cookie'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      showLogin: false // 是否展示登录模块
    }
  },
  computed: {
    ...mapState(['adminInfo'])
  },
  mounted() {
  },
  methods: {
    ...mapActions(['getAdminInfos']),
    // 点击登录
    submitLogin(formName) {
      const inFifteenMinutes = new Date(new Date().getTime() + 60 * 60 * 1000)
      const data = {
        username: this.loginForm.username,
        password: this.loginForm.password,
        captcha: this.loginForm.captcha
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          login(data).then(res => {
            if (res.status === 200) {
              this.getAdminInfos()
              Cookies.set('adminToken', res.data, { expires: inFifteenMinutes })
              this.$message({
                message: '登录成功',
                type: 'success'
              })
              setTimeout(() => {
                this.$router.push('/')
              }, 500)
            } else {
              this.$message.error(res.msg);
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '请输入正确的用户名密码',
            offset: 10
          })
        }
      })
    },

    // 更换验证码
    changeImg() {
      this.$refs.captcha.src = 'http://localhost:3000/v1/captcha?date=' + new Date()
    },

    // 检查是否已经登录
    checkHadLogin() {
      if (this.adminInfo.id) {
        this.$message({
          type: 'success',
          message: '检测到您之前登录过，将自动登录.'
        })
        this.$router.replace('/manage')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";
  .login {
    background-color: #324057;
    .form-container {
      @include wh(320px, 210px);
      @include ctp(320px, 210px);
      padding: 25px;
      border-radius: 5px;
      text-align: center;
      background: #fff;
      .submit-btn {
        width: 100%;
        font-size: 16px;
      }
      .manage-tip {
        position: absolute;
        width: 100%;
        top: -100px;
        left: 0;
        p {
          font-size: 34px;
          color: #fff;
        }
      }
      .tip-container {
        margin-top: -6px;
        .tip {
          font-size: 12px;
          color: red;
        }
      }
      .captcha-container {
        margin-bottom: 60px;
        position: relative;
        width: 100%;
        .captcha {
          position: absolute;
          left: 0;
          width: 60%;
        }
        .captcha-img {
          position: absolute;
          right: 0;
          top: 2px;
        }
      }
    }
  }
</style>
