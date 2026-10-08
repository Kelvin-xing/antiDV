import type { FC } from 'react'
import React from 'react'
import Link from 'next/link'
import { Bars3Icon, BookOpenIcon, PencilSquareIcon, HomeIcon } from '@heroicons/react/24/outline'
import AppIcon from '@/app/components/base/app-icon'

export interface IHeaderProps {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
  onShowResourcePanel?: () => void
  hasSetInputs?: boolean
}

const Header: FC<IHeaderProps> = ({ title, isMobile, onShowSideBar, onCreateNewChat, onShowResourcePanel, hasSetInputs }) => (
  <header className="shrink-0 flex items-center justify-between h-14 pl-3 pr-14 tablet:pr-32 sticky top-0 z-40 border-b border-[#E6DDD5] bg-[#FBF9F6]">
    <div className="flex items-center gap-1">
      <Link href="/" className="flex items-center justify-center h-11 w-11 rounded-lg hover:bg-black/5" aria-label="返回首页">
        <HomeIcon className="h-4 w-4" />
      </Link>
      {isMobile && (
        <button type="button" className="flex items-center justify-center h-11 w-11 rounded-lg hover:bg-black/5" onClick={onShowSideBar} aria-label="打开历史对话">
          <Bars3Icon className="h-4 w-4" />
        </button>
      )}
    </div>
    <Link href="/" className="flex items-center gap-2 text-sm">
      <AppIcon size="small" rounded />
      <span>{title}</span>
    </Link>
    <div className="flex items-center">
      {hasSetInputs && (
        <button type="button" className="flex items-center justify-center h-11 w-11 rounded-lg hover:bg-black/5" onClick={onShowResourcePanel} aria-label="打开支持资源">
          <BookOpenIcon className="h-4 w-4" />
        </button>
      )}
      <button type="button" className="flex items-center justify-center h-11 w-11 rounded-lg hover:bg-black/5" onClick={onCreateNewChat} aria-label="新建对话">
        <PencilSquareIcon className="h-4 w-4" />
      </button>
    </div>
  </header>
)

export default React.memo(Header)
