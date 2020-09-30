import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { getTags } from '../../actions/tags';

import TagCard from './TagCard';

import { Loader } from '../loader/Loader';

function TagsDashBoard({ tags: { tags, loading }, getTags }) {
  useEffect(() => {
    getTags();
  }, [getTags]);
  return loading || tags.length === 0 ? (
    <Loader size={46} isButton={false} />
  ) : (
    <div className='container'>
      <h1 className='text-dark my-1'>Top tags</h1>
      <div className='tags-dashboard py'>
        {tags.map((tag) => (
          <TagCard key={tag._id} tag={tag} />
        ))}
      </div>
    </div>
  );
}
TagsDashBoard.propTypes = {
  tags: PropTypes.object.isRequired,
  getTags: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  tags: state.tags,
});
export default connect(mapStateToProps, { getTags })(TagsDashBoard);
