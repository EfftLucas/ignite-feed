import { useState, SyntheticEvent } from 'react';

import { Avatar } from './Avatar';
import { Comment } from './Comment';

import { format, formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './Post.module.css';

interface PostProps {
  author: Author,
  content: Content[],
  publishedAt: Date
}
interface Author {
  name: string;
  avatarUrl: string;
  role: string;
}
interface Content {
  type: 'paragraph' | 'link';
  content: string;
}

export function Post({ author, publishedAt, content }: PostProps) {
  const [newCommentText, setNewCommentText] = useState('')

  const [comments, setComments] = useState([
    'Post muito bacana',
  ])

  const publishedDateFormatted = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  })

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  })

  function deleteComment(commentToDelete: string) {

    const commentsWithoutDeletedOne = comments.filter(comment => {
      return comment !== commentToDelete;
    })
    setComments(commentsWithoutDeletedOne);
  }

  function handleNewCommentInvalid(event: SyntheticEvent) {
    const target = event.target as typeof event.target & {
      setCustomValidity: (text: string) => void;
    };
    target.setCustomValidity('Esse campo é obrigatório');
  }

  const isNewCommentEmpty = newCommentText.length === 0;
  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatarUrl} />

          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time title={publishedDateFormatted} dateTime={publishedAt.toISOString()}>{publishedDateRelativeToNow}</time>
      </header>

      <div className={styles.content}>
        {content.map(line => {
          if (line.type === 'paragraph') {
            return <p key={line.content}>{line.content}</p>;
          } else if (line.type === 'link') {
            return <p key={line.content}><a href="#">{line.content}</a></p>
          }
        })}
      </div>


      <form 
        onSubmit={(event: SyntheticEvent) => {
          event.preventDefault();          
          setComments([...comments, newCommentText]);
          setNewCommentText('');
        }} 
        className={styles.commentForm}>
        <strong>Deixe seu feedback</strong>

        <textarea
        name='comment'
        placeholder='Deixe seu feedback'
        value={newCommentText}
        onChange={event => {
          event.target.setCustomValidity('');
          setNewCommentText(event.target.value)
        }}
        onInvalid={handleNewCommentInvalid}
        required
        >
        </textarea>
        <footer>
          <button type='submit' disabled={isNewCommentEmpty}>Comentar</button>
        </footer>
      </form>
      <div className={styles.commentList}>
        {comments.map(comment => {
          return <Comment key={comment} content={comment} onDeleteComment={deleteComment}/>
        })}
      </div>
    </article>
  )
}