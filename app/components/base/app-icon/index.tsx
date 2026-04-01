import type { FC } from 'react'

export interface AppIconProps {
  size?: 'xs' | 'tiny' | 'small' | 'medium' | 'large'
  rounded?: boolean
  icon?: string
  background?: string
  className?: string
}

const sizeMap: Record<string, number> = {
  xs: 12,
  tiny: 24,
  small: 32,
  medium: 36,
  large: 40,
}

const AppIcon: FC<AppIconProps> = ({
  size = 'medium',
  rounded = false,
  background,
  className,
}) => {
  const px = sizeMap[size] ?? 36
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/avatar.png"
      alt="小安"
      width={px}
      height={px}
      className={className}
      style={{
        width: px,
        height: px,
        borderRadius: rounded ? '50%' : 8,
        objectFit: 'cover',
        objectPosition: 'center top',
        flexShrink: 0,
        display: 'block',
        background,
      }}
    />
  )
}

export default AppIcon