import User from '../models/user';

export class UserService {
    public static async createUser(email: string, password: string, user_type: string) {
        return User.create({ email, password, user_type });
    }

    public static async getAllUsers() {
        return User.findAll();
    }

    public static async getUserById(id: number) {
        return User.findByPk(id);
    }

    public static async getUserByEmail(email: string) {
        return User.findOne({ where: { email } });
    }

    public static async updateUser(id: number, updates: Partial<User>) {
        return User.update(updates, { where: { id }, returning: true });
    }

    public static async deleteUser(id: number) {
        return User.destroy({ where: { id } });
    }
}
