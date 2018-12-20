'use strict';
const Controller = require ('egg').Controller;

const moment = require ('moment');

let getId = str => {
  let id = new Buffer (str, 'base64').toString ();
  id = id.split ('_')[0];
  return id;
};

class articleCtl extends Controller {
  async getList () {
    const {ctx, app} = this;
    let id = getId (ctx.header.token);
    const result = await ctx.service.article.getList (id, ctx.query.type);
    this.ctx.body = result;
  }

  async add () {
    const {ctx, app} = this;
    console.log (ctx.query);
    let id = getId (ctx.header.token);
    let form = ctx.query;
    form.createBy = id;
    form.createTime = moment (new Date ()).format ('YYYY-MM-DD HH:mm:ss');
    const result = await ctx.service.article.add (ctx.query);
    result.affectedRows == 1 ? (this.ctx.body = true) : (this.ctx.body = false);
  }

  async save () {
    const {ctx, app} = this;
    console.log (ctx.query);
    let id = getId (ctx.header.token);
    let form = ctx.query;
    const result = await ctx.service.article.save (form);
    result.affectedRows == 1 ? (this.ctx.body = true) : (this.ctx.body = false);
  }
}

module.exports = articleCtl;
