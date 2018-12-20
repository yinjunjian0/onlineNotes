'use strict';

const Controller = require ('egg').Controller;

class userCtl extends Controller {
  // status:0.未注册 1.登陆成功 2.密码错误
  async login () {
    const {ctx, app} = this;
    console.log (ctx.query);
    const user = await ctx.service.user.isExistByLoginName (
      ctx.query.loginName
    );

    // 未注册
    if (user.user == null) {
      this.ctx.body = {msg: '未注册', status: 0};
    } else {
      if (user.user.password == ctx.query.password) {
        // base64 编码token (先将就一下)
        let token = new Buffer (`${user.user.id}_cat`).toString ('base64');

        this.ctx.body = {
          msg: '登陆成功',
          token: token,
          name: user.user.name,
          status: 1,
        };
      } else {
        this.ctx.body = {msg: '密码错误', status: 2};
      }
    }
  }

  async registered () {
    const {ctx, app} = this;
    console.log (ctx.query);
    const result = await ctx.service.user.registered (ctx.query);
    result.affectedRows == 1 ? (this.ctx.body = true) : (this.ctx.body = false);
  }
}

module.exports = userCtl;
