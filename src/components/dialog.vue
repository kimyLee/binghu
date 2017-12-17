<template>
  <div class="my-dialog-hover" >
    <!-- 输入框顶部占位 -->
    <div class="top-box">
    </div><div class="dialog-panel">
      <div class="dialog-content">
          hello word<br>
          hello word<br>
          hello word<br>
          hello word<br>
          hello word<br>
          hello word<br>
          hello word<br>
          hello word<br>
          hello word<br>
          hello word<br>
          hello word<br>
          hello word<br>
          hello word<br>
          hello word<br>
       
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'dialogs',
  props: {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
  .my-dialog-hover {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 999;
    text-align: center;
    background: rgba(0, 0, 0, .87);
     .top-box {
        position: relative;
        display: inline-block;
        width: 80%;
       // height: 8.2rem;
        margin-top: 11.2rem;
        top: 0.3rem;
        background: #fff;
        &:before {
          content: "";
          position: absolute;
          top: -8.2rem;
          left: 0;
          border-width: 0 0 8.2em 3.2rem;
          border-style: solid;
          border-color:#fff transparent;
        }
        &:after {
          content: "";
          position: absolute;
          top: -8.2rem;
          right: 0;
          left: 3.2rem;
          height: 8.2rem;
          background: #fff;
          // border-width: 8.2rem;
          // border-style: solid;
          // border-color: #fff;
        }
      }
    .dialog-panel {
      position: relative;
      display: inline-block;
      width: 80%;
      background: #fff;
      &:before {
        content: "";
        position: absolute;
        bottom: -8.2rem;
        right: 0;
        border-width: 8.2em 3.2rem 0 0;
        border-style: solid;
        border-color: #fff transparent;
      }
      &:after {
        content: "";
        position: absolute;
        bottom: -8.2rem;
        left: 0;
        right: 3.2rem;
        // border-width: 8.2rem;
        // border-style: solid;
        // border-color: #fff;
        background: #fff;
        height: 8.2rem;
      }

      .dialog-content {
        position: relative;
         margin-top: -4.4rem;
         margin-bottom: -4.4rem;
        z-index: 999;
      }

    }

  }
</style>
