<template>
  <div>
    <a-row>
      <a-col>
        <a-card :bordered="false">
          <a-descriptions title="基本信息">
            <a-descriptions-item label="名称">{{ platformDetail.name }}</a-descriptions-item>
            <a-descriptions-item label="连接状态">{{ platformDetail.status }}</a-descriptions-item>
            <a-descriptions-item label="IP">{{ platformDetail.ip }}</a-descriptions-item>
            <a-descriptions-item label="版本号">{{ platformDetail.version }}</a-descriptions-item>
            <a-descriptions-item label="同步用户">{{ platformDetail.username }}</a-descriptions-item>
            <a-descriptions-item label="同步状态">{{ platformDetail.status }}</a-descriptions-item>
            <a-descriptions-item label="上次同步">{{ platformDetail.createTime }}</a-descriptions-item>
            <a-descriptions-item label="添加时间">{{ platformDetail.createTime }}</a-descriptions-item>
          </a-descriptions>
          <a-divider style="margin-bottom: 32px"/>
        </a-card>

        <a-card :bordered="false">
          <a-card-grid style="width:20%;text-align:center">
            <img src="/platform/dc.png" alt />
            <p>数据中心</p>
            <p>{{ platformDetail.dcCount }}</p>
          </a-card-grid>
          <a-card-grid style="width:20%;text-align:center">
            <img src="/platform/cluster.png" alt />
            <p>集群</p>
            <p>{{ platformDetail.clusterCount }}</p>
          </a-card-grid>
          <a-card-grid style="width:20%;text-align:center">
            <img src="/platform/host.png" alt />
            <p>计算节点</p>
            <p>{{ platformDetail.hostCount }}</p>
          </a-card-grid>
          <a-card-grid style="width:20%;text-align:center">
            <img src="/platform/vm.png" alt />
            <p>虚拟机</p>
            <p>{{ platformDetail.vmCount }}</p>
          </a-card-grid>
          <a-card-grid style="width:20%;text-align:center">
            <img src="/platform/template.png" alt />
            <p>模板</p>
            <p>{{ platformDetail.templateCount }}</p>
          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { TagSelect, Ellipsis } from '@/components'
import { getPlatformDetail } from '@/api/resource'

export default {
  name: 'Base',
  components: {
    Ellipsis,
    TagSelect
  },
  data () {
    return {
      platformDetail: {},
      form: this.$form.createForm(this),
      loading: true
    }
  },
  mounted () {
    const cpfId = this.$route.query.cpfId
    this.getPlatformDetail(cpfId)
  },
  methods: {
    sync () {},
    getPlatformDetail (cpfId) {
      const requestParameters = { 'id': cpfId }
      getPlatformDetail(requestParameters)
      .then(res => {
       this.baseInfo = res.data
       this.platformDetail = res.data
      })
    }
  }
}
</script>
