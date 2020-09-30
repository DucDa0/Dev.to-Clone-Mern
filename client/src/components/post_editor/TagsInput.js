import React, { useState } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { toast } from 'react-toastify';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export const TagsInput = ({ _suggestions }) => {
  const data = _suggestions.map((item) => ({
    id: item._id,
    text: item.tagName,
  }));
  const [tags, setTags] = useState(
    JSON.parse(localStorage.getItem('tags')) || []
  );
  function handleDelete(i) {
    localStorage.setItem(
      'tags',
      JSON.stringify(tags.filter((tag, index) => index !== i))
    );
    setTags(tags.filter((tag, index) => index !== i));
  }

  function handleAddition(tag) {
    if (tags.length === 4) {
      return toast.error('You only can add up to 4 tags');
    }
    localStorage.setItem('tags', JSON.stringify([...tags, tag]));

    let tag_check = JSON.parse(localStorage.getItem('tags'));
    let tag_text = tag_check[tag_check.length - 1].text;
    if (/^[a-zA-Z0-9]*$/.test(tag_text) === false) {
      localStorage.setItem(
        'tags',
        JSON.stringify(
          tags.filter((tag, index) => index !== tag_check[tag_text])
        )
      );
      return toast.error('Tag contains non-ASCII characters or space!');
    }
    if (tag_text !== tag_text.toLowerCase()) {
      localStorage.setItem(
        'tags',
        JSON.stringify(
          tags.filter((tag, index) => index !== tag_check[tag_text])
        )
      );
      return toast.error('Tag must be lower case!');
    }
    setTags([...tags, tag]);
  }

  function handleDrag(tag, currPos, newPos) {
    const _tags = [...tags];
    const newTags = _tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    setTags(newTags);
  }
  return (
    <div className='tags-input'>
      <ReactTags
        maxLength={16}
        minQueryLength={1}
        tags={tags}
        suggestions={data}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        handleDrag={handleDrag}
        delimiters={delimiters}
      />
    </div>
  );
};
