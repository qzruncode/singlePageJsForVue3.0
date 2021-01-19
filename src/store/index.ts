import { createStore, createLogger, Store } from 'vuex';
import { InjectionKey } from 'vue';

interface State {
  count: number
}

const store = {
  strict: process.env.NODE_ENV !== 'production',
  state () {
    return {
      count: 0
    };
  },
  mutations: {
    increment (state: State) {
      state.count++;
    }
  },
  plugins: [createLogger({logMutations: true})]
};

// 状态管理
export const key: InjectionKey<Store<State>> = Symbol(); // 支持ts
export const stores = createStore(store); // 内置日志记录
