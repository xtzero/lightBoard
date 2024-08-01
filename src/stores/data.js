import { ref, computed, onMounted, watch, h } from 'vue'
import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', () => {
  const text = ref('请文明使用弹幕，点击右上角按钮显示菜单')
  const textColor = ref('#fff')
  const backgroundColor = ref('#191919')
  const colorOptions = ref([
    {
      value: '#191919',
      text: '黑黢黢'
    },
    {
      value: '#fff',
      text: '白不呲咧'
    },
    {
      value: '#00ff00',
      text: '原谅绿'
    },
    {
      value: '#ffff00',
      text: '好金好金的黄',
    },
    {
      value: '#0600fa',
      text: '你蓝屏了'
    },
    {
      value: 'rgb(197, 91, 1)',
      text: '勾史'
    },
    {
      value: 'rgb(255,0,255)',
      text: '耀眼粉'
    },
    {
      value: '#eb0d21',
      text: '范特红'
    },
    {
      value: '#ed8554',
      text: '小埋黄'
    },
    {
      value: '#009092',
      text: '没什么食欲的蓝'
    },
    {
      value: '#ff2d5b',
      text: '挺嫩的粉'
    },
    {
      value: '#8e008e',
      text: '小黑紫'
    },
    {
      value: '#00ffff',
      text: '天蓝'
    },
    
  ])
  const textFontSize = ref(48)
  const speed = ref(1)
  const isFly = ref(true)
  const isTextFlash = ref(false)
  const isBgFlash = ref(false)
  const textFlashSpeed = ref(5)

  const calcFontSize = () => {
    return document.body.clientWidth / text.value.length
  }

  const visitCount = ref(0)

  watch(text, v => {
    textFontSize.value = calcFontSize()
  }, { immediate: true })

  const displayTextColor = computed(() => {
    const findColorLabel = colorOptions.value.find(v => v.value === textColor.value)
    return findColorLabel && findColorLabel.text ? findColorLabel.text : (textColor.value ? textColor.value : '点此选择颜色')
  })
  const displayBackgroundColor = computed(() => {
    const findColorLabel = colorOptions.value.find(v => v.value === backgroundColor.value)
    return findColorLabel && findColorLabel.text ? findColorLabel.text : (backgroundColor.value ? backgroundColor.value : '点此选择颜色')
  })
  const textFontSizePx = computed(() => `${textFontSize.value}px`)
  const animationTime = computed(() => `${100 / speed.value}s`)
  const intervalTime = computed(() => 1000 / textFlashSpeed.value)

  // 预设
  const _settings = ref([])

  const settings = computed({
    set(v) {
      console.log('settings.set')
      localStorage.setItem('lightboard_settings', JSON.stringify(v))
      _settings.value = v
    },
    get() {
      console.log('settings.get')
      if (_settings.value.length === 0) {
        const getFromStorage = localStorage.getItem('lightboard_settings')
        if (getFromStorage == '[]') {
          return []
        }
        if (getFromStorage) {
          _settings.value = JSON.parse(getFromStorage)
        }
      }
      return _settings.value
    }
  })
  const addSetting = name => {
    settings.value = [
      ...settings.value,
      {
        name,
        text: text.value,
        textFontSize: textFontSize.value,
        isFly: isFly.value,
        isTextFlash: isTextFlash.value,
        isBgFlash: isBgFlash.value,
        speed: speed.value,
        textFlashSpeed: textFlashSpeed.value,
        textColor: textColor.value,
        backgroundColor: backgroundColor.value,
      }
    ]
  }
  const deleteSetting = index => {
    const copy = JSON.parse(JSON.stringify(_settings.value))
    copy.splice(index, 1)
    settings.value = copy
  }

  const settingPreviewText = computed(() => {
    return getSettingPreviewText({
      isFly: isFly.value,
      isTextFlash: isTextFlash.value,
      isBgFlash: isBgFlash.value,
      text: text.value,
      textFontSize: textFontSize.value,
      speed: speed.value,
      textFlashSpeed: textFlashSpeed.value,
      textColor: textColor.value,
      backgroundColor: backgroundColor.value,
    })
  })

  const getSettingPreviewText = v => {
    const behaviorText = [
      v.isFly ? '飞行' : null,
      v.isTextFlash ? '文字闪烁' : null,
      v.isBgFlash ? '背景闪烁' : null
    ].filter(v => v !== null).join(',')

    let textArr = [
      `文本内容：${v.text}`,
      `字体大小：${v.textFontSize}`,
      `行为：${behaviorText}`,
      `文本速度：${v.speed}`,
      `闪烁速度：${v.textFlashSpeed}`,
      `文本颜色：${v.textColor}`,
      `背景颜色：${v.backgroundColor}`,
    ]
    let keywordsArr = [
      `${v.text}`,
      `${v.textFontSize}`,
      `${behaviorText}`,
      `${v.speed}`,
      `${v.textFlashSpeed}`,
      `${v.textColor}`,
      `${v.backgroundColor}`,
    ]
    if (v.name) {
      textArr.unshift(`预设名称：${v.name}`)
      keywordsArr.unshift(`${v.name}`)
    }
    return {
      text: textArr.join("，"),
      keywords: keywordsArr
    }
  }

  const applySetting = index => {
    text.value = _settings.value[index].text
    textFontSize.value = _settings.value[index].textFontSize
    isFly.value = _settings.value[index].isFly
    isTextFlash.value = _settings.value[index].isTextFlash
    isBgFlash.value = _settings.value[index].isBgFlash
    speed.value = _settings.value[index].speed
    textFlashSpeed.value = _settings.value[index].textFlashSpeed
    textColor.value = _settings.value[index].textColor
    backgroundColor.value = _settings.value[index].backgroundColor
  }

  onMounted(() => {
    handleSetinterval()
  })

  let interval = null
  const handleSetinterval = () => {
    if (interval !== null) {
      console.log('清除了')
      clearInterval(interval)
    }

    interval = setInterval(() => {
      if (isTextFlash.value === true) {
        const findTextColorIndex = colorOptions.value.findIndex(v => v.value === textColor.value)
        if (findTextColorIndex === -1) {
          textColor.value = colorOptions.value[0].value
        } else {
          const nextIndex = findTextColorIndex === colorOptions.value.length - 1 ? 0 : findTextColorIndex + 1
          textColor.value = colorOptions.value[nextIndex].value
        }
      }
      if (isBgFlash.value === true) {
        const findBgColorIndex = colorOptions.value.findIndex(v => v.value === backgroundColor.value)
        if (findBgColorIndex === -1) {
          backgroundColor.value = colorOptions.value[0].value
        } else {
          const nextIndex = findBgColorIndex === colorOptions.value.length - 1 ? 0 : findBgColorIndex + 1
          backgroundColor.value = colorOptions.value[nextIndex].value
        }
      }
    }, intervalTime.value)
    console.log(`intervalTime: ${intervalTime.value}`)
  }

  watch(isTextFlash, v => handleSetinterval())
  watch(isBgFlash, v => handleSetinterval())
  watch(textFlashSpeed, v => handleSetinterval())

  const showHelp = () => {
    return showDialog({
        title: '欢迎使用显眼包应援灯牌',
        messageAlign: 'left',
        allowHtml: true,
        message: h('div', {}, [
            h('div', {}, "这是一个用来在演唱会上当显眼包的灯牌"),
            h('div', {}, " "),
            h('div', {}, "记得横屏使用。希望你闪得开心。\n右上角是菜单键，什么都能设置。"),
            h('div', {}, " "),
            h('a', {style: 'margin-top: 20px;', href: 'https://thebestxt.cc/pages/about.html', target: '_blank'}, "是 xt 做的"),
            h('div', {}, "因为他这周要去看 Vae 的演唱会了。"),
        ]),
    }).then(() => {
      localStorage.setItem('welcome_finish', 1)
    })
  }

  const exportSetting = index => {
    // console.log(JSON.stringify(settings.value[index]))
    return btoa(encodeURIComponent(JSON.stringify(settings.value[index])))
  }

  const decodeSetting = v => JSON.parse(decodeURIComponent(atob(v)))
  const importSetting = v => {
    settings.value = [
      ...settings.value,
      {
        ...v
      }
    ]
  }

  return {
    // ref
    text,
    textColor,
    backgroundColor,
    colorOptions,
    textFontSize,
    speed,
    isFly,
    isTextFlash,
    isBgFlash,
    textFlashSpeed,
    visitCount,
    _settings,

    // methods
    calcFontSize,
    addSetting,
    deleteSetting,
    showHelp,
    applySetting,
    exportSetting,
    importSetting,
    getSettingPreviewText,
    decodeSetting,

    // computed
    displayTextColor,
    displayBackgroundColor,
    textFontSizePx,
    animationTime,
    intervalTime,
    settings,
    settingPreviewText
  }
})
