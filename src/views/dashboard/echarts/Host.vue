<template>
  <div class="charts" ref="charts">

  </div>
</template>

<script>
  export default {
    props: {
      hostData: {
        type: Array,
        default: () => [{ value: 0, name: '默认云平台' }]
      }
    },
    data () {
      return {
        charts: null
      }
    },
    mounted () {
      // this.loadCharts()
      setTimeout(() => {
        this.loadCharts()
      }, 500)
    },
    watch: {
      hostData: {
        deep: true,
        handler () {
          this.loadCharts()
        }
      }
    },
    methods: {
      loadCharts () {
        const xVal = this.hostData.map(item => {
          return item.name
        })
        const vals = this.hostData.map(item => {
          return item.value
        })
        const option = {
        grid: {
          left: '1%',
          right: '2%',
          bottom: '2%',
          top: '4%',
          containLabel: true
        },
        tooltip: {},
        xAxis: [
          {
            type: 'category',
            data: xVal,
            // 坐标轴刻度相关设置。
            axisTick: {
              show: false
            },
            // 坐标轴刻度标签的相关设置。
            axisLabel: {
              textStyle: {
                color: '#8893A0'
              }
            },
            // 坐标轴轴线相关设置。
            axisLine: {
              lineStyle: {
                color: '#DBE5F1'
              }
            }
          }
        ],

        yAxis: [
          {
            type: 'value',
            // 坐标轴在 grid 区域中的分隔线。
            splitLine: {
              lineStyle: {
                type: 'dotted',
                color: '#DBE5F1'
              }
            },
            // 坐标轴刻度标签的相关设置。
            axisLabel: {
              margin: 16,
              textStyle: {
                color: '#8893A0'
              }
            },
            // 坐标轴轴线相关设置。
            axisLine: {
              show: false
            },
            // 坐标轴刻度相关设置。
            axisTick: {
              show: false
            }
          }
        ],

        series: {
          type: 'bar',
          data: vals,
          barWidth: '12%',
          itemStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#8BD0FF' },
                { offset: 1, color: '#288CFF' }
              ])
            }
          }
        }
      }
        // 有的话就获取已有echarts实例的DOM节点。
        this.charts = this.$echarts.getInstanceByDom(this.$refs.charts)
        if (this.charts == null) {
          // 如果不存在，就进行初始化
          this.charts = this.$echarts.init(this.$refs.charts)
        }
        this.charts.setOption(option, true)
        // this.charts = this.$echarts.init(ele)
        // this.charts.setOption(option, true)

        window.addEventListener('resize', () => {
          this.charts.resize()
        })
      }
    },
    beforeDestroy () {
      window.removeEventListener('resize', () => {
        this.charts.resize()
      })
    }
  }
</script>

<style lang="less" scoped>
.charts {
  width: 100%;
  height: 270px;
}
</style>
