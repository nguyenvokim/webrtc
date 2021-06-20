import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {RootState} from '@/store/index';

export interface SocketStateModel {
    socketId: string;
    socketNames: Record<string, string>
}

const getters: GetterTree<SocketStateModel, RootState> = {
    connectedSocketIds: (state): string[] => {
        return Object.keys(state.socketNames);
    }
};

const mutations: MutationTree<SocketStateModel> = {
    setSocketId: (state, payload: string) => {
        state.socketId = payload;
    },
    setSocketNames: (state, payload: Record<string, string>) => {
        state.socketNames = payload;
    }
};

const actions: ActionTree<SocketStateModel, RootState> = {

};

const initialState: SocketStateModel = {
    socketId: '',
    socketNames: {}
}

export default {
    namespaced: true,
    state: initialState,
    getters,
    mutations,
    actions
};
