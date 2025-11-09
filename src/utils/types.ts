export type ImageDataLike = ImageData | {
  readonly width: number
  readonly height: number
  readonly data: Uint8ClampedArray
}
