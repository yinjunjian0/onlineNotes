const Service = require ('egg').Service;

class articleService extends Service {
  async getList (id, type) {
    const list = await this.app.mysql.select ('article', {
      where: {createBy: id, type: type}, // WHERE 条件
    });

    return {list};
  }

  async add (form) {
    const result = await this.app.mysql.insert ('article', form);
    return result;
  }

  async save (form) {
    const row = form;
    const result = await this.app.mysql.update ('article', row);
    return result;
  }
}

module.exports = articleService;
