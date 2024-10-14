'use client'
import { createContext, useContext, useState } from "react";
import words from "./spelling-wye-words";


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

  const letters = {keyLetter: "O", ringLetters: ["T", "I", "H", "N", "L", "B"]}
  const wordList = words.split("\n")
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [foundWords, setFoundWords] = useState([""])

  const checkWord  = () => {
    //check for minimum length
    if (currentAnswer.length < 4) {
      alert("word must be length 4 or longer")
      setCurrentAnswer("")
      return
    }

    //check for correct use of letters, must contain key Letter, must only ccontain the 7 included letters
    if (!currentAnswer.includes(letters.keyLetter)) {
      alert(`word must contain the letter "${letters.keyLetter}"`)
      setCurrentAnswer("")
      return
    }


    //check that word is a real word, call a dictionary API
    //if we end up running into API limir problems maybe we can cache this list (it could be too huge though)
    //we could also cache any words that are scored so we don't have to make a call for them for another user
    //LOL neermind instead of calling an API i got a word list
    if (!wordList.includes(currentAnswer.toLowerCase())){
      alert(`As far as we can tell "${currentAnswer}" is not a word. Sorry!`)
      console.log(wordList)
      setCurrentAnswer("")
      return
    }
    if (foundWords.includes(currentAnswer)){
      alert(`"${currentAnswer}" has already been found`)
      setCurrentAnswer("")
      return
    }

    //calculate score
    // 4 letters - 1 point, 5+ letters - number of letters used points, pangolins, regular score + 7 additional points?
    const wordScore = currentAnswer.length ==4? 1: currentAnswer.length
    setScore(score + wordScore)

    // add word to found list
    setFoundWords([...foundWords, currentAnswer])

    alert(`submitted "${currentAnswer}". scoring ${wordScore} points`)
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


      </main>
    </div>
    </AnswerContext.Provider>
  );
}
