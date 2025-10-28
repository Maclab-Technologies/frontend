import { get, patch, put } from "@/app/_hooks/fetch-hook"
import { cache } from "react"

export const getUserProfile = cache(async (token) => {
  try {
    const res = await get("/users/profile", {token})
    if(res.success){
      return {
        success: true,
        data: res.data.data
      }
    }

  } catch (error) {
    console.error(error)
    return{
      success: false,
      data: null
    }
  }
})

export const dashboardStats = cache(async (token) => {
  try {
    const res = await get("/users/dashboard/stats", {token})
    if(res.success){
      return {
        success: true,
        data: res.data.data
      }
    }

  } catch (error) {
    console.error(error)
    return{
      success: false,
      data: null
    }
  }
})

export const recentOrders = cache(async (token) => {
  try {
    const res = await get("/users/dashboard/recent-orders", {token})
    if(res.success){
      return {
        success: true,
        data: res.data.data
      }
    }

  } catch (error) {
    console.error(error)
    return{
      success: false,
      data: null
    }
  }
})

export const getOrders = cache(async (token) => {
  try {
    const res = await get("/users/orders?page=1&limit=10&sortBy=createdAt&sortOrder=desc", {token})
    if(res.success){
      return {
        success: true,
        data: res.data.data
      }
    }

  } catch (error) {
    console.error(error)
    return{
      success: false,
      data: null
    }
  }
})


export const getTransactions = cache(async (token) => {
  try {
    const res = await get("/users/transactions?page=1&limit=10&sortBy=createdAt&sortOrder=desc", {token})
    if(res.success){
      return {
        success: true,
        data: res.data.data
      }
    }

  } catch (error) {
    console.error(error)
    return{
      success: false,
      data: null
    }
  }
})


export const passwordUpdate = async (formData, token) => {

  try {
    const res = await put('/users/settings/password', formData, {token})

    if(res.success){
      return{
        success: true,
      }
    }
  } catch (error) {
    console.error(error)
    return{
      success: false
    }
  }
}

export const profileUpdate = async (formData, token) => {

  try {
    const res = await patch('/auth/profile', formData, {token})

    if(res.success){
      return{
        success: true,
      }
    }
  } catch (error) {
    console.error(error)
    return{
      success: false
    }
  }
}
