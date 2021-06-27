import {useHistory, useParams} from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { Button } from '../components/Button';
// import { ApresentationButton } from '../components/ApresentationButton'
import { Question } from '../components/Question/index';
import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';

import { database } from '../services/firebase';
import { useState } from 'react'
import Modal from 'react-modal';


type RoomParams = {
  id: string;
}

export function AdminRoom(){
  // const user = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const {title, questions} = useRoom(roomId);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalQuestion, setModalQuestion] = useState(0);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string){
    if( window.confirm('Tem certeza que deseja excluir essa pergunta?') ){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    }); 
  }

  function countModalQuestionsNext(){

    if(questions.length-1 > modalQuestion){
      setModalQuestion(modalQuestion+1)
    }else{
      setModalQuestion(0)
    }
  }
  function countModalQuestionsprevious(){
    if(modalQuestion > 1){
      setModalQuestion(modalQuestion-1)
    }else{
      setModalQuestion(0)
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div id = "header-button">
            <RoomCode code={roomId}/>
            <Button id="encerrar" isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} Perguntas</span>}
          <div className="apresentation-mode">
            <button id="apresentation-button"  onClick={() => setIsModalVisible(true)}> Modo Apresentação </button>
          </div>
        </div>
          <div className="question-list">
            {questions.map(question => {
              return (
                <Question 
                key = {question.id}
                content = {question.content}
                author = {question.author}
                isAnswered = {question.isAnswered}
                isHighlighted = {question.isHighlighted}
                >

                  {!question.isAnswered && (
                    <>
                      <button
                      type="button"
                      onClick={() => handleQuestionAsAnswered(question.id)}
                      >
                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleHighlightQuestion(question.id)}
                      >
                        <img src={answerImg} alt="Dar destaque a pergunta" />
                      </button>
                  </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                </Question>
              );
            })}
          </div>
          <Modal 
          isOpen = {isModalVisible}
          onRequestClose = {() => setIsModalVisible(false)}
          className="apresentation-modal"
          >
            <Button id= "modal-close-button" onClick= {() => setIsModalVisible(false)}>Sair</Button>
            <div className="box-question">
            <Button id="left-arrow" onClick={countModalQuestionsprevious}>Anterior</Button>
              <div className="question-list-modal">
                {questions.length>0 ? 
                  <Question 
                    key = {questions[modalQuestion].id}
                    content = {questions[modalQuestion].content}
                    author = {questions[modalQuestion].author}
                    isAnswered = {questions[modalQuestion].isAnswered}
                    isHighlighted = {questions[modalQuestion].isHighlighted}
                    >

                      {!questions[modalQuestion].isAnswered && (
                        <>
                          <button
                          type="button"
                          onClick={() => handleQuestionAsAnswered(questions[modalQuestion].id)}
                          >
                            <img src={checkImg} alt="Marcar pergunta como respondida" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleHighlightQuestion(questions[modalQuestion].id)}
                          >
                            <img src={answerImg} alt="Dar destaque a pergunta" />
                          </button>
                      </>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(questions[modalQuestion].id)}
                      >
                        <img src={deleteImg} alt="Remover pergunta" />
                      </button>
                    </Question>
                 : <h2>Nenhuma Pergunta encontrada</h2>}
              </div>
                <Button id="right-arrow" onClick={countModalQuestionsNext}>Proxima</Button>
            </div>
          </Modal>
      </main>
    </div>

  );
}