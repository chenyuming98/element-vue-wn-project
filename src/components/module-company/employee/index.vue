<template>

  <div>
    <!--表格头菜单-->
    <el-card class="box-card">
      <div class="tableHeaderToolButtonGroup">
        <!--搜索表单 + 表单搜索按钮   prop在表单重置时候有用！ -->
        <div id="searchForm">
          <el-form :model="requestParameters" :inline="true" status-icon :rules="rules" ref="searchRefForm" label-width="40px"
                   size="mini" style=" height: 45px;">
            <el-form-item label="搜索" prop="name">
            </el-form-item>
            <el-form-item label="" prop="sex">
              <el-input v-model="requestParameters.name" placeholder="员工姓名" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="" prop="sex">
              <el-select v-model="requestParameters.sex" placeholder="请选择性别">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
              <el-form-item label="" v-show="showMoreSearchInput" prop="number">
                <el-input v-model="requestParameters.number" placeholder="工号" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="" v-show="showMoreSearchInput" prop="phone">
                <el-input v-model="requestParameters.phone" maxlength="11" placeholder="手机号码" autocomplete="off"></el-input>
              </el-form-item>
<!--              <el-form-item label=""  v-show="showMoreSearchInput">-->
<!--                <el-input v-model="requestParameters.identityCard" maxlength="18" placeholder="身份证"-->
<!--                          autocomplete="off"></el-input>-->
<!--              </el-form-item>-->
              <el-form-item>
                <el-button style="margin-left: 15px;" size="mini" type="primary" icon="el-icon-refresh-left" @click="resetForm('searchRefForm')">重置</el-button>
                <el-button size="mini" type="primary" icon="el-icon-search" @click="doQuery">搜索</el-button>
                <el-dropdown>
                <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"  @click="showMoreSearch">  更多条件</i>
                  <el-dropdown-menu slot="dropdown">
                  </el-dropdown-menu>
                </span>
                </el-dropdown>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
        <!--表格头菜单 功能按钮-->
<!--        <div id="handButton" >-->
<!--          <el-button icon="el-icon-plus" size="mini" @click="handleAdd">新增员工</el-button>-->
<!--          <el-button icon="el-icon-delete" size="mini" @click="batchDelete">批量删除</el-button>-->

<!--          <el-button icon="el-icon-download" size="mini" @click="">导入</el-button>-->
<!--          <el-button icon="el-icon-upload2" size="mini" @click="">导出</el-button>-->
<!--        </div>-->
        <div id="handButton" >
          <el-row type="flex" class="row-bg">

            <el-col :span="2">
              <el-button icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
            </el-col>

            <el-col :span="2">
              <el-button icon="el-icon-delete" size="mini" @click="batchDelete">删除</el-button>
            </el-col>

            <el-col :span="2">
              <!--     :auto-upload =true 立即上传   action上传地址 limit限制文件数量 headers携带请求头 &ndash;&gt;-->
              <el-upload
                class="upload-demo"
                ref="upload"
                action="http://www.tianyu.com/organization/employee/fileUpLoad"
                :limit="1"
                :on-success="handleAvatarSuccess"
                :headers="token"
                :auto-upload="true">
                <el-button icon="el-icon-download" size="mini" @click="">导入</el-button>
              </el-upload>
            </el-col>

            <el-col :span="2">
              <el-button icon="el-icon-upload2" size="mini" @click="download">导出</el-button>
            </el-col>

          </el-row>


          <!--          &lt;!&ndash; :auto-upload =true 立即上传   action上传地址 limit限制文件数量 headers携带请求头 &ndash;&gt;-->
          <!--          <el-upload-->
          <!--            class="upload-demo"-->
          <!--            ref="upload"-->
          <!--            action="http://www.tianyu.com/person/worklog/fileUpLoad"-->
          <!--            :limit="1"-->
          <!--            :headers="token"-->
          <!--            :auto-upload="true">-->
          <!--            <el-button icon="el-icon-download" size="mini" @click="">导入</el-button>-->
          <!--          </el-upload>-->

          <!--          <el-button icon="el-icon-upload2" size="mini" @click="">导出</el-button>-->
        </div>
      </div>
    </el-card>

    <!--表格内容  ref绑定选中内容-->
    <el-card class="tableCard" >
    <el-table :data="dataList"  style="width: 100%" border  ref="multipleTable"  >
          <el-table-column type="selection" width="40" prop="employeeId"> </el-table-column>
          <el-table-column  prop="name"  label="员工姓名"  width="100"> </el-table-column>
          <el-table-column  prop="number"  label="工号"  width="100"> </el-table-column>
          <!--    //TODO等待使用FASTDFS    -->
          <el-table-column  prop="images"  label="头像"  width="100">
            <template   slot-scope="scope">
              <div class="block"><el-avatar size="small" :src="scope.row.images"></el-avatar></div>
            </template>
          </el-table-column>
          <el-table-column  prop="sex_dictText"  label="性别"  width="60"> </el-table-column>
          <el-table-column  prop="phone"  label="手机号"  width="180"> </el-table-column>
          <el-table-column  prop="identityCard"  label="身份证"  sortable width="180"> </el-table-column>
          <el-table-column
            prop="userStatus"
            label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.userStatus"
                active-color="#13ce66"
                :active-value= 0
                :inactive-value=  1
                @change="handleStatus(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column  prop="birthday"  label="生日"  width="100"> </el-table-column>
                  <el-table-column  fixed="right"  label="操作"  width="180">
                    <template slot-scope="scope">
                      <el-button @click="handleRowEdit(scope.row)"  type="text" style="margin-left: 16px;">详情</el-button>
                      <el-button @click="handleRowDelete(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>

        </el-table>


      <!--表格分页-->
      <div class="block">
        <!-- current-page 当前页数  每页显示数-->
        <div class="tablePagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="requestParameters.page"
            :page-size="requestParameters.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </el-card>
      <el-drawer  :visible.sync="drawer" :direction="direction"
                  title="详情" size="38%"    :before-close="handleClose"    >
        <!-- :model绑定表单对象  status-icon控制每一行表单校验通过后图标显示正确和错误   :rules绑定校验规则
          autocomplete="off" 关闭表单默认以及功能-->
        <el-card class="box-card">
            <div id="drawerForm">
              <el-form :model="formBase" status-icon :rules="rules" ref="refForm" label-width="120px" size="mini">
                <el-form-item label="员工姓名" prop="name" >
                  <el-input v-model="formBase.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="工号" prop="number" >
                  <el-input v-model="formBase.number" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone" >
                  <el-input v-model="formBase.phone" maxlength="11" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证" prop="identityCard" >
                  <el-input v-model="formBase.identityCard" maxlength="18" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex" >
                  <el-radio-group v-model="formBase.sex"  >
                    <el-radio label="1" >男</el-radio>
                    <el-radio label="2" >女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="邮箱" prop="mailbox" >
                  <el-input v-model="formBase.mailbox" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="生日" prop="birthday" >
                  <el-date-picker v-model="formBase.birthday" type="date"  placeholder="选择日期" > </el-date-picker>
                </el-form-item>
                <el-form-item label="地址" prop="address" >
                  <el-input v-model="formBase.address" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="更新时间" prop="updateTime" >
                  <el-input v-model="formBase.updateTime" autocomplete="off" readonly></el-input>
                </el-form-item>
              </el-form>
            <!--    表单按钮   -->
             <div slot="footer" class="dialog-footer" style="position:absolute;right:5px;bottom:5px;">
                        <el-button  size="mini" @click="cancel">取 消</el-button>
                        <el-button  size="mini" type="primary" @click="submitForm">确 定</el-button>
                      </div>
            </div>
        </el-card>
      </el-drawer>
    <!--2. 添加编辑表单  -->
    <el-dialog :title="formTitle"  :visible.sync="dialogFormVisible" :before-close="cancel" :close-on-click-modal="false" :width="'40%'">

    </el-dialog>
  </div>

</template>
<!--主页面板-->
<script>
  import {list,add,update,remove,batchRemove,exportFile} from "@/api/base/employee"
  import {findRoleAll} from "@/api/base/role";
  import {showLoading,hideLoading} from '@/utils/loadingUtils';

  const  multipleSelectionList =  new Set([]);
  const mytoken =  localStorage.getItem('accessToken');
    export default {
      data() {
        return {
          token: {'Authorization': mytoken},
          showMoreSearchInput: false,
          drawer: false,
          direction: 'rtl',
          userAdd: 'UserAdd',
          dataList: [],
          multipleSelection: multipleSelectionList,
          total: 0,
          requestParameters: {
            page: 1,
            size: 10,
            number: undefined,
            name: undefined,
            sex: undefined,
            phone:undefined,
            identityCard: undefined,
          },
          userHaveRoles: [],
          rolesData: [],
          //定义弹框绑定显示状态
          dialogFormVisible: false,
          formTitle : '添加',
          //定义表单初始化参数
          formBase: {
            employeeId:"",
            number: '',
            name: '',
            sex: '',
            phone:'',
            mailbox:'',
            birthdayFormat:'',
            identityCard: '',
            address: '',
            createTime: '',
            updateTime: '',
            birthday:''
          },
          //条件搜索
          searchForm:{
            number: '',
            name: '',
            sex: '',
            phone:'',
            identityCard: '',
          },
          //v-model 绑定校验规则
          rules: {
            // name: [
            //   {required: true, message: '请输入员工姓名', trigger: 'blur'},
            //   {min: 6, max: 11, message: '员工姓名长度在 6 到 11 个字符', trigger: 'blur'}
            // ],
            // userPassword: [{required: true, message: '请输入密码', trigger: 'blur'},
            //   {min: 6, max: 16, message: '密码长度在 6 到 16个字符', trigger: 'blur'}]
          },
        }
      },

      methods: {

        /*
        * 查询员工表格
        */
        doQuery(params) {
          showLoading();
          list(this.requestParameters)
            .then(res => {
              let resp = res.data;
              this.dataList = resp.data;
              this.total = resp.total;
              hideLoading();
            })
        },

        /*
        * 查询所有角色
        */
        doQueryRoles() {
          findRoleAll()
            .then(res => {
              let resp = res.data;
              this.rolesData = resp.data;
            })
        },

        /*
        *改变每页显示数
        */
        handleSizeChange(val) {
          this.requestParameters.size = val;
          this.doQuery()
        },

        /*
        *改变当前页码数
       */
        handleCurrentChange(val) {
          this.requestParameters.page = val;
          this.doQuery()
        },

        /**
         * 表格格式化内容
         */
        formatterRoles(row, column) {
          let roles = row['roles'];
          let rolesNames = '';
          if (roles) {
            $.each(roles, function (index, val) { //index是数组对象索引，val是对象
              if (index === 0) {
                rolesNames = val.roleName;
              } else {
                rolesNames = rolesNames + ',' + val.roleName;
              }
            });
          }
          return rolesNames;
        },

        /**
         * 添加新员工
         */
        handleAdd() {
          this.drawer = true;
          this.formBase = { "sex": "1"};
        },

        /**
         * 表格行编辑
         */
        handleRowEdit(rowData){
          this.drawer = true;
          this.formBase = rowData;
        },

        /**
         * 表格行删除员工
         */
        handleRowDelete(rowData) {
          this.$confirm(
            `本次操作将删除[ ${rowData.name} ]删除后员工将不可恢复，您确认删除吗？`, {
              type: 'warning'
            }
          ).then(() => {
            remove({id: rowData.employeeId})
              .then(res => {
                let resp = res.data;
                if (resp.code === 200) {
                  this.$message.success('删除成功!');
                  this.doQuery();
                } else {
                  this.$message.success(resp.msg);
                }
              })
          }).catch(() => {
          });
        },

        /**
         *  表头批量删除员工
         */
        batchDelete() {
          let list = this.$refs.multipleTable.selection;
          if (list.length===0){
            this.$message.warning("请勾选操作对象！");
            return false;
          }
          let deleteNames,deleteIds;
          let submitData = new FormData();
          for (let i = 0; i < list.length; i++) {
            if (i===0){
              deleteNames = list[i].name;
              deleteIds = list[i].employeeId;
            }else {
              deleteNames += ","+list[i].name;
              deleteIds +=  ","+list[i].employeeId;
            }
          }
          this.$confirm(  `本次操作将删除[ ${ deleteNames } ],删除后员工将不可恢复，您确认删除吗？`, {
              type: 'warning'
            }  ).then(() => {
            submitData.append("ids",deleteIds);
            showLoading();
            batchRemove(submitData)
              .then(res => {
                let resp = res.data;
                if (resp.code === 200) {
                  this.$message.success('删除成功!');
                  this.doQuery();
                  hideLoading();
                } else {
                  hideLoading();
                  this.$message.error(resp.msg);
                }
              })
          }).catch(() => {
          });

        },

        /**
         * 表单取消对话框事件
         */
        cancel() {
          this.dialogFormVisible = false;
          this.userHaveRoles = [];
          this.$refs['refForm'].resetFields();
          this.drawer =false
        },

        /**
         * 提交表单
         */
        submitForm(){
          this.$refs['refForm'].validate((valid) => {
            if (valid) {
              showLoading();
              this.formBase.createTime =undefined;
              this.formBase.updateTime =undefined;
              if (this.formBase.employeeId){
                update(this.formBase).then(res => {
                  let resp  = res.data;
                  this.$message({message:resp.msg,type:resp.code===200?"success":"error"});
                  if(resp.code===200) {
                    this.drawer =false;
                    this.$refs['refForm'].resetFields();
                    this.doQuery();
                    hideLoading();
                  }
                })
              }else {
                add(this.formBase).then(res => {
                  let resp  = res.data;
                  this.$message({message:resp.msg,type:resp.code===200?"success":"error"});
                  if(resp.code===200) {
                    this.drawer =false;
                    this.$refs['refForm'].resetFields();
                    this.doQuery();
                    hideLoading();
                  }
                })
              }
            } else {
              return false;
            }
          });
          this.userHaveRoles = [];
        },

        /**
         * 员工详情打开右侧抽屉，处理抽屉关闭
         */
        handleClose(done) {
          done();
          // this.$confirm('确认关闭？')
          //   .then(_ => {
          //     done();
          //   })
          //   .catch(_ => {});
        },

        /**
         * 表单内容重置 -这里用在重置搜索表单
         */
        resetForm(formName) {
          this.$nextTick(() => {
            this.$refs[formName].resetFields();
          })
        },

        /**
         * 控制表格头 菜单搜索条件显示
         */
        showMoreSearch(){
          this.showMoreSearchInput = !this.showMoreSearchInput;
        },
        // 下载Excel
        download() {
          exportFile().then(response => {
            this.downloadFile(response.data);
          })
        },

        downloadFile(data) {
          // 文件导出
          if (!data) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', '员工信息表.xls');
          document.body.appendChild(link);
          link.click()
        },

        /**
         *  处理文件上传 接口消息回调
         */
        handleAvatarSuccess(res, file){
          let code = res['code'];
          if (code===200){
            this.$message.success('上传成功!');
            this.doQuery();
          }else {
            this.$message.error(res['msg']);
          }

        },

      },
      // 创建完毕状态
      created: function () {
        this.doQuery()
      }
    }
</script>

<style scoped>
  .el-input{
    width: 300px;
  }
  #searchForm .el-input{
    width: 150px;
  }
  #searchForm .el-select{
    width: 150px;
  }
  .el-select{
    width: 300px;
  }
  #drawerForm {
    margin-top: 10px;
  }
  /deep/.el-table th > .cell {
    text-align: center;
  }
  /deep/.el-table .cell {
    text-align: center;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
