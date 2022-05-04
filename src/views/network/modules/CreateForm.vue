<template>
  <a-modal
    title="新建子网"
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
          <a-select placeholder="请选择" v-decorator="['cpfId', {rules: [{required: true, message: '请选择云平台'}]}]">
            <a-select-option v-for="(item, index) in platforms" :value="item.id" :key="index">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="数据中心">
          <a-select placeholder="请选择" v-decorator="['datacenter', {rules: [{required: true, message: '请选择数据中心'}]}]">
            <a-select-option v-for="(item, index) in datacenters" :value="item.id" :key="index">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="网络端口组">
          <a-select placeholder="请选择" v-decorator="['networkLabel', {rules: [{required: true, message: '请选择网络标签'}]}]">
            <a-select-option v-for="(item, index) in networkLabels" :value="item.id" :key="index">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-decorator="['name', {rules: [{required: true, min: 1, max: 200, message: '请输入名称长度1-200个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="IP范围">
          <a-input v-decorator="['ip_pool', {rules: [{required: true, min: 1,max: 200, message: '请输入IP范围长度1-200个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="网关">
          <a-input v-decorator="['getway', {rules: [{required: true, min: 1,max: 20, message: '请输入网关长度1-20个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="掩码">
          <a-input v-decorator="['mask', {rules: [{required: true, min: 1, max: 20, message: '请输入掩码长度1-20个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="DNS1">
          <a-input v-decorator="['dns1', {rules: [{required: true, min: 1,max: 20, message: '请输入DNS1长度1-20个字符！'}]}]" />
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

// 表单字段
const fields = ['name', 'id', 'name', 'ip_pool', 'getway', 'mask', 'dns2', 'dns1', 'cpfId', 'datacenter', 'networkLabel']

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
      networkLabels: []
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
  }
}
</script>
