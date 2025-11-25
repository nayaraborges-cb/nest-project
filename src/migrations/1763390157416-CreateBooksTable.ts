import { QueryInterface, DataTypes } from 'sequelize';

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('books', 'coverKey', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('books', 'coverKey');
  },
};


/*module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('books', 'coverKey', {

      type: Sequelize.STRING,
      allowNull: true,

      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      author: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      coverKey: {
        type: DataTypes.STRING,
        allowNull: true, // chave do arquivo no S3
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('books', 'coverKey');
  },
}; */
