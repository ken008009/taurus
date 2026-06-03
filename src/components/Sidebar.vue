<template>
  <Teleport to="body">
    <div v-if="visible" class="sidebar-overlay" @click="handleOverlayClick">
      <div class="sidebar" @click.stop>
        <!-- 关闭按钮 -->
        <button class="close-btn" @click="close">×</button>

        <!-- Logo -->
        <div class="sidebar-logo">
          <img src="/asstes/logo.png" alt="Logo" class="logo-img" />
        </div>

        <!-- 用户地址（点击地址复制当前链接跟地址 -->
        <div class="user-address" @click="handleCopyAddress">
          <div class="address-value">{{ userAddress }}</div>
        </div>

        <!-- 菜单项 -->
        <nav class="sidebar-nav">
          <div
            v-for="item in menuItems"
            :key="item.path"
            class="nav-item"
            :class="{ active: isActive(item.path) }"
            @click="handleNavClick(item)"
          >
            {{ $t(item.name) }}
          </div>
        </nav>

      </div>
    </div>

    <Modal
      :visible="showModal"
      :message="modalMessage"
      :confirm-text="$t('common.confirm')"
      @close="showModal = false"
      @confirm="showModal = false"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import userPerson from '@/pinia/person'
import Modal from '@/components/Modal.vue'

const { t: $t } = useI18n()

interface MenuItem {
  path: string
  name: string
  external?: boolean
  externalUrl?: string
  disabled?: boolean
  disabledMessage?: string
  disabledMessageKey?: string
  noAction?: boolean
  downloadUrl?: string
}

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  languageClick: []
}>()

const router = useRouter()
const route = useRoute()
const person = userPerson()

const showModal = ref(false)
const modalMessage = ref('')

const menuItems: MenuItem[] = [
  { path: '/index', name: 'tab.home' },
  { path: '/node', name: 'tab.nodeSubscription' },
  { path: '/pledge', name: 'tab.pledgeMining' },
  { path: '/community', name: 'tab.myTeam' },
  { path: '/mine', name: 'tab.myAssets' },
  { path: '/international-payment', name: 'tab.internationalPayment', external: true, externalUrl: 'https://www.ispaychain.com/?code=0x0b57d116D292dBF4FFd9C979606D9D9EAea0e0a2' },
  { path: '/chain-games', name: 'tab.chainGames', downloadUrl: '/base.apk' },
  { path: '/chain-mall', name: 'tab.chainMall', downloadUrl: '/base.apk' },
  { path: '/taurus-chain', name: 'tab.taurusChain', disabled: true }
]

const address = computed(() => person.address)

const formatAddress = (value: string) => {
  const frontSix = value.slice(0, 6)
  const backSix = value.slice(-6)
  const middle = '...'
  return frontSix + middle + backSix
}

const userAddress = computed(() => {
  return formatAddress(address.value || '0x0000000000000000000000000000000000000000')
})

const isActive = (path: string) => {
  return route.path === path
}

const close = () => {
  emit('close')
}

const handleOverlayClick = () => {
  close()
}

const handleNavClick = (item: MenuItem) => {
  if (item.noAction) {
    return
  }
  if (item.downloadUrl) {
    const link = document.createElement('a')
    link.href = item.downloadUrl
    link.download = 'base.apk'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    close()
    return
  }
  if (item.disabled) {
    modalMessage.value = item.disabledMessageKey ? $t(item.disabledMessageKey) : (item.disabledMessage || $t('common.comingSoon'))
    showModal.value = true
    return
  }
  if (item.external && item.externalUrl) {
    window.open(item.externalUrl, '_blank')
  } else {
    if (route.path !== item.path) {
      router.push(item.path)
    }
  }
  close()
}

const handleCopyAddress = async () => {
  const currentUrl = window.location.href
  const copyText = `${currentUrl}?ref=${userAddress.value}`

  try {
    await navigator.clipboard.writeText(copyText)
    // 可以添加复制成功的提示
    console.log('复制成功:', copyText)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s ease;
}

.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100vw;
  background: #000;
  animation: slideInLeft 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.close-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
}

.sidebar-logo {
  margin-top: 60px;
  margin-bottom: 20px;

  .logo-img {
    width: 120px;
    height: auto;
  }
}

.user-address {
  padding: 10px 32px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  text-align: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(212, 175, 55, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }

  .address-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 8px;
  }

  .address-value {
    font-size: 16px;
    font-weight: 500;
    color: rgba(236, 208, 165, 1);
    margin-bottom: 6px;
    word-break: break-all;
  }

  .copy-hint {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 300px;
}

.nav-item {
  width: 100%;
  padding: 12px 32px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  color: #fff;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background: rgba(212, 175, 55, 0.2);
    border-color: $brand-gold;
    color: $brand-gold;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
