<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="7" :sm="24">
              <a-form-item
                label="操作时间段"
                :labelCol="{lg: {span: 7}, sm: {span: 7}}"
                :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
                <a-range-picker
                  name="buildTime"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item label="操作类型">
                <a-select v-model="queryParam.type" placeholder="请选择" default-value="">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="新增">新增</a-select-option>
                  <a-select-option value="修改">修改</a-select-option>
                  <a-select-option value="删除">删除</a-select-option>
                  <a-select-option value="同步">同步</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="操作者">
                <a-input v-model="queryParam.username" placeholder="用户名"/>
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
          <a-tag :color=" text === 'success' ? 'green' : 'volcano' ">{{ text === 'success' ? '成功':'失败' }}</a-tag>
        </span>
      </s-table>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { queryLog } from '@/api/manage'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '操作者',
    dataIndex: 'operator'
  },
  {
    title: '操作类型',
    dataIndex: 'type'
  },
  {
    title: '操作资源',
    dataIndex: 'resource'
  },
  {
    title: '操作内容',
    dataIndex: 'content'
  },
  {
    title: '操作结果',
    dataIndex: 'result',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作者IP',
    dataIndex: 'ip'
  },
  {
    title: '操作时间',
    dataIndex: 'createTime'
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
        return queryLog(requestParameters)
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
