import { defineComponent, reactive, Transition, computed } from "vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { key } from './store'; // store中能用ts提示

const App = defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore(key);
    const data = reactive({
      activeIndex: '1',
      count: computed(() => store.state.count)
    });

    const handleSelect = (key:any, keyPath:any) => {
      store.commit('increment');
      console.log(key, keyPath);
    };

    return () => (
      <div>
        <el-menu default-active={data.activeIndex} class="el-menu-demo" mode="horizontal" onSelect={handleSelect}>
          <el-submenu index="1" v-slots={{
            title: () => (
              <>
                <span>菜单</span>
              </>
            )
          }}>
            <el-menu-item index="1-1" onClick={() => router.push('/')}>首页</el-menu-item>
            <el-submenu index="1-4" v-slots={{ title: () =>  <span>子菜单</span> }}>
              <el-menu-item index="1-4-1" onClick={() => router.push('/about')}>关于</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="2">处理中心</el-menu-item>
          <el-menu-item index="3" disabled>消息中心</el-menu-item>
          <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
        </el-menu>

        <router-view v-slots={{default: ({Component}: any) => {
          return (
            <>
              <Transition name="fade" mode="out-in">
                {Component?<Component title="Welcome"/>:null}
              </Transition>
            </>
          );
        }}}>
        </router-view>

        {data.count}
      </div>
    );
  },
});
export default App;