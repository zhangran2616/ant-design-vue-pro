<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="5" :sm="24">
              <a-form-item label="云平台">
                <a-select @click.native="handlePlatformList()" v-model="queryParam.cpfId" placeholder="请选择" default-value="">
                  <a-select-option v-for="(item, index) in platforms" :value="item.id" :key="index">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
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
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>
      </s-table>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { queryStore, queryPlatform } from '@/api/resource'

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
    title: '总容量',
    dataIndex: 'capacity',
    customRender: (text, record, index) => {
      if (text < 1099511627776) {
        return (text / 1024 / 1024 / 1024).toFixed(2) + 'GB'
      } else {
        return (text / 1024 / 1024 / 1024 / 1024).toFixed(2) + 'TB'
      }
    }
  },
  {
    title: '已用容量',
    customRender: (text, record, index) => {
      const used = record.capacity - record.freeSpace
      if (used < 1099511627776) {
        return (used / 1024 / 1024 / 1024).toFixed(2) + 'GB'
      } else {
        return (used / 1024 / 1024 / 1024 / 1024).toFixed(2) + 'TB'
      }
    }
  },
  {
    title: '可用容量',
    dataIndex: 'freeSpace',
    customRender: (text, record, index) => {
      if (text < 1099511627776) {
        return (text / 1024 / 1024 / 1024).toFixed(2) + 'GB'
      } else {
        return (text / 1024 / 1024 / 1024 / 1024).toFixed(2) + 'TB'
      }
    }
  },
  {
    title: '可用率',
    customRender: (text, record, index) => {
      return (record.freeSpace / record.capacity * 100).toFixed(2) + '%'
    }
  },
  {
    title: '关联主机',
    dataIndex: 'hostCount'
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
        console.log('loadData request parameters:', requestParameters)
        return queryStore(requestParameters)
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      platforms: []
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

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    handlePlatformList () {
      const requestParameters = { 'pageSize': -1 }
      queryPlatform(requestParameters)
      .then(res => {
       this.platforms = res.data.records
      })
    }
  }
}
</script>
