import {ReactNode} from 'react';
import cx from 'classnames';

import './styles.scss'
import { bool } from 'prop-types';
import { boolean } from 'yargs';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Question({content, author, children, isAnswered = false, isHighlighted = false}: QuestionProps){
  return(
    <div className={cx(
      'question', 
      {answered: isAnswered},
      {highlighted: isHighlighted && !isAnswered},
      )}
      >
      <p>{content}</p>
      <footer>
        <div className = "user-info">
          <img src={author.avatar} alt={author.name} />
          <span id="span-user">{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  )
}