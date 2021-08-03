import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/logo.svg'

import { Question } from '../components/Question/index';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss';
import { useRoom } from '../hooks/useRoom';
import imageDelete from '../assets/delete.svg'
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const history = useHistory();
  //const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endAt: new Date()
    });

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Remover essa pergunta ?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
          <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>{questions.length} question(s)</span>
          )}
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => { handleDeleteQuestion(question.id) }}
                >
                  <img src={imageDelete} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div >
  );
}