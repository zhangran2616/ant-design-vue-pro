<template>
  <a-modal
    title="新建用户"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    :roles="roles"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="角色">
          <a-select placeholder="请选择" v-decorator="['roleId', {rules: [{required: true, message: '请选择角色!'}]}]">
            <a-select-option v-for="(item, index) in roles" :value="item.id" :key="index">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-decorator="['name', {rules: [{required: true, min: 1, max: 10, message: '请输入姓名长度1-10个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-decorator="['username', {rules: [{required: true, min: 1,max: 30, message: '请输入用户名长度1-30个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input v-decorator="['password', {rules: [{required: true, min: 1,max: 60, message: '请输入密码长度1-60个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="Email">
          <a-input v-decorator="['email', {rules: [{required: true, min: 1, max: 60, message: '请输入Email长度1-60个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="手机">
          <a-input v-decorator="['phone', {rules: [{required: true, min: 1,max: 20, message: '请输入手机长度1-20个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="电话">
          <a-input v-decorator="['tel', {rules: [{required: true, min: 1,max: 15, message: '请输入电话长度1-15个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="员工编号">
          <a-input v-decorator="['staffNumber', {rules: [{required: true, min: 1, max: 32, message: '请输入姓名长度1-32个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-decorator="['description', {rules: [{required: true, min: 1, max: 200, message: '请输入描述长度1-200个字符！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'name', 'username', 'password', 'email', 'phone', 'tel', 'staffNumber', 'description', 'roleId']

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
    roles: {
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
      form: this.$form.createForm(this)
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
