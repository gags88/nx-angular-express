import sequelize from './index';

export const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected.');
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('❌ DB connection failed:', error);
  }
};
