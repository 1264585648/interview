const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function matchAsset(fileName: string) {
  return `${basePath}/match-assets/chatgpt/${fileName}`
}
