import React, { useState, useRef } from 'react';
import { ProgressBar } from './ProgressBar';
import imageCompression from 'browser-image-compression';
import Compressor from 'compressorjs';
import { toast } from 'react-toastify';

const Image = ({ setImage }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);
  const types = ['image/png', 'image/jpeg', 'image/jpg'];
  const copyToClipboard = (e) => {
    textAreaRef.current.select();
    document.execCommand('copy');
    e.target.focus();
    setCopySuccess('Copied!');
  };
  const changeHandler = async (e) => {
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
  return (
    <div className='backdrop'>
      <div className='child add-image close-action'>
        <button
          onClick={() => setImage(false)}
          className='btn btn-light btn-hover btn-modal-close'
        >
          <i style={{ color: '#363c44' }} className='fas fa-times' />
        </button>
        <h3 style={{ textAlign: 'center' }} className='text-dark my-1'>
          Select your image and copy under text to your editor
        </h3>
        <form>
          <input
            accept='image/*'
            className='btn btn-light'
            type='file'
            style={{ margin: '10px 0', width: '100%' }}
            onChange={changeHandler}
          />
        </form>
        <div style={{ width: '100%' }} className='output'>
          {error && <div className='error'>{error}</div>}
          {file && <div>{file.name}</div>}
          {file && (
            <ProgressBar
              file={file}
              setFile={setFile}
              setImageUrl={setImageUrl}
            />
          )}
        </div>
        {document.queryCommandSupported('copy') && (
          <div style={{ marginBottom: '10px' }}>
            <button className='btn btn-light' onClick={copyToClipboard}>
              Copy
            </button>
            {copySuccess}
          </div>
        )}
        <textarea
          ref={textAreaRef}
          onChange={(e) => setImageUrl(e.target.value)}
          value={imageUrl}
          style={{
            resize: 'none',
            width: '100%',
            height: '100px',
          }}
        />
      </div>
    </div>
  );
};

export default Image;
