import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// action
import { getWriteTags } from '../../actions/tags';

// component
import { TagsInput } from './TagsInput';

// redux
import { connect } from 'react-redux';

const TagsModal = ({ setTagsStatus, getWriteTags, tags }) => {
  useEffect(() => {
    getWriteTags();
  }, [getWriteTags]);

  return (
    <div className='backdrop'>
      <div className='child tags-modal close-action'>
        <button
          onClick={() => setTagsStatus(false)}
          className='btn btn-light btn-hover btn-modal-close'
        >
          <i style={{ color: '#363c44' }} className='fas fa-times' />
        </button>
        <h3 className='text-dark my-1'>You can add up to 4 tags</h3>
        <span>Tag must be lower case, no space and no special characters</span>
        {tags && <TagsInput _suggestions={tags} />}
      </div>
    </div>
  );
};
TagsModal.propTypes = {
  getWriteTags: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
};
const mapStateToProps = (state) => ({
  tags: state.tags.tags_write,
});
export default connect(mapStateToProps, { getWriteTags })(TagsModal);
