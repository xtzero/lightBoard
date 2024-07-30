<script setup>
import { useDataStore } from '@/stores/data.js'
import { nextTick, ref } from 'vue'
const dataStore = useDataStore()

const show = defineModel({type: Boolean, default: false})

const handleReplay = () => {
    document.querySelector('#textspan').classList.remove('textspan')
    setTimeout(() => {
        nextTick(() => {
            document.querySelector('#textspan').classList.add('textspan')
        })
    }, 1);
}
</script>
<template>
    <van-popup v-model:show="show" position="right" :overlay="false">
        <div class="dropdown-container">
            <van-icon @click="show = false" class="close-btn" name="cross" size="40" />
            <div class="form">
                <van-cell-group inset>
                    <van-field
                        label="文本"
                        v-model="dataStore.text"
                        type="textarea"
                        maxlength="50"
                        placeholder="输入内容，最多 50 个字，开闪！"
                        show-word-limit
                        autosize
                        label-align="top">
                    </van-field>
                    <van-field label="字体大小" label-align="top">
                        <template #input>
                            <van-slider v-model="dataStore.textFontSize" :min="20" :max="500" />
                        </template>
                    </van-field>
                    <van-field label="行为" label-align="top">
                        <template #input>
                            <div class="behavior-container">
                                <van-checkbox class="behavior-item" v-model="dataStore.isFly">飞行</van-checkbox>
                                <van-checkbox class="behavior-item" v-model="dataStore.isTextFlash">文字闪烁</van-checkbox>
                                <van-checkbox class="behavior-item" v-model="dataStore.isBgFlash">背景闪烁</van-checkbox>
                            </div>
                        </template>
                    </van-field>
                    <van-field label="飞行速度" label-align="top">
                        <template #input>
                            <van-slider v-model="dataStore.speed" :min="1" :max="10" />
                        </template>
                    </van-field>
                    <van-field label="闪烁速度" label-align="top">
                        <template #input>
                            <van-slider v-model="dataStore.textFlashSpeed" :min="1" :max="10" />
                        </template>
                    </van-field>
                    <van-field name="radio" label="文本颜色" label-align="top">
                        <template #input>
                            <van-radio-group v-model="dataStore.textColor" direction="vertical" :disabled="dataStore.isTextFlash">
                                <van-radio
                                    v-for="(v, k) in dataStore.colorOptions"
                                    :key="k"
                                    :name="v.value"
                                    style="margin: 5px 0;">
                                    <span class="color-picker-label">
                                        <span class="color-picker-block" :style="{backgroundColor: v.value}"></span>
                                        <span class="color-picker-text">{{ v.text }}</span>
                                    </span>
                                </van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                    <van-field name="radio" label="背景颜色" label-align="top">
                        <template #input>
                            <van-radio-group v-model="dataStore.backgroundColor" direction="vertical" :disabled="dataStore.isBgFlash">
                                <van-radio
                                    v-for="(v, k) in dataStore.colorOptions"
                                    :key="k"
                                    :name="v.value"
                                    style="margin: 5px 0;">
                                    <span class="color-picker-label">
                                        <span class="color-picker-block" :style="{backgroundColor: v.value}"></span>
                                        <span class="color-picker-text">{{ v.text }}</span>
                                    </span>
                                </van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                    <van-field>
                        <template #input>
                            <van-button type="primary" size="small" @click="handleReplay">飞行复位</van-button>
                        </template>
                    </van-field>
                    <van-field>
                        <template #input>
                            <span>本站总访问量{{ dataStore.visitCount }}次</span>
                        </template>
                    </van-field>
                </van-cell-group>
            </div>
        </div>
    </van-popup>
</template>
<style lang="scss" scoped>
.dropdown-container {
    width: 40vw;
    height: 100vh;
    position: relative;

    .close-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        color: lightgray;
    }
    .form {
        position: absolute;
        top: 50px;

        .behavior-container {
            display: flex;
            flex-direction: column;

            .behavior-item {
                margin-bottom: 10px;
            }
        }

        .color-picker-label {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin: 5px 10px;

            .color-picker-block {
                width: 20px;
                height: 20px;
                display: inline-block;
                border: solid 1px #efeff5;
            }
            .color-picker-text {
                margin-left: 10px;
            }
        }
    }
}
</style>