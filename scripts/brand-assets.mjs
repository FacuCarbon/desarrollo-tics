import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { pathToFileURL } from 'node:url'
const { chromium } = await import(pathToFileURL(path.join(os.tmpdir(), 'nube-browser-qa/node_modules/playwright/index.mjs')).href)
const root = path.resolve(import.meta.dirname, '..')
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const icon = fs.readFileSync(path.join(root, 'public/favicon.svg'), 'utf8')
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.setContent(`<!doctype html><html lang="es"><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#f7f6f2;color:#242c32;font-family:'Segoe UI',sans-serif;width:1200px;height:630px;overflow:hidden}.canvas{height:630px;padding:57px 70px;position:relative;border:18px solid #efeee8}.brand{display:flex;align-items:center;gap:13px;font-size:24px;font-weight:600;letter-spacing:-.5px}.brand svg{width:43px;height:43px}.eyebrow{margin:40px 0 14px;font-size:12px;text-transform:uppercase;letter-spacing:3px;color:#647078}h1{font:400 76px/1.08 Georgia,serif;letter-spacing:-2.5px;margin:0;width:700px}p{font-size:21px;line-height:1.6;color:#647078;margin:24px 0 0;width:660px}.footer{position:absolute;bottom:40px;left:70px;right:70px;border-top:1px solid #dddfd9;padding-top:18px;display:flex;justify-content:space-between;color:#647078;font-size:14px}.book{position:absolute;right:76px;top:133px;width:235px;height:280px;background:#efeee8;border:1px solid #dddfd9;border-radius:3px 12px 12px 3px;transform:rotate(7deg);padding:42px 35px}.book:before{content:'';position:absolute;left:17px;top:0;bottom:0;border-left:1px solid #d0d3cc}.book:after{content:'';position:absolute;right:28px;top:-1px;width:22px;height:73px;background:#355c78;clip-path:polygon(0 0,100% 0,100% 100%,50% 83%,0 100%)}.book svg{width:125px;height:125px;transform:rotate(-7deg)}.book-line{height:1px;background:#c6ccc8;margin-top:18px;width:100%}</style><div class="canvas"><div class="brand">${icon}<span>Apuntes</span></div><div class="eyebrow">Preparador de materias</div><h1>Apuntes<br>y práctica.</h1><p>Teoría, preguntas y práctica<br>para preparar tus parciales.</p><div class="book">${icon}<div class="book-line"></div><div class="book-line" style="width:65%"></div></div><div class="footer"><span>Nube · TICs · Mobile y Frontend</span><span>desarrollo-estudio.vercel.app</span></div></div></html>`)
  fs.mkdirSync(path.join(root, 'public/social'), { recursive: true })
  await page.screenshot({ path: path.join(root, 'public/social/apuntes-preview-v1.png') })
  for (const [size, filename] of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png']]) {
    await page.setViewportSize({ width: size, height: size })
    await page.setContent(`<html><style>body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${icon}</html>`)
    await page.screenshot({ path: path.join(root, 'public', filename), omitBackground: true })
  }
  console.log('Created social preview (1200×630), favicon (32×32), and touch icon (180×180).')
} finally { await browser.close() }
