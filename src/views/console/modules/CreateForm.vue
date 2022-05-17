<template>
  <a-modal
    title="新建虚拟机"
    :width="1140"
    :visible="visible"
    :confirmLoading="loading"
    :maskClosable="maskClosable"
    :cpfList="cpfList"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="云平台">
          <a-select
            v-decorator="[
              'cpfId',
              { rules: [{ required: true, message: '云平台不能为空' }] },
            ]"
            placeholder="请选择云平台"
            @change="getDc"
          >
            <a-select-option :value="item.id" v-for="(item, index) in cpfList" :key="index">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!-- 基本信息 -->
        <div>
          <div class="title">
            <p class="title-text">基本信息</p>
          </div>
          <a-form-item label="实例名称">
            <a-input v-decorator="['vmName', {rules: [{required: true, min: 1, max: 1000, message: '请输入实例名称长度1-1000个字符！'}]}]" />
          </a-form-item>
          <a-form-item label="CPU">
            <a-input addon-after=" 核 " v-decorator="['cpu', {rules: [{required: true, validator: numberValidator}]}]" />
          </a-form-item>
          <a-form-item label="内存">
            <a-input addon-after="GB" v-decorator="['memory', {rules: [{required: true, validator: numberValidator}]}]" />
          </a-form-item>
        </div>
        <!-- 选择模板 -->
        <div>
          <div class="title">
            <p class="title-text">选择模板</p>
          </div>
          <a-form-item label="数据中心">
            <a-select
              v-decorator="[
                'datacenterId',
                { rules: [{ required: true, message: '数据中心不能为空' }] },
              ]"
              placeholder="请选择数据中心"
              @change="getTemplate"
            >
              <a-select-option :value="item.uuid" v-for="(item, index) in datacenterList" :key="index">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="模板">
            <a-select
              v-decorator="[
                'template',
                { rules: [{ required: true, message: '模板不能为空' }] },
              ]"
              placeholder="请选择模板"
            >
              <a-select-option :value="item.id" v-for="(item, index) in templateList" :key="index">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <!-- 云硬盘 -->
        <div>
          <div class="title">
            <p class="title-text">云硬盘</p>
          </div>
          <a-form-item label="系统盘">
            <a-input v-model="systemDisk" disabled addon-after="GB" />
          </a-form-item>
          <a-form-item
            v-for="(k, index) in form.getFieldValue('keys')"
            :key="k"
            v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
            :label="index === 0 ? '数据盘' : ''"
            :required="false"
          >
            <a-input
              v-decorator="[
                `disks[${k}]`,
                {
                  validateTrigger: ['change', 'blur'],
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '数据盘不能为空',
                    },
                  ],
                },
              ]"
              placeholder="请输入数据盘大小"
              style="width: 88%; margin-right: 8px"
            />
            <a-icon
              class="dynamic-delete-button"
              type="minus-circle-o"
              @click="() => removeDisk(k)"
            />
          </a-form-item>
          <a-form-item v-bind="formItemLayoutWithOutLabel">
            <a-button type="dashed" style="width: 60%" @click="addDisk">
              <a-icon type="plus-circle" /> 添加数据盘
            </a-button>
          </a-form-item>
        </div>
        <!-- 安装位置 -->
        <div>
          <div class="title">
            <p class="title-text">安装位置</p>
          </div>
          <a-form-item label="集群">
            <a-select
              v-decorator="[
                'clusterId',
                { rules: [{ required: false, message: '集群不能为空' }] },
              ]"
              placeholder="请选择集群"
            >
              <a-select-option :value="item.id" v-for="(item, index) in clusterList" :key="index">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="宿主机">
            <a-select
              v-decorator="[
                'host',
                { rules: [{ required: true, message: '宿主机不能为空' }] },
              ]"
              placeholder="请选择宿主机"
            >
              <a-select-option :value="item.id" v-for="(item, index) in hostList" :key="index">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="存储">
            <a-select
              v-decorator="[
                'storage',
                { rules: [{ required: true, message: '存储不能为空' }] },
              ]"
              placeholder="请选择存储"
            >
              <a-select-option :value="item.id" v-for="(item, index) in storageList" :key="index">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="制备模式">
            <a-select
              v-decorator="[
                'storageType',
                { rules: [{ required: false, message: '制备模式不能为空' }] },
              ]"
              placeholder="请选择制备模式"
            >
              <a-select-option :value="item.id" v-for="(item, index) in storageTypeList" :key="index">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <!-- 网络设置 -->
        <div>
          <div class="title">
            <p class="title-text">网络设置</p>
          </div>
          <a-form-item
            v-for="(k, index) in form.getFieldValue('networksKeys')"
            :key="k"
            v-bind="formItemLayout"
            :label="'网卡' + (index + 1)"
            class="networks"
            :required="false"
          >
            <a-form-item
              :label-col="{ span: 0 }"
              :wrapper-col="{ span: 24 }"
              class="networks-item"
              :required="false"
            >
              <a-select
                v-decorator="[
                  `networks[${index}]`,
                  { rules: [{ required: true, message: '子网不能为空' }] },
                ]"
                placeholder="请选择子网"
                style="margin-right: 8px"
                @change="getIp"
              >
                <a-select-option :value="item.id" v-for="(item, v) in networkList" :key="v">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              :label-col="{ span: 0 }"
              :wrapper-col="{ span: 24 }"
              class="networks-item"
              :required="false"
            >
              <a-select
                v-decorator="[
                  `ips[${index}]`,
                  { rules: [{ required: true, message: 'ip不能为空' }] },
                ]"
                placeholder="请选择子网"
                style="margin-right: 8px"
              >
                <a-select-option :value="item.id" v-for="(item, j) in ipList" :key="j">
                  {{ item.ip }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-icon
              class="dynamic-delete-button"
              type="minus-circle-o"
              @click="() => removeNetworks(k)"
            />
          </a-form-item>
          <a-form-item v-bind="formItemLayoutWithOutLabel">
            <a-button type="dashed" style="width: 60%" @click="addNetworks">
              <a-icon type="plus-circle" /> 添加网卡
            </a-button>
          </a-form-item>
        </div>
        <!-- 其他设置 -->
        <div>
          <div class="title">
            <p class="title-text">其他设置</p>
          </div>
          <a-form-item label="放置文件夹">
            <a-select
              v-decorator="[
                'fs',
                { rules: [{ required: false, message: '放置文件夹不能为空' }] },
              ]"
              placeholder="请选择放置文件夹"
            >
              <a-select-option :value="item.id" v-for="(item, index) in folderList" :key="index">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="实例备注">
            <!-- a-textarea -->
            <a-textarea v-decorator="['remarks', {rules: [{required: false, message: '实例备注不能为空'}]}]" />
          </a-form-item>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { queryDc, queryHost, queryTemplate, queryCluster, queryStore, querySubnet, queryIp } from '@/api/resource'

// 表单字段
const fields = ['cpfId', 'vmName', 'cpu', 'memory']
let id = 0
let ip = 0
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
    cpfList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 23 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    }
    return {
      numberValidator: (rule, value, callback) => {
        const reg = /^[0-9]+[0-9]*]*$/
        if (value) {
          if (value !== '0') {
            if (!reg.test(value)) {
              callback(new Error('请输入正整数'))
            } else {
              callback()
            }
          } else {
            callback(new Error('请输入正整数'))
          }
        } else {
          callback(new Error('请输入正确的规格'))
        }
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 23 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 16, offset: 5 }
        }
      },
      // form: this.$form.createForm(this),
      maskClosable: false,
      datacenterList: [],
      templateList: [],
      systemDisk: 50,
      clusterList: [],
      hostList: [],
      storageList: [],
      storageTypeList: [],
      networkList: [],
      ipList: [],
      folderList: []
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'dynamic_form_item' })
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
    this.form.getFieldDecorator('networksKeys', { initialValue: [], preserve: true })
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
      console.log(this.model)
    })
  },
  mounted () {
  },
  methods: {
    // 删除数据盘
     removeDisk (k) {
      const { form } = this
      const keys = form.getFieldValue('keys')
      console.log(keys)
      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      })
    },
    // 添加数据盘
    addDisk () {
      const { form } = this
      const keys = form.getFieldValue('keys')
      console.log(keys)
      const nextKeys = keys.concat(id++)
      form.setFieldsValue({
        keys: nextKeys
      })
    },
    // 删除网卡
    removeNetworks (k) {
      const { form } = this
      const networksKeys = form.getFieldValue('networksKeys')
      console.log(networksKeys)
      form.setFieldsValue({
        networksKeys: networksKeys.filter(key => key !== k)
      })
    },
    // 添加网卡
    addNetworks () {
      const { form } = this
      const networksKeys = form.getFieldValue('networksKeys')
      const nextKeys = networksKeys.concat(ip++)
      form.setFieldsValue({
        networksKeys: nextKeys
      })
    },
    getDc (cpfId) {
      const requestParameters = { 'pageSize': -1, 'cpfId': cpfId }
      queryDc(requestParameters)
      .then(res => {
       this.datacenterList = res.data.records
      })
    },
    getCluster (dcuuid) {
      const cpfId = this.form.getFieldValue('cpfId')
      const requestParameters = { 'pageSize': -1, 'cpfId': cpfId, 'uuid': dcuuid }
      queryCluster(requestParameters)
      .then(res => {
       this.clusterList = res.data.records
      })
    },
    getTemplate (dcuuid) {
      const cpfId = this.form.getFieldValue('cpfId')
      const requestParameters = { 'pageSize': -1, 'cpfId': cpfId, 'uuid': dcuuid }
      queryTemplate(requestParameters)
      .then(res => {
       this.templateList = res.data.records
      })
      this.getCluster(dcuuid)
      this.getHost(dcuuid)
      this.getStore(dcuuid)
      this.getSubnet(dcuuid)
    },
    getHost (dcuuid) {
      const cpfId = this.form.getFieldValue('cpfId')
      const requestParameters = { 'pageSize': -1, 'cpfId': cpfId, 'uuid': dcuuid }
      queryHost(requestParameters)
      .then(res => {
       this.hostList = res.data.records
      })
    },
    getStore (dcuuid) {
      const cpfId = this.form.getFieldValue('cpfId')
      const requestParameters = { 'pageSize': -1, 'cpfId': cpfId, 'uuid': dcuuid }
      queryStore(requestParameters)
      .then(res => {
       this.storageList = res.data.records
      })
    },
    getSubnet (dcuuid) {
      const cpfId = this.form.getFieldValue('cpfId')
      const requestParameters = { 'pageSize': -1, 'cpfId': cpfId, 'uuid': dcuuid }
      querySubnet(requestParameters)
      .then(res => {
       this.networkList = res.data.records
      })
    },
    getIp (subnetId) {
      const requestParameters = { 'pageSize': -1, 'subnetId': subnetId }
      queryIp(requestParameters)
      .then(res => {
       this.ipList = res.data.records
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-modal-body{
  padding-left: 0;
  padding-right: 0;
}
.title{
  border-bottom: 1px solid #e8e8e8;
  padding-left: 24px;
  padding-right: 24px;
  margin-bottom: 24px;
}
.title-text{
  height: auto;
  line-height: 14px;
  font-size: 16px;
  position: relative;
  padding-left: 10px;
  font-weight: 600;
  color: #3A444F;
  &::before{
    content: '';
    display: inline-block;
    height: 14px;
    width: 2px;
    background: #288CFF;
    position: absolute;
    left: 0;
  }
}
/deep/.ant-btn-dashed{
    color: #288cfe;
    background-color: #fff;
    border-color: #288cfe;
}
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 0px;
  font-size: 14px;
  color: #288cfe;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #288cfe;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
.networks{
  margin-bottom: 0px;
}
.networks-item{
  display: inline-block;
  width: 43%;
  margin-right: 10px;
}
</style>
