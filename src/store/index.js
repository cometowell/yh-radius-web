import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    strict: true,
    state: {
        buttonPermissions: [],
    },
    getters: {
        permissionGetter: (state) => {
            return state.buttonPermissions;
        }
    },
    mutations: {
        permissionSetter: (state, playload) => {
            state.buttonPermissions = playload;
        }
    }
});

export default store;