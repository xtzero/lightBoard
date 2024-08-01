<script setup>
import { h, onMounted, ref, nextTick } from 'vue'
import Dropdown from '@/components/Dropdown.vue'
import Bullet from '@/components/Bullet.vue'

import { useDataStore } from '@/stores/data'
const dataStore = useDataStore()
import { driver } from 'driver.js'
import "driver.js/dist/driver.css"

onMounted(() => {
    // watchResize()
    showWelcome()
})

let driverObj = null
const showWelcome = () => {
    const welcomed = localStorage.getItem('welcome_finish')
    if (!welcomed) {
        dataStore.showHelp().then(() => showHomeGuide())
    } else {
        showHomeGuide()
    }
}

const showHomeGuide = () => {
    const shownHomeGuide = localStorage.getItem('home_guide')
    if (!shownHomeGuide) {
        driverObj = driver({
            showProgress: true,
            steps: [
                { element: '#aaaaa', popover: { title: '提示', description: '欢迎使用，屏幕中间是正在飞行的弹幕', side: 'top' } },
                { element: '#aaaaa', popover: { title: '全屏显示 - iOS', description: 'iOS 端复制当前页面链接到 safari 中打开，点击分享按钮，点击「添加到主屏幕」。然后回到桌面会发现有个新的图标，点开即可。', side: 'top' } },
                { element: '#aaaaa', popover: { title: '全屏显示 - Android', description: '随便找一个支持全屏显示的浏览器就好啦，我也不知道怎么办，因为我没有 Android 设备 (￣.￣)', side: 'top' } },
                { element: '#menu-btn', popover: { title: '提示', description: '点击这里显示配置项' } }
            ],
            nextBtnText: '下一步',
            prevBtnText: '上一步',
            doneBtnText: '知道了',
            onDestroyed(e) {
                localStorage.setItem('home_guide', 1)
            }
        })

        driverObj.drive()
    }
}
const showMenu = ref(false)

let popverDriver = null
const toggleMenuShow = v => {
    if (v === true) {
        if (driverObj !== null) {
            driverObj.destroy()
        }
    }
    dataStore.visitCount = Number(document.getElementById('busuanzi_value_site_pv').innerHTML)
    showMenu.value = v

    nextTick(() => {
        const shownPopoverGuide = localStorage.getItem('popover_guide')
        if (!shownPopoverGuide) {
            popverDriver = driver({
                showProgress: true,
                steps: [
                    { element: '.settings-field', popover: { title: '💁 预设', description: '可以通过预设功能来提前保存一些设置，或是和朋友分享你的设置。点击问号按钮查看更多。'} },
                    { element: '#save-setting', popover: { title: '🧚 预设', description: '点击这里可以保存预设，不光后面自己还能用，还可以分享给其他人。大家使用同样炫酷的灯牌，队形才整齐！' } },
                    { element: '#import-setting', popover: { title: '🧚 预设', description: '如果别人分享了预设给你，你可以复制对方发过来的预设代码，然后点击这里导入预设。' } },
                    { element: '.text-field', popover: { title: '弹幕内容 😈', description: '在这里输入弹幕内容，最多 50 个字，输入的过程中后面会实时显示' } },
                    { element: '.behavior-field', popover: { title: '🐦 行为', description: '「行为」越多，你的灯牌越炫酷！' } },
                    { element: '.flashspeed-field', popover: { title: '💥 闪烁速度', description: '拖动来改变背景的闪烁速度' } },
                    { element: '.text-color-field', popover: { title: '🔴 字体颜色', description: '预设的一些颜色，不够用的话后面我会往里加' } },
                    { element: '.statistic-field', popover: { title: '🎉 哇哦', description: '这么一个破玩意被这么多人用过了' } },
                    { element: '.aaaaa', popover: { title: '🎉 开始使用吧', description: '终于做完了，累死了。这周六就要去看许嵩了，嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿...' } },
                ],
                nextBtnText: '下一步',
                prevBtnText: '上一步',
                doneBtnText: '知道了',
                onDestroyed(e) {
                    localStorage.setItem('popover_guide', 1)
                }
            })

            popverDriver.drive()
        }
    })
}
</script>

<template>
    <div class="home-container">
        <van-icon id="menu-btn" class="menu-btn" color="#fff" name="circle" size="40" @click="toggleMenuShow(!showMenu)" />
        <Dropdown v-model="showMenu"></Dropdown>
        <Bullet id="bullet" class="bullet"></Bullet>
    </div>
</template>

<style lang="scss" scoped>
.home-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: v-bind('dataStore.backgroundColor');
    position: relative;

    .menu-btn {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 2000;
    }
    .bullet {
        // position: fixed;
        // top: 0;
        // left: 0;
        height: 100vh;
        line-height: 100vh;
    }
}
</style>