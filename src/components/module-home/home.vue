<!--后台首页-->
<template>
  <el-card class="box-card">
    <el-calendar v-model="value">
    </el-calendar>
  </el-card>
</template>

<script>
    export default {
        name: "home",
        data() {
          return {
            value: new Date()
          }
        }
    }
</script>

<style scoped>

</style>
