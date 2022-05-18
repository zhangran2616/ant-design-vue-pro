<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="实例名称">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="3" :sm="24">
              <a-form-item label="IP">
                <a-input v-model="queryParam.ipv4" style="width: 100%"/>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item label="实例状态">
                <a-select v-model="queryParam.instanceStatus" placeholder="请选择">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">开机</a-select-option>
                  <a-select-option value="2">关机</a-select-option>
                  <a-select-option value="3">挂起</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item label="云平台">
                <a-select v-model="queryParam.cpfId" placeholder="请选择">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">开机</a-select-option>
                  <a-select-option value="2">关机</a-select-option>
                  <a-select-option value="3">挂起</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="6" :sm="24">
                <a-form-item
                  label="创建时间"
                  :labelCol="{lg: {span: 7}, sm: {span: 7}}"
                  :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
                  <a-range-picker
                    name="buildTime"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 6 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="createVm">创建</a-button>
        <a-button type="text" :disabled="disabledpoweron" icon="login" @click="powerOnVm">开机</a-button>
        <a-button type="text" :disabled="disabledshutdown" icon="poweroff" @click="shutdownVm">关机</a-button>
        <a-button type="text" :disabled="disabledreboot" icon="reload" @click="rebootVm">重启</a-button>
        <a-dropdown>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item :disabled="disabledpoweroff" key="powderOff">
              强制关机
            </a-menu-item>
            <a-menu-item :disabled="disabledsuspend" key="suspend">
              挂起
            </a-menu-item>
            <a-menu-item :disabled="disabledpoweron" key="powerOn">
              恢复
            </a-menu-item>
            <a-menu-item key="destroy">
              销毁
            </a-menu-item>
          </a-menu>
          <a-button> 更多操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
      </div>

      <s-table
        ref="table"
        size="default"
        :rowKey="item=>item.id"
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
          <a-tag v-if="text === 0" color="blue"><a-icon type="sync" spin /></a-tag>
          <a-tag v-else-if="text === 1" color="green">开机</a-tag>
          <a-tag v-else-if="text === 2" color="volcano">关机</a-tag>
          <a-tag v-else-if="text === 3" color="yellow">挂起</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a-tooltip placement="topLeft" title="打开远程控制台" :mouseEnterDelay="mouseEnterDelay">
              <div class="icons-list">
                <span><a-icon type="desktop" style="font-size: 20px;" @click="handleEdit(record)"/></span>
              </div>
            </a-tooltip>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        :cpfList="cpfList"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { queryVm, powerOn, shutdown, reboot, powerOff, suspend, destroy, queryPlatform, createVm } from '@/api/resource'
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
    title: 'IP地址',
    dataIndex: 'ipv4'
  },
  {
    title: '状态',
    dataIndex: 'instanceStatus',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '规格',
    customRender: (text, record, index) => {
      return record.cpu + 'C' + ' ' + (record.memory / 1024).toFixed(2).replace(/[.]?0+$/, '') + 'GB'
    }
  },
  {
    title: '操作系统',
    dataIndex: 'osName'
  },
  {
    title: '计算节点',
    dataIndex: 'hostMachine'
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
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return queryVm(requestParameters)
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      mouseEnterDelay: 0.4,
      disabledpoweron: false,
      disabledshutdown: false,
      disabledreboot: false,
      disabledpoweroff: false,
      disabledsuspend: false,
      cpfList: []
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
    handlePlatformList () {
      const requestParameters = { 'pageSize': -1 }
      queryPlatform(requestParameters)
      .then(res => {
       this.cpfList = res.data.records
      })
    },
    createVm () {
      this.handlePlatformList()
      this.mdl = null
      this.visible = true
    },

    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
            createVm(values).then(res => {
              if (res.code !== 0) {
                this.$message.error(res.message)
              } else {
                this.$message.success('开始安装虚拟机，请稍后查看列表')
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
          queryVm(params).then(res => {
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
      this.disabledpoweron = false
      this.disabledshutdown = false
      this.disabledreboot = false
      this.disabledpoweroff = false
      this.disabledsuspend = false
      selectedRows.forEach(element => {
        if (element.instanceStatus === 0) {
          this.disabledpoweron = true
          this.disabledshutdown = true
          this.disabledreboot = true
          this.disabledpoweroff = true
        } else if (element.instanceStatus === 1) {
          this.disabledpoweron = true
        } else if (element.instanceStatus === 2) {
          this.disabledshutdown = true
          this.disabledreboot = true
          this.disabledpoweroff = true
          this.disabledsuspend = true
        } else {
          this.disabledshutdown = true
          this.disabledreboot = true
          this.disabledsuspend = true
        }
      })
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    powerOnVm () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warn('请勾选操作的数据')
        return
      }
      const params = {
        ids: this.selectedRowKeys
      }
      powerOn(params).then(res => {
        if (res.code !== 0) {
            this.$message.error(res.message)
        } else {
          this.$message.success('启动开机操作,大约需要30秒左右')
        }
      }).finally(() => {
        // 刷新表格
        this.$refs.table.refresh()
      })
    },
    shutdownVm () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warn('请勾选操作的数据')
        return
      }
     const params = {
        ids: this.selectedRowKeys
      }
      shutdown(params).then(res => {
        if (res.code !== 0) {
            this.$message.error(res.message)
        } else {
          this.$message.success('启动关机操作,大约需要30秒左右')
        }
      }).finally(() => {
        // 刷新表格
        this.$refs.table.refresh()
      })
    },
    rebootVm () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warn('请勾选操作的数据')
        return
      }
     const params = {
        ids: this.selectedRowKeys
      }
      reboot(params).then(res => {
        if (res.code !== 0) {
            this.$message.error(res.message)
        } else {
          this.$message.success('启动重启操作,大约需要60秒左右')
        }
      }).finally(() => {
        // 刷新表格
        this.$refs.table.refresh()
      })
    },
    powerOffVm () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warn('请勾选操作的数据')
        return
      }
     const params = {
        ids: this.selectedRowKeys
      }
      powerOff(params).then(res => {
        if (res.code !== 0) {
            this.$message.error(res.message)
        } else {
          this.$message.success('启动强制关机操作,大约需要30秒左右')
        }
      }).finally(() => {
        // 刷新表格
        this.$refs.table.refresh()
      })
    },
    suspendVm () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warn('请勾选操作的数据')
        return
      }
     const params = {
        ids: this.selectedRowKeys
      }
      suspend(params).then(res => {
        if (res.code !== 0) {
            this.$message.error(res.message)
        } else {
          this.$message.success('启动挂起操作,大约需要30秒左右')
        }
      }).finally(() => {
        // 刷新表格
        this.$refs.table.refresh()
      })
    },
    destroyVm () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warn('请勾选操作的数据')
        return
      }
     const params = {
        ids: this.selectedRowKeys
      }
      destroy(params).then(res => {
        if (res.code !== 0) {
            this.$message.error(res.message)
        } else {
          this.$message.success('启动销毁操作,大约需要30秒左右')
        }
      }).finally(() => {
        // 刷新表格
        this.$refs.table.refresh()
      })
    },
    handleMenuClick (key) {
      console.log('click', key)
    }
  }
}
</script>
