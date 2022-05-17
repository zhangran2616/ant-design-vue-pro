<template>
  <div style="height: 300px;">
    <div v-for="(item, index) in dataList" :key="index" class="progress-item">
      <span style="color: #929ca6">{{ item.name }}</span>
      <a-progress
        style="padding-left: 20px;"
        :percent="item.percent"
        :format="percent => percent + '%'"
        :stroke-color="{
          '0%': '#85cdff',
          '100%': '#288dff',
        }"
      />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      dataList: {
        type: Array,
        default: () => [{ percent: 100, name: 'VMWare' }]
      }
    },
    data () {
      return {
      }
    },
    mounted () {
      console.log(this.dataList, '***')
    }
  }
</script>

<style lang="less" scoped>
/deep/.ant-progress-text{
  color: #929ca6;
}
.progress-item{
  display: flex;
  margin-bottom: 10px;
}
</style>
