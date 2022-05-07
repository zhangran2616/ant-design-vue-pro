<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="关键字">
                <a-input v-model="queryParam.keyword" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button v-action:subnetAdd type="primary" icon="plus" @click="handleAdd">新建</a-button>
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
          <a-tag :color=" text === 0 ? 'green' : 'volcano' ">{{ text === 0 ? '启用':'禁用' }}</a-tag>
        </span>
        <template slot="changeStatus" slot-scope="status, record">
          <a-switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            :checked="!Boolean(status)"
            @change="changeSubnetStatus(record)"
          />
        </template>
        <span slot="action" slot-scope="text, record">
          <template>
            <a v-action:subnetUpdate @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a v-action:subnetDelete @click="handleDel(record)">删除</a>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        :platforms="platforms"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { querySubnet, addSubnet, updateSubnet, deleteSubnet, queryPlatform } from '@/api/resource'
import CreateForm from './modules/CreateForm'
import { Modal } from 'ant-design-vue'

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
    title: 'IP地址池',
    dataIndex: 'ipPool'
  },
  {
    title: '状态',
    dataIndex: 'status',
    // scopedSlots: { customRender: 'status' }
    scopedSlots: { customRender: 'changeStatus' }
  },
  {
    title: '掩码',
    dataIndex: 'mask'
  },
  {
    title: '网关',
    dataIndex: 'gateway'
  },
  {
    title: 'DNS',
    customRender: (h, scope) => {
      let d1 = ''
      let d2 = ''
      if (h.dns1) {
        d1 = h.dns1
      }
      if (h.dns2) {
        d2 = h.dns2
      }
      return d1 + ' ' + d2
    }
  },
  {
    title: '可用IP',
    dataIndex: 'ipCount'
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
    Ellipsis,
    CreateForm
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return querySubnet(requestParameters)
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
    handleAdd () {
      this.handlePlatformList()
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.handlePlatformList()
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          if (values.id > 0) {
            // 修改 e.g.
            updateSubnet(values).then(res => {
              if (res.code !== 0) {
                this.$message.error(res.message)
              } else {
                this.$message.success('修改成功')
              }
            }).finally(() => {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()
            })
          } else {
            // 新增
            addSubnet(values).then(res => {
              if (res.code !== 0) {
                this.$message.error(res.message)
              } else {
                this.$message.success('新增成功')
              }
            }).finally(() => {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleDel (record) {
      Modal.confirm({
        title: this.$t('layouts.delete.dialog.title'),
        content: this.$t('layouts.delete.dialog.content'),
        onOk: () => {
          const params = {
            id: record.id
          }
          deleteSubnet(params).then(res => {
            if (res.code !== 0) {
                this.$message.error(res.message)
            } else {
              this.$message.success('删除成功')
            }
          }).finally(() => {
            // 刷新表格
            this.$refs.table.refresh()
          })
        },
        onCancel () {}
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
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
    },
    changeSubnetStatus (record) {
      record.status = record.status === 0 ? 1 : 0
      updateSubnet(record).then(res => {
        if (res.code === 0) {
          this.$message.success('修改成功')
        }
      })
    }
  }
}
</script>
