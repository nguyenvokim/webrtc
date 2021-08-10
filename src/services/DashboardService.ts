import axiosInstance from '@/services/axiosInstance';
import {AxiosResponse} from 'axios';
import UserModel from '@/models/UserModel';


class DashboardService {
    async getProfile(): Promise<AxiosResponse<UserModel>> {
        return await axiosInstance.get<UserModel>('/users/1');
    }
    async getUsers(): Promise<AxiosResponse<[UserModel]>> {
        return await axiosInstance.get<[UserModel]>('/users');
    }
}

export default new DashboardService();
