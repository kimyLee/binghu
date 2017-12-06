<template>
  <div class="operator">
    <a class="top-btn" @mousedown="pressEvent('top')" @mouseup="pressEvent()" @touchstart="touchEvent('top')" @touchend.prevent="touchEvent('')">
      <div class="top-btn-arrow"></div>
    </a>
    <a class="left-btn" @mousedown="pressEvent('left')" @mouseup="pressEvent()" @touchstart="touchEvent('left')" @touchend.prevent="touchEvent('')">
      <div class="left-btn-arrow"></div>
    </a>
    <a class="right-btn" @mousedown.stop="pressEvent('right')" @mouseup="pressEvent()" @touchstart="touchEvent('right')" @touchend.prevent="touchEvent('')">
      <div class="right-btn-arrow"></div>
    </a>
    <a class="bottom-btn" @mousedown="pressEvent('bottom')" @mouseup="pressEvent()" @touchstart="touchEvent('bottom')" @touchend.prevent="touchEvent('')">
      <div class="bottom-btn-arrow"></div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
    }
  },
  methods: {
    touchEvent (dir) {
      this.$emit('action', dir)
    },
    pressEvent (dir) {
      this.$emit('action', dir)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
  .operator {
    position: fixed;
    width: 136px;
    height: 136px;
    bottom: 16px;
    right: 16px;
    background: pink;
    border-radius: 50%;
    overflow: hidden;
    .top-btn {
      position: absolute;
      top: 0;
      left: 50%;
      margin-left: -24px;
      width: 48px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      .top-btn-arrow {
        display: inline-block;
        width: 0;
        height: 0;
         border-left: 8px solid pink;
        border-right: 8px solid pink;
        border-bottom: 16px solid #fff;
      }
      &:active {
        .top-btn-arrow {
           border-left: 8px solid pink;
          border-right: 8px solid pink;
          border-bottom: 16px solid #ccc;
        }
      }
    }
    .left-btn {
      position: absolute;
      top: 50%;
      left: 0;
      margin-top: -24px;
      width: 48px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      .left-btn-arrow {
        display: inline-block;
        width: 0;
        height: 0;
         border-right: 16px solid #fff;
        border-top: 8px solid pink;
        border-bottom: 8px solid pink;
      }
      &:active {
        .left-btn-arrow {
           border-right: 16px solid #ccc;
           border-top: 8px solid pink;
           border-bottom: 8px solid pink;
        }
      }
    }
    .right-btn {
      position: absolute;
      top: 50%;
      right: 0;
      margin-top: -24px;
      width: 48px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      .right-btn-arrow {
        display: inline-block;
        width: 0;
        height: 0;
         border-top: 8px solid pink;
        border-left: 16px solid #fff;
        border-bottom: 8px solid pink;
      }
      &:active {
        .right-btn-arrow {
           border-top: 8px solid pink;
        border-left: 16px solid #ccc;
        border-bottom: 8px solid pink;
        }
      }
    }
    .bottom-btn {
      position: absolute;
      bottom: 0;
      left: 50%;
      margin-left: -24px;
      width: 48px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      .bottom-btn-arrow {
        display: inline-block;
        width: 0;
        height: 0;
         border-left: 8px solid pink;
        border-right: 8px solid pink;
        border-top: 16px solid #fff;
      }
      &:active {
        .bottom-btn-arrow {
           border-left: 8px solid pink;
          border-right: 8px solid pink;
          border-top: 16px solid #ccc;
        }
      }
    }
  }
</style>
