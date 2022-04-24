<template>
  <a-modal
    title="权限分配"
    :width="1100"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok', list, mode.id) }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading" class="content">
      <a-row class="m-b-20" :gutter="65" v-for="(item, v) in list" :key="v">
        <a-col :span="4" class="t-r tel b">
          <div
            class="btn-con t-c f14"
            :class="item.hasPermission ? 'active' : ''"
            @click="setRole(item, v)"
          >{{ item.description }}</div>
        </a-col>
        <a-col :span="20">
          <a-row class="m-b-20" :gutter="65" v-for="(value, index) in item.children" :key="index">
            <a-col :span="6" class="t-r tel b">
              <div
                :class="value.hasPermission ? 'active btn-con' : 'btn-con'"
                @click="setFunction(item, v, value, index)"
              >{{ value.description }}</div>
            </a-col>
            <a-col :span="18" class="t-r tel b">
              <ul>
                <li
                  :class="val.hasPermission ? 'active btn-con' : 'btn-con'"
                  @click="threeSetFunction(item, v, value, index, val, i)"
                  v-for="(val, i) in value.children"
                  :key="i"
                >{{ val.description }}</li>
              </ul>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>

import { getRolePermission } from '@/api/manage'

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
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      list: [],
      editList: []
    }
  },
  created () {
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.editInfo(this.model.id)
    })
  },
  methods: {
    // 获取用户权限
    editInfo (id) {
      // this.loading = true
      const params = {
        roleId: id
      }
      getRolePermission(params)
        .then(res => {
          if (res.code === 0) {
            this.list = res.data
          }
        })
    },
    backfill (arr) {
      arr.forEach((item, index) => {
        if (item.hasPermission) {
          this.$set(this.list[index], 'hasPermission', true)
        }
        item.children.length &&
          item.children.forEach((val, v) => {
            if (val.hasPermission) {
              this.$set(this.list[index].children[v], 'hasPermission', true)
            }
          })
      })
    },
    // 页面点击
    setRole (item, key) {
      const obj = this.list[key]
      if (obj.hasPermission) {
        this.$set(obj, 'hasPermission', false)
        // 清空子集选中状态
        obj.children.length &&
          obj.children.forEach(ele => {
            ele.hasPermission = false
            ele.children.length &&
            ele.children.forEach(val => {
              val.hasPermission = false
            })
          })

        // 判断当前点击得元素得兄弟节点 是否还有选中 - 没有得话去掉父级得选中状态
        const objs = this.list.find(x => {
          return x.id === obj.parentId
        })
        if (objs) {
          let stu = false
          for (let index = 0; index < objs.children.length; index++) {
            const element = objs.children[index]
            console.log(element, 1)
            if (element.hasPermission) {
              stu = true
              break
            }
          }
          if (!stu) {
            objs.hasPermission = false
          }
        }
      } else {
        this.$set(obj, 'hasPermission', true)
      }
    },

    // 子点击
    setFunction (item, key, value, index, val, ind) {
      // 参考上面方法
      // val 当前点击对象
      // ind 当前点击对象下标
      const parentObj = this.list[key]
      const obj = this.list[key].children[index]

      if (obj.hasPermission) {
        this.$set(obj, 'hasPermission', false)
        obj.children.length &&
          obj.children.forEach(ele => {
            ele.hasPermission = false
          })
      } else {
        this.$set(obj, 'hasPermission', true)
        this.$set(parentObj, 'hasPermission', true)
      }
    },
    threeSetFunction (item, key, value, index, val, ind) {
      const master = this.list[key]
      const parentObj = this.list[key].children[index]
      const obj = this.list[key].children[index].children[ind]

      if (obj.hasPermission) {
        this.$set(obj, 'hasPermission', false)
      } else {
        this.$set(obj, 'hasPermission', true)
        this.$set(parentObj, 'hasPermission', true)
        this.$set(master, 'hasPermission', true)
      }
    }
  }
}
</script>

<style scoped lang="less">
  .content {
    padding: 0 80px;
    .tel {
      line-height: 32px;
    }
    .btn-con {
      padding: 0px 15px;
      border: 1px solid #e6fff4;
      color: rgba(0, 0, 0, 0.65);
      border-radius: 2px;
      height: 32px;
      font-size: 14px;
      display: inline-block;
      background: #f1f1f1;
      cursor: pointer;
      &:hover {
        color: #1aac31;
      }
      &.active {
        color: #1aac31;
        border: 1px solid #1aac31;
        background: #38e818f7;
      }
    }
    ul li {
      float: left;
      margin-right: 8px;
      margin-bottom: 8px;
      line-height: 32px;
    }
  }
  .m-b-20{
    margin-bottom: 20px;
  }
</style>
