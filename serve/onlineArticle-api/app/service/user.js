const Service = require ('egg').Service;

class UserService extends Service {
  async isExistByLoginName (loginName) {
    const user = await this.app.mysql.get ('user', {loginName: loginName});
    return {user};
  }

  async registered (registeredForm) {
    const result = await this.app.mysql.insert ('user', registeredForm);
    return result;
  }
}

module.exports = UserService;
