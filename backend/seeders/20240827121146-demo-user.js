'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('users', [{
        first_name: 'user_first_name',
        last_name: 'user_last_name',
        email: 'user_email',
        password: 'user_encrypted_password',
        salt: 'generated_salt',
        created_at: new Date()
     }], {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('users', null, {});
     
  }
};
