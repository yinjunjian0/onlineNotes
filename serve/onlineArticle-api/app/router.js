'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {router, controller} = app;
  router.get ('/', controller.user.login);

  router.get ('/user/login', controller.user.login);
  router.get ('/user/registered', controller.user.registered);

  router.get ('/article/list', controller.article.getList);
  router.get ('/article/add', controller.article.add);
  router.get ('/article/save', controller.article.save);
};
