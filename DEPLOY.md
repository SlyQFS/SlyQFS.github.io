# Руководство по запуску и хостингу «ЕГЭ 2027: База Знаний»

Этот сайт представляет собой автономное SPA-приложение на React + TypeScript + Tailwind CSS.  
Благодаря настройке относительных путей (`base: './'`), готовая сборка из папки `dist/` работает везде без настройки серверного роутинга.

---

## 1. Локальный запуск (для работы и добавления своих заметок)

```bash
cd ege-base
npm run dev
```
Сайт откроется по адресу `http://localhost:5173/`.

---

## 2. Сборка статического сайта для публикации

```bash
cd ege-base
npm run build
```
В директории `ege-base/dist` появится готовый оптимизированный статический сайт (HTML, JS, CSS, шрифты KaTeX).

---

## 3. Варианты бесплатного хостинга за 2 минуты

### Вариант A: Vercel (Рекомендуется, самый быстрый)
1. В папке `ege-base` выполните:
   ```bash
   npx vercel
   ```
2. Следуйте инструкциям в терминале (соглашайтесь с настройками по умолчанию). Через 20 секунд вы получите публичную ссылку вида `https://ege-base-xxx.vercel.app`.

---

### Вариант B: Cloudflare Pages / Netlify (Без терминала, Drag-and-Drop)
1. Соберите проект: `npm run build`.
2. Зайдите на [Netlify Drop](https://app.netlify.com/drop) или в панель Cloudflare Pages.
3. Просто перетащите папку `dist` в окно браузера.
4. Сайт мгновенно опубликуется с бесплатным SSL-сертификатом.

---

### Вариант C: GitHub Pages
1. Инициализируйте git-репозиторий (если ещё не сделано):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <URL_ВАШЕГО_РЕПОЗИТОРИЯ>
   git push -u origin main
   ```
2. Установите пакет `gh-pages`:
   ```bash
   npm install -D gh-pages
   ```
3. Добавьте в `package.json` в секцию `scripts`:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```
4. Запустите:
   ```bash
   npm run deploy
   ```
5. В настройках репозитория на GitHub (Settings -> Pages) источником выберите ветку `gh-pages`.

---

### Вариант D: Свой VPS / Nginx / Apache
Просто скопируйте файлы из папки `dist/` в корневую директорию веб-сервера:
```bash
scp -r dist/* user@your-server:/var/www/html/
```
