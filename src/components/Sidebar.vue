<template>
  <Teleport to="body">
    <div v-if="visible" class="sidebar-overlay" @click="handleOverlayClick">
      <div class="sidebar" @click.stop>
        <!-- 关闭按钮 -->
        <button class="close-btn" @click="close">×</button>

        <!-- Logo -->
        <div class="sidebar-logo">
          <img src="/assets/logo.png" alt="Logo" class="logo-img" />
        </div>

        <!-- 用户地址（点击地址复制当前链接跟地址 -->
        <div class="user-address" @click="handleCopyAddress">
          <div class="address-value">{{ userAddress }}</div>
        </div>

        <!-- 菜单项 -->
        <nav class="sidebar-nav">
          <div class="nav-item" :class="{ active: isActive('/') }" @click="router.push('/')">
            {{ $t('tab.home') }}
          </div>
          <div class="nav-item" :class="{ active: isActive('/recharge') }" @click="router.push('/recharge')">
            充值
          </div>
          <div class="nav-item" :class="{ active: isActive('/node') }" @click="router.push('/node')">
            {{ $t('tab.nodeSubscription') }}
          </div>
          <div class="nav-item" :class="{ active: isActive('/pledge') }" @click="router.push('/pledge')">
            {{ $t('tab.pledgeMining') }}
          </div>
          <div class="nav-item" :class="{ active: isActive('/community') }" @click="router.push('/community')">
            {{ $t('tab.myTeam') }}
          </div>
          <div class="nav-item" :class="{ active: isActive('/mine') }" @click="router.push('/mine')">
            {{ $t('tab.myAssets') }}
          </div>
          <div class="nav-item" @click="handleExternalLink">
            {{ $t('tab.internationalPayment') }}
          </div>
          <div class="nav-item" @click="showToast($t('common.comingSoon'))">
            {{ $t('tab.chainGames') }}
          </div>
          <div class="nav-item" @click="showToast($t('common.comingSoon'))">
            {{ $t('tab.chainMall') }}
          </div>
          <div class="nav-item" @click="showToast($t('common.comingSoon'))">
            {{ $t('tab.taurusChain') }}
          </div>
        </nav>

      </div>
    </div>

    <Modal
      :visible="showModal"
      :message="modalMessage"
      :confirm-text="$t('common.confirm')"
      @close="handleModalClose"
      @confirm="handleModalClose"
    />
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { showToast } from 'vant'
import userPerson from '@/pinia/person'
import Modal from '@/components/Modal.vue'

const router = useRouter()
const route = useRoute()
const person = userPerson()
const { t: $t } = useI18n()

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['close', 'languageClick'])

const showModal = ref(false)
const modalMessage = ref('')

const address = computed(() => person.address)

const formatAddress = (value) => {
  const frontSix = value.slice(0, 6)
  const backSix = value.slice(-6)
  return frontSix + '...' + backSix
}

const userAddress = computed(() => {
  return formatAddress(address.value || '0x0000000000000000000000000000000000000000')
})

const isActive = (path) => {
  return route.path === path
}

const close = () => {
  emit('close')
}

const handleOverlayClick = () => {
  close()
}

const handleDownload = () => {
  const link = document.createElement('a')
  link.href = '/base.apk'
  link.download = 'base.apk'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleExternalLink = () => {
  window.open('https://www.ispaychain.com/?code=0x0b57d116D292dBF4FFd9C979606D9D9EAea0e0a2', '_blank')
}

const handleComingSoon = () => {
  showModal.value = true
  modalMessage.value = $t('common.comingSoon')
}

const handleModalClose = () => {
  showModal.value = false
}

const handleCopyAddress = async () => {
  const currentUrl = window.location.href
  const copyText = `${currentUrl}?ref=${userAddress.value}`
  try {
    await navigator.clipboard.writeText(copyText)
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
  width: 260px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-item {
  padding: 12px 32px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  color: #f6f6f6;
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
