import Vue from 'vue';
import Vuex from 'vuex';
import socket, {SocketStateModel} from '@/store/socket';

Vue.use(Vuex);

export interface RootState {
    socket: SocketStateModel,
}

export default new Vuex.Store({
    modules: {
        socket
    },
});
