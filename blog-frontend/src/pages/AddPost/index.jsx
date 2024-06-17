import React, { useState, useEffect, useRef, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from '../../axios';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './AddPost.module.scss';
import Container from "@mui/material/Container";
export const AddPost = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (error) {
      console.warn('Ошибка при загрузке файла ');
      console.log(error);
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(','));
      });
    }
  }, [id]);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const fields = {
        title,
        imageUrl,
        tags,
        text,
      };
      const { data } = await axios.post('/posts', fields);
      const postId = data._id;
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.warn(error);
      alert('Ошибка при создании статьи');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
<Container> <textarea
        className={styles.editor}
        value={text}
        onChange={onChange}
        placeholder="Введите текст..."
        style={{ height: '400px', width: '100%',margin: '0 auto' , marginTop: '10px' }}
      /></Container>

      <div><br /></div>
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained" disabled={!title || !text || isLoading}>
          Создать
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};

