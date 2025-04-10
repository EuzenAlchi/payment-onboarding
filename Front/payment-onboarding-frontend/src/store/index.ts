import { createStore } from 'vuex'

export interface State {
  transactionStatus: string | null
}

const state: State = {
  transactionStatus: null,
}

export default createStore({
  state,
  mutations: {
    setTransactionStatus(state: State, status: string) {
      state.transactionStatus = status
    },
  },
  actions: {
    updateTransactionStatus(
      { commit }: { commit: (mutation: 'setTransactionStatus', payload: string) => void },
      status: string,
    ) {
      commit('setTransactionStatus', status)
    },
  },
  getters: {
    transactionStatus(state: State): string | null {
      return state.transactionStatus
    },
  },
})
