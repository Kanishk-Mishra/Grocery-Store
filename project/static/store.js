// import Vue from 'vue';
// import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    receivedDataFromNavbar: null
  },
  mutations: {
    setReceivedData(state, data) {
      state.receivedDataFromNavbar = data;
    }
  },
  actions: {
  },
  getters: {
  }
});
