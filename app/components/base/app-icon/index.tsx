import type { FC } from 'react'
import { brandAssets } from '@/config/brand-assets'

export interface AppIconProps {
  size?: 'xs' | 'tiny' | 'small' | 'medium' | 'large' | 'hero'
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
  hero: 120,
}

const AppIcon: FC<AppIconProps> = ({
  size = 'medium',
  rounded = false,
  background,
  className,
}) => {
  const px = sizeMap[size] ?? 36
  return (
    <span
      role="img"
      aria-label="小安"
      className={className}
      style={{
        width: px,
        height: px,
        borderRadius: rounded ? '50%' : 8,
        backgroundImage: `url(${brandAssets.avatar})`,
        backgroundSize: brandAssets.avatarSize,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        flexShrink: 0,
        display: 'block',
        backgroundColor: background,
      }}
    />
  )
}

export default AppIcon
