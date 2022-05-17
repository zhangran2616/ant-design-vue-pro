<template>
  <div class="table">
    <a-table :columns="columns" :pagination="false" :data-source="tableData">
      <span slot="state" slot-scope="state">
        <a-tag
          :color="state === '正常' ? '#27c787' : '#fd7b79'"
        >
          {{ state }}
        </a-tag>
      </span>
    </a-table>
  </div>
</template>

<script>
  import { queryPlatform } from '@/api/resource'
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
            title: '类型',
            dataIndex: 'type'
          },
          {
            title: 'IP',
            dataIndex: 'ip'
          },
          {
            title: '云实例',
            dataIndex: 'vmCount'
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
        queryPlatform().then(res => {
          console.log(res.data)
          const arr = res.data.records
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
