<template>
  <div class="login-container">
    <div
      class="main"
      :loading="true"
    />

    <div class="footer">
      <div class="copyright">
        Copyright &copy; 2023 Antd-Templater
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/user'

const userStore = useUserStore()
// sso授权
try {
  console.log('login page come in')
  await userStore.ssoAuth('http://vscreen.12301.io/#/login/LoginCallback')
} catch (error) {
  console.error('getSsoUrl ERROR', error)
}
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  background: #f0f2f5 url(@/assets/login/background.svg);

  &>.main {
    width: 400px;
    height: 100%;
    flex: 0 0 auto;
    position: relative;

    &>.main-container {
      height: 450px;
      margin: auto 0;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 45px;
      right: 45px;
      bottom: 90px;

      &>.main-header {
        width: calc(100% - 72px);
        height: auto;
        margin: 0 auto 48px;

        &>.title {
          font-size: 33px;
          color: rgba(0, 0, 0, 0.85);
          text-align: center;
          font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
          font-weight: 600;

          &>.logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }
        }

        &>.description {
          font-size: 15px;
          color: rgba(0, 0, 0, 0.45);
          text-align: center;
          margin-top: 10px;
        }
      }

      &>.main-content {
        button.login-button {
          padding: 0 15px;
          width: calc(100% - 6px);
          margin: 0 3px;
        }
      }
    }
  }

  &>.footer {
    width: 100%;
    padding: 0 16px;
    margin: 48px 0 24px;
    text-align: center;
    position: fixed;
    bottom: 0;

    .copyright {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
    }
  }
}
</style>
