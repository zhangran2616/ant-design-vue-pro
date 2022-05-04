<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button v-action:roleAdd type="primary" icon="plus" @click="handleAdd">新建</a-button>
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
            <a v-action:roleUpdate @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a v-action:roleAuthorization @click="handlePermission(record)">权限</a>
            <a-divider type="vertical" />
            <!--<a @click="handleDel(record)">删除</a> -->
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

      <permission-form
        ref="permissionModal"
        :visible="visiblePermission"
        :loading="confirmPermissionLoading"
        :model="mdlPermission"
        @cancel="handlePermissionCancel"
        @ok="handlePermissionOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getRoleList, addRole, updateRole, deleteRole, roleAuthorization } from '@/api/manage'
import CreateForm from './modules/CreateForm'
import PermissionForm from './modules/PermissionForm'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '角色名',
    dataIndex: 'name'
  },
  {
    title: '描述',
    dataIndex: 'description'
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime'
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
    CreateForm,
    PermissionForm
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      visiblePermission: false,
      confirmPermissionLoading: false,
      mdl: null,
      mdlPermission: null,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getRoleList(requestParameters)
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
    handlePermission (record) {
      this.visiblePermission = true
      this.mdlPermission = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            updateRole(values)
            .then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            addRole(values)
            .then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
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
      const params = {
        id: record.id
      }
      deleteRole(params)
      .then(res => {
        // 刷新表格
        this.$refs.table.refresh()

        this.$message.info('删除成功')
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handlePermissionCancel () {
      this.visiblePermission = false
    },
    handlePermissionOk (data, roleId) {
      // console.log(data, roleId)
      this.confirmPermissionLoading = true
      const permissionIds = []
      this.getAllNodeIds(permissionIds, data)
      console.log('permissionIds:', permissionIds)
      const parameters = {
        roleId: roleId,
        permissionIds: permissionIds
      }
      roleAuthorization(parameters)
      .then(res => {
        this.visiblePermission = false
        this.confirmPermissionLoading = false
        this.$refs.table.refresh()
        this.$message.info('角色赋权成功')
      })
    },
    getAllNodeIds (ids, dataList) {
      if (dataList && dataList.length > 0) {
        dataList.forEach(element => {
          // console.log(element.name)
          if (element.hasPermission) {
            ids.push(element.id)
          }
          if (element.children && element.children.length > 0) {
            this.getAllNodeIds(ids, element.children)
          }
        })
      }
    }
  }
}
</script>
