import '../styles/global.scss'

import { Header } from '../components/Header'
import style from '../styles/app.module.scss'
import { Player } from '../components/Player'

function MyApp({ Component, pageProps }) {
  return (
    <div className={style.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player />
    </div>
  )
}

export default MyApp
