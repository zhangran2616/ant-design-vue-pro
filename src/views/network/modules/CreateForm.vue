<template>
  <a-modal
    :title=" model && model.id > 0? '编辑子网' : '新建子网' "
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    :platforms="platforms"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="云平台">
          <a-select :disabled=" model && model.id > 0 " @change="getDc" placeholder="请选择" v-decorator="['cpfId', {rules: [{required: true, message: '请选择云平台'}]}]">
            <a-select-option v-for="(item, index) in platforms" :value="item.id" :key="index">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="数据中心">
          <a-select :disabled=" model && model.id > 0 " @change="getNetworkLabel" placeholder="请选择" v-decorator="['datacenter', {rules: [{required: true, message: '请选择数据中心'}]}]">
            <a-select-option v-for="(item, index) in datacenters" :value="item.uuid" :key="index">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="网络标签">
          <a-select :disabled=" model && model.id > 0 " placeholder="请选择" v-decorator="['networkLabel', {rules: [{required: true, message: '请选择网络标签'}]}]">
            <a-select-option v-for="(item, index) in networkLabels" :value="item.uuid" :key="index">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-decorator="['name', {rules: [{required: true, min: 1, max: 200, message: '请输入名称长度1-200个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="IP范围">
          <a-input :disabled=" model && model.id > 0 " v-decorator="['ipPool', {rules: [{required: true, validator: ipPoolValidator}]}]" />
        </a-form-item>
        <a-form-item label="网关">
          <a-input v-decorator="['gateway', {rules: [{required: true ,validator: gatewayValidator}]}]" />
        </a-form-item>
        <a-form-item label="掩码">
          <a-input v-decorator="['mask', {rules: [{required: true, validator: maskValidator}]}]" />
        </a-form-item>
        <a-form-item label="DNS1">
          <a-input v-decorator="['dns1', {rules: [{required: true, validator: dnsValidator}]}]" />
        </a-form-item>
        <a-form-item label="DNS2">
          <a-input v-decorator="['dns2', {rules: [{required: false, min: 1,max: 20, message: '请输入DNS2长度1-20个字符！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { queryDc, queryNetworkLabel } from '@/api/resource'

// 表单字段
const fields = ['id', 'name', 'ipPool', 'gateway', 'mask', 'dns2', 'dns1', 'cpfId', 'datacenter', 'networkLabel']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    },
    platforms: {
      type: Array,
      default: () => []
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this),
      datacenters: [],
      networkLabels: [],
      ipPoolValidator: (rule, value, callback) => {
        const reg = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)-([0-9]{1,2}|1[0-9]{1,2}|2[0-4][0-9]|25[0-5])$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的IP地址段'))
        } else {
          callback()
        }
      },
      gatewayValidator: (rule, value, callback) => {
        const reg = /^192\.168(\.(\d|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))){2}$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的网关地址'))
        } else {
          callback()
        }
      },
      maskValidator: (rule, value, callback) => {
        const reg = /^((128|192)|2(24|4[08]|5[245]))(\.(0|(128|192)|2((24)|(4[08])|(5[245])))){3}$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的掩码地址'))
        } else {
          callback()
        }
      },
      dnsValidator: (rule, value, callback) => {
        const reg = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的DNS地址'))
        } else {
          callback()
        }
      }
    }
  },

  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  mounted () {
    this.getDc()
    this.getNetworkLabel()
  },
  methods: {
    getDc (cpfId) {
      this.networkLabels = []
      this.datacenters = []
      if (!cpfId) {
        return
      }
      this.form.setFieldsValue({
        datacenter: undefined,
        networkLabel: undefined
      })
      const requestParameters = { 'pageSize': -1, 'cpfId': cpfId }
      queryDc(requestParameters)
      .then(res => {
       this.datacenters = res.data.records
      })
    },
    getNetworkLabel (uuid) {
       if (!uuid) {
        return
      }
      this.form.setFieldsValue({
        networkLabel: undefined
      })
      const cpfId = this.form.getFieldValue('cpfId')
      const requestParameters = { 'pageSize': -1, 'cpfId': cpfId, 'uuid': uuid }
      queryNetworkLabel(requestParameters)
      .then(res => {
       this.networkLabels = res.data.records
      })
    }
  }
}
</script>
