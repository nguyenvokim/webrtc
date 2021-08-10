import Vue from 'vue';
import Vuex from 'vuex';
import socket, {SocketStateModel} from '@/store/socket';
import dashboard from '@/store/dashboard';
import {DashboardStateModel} from '@/store/dashboard';

Vue.use(Vuex);

export interface RootState {
    socket: SocketStateModel;
    dashboard: DashboardStateModel;
}

export default new Vuex.Store({
    modules: {
        socket,
        dashboard,
    },
});
