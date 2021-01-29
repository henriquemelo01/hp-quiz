
import React, { useEffect } from 'react';
import db from '../db.json';
import QuizBackground from '../src/components/QuizBackground/index.js';
import QuizImg from '../src/components/QuizImg/index.js';
import QuizContainer from '../src/components/QuizContainer/index.js';
import Widget from '../src/components/Widget/index.js';
import Alternatives from '../src/components/QuizAlternatives/index.js';
import BtnConfirm from '../src/components/BtnConfirmar/index.js'
import LinkHome from '../src/components/Link/index.js'
import { useRouter } from 'next/router';



function QuizResult({results}) {

  const router = useRouter();

  return (
    <div>
      <Widget.Header>
        <h1>Resultado</h1>
      </Widget.Header>
      <Widget.Content>
        <h1>Mandou bem, {db.name}</h1>
        <h2>Você marcou {results.filter((x) => x).length} pontos</h2>
        <ul>
          {results.map((result,index) => <li key = {`result__${result}`}>Pergunta {index + 1}: {result === true ? "Acertou" : "Errou"}</li>)}
        </ul>
      </Widget.Content>
      <LinkHome onClick = {() => router.push("/")}>Play Again</LinkHome>
    </div>
  )
}

function Loading () {
  return (
    <div>
      <Widget.Header>
        <h1>Loading...</h1>
      </Widget.Header>
      <Widget.Content>
        <p> LOADING -|- </p>
      </Widget.Content>
    </div>
  )
}


function Quiz ({addResult, setScreenState}) {
  const [indexQuestion, setIndex] = React.useState(0);
  const question = db.questions[indexQuestion];
  const answerIndex = question.answer;
  const totalQuestions = db.questions.length;
  const [statusQuiz, setStatusQuiz] = React.useState("Playing"); // "Playing", Acerto , Erro 
  const [userAnswer, setUserAnswer] = React.useState(undefined); // select 

  let alternatives;
  let alternativeNum;

  const nextQuestion = function (e) {
    e.preventDefault();
    setIndex(indexQuestion + 1);
    setStatusQuiz("Playing");
    if (!alternatives) return ;
    alternatives.forEach((alternative) => alternative.setAttribute("disabled", false))
  }
    

  return (
    <div>
        <Widget.Header>
            <h1>Pergunta {indexQuestion + 1} de {db.questions.length}</h1>
        </Widget.Header>
        <img
          alt = "Descrição"
          style = {{
            width: "100%",
            height: "180px",
            objectFit: "cover",
          }}
          src = {question.image}
        />
        {/* <QuizImg backgroundImage={question.image} /> */}
        <Widget.Content>
            <form onClick = {function (e) {
                e.preventDefault();
                alternatives = e.target.closest("form").querySelectorAll("button");
        
                // Id evento de click no botão 
                const alternative = e.target.closest("button");

                if (!alternative) return;

                alternativeNum = Number(alternative.getAttribute("id"));
                setUserAnswer(alternativeNum);
                
                if (statusQuiz !== "Playing") return;    
                const isAnswerCorrect = alternativeNum === answerIndex;
                addResult(isAnswerCorrect);
                
                // Se jogador Estiver jogando ou seja não selecionou nenhuma alternativa

                if (alternativeNum === answerIndex)
                {
                  setStatusQuiz("Acerto")
                }
                
                if (alternativeNum !== answerIndex)
                setStatusQuiz("Erro");

                // Terminou as Questões
                if (!(indexQuestion + 1 < totalQuestions))
                  setTimeout(() => setScreenState(screenStatus.result),1500);
              
              
             }}>
                <h2>{question.title}</h2>
                <p>{question.description}</p>
                {/* answerInder = correctAnswer  */}
                {(indexQuestion < totalQuestions) && <Alternatives question = {question} statusQuiz = {statusQuiz} answerIndex = {answerIndex} userAnswer = {userAnswer}/>}
                {/* Renderizar Botão quando o jogador selecionar  */}
                {(statusQuiz !== "Playing" && (indexQuestion + 1 < totalQuestions)) && <BtnConfirm onClick = {nextQuestion}>Next</BtnConfirm>}
            </form>
        </Widget.Content>
    </div>
  )
};

// Estados da tela 
const screenStatus = {
  loading: "LOADING",
  quiz: "QUIZ",
  result: "RESULT",
}


// Renderizar Página
export default function QuizPage() {
    const [screenState, setScreenState] = React.useState(screenStatus.loading); // Inicio: screenStatus.loading 
    const [results, setResult] = React.useState([]); // Array de resultados  
    const router = useRouter();

    // React Hook - useEffect(callBack, [dependencias]) : A call back é executada quando uma variável muda, caso não tenha nenhuma depencia a call back só será executada uma única vez. 
    function addResult(result) {
      // Equivalente a results.push(result) setResult(results) , entretanto quando usamos a expressao abaixo, criamos um novo results e não o modificamos
      setResult([...results, result]) // cria um novo array inserindo todos os dados que já existiam e insere o novo resultado
    }

    React.useEffect(() => {
      setTimeout(() => setScreenState(screenStatus.quiz), 1100);
    },[])

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <Widget>
            {/* Renderização Condicionada */}
            {screenState === "LOADING" && <Loading/>}
            {screenState === "QUIZ" && <Quiz results = {results} addResult = {addResult} setScreenState = {setScreenState} />}
            {screenState === "RESULT" && <QuizResult results = {results} />}
        </Widget>
      </QuizContainer>
    </QuizBackground>
  );
}

// Hook: São formas que o react prove para gnt, para biblioteca e o proprio react darem acesso a informações, coisas que acontecem quando um dado é pegado pelo servidor


// React.useState

/*
 const [num,setNum] = React.useState(0), num = 0  (estado inicial)
 setNum(0) -> Muda valor da variável num + renderiza página novamente. Equivalente a setNum(value) + document.element.textContent = num

*/

// React.useEffect(callBack, [depencias]); //
// Obs: {} só podemos colocar expressoes que retornam algum valor - Ex: Operador ternario, && *, Map, filter, vars..