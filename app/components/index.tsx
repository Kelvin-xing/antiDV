'use client'
import type { FC } from 'react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import produce from 'immer'
import { useBoolean, useGetState } from 'ahooks'
import useConversation from '@/hooks/use-conversation'
import Toast from '@/app/components/base/toast'
import Sidebar from '@/app/components/sidebar'
import Header from '@/app/components/header'
import { deleteConversation, fetchAppParams, fetchChatList, fetchChatModelConfig, fetchConversations, sendChatMessage } from '@/service'
import type { ChatDebugPayload, ChatHistoryItem, ChatModelConfig } from '@/service'
import type { ChatItem, ConversationItem, PromptConfig, VisionFile, VisionSettings } from '@/types/app'
import type { FileUpload } from '@/app/components/base/file-uploader-in-attachment/types'
import { Resolution, TransferMethod } from '@/types/app'
import Chat from '@/app/components/chat'
import { setLocaleOnClient } from '@/i18n/client'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import Loading from '@/app/components/base/loading'
import { replaceVarWithValues, userInputsFormToPromptVariables } from '@/utils/prompt'
import AppUnavailable from '@/app/components/app-unavailable'
import ResourcePanel from '@/app/components/resource-panel'
import BackExitGuard from '@/app/components/back-exit-guard'
import IncognitoNotice from '@/app/components/incognito-notice'
import { APP_ID, APP_INFO, isShowPrompt, promptTemplate } from '@/config'

const debugExportEnabled = process.env.NEXT_PUBLIC_ENABLE_DEBUG_EXPORT === 'true'
const chatDebugAvailable = process.env.NEXT_PUBLIC_ENABLE_CHAT_DEBUG === 'true'

const formatTiming = (value: number | null) => {
  return value === null ? 'N/A' : `${value.toFixed(2)} ms`
}

export interface IMainProps {
  params: any
}

const Main: FC<IMainProps> = () => {
  const { t } = useTranslation()
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  const isDesktop = media === MediaType.pc

  /*
  * app info
  */
  const [appUnavailable, setAppUnavailable] = useState<boolean>(false)
  const [isUnknownReason, setIsUnknownReason] = useState<boolean>(false)
  const [promptConfig, setPromptConfig] = useState<PromptConfig | null>(null)
  const [inited, setInited] = useState<boolean>(false)
  // in mobile, show sidebar by click button
  const [isShowSidebar, { setTrue: showSidebar, setFalse: hideSidebar }] = useBoolean(false)
  const [isShowResourcePanel, { setTrue: showResourcePanel, setFalse: hideResourcePanel }] = useBoolean(false)
  const [isPanelCollapsed, { toggle: togglePanelCollapse }] = useBoolean(false)
  const [isSidebarCollapsed, { toggle: toggleSidebarCollapse }] = useBoolean(false)
  const [visionConfig, setVisionConfig] = useState<VisionSettings | undefined>({
    enabled: false,
    number_limits: 2,
    detail: Resolution.low,
    transfer_methods: [TransferMethod.local_file],
  })
  const [fileConfig, setFileConfig] = useState<FileUpload | undefined>()
  const [chatDebugEnabled, setChatDebugEnabled] = useState(chatDebugAvailable)
  const [latestChatDebug, setLatestChatDebug] = useState<ChatDebugPayload | null>(null)
  const [chatModelConfig, setChatModelConfig] = useState<ChatModelConfig | null>(null)
  const [chatModelConfigError, setChatModelConfigError] = useState<string | null>(null)
  const [routerModel, setRouterModel] = useState('')
  const [responseModel, setResponseModel] = useState('')

  useEffect(() => {
    if (APP_INFO?.title) { document.title = `${APP_INFO.title} — 反家暴支持助手` }
  }, [])

  /*
  * conversation info
  */
  const {
    conversationList,
    setConversationList,
    currConversationId,
    setCurrConversationId,
    isNewConversation,
    currConversationInfo,
    currInputs,
    newConversationInputs,
    resetNewConversationInputs,
    setCurrInputs,
    setNewConversationInfo,
    setExistConversationInfo,
  } = useConversation()

  const [conversationIdChangeBecauseOfNew, setConversationIdChangeBecauseOfNew] = useGetState(false)
  const hasSetInputs = true

  const conversationName = currConversationInfo?.name || t('app.chat.newChatDefaultName') as string
  const conversationIntroduction = currConversationInfo?.introduction || ''
  const suggestedQuestions = currConversationInfo?.suggested_questions || []

  const handleConversationSwitch = () => {
    if (!inited) { return }

    // update inputs of current conversation
    let notSyncToStateIntroduction = ''
    let notSyncToStateInputs: Record<string, any> | undefined | null = {}
    if (!isNewConversation) {
      const item = conversationList.find(item => item.id === currConversationId)
      notSyncToStateInputs = item?.inputs || {}
      setCurrInputs(notSyncToStateInputs as any)
      notSyncToStateIntroduction = item?.introduction || ''
      setExistConversationInfo({
        name: item?.name || '',
        introduction: notSyncToStateIntroduction,
        suggested_questions: suggestedQuestions,
      })
    }
    else {
      notSyncToStateInputs = newConversationInputs
      setCurrInputs(notSyncToStateInputs)
    }

    // update chat list of current conversation
    if (!isNewConversation && !conversationIdChangeBecauseOfNew && !isResponding) {
      fetchChatList(currConversationId).then((res: any) => {
        const { data } = res
        const newChatList: ChatItem[] = generateNewChatListWithOpenStatement(notSyncToStateIntroduction, notSyncToStateInputs)

        data.forEach((item: any) => {
          newChatList.push({
            id: `question-${item.id}`,
            content: item.query,
            isAnswer: false,
            message_files: item.message_files?.filter((file: any) => file.belongs_to === 'user') || [],

          })
          newChatList.push({
            id: item.id,
            content: item.answer,
            feedback: item.feedback,
            isAnswer: true,
            message_files: item.message_files?.filter((file: any) => file.belongs_to === 'assistant') || [],
          })
        })
        setChatList(newChatList)
      })
    }

    if (isNewConversation) { setChatList(generateNewChatListWithOpenStatement()) }
  }
  useEffect(handleConversationSwitch, [currConversationId, inited])

  const handleConversationIdChange = (id: string) => {
    setLatestChatDebug(null)
    if (id === '-1') {
      createNewChat()
      setConversationIdChangeBecauseOfNew(true)
    }
    else {
      setConversationIdChangeBecauseOfNew(false)
    }
    // trigger handleConversationSwitch
    setCurrConversationId(id, APP_ID)
    hideSidebar()
  }

  /*
  * chat info. chat is under conversation.
  */
  const [chatList, setChatList, getChatList] = useGetState<ChatItem[]>([])
  const chatListDomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // scroll to bottom with page-level scrolling
    if (chatListDomRef.current) {
      setTimeout(() => {
        chatListDomRef.current?.scrollIntoView({
          behavior: 'auto',
          block: 'end',
        })
      }, 50)
    }
  }, [chatList, currConversationId, latestChatDebug])

  const createNewChat = () => {
    // if new chat is already exist, do not create new chat
    if (conversationList.some(item => item.id === '-1')) { return }

    setConversationList(produce(conversationList, (draft) => {
      draft.unshift({
        id: '-1',
        name: t('app.chat.newChatDefaultName'),
        inputs: newConversationInputs,
        introduction: conversationIntroduction,
        suggested_questions: suggestedQuestions,
      })
    }))
  }

  // sometime introduction is not applied to state
  const generateNewChatListWithOpenStatement = (introduction?: string, inputs?: Record<string, any> | null) => {
    let calculatedIntroduction = introduction || conversationIntroduction || ''
    const calculatedPromptVariables = inputs || currInputs || null
    if (calculatedIntroduction && calculatedPromptVariables) { calculatedIntroduction = replaceVarWithValues(calculatedIntroduction, promptConfig?.prompt_variables || [], calculatedPromptVariables) }

    const openStatement = {
      id: `${Date.now()}`,
      content: calculatedIntroduction,
      isAnswer: true,
      feedbackDisabled: true,
      isOpeningStatement: isShowPrompt,
      suggestedQuestions,
    }
    if (calculatedIntroduction) { return [openStatement] }

    return []
  }

  // init
  useEffect(() => {
    (async () => {
      try {
        const [conversationData, appParams] = await Promise.all([fetchConversations(), fetchAppParams()])
        // handle current conversation id
        const { data: conversations } = conversationData
        const currentConversation = conversations[0]
        const isNotNewConversation = !!currentConversation

        // fetch new conversation info
        const { user_input_form, opening_statement: introduction, file_upload, system_parameters, suggested_questions = [] }: any = appParams
        setLocaleOnClient(APP_INFO.default_language, true)
        setNewConversationInfo({
          name: t('app.chat.newChatDefaultName'),
          introduction,
          suggested_questions,
        })
        if (isNotNewConversation) {
          setExistConversationInfo({
            name: currentConversation.name || t('app.chat.newChatDefaultName'),
            introduction,
            suggested_questions,
          })
        }
        const prompt_variables = userInputsFormToPromptVariables(user_input_form)
        setPromptConfig({
          prompt_template: promptTemplate,
          prompt_variables,
        } as PromptConfig)
        const outerFileUploadEnabled = !!file_upload?.enabled
        setVisionConfig({
          ...file_upload?.image,
          enabled: !!(outerFileUploadEnabled && file_upload?.image?.enabled),
          image_file_size_limit: system_parameters?.system_parameters || 0,
        })
        setFileConfig({
          enabled: outerFileUploadEnabled,
          allowed_file_types: file_upload?.allowed_file_types,
          allowed_file_extensions: file_upload?.allowed_file_extensions,
          allowed_file_upload_methods: file_upload?.allowed_file_upload_methods,
          number_limits: file_upload?.number_limits,
          fileUploadConfig: file_upload?.fileUploadConfig,
        })
        setConversationList(conversations as ConversationItem[])

        if (isNotNewConversation) { setCurrConversationId(currentConversation.id, APP_ID, false) }

        setInited(true)
      }
      catch (e: any) {
        if (e.status === 404) {
          setAppUnavailable(true)
        }
        else {
          setIsUnknownReason(true)
          setAppUnavailable(true)
        }
      }
    })()
  }, [])

  const [isResponding, { setTrue: setRespondingTrue, setFalse: setRespondingFalse }] = useBoolean(false)
  const activeResponseController = useRef<AbortController | null>(null)
  const { notify } = Toast
  useEffect(() => {
    if (!chatDebugAvailable) { return }

    let active = true
    fetchChatModelConfig()
      .then((config) => {
        if (!active) { return }
        setChatModelConfig(config)
        setChatModelConfigError(null)
      })
      .catch((error) => {
        if (!active) { return }
        setChatModelConfigError(
          error instanceof Error ? error.message : '模型配置加载失败',
        )
      })
    return () => {
      active = false
    }
  }, [])
  useEffect(() => () => {
    activeResponseController.current?.abort()
  }, [])

  const logError = (message: string) => {
    notify({ type: 'error', message })
  }

  const checkCanSend = () => {
    if (currConversationId !== '-1') { return true }

    if (!currInputs || !promptConfig?.prompt_variables) { return true }

    const inputLens = Object.values(currInputs).length
    const promptVariablesLens = promptConfig.prompt_variables.length

    const emptyInput = inputLens < promptVariablesLens || Object.values(currInputs).find(v => !v)
    if (emptyInput) {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  const updateCurrentQA = ({
    responseItem,
    questionId,
    placeholderAnswerId,
    questionItem,
  }: {
    responseItem: ChatItem
    questionId: string
    placeholderAnswerId: string
    questionItem: ChatItem
  }) => {
    // closesure new list is outdated.
    const newListWithAnswer = produce(
      getChatList().filter(item => item.id !== responseItem.id && item.id !== placeholderAnswerId),
      (draft) => {
        if (!draft.find(item => item.id === questionId)) { draft.push({ ...questionItem }) }

        draft.push({ ...responseItem })
      },
    )
    setChatList(newListWithAnswer)
  }

  const handleStopResponse = () => {
    activeResponseController.current?.abort()
  }

  const handleSend = async (message: string, _files?: VisionFile[]) => {
    if (isResponding) {
      notify({ type: 'info', message: t('app.errorMessage.waitForResponse') })
      return
    }
    const data = {
      query: message,
      conversation_id: isNewConversation ? null : currConversationId,
      debug: chatDebugAvailable && chatDebugEnabled,
      router_model: routerModel || undefined,
      response_model: responseModel || undefined,
    }
    if (chatDebugEnabled) { setLatestChatDebug(null) }

    // question
    const questionId = `question-${Date.now()}`
    const questionItem = {
      id: questionId,
      content: message,
      isAnswer: false,
      message_files: [],
    }

    const placeholderAnswerId = `answer-placeholder-${Date.now()}`
    const placeholderAnswerItem = {
      id: placeholderAnswerId,
      content: '',
      isAnswer: true,
    }

    const newList = [...getChatList(), questionItem, placeholderAnswerItem]
    setChatList(newList)

    // answer
    const responseItem: ChatItem = {
      id: `${Date.now()}`,
      content: '',
      message_files: [],
      isAnswer: true,
    }
    let hasSetResponseId = false

    let tempNewConversationId = ''

    setRespondingTrue()
    sendChatMessage(data, {
      getAbortController(controller) {
        activeResponseController.current = controller
      },
      onStarted({ conversationId: newConversationId, messageId }) {
        tempNewConversationId = newConversationId
        if (!hasSetResponseId) {
          responseItem.id = messageId
          hasSetResponseId = true
        }
      },
      onData: (response, _isFirstMessage, { conversationId: newConversationId, messageId }) => {
        responseItem.content += response
        if (messageId && !hasSetResponseId) {
          responseItem.id = messageId
          hasSetResponseId = true
        }

        tempNewConversationId = newConversationId
        updateCurrentQA({
          responseItem,
          questionId,
          placeholderAnswerId,
          questionItem,
        })
      },
      onDebug(debug) {
        setLatestChatDebug(debug)
      },
      async onCompleted() {
        activeResponseController.current = null
        setCurrConversationId(tempNewConversationId, APP_ID, false)
        try {
          const { data: allConversations } = await fetchConversations()
          setConversationList(allConversations)
        }
        catch {
          notify({ type: 'error', message: '对话已回复，但会话列表刷新失败' })
        }
        finally {
          setConversationIdChangeBecauseOfNew(false)
          resetNewConversationInputs()
          setRespondingFalse()
        }
      },
      onError(message, code) {
        activeResponseController.current = null
        setRespondingFalse()
        notify({
          type: code === 'aborted' ? 'info' : 'error',
          message: code === 'aborted' ? `${message}，本轮消息未保存` : message,
        })
        const failedResponseId = responseItem.id
        setChatList(
          getChatList().filter(item =>
            item.id !== questionId
            && item.id !== placeholderAnswerId
            && item.id !== failedResponseId,
          ),
        )
      },
    })
  }

  const handleExport = async () => {
    if (isResponding) {
      notify({ type: 'info', message: '请等待当前回答完成后再导出' })
      return
    }
    if (isNewConversation || currConversationId === '-1') {
      notify({ type: 'info', message: '当前对话没有内容可导出' })
      return
    }

    let turns: ChatHistoryItem[]
    try {
      const response = await fetchChatList(currConversationId)
      turns = response.data
    }
    catch {
      notify({ type: 'error', message: '导出聊天记录失败，请稍后重试' })
      return
    }
    if (turns.length === 0) {
      notify({ type: 'info', message: '当前对话没有内容可导出' })
      return
    }

    const exportedAt = new Date().toISOString()
    const blob = new Blob(
      [JSON.stringify({
        schema_version: 1,
        exported_at: exportedAt,
        conversation_id: currConversationId,
        conversation_name: conversationName,
        turns: turns.map((turn, index) => ({
          turn: index + 1,
          user: turn.query,
          assistant: turn.answer,
          route_id: turn.route_id,
          safety_level: turn.safety_level,
          debug: turn.debug,
        })),
      }, null, 2)],
      { type: 'application/json;charset=utf-8' },
    )
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const safeConversationName = conversationName
      .replace(/[\\/:*?"<>|]+/g, '_')
      .slice(0, 60) || '当前对话'
    link.href = downloadUrl
    link.download = `聊天记录_${safeConversationName}_${exportedAt.slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(downloadUrl)
  }

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteConversation(id)
    }
    catch {
      notify({ type: 'error', message: '清除对话失败，请稍后重试' })
      return
    }
    const remaining = conversationList.filter(item => item.id !== id)
    setConversationList(remaining)
    if (currConversationId === id) {
      const next = remaining.find(item => item.id !== '-1')
      setCurrConversationId(next ? next.id : '-1', APP_ID)
    }
  }

  const handleClearAll = async () => {
    const realConversations = conversationList.filter(item => item.id !== '-1')
    try {
      await Promise.all(realConversations.map(item => deleteConversation(item.id)))
    }
    catch {
      notify({ type: 'error', message: '清除对话失败，请稍后重试' })
      return
    }
    setConversationList([])
    setCurrConversationId('-1', APP_ID)
  }

  const accumulatedAIText = useMemo(() => {
    return chatList
      .filter(i => i.isAnswer && !i.isOpeningStatement)
      .map(i => i.content)
      .join(' ')
  }, [chatList])

  const renderSidebar = () => {
    if (!APP_ID || !APP_INFO || !promptConfig) { return null }
    return (
      <Sidebar
        list={conversationList}
        onCurrentIdChange={handleConversationIdChange}
        currentId={currConversationId}
        copyRight={APP_INFO.copyright || APP_INFO.title}
        onDeleteConversation={handleDeleteConversation}
        onClearAll={handleClearAll}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />
    )
  }

  if (appUnavailable) { return <AppUnavailable isUnknownReason={isUnknownReason} /> }

  if (!APP_ID || !APP_INFO || !promptConfig) { return <Loading type='app' /> }

  // Compute input bar edges to fit between sidebar and resource panel
  const panelWidth = isDesktop && hasSetInputs ? (isPanelCollapsed ? 48 : 300) : 0
  const sidebarWidth = !isMobile ? (isSidebarCollapsed ? 48 : 244) : 0
  const inputLeft = sidebarWidth
  const inputRight = panelWidth

  return (
    <div className='bg-gray-100'>
      <BackExitGuard />
      <Header
        title={APP_INFO.title}
        isMobile={isMobile}
        onShowSideBar={showSidebar}
        onCreateNewChat={() => handleConversationIdChange('-1')}
        onShowResourcePanel={showResourcePanel}
        hasSetInputs={hasSetInputs}
      />
      <IncognitoNotice />
      <div className="flex rounded-t-2xl bg-white overflow-hidden">
        {/* sidebar */}
        {!isMobile && renderSidebar()}
        {isMobile && isShowSidebar && (
          <div className='fixed inset-0 z-50' style={{ backgroundColor: 'rgba(35, 56, 118, 0.2)' }} onClick={hideSidebar} >
            <div className='inline-block' onClick={e => e.stopPropagation()}>
              {renderSidebar()}
            </div>
          </div>
        )}
        {/* main + resource panel */}
        <div className='flex-grow flex h-[calc(100vh_-_3rem)] overflow-hidden'>
          <div className='flex-grow flex flex-col overflow-y-auto'>
            {/* Conversation name header */}
            <div className="shrink-0 flex items-center justify-between gap-4 px-4 py-3" style={{ borderBottom: '1px solid #F0EBE5' }}>
              <h1 className="text-base font-semibold" style={{ color: '#3D3028', fontFamily: '\'Noto Serif SC\', serif' }}>
                {conversationName}
              </h1>
              {chatDebugAvailable && (
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={chatDebugEnabled}
                    onChange={(event) => {
                      const enabled = event.target.checked
                      setChatDebugEnabled(enabled)
                      if (!enabled) { setLatestChatDebug(null) }
                    }}
                  />
                  显示 Chatflow Debug
                </label>
              )}
            </div>
            {chatDebugAvailable && (
              <div
                data-testid="chat-model-selectors"
                className="shrink-0 flex flex-wrap items-end gap-3 border-b border-amber-100 bg-amber-50/60 px-4 py-2 text-xs text-gray-700"
              >
                {chatModelConfig
                  ? (
                      <>
                        <label className="flex min-w-[210px] flex-1 flex-col gap-1">
                          <span className="font-medium text-amber-950">Router 模型</span>
                          <select
                            aria-label="Router 模型"
                            className="rounded-lg border border-amber-200 bg-white px-2 py-1.5 font-mono text-xs outline-none focus:border-amber-500"
                            value={routerModel}
                            disabled={isResponding}
                            onChange={event => setRouterModel(event.target.value)}
                          >
                            <option value="">
                              后端默认（
                              {chatModelConfig.router.default}
                              ）
                            </option>
                            {chatModelConfig.router.options
                              .filter(model => model !== chatModelConfig.router.default)
                              .map(model => <option key={model} value={model}>{model}</option>)}
                          </select>
                        </label>
                        <label className="flex min-w-[210px] flex-1 flex-col gap-1">
                          <span className="font-medium text-amber-950">回答模型</span>
                          <select
                            aria-label="回答模型"
                            className="rounded-lg border border-amber-200 bg-white px-2 py-1.5 font-mono text-xs outline-none focus:border-amber-500"
                            value={responseModel}
                            disabled={isResponding}
                            onChange={event => setResponseModel(event.target.value)}
                          >
                            <option value="">
                              后端默认（
                              {chatModelConfig.response.default}
                              ）
                            </option>
                            {chatModelConfig.response.options
                              .filter(model => model !== chatModelConfig.response.default)
                              .map(model => <option key={model} value={model}>{model}</option>)}
                          </select>
                        </label>
                        <span className="pb-1 text-[11px] text-gray-500">
                          仅影响下一轮请求；留空使用后端默认值
                        </span>
                      </>
                    )
                  : (
                      <span className={chatModelConfigError ? 'text-red-700' : 'text-gray-500'}>
                        {chatModelConfigError || '正在加载模型配置…'}
                      </span>
                    )}
              </div>
            )}
            <div className='relative grow pc:w-[794px] max-w-full mobile:w-full pb-[180px] mx-auto mb-3.5' ref={chatListDomRef}>
              <Chat
                chatList={chatList}
                onSend={handleSend}
                onStop={handleStopResponse}
                feedbackDisabled
                isResponding={isResponding}
                checkCanSend={checkCanSend}
                visionConfig={visionConfig}
                fileConfig={fileConfig}
                inputLeft={inputLeft}
                inputRight={inputRight}
                afterMessages={chatDebugAvailable && chatDebugEnabled && latestChatDebug
                  ? (
                      <section
                        data-testid="chat-debug-panel"
                        className="mx-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-gray-700 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h2 className="text-sm font-semibold text-amber-950">Chatflow Debug</h2>
                          <span className="rounded-full bg-amber-100 px-2 py-1 font-mono text-amber-900">
                            {latestChatDebug.route.capsule_id}
                            {' · '}
                            {(latestChatDebug.route.confidence * 100).toFixed(0)}
                            %
                          </span>
                        </div>
                        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 pc:grid-cols-4">
                          {latestChatDebug.models && (
                            <>
                              <div>
                                <dt className="text-gray-500">Router 模型</dt>
                                <dd className="mt-0.5 break-all font-mono text-gray-900">{latestChatDebug.models.router}</dd>
                              </div>
                              <div>
                                <dt className="text-gray-500">回答模型</dt>
                                <dd className="mt-0.5 break-all font-mono text-gray-900">{latestChatDebug.models.response}</dd>
                              </div>
                            </>
                          )}
                          <div>
                            <dt className="text-gray-500">胶囊</dt>
                            <dd className="mt-0.5 font-medium text-gray-900">
                              {latestChatDebug.route.capsule_title || latestChatDebug.route.capsule_id}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">路由方式</dt>
                            <dd className="mt-0.5 font-mono text-gray-900">{latestChatDebug.route.method}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">Router</dt>
                            <dd className="mt-0.5 font-mono text-gray-900">{formatTiming(latestChatDebug.timings.router_ms)}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">Ground</dt>
                            <dd className="mt-0.5 font-mono text-gray-900">{formatTiming(latestChatDebug.timings.ground_ms)}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">回答首 token (TTFT)</dt>
                            <dd className="mt-0.5 font-mono text-gray-900">{formatTiming(latestChatDebug.timings.response_ttft_ms)}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">首个可见分段</dt>
                            <dd className="mt-0.5 font-mono text-gray-900">{formatTiming(latestChatDebug.timings.first_guarded_delta_ms)}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">回答生成</dt>
                            <dd className="mt-0.5 font-mono text-gray-900">{formatTiming(latestChatDebug.timings.response_generation_ms)}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">总耗时</dt>
                            <dd className="mt-0.5 font-mono font-semibold text-gray-900">{formatTiming(latestChatDebug.timings.total_ms)}</dd>
                          </div>
                        </dl>
                        <p className="mt-3 break-words text-gray-600">
                          路由原因：
                          {latestChatDebug.route.reason || '未提供'}
                        </p>
                        <details className="mt-3">
                          <summary className="cursor-pointer font-medium text-amber-900">
                            完整 CLI Debug JSON
                          </summary>
                          <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-gray-950 p-3 text-[11px] leading-5 text-gray-100">
                            {JSON.stringify(latestChatDebug, null, 2)}
                          </pre>
                        </details>
                      </section>
                    )
                  : null}
              />
              {/* Export button */}
              {debugExportEnabled && chatList.filter(i => !i.isOpeningStatement).length > 0 && (
                <div className="flex justify-end px-2 pt-1 pb-2">
                  <button
                    onClick={handleExport}
                    disabled={isResponding}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    导出当前对话（含路由 / Debug）
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Desktop resource panel */}
          {isDesktop && hasSetInputs && (
            <ResourcePanel
              accumulatedAIText={accumulatedAIText}
              isCollapsed={isPanelCollapsed}
              onToggleCollapse={togglePanelCollapse}
            />
          )}
        </div>
      </div>
      {/* Mobile resource panel overlay */}
      {!isDesktop && (
        <ResourcePanel
          accumulatedAIText={accumulatedAIText}
          isMobileOverlay
          isVisible={isShowResourcePanel}
          onClose={hideResourcePanel}
        />
      )}
    </div>
  )
}

export default React.memo(Main)
