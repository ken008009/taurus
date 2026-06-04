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
        >
          <div class="tier-header">
            <div class="tier-price">{{ tier.price }}</div>
            <div class="tier-unit">USDT</div>
          </div>
          <button class="subscribe-btn" @click="handleSubscribe(tier.price)" :disabled="isSubscribed(tier.price)">
            {{ $t('node.subscribeNow') }}
          </button>
        </div>
      </div>

      <div class="record-section">
        <div class="section-title-wrap">
          <div class="title-bar"></div>
          <h3 class="section-title">{{ $t('node.orderList') }}</h3>
        </div>

        <div class="table-card">
          <div class="table-header">
            <span>{{ $t('node.amount') }}</span>
            <!-- <span>{{ $t('node.status') }}</span> -->
            <span>{{ $t('node.time') }}</span>
          </div>
          <div class="order-list" v-for="(item, index) in orderList" :key="index">
            <div class="table-row">
              <span>{{ item.amount }}</span>
              <!-- <span>{{ $t('node.subscribed') }}</span> -->
              <span>{{ item.createdAt }}</span>
            </div>
          </div>
          <div class="empty-state" v-if="orderList.length === 0">
            <p>{{ $t('common.noData') }}</p>
          </div>
          <div class="pagination-wrapper" v-if="orderList.length > 0">
            <Pagination
              v-model="allPage"
              :page-count="allPageCount"
              mode="simple"
              @change="getOrderList"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Header from '@/components/Header.vue'
import request from '@/tools/request'
import { Contract, ETH } from '@/tools/contract'
import { showSuccessToast, showFailToast, showLoadingToast, closeToast } from 'vant'
import { Pagination } from 'vant'
import userPerson from '@/pinia/person'
import lang from '@/i18n/index'

const BUY = new Contract(import.meta.env.VITE_BUY, "BUY")
const USDT = new Contract(import.meta.env.VITE_USDT, "ERC20")

const { t: $t } = useI18n()
const person = userPerson()
const sign = $computed(() => person.sign)

interface NodeTier {
  price: number
  subscribed: number
}

const selectedTier = ref<number | null>(null)
const orderList = ref<any[]>([])
const allPage = ref(1)
const allPageCount = ref(1)
const usdtApproved = ref(false)

const nodeTiers: NodeTier[] = [
  { price: 500, subscribed: 0 },
  { price: 1000, subscribed: 50},
  { price: 3000, subscribed: 50}
]

const selectTier = (price: number) => {
  if (price === 500) return // 500档位未开放
  selectedTier.value = price
}

const isSubscribed = (amount: number) => {
  return orderList.value.some(order => Number(order.amount) === amount)
}

const getOrderList = async (page: number = 1) => {
  await request.get("app_server/order_list", {
    params: {
      page
    }
  }).then((res: any) => {
    allPageCount.value = Math.ceil(res.count / 10);
    orderList.value = res.list
  })
}

const getStatusText = (status: string) => {
  if (status === '1') return $t('node.statusEarning')
  if (status === '2') return $t('node.statusCompleted')
  return $t('node.statusPending')
}

/* 获取授权 */
const getUsdtApproved = async () => {
  let res = await USDT.call("allowance", [ETH.account, BUY.address]);
  console.log('getUsdtApproved', Number(res))
  usdtApproved.value = Number(res) > 0;
  closeToast()
  return usdtApproved.value
}

const usdtApprove = async () => {
  showLoadingToast({
    message: lang('common.authorizing'), duration: 0, overlay: true, overlayStyle: {
      background: "transparent"
    }
  });
  await USDT.send("approve", [
    BUY.address,
    "115792089237316195423570985008687907853269984665640564039457584007913129639935"
  ]).then(getUsdtApproved).catch(() => closeToast());
}

const handleSubscribe = async (amount: number) => {
  // 先检查授权状态
  if (!usdtApproved.value) {
    await usdtApprove()
    // 授权成功后再执行购买
    if (!usdtApproved.value) {
      return // 授权失败，不继续执行
    }
  }

  BUY.send("buy", [amount]).then(() => {
    console.log('认购成功')
    showSuccessToast($t('node.subscribeSuccess'))
    // 延迟刷新订单列表，等待后端处理完成
    setTimeout(() => {
      getOrderList(allPage.value)
    }, 3000)
  }).catch((error: any) => {
    console.log(error)
    // 检查是否是余额不足错误
    if (error && error.message && error.message.includes('balance')) {
      showFailToast($t('common.insufficientBalance'))
    } else {
      showFailToast($t('node.subscribeFailed'))
    }
  })
}

onMounted(() => {
  getOrderList()
  getUsdtApproved()
})
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.node-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
}

.content {
  padding: 90px 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 20px;

  .page-title {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 8px;
  }

  .page-subtitle {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
  }
}

.node-tiers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.record-section {
  margin-top: 20px;

  .section-title-wrap {
    position: relative;
    margin-bottom: 10px;
    margin-left: 10px;
    display: flex;
    align-items: center;

    .title-bar {
      position: absolute;
      left: -10px;
      top: 50%;
      width: 4px;
      height: 16px;
      border-radius: 2px;
      background: linear-gradient(180deg, #D4AF37 0%, #B8941F 100%);
      transform: translateY(-50%);
    }

    .section-title {
      margin: 0 0 0 8px;
      font-size: 16px;
      font-weight: bold;
      color: #fff;
    }
  }
}

.table-card {
  margin-top: 10px;
  min-height: 300px;
  overflow: hidden;
  border: 1px solid $border-color;
  border-radius: 11px;
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(10px);
  padding: 11px 0;

  .table-header {
    display: flex;
    align-items: center;
    background: #0A0A0A;
    padding: 8px 0;
    margin: -11px 0 0;

    span {
      flex: 1;
      text-align: center;
      font-size: 10px;
      color: $text-muted;
    }
  }

  .order-list {
    .table-row {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid $border-light;

      &:last-child {
        border-bottom: none;
      }

      span {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: $text-primary;
      }
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 250px;

    p {
      margin-top: 8px;
      font-size: 12px;
      color: $text-muted;
    }
  }

  .pagination-wrapper {
    padding: 16px 0;
    display: flex;
    justify-content: center;
  }
}

.tier-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;

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
    gap: 6px;
    
    .tier-price {
      font-size: 22px;
      font-weight: 500;
      color: $brand-gold;
      line-height: 1;
    }

    .tier-unit {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .subscribe-btn {
    padding: 8px 20px;
    background: $gradient-gold;
    color: $text-inverse;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, $brand-gold-light 0%, $brand-gold 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.5);
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
      font-weight: 500;
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
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.5);
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
