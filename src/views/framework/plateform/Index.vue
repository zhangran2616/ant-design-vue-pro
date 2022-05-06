<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button v-action:plateformAdd type="primary" icon="plus" @click="handleAdd">新建</a-button>
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

        <span slot="action" slot-scope="text, record">
          <template>
            <a v-action:plateformUpdate @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a v-action:plateformSync @click="handlePermission(record)">同步</a>
            <a-divider type="vertical" />
            <a v-action:plateformDelete @click="handleDel(record)">删除</a>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { queryPlatform, addPlatform, updatePlatform, deletePlatform } from '@/api/resource'
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
    title: '类型',
    dataIndex: 'type'
  },
  {
    title: 'IP',
    dataIndex: 'ip'
  },
  {
    title: '连接状态',
    dataIndex: 'connect'
  },
  {
    title: '云实例',
    dataIndex: 'vmCount'
  },
  {
    title: '模板',
    dataIndex: 'templateCount'
  },
  {
    title: '同步时间',
    dataIndex: 'createTime'
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
      mdlPermission: null,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return queryPlatform(requestParameters)
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
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
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
            updatePlatform(values).then(res => {
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
            addPlatform(values).then(res => {
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
          deletePlatform(params).then(res => {
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
    handlePermissionCancel () {
      this.visiblePermission = false
    }
  }
}
</script>
