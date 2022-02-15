import UserModel from '@/models/UserModel';
import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {RootState} from '@/store/index';
import DashboardService from '@/services/DashboardService';

export interface DashboardStateModel {
    users: UserModel[];
    profile: UserModel | null | object;
    isLoading: boolean | object
}

const initialState: DashboardStateModel = {
    users: [],
    profile: {},
    isLoading: {},
}

const getters: GetterTree<DashboardStateModel, RootState> = {

};

const actions: ActionTree<DashboardStateModel, RootState> = {
    fetchProfile: async ({commit, state}) => {
        try {
            const response = await DashboardService.getProfile();
            commit('setProfile', response.data)
        } catch (e) {
            // Global handle error
        }
    },
    fetchUsers: async ({commit, state}) => {
        try {
            const response = await DashboardService.getUsers();
            commit('setUsers', response.data)
        } catch (e) {
            // Global handle error
        }
    },
};

const mutations: MutationTree<DashboardStateModel> = {
    setProfile: (state, payload: UserModel) => {
        state.profile = payload;
    },
    setUsers: (state, payload: UserModel[]) => {
        state.users = payload;
    },
    setLoading: (state, payload: boolean) => {
        state.isLoading = payload;
    }
};


export default {
    namespaced: true,
    state: initialState,
    getters,
    mutations,
    actions
};
