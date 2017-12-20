<template>
  <div class="start-page">
    <!-- logo 和 游戏规则 -->
    <div class="logo">
      <img :src="'/static/images/logo.png' | autoPre" />
    </div>
    <div class="game-rule" @click="seeRule=true">
      <img :src="'/static/images/rule.png' | autoPre" />
    </div>

    <div class="bg-box">
      <img class="img-bg" :src="'/static/images/homeBg.png' | autoPre" />
    </div>
    <!-- 开始游戏按钮 -->
    <div class="btn-field">
      <span class="start-btn"  @click="$router.push({name: 'word'})"></span>
    </div>
    <!-- 游戏协议 -->
    <div class="game-protocol">
      <input type="checkbox" class="game-checkbox"/>
      <button class="game-protocol-btn" @click="seeProtocol=true">查看游戏声明</button>
    </div>

    <!-- 游戏规则说明 -->
    <my-dialog :open="seeRule" @closeDialog="seeRule = false">
      这是游戏规则说明<br>
      这是游戏规则说明<br>
      这是游戏规则说明<br>
      这是游戏规则说明<br>
    
    </my-dialog>
    <!-- 查看游戏声明 -->
    <my-dialog :open="seeProtocol" @closeDialog="seeProtocol = false">
      这是游戏声明<br>
      这是游戏声明<br>
      这是游戏声明<br>
      这是游戏声明<br>
      这是游戏声明<br>
 
    </my-dialog>
  </div>
</template>

<script>
import myDialog from '@/components/dialog'
export default {
  name: 'app',
  components: {
    myDialog
  },
  data () {
    return {
      seeRule: false,
      seeProtocol: false
    }
  },
  methods: {
    // startGame () {
    //   this.$router.push({name: 'word'})
    // }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
  .start-page {
    background: #fff;
    position: relative;
    .logo {
      position: absolute;
      top: 1.8rem;
      left: 2.7rem;
      width: 7.5rem;
      z-index: 10;
      img {
        width: 100%;
      }
    }
    .game-rule {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 9.5rem;
      z-index: 10;
      img {
        width: 100%;
      }
    }
    .bg-box {
      position: relative;
      .img-bg {
        width: 100%;
      }
    }

    .btn-field {
      text-align: center;
      margin-top: 1.5rem;
      .start-btn {
        display: inline-block;
        width: 23.5rem;
        height: 7rem;
        background: url('../assets/btn.png') no-repeat;
        background-size: 100%;
      }
    }
    .game-protocol {
      text-align: center;
      .game-checkbox {
        width: 2rem;
        height: 2rem;
        vertical-align: top;
      }
      .game-protocol-btn {
         width: 12.5rem;
         height: 2rem;
         margin-top: 0.2rem;
        vertical-align: top;
         box-shadow: 0 1px 1px 2px #ddd;
      }
    }
  }
</style>
