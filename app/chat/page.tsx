import type { FC } from 'react'
import React from 'react'

import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

const ChatPage: FC<IMainProps> = ({
  params,
}: any) => {
  return (
    <Main params={params} />
  )
}

export default React.memo(ChatPage)
