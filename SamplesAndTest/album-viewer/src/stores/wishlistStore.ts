import { defineStore } from 'pinia'
import type { Album } from '../types/album'

export interface WishlistArtist {
  artist: string
  image_url: string
}

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    artists: [] as WishlistArtist[],
    isWishlistOpen: false
  }),

  getters: {
    totalArtists: (state) => state.artists.length,

    isWishlisted: (state) => {
      return (artist: string) => state.artists.some(a => a.artist === artist)
    }
  },

  actions: {
    addArtist(album: Album) {
      if (!this.artists.some(a => a.artist === album.artist)) {
        this.artists.push({ artist: album.artist, image_url: album.image_url })
      }
    },

    removeArtist(artist: string) {
      const index = this.artists.findIndex(a => a.artist === artist)
      if (index > -1) {
        this.artists.splice(index, 1)
      }
    },

    toggleArtist(album: Album) {
      if (this.artists.some(a => a.artist === album.artist)) {
        this.removeArtist(album.artist)
      } else {
        this.addArtist(album)
      }
    },

    clearWishlist() {
      this.artists = []
    },

    toggleWishlist() {
      this.isWishlistOpen = !this.isWishlistOpen
    }
  }
})
