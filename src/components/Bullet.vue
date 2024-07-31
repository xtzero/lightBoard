<script setup>
import { useDataStore } from '../stores/data.js'
const dataStore = useDataStore()

</script>
<template>
    <div id="bullet-container" class="bullet-container">
        <span id="textspan" class="textspan">
            {{ Object.keys(Array(100).fill(1)).map(v => dataStore.text).join("\t") }}
        </span>
    </div>
</template>
<style lang="scss" scoped>
.bullet-container {
    color: v-bind('dataStore.textColor');

    @keyframes fly {
        from {
            left: 20%;
        }
        to {
            left: -1000%;
        }
    }

    .textspan {
        position: absolute;
        z-index: 1999;
        font-size: v-bind('dataStore.textFontSizePx');
        animation-name: fly;
        animation-duration: v-bind('dataStore.animationTime');
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        word-break: break-all;
    }
}
</style>