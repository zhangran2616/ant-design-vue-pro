<template>
  <div class="charts" ref="charts">

  </div>
</template>

<script>
  export default {
    props: {
      virtualMachineData: {
        type: Array,
        default: () => [{ value: 1, name: '默认云平台' }]
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
      virtualMachineData: {
        deep: true,
        handler () {
          this.loadCharts()
        }
      }
    },
    methods: {
      loadCharts () {
        const scale = 1
        let sum = 0
        this.virtualMachineData.forEach(item => {
          sum += item.value
        })
        const option = {
          tooltip: {},
          title: {
            text: '虚拟机数量',
            left: '18%',
            top: '50%',
            padding: [26, 0],
            textStyle: {
              color: '#b0b3ba',
              fontSize: 14 * scale,
              align: 'center'
            }
          },
          legend: {
            data: this.virtualMachineData,
            top: 'middle',
              icon: 'circle',
              right: '5%',
              width: 20,
              itemGap: 20,
              itemWidth: 12,
              itemHeight: 12,
              // borderRiadius: 20,
              textStyle: {
                rich: {
                  // 通过富文本rich给每个项设置样式，下面的oneone、twotwo、threethree可以理解为"每一列"的样式
                  oneone: {
                    // 设置文字、数学、英语这一列的样式
                    width: 80,
                    color: '#b0b3ba',
                    fontSize: 12,
                    fontWeight: 'bolder'
                  },
                  twotwo: {
                    // 设置10分、20分、30分这一列的样式
                    width: 35,
                    color: '#3a444e',
                    fontSize: 12
                  }
                }
              },
              formatter: function (name) {
                var data = option.series[0].data
                var tarValue
                for (var i = 0; i < data.length; i++) {
                  if (data[i].name === name) {
                    tarValue = data[i].value
                  }
                }
                return `{oneone|${name}}  {twotwo|${tarValue}}`
              }
            },
          series: [
            {
              name: '虚拟机',
              type: 'pie',
              radius: ['60%', '80%'],
              center: ['25%', '50%'],
              itemStyle: {
                borderWidth: 5, // 设置border的宽度有多大
                borderColor: '#fff'
              },
              hoverAnimation: false,
              color: ['#c487ee', '#deb140', '#49dff0', '#034079', '#6f81da', '#00ffb4'],
              data: this.virtualMachineData,
              label: {
                show: false
              },
              labelLine: { // 删除指示线
                show: false
              }
            },
            {
                hoverAnimation: false,
                name: 'total',
                type: 'pie',
                radius: ['70%', '70%'],
                center: ['25%', '50%'],
                z: -99,
                // avoidLabelOverlap: false,
                label: {
                  show: true,
                  position: 'center',
                  color: '#333',
                  fontSize: 24,
                   formatter: function (params, ticket, callback) {
                     const total = params.data.total
                     return total
                   }
                },
                data: [{
                  value: sum,
                  name: '总计',
                  total: sum,
                  itemStyle: {
                      normal: {
                          borderWidth: 2,
                          borderColor: '#fff'
                      }
                  }
                }]
              }
          ]
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
  height: 200px;
}
</style>
