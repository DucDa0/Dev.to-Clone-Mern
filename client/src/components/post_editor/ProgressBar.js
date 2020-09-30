import React, { useEffect } from 'react';
import useStorage from '../../hooks/useStorage';
import { motion } from 'framer-motion';
export const ProgressBar = ({
  file,
  setFile,
  setImageUrl,
  setImageUpdateUser,
  setCoverImage,
}) => {
  const { url, progress } = useStorage(file);

  useEffect(() => {
    if (url) {
      if (setCoverImage) {
        localStorage.setItem('Cover_Image', url);
      }
      if (setImageUrl) {
        setImageUrl(`![Alt Text](${url})`);
      }
      if (setImageUpdateUser) {
        setImageUpdateUser(url);
      }
      if (setFile) {
        setFile(null);
      }
    }
  }, [url, setFile, setImageUrl, setImageUpdateUser, setCoverImage]);

  return (
    <motion.div
      className='progress-bar'
      initial={{ width: 0 }}
      animate={{ width: progress + '%' }}
    ></motion.div>
  );
};
