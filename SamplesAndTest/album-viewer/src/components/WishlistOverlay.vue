<template>
  <div class="wishlist-overlay" v-if="isWishlistOpen" @click.self="toggleWishlist">
    <div class="wishlist-panel">
      <div class="wishlist-header">
        <div style="font-size: 1.3rem; font-weight: bold;">Your Wishlist</div>
        <div class="close-btn" @click="toggleWishlist">×</div>
      </div>

      <div v-if="totalArtists === 0" class="empty-wishlist">
        <div style="color: #ccc; font-size: 3rem;">💖</div>
        <div style="color: #bbb;">No favourite artists yet</div>
      </div>

      <div v-else class="wishlist-content">
        <div class="wishlist-items">
          <div v-for="item in wishlistArtists" :key="item.artist" class="wishlist-item">
            <div class="item-image">
              <img :src="item.image_url">
            </div>
            <div class="item-details">
              <div style="font-weight: bold; font-size: 0.9rem;">{{ item.artist }}</div>
              <div style="color: #bbb; font-size: 0.8rem;">Favourite artist</div>
            </div>
            <span class="remove-btn" @click="removeArtist(item.artist)" title="Remove">🗑</span>
          </div>
        </div>

        <div class="wishlist-summary">
          <div class="btn btn-danger" @click="clearWishlist">Clear All</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWishlistStore } from '../stores/wishlistStore'

const wishlistStore = useWishlistStore()

const isWishlistOpen = computed(() => wishlistStore.isWishlistOpen)
const wishlistArtists = computed(() => wishlistStore.artists)
const totalArtists = computed(() => wishlistStore.totalArtists)

const toggleWishlist = () => { wishlistStore.toggleWishlist() }
const removeArtist = (artist: string) => { wishlistStore.removeArtist(artist) }
const clearWishlist = () => { wishlistStore.clearWishlist() }
</script>

<style scoped>
.wishlist-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}

.wishlist-panel {
  background-color: white;
  width: 100%;
  max-width: 400px;
  height: 100%;
  overflow-y: auto;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.wishlist-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.close-btn {
  font-size: 24px;
  cursor: pointer;
  color: #ccc;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-wishlist {
  padding: 60px 20px;
  text-align: center;
}

.wishlist-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.wishlist-items {
  flex-grow: 1;
}

.wishlist-item {
  padding: 15px 20px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-image {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.item-details {
  flex-grow: 1;
  min-width: 0;
}

.remove-btn {
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.4;
}

.wishlist-summary {
  padding: 20px;
  border-top: 1px solid #eee;
}

.btn {
  display: block;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 8px;
}

.btn-danger {
  background: transparent;
  color: #e55;
  border: 1px solid #e55;
  font-size: 0.85rem;
}
</style>
