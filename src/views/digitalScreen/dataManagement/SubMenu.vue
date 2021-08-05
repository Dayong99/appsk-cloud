<template  functional>
    <a-sub-menu :key="props.menuInfo.key" @click="dataShow(item)">
        <span slot="title">
          <a-icon type="folder" /><span>{{ props.menuInfo.name }}</span>
        </span>
        <template v-for="item in props.menuInfo.children">
          <a-menu-item v-if="!item.children" :key="item.key" 
          >
            <a-icon type="file" />
            <span>{{ item.name }}</span>
          </a-menu-item>
          <sub-menu v-else :key="item.key" :menu-info="item"/>
        </template>
      </a-sub-menu>
</template>

<script>

export default {
    props: ['menuInfo'],
    methods:{
        dataShow(item){
        console.log(item)
        // debugger;
        this.$emit('tranUSem',item);
    },
  }
};
</script>
