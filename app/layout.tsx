import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/markdown.scss'
import QuickExit from '@/app/components/quick-exit'

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()
  return (
    <html lang={locale ?? 'zh-Hans'} className="h-full">
      <body className="h-full" style={{ backgroundColor: '#FBF8F4' }}>
        <QuickExit />
        <div className="overflow-x-hidden w-full">
          <div className="w-full h-screen">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}

export default LocaleLayout
