<script setup>
import { useDataStore } from '@/stores/data.js'
import { nextTick, ref, computed } from 'vue'
const dataStore = useDataStore()

const show = defineModel({type: Boolean, default: false})

const handleReplay = () => {
    document.querySelector('#textspan').classList.remove('textspan')
    setTimeout(() => {
        nextTick(() => {
            document.querySelector('#textspan').classList.add('textspan')
        })
    }, 1)
}

const handleSettingLabelClick = () => {
    showDialog({
        title: '特别厉害的预设功能',
        message: '点击下方的保存按钮，你可以把当前的全部设置保存为一个「预设」，保存后可以直接选用。\n\n例如你可以提前保存两个预设：\n1. 情绪稳定只缓慢滚动播放的应援口号\n2. 情绪极端的疯狂闪烁的「老公我想坐你腿上听！！！」\n\n然后等 talking 环节镜头照到你的时候一键更换为第二个预设，成为全场最大的显眼包。\n\n\n其实就是作者想这么干而已啦...',
        messageAlign: 'left'
    })
}

const setting = ref({
    showDialog: false,
    name: ''
})

const handleSaveSetting = () => {
    setting.value.showDialog = true
}

const handleCommitSaveSetting = () => {
    if (!setting.value.name) {
        showNotify({
            message: '请输入预设名字',
            type: 'danger'
        })
        // showToast({
        //     message: '',
        //     icon: 'warning',
        // })
        return
    }
    dataStore.addSetting(setting.value.name)
    setting.value.showDialog = false
    setting.value.name = ''
    showToast('保存成功')
}

const handleCancelSaveSetting = () => {
    setting.value.showDialog = false
    setting.value.name = ''
}

const handlleApplySetting = k => {
    showConfirmDialog({
        title: '应用预设',
        message: '会将你选择的预设应用到当前灯牌上，是否确认',
    }).then(() => {
        dataStore.applySetting(k)
        showToast('应用成功')
    })
}
const handlleDeleteSetting = k => {
    showConfirmDialog({
        title: '应用预设',
        message: '会删除你选择的预设，是否确认',
    }).then(() => {
        dataStore.deleteSetting(k)
        showToast('删除成功')
    })
}

const importSetting = ref({
    showDialog: false,
    mode: 'share', // import
    code: ''
})

const handleCancelImportSetting = () => {
    importSetting.value.showDialog = false
    importSetting.value.mode = ''
    importSetting.value.code = ''
}

const handleImportSetting = () => {
    importSetting.value.showDialog = true
    importSetting.value.mode = 'import'
    importSetting.value.code = ''
}
const handleShareSetting = index => {
    importSetting.value.showDialog = true
    importSetting.value.mode = 'share'
    importSetting.value.code = dataStore.exportSetting(index)
}

const shareSettingPreviewText = computed(() => {
    let keywords = []
    let text = ''

    if (importSetting.value.mode !== 'import') {
        return { keywords, text }
    }
    try {
        const obj = dataStore.decodeSetting(importSetting.value.code)
        return dataStore.getSettingPreviewText(obj)
    } catch (e) {
        return { keywords, text }
    }
})

const handleCopySettingCode = () => {
    navigator.clipboard.writeText(importSetting.value.code)
    showToast('或许复制成功了')
}

const handleCommitImportSetting = () => {
    dataStore.importSetting(dataStore.decodeSetting(importSetting.value.code))
    showToast('或许导入成功了')
    handleCancelImportSetting()
}

const handleResetNotice = () => {
    localStorage.removeItem('welcome_finish')
    localStorage.removeItem('home_guide')
    localStorage.removeItem('popover_guide')
    showDialog({
        title: '好了哦',
        message: '首页的弹窗和引导、设置页的引导都恢复了。刷新一下页面就都弹到你脸上啦。',
        messageAlign: 'left'
    })
}
</script>
<template>
    <van-popup v-model:show="show" position="right" closeable>
        <div class="dropdown-container">
            <!-- <van-icon @click="show = false" class="close-btn" name="cross" size="40" /> -->
            <div class="form">
                <van-cell-group inset>
                    <van-field id="settings" class="settings-field" label-align="top">
                        <template #label>
                            <span style="font-weight: 700;" @click="handleSettingLabelClick">预设 <van-icon name="question-o" /> </span>
                        </template>
                        <template #input>
                            <div class="settings">
                                <div class="func">
                                    <van-button id="save-setting" class="func-btn" type="primary" size="small" @click="handleSaveSetting">保存当前预设</van-button>
                                    <van-button id="import-setting" class="func-btn" type="success" size="small" @click="handleImportSetting">导入预设</van-button>
                                    <van-dialog v-model:show="setting.showDialog" title="保存预设" teleport="body">
                                        <van-cell-group inset>
                                            <van-field label="预设内容" label-align="top">
                                                <template #input>
                                                    <van-highlight :keywords="dataStore.settingPreviewText.keywords" :source-string="dataStore.settingPreviewText.text" />
                                                </template>
                                            </van-field>

                                            <van-field
                                                v-model="setting.name"
                                                label="预设名"
                                                :maxlength="8"
                                                show-word-limit
                                                label-align="top"
                                                placeholder="为预设起个名，给自己看的">
                                            </van-field>
                                        </van-cell-group>
                                        <template #footer>
                                            <div class="setting-footer">
                                                <van-button class="setting-footer-btn" @click="handleCancelSaveSetting">取消</van-button>
                                                <van-button class="setting-footer-btn" type="primary" @click="handleCommitSaveSetting">确认</van-button>
                                            </div>
                                        </template>
                                    </van-dialog>
                                </div>
                                <span v-show="dataStore.settings.length === 0" class="empty"><暂无预设></span>
                                <div class="settings-list">
                                    <van-cell v-for="(v, k) in dataStore.settings" :key="k">
                                        <template #title>
                                            {{ v.name }}
                                        </template>
                                        <template #right-icon>
                                            <van-button class="setting-list-item-btn" type="primary" size="small" @click="handlleApplySetting(k)">应用</van-button>
                                            <van-button class="setting-list-item-btn" type="success" size="small" @click="handleShareSetting(k)">分享</van-button>
                                            <van-button class="setting-list-item-btn" type="danger" size="small" @click="handlleDeleteSetting(k)">删除</van-button>
                                        </template>
                                    </van-cell>
                                </div>
                                <van-dialog v-model:show="importSetting.showDialog" :title="`${{share: '分享', import: '导入'}[importSetting.mode]}预设`" teleport="body">
                                    <van-cell-group inset>
                                        <van-field v-show="importSetting.mode === 'import'" label="导入预览" label-align="top">
                                            <template #input>
                                                <van-highlight :keywords="shareSettingPreviewText.keywords" :source-string="shareSettingPreviewText.text" />
                                            </template>
                                        </van-field>

                                        <van-field
                                            v-model="importSetting.code"
                                            label="预设分享码"
                                            label-align="top"
                                            type="textarea"
                                            border
                                            :rows="4"
                                            clearable
                                            placeholder="分享码一般不会为空">
                                        </van-field>
                                    </van-cell-group>
                                    <template #footer>
                                        <div class="setting-footer">
                                            <van-button class="setting-footer-btn" v-show="importSetting.mode === 'share'" @click="handleCancelImportSetting">关闭</van-button>
                                            <van-button class="setting-footer-btn" v-show="importSetting.mode === 'share'" type="success" @click="handleCopySettingCode">复制</van-button>

                                            <van-button class="setting-footer-btn" v-show="importSetting.mode !== 'share'" @click="handleCancelImportSetting">取消</van-button>
                                            <van-button class="setting-footer-btn" v-show="importSetting.mode !== 'share'" type="primary" @click="handleCommitImportSetting">确认</van-button>
                                        </div>
                                    </template>
                                </van-dialog>
                            </div>
                        </template>
                    </van-field>
                    <van-field>
                        <template #label>
                            <span style="font-weight: 700;">灯牌配置</span>
                        </template>
                        <template #input></template>>
                    </van-field>
                    <van-field
                        class="text-field"
                        label="文本内容"
                        v-model="dataStore.text"
                        type="textarea"
                        maxlength="50"
                        placeholder="输入内容，最多 50 个字，开闪！"
                        show-word-limit
                        autosize
                        label-align="top"
                        border
                        clear-trigger="always"
                        clearable>
                    </van-field>
                    <van-field label="字体大小" label-align="top" class="font-size-field">
                        <template #input>
                            <van-slider v-model="dataStore.textFontSize" :min="20" :max="500" />
                        </template>
                    </van-field>
                    <van-field label="行为" label-align="top" class="behavior-field">
                        <template #input>
                            <div class="behavior-container">
                                <van-checkbox class="behavior-item" v-model="dataStore.isFly">飞行</van-checkbox>
                                <van-checkbox class="behavior-item" v-model="dataStore.isTextFlash">文字闪烁</van-checkbox>
                                <van-checkbox class="behavior-item" v-model="dataStore.isBgFlash">背景闪烁</van-checkbox>
                            </div>
                        </template>
                    </van-field>
                    <van-field class="speed-field" label="飞行速度" label-align="top">
                        <template #input>
                            <van-slider v-model="dataStore.speed" :min="1" :max="10" />
                        </template>
                    </van-field>
                    <van-field class="flashspeed-field" label="闪烁速度" label-align="top">
                        <template #input>
                            <van-slider v-model="dataStore.textFlashSpeed" :min="1" :max="10" />
                        </template>
                    </van-field>
                    <van-field class="text-color-field" name="radio" label="文本颜色" label-align="top">
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
                    <van-field class="bg-color-field" name="radio" label="背景颜色" label-align="top">
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
                    <van-field label="一些没啥用的功能" label-align="top">
                        <template #input>
                            <van-button type="primary" size="small" @click="handleReplay">飞行复位</van-button>
                            <van-button style="margin-left: 10px;" type="primary" size="small" @click="handleResetNotice">重置提示信息</van-button>
                        </template>
                    </van-field>
                    <van-field class="statistic-field" label="统计和炫耀" label-align="top">
                        <template #input>
                            <van-tag type="primary">
                                这个平平无奇的灯牌总共被访问了 <van-rolling-text :start-num="0" :target-num="dataStore.visitCount" :duration="10" /> 次
                            </van-tag>
                        </template>
                    </van-field>
                </van-cell-group>
            </div>
        </div>
    </van-popup>
</template>
<style lang="scss" scoped>
.setting-footer {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;

    .setting-footer-btn {
        width: 50%;
    }
}
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
        width: 100%;

        .settings-field {
            margin-bottom: 60px;
        }

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
        .settings {
            width: 100%;
            .func {
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-bottom: 20px;

                .func-btn {
                    &:not(:last-of-type) {
                        margin-right: 10px;
                    }
                }
            }
            .settings-list {
                width: 50%;
                :deep(.van-cell__title) {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }

                .setting-list-item-btn {
                    &:not(:last-of-type) {
                        margin-right: 10px;
                    }
                }
            }
        }
    }
}
</style>