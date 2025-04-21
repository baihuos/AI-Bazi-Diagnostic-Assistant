import type { CategoryItem } from "@/types/home"
import { http } from "@/utils/config"

export const getHomeCateAPI = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: '/api/articles',
  })
}