import { Sequelize } from 'sequelize';

const db = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST as string,
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    port: process.env.DB_PORT as unknown as number,
    logging: false,
    define: {
        underscored: true, // use snake_case for all fields in the database
        // freezeTableName: true, //stop the auto-pluralization performed by Sequelize
        timestamps: false // don't add timestamps to tables by default (createdAt, updatedAt)
    },
});
export default db;
import Blog from "./blog";
import User from "./user";
import Role from "./role";

// Role.hasMany(User)
// User.belongsTo(Role)

Blog.belongsTo(User, { as: "author" })
User.hasMany(Blog, { as: "blogs", foreignKey: "authorId" })
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });

// Review.belongsTo(User, { as: "owner" })
// User.hasMany(Review, { as: "reviews", foreignKey: "ownerId" })

// Category.hasMany(Blog)
// Blog.belongsTo(Category)

// Blog.hasMany(Review)
// Review.belongsTo(Blog)

// export { Blog, Category, Review, Role, User }
export { Blog,  User, Role }
