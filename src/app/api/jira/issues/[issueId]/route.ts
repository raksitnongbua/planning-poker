import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { JIRA_SESSION_COOKIE } from '@/constant/jira'
import { getJiraTokens } from '@/lib/jiraTokenStore'

export async function GET(req: NextRequest, { params }: { params: Promise<{ issueId: string }> }) {
  const { issueId } = await params
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(JIRA_SESSION_COOKIE)?.value
  if (!sessionId) return NextResponse.json({ description: '' }, { status: 401 })
  const tokens = getJiraTokens(sessionId)
  if (!tokens) return NextResponse.json({ description: '' }, { status: 401 })

  const cloudId = req.nextUrl.searchParams.get('cloudId')
  if (!cloudId) return NextResponse.json({ description: '' }, { status: 400 })

  const res = await fetch(
    `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${issueId}?fields=description,summary`,
    { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
  )
  if (!res.ok) return NextResponse.json({ description: '' })

  const data = await res.json()
  const description = adfToMarkdown(data.fields?.description)
  return NextResponse.json({ description })
}

type AdfNode = {
  type?: string
  text?: string
  content?: AdfNode[]
  attrs?: Record<string, unknown>
  marks?: { type: string; attrs?: Record<string, unknown> }[]
}

function adfToMarkdown(node: unknown, listDepth = 0, ordered = false, index = 1): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as AdfNode

  switch (n.type) {
    case 'doc':
      return (n.content ?? []).map((c) => adfToMarkdown(c)).join('\n').trim()

    case 'paragraph':
      return (n.content ?? []).map((c) => adfToMarkdown(c)).join('') + '\n'

    case 'text': {
      let text = n.text ?? ''
      for (const mark of n.marks ?? []) {
        if (mark.type === 'strong') text = `**${text}**`
        else if (mark.type === 'em') text = `*${text}*`
        else if (mark.type === 'code') text = `\`${text}\``
        else if (mark.type === 'strike') text = `~~${text}~~`
        else if (mark.type === 'link') {
          const href = mark.attrs?.href as string ?? '#'
          text = `[${text}](${href})`
        }
      }
      return text
    }

    case 'heading': {
      const level = (n.attrs?.level as number) ?? 1
      const prefix = '#'.repeat(level)
      return `${prefix} ${(n.content ?? []).map((c) => adfToMarkdown(c)).join('')}\n`
    }

    case 'bulletList':
      return (n.content ?? []).map((c) => adfToMarkdown(c, listDepth, false)).join('') + '\n'

    case 'orderedList':
      return (n.content ?? [])
        .map((c, i) => adfToMarkdown(c, listDepth, true, i + 1))
        .join('') + '\n'

    case 'listItem': {
      const indent = '  '.repeat(listDepth)
      const bullet = ordered ? `${index}.` : '-'
      const content = (n.content ?? [])
        .map((c) =>
          c.type === 'bulletList' || c.type === 'orderedList'
            ? adfToMarkdown(c, listDepth + 1, c.type === 'orderedList')
            : adfToMarkdown(c).replace(/\n$/, '')
        )
        .join('\n')
      const lines = content.split('\n')
      return `${indent}${bullet} ${lines[0]}\n${lines.slice(1).filter(Boolean).map((l) => `${indent}  ${l}`).join('\n')}${lines.length > 1 ? '\n' : ''}`
    }

    case 'codeBlock': {
      const lang = (n.attrs?.language as string) ?? ''
      const code = (n.content ?? []).map((c) => c.text ?? '').join('')
      return `\`\`\`${lang}\n${code}\n\`\`\`\n`
    }

    case 'blockquote':
      return (n.content ?? [])
        .map((c) => adfToMarkdown(c))
        .join('')
        .split('\n')
        .map((l) => (l ? `> ${l}` : '>'))
        .join('\n') + '\n'

    case 'hardBreak':
      return '\n'

    case 'rule':
      return '\n---\n'

    default:
      return (n.content ?? []).map((c) => adfToMarkdown(c)).join('')
  }
}
