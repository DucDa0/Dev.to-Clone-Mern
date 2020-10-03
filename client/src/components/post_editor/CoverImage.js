import React, { useState } from 'react';
import { ProgressBar } from './ProgressBar';
import imageCompression from 'browser-image-compression';
import Compressor from 'compressorjs';
import { toast } from 'react-toastify';

const CoverImage = ({ setCoverImage }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [showImage, setShowImage] = useState(true);
  const types = ['image/png', 'image/jpeg', 'image/jpg'];
  const changeHandler = async (e) => {
    setShowImage(true);
    let selected = e.target.files[0];
    if (selected) {
      let file_size = selected.size;
      if (parseInt(file_size) > 2097152) {
        return toast.error('Image size must be < 2 mb');
      }
    }
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
    };
    if (selected && types.includes(selected.type)) {
      try {
        const compressedFile = await imageCompression(selected, options);
        new Compressor(compressedFile, {
          quality: 0.8,
          success(result) {
            setFile(result);
            setError('');
          },
          error(err) {
            console.log(err.message);
          },
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      setFile(null);
      setError('Plz select an image file (png or jpeg/jpg)');
    }
  };
  const style = {
    backgroundImage: `url(${localStorage.getItem('Cover_Image')})`,
    backgroundColor: '#fff',
    height: '110px',
    width: '250px',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    borderRadius: '5px',
  };
  return (
    <div className='backdrop'>
      <div className='child cover-image close-action'>
        <button
          onClick={() => setCoverImage(false)}
          className='btn btn-light btn-hover btn-modal-close'
        >
          <i style={{ color: '#363c44' }} className='fas fa-times' />
        </button>
        <h3 className='text-dark my-1'>Select your cover image</h3>
        <form>
          <input
            accept='image/*'
            className='btn btn-light'
            type='file'
            style={{ margin: '10px 0', width: '100%' }}
            onChange={changeHandler}
          />
        </form>
        <div style={{ width: '100%', marginBottom: '10px' }} className='output'>
          {error && <div className='error'>{error}</div>}
          {file && <div>{file.name}</div>}
          {file && (
            <ProgressBar file={file} setFile={setFile} setCoverImage={true} />
          )}
        </div>
        {localStorage.getItem('Cover_Image') && (
          <button
            onClick={() => {
              setShowImage(false);
              localStorage.removeItem('Cover_Image');
            }}
            style={{ color: '#dc3545', margin: '0 0 10px 0' }}
            className='btn btn-light'
          >
            Remove
          </button>
        )}
        {localStorage.getItem('Cover_Image') && showImage && (
          <div style={style}></div>
        )}
      </div>
    </div>
  );
};

export default CoverImage;
