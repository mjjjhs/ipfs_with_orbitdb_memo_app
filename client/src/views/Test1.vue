<template>
  <div class="test1">
    <div class="bgWrap">
      <img alt="ipfs logo" src="@/assets/js_ipfs.png">
    </div>
    <AddGetFile msg="Welcome to js-ipfs app"/>
  </div>
</template>

<script>
// @ is an alias to /src
import AddGetFile from '@/components/addFile_getFile.vue';

export default {
  name: 'test1',
  components: {
    AddGetFile,
  },
};
</script>
<style scoped>
  .bgWrap {
    width:100%;
    max-height:452px;
    min-height:320px;
    background:url('../assets/bg.png') left top repeat-x;
  }
  .bgWrap img{
    width:100%;
    max-width:457px;
    min-width:320px;
    height:100%;
  }
</style>
