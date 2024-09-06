import UserToken from '../models/token'; // Adjust the import path as needed

export class UserTokenService {
    public static async createUserToken(user_id: number, token: string, is_used: boolean, is_valid: boolean, expiry: Date) {
        return UserToken.create({ user_id, token, is_used, is_valid, expiry });
    }

    public static async getAllUserTokens() {
        return UserToken.findAll();
    }

    public static async getUserTokenById(id: number) {
        return UserToken.findByPk(id);
    }

    public static async getTokenByUserId(user_id: number) {
        return UserToken.findOne({ where: { user_id } });
    }

    public static async getUserByToken(token: string) {
        return UserToken.findOne({ where: { token } });
    }

    public static async updateUserToken(id: number, updates: Partial<UserToken>) {
        return UserToken.update(updates, { where: { id }, returning: true });
    }

    public static async deleteUserToken(id: number) {
        return UserToken.destroy({ where: { id } });
    }
}
