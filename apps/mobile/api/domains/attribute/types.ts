export interface AttributeItem {
  id: number
  name: string
}

export interface GetAppearanceResponse {
  items: AttributeItem[]
}

export interface GetPersonalityResponse {
  items: AttributeItem[]
}
