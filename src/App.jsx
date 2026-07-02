import { useEffect, useState } from 'react'

const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const quotes = [
  '千里之行，始于足下。',
  '不积跬步，无以至千里；不积小流，无以成江海。',
  '学而不思则罔，思而不学则殆。',
  '知之者不如好之者，好之者不如乐之者。',
  '路漫漫其修远兮，吾将上下而求索。',
  '天行健，君子以自强不息。',
  '博学之，审问之，慎思之，明辨之，笃行之。',
  '不患人之不己知，患不知人也。',
]

function pad(n) {
  return String(n).padStart(2, '0')
}

function format(now) {
  return {
    time: pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()),
    date:
      now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日 ' +
      weekdays[now.getDay()],
  }
}

export default function App() {
  const [{ time, date }, setNow] = useState(() => format(new Date()))
  const [quote] = useState(() => quotes.at(Math.floor(Math.random() * quotes.length)))

  useEffect(() => {
    const update = () => setNow(format(new Date()))
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div id="time">{time}</div>
      <div id="date">{date}</div>
      <div id="quote">{quote}</div>
    </>
  )
}
