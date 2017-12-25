<template>
  <div class="container">
    <div id="stage"></div>
    <!-- 计分器 -->
    <div class="score-panel">
      <div class="score-box">
        <div class="box-item" style="border-bottom: 1px solid #ccc;">离靶心</div>
        <div class="box-item num">{{score}}m</div>
      </div>
      <!-- 排行榜 -->
      <div class="ranking" @click="openRanking">排行榜</div>
    </div>

    <power-line
      ref="powerLine"
      @returnSpeed="getJourney"
      @changeStatus="shot"
      @changeRotate="getRotate"></power-line>
    <option-btn  @click="handleDirect('left')">左扫冰</option-btn>
    <option-btn  @click="handleDirect('right')" side='right'>右扫冰</option-btn>
    <!-- 文字图片特效 -->
    <transition name="fade">
      <div class="text-effect" v-show="showTextEffect === 'go'">
        GO!
      </div>
    </transition>
    <transition name="fade">
       <div class="text-effect-img" v-show="showTextEffect === 'moreSmooth'">
        <img :src="'/static/images/moreSmooth.png' | autoPre" />
      </div>
    </transition>

    <my-dialog height="26.5" :open="showRanking" @closeDialog="showRanking=false" class="dialog rankings">
      <img slot="title" :src="'/static/images/rank.png' | autoPre" />
      <div class="ranking-section rank-head">
        <div class="name">用户昵称</div>
        <div class="score" style="text-align: right">分数</div>
      </div>
      <div
        ref="wrapper"
        class="wrapper"
        @scrollToEnd="fetchData">
        <ul class="content">
          <li v-for="item in (rankData || data)" :key="item.Sort">
            <div class="ranking-section">
              <span class="rank">{{ item.Sort }}</span>
              <img :src="item.UserLogo" class="avatar" />
              <span class="name">{{ item.UserName }}</span>
              <span class="score">{{ item.Integral }}</span>
          </div>
          </li>
        </ul>
        <div class="loading-wrapper"></div>
      </div>
      <div class="ranking-more">向上拉动查看更多排名</div>
    </my-dialog>

    <my-dialog height="5" :open="showPoints" @closeDialog="closeShowPoint" class="dialog points" style="text-align: left;">
      <img slot="title" :src="'/static/images/victory.png' | autoPre"/>
      <div class="results-content" style="padding: 0;">
        <p class="notice">获得<span class="num">{{points}}分</span></p>
        <p class="tip">总积分达到了{{baseinfo.point + points}}分</p>
        <p class="tip">每天只能有一次获得积分的机会,请明天再来吧</p>
      </div>
    </my-dialog>

    <!-- 已获取积分 -->
    <my-dialog height="5" :open="showTotalPoints" @closeDialog="closeShowPoint" class="dialog points" style="text-align: left;">
      <img slot="title" :src="'/static/images/victory.png' | autoPre"/>
      <div class="results-content" style="padding: 0;">
        <p class="tip">总积分达到了<span class="num">{{baseinfo.point}}</span>分</p>
        <p class="tip">每天只能有一次获得积分的机会,请明天再来吧</p>
      </div>
    </my-dialog>

    <my-dialog height="1" :open="msgTip" @closeDialog="msgTip=false" class="dialog">
      <div class="results-content">       
        <p class="tip"><b>网络错误</b></p>
        <p class="tip"><b>错误信息：{{msgText}}</b></p>
        <p class="tip">请刷新页面重试</p>
      </div>
    </my-dialog>

    <my-dialog :colseable="false" :height="success ? 21 : 16" :open="showResult" @closeDialog="showResult=false" class="dialog results">
        <img slot="title" :src="'/static/images/victory.png' | autoPre" v-show="success"/>
        <img slot="title" :src="'/static/images/failed.png' | autoPre" v-show="!success"/>
        <div class="results-content" style="padding: 0; ">
          <p class="notice">你距离靶心<span class="num">{{this.score}}</span>M</p>
          <p class="slogan">万宝路新红万产品全新升级</p>
          <ul class="attrs">
            <li>口味特点：</li>
            <li>富在内 融于味</li>
            <li>经典美式混合烟，口味进一步提升</li>
            <li>劲还在，口感更顺</li>
            <li>焦油含量降至10毫克</li>
          </ul>
          <div style="text-align: center;">
            <span class="results-btn" v-show="success" @click="handleBtnClick('points')">
              已了解，立刻抽积分
            </span>
            <span class="results-btn" @click="handleBtnClick('continue')">再次挑战</span>
          </div>
        </div>
      </my-dialog>
  </div>
</template>

<script>
import powerLine from '@/components/powerLine'
import optionBtn from '@/components/optionBtn'
import BingHu from '@/class/binghu'
import Brush from '@/class/Brush'
import People from '@/class/people'
import myDialog from '@/components/dialog'
import BScroll from 'better-scroll'
import axios from 'axios'

export default {
  name: 'world',
  components: {
    powerLine,
    optionBtn,
    myDialog
  },
  data () {
    return {
      points: 0,             // 获得积分
      renderTimer: 0,         // 渲染函数计时器
      hasBrush: 0,            // 点击刷过次数，超过5次不用触发更加顺滑
      beginMove: '',          // 从哪个点开始计算距离， 默认2 / 3 Height
      domain: '',
      topestDistance: -630,   // 终 点 实际位移
      topest: -630,           // 终 点
      score: 0,               // 距离分数
      binghu: '',             // 冰壶对象
      brush: '',              // 刷子对象
      bgWalk: 0,              // 背景偏移
      roadWidth: 100,         // 轨道宽度
      speed: 0,               // 速度力度
      speedFactor: 33,        // 速度计算因子
      ratio: '',              // 分数计算因子
      status: 0,              // 当前状态， 0 正在选择力度， 1 正在移动，  2， 游戏结束

      context: '',            // 上下文
      canvas: '',             // 画布对象
      boxX: 0,                // 画布起点横坐标
      boxY: 0,                // 画布起点纵坐标
      Width: '',              // 画布宽度
      Height: '',             // 画布高度
      currentFrame: 0,        // 当前帧
      image: '',              // 冰壶贴图对象
      peopleImg1: '',         // 观众贴图对象1
      peopleImg2: '',         // 观众贴图对象2
      brushImage: '',         // 刷子贴图对象
      meter: '',              // 标尺贴图对象
      showTextEffect: '',     // 特效类型
      showRanking: false,     // 显示排行榜
      pullup: true,           // 加载更多
      listenScroll: true,
      pulldown: true,
      scroll: null,
      beforeScroll: true,
      data: [
        { Sort: 1, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'xxx', Integral: 199 },
        { Sort: 2, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'yyy', Integral: 198 },
        { Sort: 3, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'zzz', Integral: 197 },
        { Sort: 4, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'www', Integral: 196 },
        { Sort: 5, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'ttt', Integral: 195 },
        { Sort: 6, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'xxx', Integral: 199 },
        { Sort: 7, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'yyy', Integral: 198 },
        { Sort: 8, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'zzz', Integral: 197 },
        { Sort: 9, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'www', Integral: 196 },
        { Sort: 10, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'ttt', Integral: 195 },
        { Sort: 11, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'xxx', Integral: 199 },
        { Sort: 12, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'yyy', Integral: 198 },
        { Sort: 13, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'zzz', Integral: 197 },
        { Sort: 14, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'www', Integral: 196 },
        { Sort: 15, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'ttt', Integral: 195 },
        { Sort: 16, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'xxx', Integral: 199 },
        { Sort: 17, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'yyy', Integral: 198 },
        { Sort: 18, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'zzz', Integral: 197 },
        { Sort: 19, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'www', Integral: 196 },
        { Sort: 20, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'ttt', Integral: 195 },
        { Sort: 21, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'ttt', Integral: 195 },
        { Sort: 22, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'ttt', Integral: 195 },
        { Sort: 23, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'ttt', Integral: 195 },
        { Sort: 24, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'ttt', Integral: 195 },
        { Sort: 25, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'ttt', Integral: 195 },
        { Sort: 26, UserLogo: '/binghutiaozhan/static/images/binghu.png', UserName: 'ttt', Integral: 195 }
      ],

      msgText: '',                         // 错误信息
      msgTip: false,                       // 系统弹窗
      showResult: false,
      showPoints: false,
      showTotalPoints: false,
      success: false,

      baseinfo: {                           // 用户信息
        points: '',
        hasGetPoint: false
      },
      rankData: ''                         // 排行榜数据
    }
  },

  watch: {
    showRanking (nv) {
      if (nv) {
        // better-scroll的初始化
        this.scroll = new BScroll(this.$refs.wrapper, {})
        // 是否派发滚动到底部事件，用于上拉加载
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            // 滚动到底部
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              // this.fetchData()
            }
          })
        }
      }
    }
  },

  created () {
    this.binghu = new BingHu()
    this.brush = new Brush()
    this.image = new Image()
    this.people = new People()
    this.peopleImg1 = new Image()
    this.peopleImg2 = new Image()
    this.brushImage = new Image()
    this.meter = new Image()
    // this.fetchData()

    this.image.src = this.$domain + '/static/images/binghu.png'
    this.brushImage.src = this.$domain + '/static/images/brush.png'
    this.peopleImg1.src = this.$domain + '/static/images/people2.jpg'
    this.peopleImg2.src = this.$domain + '/static/images/people.jpg'
    this.meter.src = this.$domain + '/static/images/meter.jpg'
  },

  methods: {
    // 获取用户信息和排行榜数据
    fetchData () {
      axios.post('/Index/SystemStatue')
        .then((res) => {
          if (res.Code === 1) {
            let data = res.Data
            this.baseinfo = {
              points: data.Integral || '',
              hasGetPoint: !!data.UserStatue
            }
            this.rankData = data.RankingList
          } else {
            return Promise.reject(res)
          }
        })
        .catch((error) => {
          this.msgText = error.msg || '未知错误'
          this.msgTip = true
        })
      console.log('fetching data...')
    },
    // 上传成绩距离 todo: 如果不能获得积分的原因有两个，1 距离不到，2 今天已获得，需要返回失败类型
    pushScore (distance) {
      axios.post('/Index/SaveUserInfo', {
        Distance: distance
      })
        .then((res) => {
          if (res.Code === 1) {
            let data = res.Data
            let success = data.Statue
            if (!success) {
              return Promise.reject(new Error({msg: data.Msg}))
            }
            // 如果今天已获取积分
            if (this.baseinfo.hasGetPoint || !data.IsGetIntegral) {
              this.showTotalPoints = true
            } else {
              // 能获得积分，打开获得积分页
              this.point = data.GetedIntegral
              this.showResult = false
              this.showPoints = true
            }
          } else {
            return Promise.reject(res)
          }
        })
        .catch((error) => {
          // console.log(error)
          // this.showTotalPoints = true

          // this.showResult = false
          // this.showPoints = true

          this.msgText = error.msg || '未知错误'
          this.msgTip = true
        })
    },
    // 关闭分数页
    closeShowPoint () {
      this.showPoints = false
      this.showTotalPoints = false
      this.reStart()
    },

    run () {
      if (this.status === 2) {
        return
      }
      this.render()
      this.renderTimer = window.requestAnimFrame(this.run)
    },

    // score 计算
    // 最高点减去冰壶起点， 收敛到50 , this.ratio = (this.binghu.begin - this.topest) / 50
    render () {
      this.context.clearRect(this.boxX, this.boxY, this.Width, this.Height)
      this.currentFrame++
      this.drawBg()
      this.drawFinal()
      this.drawPeople()
      this.drawHero()
      this.drawBrush()
      this.context.save()
      this.context.restore()

      this.score = (Math.abs(this.beginMove - this.topestDistance - this.bgWalk) / this.ratio).toFixed(1)
      this.judge()
    },

    shot (val) {
      if (this.status) {
        return
      }
      this.status = val
      this.binghu.stop = false
      this.fireTextTip('go')
    },

    drawBrush () {
      let brush = this.brush
      brush.updateSelf()
      if (this.brush.show) {
        let ctx = this.context
        // 开始剪切x ,开始剪切y,被剪切宽度,被剪切高度,画布上x坐标,画布上y坐标,图像的宽度,图像的高度
        ctx.drawImage(this.brushImage, 0, 0, 115, 51, brush.posX - brush.width / 2, 300, brush.width, brush.height)
      }
    },

    // 画终点 画三个圆
    drawFinal () {
      let ctx = this.context
      if (this.binghu.stop) {
        this.topest = this.topest + this.speed / this.speedFactor
      }

      ctx.beginPath()
      ctx.strokeStyle = '#f1db8d'
      ctx.fillStyle = '#fff'
      ctx.lineWidth = 10
      ctx.arc(this.Width / 2, this.topest, 70, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fill()

      ctx.beginPath()
      ctx.strokeStyle = '#84d0fd'
      ctx.lineWidth = 10
      ctx.arc(this.Width / 2, this.topest, 40, 0, 2 * Math.PI)
      ctx.stroke()

      ctx.beginPath()
      ctx.fillStyle = '#d63338'
      ctx.lineWidth = 1
      ctx.arc(this.Width / 2, this.topest, 10, 0, 2 * Math.PI)
      ctx.fill()
    },

    // 画一堆观众
    drawPeople () {
      let ctx = this.context
      let people = this.people
      // 制造三张图一直循环
      people.posArr.forEach((e, index) => {
        if (this.binghu.stop) {
          e.y = e.y + this.speed / this.speedFactor
        }
        if (e.y >= this.Height) {
          e.y = -people.height - (this.Height - people.height)
        }
        ctx.drawImage(this.peopleImg1, 0, 0, 141, 828, e.x, e.y, people.width, people.height)
        ctx.drawImage(this.peopleImg2, 0, 0, 141, 828, this.Width - people.width, e.y, people.width, people.height)
      })
      // 开始剪切x ,开始剪切y,被剪切宽度,被剪切高度,画布上x坐标,画布上y坐标,图像的宽度,图像的高度
    },

    drawHero () {
      let ctx = this.context
      ctx.save()
      let binghu = this.binghu
      if (!this.binghu.stop) {
        this.binghu.posy = -this.speed / this.speedFactor + this.binghu.posy
        if (this.binghu.posy < this.beginMove) {
          this.binghu.stop = true
        }
      }
      if (this.status) {
        this.binghu.horSpeed = this.binghu.horSpeed + this.binghu.horAccSpeed
        this.binghu.horSpeed = this.binghu.horSpeed > 0.5 ? 0.5 : (this.binghu.horSpeed < -0.5 ? -0.5 : this.binghu.horSpeed)
        this.binghu.posx = this.binghu.posx + this.binghu.horSpeed
        let follow = this.binghu.getFollowerPos(this.binghu.horSpeed, this.speed / this.speedFactor)

        ctx.beginPath()
        ctx.moveTo(follow.x, follow.y)
        ctx.lineTo(follow.x1, follow.y1)
        ctx.lineTo(follow.x2, follow.y2)
        ctx.closePath()
        ctx.fillStyle = '#d35155'
        ctx.fill()
      }
      // 开始剪切x ,开始剪切y,被剪切宽度,被剪切高度,画布上x坐标,画布上y坐标,图像的宽度,图像的高度
      ctx.drawImage(this.image, 0, 0, 162, 160, binghu.posx - binghu.R / 1.5, binghu.posy - binghu.R / 1.5, binghu.R * 2 / 1.5, binghu.R * 2 / 1.5)
      ctx.restore()
    },

    drawBg () {
      if (this.binghu.stop) {
        this.bgWalk = this.speed / this.speedFactor + this.bgWalk
      }
      let ctx = this.context
      ctx.fillStyle = '#ccc'
      // cxt.fillRect(0, 0, this.Width, this.Height)

      let numX = (this.Width - this.roadWidth) / 2 - 28      // 数字横坐标
      let beginY = this.beginMove
      let lineHeight = (beginY - this.topestDistance) / 25
      // let topHeight = 14
      // let bottomHeight = 8
      ctx.lineWidth = 1
      ctx.strokeStyle = '#ccc'
      ctx.fillStyle = '#ccc'
      ctx.beginPath()
      // 直接画画不图片会卡死
      // 开始剪切x ,开始剪切y,被剪切宽度,被剪切高度,画布上x坐标,画布上y坐标,图像的宽度,图像的高度
      ctx.drawImage(this.meter, 0, 0, 334, 1539, numX, this.topestDistance + this.bgWalk + lineHeight, this.roadWidth * 2 - 35, beginY - this.topestDistance - lineHeight * 4)

      let outterLineWidth = 20
      let innerLineWidth = 10
      ctx.beginPath()
      ctx.strokeStyle = '#ccc'
      ctx.lineWidth = outterLineWidth
      ctx.moveTo(this.people.width + outterLineWidth / 2, 0)
      ctx.lineTo(this.people.width + outterLineWidth / 2, this.Height)
      ctx.closePath()
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#ccc'
      ctx.lineWidth = outterLineWidth
      ctx.moveTo(this.Width - this.people.width - outterLineWidth / 2, 0)
      ctx.lineTo(this.Width - this.people.width - outterLineWidth / 2, this.Height)
      ctx.closePath()
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#eee'
      ctx.lineWidth = innerLineWidth
      ctx.moveTo(this.people.width + outterLineWidth + innerLineWidth / 2, 0)
      ctx.lineTo(this.people.width + outterLineWidth + innerLineWidth / 2, this.Height)
      ctx.closePath()
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#eee'
      // ctx.lineWidth = numX - this.people.width - 50
      ctx.lineWidth = 10
      ctx.moveTo(this.Width - this.people.width - outterLineWidth - innerLineWidth / 2, 0)
      ctx.lineTo(this.Width - this.people.width - outterLineWidth - innerLineWidth / 2, this.Height)
      ctx.closePath()
      ctx.stroke()
    },

    judge () {
      if (this.status === 1 && this.speed <= 0) {
        this.gameOver()
      }
      if (Math.abs(this.Width - this.binghu.posx * 2) > this.roadWidth) {
        this.gameOver()
      }
    },

    gameOver () {
      this.status = 2
      if (this.score >= 10) {
        this.success = false
        this.showResult = true
      } else {
        this.success = true
        this.showResult = true
      }
    },
    reStart () {
      this.hasBrush = 0
      this.speed = 0
      this.binghu.reset()
      this.status = 0
      this.bgWalk = 0
      this.topest = this.topestDistance
      this.$refs.powerLine.reset()
      cancelAnimationFrame && cancelAnimationFrame(this.renderTimer)
      this.run()
    },

    // 左右按钮点击事件
    handleDirect (dir) {
      if (this.status !== 1) {
        return
      }

      this.hasBrush === 5 && this.fireTextTip('moreSmooth')
      this.hasBrush <= 5 && this.hasBrush++

      this.$refs.powerLine.slowPowerDecrease()
      this.binghu.horAccSpeed = dir ? (dir === 'left' ? -0.05 : 0.05) : 0
      this.brush.addCount(dir)
    },

    // 获取偏移移动角度, 收敛值是振幅  / 0.5
    getRotate (val, cycle) {
      this.binghu.horSpeed = val / cycle * 0.5
    },

    // 获取速度
    getJourney (val) {
      if (this.status === 1) {
        this.speed = val
      }
    },

    // 触发文字图片特效
    fireTextTip (val) {
      this.showTextEffect = val
      setTimeout(() => {
        this.showTextEffect = false
      }, 500)
    },

    // 打开排行榜
    openRanking () {
      if (this.status !== 1) {
        this.showRanking = true
      }
    },

    // 根据用户的选择进行对应的操作
    handleBtnClick (type) {
      if (type === 'points') {
        this.showResult = false
        this.pushScore(this.score)
        // this.reStart()
        // 抽奖
      }
      if (type === 'continue') {
        this.showResult = false
        this.reStart()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.Width = window.innerWidth             // 屏幕宽度
      this.Height = window.innerHeight           // 屏幕高度
      this.beginMove = 2 / 3 * this.Height       // 开始滑动
      this.ratio = (this.beginMove - this.topestDistance) / 50
      let str = '<canvas id="canvas" width=' + this.Width + '; height=' + this.Height + '>Sorry! you的浏览器不支持canvas</canvas>'
      document.getElementById('stage').innerHTML = str
      // 全局对象
      this.canvas = document.getElementById('canvas')
      this.context = this.canvas.getContext('2d')

      if (window.devicePixelRatio) {
        this.canvas.style.width = this.Width + 'px'
        this.canvas.style.height = this.Height + 'px'
        this.canvas.height = this.Height * window.devicePixelRatio
        this.canvas.width = this.Width * window.devicePixelRatio
        this.context.scale(window.devicePixelRatio, window.devicePixelRatio)
      }

      this.run()
    })
  },

  destroy () {
    this.scroll = null
  }
}
</script>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;
    background: #fcfcfc;
    #stage {
      width: 100%;
      height: 100%;
      canvas {
        width: 100%;
        height: 100%;
      }
    }
    .score-panel {
      width: 8.2rem;
      height: 13.3rem;
      padding: 0.5rem;
      background: rgba(255, 255, 255, .67);
      position: fixed;
      left: 0;
      top: 0;
      text-align: center;
      .score-box {
        border: 5px solid #a11c20;
        border-radius: 5px;
        width: 100%;
        box-sizing: border-box;
        height: 8.25rem;
        background: #fff;
        .box-item {
          box-sizing: border-box;
          height: 50%;
          line-height: 4.1rem;
          font-size: 1.6rem;
          font-weight: bold;
          &.num {
            font-size: 2rem;
          }
        }

      }
      .ranking {
          width: 8.2rem;
          height: 3.3rem;
          text-align: center;
          color: #fff;
          background: #e03b40;
          border-radius: 5px;
          margin-top: 4px;
          font-size: 2.2rem;
          line-height: 3.3rem;
          box-shadow: 0px 2px 0px 2px #a11c20;
        }
    }

    .text-effect {
      position: fixed;
      z-index: 999;
      width: 100%;
      height: 30rem;
      text-align: center;
      top: 50%;
      margin-top: -15rem;
      line-height: 30rem;
      color: #d35155;
      font-style: italic;
      font-size: 3.2rem;
    }
    .text-effect-img {
      position: fixed;
      z-index: 999;
      width: 100%;
      height: 20rem;
      text-align: center;
      top: 45%;
      margin-top: -10rem;
      img {
        display: inline-block;
        height: 100%;
      }
    }
    .fade-enter-active, .fade-leave-active {
      transform: scale(1.2);
      transition: transform .5s, opacity .5s;
    }
    .fade-enter, .fade-leave-to {
      transform: scale(1);
      opacity: 0;
    }
  }

  .ranking-section {
    font-style: normal;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;

    .rank {
      flex: 1;
      font-size: 1rem;
    }

    .name {
      font-size: 1.4rem;
      flex: 2;
    }

    .avatar {
      width: 1.5rem;
      height: 1.5rem;
    }

    .score {
      flex: 1;
      font-size: 1.4rem;
      color: #e3464c;
    }

    &.rank-head {
      padding: 0 4rem;
      margin-bottom: 1rem;
      .score,
      .name {
        color: #767676;
        font-size: 1.3rem;
        text-align: center;
      }
    }
  }

  .wrapper {
    overflow: hidden;
    max-height: 30rem;
    width: 80%;
    margin: 0 auto;
    z-index: 99999;
  }

  .content {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      color: #767676;
      padding: 0.5rem;
      border-bottom: 1px solid #eee;
      &:last-child {
        border-bottom: 0;
      }
    }
  }

  .ranking-more {
    position: relative;
    font-size: 1.1rem;
    height: 1rem;
    padding-top: 1rem;
    text-align: center;
    color: #777;
    font-style: normal;

    &:before {
      position: absolute;
      content: '';
      width: 80%;
      left: 10%;
      height: 1px;
      background-color: #eee;
      top: 0;
    }
  }

  .results-content {
    padding: 0 2.5rem;

    .notice {
      // display: inline-block;
      font-style: normal;
      text-align: center;
      font-size:26px;
      color:#333;
      margin: 0;
    }

    .tip {
      // display: inline-block;
      text-align: left;
      line-height: 1.8;
    }

    .num {
      color:#d35155;
      font-weight: bold;
      font-size: 38px;
    }

    .slogan {
      text-align: center;
      border-left: 5px solid #444;
      margin: 0;
      margin-top: 1rem;
      color:#444;
      font-style:normal;
    }

    .results-btn {
      display: inline-block;
      text-align: center;
      color: #fff;
      background-image:url('/static/images/btn-bg.png');
      background-size: 100% 100%;
      width: 80%;
      margin-top: 1rem;
      height: 4rem;
      line-height: 4rem;
      padding: 0;
    }

    .attrs {
      list-style:none;
      font-size:14px;
      color:#555;
      line-height:1.8;
      font-style:normal;
    }
  }

  .dialog {
    ul,
    p {
      padding: 0;
      margin: 0;
    }
    .dialog-text {
      padding: 0;
    }
  }
  .results.dialog {
    .dialog-container {
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
