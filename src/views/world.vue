<template>
  <div class="container" id="container">
    <!-- <div style="opacity: 0" id="play-btn" @click="playMusic"></div> -->
    <div id="stage"></div>
    <!-- 计分器 -->
    <div class="score-panel">
      <div class="score-box">
        <div class="box-item" style="border-bottom: 1px solid #ccc;">离靶心距离</div>
        <div class="box-item num" style="line-height: 1.2;padding: 0 0.8rem">{{score}}
          <div style="text-align: right">m</div>
        </div>
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
        <div class="score" style="text-align: right">距离靶心（米）</div>
      </div>
      <div
        ref="wrapper"
        class="wrapper"
        @scrollToEnd="fetchData">
        <ul class="content">
          <li v-for="item in rankData" :key="item.Sort">
            <div class="ranking-section">
              <span class="rank">{{ item.Sort }}</span>
              <!-- <img :src="item.UserLogo" class="avatar" /> -->
              <span class="name">{{ item.UserName }}</span>
              <span class="score">{{ item.Integral }}</span>
          </div>
          </li>
        </ul>
        <div class="loading-wrapper"></div>
      </div>
      <div class="ranking-more">向上拉动查看更多排名</div>
    </my-dialog>

    <my-dialog height="16" :open="showPoints" @closeDialog="closeShowPoint" class="dialog points" style="text-align: left;">
      <img slot="title" :src="'/static/images/victory.png' | autoPre"/>
      <div class="results-content" style="padding: 0;">
        <p class="notice">获得<span class="num">{{points}}分</span></p>
        <p class="slogan">万宝路新红万产品全新升级</p>
          <ul class="attrs">
            <li>口味特点：</li>
            <li>富在内 融于味</li>
            <li>经典美式混合烟，口味进一步提升</li>
            <li>劲还在，口感更顺</li>
            <li>焦油含量降至10毫克</li>
          </ul>
          <div style="text-align: center;">
            <span class="results-btn" @click="handleBtnClick('continue')">再次挑战</span>
          </div>
      </div>
    </my-dialog>

    <!-- 已获取积分 -->
    <my-dialog height="5" :open="showTotalPoints" @closeDialog="closeShowPoint" class="dialog points" style="text-align: left;">
      <img slot="title" :src="'/static/images/victory.png' | autoPre"/>
      <div class="results-content" style="padding: 0;">
        <!-- <p class="tip">总积分达到了<span class="num">{{baseinfo.points}}</span>分</p> -->
        <p class="tip">每日积分奖励仅限领取一次，继续挑战冲击排行榜赢取每周积分大奖</p>
      </div>
    </my-dialog>

    <my-dialog height="1" :open="msgTip" @closeDialog="closeShowPoint" class="dialog">
      <span slot="title" >出错了···</span>
      <div class="">       
        <p class="tip"><b>错误信息：{{msgText}}</b></p>
        <p class="tip">抱歉，当前网络似乎出现意外状况，请尝试刷新页面</p>
      </div>
    </my-dialog>

    <my-dialog :colseable="false" :height="success ? 24 : 24" :open="showResult" @closeDialog="showResult=false" class="dialog results">
        <img slot="title" :src="'/static/images/victory.png' | autoPre" v-show="success"/>
        <img slot="title" :src="'/static/images/failed.png' | autoPre" v-show="!success"/>
        <div class="results-content" style="padding: 0; ">
          <p class="notice">你距离靶心<br>
            <span class="num">{{this.score}}</span>M</p>
          <p class="slogan">万宝路新红万产品全新升级</p>
          <ul class="attrs">
            <li>口味特点：</li>
            <li>富在内 融于味</li>
            <li>经典美式混合烟，口味进一步提升</li>
            <li>劲还在，口感更顺</li>
            <li>焦油含量降至10毫克</li>
          </ul>
          <div style="text-align: center;">
            <span class="results-btn" v-show="success" @click.prevent="handleBtnClick('points')">
              已了解，立刻抽积分
            </span>
            <span v-show="success" class="results-btn" @click.prevent="handleBtnClick('continue')" >再次挑战</span>
            <img v-show="!success" class="results-img-btn" :src="'/static/images/again.png' | autoPre" @click.prevent="handleBtnClick('continue')">
            <img  v-show="!success" class="results-img-btn" :src="'/static/images/game-intro.png' | autoPre" @click.prevent="$emit('showteach')">
            <!-- <span class="results-btn" v-show="!success" @click="$emit('showteach')">玩法教程</span> -->
          </div>
        </div>
      </my-dialog>
  </div>
</template>

<script>
import md5 from 'md5'
import Qs from 'qs'
import powerLine from '@/components/powerLine'
import optionBtn from '@/components/optionBtn'
import BingHu from '@/class/binghu'
import Brush from '@/class/Brush'
import People from '@/class/people'
import myDialog from '@/components/dialog'
import BScroll from 'better-scroll'
import axios from 'axios'
let fadeAudio = ''          // 淡出计时器
let brushTimer = ''         // 刷子声音计时器
let playing = false         // 刷子声音计时器

export default {
  name: 'world',
  components: {
    powerLine,
    optionBtn,
    myDialog
  },
  props: ['myAudio'],
  data () {
    return {
      globalId: '',
      randomCode: '',
      // 计算过程中的值缓存
      numX: 0,                // 画跑道的起始横坐标
      lineHeight: 0,          // 画跑道的间隔距离

      points: 0,              // 获得积分
      renderTimer: 0,         // 渲染函数计时器
      hasBrush: 0,            // 点击刷过次数，超过5次不用触发更加顺滑
      beginMove: '',          // 从哪个点开始计算距离， 默认2 / 3 Height
      domain: '',
      topestDistance: -630,   // 终 点 实际位移
      topest: -630,           // 终 点
      score: 0,               // 距离分数
      computedScoreTimer: '', // 计算分数时间器
      binghu: '',             // 冰壶对象
      brush: '',              // 刷子对象
      bgWalk: 0,              // 背景偏移
      roadWidth: 100,         // 轨道宽度
      speed: 0,               // 速度力度
      speedFactor: 33,        // 速度计算因子
      rate: 33,               // speed / speedFactor
      ratio: '',              // 分数计算因子
      status: 0,              // 当前状态， 0 正在选择力度， 1 正在移动，  2， 游戏结束

      context: '',            // 上下文
      contextStatic: '',      // 上下文
      canvas: '',             // 画布对象
      boxX: 0,                // 画布起点横坐标
      boxY: 0,                // 画布起点纵坐标
      Width: '',              // 画布宽度
      Height: '',             // 画布高度
      // currentFrame: 0,        // 当前帧
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
        points: 0,
        hasGetPoint: false
      },
      audioAutoPlay: '',
      // playType: '',
      rankData: []                         // 排行榜数据
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

  // computed: {
  //   score () {
  //     return (Math.abs(this.beginMove - this.topestDistance - this.bgWalk) / this.ratio).toFixed(1)
  //   }
  // },

  created () {
    // console.log(md5('WBLxinchunADDCFCIE'))
    this.binghu = new BingHu()
    this.brush = new Brush()
    this.image = new Image()
    this.people = new People()
    this.peopleImg1 = new Image()
    this.peopleImg2 = new Image()
    this.brushImage = new Image()
    this.meter = new Image()
    this.finalAD = new Image()
    this.fetchData()

    this.image.src = this.$domain + '/static/images/binghu.png'
    this.brushImage.src = this.$domain + '/static/images/brush.png'
    this.peopleImg1.src = this.$domain + '/static/images/people2.jpg'
    this.peopleImg2.src = this.$domain + '/static/images/people.jpg'
    this.meter.src = this.$domain + '/static/images/newMeter.jpg'
    this.finalAD.src = this.$domain + '/static/images/bg-ad.png'
    // this.createAudio()
  },

  methods: {
    // 获取用户信息和排行榜数据
    fetchData () {
      axios.post('/Index/SystemStatue')
        .then((result) => {
          // console.log(res)
          // let res = JSON.stringify(result)
          let res = result.data
          if (res.Code === 1) {
            let data = res.Data
            this.globalId = data.EliteId
            this.baseinfo = {
              points: data.GetedIntegral || 0,
              hasGetPoint: !!data.UserStatue
            }
            this.rankData = data.RankingList
          } else {
            return Promise.reject(res)
          }
        })
        .catch((error) => {
          console.log(error)
          // this.msgText = error.msg || '未知错误'
          // this.msgTip = true
        })
      console.log('fetching data...')
    },
    // 保存分数前先获取随机数密文传输
    getKeys (distance) {
      return axios.post('/index/getcode')
        .then((result) => {
          let res = result.data
          // console.log(result)
          this.randomCode = md5('WBLxinchun' + res + distance)
        })
        .catch((error) => {
          console.log(error)
        })
      // console.log(md5('message'))
    },
    // 上传成绩距离 todo: 如果不能获得积分的原因有两个，1 距离不到，2 今天已获得，需要返回失败类型
    StoreScore (distance) {
      let fn = () => {
        let data = Qs.stringify({Distance: distance, sign: this.randomCode})
        axios.post('/Index/SaveScore', data, {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
        .then((result) => {
          let res = result.data
          if (res.Code === 2) {
            alert(res.msg)
          }
        })
        .catch((err) => { console.log(err) })
      }
      this.getKeys(distance)
        .then(() => {
          fn()
        })
        .catch((error) => {
          console.log(error)
          fn()
        })
    },
    pushScore (distance) {
      let fn = () => {
        let data = Qs.stringify({Distance: distance, sign: this.randomCode})
        axios.post('/Index/SaveUserInfo', data, {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
          .then((result) => {
            let res = result.data
            // let res = JSON.stringify(result)
            if (res.Code === 1) {
              let data = res.Data
              let success = data.Statue
              if (!success) {
                return Promise.reject(new Error({msg: data.Msg}))
              }
              // 如果今天已获取积分
              if (this.baseinfo.hasGetPoint || !data.IsGetIntegral) {
                this.points = 0
                this.baseinfo.points = data.GetedIntegral || 0
                this.showTotalPoints = true
              } else {
                // 能获得积分，打开获得积分页GetedIntegral
                this.points = data.GetedIntegral
                this.showResult = false
                this.showPoints = true
                this.addScore(data.activityid, data.UserId, this.points)
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
            this.reStart()
          })
      }
      this.getKeys(distance)
        .then(() => {
          fn()
        })
        .catch((error) => {
          console.log(error)
          fn()
        })
    },
    // 增加积分接口，jsonp
    addScore (activityId, UserId, score) {
      window.callbackFn = (data) => {
        let res = JSON.stringify(data)
        if (res.status === 'fail') {
          this.msgText = '游戏积分保存失败'
          this.msgTip = true
        }
      }
      var script = document.createElement('script')
      script.src = `http://www.ecp-pm.com/gameInfo/savescore.dhtml?userId=${UserId}&score=${score}&activityId=${activityId}&call=callbackFn`
      document.body.appendChild(script)
    },
    // 关闭分数页
    closeShowPoint () {
      this.msgTip = false
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

    // 创建音频
    // createAudio () {
    //   for (let ele in myAudio) {
    //     myAudio[ele] = document.createElement('AUDIO')
    //     myAudio[ele].src = this.$domain + `/static/audio/${ele}.mp3`
    //     myAudio[ele].preload = true
    //     if (ele === 'brush') {
    //       // myAudio[ele].loop = true
    //     }
    //   }
    // },

    // 音量淡出
    getSoundAndFadeAudio (sound, delayTime = 0) {
      if (!sound) {
        return
      }
      clearInterval(fadeAudio)
      setTimeout(() => {
        let fadePoint = Math.round(sound.duration - delayTime)
        fadeAudio = setInterval(() => {
          if ((sound.currentTime >= fadePoint) && (sound.volume !== 0)) {
            sound.volume = Math.max(sound.volume - 0.1, 0)
          }
          if (sound.volume <= 0 || (sound.currentTime >= sound.duration)) {
            // sound.pause()
            clearInterval(fadeAudio)
          }
        }, 200)
      }, 100)
    },

    // score 计算
    // 最高点减去冰壶起点， 收敛到50 , this.ratio = (this.binghu.begin - this.topest) / 50
    render () {
      this.context.clearRect(this.boxX, this.boxY, this.Width, this.Height)
      this.rate = Math.round(this.speed * 10 / this.speedFactor) / 10
      this.drawBg()
      this.drawFinal()
      this.drawPeople()
      this.drawHero()
      this.drawBrush()
      this.context.save()
      this.context.restore()

      // this.score = (Math.abs(this.beginMove - this.topestDistance - this.bgWalk) / this.ratio).toFixed(1)
      this.judge()
    },

    // 单独实时计算score。 不要在request和监听里面
    computedScore () {
      this.computedScoreTimer = setTimeout(() => {
        this.score = (Math.abs(this.beginMove - this.topestDistance - this.bgWalk) / this.ratio).toFixed(3)
        this.computedScore()
      }, 250)
    },
    cancelComputedScore () {
      clearTimeout(this.computedScoreTimer)
    },

    shot (val) {
      if (this.status) {
        return
      }
      this.status = val
      this.binghu.stop = false
      this.fireTextTip('go')
    },

    // 画静态的两条线，不用放在render渲染进程里面
    drawStatic () {
      let ctx = this.contextStatic
      let outterLineWidth = 20
      let innerLineWidth = 10

      ctx.beginPath()
      ctx.strokeStyle = '#ccc'
      ctx.lineWidth = outterLineWidth

      ctx.moveTo(this.people.width + outterLineWidth / 2, 0)
      ctx.lineTo(this.people.width + outterLineWidth / 2, this.Height)

      ctx.moveTo(this.Width - this.people.width - outterLineWidth / 2, 0)
      ctx.lineTo(this.Width - this.people.width - outterLineWidth / 2, this.Height)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#eee'
      ctx.lineWidth = innerLineWidth
      ctx.moveTo(this.people.width + outterLineWidth + innerLineWidth / 2, 0)
      ctx.lineTo(this.people.width + outterLineWidth + innerLineWidth / 2, this.Height)

      ctx.moveTo(this.Width - this.people.width - outterLineWidth - innerLineWidth / 2, 0)
      ctx.lineTo(this.Width - this.people.width - outterLineWidth - innerLineWidth / 2, this.Height)
      ctx.stroke()
    },

    drawBrush () {
      let brush = this.brush
      brush.updateSelf()
      if (this.brush.show) {
        let ctx = this.context
        // 开始剪切x ,开始剪切y,被剪切宽度,被剪切高度,画布上x坐标,画布上y坐标,图像的宽度,图像的高度
        ctx.drawImage(this.brushImage, 0, 0, 146, 50, brush.posX - brush.width / 2, 300, brush.width, brush.height)
      }
    },

    // 画终点 画三个圆
    drawFinal () {
      let ctx = this.context
      if (this.binghu.stop) {
        this.topest = this.topest + this.rate
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
      ctx.arc(this.Width / 2, this.topest, 40, 0, 2 * Math.PI)
      ctx.stroke()

      ctx.beginPath()
      ctx.fillStyle = '#d63338'
      // ctx.lineWidth = 1
      ctx.arc(this.Width / 2, this.topest, 10, 0, 2 * Math.PI)
      ctx.fill()

      ctx.drawImage(this.finalAD, 0, 0, 296, 150, this.Width / 2 - 80, this.topest - 300, 160, 80)
    },

    // 画一堆观众
    drawPeople () {
      let ctx = this.context
      let people = this.people
      // 制造三张图一直循环
      people.posArr.forEach((e, index) => {
        if (this.binghu.stop) {
          e.y = e.y + this.rate
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
      // ctx.save()
      let binghu = this.binghu
      if (!this.binghu.stop) {
        this.binghu.posy = -this.rate + this.binghu.posy
        if (this.binghu.posy < this.beginMove) {
          this.binghu.stop = true
        }
      }
      if (this.status) {
        this.binghu.horSpeed = this.binghu.horSpeed + this.binghu.horAccSpeed
        this.binghu.horSpeed = this.binghu.horSpeed > 0.5 ? 0.5 : (this.binghu.horSpeed < -0.5 ? -0.5 : this.binghu.horSpeed)
        this.binghu.posx = this.binghu.posx + this.binghu.horSpeed
        let follow = this.binghu.getFollowerPos(this.binghu.horSpeed, this.rate)

        ctx.beginPath()
        ctx.moveTo(follow.x, follow.y)
        ctx.lineTo(follow.x1, follow.y1)
        ctx.lineTo(follow.x2, follow.y2)
        // ctx.closePath()
        ctx.fillStyle = '#d35155'
        ctx.fill()
      }
      // 开始剪切x ,开始剪切y,被剪切宽度,被剪切高度,画布上x坐标,画布上y坐标,图像的宽度,图像的高度
      ctx.drawImage(this.image, 0, 0, 162, 160, binghu.posx - binghu.R / 1.5, binghu.posy - binghu.R / 1.5, binghu.R * 2 / 1.5, binghu.R * 2 / 1.5)
      // ctx.restore()
    },

    drawBg () {
      if (this.binghu.stop) {
        this.bgWalk = Math.round((this.rate + this.bgWalk) * 10) / 10
      }
      let ctx = this.context
      // ctx.fillStyle = '#ccc'
      // cxt.fillRect(0, 0, this.Width, this.Height)

      // 直接画画不图片会卡死
      // 开始剪切x ,开始剪切y,被剪切宽度,被剪切高度,画布上x坐标,画布上y坐标,图像的宽度,图像的高度
      ctx.fillStyle = '#999'
      ctx.font = '12px sans-serif'
      ctx.fillText('2m', this.numX + 4, this.topestDistance + this.bgWalk + this.lineHeight * 2 - 20)
      ctx.drawImage(this.meter, 0, 0, 334, 1470, this.numX, this.topestDistance + this.bgWalk + this.lineHeight * 2, this.roadWidth * 2 - 42, this.roadImgHeight)
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
      let myAudio = this.myAudio
      this.status = 2
      this.cancelComputedScore()
      this.score = (Math.abs(this.beginMove - this.topestDistance - this.bgWalk) / this.ratio).toFixed(3)
      // 埋点
      if (window.zhuge) {
        window.zhuge.track('用户' + this.globalId + '完成了游戏')
      }
      if (this.score >= 5) {
        this.success = false
        this.showResult = true

        myAudio.fail.src = ''
        // this.playType = 'fail'
        setTimeout(() => {
          myAudio.brush.pause()
          myAudio.fail.src = this.$domain + '/static/audio/fail.mp3'
          myAudio.fail.play()
        }, 100)
      } else {
        if ((this.score - 0) === 0) {
          this.score = 0.001
        }
        this.success = true
        this.showResult = true

        myAudio.cheer.src = ''
        // this.playType = 'cheer'
        setTimeout(() => {
          myAudio.brush.pause()
          myAudio.cheer.src = this.$domain + '/static/audio/cheer.mp3'
          myAudio.cheer.volume = 1
          myAudio.cheer.play()
          this.getSoundAndFadeAudio(myAudio.cheer, 2)
        }, 100)
      }
      // 自动保存分数
      this.StoreScore(this.score)
    },
    reStart () {
      this.cancelComputedScore()
      this.hasBrush = 0
      this.speed = 0
      this.binghu.reset()
      this.status = 0
      this.bgWalk = 0
      this.topest = this.topestDistance
      this.$refs.powerLine.reset()
      cancelAnimationFrame && cancelAnimationFrame(this.renderTimer)
      this.run()
      this.computedScore()
    },
    // 检查状态, 为了解决ios问题
    // checkFinish () {
    //   let myAudio = this.myAudio
    //   if (this.status !== 2) {
    //     return
    //   }
    //   this.myAudio.brush.pause()
    //   if (this.success) {
    //     myAudio.cheer.src = ''
    //     setTimeout(() => {
    //       myAudio.cheer.src = '/static/audio/cheer.mp3'
    //       myAudio.cheer.volume = 1
    //       myAudio.cheer.play()
    //       this.getSoundAndFadeAudio(myAudio.cheer, 2)
    //     }, 100)
    //   } else {
    //     myAudio.cheer.src = ''
    //     setTimeout(() => {
    //       myAudio.cheer.src = '/static/audio/cheer.mp3'
    //       myAudio.cheer.volume = 1
    //       myAudio.cheer.play()
    //       this.getSoundAndFadeAudio(myAudio.cheer, 2)
    //     }, 100)
    //   }
    // },
    // 左右按钮点击事件
    handleDirect (dir) {
      let myAudio = this.myAudio
      if (this.status !== 1) {
        return
      }

      this.hasBrush === 5 && this.fireTextTip('moreSmooth')
      this.hasBrush <= 5 && this.hasBrush++

      this.$refs.powerLine.slowPowerDecrease()
      this.binghu.horAccSpeed = dir ? (dir === 'left' ? -0.05 : 0.05) : 0
      this.brush.addCount(dir)

      // 音频控制
      clearTimeout(brushTimer)
      if (!playing) {
        myAudio.brush.currentTime = 0.5
        myAudio.brush.play()
        playing = true
        brushTimer = setTimeout(() => {
          myAudio.brush.pause()
          playing = false
        }, 800)
        setTimeout(() => {
          playing = false
        }, 1200)
      }
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
        this.fetchData()
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
        this.showPoints = false
        this.reStart()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      let myAudio = this.myAudio
      this.Width = window.innerWidth                            // 屏幕宽度
      this.Height = Math.min(window.innerHeight, 667)           // 屏幕高度
      this.beginMove = 2 / 3 * this.Height                      // 开始滑动
      this.numX = Math.round((this.Width - this.roadWidth) / 2 - 28)              // 数字横坐标
      this.lineHeight = Math.round((this.beginMove - this.topestDistance) / 25)   // 跑道标尺2m长
      this.roadImgHeight = Math.round(this.beginMove - this.topestDistance - this.lineHeight * 6)   // 跑道图高

      this.ratio = (this.beginMove - this.topestDistance) / 50

      let str = '<canvas id="canvas" width=' + this.Width + '; height=' + this.Height + '>Sorry! you的浏览器不支持canvas</canvas>'
      let str2 = '<canvas id="canvasStatic" width=' + this.Width + '; height=' + this.Height + '>Sorry! you的浏览器不支持canvas</canvas>'
      document.getElementById('stage').innerHTML = str2 + str
      // 全局对象
      this.canvas = document.getElementById('canvas')
      this.context = this.canvas.getContext('2d')
      this.contextStatic = document.getElementById('canvasStatic').getContext('2d')

      if (window.devicePixelRatio) {
        this.canvas.style.width = this.Width + 'px'
        this.canvas.style.height = this.Height + 'px'
        this.canvas.height = this.Height * window.devicePixelRatio
        this.canvas.width = this.Width * window.devicePixelRatio
        this.context.scale(window.devicePixelRatio, window.devicePixelRatio)
      }

      this.run()
      this.drawStatic()
      this.computedScore()
      // let that = this
      // this.playType = 'cheer'
      myAudio.cheer.src = ''
      setTimeout(() => {
        myAudio.brush.pause()
        myAudio.cheer.src = this.$domain + '/static/audio/cheer.mp3'
        myAudio.cheer.volume = 1
        myAudio.cheer.play()
        this.getSoundAndFadeAudio(myAudio.cheer, 2)
      }, 20)
      // document.addEventListener('DOMContentLoaded', () => {
      //   that.audioAutoPlay = (target) => {
      //     document.getElementById('cheer').play()
      //     let failmusic = document.getElementById('fail')
      //     failmusic.play()
      //     setTimeout(() => {
      //       failmusic.pause()
      //     }, 10)
      //     document.addEventListener('WeixinJSBridgeReady', () => {
      //       document.getElementById('cheer').play()
      //       let failmusic = document.getElementById('fail')
      //       failmusic.play()
      //       setTimeout(() => {
      //         failmusic.pause()
      //       }, 10)
      //     }, false)
      //   }
      //   that.audioAutoPlay()
      // })
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
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      #canvasStatic {
        // z-index: 99;
      }
    }
    .score-panel {
      width: 10.2rem;
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
        // height: 8.25rem;
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
          width: 10.2rem;
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
      background-image:url('/binghutiaozhan/static/images/btn-bg.png');
      background-size: 100% 100%;
      width: 80%;
      margin-top: 1rem;
      height: 4rem;
      line-height: 4rem;
      padding: 0;
    }
    .results-img-btn {
      display: inline-block;
      width: 80%;
      margin-top: 1rem;
      height: 4rem;
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
      top: 45%;
      transform: translateY(-50%);
    }
  }
</style>
