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
      <span class="start-btn"  @click="startGame"></span>
    </div>
    <!-- 游戏协议 -->
    <div class="game-protocol">
      <input type="checkbox" class="game-checkbox" v-model="hasCheck"/>
      <button class="game-protocol-btn" @click="seeProtocol=true">查看游戏声明</button>
    </div>

    <!-- 游戏规则说明 -->
    <my-dialog :open="seeRule" @closeDialog="seeRule = false" height="15">
      <img slot="title" :src="'/static/images/game_rule.png' | autoPre" />
      1. 力度条不断变化，待力度合适时点击滑行，滑出冰壶<br>
      2. 冰壶滑行过程中，力度会不断衰减，冰壶速度也越来越慢，左右扫冰可降低力度衰减速率，同时冰壶向对应方向偏离<br>
      3. 当力度降至为零，冰壶停止运动，或者冰壶接触滑道两边时，游戏结束<br>
      4. 游戏结束是冰壶离终点距离为最终分数，距离越近分数越高，所得积分也越高<br>
      5. 玩家凭借积分可····
    </my-dialog>
    <!-- 查看游戏声明 -->
    <my-dialog :open="seeProtocol" @closeDialog="seeProtocol = false" height="2">
       <img slot="title" :src="'/static/images/shengming.png' | autoPre" />
        1. 本次积分只在活动期间有效<br>
        2. 活动方保留最终解释权
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
      hasCheck: false,
      seeRule: false,
      seeProtocol: false
    }
  },
  methods: {
    startGame () {
      if (!this.hasCheck) {
        alert('请先阅读游戏声明')
        return
      }
      this.$router.push({name: 'word'})
    }
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
