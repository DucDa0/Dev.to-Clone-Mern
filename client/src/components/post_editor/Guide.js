import React from 'react';
import { MarkdownPreview } from 'react-marked-markdown';

const Guide = ({ setGuide }) => {
  return (
    <div className='backdrop'>
      <div className='child guide-markdown close-action'>
        <button
          onClick={() => setGuide(false)}
          className='btn btn-light btn-hover btn-modal-close'
        >
          <i style={{ color: '#363c44' }} className='fas fa-times' />
        </button>
        <h3 className='text-dark'>Some common markdown</h3>
        <table>
          <tbody>
            <tr>
              <td># Header</td>
              <td>H1 Header</td>
            </tr>
            <tr>
              <td>###### Header</td>
              <td>H6 Header</td>
            </tr>
            <tr>
              <td>*italics* or _italics_</td>
              <td>
                <i>italics</i>
              </td>
            </tr>
            <tr>
              <td>**bold**</td>
              <td>
                <b>bold</b>
              </td>
            </tr>
            <tr>
              <td>[Link](https://...)</td>
              <td>
                <a href='#!'>link</a>
              </td>
            </tr>
            <tr>
              <td>* item 1</td>
              <td>
                <li>item 1</li>
              </td>
            </tr>
            <tr>
              <td>{'>'} quoted text</td>
              <td>
                <MarkdownPreview value={'> quoted text'} />
              </td>
            </tr>
            <tr>
              <td>`inline code`</td>
              <td>
                <MarkdownPreview value={'`inline code`'} />
              </td>
            </tr>
            <tr>
              <td>```{'(*)prefix '} code block```</td>
              <td>
                <MarkdownPreview value={'code block'} />
              </td>
            </tr>
          </tbody>
        </table>
        <p className='prefix'>The (*)prefix can be: js, c++, c#,...</p>
        <p>
          You can see full document about markdown{' '}
          <a
            rel='noopener noreferrer'
            href='https://www.markdownguide.org/cheat-sheet/'
            target='_blank'
            style={{ color: '#3b49df' }}
          >
            here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Guide;
