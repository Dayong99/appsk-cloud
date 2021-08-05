<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>
    <v-chart :data="data" :height="height" :force-fit="true" :scale="scale" :onClick="handleClick">
      <v-tooltip/>
      <v-axis/>
      <v-legend/>
      <v-bar position="x*y" color="#ff9a52" :adjust="adjust"/>
    </v-chart>
  </div>
</template>

<script>
  import { DataSet } from '@antv/data-set'
  import { ChartEventMixins } from './mixins/ChartMixins'

  export default {
    name: 'BarMultid',
    mixins: [ChartEventMixins],
    props: {
      title: {
        type: String,
        default: ''
      },
      dataSource: {
        type: Array,
        default: () => [
         
        ]
      },
      fields: {
        type: Array,
        default: () => []
      },
      // 别名，需要的格式：[{field:'name',alias:'姓名'}, {field:'sex',alias:'性别'}]
      aliases: {
        type: Array,
        default: () => []
      },
      height: {
        type: Number,
        default: 254
      }
    },
    data() {
      return {
        adjust: [{
          type: 'dodge',
          marginRatio: 1 / 32
        }]
      }
    },
    computed: {
      data() {
        const dv = new DataSet.View().source(this.dataSource)
        dv.transform({
          type: 'fold',
          fields: this.fields,
          key: 'x',
          value: 'y'
        })

        // bar 使用不了 - 和 / 所以替换下
        let rows = dv.rows.map(row => {
          if (typeof row.x === 'string') {
            row.x = row.x.replace(/[-/]/g, '_')
          }
          return row
        })
        // 替换别名
        rows.forEach(row => {
          for (let item of this.aliases) {
            if (item.field === row.type) {
              row.type = item.alias
              break
            }
          }
        })
        return rows
      },
      scale() {
        return [
          {
            type: 'cat',
            dataKey: 'x'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>