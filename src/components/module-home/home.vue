<!--后台首页-->
<template>

    <el-col class="tableHeaderToolButtonGroup" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <!--   第一行4卡片内容   -->
      <el-row :gutter="12">
        <el-col :span="6">
          <el-card shadow="always">
            <p style="font-size:13px;font-family:'Microsoft YaHei';color: #999999">
              今日访问人数
            </p>
            <p style="font-size:28px;font-family:'Microsoft YaHei'">
              <i class="el-icon-thumb"></i> 1,800
            </p>
            <p style="font-size:13px;font-family:'Microsoft YaHei'">
              周同比12%  <i class="el-icon-arrow-up"></i> 日同比11% <i class="el-icon-arrow-down"></i>
            </p>
            <el-divider></el-divider>
            <p style="font-size:13px;font-family:'Microsoft YaHei';float:left;">
              总访问人数
            </p>
            <p style="font-size:13px;font-family:'Microsoft YaHei';float:left;">
              <i class="el-icon-thumb"></i> 2,795,852
            </p>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card shadow="always">
            <p style="font-size:13px;font-family:'Microsoft YaHei';color: #999999">
              今日注册数
            </p>
            <p style="font-size:28px;font-family:'Microsoft YaHei'">
              <i class="el-icon-s-check"></i> 80
            </p>
            <p style="font-size:13px;font-family:'Microsoft YaHei'">
              周同比12%  <i class="el-icon-arrow-up"></i> 日同比11% <i class="el-icon-arrow-down"></i>
            </p>
            <el-divider></el-divider>
            <p style="font-size:13px;font-family:'Microsoft YaHei';float:left;">
              总用户数
            </p>
            <p style="font-size:13px;font-family:'Microsoft YaHei';float:left;">
              <i class="el-icon-s-check"></i> 452,625
            </p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">
            <p style="font-size:12px;font-family:'Microsoft YaHei'">
              用户活跃数
            </p>
            <p style="font-size:20px;font-family:'Microsoft YaHei'">
              总用户数
            </p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">
            <p style="font-size:12px;font-family:'Microsoft YaHei'">
              待办事项
            </p>
          </el-card>
        </el-col>
      </el-row>

      <!--   第一行 日期内容   -->
      <el-card  shadow="always" style="margin-top: 14px">
        <el-row :gutter="10">
          <el-col :span="12"><div class="grid-content bg-purple">
            <div id="main" style="width: 600px;height: 400px;"></div>
          </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple">
            <el-calendar v-model="value">
            </el-calendar>
          </div></el-col>
        </el-row>
      </el-card>

    </el-col>


</template>

<script>
  import echarts from 'echarts'
    export default {
        name: "home",
        data() {
          return {
            value: new Date(),
            charts: '',
            opinion:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],
            opinionData:[
              {value:335, name:'直接访问'},
              {value:310, name:'邮件营销'},
              {value:234, name:'联盟广告'},
              {value:135, name:'视频广告'},
              {value:1548, name:'搜索引擎'}
            ],

          }
        },
        methods:{
          drawPie(id){
            this.charts = echarts.init(document.getElementById(id))
            this.charts.setOption({
              tooltip: {
                trigger: 'item',
                formatter: '{a}<br/>{b}:{c} ({d}%)'
              },
              legend: {
                orient: 'vertical',
                x: 'left',
                data:this.opinion
              },
              series: [
                {
                  name:'访问来源',
                  type:'pie',
                  radius:['50%','70%'],
                  avoidLabelOverlap: false,
                  label: {
                    normal: {
                      show: false,
                      position: 'center'
                    },
                    emphasis: {
                      show: true,
                      textStyle: {
                        fontSize: '30',
                        fontWeight: 'blod'
                      }
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data:this.opinionData
                }
              ]
            })
          }
        },
        //调用
        mounted(){
          this.$nextTick(function() {
            this.drawPie('main')
          })
        }

    }
</script>

<style scoped>

</style>
