"use client"

import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { useServerInsertedHTML } from "next/navigation"
import { Fragment, useState, type ReactNode } from "react"

// App Router에서 Emotion이 SSR 스타일을 <body> 안에 인라인 <style>로 끼워 넣으면
// 클라이언트 트리와 어긋나 hydration 오류가 난다. 렌더 중 생성된 스타일을 모아
// useServerInsertedHTML로 <head>에 넣는다.
// https://nextjs.org/docs/app/guides/css-in-js
export function EmotionRegistry({ children }: { children: ReactNode }) {
  const [registry] = useState(() => {
    const cache = createCache({ key: "css" })
    // compat 모드: 서버에서 인라인 <style>을 렌더하지 않고 cache.inserted에만 저장
    cache.compat = true

    let inserted: { name: string; isGlobal: boolean }[] = []
    const prevInsert = cache.insert
    cache.insert = (...args) => {
      const [selector, serialized] = args
      if (cache.inserted[serialized.name] === undefined) {
        // <Global>은 selector 없이 삽입된다
        inserted.push({ name: serialized.name, isGlobal: !selector })
      }
      return prevInsert(...args)
    }

    const flush = () => {
      const flushed = inserted
      inserted = []
      return flushed
    }

    return { cache, flush }
  })

  useServerInsertedHTML(() => {
    const { cache } = registry
    const flushed = registry.flush()
    if (flushed.length === 0) return null

    const globals: { name: string; style: string }[] = []
    let styles = ""
    let dataEmotion = cache.key
    for (const { name, isGlobal } of flushed) {
      const style = cache.inserted[name]
      if (typeof style !== "string") continue
      if (isGlobal) {
        globals.push({ name, style })
      } else {
        styles += style
        dataEmotion += ` ${name}`
      }
    }

    // data-emotion 형식을 Emotion 규칙대로 맞춰야 클라이언트가 같은 스타일을 다시 넣지 않는다
    return (
      <Fragment>
        {globals.map(({ name, style }) => (
          <style
            key={name}
            data-emotion={`${cache.key}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: style }}
          />
        ))}
        {styles && (
          <style
            data-emotion={dataEmotion}
            dangerouslySetInnerHTML={{ __html: styles }}
          />
        )}
      </Fragment>
    )
  })

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>
}
