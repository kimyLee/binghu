<template>
  <div class="my-dialog-hover" v-show="open">
    <div class="dialog-container">
        <div class="top-box">
          <div class="triangle-left"></div>
        </div>

        <div class="dialog-panel">
          <div class="dialog-content" :class="{'longText': Over70}" :style="{'height': height + 'rem'}">
              <div class="dialog-title"><slot name="title"></slot></div>
              <div class="dialog-text"><slot></slot></div>
          </div>
          <div class="triangle-right"></div>
        </div>

        <div class="close-btn" @click="handleClose">×</div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'dialogs',
  props: ['open', 'height'],
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
    background: rgba(0, 0, 0, .77);
    .dialog-container {
      z-index: 999;
      top: 50%;
      position: relative;
      transform: translateY(-40%);
    }
     .top-box {
        position: relative;
        width: 77%;
        left: 12%;
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
           border-width: 8.2em 3.9rem 0 0;
          border-style: solid;
          border-color: transparent #fff;
          /* // border-style: solid;
          // border-width: 4.1rem 1.6rem 4.15rem 1.6rem;
          // border-color:transparent #fff #fff transparent; */
        }
        &:after {
          content: "";
          position: absolute;
          top: -8.1rem;
          right: 0;
          left: 3.8rem;
          height: 8.2rem;
          border: none;
          background: #fff;
        }
        .triangle-left {
          position: absolute;
          left: -3px;
          top: -9rem;
          width: 0;
          height: 0;
          border:solid rgb(216,66, 71);
          border-top-width: 4.1rem;
          border-left-width: 1.95rem;
          border-right-width: 1.95rem;
          border-bottom-width: 4.1rem;
          border-bottom-color: transparent;
          border-right-color: transparent;
        }
      }
    .dialog-panel {
      position: relative;
      display: block;
      width: 77%;
      left: 12%;
      background: #fff;
      border: none;
       margin: 0;

      &:before {
        content: "";
        position: absolute;
        bottom: -8.1rem;
        right: 0;
        border-width: 8.2em 3.9rem 0 0;
        border-style: solid;
        border-color: #fff transparent;
      }
      &:after {
        content: "";
        position: absolute;
        bottom: -8.1rem;
        left: 0;
        right: 3.8rem;
        background: #fff;
        height: 8.2rem;
      }

      .dialog-content {
        position: relative;
        font-size: 1.4rem;
        color: #999;
        font-style:italic;
        z-index: 999;
        text-align: left;
        &.longText {
        margin-top: -4.4rem;
         margin-bottom: -4.4rem;
        }
        .dialog-title {
          color: #d84247;
          font-style:italic;
          font-size: 2.4rem;
          font-weight: bold;
          position: relative;
          top: -6rem;
          text-align: center;
          img {
            display: inline-block;
            height: 2.8rem;
          }
        }
        .dialog-text{
          position: absolute;
          top: -2rem;
          width: 100%;
        }
      }
      .triangle-right {
          position: absolute;
          right: -3px;
          bottom: -9rem;
          width: 0;
          height: 0;
          border: solid rgb(216,66, 71);
          border-top-width: 4.1rem;
          border-left-width: 1.95rem;
          border-right-width: 1.95rem;
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
