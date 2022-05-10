<template>
  <h1>仪表盘</h1>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getRoleList } from '@/api/manage'

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  data () {
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

  },
  methods: {
    handlePermissionCancel () {
      this.visiblePermission = false
    }
  }
}
</script>
