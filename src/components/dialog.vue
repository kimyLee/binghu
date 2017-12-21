<template>
  <div class="my-dialog-hover" v-show="open">
    <div class="dialog-container">
        <!-- 输入框顶部占位 -->
        <div class="top-box">
          <!-- 左边的三角形 -->
          <div class="triangle-left"></div>
        </div>

        <div class="dialog-panel">
          <div class="dialog-content" :class="{'longText': Over70}">
              <slot></slot>
          </div>
           <!-- 右边的三角形 -->
          <div class="triangle-right"></div>
        </div>  

         <!-- 关闭按钮 -->
          <div class="close-btn" @click="handleClose">×</div>
    </div>
   
  </div>
</template>

<script>
export default {
  name: 'dialogs',
  props: ['open'],
  mounted () {
    this.$nextTick(() => {
      let $content = this.$el.querySelector('.dialog-content')
      this.Over70 = $content && ($content.offsetHeight > 70)
    })
  },
  data () {
    return {
      Over70: false            // 是否超过70px, 是则加上负margin
    }
  },
  methods: {
    handleClose () {
      this.$emit('closeDialog')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
  .my-dialog-hover {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    text-align: center;
    background: rgba(0, 0, 0, .67);
    .dialog-container {
      z-index: 999;
      top: 50%;
      position: relative;
      transform: translateY(-40%);
    }
     .top-box {
        position: relative;
        width: 66%;
        left: 17%;
        margin: 0;
        top: 1px;
        &:before {
          content: "";
          position: absolute;
          z-index: 999;
          top: -8.2rem;
          left: 0;
          width: 0;
          height: 0;
          border-width: 4.1rem 1.6rem 4.15rem 1.6rem;
          border-style: solid;
          border-color:transparent #fff #fff transparent;
        }
        &:after {
          content: "";
          position: absolute;
          top: -8.2rem;
          right: 0;
          left: 3.2rem;
          height: 8.2rem;
          border: none;
          background: #fff;
        }
        .triangle-left {
          position: absolute;
          left: 0;
          top: -9.2rem;
          width: 0;
          height: 0;
          border:solid rgb(216,66, 71);
          border-top-width: 4.1rem;
          border-left-width: 1.6rem;
          border-right-width: 1.55rem;
          border-bottom-width: 4.1rem;
          border-bottom-color: transparent;
          border-right-color: transparent;
        }
        
      }
    .dialog-panel {
      position: relative;
      display: block;
      width: 66%;
        left: 17%;
      background: #fff;
      border: none;
       margin: 0;
    
      &:before {
        content: "";
        position: absolute;
        bottom: -8.1rem;
        right: 0;
        border-width: 8.2em 3.2rem 0 0;
        border-style: solid;
        border-color: #fff transparent;
      }
      &:after {
        content: "";
        position: absolute;
        bottom: -8.1rem;
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
        font-size: 1.6rem;
        z-index: 999;
        &.longText {
        margin-top: -4.4rem;
         margin-bottom: -4.4rem;
        }
      }
      .triangle-right {
          position: absolute;
          right: 0;
          bottom: -9.2rem;
          width: 0;
          height: 0;
          border: solid rgb(216,66, 71);
          border-top-width: 4.1rem;
          border-left-width: 1.55rem;
          border-right-width: 1.6rem;
          border-bottom-width: 4.1rem;
          border-top-color: transparent;
          border-left-color: transparent;
         
        }

    }
    .close-btn {
      width: 3.3rem;
      height: 3.3rem;
      margin: 0 auto ;
      margin-top: 10rem;
      border-radius: 50%;
      border: 2px solid rgb(216,66, 71);
      text-align: center;
      color: #fff;
      font-size: 40px;
      line-height: 3.5rem;
    }

  }
</style>
