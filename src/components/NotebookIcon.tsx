export type NotebookIconName = 'book' | 'practice' | 'progress' | 'arrow' | 'check' | 'sun' | 'moon' | 'close' | 'file'

export function NotebookIcon({ name, size = 20 }: { name: NotebookIconName; size?: number }) {
  const paths: Record<NotebookIconName, string> = {
    book: 'M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4V4Zm16 0h-4a3 3 0 0 0-3 3m7-3v15h-3a4 4 0 0 0-4 2',
    practice: 'm15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14v6Zm1-5 4 4',
    progress: 'M4 20h16M7 16v-5m5 5V5m5 11V9',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    check: 'm5 12 4 4L19 6',
    sun: 'M12 3v1m0 16v1M3 12h1m16 0h1M5.6 5.6l.7.7m11.4 11.4.7.7M5.6 18.4l.7-.7M17.7 6.3l.7-.7M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
    moon: 'M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10Z',
    close: 'm6 6 12 12M6 18 18 6',
    file: 'M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8m-8 4h6',
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
