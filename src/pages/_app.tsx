import { Header } from '../components/Header'
import { Player } from '../components/Player'
import { PlayerContext } from '../context/PlayerContext'


import '../styles/global.scss'
import style from '../styles/app.module.scss'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {

  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  function play(episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }
  
  function setPlayerState(state: boolean) {
    setIsPlaying(state)
  }

  return (
    <PlayerContext.Provider value={{ 
      episodeList, 
      currentEpisodeIndex, 
      play, 
      isPlaying, 
      togglePlay,
      setPlayerState
    }}>

      <div className={style.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
