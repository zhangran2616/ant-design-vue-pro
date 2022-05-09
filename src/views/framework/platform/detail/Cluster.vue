<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="关键字">
              <a-input v-model="queryParam.keyword" placeholder="名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24">
            <span class="table-page-search-submitButtons" style="float: 'right', overflow: 'hidden'">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
    </s-table>
  </a-card>
</template>
<script>
import { Ellipsis, STable } from '@/components'
import { queryCluster } from '@/api/resource'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '云平台',
    dataIndex: 'cpfName'
  },
  {
    title: 'CPU',
    dataIndex: 'cpu',
    customRender: (text, record, index) => {
      return (text / 1000 / 1000 / 1000).toFixed(2).replace(/[.]?0+$/, '') + 'GHz'
    }
  },
  {
    title: '内存',
    dataIndex: 'memory',
    customRender: (text, record, index) => {
      if (text < 1099511627776) {
        return (text / 1024 / 1024 / 1024).toFixed(2).replace(/[.]?0+$/, '') + 'GB'
      } else {
        return (text / 1024 / 1024 / 1024 / 1024).toFixed(2).replace(/[.]?0+$/, '') + 'TB'
      }
    }
  },
  {
    title: '存储',
    dataIndex: 'store',
    customRender: (text, record, index) => {
      if (text < 1099511627776) {
        return (text / 1024 / 1024 / 1024).toFixed(2).replace(/[.]?0+$/, '') + 'GB'
      } else {
        return (text / 1024 / 1024 / 1024 / 1024).toFixed(2).replace(/[.]?0+$/, '') + 'TB'
      }
    }
  },
  {
    title: '计算节点',
    dataIndex: 'hostCount'
  },
  {
    title: '虚拟机',
    dataIndex: 'vmCount'
  },
  {
    title: '模板',
    dataIndex: 'templateCount'
  }
]
export default {
  name: 'Cluster',
  components: {
    Ellipsis,
    STable
  },
  data () {
    this.columns = columns
    return {
      queryParam: {},
      form: this.$form.createForm(this),
      loading: true,
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return queryCluster(requestParameters)
          .then(res => {
            return res.data
          })
      }
    }
  },
  computed: {

  },
  mounted () {
  },
  methods: {

  }
}
</script>
