<template>
  <div class="tabbar">
    <div
      v-for="tab in tabs"
      :key="tab.path"
      class="tab-item"
      :class="{ active: isActive(tab.path) }"
      @click="handleTabClick(tab.path)"
    >
      <img :src="isActive(tab.path) ? tab.activeIcon : tab.icon" :alt="$t(tab.name)" />
      <span class="tab-label">{{ $t(tab.name) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

interface TabItem {
  path: string
  name: string
  icon: string
  activeIcon: string
}

const tabs: TabItem[] = [
  {
    path: '/index',
    name: 'tab.home',
    icon: '/assets/tabbar/home.svg',
    activeIcon: '/assets/tabbar/home-active.svg'
  },
  {
    path: '/pledge',
    name: 'tab.mining',
    icon: '/assets/tabbar/pledge.svg',
    activeIcon: '/assets/tabbar/pledge-active.svg'
  },
  {
    path: '/community',
    name: 'tab.community',
    icon: '/assets/tabbar/community.svg',
    activeIcon: '/assets/tabbar/community-active.svg'
  },
  {
    path: '/mine',
    name: 'tab.mine',
    icon: '/assets/tabbar/mine.svg',
    activeIcon: '/assets/tabbar/mine-active.svg'
  }
]

const route = useRoute()
const router = useRouter()

const isActive = (path: string) => {
  return route.path === path
}

const handleTabClick = (path: string) => {
  if (route.path !== path) {
    router.push(path)
  }
}
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.tabbar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 414px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: $bg-main;
  padding: $spacing-sm 0;
  z-index: 1000;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-xs;
    cursor: pointer;
    transition: all $transition-fast;
    padding: $spacing-xs $spacing-lg;

    img {
      width: 28px;
      height: 28px;
      object-fit: contain;
      transition: all $transition-fast;
    }

    .tab-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      transition: color $transition-fast;
    }

    &.active {
      .tab-label {
        color: $brand-gold;
        font-weight: 500;
      }
    }

    &:hover {
      .tab-label {
        color: $text-muted;
      }
    }
  }
}
</style>
