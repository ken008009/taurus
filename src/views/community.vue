<template>
  <div class="community-page">
    <Header />
    <div class="container">
      <div class="info-card">
        <div class="user-row">
          <span class="address-tag">0x2e24...c33e</span>
          <span>{{ $t('community.level') }}</span>
          <span class="level-text">F0</span>
        </div>

        <div class="stats-grid">
          <div class="stats-item">
            <span class="stats-num">0</span>
            <span class="stats-label">{{ $t('community.evangelists') }}</span>
          </div>
          <div class="stats-item">
            <span class="stats-num">0</span>
            <span class="stats-label">{{ $t('community.activeUsers') }}</span>
          </div>
          <div class="stats-item">
            <span class="stats-num">0</span>
            <span class="stats-label">{{ $t('community.communitySize') }}</span>
          </div>
          <div class="stats-item">
            <span class="stats-num">0.00 U</span>
            <span class="stats-label">{{ $t('community.totalIncome') }}</span>
          </div>
          <div class="stats-item">
            <span class="stats-num">0 U</span>
            <span class="stats-label">{{ $t('community.communityPerformance') }}</span>
          </div>
          <div class="stats-item">
            <span class="stats-num">0</span>
            <span class="stats-label">{{ $t('community.teamIdoTotal') }}</span>
          </div>
          <div class="stats-item">
            <span class="stats-num">0</span>
            <span class="stats-label">{{ $t('community.personalRedeemed') }}</span>
          </div>
          <div class="stats-item relative">
            <span class="stats-num">0</span>
            <span class="stats-label">{{ $t('community.teamRedeemed') }}</span>
          </div>
        </div>
      </div>

      <h3 class="list-title">{{ $t('community.evangelistList') }}</h3>

      <div class="table-card">
        <div class="table-header">
          <span>{{ $t('community.walletAddress') }}</span>
          <span>{{ $t('community.userLevel') }}</span>
          <span>{{ $t('community.personalPerformance') }}</span>
          <span>{{ $t('community.teamPerformance') }}</span>
        </div>
        <div class="empty-state">
          <p>{{ $t('common.noData') }}</p>
        </div>
      </div>

      <div class="safe-bottom"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.community-page {
  min-height: 100vh;
  padding-top: 64px;
}

.container {
  padding: 0 15px;
}

.info-card {
  margin-top: 25px;
  padding: 12px 15px 35px;
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid $border-color;
  border-radius: 10px;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #fff;

  .address-tag {
    padding: 4px 8px;
    background: rgba(212, 175, 55, 0.1);
    border-radius: 8px;
    font-size: 10px;
  }

  .level-text {
    font-size: 13px;
    color: $brand-gold;
    font-weight: bold;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 15px;

  .stats-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    border: 1px solid rgba(212, 175, 55, 0.25);
    border-radius: 6px;
    background: rgba(20, 20, 20, 0.4);
    backdrop-filter: blur(6px);

    &.relative {
      position: relative;
    }

    .stats-num {
      font-size: 18px;
      font-weight: bold;
      color: $brand-gold;
    }

    .stats-label {
      margin-top: 7px;
      font-size: 13px;
      color: #fff;
      text-align: center;
    }
  }
}

.list-title {
  margin: 30px 0 0 0;
  font-size: 15px;
  color: $text-muted;
  text-align: center;
  font-weight: normal;
}

.table-card {
  margin-top: 15px;
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
}

.safe-bottom {
  height: 50px;
}
</style>
