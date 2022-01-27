<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import watermark from "@/utils/watermark";

  export default  {
    name:  'App',
    metaInfo() {
        return {
            title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
            }
        }
    },
    mounted() {
      var a = setInterval(function () {
        if(localStorage.getItem("nickName") && localStorage.getItem("phonenumber")){
          watermark.set(localStorage.getItem("nickName") + '-' + localStorage.getItem("phonenumber"));
          clearInterval(a);
        }
      },1000);
    }
  }
</script>
