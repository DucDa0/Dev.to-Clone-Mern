import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';

// action
import { editPost } from '../../actions/post';

// component
import Guide from './Guide';
import Image from './Image';
import CoverImage from './CoverImage';
import TagsModal from './TagsModal';

// others
import { MarkdownPreview } from 'react-marked-markdown';
import { Loader } from '../loader/Loader';

// api
import api from '../../utils/api';

function PostEdit({ editPost, match }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(false);
  const [write, setWrite] = useState(false);
  const [guide, setGuide] = useState(false);
  const [image, setImage] = useState(false);
  const [tagsStatus, setTagsStatus] = useState(false);
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      const res = await api.get(`/posts/edit/${match.params.id}`);
      const { title, content, coverImage, tags } = res.data;
      if (tags.length > 0) {
        let tags_convert = tags.map((item) => ({
          id: item._id,
          text: item.tagName,
        }));
        localStorage.setItem('tags', JSON.stringify(tags_convert));
      }
      setTitle(title);
      setContent(content);
      localStorage.setItem('Cover_Image', coverImage);
      setLoading(false);
    }
    getData();
  }, [match.params.id]);

  return loading ? (
    <Loader size={46} isButton={false} />
  ) : (
    <div className='editor container'>
      <div className='editor-container'>
        {guide && <Guide setGuide={setGuide} />}
        {image && <Image setImage={setImage} />}
        {coverImage && <CoverImage setCoverImage={setCoverImage} />}
        {tagsStatus && <TagsModal setTagsStatus={setTagsStatus} />}
        {!write && (
          <div className='editor-container__wrap'>
            <button
              onClick={() => setCoverImage(true)}
              className='btn btn-light my cover-image__btn'
            >
              Add cover image
              <i style={{ marginLeft: '10px' }} className='fas fa-images'></i>
            </button>
            <form
              className='editor-form'
              onSubmit={async (e) => {
                e.preventDefault();
                setPublish(true);
                let cover_image = localStorage.getItem('Cover_Image');
                let tag_data = JSON.parse(localStorage.getItem('tags'));
                await editPost(match.params.id, {
                  title,
                  coverImage: !cover_image ? '' : cover_image,
                  content,
                  tags: !tag_data ? [] : tag_data,
                });
                setPublish(false);

                localStorage.removeItem('tags');
                localStorage.removeItem('Cover_Image');
              }}
            >
              <textarea
                className='editor-title'
                placeholder='Title...'
                name='title'
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />

              <textarea
                className='editor-main'
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                placeholder='You will use markdown to write your post, see the guide in right side...'
                name='content'
                required
                value={content}
              />

              {!publish ? (
                <input
                  type='submit'
                  className='btn btn-dark my-1'
                  value='Save'
                />
              ) : (
                <Loader size={36} isButton={true} />
              )}
            </form>
          </div>
        )}
        {write && (
          <div className='editor-container__wrap'>
            <div className='post-preview'>
              <p style={{ margin: '0' }}>Preview</p>
            </div>
            <div className='preview result-area'>
              <MarkdownPreview value={content} />
            </div>
          </div>
        )}
        <div className='side-action__wrap'>
          <div className='side-action__content'>
            <button
              style={{ marginTop: '0' }}
              className='btn btn-light btn-new-feed'
              onClick={() => setWrite(!write)}
            >
              {write ? (
                <i className='far fa-edit'></i>
              ) : (
                <i className='fas fa-eye'></i>
              )}
            </button>
            <button
              onClick={() => setImage(true)}
              className='btn btn-light btn-new-feed'
            >
              <i className='fas fa-images'></i>
            </button>

            <button
              className='btn btn-light btn-new-feed'
              onClick={() => setGuide(true)}
            >
              <i className='fab fa-glide'></i>
            </button>
            <button
              className='btn btn-light btn-new-feed'
              onClick={() => setTagsStatus(true)}
            >
              <i className='fas fa-tags'></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
PostEdit.propTypes = {
  editPost: PropTypes.func.isRequired,
};

export default connect(null, { editPost })(PostEdit);
