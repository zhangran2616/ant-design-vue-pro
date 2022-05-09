<template>
  <h2>基本页面</h2>
</template>
<script>
import { TagSelect, Ellipsis } from '@/components'

export default {
  name: 'Base',
  components: {
    Ellipsis,
    TagSelect
  },
  data () {
    return {
      form: this.$form.createForm(this),
      loading: true
    }
  },
  mounted () {
  },
  methods: {

  }
}
</script>
