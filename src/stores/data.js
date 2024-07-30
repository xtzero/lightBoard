import { ref, computed, onMounted, watch, watchEffect } from 'vue'
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
      text: '纯绿'
    },
    {
      value: '#efbc11',
      text: '超级赛亚金',
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
      value: '#6166bc',
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

    // methods
    calcFontSize,

    // computed
    displayTextColor,
    displayBackgroundColor,
    textFontSizePx,
    animationTime,
    intervalTime
  }
})
