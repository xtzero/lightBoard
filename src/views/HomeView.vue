<script setup>
import { closeDialog, showDialog } from 'vant'
import { h, onMounted, ref } from 'vue'
import Dropdown from '@/components/Dropdown.vue'
import Bullet from '@/components/Bullet.vue'

import { useDataStore } from '@/stores/data'
const dataStore = useDataStore()

onMounted(() => {
    // watchResize()
    showWelcome()
})

const showWelcome = () => {
    const welcomed = localStorage.getItem('welcome_finish')
    if (!welcomed) {
        showDialog({
            title: '欢迎使用 xtLightBoard',
            allowHtml: true,
            message: h('div', {}, [
                h('div', {}, "右上角是菜单键，什么都能设置。\n iOS 横屏方法：把地址复制到 safari 中打开，点分享按钮，点「添加到主屏幕」，回到桌面打开。 \n记得横屏使用。希望你闪得开心。"),
                h('div', {}, " "),
                h('a', {style: 'margin-top: 20px;', href: 'https://thebestxt.cc/pages/about.html', target: '_blank'}, "https://thebestxt.cc"),
            ]),
        }).then(() => {
            localStorage.setItem('welcome_finish', 1)
        })
    }
}

const showMenu = ref(false)
const toggleMenuShow = v => {
    dataStore.visitCount = Number(document.getElementById('busuanzi_value_site_pv').innerHTML)
    showMenu.value = v
}
</script>

<template>
    <div class="home-container">
        <van-icon class="menu-btn" color="#fff" name="circle" size="40" @click="toggleMenuShow(!showMenu)" />
        <Dropdown v-model="showMenu"></Dropdown>
        <Bullet class="bullet"></Bullet>
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