<template>
  <h2>授权中。。。</h2>
</template>
<script setup lang="ts">
import useUserStore from '@/store/user'
import { getSSOTicket } from '@/api/auth'

const ticket = getSSOTicket()
const userStore = useUserStore()

if (ticket) {
  await userStore.login(ticket)
  window.location.href = '/#/index'
}
</script>
