
<template>


<!--    <el-card class="box-card" >-->
<!--&lt;!&ndash;      <el-image :src="backgroundImage" ></el-image>&ndash;&gt;-->
<!--      <div class="img_box"></div>-->
<!--    </el-card>-->

  <div class="img_box"></div>


</template>

<script>
  export default {
    data() {
      return {
        backgroundImage: 'https://5b0988e595225.cdn.sohucs.com/images/20180426/1fa056ab00f24209a9031738097f39b8.gif',

      }
    },


  };

</script>

<style scoped>
  .img_box{
    width: 100%;height: 100%;
    background-image: url(https://5b0988e595225.cdn.sohucs.com/images/20180426/1fa056ab00f24209a9031738097f39b8.gif);
    background-size: cover; /* 使图片平铺满整个浏览器（从宽和高的最大需求方面来满足，会使某些部分无法显示在区域中） */
    /* overflow: hidden; */
    /* overflow: auto; */
    z-index: -1;
    background-repeat: no-repeat;
  }
</style>
