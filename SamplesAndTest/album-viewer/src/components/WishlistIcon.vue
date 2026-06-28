<template>
  <div class="wishlist-icon" @click="toggleWishlist">
    <div class="wishlist-icon-container">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="wishlist-svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span v-if="totalArtists > 0" class="wishlist-badge">{{ totalArtists }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWishlistStore } from '../stores/wishlistStore'

const wishlistStore = useWishlistStore()

const toggleWishlist = () => {
  wishlistStore.toggleWishlist()
}

const totalArtists = computed(() => wishlistStore.totalArtists)
</script>

<style scoped>
.wishlist-icon {
  position: relative;
  cursor: pointer;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wishlist-icon-container {
  position: relative;
}

.wishlist-svg {
  width: 28px;
  height: 28px;
  color: rgba(255, 255, 255, 0.5);
}

.wishlist-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e55;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  animation: pulse 0.8s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}
</style>
