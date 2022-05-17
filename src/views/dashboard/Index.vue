<template>
  <div class="p-b-16">
    <a-row :gutter="16" class="m-b-16">
      <a-col class="gutter-row" :span="8">
        <a-card title="虚拟机数量分布">
          <vm :virtualMachineData="virtualMachine.platform"></vm>
        </a-card>
      </a-col>
      <a-col class="gutter-row" :span="8">
        <a-card title="虚拟机状态分布">
          <vm :virtualMachineData="virtualMachine.status"></vm>
        </a-card>
      </a-col>
      <a-col class="gutter-row" :span="8">
        <a-card title="操作系统分布">
          <vm :virtualMachineData="virtualMachine.os"></vm>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="16" class="m-b-16">
      <a-col class="gutter-row" :span="8">
        <a-card title="云平台架构">
          <!-- slot="extra" -->
          <a-button slot="extra" type="link" @click="more('platform')">更多</a-button>
          <platform></platform>
        </a-card>
      </a-col>
      <a-col class="gutter-row" :span="8">
        <a-card title="计算节点分布">
          <host :hostData="hostData"></host>
        </a-card>
      </a-col>
      <a-col class="gutter-row" :span="8">
        <a-card title="存储信息">
          <a-button slot="extra" type="link" @click="more('store')">更多</a-button>
          <store></store>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="16" class="m-b-16">
      <a-col class="gutter-row" :span="8">
        <a-card title="CPU使用率TOP10">
          <a-button slot="extra" type="link" @click="more('cpu')">更多</a-button>
          <monitor :dataList="cpuDataList"></monitor>
        </a-card>
      </a-col>
      <a-col class="gutter-row" :span="8">
        <a-card title="内存使用率TOP10">
          <a-button slot="extra" type="link" @click="more('memory')">更多</a-button>
          <monitor :dataList="memoryDataList"></monitor>
        </a-card>
      </a-col>
      <a-col class="gutter-row" :span="8">
        <a-card title="存储使用率TOP10">
          <a-button slot="extra" type="link" @click="more('storage')">更多</a-button>
          <monitor :dataList="storageDataList"></monitor>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { summaryVm } from '@/api/dahboard'
import Vm from './echarts/Vm.vue'
import Host from './echarts/Host.vue'
import Platform from './table/Platform.vue'
import Store from './table/Store.vue'
import Monitor from './echarts/Monitor.vue'
  export default {
    components: {
      summaryVm,
      Vm,
      Platform,
      Store,
      Host,
      Monitor
    },
    data () {
      return {
        virtualMachine: {
          // 虚拟机数量分布数据
          platform: [],
          // 虚拟机状态分布
          status: [],
          // 操作系统分布
          os: []
        },
        cpuDataList: [
          {
            name: 'VMWare',
            percent: 100
          },
          {
            name: 'VMWare',
            percent: 90
          }
        ],
        memoryDataList: [
          {
            name: 'VMWare',
            percent: 100
          },
          {
            name: 'VMWare',
            percent: 90
          }
        ],
        storageDataList: [
          {
            name: 'VMWare',
            percent: 100
          },
          {
            name: 'VMWare',
            percent: 90
          }
        ],
        hostData: []
      }
    },
    created () {
      this.getVirtualMachine()
      this.getCpuDataList()
      this.getMemoryDataList()
      this.getStorageDataList()
    },
    methods: {
      getVirtualMachine () {
        summaryVm().then(res => {
          console.log(res.data)
          const platformVmRelation = res.data.platformVmRelation
          const statusVmRelation = res.data.statusVmRelation
          const osVmRelation = res.data.osVmRelation
          const platformHostRelation = res.data.platformHostRelation
          for (const k in platformVmRelation) {
            this.virtualMachine.platform.push({ 'name': k, 'value': platformVmRelation[k] })
          }
          for (const k in statusVmRelation) {
            let s = '未知'
            if (k === '0') {
              s = '未知'
            } else if (k === '1') {
              s = '开机'
            } else if (k === '2') {
              s = '关机'
            } else if (k === '3') {
              s = '挂起'
            } else {
              s = '未知'
            }
            this.virtualMachine.status.push({ 'name': s, 'value': statusVmRelation[k] })
          }
          for (const k in osVmRelation) {
            this.virtualMachine.os.push({ 'name': k, 'value': osVmRelation[k] })
          }
          for (const k in platformHostRelation) {
            this.hostData.push({ 'name': k, 'value': platformHostRelation[k] })
          }
        })
      },

      // 获取CPU使用率TOP10
      getCpuDataList () {
        console.log(this.cpuDataList)
      },
      // 获取内存使用率TOP10
      getMemoryDataList () {
        console.log(this.memoryDataList)
      },
      // 获取存储使用率TOP10
      getStorageDataList () {
        console.log(this.storageDataList)
      },
      // 更多
      more (name) {
        console.log(name)
      }
    }
  }
</script>

<style lang="less" scoped>
.m-b-16{
  margin-bottom: 16px;
}
.p-b-16{
  padding-bottom: 16px;
}
/deep/.ant-card-extra{
  padding: 0px;
}
/deep/.ant-progress-text{
  color: #929ca6;
}
.progress-item{
  display: flex;
  margin-bottom: 10px;
}
</style>
