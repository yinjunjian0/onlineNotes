<template>
  <div class="home">
    <el-card
      class="box-card posA posACenter"
      v-on:keyup.enter="login"
    >
      <h4 class="mt20">多人在线markdown文章系统</h4>
      <el-input
        class="mt40"
        placeholder="输入登陆名"
        v-model="loginFrom.loginName"
        @keyup.enter.native="login"
      ></el-input>
      <el-input
        placeholder="输入密码"
        class="mt20"
        v-model="loginFrom.password"
        type="password"
        @keyup.enter.native="login"
      ></el-input>
      <el-button
        class="mt20 w100"
        type="primary"
        @click="login"
      >登陆</el-button>
    </el-card>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "home",
  data() {
    return {
      loginFrom: { loginName: "", password: "" },
      registeredForm: {
        loginName: "",
        password: "",
        name: ""
      }
    };
  },
  components: {},
  mounted() {},
  methods: {
    login() {
      if (!this.loginFrom.loginName || !this.loginFrom.password) {
        this.$message({
          type: "error",
          message: "请输入用户名或密码"
        });
        return false;
      }

      this.get("/user/login", this.loginFrom, res => {
        if (res.data.status == 2) {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }

        if (res.data.status == 1) {
          this.$message({
            type: "success",
            message: res.data.msg
          });
          // 跳转
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userName", res.data.name);
          this.$router.push("article");
        }

        if (res.data.status == 0) {
          this.getName();
        }
      });
    },
    getName() {
      this.$prompt("该用户未注册，请输入昵称后快速注册", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (!value) {
            this.$message({
              type: "error",
              message: "未输入呢称,请重试"
            });
            return false;
          }
          console.log(value);
          this.registeredForm.name = value;
          this.registeredForm.loginName = this.loginFrom.loginName;
          this.registeredForm.password = this.loginFrom.password;
          this.registered();
        })
        .catch(() => {});
    },
    registered() {
      this.get("/user/registered", this.registeredForm, res => {
        if (res.data) {
          this.$message({
            type: "success",
            message: "注册成功"
          });
          this.login();
        } else {
          this.$message({
            type: "success",
            message: "注册失败，联系管理员"
          });
        }
      });
    }
  }
};
</script>
<style>
.box-card {
  width: 350px;
}
</style>

