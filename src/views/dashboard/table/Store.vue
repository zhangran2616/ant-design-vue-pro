<template>
  <div>
    <a-table :columns="columns" :pagination="false" :data-source="tableData">
    </a-table>
  </div>
</template>

<script>
import { queryStore } from '@/api/resource'
  export default {
    data () {
      return {
        tableData: [],
        columns: [
          {
            title: '名称',
            dataIndex: 'name'
          },
          {
            title: '总容量',
            dataIndex: 'capacity',
            customRender: (text, record, index) => {
              if (text < 1099511627776) {
                return (text / 1024 / 1024 / 1024).toFixed(2).replace(/[.]?0+$/, '') + 'GB'
              } else {
                return (text / 1024 / 1024 / 1024 / 1024).toFixed(2).replace(/[.]?0+$/, '') + 'TB'
              }
            }
          },
          {
            title: '已用容量',
            customRender: (text, record, index) => {
              const used = record.capacity - record.freeSpace
              if (used < 1099511627776) {
                return (used / 1024 / 1024 / 1024).toFixed(2).replace(/[.]?0+$/, '') + 'GB'
              } else {
                return (used / 1024 / 1024 / 1024 / 1024).toFixed(2).replace(/[.]?0+$/, '') + 'TB'
              }
            }
          },
          {
            title: '可用容量',
            dataIndex: 'freeSpace',
            customRender: (text, record, index) => {
              if (text < 1099511627776) {
                return (text / 1024 / 1024 / 1024).toFixed(2).replace(/[.]?0+$/, '') + 'GB'
              } else {
                return (text / 1024 / 1024 / 1024 / 1024).toFixed(2).replace(/[.]?0+$/, '') + 'TB'
              }
            }
          }
        ]
      }
    },
    created () {
      this.getTableData()
    },
    methods: {
      // 获取表格数据
      getTableData () {
        queryStore().then(res => {
          const arr = res.data.records.sort(function (a, b) {
            return b.freeSpace - a.freeSpace
          })
          this.tableData = arr.slice(0, 4)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.table{
  height: 270px;
}
/deep/.ant-table{
  .ant-table-thead{
    background: #eff2f7;
  }
  .ant-table-thead > tr > th{
    border: none;
    border-right: 1px solid #fff;
  }
  .ant-table-tbody {
    tr:nth-child(2n) {
      background: #f9fafe;
    }
  }
  .ant-table-tbody > tr > td {
    border: none;
  }
}
</style>
