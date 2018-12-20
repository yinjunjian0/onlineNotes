<template>
  <div class="flex flex-column">
    <div :class="leftNav">
      <!-- <img
        src="../assets/img/rightArrow.png"
        :class="arrowImg"
        @click="toggleLeftNav"
      > -->

      <i
        class="el-icon-arrow-right"
        :class="arrowImg"
        style="font-size:30px;"
        @click="toggleLeftNav"
      ></i>
      <transition
        name="fade"
        class="w100"
      >
        <el-menu
          v-if="leftNavActiveTF"
          :default-active="acticleTypeIndex"
          class="el-menu-demo mt60 w100"
          mode="horizontal"
          @select="changeArticleType"
        >
          <el-menu-item
            index="1"
            style="width:50%"
          >个人笔记</el-menu-item>
          <el-menu-item
            index="2"
            style="width:50%"
          >多人笔记</el-menu-item>
        </el-menu>
      </transition>
      <transition
        name="fade"
        class="w100"
      >
        <div
          v-if="leftNavActiveTF"
          class="w100 h100 flex flex-column flex-center"
        >
          <div
            class="w100"
            v-for="item in articleList"
            v-bind:key="item.id"
          >
            <div
              class="articleName"
              :class="article.name === item.name ? 'articleNameActive' : 'articleName'"
              @click="getArticleDetail(item)"
            >{{item.name}}</div>
          </div>
          <i
            class="el-icon-circle-plus-outline addBtn mt40"
            @click="getArticleName"
            style="font-size:30px;"
          ></i>
        </div>
      </transition>

    </div>

    <div :class="editorClass">
      <div
        class="flex flex-bt flex-aic w100 pad20 b-box"
        style="height:70px"
      >
        <input
          type="text"
          class="nameInput"
          :value="article.name"
          @input="delaySaveWithTitle"
        >
        <div class="flex flex-aic ">
          <h4 class="mr20">你好 , {{userName}}</h4>
          <el-button
            @click="logOut"
            type="danger"
          >注销</el-button>
        </div>

      </div>
      <mavon-editor
        class="flex-1"
        v-if="articleList.length"
        :value="article.content"
        @change="delaySave"
      ></mavon-editor>
      <div
        v-else
        class="bold flex-1 flex flex-center"
      >暂无文章,请创建</div>
      <div
        class="flex flex-aic w100 pad20 b-box"
        style="height:50px"
      >
        <div
          v-html="tips"
          class="flex flex-aic"
        >
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import "../assets/css/article.css";

export default {
  data() {
    return {
      acticleTypeIndex: "1",
      userName: localStorage.getItem("userName"),
      initArticleTF: false,
      leftNavActiveTF: true,
      leftNav: "leftNavActive flex flex-center flex-column",
      arrowImg: "arrowImgActive",
      editorClass: "editorActive",
      articleList: [],
      article: {}, //文章信息
      tips: "<i class='el-icon-loading'></i><h4 class='ml10'>初始化中</h4>", //提示信息
      delaySaveTimeOut: ""
    };
  },
  components: {
    mavonEditor
  },
  created() {
    this.getArticleList();
  },
  methods: {
    //   通用设置提示信息
    setTips(type, content) {
      this.tips = `<i class='el-icon-${type}'></i><h4 class='ml10'>${content}</h4>`;
    },
    changeArticleType(value) {
      this.acticleTypeIndex = value;
      this.getArticleList();
    },
    // 获取文章列表
    getArticleList() {
      this.get("/article/list", { type: this.acticleTypeIndex }, res => {
        this.setTips("loading", "初始化中");
        if (res.data.list) this.articleList = res.data.list;
        this.setTips("success", "初始化完毕");
        if (res.data.list.length == 0) return false;
        this.getArticleDetail(res.data.list[0]);
      });
    },
    getArticleDetail(article) {
      article.content ? "" : (article.content = "");
      this.article = article;
    },
    toggleLeftNav() {
      if (this.leftNavActiveTF) {
        this.arrowImg = "arrowImg";
        this.leftNav = "leftNav flex flex-center flex-column";
        this.editorClass = "editor";
      } else {
        this.arrowImg = "arrowImgActive";
        this.leftNav = "leftNavActive flex flex-center flex-column";
        this.editorClass = "editorActive";
      }
      this.leftNavActiveTF = !this.leftNavActiveTF;
    },
    getArticleName() {
      this.$prompt("请输入新建文章名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          console.log(value);
          this.addArticle(value);
        })
        .catch(() => {});
    },
    addArticle(value) {
      this.get("/article/add", { name: value }, res => {
        if (res.data) {
          this.$message({
            type: "success",
            message: "新建成功"
          });
          this.getArticleList();
        } else {
          this.$message({
            type: "error",
            message: "新建失败"
          });
        }
      });
    },
    delaySaveWithTitle(e) {
      console.log(e);
      this.article.name = e.target.value;
      this.tips = "<i class='el-icon-loading'></i><h4 class='ml10'>保存中</h4>";
      clearInterval(this.delaySaveTimeOut);
      this.delaySaveTimeOut = setTimeout(() => {
        this.save();
      }, 1000);
    },
    // markdown控件change事件
    delaySave(value) {
    //   if (!this.initArticleTF) return false;
      this.article.content = value;
      this.setTips("loading", "保存中");

      clearInterval(this.delaySaveTimeOut);
      this.delaySaveTimeOut = setTimeout(() => {
        this.save();
      }, 1000);
    },
    save() {
      this.get(
        "/article/save",
        {
          id: this.article.id,
          content: this.article.content,
          name: this.article.name
        },
        res => {
          if (res.data) {
            this.setTips("success", "保存成功");
          }
        }
      );
    },
    logOut() {
      this.$confirm("确认注销吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(({ value }) => {
          localStorage.removeItem("token");
          this.$router.push("/");
        })
        .catch(() => {});
    }
  }
};
</script>

