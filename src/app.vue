<template>
  <div class="example">
    {{ msg }}
    1111
  </div>
</template>

<script>
export default {
    data() {
        return {
            msg: "Hello world!",
        };
    },
};
</script>

<style lang="less" scoped>
.example {
  color: red;
}
</style>