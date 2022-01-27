<template>
  <div>
    <viewBulletin path-prefix="/yqInforComponent/yqInfo" req-prefix="yqgz" />
  </div>
</template>

<script>
    import viewBulletin from '@/myComponents/bulletinBoard/viewBulletin'
    export default {
      name: "yqgz_viewBulletin",
      components:{
        viewBulletin
      }
    }
</script>

<style lang="scss">

</style>
