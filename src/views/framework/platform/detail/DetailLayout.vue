<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="24">
        <a-card
          style="width:100%"
          :bordered="false"
          :tabList="tabListNoTitle"
          :activeTabKey="noTitleKey"
          @tabChange="key => handleTabChange(key, 'noTitleKey')"
        >
          <base-page v-if="noTitleKey === 'base'"></base-page>
          <cluster-page v-else-if="noTitleKey === 'cluster'"></cluster-page>
          <host-page v-else-if="noTitleKey === 'host'"></host-page>
          <networkLabel-page v-else-if="noTitleKey === 'networkLabel'"></networkLabel-page>
          <store-page v-else-if="noTitleKey === 'store'"></store-page>
          <tpl-page v-else-if="noTitleKey === 'template'"></tpl-page>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { PageView, RouteView } from '@/layouts'
import { BasePage, ClusterPage, HostPage, NetworkLabelPage, StorePage, TplPage } from './'

export default {
  components: {
    RouteView,
    PageView,
    BasePage,
    ClusterPage,
    HostPage,
    NetworkLabelPage,
    StorePage,
    TplPage
  },
  data () {
    return {

      tabListNoTitle: [
        {
          key: 'base',
          tab: '基本'
        },
        {
          key: 'cluster',
          tab: '集群'
        },
        {
          key: 'host',
          tab: '计算节点'
        },
        {
          key: 'store',
          tab: '存储'
        },
        {
          key: 'networkLabel',
          tab: '网络端口组'
        },
        {
          key: 'template',
          tab: '模板'
        }
      ],
      noTitleKey: 'base'
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    handleTabChange (key, type) {
      this[type] = key
    }
  }
}
</script>
