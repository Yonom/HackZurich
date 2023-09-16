// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { ChatMessageActions } from '@/components/chat-message-actions'
import { coachMessageParser } from '../lib/coachMessageParser'

export interface ChatMessageProps {
  message: Message
  coachMessage?: Message
}

export function ChatMessage({
  message,
  coachMessage,
  ...props
}: ChatMessageProps) {
  const coachMsg = coachMessage
    ? coachMessageParser(coachMessage.content)
    : null

  return (
    <div>
      <div
        className={cn('group relative mb-4 flex items-start md:-ml-12')}
        {...props}
      >
        {message.role === 'user' ? <IconUser /> : <div/>}
        <div
          className="flex-1 px-1 ml-4 space-y-2 overflow-hidden"
          style={{
            background: '#A0D3EC',
            padding: '10px 0px 10px 10px',
            borderRadius: '0.5rem'
          }}
        >
          <MemoizedReactMarkdown
            className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                return (
                  <p className="mb-2 last:mb-0">
                    {children}
                  </p>
                )
              },
              code({ node, inline, className, children, ...props }) {
                if (children.length) {
                  if (children[0] == '▍') {
                    return (
                      <span className="mt-1 cursor-default animate-pulse">
                        ▍
                      </span>
                    )
                  }

                  children[0] = (children[0] as string).replace('`▍`', '▍')
                }

                const match = /language-(\w+)/.exec(className || '')

                if (inline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }

                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ''}
                    value={String(children).replace(/\n$/, '')}
                    {...props}
                  />
                )
              }
            }}
          >
            {message.content
              .replace('Insurance Advisor: ', '')
              .replace('Customer: ', '')}
          </MemoizedReactMarkdown>
          <ChatMessageActions message={message} coachMessage={coachMessage} />
        </div>

        <div>
          {message.role === 'user' ? <div /> : <IconOpenAI />}
        </div>
      </div>

      {!!coachMsg && (
        <div
          className={cn(
            'border ml-2 p-2',
            coachMsg.score === 5 && 'border-green-500',
            coachMsg.score === 4 && 'border-blue-500',
            coachMsg.score === 3 && 'border-yellow-500',
            coachMsg.score === 2 && 'border-orange-500',
            coachMsg.score === 1 && 'border-red-500',
            coachMsg.score === null && 'border-gray-500'
          )}
        >
          {coachMsg.feedback}
        </div>
      )}
    </div>
  )
}
