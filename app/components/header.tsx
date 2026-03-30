import type { FC } from 'react'
import React from 'react'
import Link from 'next/link'
import {
  Bars3Icon,
  PencilSquareIcon,
  HomeIcon,
} from '@heroicons/react/24/solid'
import AppIcon from '@/app/components/base/app-icon'
export interface IHeaderProps {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
  onShowResourcePanel?: () => void
  hasSetInputs?: boolean
}
const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
  onShowResourcePanel,
  hasSetInputs,
}) => {
  return (
    <div className="shrink-0 flex items-center justify-between h-12 px-3 sticky top-0 z-50" style={{ backgroundColor: '#F5E6D3', borderBottom: '1px solid #E6DDD5' }}>
      {/* Left: home button + (mobile) hamburger */}
      <div className="flex items-center gap-1">
        <Link
          href="/"
          className="flex items-center justify-center h-8 w-8 rounded-lg transition-colors hover:bg-black/5"
          title="返回首页"
        >
          <HomeIcon className="h-4 w-4" style={{ color: '#8F7E6E' }} />
        </Link>
        {isMobile && (
          <div
            className='flex items-center justify-center h-8 w-8 cursor-pointer'
            onClick={() => onShowSideBar?.()}
          >
            <Bars3Icon className="h-4 w-4" style={{ color: '#8F7E6E' }} />
          </div>
        )}
      </div>

      <div className='flex items-center space-x-2'>
        <AppIcon size="small" />
        <div className="text-sm font-bold" style={{ color: '#4A4238' }}>
          {title}
        </div>
        <span className="hidden tablet:inline-block text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#7CB9A8', color: '#fff', fontSize: '10px' }}>
          反家暴AI助手
        </span>
      </div>

      {isMobile
        ? (
          <div className='flex items-center gap-0.5'>
            {hasSetInputs && (
              <div
                className='flex items-center justify-center h-8 w-8 cursor-pointer'
                onClick={() => onShowResourcePanel?.()}
                title="心理资源"
              >
                {/* Book open icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8F7E6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
            )}
            <div className='flex items-center justify-center h-8 w-8 cursor-pointer' onClick={() => onCreateNewChat?.()} >
              <PencilSquareIcon className="h-4 w-4" style={{ color: '#8F7E6E' }} />
            </div>
          </div>)
        : <div></div>}
    </div>
  )
}

export default React.memo(Header)
