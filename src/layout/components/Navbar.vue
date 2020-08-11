<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <span class="username">欢迎您~ {{adminInfo.username}}</span>
      <el-dropdown  @command="handleCommand" class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="adminInfo.avatar" alt="" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item command="personal">个人中心</el-dropdown-item>
          <el-dropdown-item command="signOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import {signOut} from "../../api/index";
import {mapActions, mapGetters} from "vuex";
import Cookies from 'js-cookie'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'adminInfo'
    ])
  },
  methods: {
    ...mapActions(["getAdminInfos"]),
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    handleCommand (command) {
      if (command === 'personal') {
        this.$router.push('/personal');
      } else if (command === 'signOut') {
        signOut().then(res => {
          console.log(res);
          if (res.status === 200) {
            Cookies.remove('adminToken')
            this.$store.commit('DEL_ADMININFO');
            this.$message({
              type: 'success',
              message: '退出成功'
            });
            this.$router.push('/')
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        }).catch(err => {
          console.log(err);
        })
      }
    }
  },
  mounted () {
    console.log(this.adminInfo);
    this.baseImgPath = this.adminInfo.avatar;
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
