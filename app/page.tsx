'use client'
import { createContext, useContext, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import words from "./spelling-wye-words";
import lettersobj from "./letters.json"


type anserContextType = {currentAnswer:string, setCurrentAnswer:(a:string) => void};
const AnswerContext = createContext<anserContextType>({} as anserContextType);

function LetterButton({letter, color = "white"}: {letter:string, color?:string}) { 
  
  const {currentAnswer, setCurrentAnswer} = useContext(AnswerContext)
  return (
    <button
    onClick = {() => {setCurrentAnswer(`${currentAnswer}${letter}`)}}
    style={{backgroundColor:color}}
    className="rounded-full border border-solid border-transparent gap-2 transition-colors text-background text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
    >
      {letter}
    </button>
  )
}



export default function Home() {

  const letters = lettersobj
  const wordList = words.split("\n")
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [foundWords, setFoundWords] = useState([""])
  const [notification, setNotification] = useState({open: false, message: ""})

  const popNotification = (message: string) => {
    setNotification({open: true, message: message})

  }

  const checkWord  = () => {
    //check for minimum length
    if (currentAnswer.length < 4) {
      popNotification("word must be length 4 or longer")
      setCurrentAnswer("")
      return
    }

    //check for correct use of letters, must contain key Letter, must only ccontain the 7 included letters
    if (!currentAnswer.includes(letters.keyLetter)) {
      popNotification(`word must contain the letter "${letters.keyLetter}"`)
      setCurrentAnswer("")
      return
    }


    //check that word is a real word, call a dictionary API
    //if we end up running into API limir problems maybe we can cache this list (it could be too huge though)
    //we could also cache any words that are scored so we don't have to make a call for them for another user
    //LOL neermind instead of calling an API i got a word list
    if (!wordList.includes(currentAnswer.toLowerCase())){
      popNotification(`As far as we can tell "${currentAnswer}" is not a word. Sorry!`)
      setCurrentAnswer("")
      return
    }
    if (foundWords.includes(currentAnswer)){
      popNotification(`"${currentAnswer}" has already been found`)
      setCurrentAnswer("")
      return
    }

    //calculate score
    // 4 letters - 1 point, 5+ letters - number of letters used points, pangolins, regular score + 7 additional points?
    const wordScore = currentAnswer.length ==4? 1: currentAnswer.length
    const isPangolin = [... letters.ringLetters, letters.keyLetter].every(letter => currentAnswer.includes(letter))
    const pangolinScore = (isPangolin? 7: 0)
    
    setScore(score + wordScore + pangolinScore)

    // add word to found list
    setFoundWords([...foundWords, currentAnswer])

    popNotification(`${isPangolin?"Pangolin! ": ""}submitted "${currentAnswer}". scoring ${wordScore} points`)
    setCurrentAnswer("")
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const restrictedKeyboard = (keyDownEvent: any) => {
    if ([...letters.ringLetters, letters.keyLetter].includes(keyDownEvent.key.toUpperCase())){
      setCurrentAnswer(`${currentAnswer}${keyDownEvent.key.toUpperCase()}`)
    }
    if (keyDownEvent.key == "Backspace") {
      setCurrentAnswer(currentAnswer.slice(0,-1))
    }
    if (keyDownEvent.key == "Enter") {
      checkWord()
    }
  }


  return (
    <AnswerContext.Provider value={{currentAnswer, setCurrentAnswer}}>
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <div className="text-align:center">
        <LetterButton letter = {letters.ringLetters[0]}/>
        <LetterButton letter = {letters.ringLetters[1]}/>
      </div>
      <div className="text-align:center">
        <LetterButton letter = {letters.ringLetters[2]}/>
        <LetterButton letter = {letters.keyLetter} color = "cornflowerblue" />
        <LetterButton letter = {letters.ringLetters[3]}/>
      </div>
      <div className="text-align:center">
        <LetterButton letter = {letters.ringLetters[4]}/>
        <LetterButton letter = {letters.ringLetters[5]}/>
      </div>

      <div className="text-align:center">
        <input className="text-background" value={currentAnswer} onKeyDown={restrictedKeyboard}/> 
      </div>
      <div>
        <button onClick={() => {setCurrentAnswer(currentAnswer.slice(0,-1))}}>delete</button>
        
        <button onClick={checkWord}> submit</button>
      </div>

      <label>Score: {score}</label>

      <label> Found List:</label>
      <ul>{foundWords.map((word, index) => (
        <li key={index}> {word}</li>
      ))}</ul>

      <Snackbar
        open={notification.open}
        message={notification.message}
        autoHideDuration={1200}
        onClose={ () => setNotification({open:false, message: notification.message})}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center',}}
      />

      </main>
    </div>
    </AnswerContext.Provider>
  );
}
