<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="实例名称/IP">
                <a-input v-model="queryParam.username" placeholder="请输入实例名称/IP"/>
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
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleDetail(record)">详情</a>
          </template>
        </span>
      </s-table>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { queryVmMonitor } from '@/api/monitor'

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
    title: 'IP',
    dataIndex: 'ip'
  },
  {
    title: '云平台',
    dataIndex: 'cpfName'
  },
  {
    title: 'CPU使用率',
    dataIndex: 'cpu',
    customRender: (text, record, index) => {
      return text.HOST_CPU_USED.toFixed(2).replace(/[.]?0+$/, '') + '%'
    }
  },
  {
    title: '内存使用率',
    dataIndex: 'memory',
    customRender: (text, record, index) => {
      return text.HOST_MEM_USED.toFixed(2).replace(/[.]?0+$/, '') + '%'
    }
  },
  {
    title: '网络I/O速率',
    dataIndex: 'network',
    customRender: (text, record, index) => {
      return text.HOST_NET_IN_PKG.toFixed(2).replace(/[.]?0+$/, '') + '%' + ' ' + text.HOST_NET_OUT_PKG.toFixed(2).replace(/[.]?0+$/, '') + '%'
    }
  },
  {
    title: '磁盘I/O速率',
    dataIndex: 'disk'
    // customRender: (text, record, index) => {
    //   return text.HOST_NET_IN_PKG.toFixed(2).replace(/[.]?0+$/, '') + '%' + ' ' + text.HOST_NET_OUT_PKG.toFixed(2).replace(/[.]?0+$/, '') + '%'
    // }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return queryVmMonitor(requestParameters)
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleDetail (record) {

    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
