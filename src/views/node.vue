<template>
  <div class="node-page">
    <Header />

    <div class="content">
      <div class="page-header">
        <h1 class="page-title">{{ $t('node.pageTitle') }}</h1>
        <p class="page-subtitle">{{ $t('node.pageSubtitle') }}</p>
      </div>

      <div class="node-tiers">
        <div
          v-for="tier in nodeTiers"
          :key="tier.price"
          class="tier-card"
          :class="{ active: selectedTier === tier.price }"
          @click="selectTier(tier.price)"
        >
          <div class="tier-header">
            <div class="tier-price">{{ tier.price }}</div>
            <div class="tier-unit">USDT</div>
          </div>
          <div class="tier-divider"></div>
          <div class="tier-info">
            <div class="info-label">{{ $t('node.subscribed') }}</div>
            <div class="info-value">{{ tier.subscribed }}</div>
          </div>
          <div class="tier-status" :class="tier.status">
            {{ getStatusText(tier.status) }}
          </div>
        </div>
      </div>

      <div class="action-section">
        <button class="subscribe-btn" :disabled="!selectedTier" @click="handleSubscribe">
          {{ $t('node.subscribeNow') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Header from '@/components/Header.vue'

const { t: $t } = useI18n()

interface NodeTier {
  price: number
  subscribed: number
  status: 'available' | 'full' | 'coming'
}

const selectedTier = ref<number | null>(null)

const nodeTiers: NodeTier[] = [
  { price: 200, subscribed: 10, status: 'available' },
  { price: 500, subscribed: 0, status: 'coming' },
  { price: 1000, subscribed: 50, status: 'available' },
  { price: 3000, subscribed: 50, status: 'available' }
]

const selectTier = (price: number) => {
  if (price === 500) return // 500档位未开放
  selectedTier.value = price
}

const getStatusText = (status: NodeTier['status']) => {
  const statusMap: Record<NodeTier['status'], string> = {
    available: $t('node.statusAvailable'),
    full: $t('node.statusFull'),
    coming: $t('node.statusComing')
  }
  return statusMap[status]
}

const handleSubscribe = () => {
  if (!selectedTier.value) return
  // TODO: 实现认购逻辑
  console.log('认购档位:', selectedTier.value)
}
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.node-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
}

.content {
  padding: 100px 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;

  .page-title {
    font-size: 32px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 12px;
    background: linear-gradient(135deg, rgba(236, 208, 165, 0.8) 0%, #FFFFFF 50%, rgba(236, 208, 165, 0.8) 100%);
    background-size: 200% 100%;
    animation: gradient-move 5s linear infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-subtitle {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.6);
  }
}

.node-tiers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.tier-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px 24px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(212, 175, 55, 0.3);
    transform: translateY(-4px);
  }

  &.active {
    background: rgba(212, 175, 55, 0.1);
    border-color: $brand-gold;
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
  }

  .tier-header {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 16px;

    .tier-price {
      font-size: 28px;
      font-weight: bold;
      color: $brand-gold;
      line-height: 1;
    }

    .tier-unit {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .tier-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin-bottom: 16px;
  }

  .tier-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .info-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }

    .info-value {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
    }
  }

  .tier-status {
    position: absolute;
    top: 16px;
    right: 16px;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;

    &.available {
      background: rgba(212, 175, 55, 0.2);
      color: $brand-gold;
    }

    &.full {
      background: rgba(255, 59, 59, 0.2);
      color: #ff3b3b;
    }

    &.coming {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.6);
    }
  }
}

.action-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;

  .subscribe-btn {
    padding: 16px 48px;
    background: linear-gradient(135deg, $brand-gold 0%, #d4a837 100%);
    color: #000;
    border: none;
    border-radius: 32px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

@keyframes gradient-move {
  0% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
</style>
